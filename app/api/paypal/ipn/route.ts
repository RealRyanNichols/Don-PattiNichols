import { NextResponse } from "next/server";
import { hasServiceKey, supabaseServiceRpc } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Funds that designate a specific trip — the recorder credits its raised_usd.
 * The key is the PayPal button's `custom` code; the value is the trip slug.
 */
const TRIP_FUNDS: Record<string, string> = { "belize-trip": "belize-upcoming" };

/** PayPal statuses that ADD money (positive mc_gross). */
const CREDIT_STATUSES = new Set(["Completed", "Canceled_Reversal"]);
/** PayPal statuses that REMOVE money (negative mc_gross) — refunds/chargebacks. */
const DEBIT_STATUSES = new Set(["Refunded", "Reversed"]);

/** PayPal's IPN validation endpoint (override for sandbox). */
function ipnValidationUrl(): string {
  return process.env.PAYPAL_IPN_VALIDATION_URL || "https://ipnpb.paypal.com/cgi-bin/webscr";
}

/**
 * PayPal IPN (Instant Payment Notification). Don enables IPN in PayPal pointing
 * at this URL. On each notification we (1) post the message back to PayPal to
 * confirm it's genuine, (2) check the money landed in the mission's own account
 * in USD, then (3) record it via a single atomic RPC that inserts the donation
 * (idempotent on paypal_txn_id) and credits/debits the designated trip in the
 * SAME transaction — so a donation can never be recorded without its trip
 * credit, and a PayPal retry can never double-count or lose the credit.
 *
 * Refunds/reversals arrive with a negative mc_gross and net the totals back out.
 * Non-USD gifts are ignored (recorded totals are USD) rather than mis-scaled.
 *
 * The fund comes from the PayPal button's `custom` field — one of the codes
 * documented in lib/site.ts. Inert until PAYPAL_RECEIVER_EMAIL + the Supabase
 * service key are set. Responses: 200 for anything handled (recorded, duplicate,
 * ignored); 500 only when a retry would genuinely help (PayPal unreachable, RPC
 * failed) — idempotency makes the retry safe, so a real gift is never dropped.
 */
export async function POST(request: Request) {
  const raw = await request.text();

  const receiver = process.env.PAYPAL_RECEIVER_EMAIL || "";
  if (!receiver || !hasServiceKey()) {
    // Not configured yet — acknowledge so PayPal doesn't retry a no-op.
    return new NextResponse("ok", { status: 200 });
  }

  // 1. Verify authenticity: echo the message back to PayPal; it replies VERIFIED.
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
    console.error("[paypal-ipn] validation postback failed:", err);
    return new NextResponse("retry", { status: 500 });
  }
  if (!verified) {
    console.warn("[paypal-ipn] IPN did not verify with PayPal — ignoring");
    return new NextResponse("ignored", { status: 200 });
  }

  const p = new URLSearchParams(raw);
  const status = p.get("payment_status") || "";
  const receiverEmail = (p.get("receiver_email") || p.get("business") || "").toLowerCase();

  // Money must have landed in the mission's own account.
  if (receiverEmail !== receiver.toLowerCase()) {
    return new NextResponse("ignored", { status: 200 });
  }

  // Only USD affects the (USD) totals — never mis-scale a foreign currency.
  const currency = (p.get("mc_currency") || "").toLowerCase();
  if (currency !== "usd") {
    console.warn(`[paypal-ipn] ignoring non-USD IPN (mc_currency=${currency || "?"})`);
    return new NextResponse("ignored", { status: 200 });
  }

  // Signed amount: credits are positive, refunds/reversals negative.
  const amount = Number(p.get("mc_gross"));
  const isCredit = CREDIT_STATUSES.has(status) && amount > 0;
  const isDebit = DEBIT_STATUSES.has(status) && amount < 0;
  if (!Number.isFinite(amount) || (!isCredit && !isDebit)) {
    return new NextResponse("ignored", { status: 200 });
  }

  const txnId = p.get("txn_id") || "";
  if (!txnId) return new NextResponse("ignored", { status: 200 });

  const fund = p.get("custom") || null; // Don sets the fund key in each button's "custom" field
  const txnType = p.get("txn_type") || "";
  const recurring = txnType === "subscr_payment" || txnType.startsWith("recurring_payment");
  const donorName = [p.get("first_name"), p.get("last_name")].filter(Boolean).join(" ") || null;
  const donorEmail = p.get("payer_email") || null;
  const tripSlug = fund ? (TRIP_FUNDS[fund] ?? null) : null;

  // 3. Record + credit atomically and idempotently in one RPC.
  const rpc = await supabaseServiceRpc("record_paypal_donation", {
    p_txn_id: txnId,
    p_amount: amount,
    p_currency: currency,
    p_fund: fund,
    p_trip_slug: tripSlug,
    p_recurring: recurring,
    p_donor_name: donorName,
    p_donor_email: donorEmail,
  });

  if (!rpc.ok) {
    console.error(
      `[paypal-ipn] record RPC failed (${rpc.status}) for txn ${txnId}:`,
      await rpc.text().catch(() => ""),
    );
    return new NextResponse("retry", { status: 500 });
  }

  const outcome = (await rpc.text().catch(() => "")).replace(/"/g, "").trim();
  return new NextResponse(outcome || "ok", { status: 200 });
}
