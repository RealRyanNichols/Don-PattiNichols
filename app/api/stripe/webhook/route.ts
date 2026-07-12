import { NextResponse } from "next/server";
import { stripeWebhookSecret, verifyStripeSignature } from "@/lib/stripe";
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
 * Stripe webhook. Verifies the signature, then on checkout.session.completed
 * records the donation (idempotently, keyed on the unique stripe_session_id)
 * and, for trip-designated gifts, atomically credits the trip's raised_usd —
 * only on the first delivery, so retries never double-count.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!verifyStripeSignature(raw, sig, stripeWebhookSecret())) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  // Need the service role to write past RLS. Return 500 so Stripe retries until
  // the key is set (rather than silently dropping a real donation).
  if (!hasServiceKey()) {
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }

  const s = (event.data?.object ?? {}) as Record<string, any>;
  const amountUsd = (Number(s.amount_total) || 0) / 100;
  const fund: string | null = s.metadata?.fund ?? null;
  const tripSlug: string | null = s.metadata?.trip_slug ?? null;
  const recurring = s.metadata?.recurring === "true" || s.mode === "subscription";
  const donorName: string | null = s.customer_details?.name ?? null;
  const donorEmail: string | null = s.customer_details?.email ?? s.customer_email ?? null;
  const currency = String(s.currency || "usd").toLowerCase();

  // Resolve the trip id (trips are public-read) for trip-designated gifts.
  let tripId: string | null = null;
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
      // leave tripId null; the donation is still recorded
    }
  }

  // Insert the donation. return=representation lets us tell a fresh insert (201)
  // from a duplicate delivery (409 on the unique stripe_session_id).
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
      stripe_session_id: s.id,
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

  if (insertRes.status === 409) {
    // Duplicate delivery — already recorded and counted.
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (!insertRes.ok) {
    return NextResponse.json({ error: "could not record donation" }, { status: 500 });
  }

  // Freshly recorded — credit the trip exactly once.
  if (tripId && amountUsd > 0) {
    await supabaseServiceRpc("increment_trip_raised", { p_trip_id: tripId, p_amount: amountUsd });
  }

  return NextResponse.json({ received: true });
}
