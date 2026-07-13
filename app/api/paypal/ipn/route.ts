import { NextResponse } from "next/server";
import {
  hasServiceKey,
  supabaseAnonKey,
  supabaseServiceKey,
  supabaseServiceRpc,
  supabaseUrl,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Funds that designate a specific trip — the IPN credits its raised_usd.
 * The key is the PayPal button's `custom` code; the value is the trip slug.
 */
const TRIP_FUNDS: Record<string, string> = { "belize-trip": "belize-upcoming" };

/** PayPal's IPN validation endpoint (override for sandbox). */
function ipnValidationUrl(): string {
  return process.env.PAYPAL_IPN_VALIDATION_URL || "https://ipnpb.paypal.com/cgi-bin/webscr";
}

/**
 * PayPal IPN (Instant Payment Notification). Don enables IPN in PayPal pointing
 * at this URL. On each notification we (1) post the message back to PayPal to
 * confirm it's genuine, (2) check the money actually landed in the mission's
 * account, then (3) record the donation idempotently and credit the designated
 * trip. Inert until PAYPAL_RECEIVER_EMAIL + the Supabase service key are set.
 *
 * The donation's fund comes from the PayPal button's `custom` field — one of the
 * codes documented in lib/site.ts (fund keys + content/supplies.ts item ids).
 * Responses: 200 for anything handled (recorded, duplicate, or ignored); 500
 * only when a retry would genuinely help (PayPal unreachable, DB write failed),
 * so a real gift is never dropped — idempotency makes the retry safe.
 */
export async function POST(request: Request) {
  const raw = await request.text();

  const receiver = process.env.PAYPAL_RECEIVER_EMAIL || "";
  if (!receiver || !hasServiceKey()) {
    // Not configured yet — acknowledge so PayPal doesn't retry a no-op.
    return new NextResponse("ok", { status: 200 });
  }

  // 1. Verify authenticity: echo the message back to PayPal with the validation
  //    command; PayPal replies VERIFIED or INVALID.
  let verified = false;
  try {
    const verifyRes = await fetch(ipnValidationUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `cmd=_notify-validate&${raw}`,
      cache: "no-store",
    });
    verified = (await verifyRes.text()).trim() === "VERIFIED";
  } catch (err) {
    // Couldn't reach PayPal to validate — let PayPal retry.
    console.error("[paypal-ipn] validation postback failed:", err);
    return new NextResponse("retry", { status: 500 });
  }
  if (!verified) {
    console.warn("[paypal-ipn] IPN did not verify with PayPal — ignoring");
    return new NextResponse("ignored", { status: 200 });
  }

  const p = new URLSearchParams(raw);
  const paymentStatus = p.get("payment_status");
  const receiverEmail = (p.get("receiver_email") || p.get("business") || "").toLowerCase();

  // Only completed payments into the mission's own account count.
  if (paymentStatus !== "Completed" || receiverEmail !== receiver.toLowerCase()) {
    return new NextResponse("ignored", { status: 200 });
  }

  const txnId = p.get("txn_id") || "";
  const amountUsd = Number(p.get("mc_gross")) || 0;
  const currency = (p.get("mc_currency") || "usd").toLowerCase();
  const fund = p.get("custom") || null; // Don sets the fund key in each button's "custom" field
  const txnType = p.get("txn_type") || "";
  const recurring = txnType === "subscr_payment" || txnType.startsWith("recurring_payment");
  const donorName = [p.get("first_name"), p.get("last_name")].filter(Boolean).join(" ") || null;
  const donorEmail = p.get("payer_email") || null;

  if (!txnId || amountUsd <= 0) return new NextResponse("ignored", { status: 200 });

  // Resolve the trip (public read) for trip-designated gifts.
  let tripId: string | null = null;
  const tripSlug = fund ? TRIP_FUNDS[fund] : undefined;
  if (tripSlug) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/trips?slug=eq.${encodeURIComponent(tripSlug)}&select=id`,
        { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` }, cache: "no-store" },
      );
      if (res.ok) {
        const rows = (await res.json()) as { id: string }[];
        tripId = rows[0]?.id ?? null;
      }
    } catch {
      // record the donation anyway
    }
  }

  // Idempotent insert keyed on the unique paypal_txn_id (retried IPNs → 409).
  const key = supabaseServiceKey();
  const insertRes = await fetch(`${supabaseUrl}/rest/v1/donations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      paypal_txn_id: txnId,
      amount_usd: amountUsd,
      currency,
      fund,
      trip_id: tripId,
      recurring,
      donor_name: donorName,
      donor_email: donorEmail,
    }),
    cache: "no-store",
  });

  // Duplicate delivery — already recorded and counted. Not an error.
  if (insertRes.status === 409) return new NextResponse("duplicate", { status: 200 });
  if (!insertRes.ok) {
    console.error(
      `[paypal-ipn] donation insert failed (${insertRes.status}) for txn ${txnId}:`,
      await insertRes.text().catch(() => ""),
    );
    return new NextResponse("retry", { status: 500 });
  }

  // Freshly recorded — credit the trip exactly once.
  if (tripId && amountUsd > 0) {
    const rpc = await supabaseServiceRpc("increment_trip_raised", {
      p_trip_id: tripId,
      p_amount: amountUsd,
    });
    if (!rpc.ok) {
      console.error(`[paypal-ipn] trip credit failed for ${tripId}, txn ${txnId} (${rpc.status})`);
    }
  }
  return new NextResponse("ok", { status: 200 });
}
