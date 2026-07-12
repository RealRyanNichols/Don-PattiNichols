/**
 * Minimal Stripe access over the REST API — no SDK dependency.
 *
 * Only the server-side secret is needed because we use hosted Stripe Checkout
 * (we redirect the donor to the session URL), so there is no client key and no
 * Stripe.js. Giving stays inert until STRIPE_SECRET_KEY is set: `isConfigured`
 * is false and the API route returns a clear "not set up yet" response instead
 * of erroring.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API = "https://api.stripe.com/v1";

export function stripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY || "";
}

export function stripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

/**
 * Verify a Stripe-Signature header. The header is `t=<ts>,v1=<hexHmac>,...`;
 * the signed payload is `${t}.${rawBody}` HMAC-SHA256'd with the endpoint
 * secret. Returns true only on a timing-safe match inside the tolerance window
 * (guards against replay). `nowSec` is injectable for testing.
 */
export function verifyStripeSignature(
  rawBody: string,
  sigHeader: string | null,
  secret: string,
  toleranceSec = 300,
  nowSec?: number,
): boolean {
  if (!sigHeader || !secret) return false;
  let t = "";
  let v1 = "";
  for (const part of sigHeader.split(",")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (k === "t") t = val;
    else if (k === "v1") v1 = val;
  }
  if (!t || !v1) return false;

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`, "utf8").digest("hex");
  let a: Buffer;
  let b: Buffer;
  try {
    a = Buffer.from(expected, "hex");
    b = Buffer.from(v1, "hex");
  } catch {
    return false;
  }
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const now = nowSec ?? Math.floor(Date.now() / 1000);
  return Math.abs(now - Number(t)) <= toleranceSec;
}

export function isConfigured(): boolean {
  return stripeSecretKey().length > 0;
}

export type CheckoutParams = {
  amountCents: number;
  fundKey: string;
  fundName: string;
  recurring: boolean;
  tripSlug?: string;
  origin: string;
};

/**
 * Create a hosted Checkout Session and return its redirect URL. One-time gifts
 * use payment mode; monthly gifts use a subscription with a $/month price built
 * on the fly. The fund (and optional trip) ride along in metadata so the
 * webhook can record the donation and credit a trip.
 */
export async function createCheckoutSession(
  p: CheckoutParams,
): Promise<{ url: string; id: string }> {
  const form = new URLSearchParams();
  form.set("mode", p.recurring ? "subscription" : "payment");
  form.set("success_url", `${p.origin}/give/thank-you?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${p.origin}/give`);
  if (!p.recurring) form.set("submit_type", "donate");
  form.set("billing_address_collection", "auto");

  form.set("line_items[0][quantity]", "1");
  form.set("line_items[0][price_data][currency]", "usd");
  form.set(
    "line_items[0][price_data][product_data][name]",
    `${p.fundName} — ${p.recurring ? "Monthly gift" : "Gift"}`,
  );
  form.set("line_items[0][price_data][unit_amount]", String(p.amountCents));
  if (p.recurring) form.set("line_items[0][price_data][recurring][interval]", "month");

  form.set("metadata[fund]", p.fundKey);
  form.set("metadata[recurring]", p.recurring ? "true" : "false");
  if (p.tripSlug) form.set("metadata[trip_slug]", p.tripSlug);

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Stripe checkout session failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  const session = (await res.json()) as { id: string; url: string };
  return { url: session.url, id: session.id };
}
