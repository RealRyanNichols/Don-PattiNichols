import { NextResponse } from "next/server";
import { supplyDrive } from "@/content/supplies";

/**
 * PAYPAL WEBHOOK — how the website finds out that someone gave.
 *
 * Until this existed, PayPal took the money and never told the site. Ryan gave
 * $6 on July 27 2026 and nothing appeared anywhere, because there was no path
 * back. This is that path.
 *
 * DORMANT UNTIL CONFIGURED. It needs four environment variables in Vercel:
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_WEBHOOK_ID
 *   SUPABASE_SERVICE_ROLE_KEY
 * Without them it refuses every request and says so in the logs, rather than
 * quietly writing unverified money into the database. See PAYPAL-SETUP.md.
 *
 * SECURITY: every request is verified against PayPal's own
 * verify-webhook-signature endpoint before a single row is written. This URL is
 * public — anyone can POST to it — so an unverified payload must never be
 * trusted. A forged "gift" would put a false number on a page that Don's
 * supporters are being asked to believe.
 */

export const dynamic = "force-dynamic";

const PAYPAL_API =
  process.env.PAYPAL_ENV === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://rxjsykcbedtyxfvyfyhl.supabase.co";

function config() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missing = [
    !clientId && "PAYPAL_CLIENT_ID",
    !secret && "PAYPAL_CLIENT_SECRET",
    !webhookId && "PAYPAL_WEBHOOK_ID",
    !serviceKey && "SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean) as string[];
  return { clientId, secret, webhookId, serviceKey, missing };
}

/** OAuth token for calling PayPal's API. */
async function paypalToken(clientId: string, secret: string) {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const j = (await res.json()) as { access_token?: string };
  return j.access_token ?? null;
}

/**
 * Ask PayPal whether this payload really came from PayPal. The five transmission
 * headers plus the raw, unmodified body are what get signed — re-serialising the
 * JSON would change the bytes and fail verification, which is why the raw text
 * is passed straight through.
 */
async function verify(
  token: string,
  webhookId: string,
  headers: Headers,
  rawBody: string,
): Promise<boolean> {
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: `{"auth_algo":${JSON.stringify(headers.get("paypal-auth-algo"))},"cert_url":${JSON.stringify(headers.get("paypal-cert-url"))},"transmission_id":${JSON.stringify(headers.get("paypal-transmission-id"))},"transmission_sig":${JSON.stringify(headers.get("paypal-transmission-sig"))},"transmission_time":${JSON.stringify(headers.get("paypal-transmission-time"))},"webhook_id":${JSON.stringify(webhookId)},"webhook_event":${rawBody}}`,
    cache: "no-store",
  });
  if (!res.ok) return false;
  const j = (await res.json()) as { verification_status?: string };
  return j.verification_status === "SUCCESS";
}

/**
 * Work out which supply item a gift was for.
 *
 * The donate links carry a human item name like "25 × Reading Glasses — Belize
 * Mission". Match it back to a real item id so the funding bars are accurate.
 * When nothing matches, the gift is left undesignated rather than guessed at —
 * an unassigned dollar counts toward the total but never inflates a bar.
 */
function matchItem(description?: string | null): { id: string | null; qty: number | null } {
  if (!description) return { id: null, qty: null };
  const text = description.toLowerCase();

  const qtyMatch = text.match(/(\d+)\s*(?:×|x)\s/);
  const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

  // Longest name first, so "Reading Glasses" is not shadowed by "Glasses".
  const items = [...supplyDrive.items].sort((a, b) => b.name.length - a.name.length);
  for (const item of items) {
    if (text.includes(item.name.toLowerCase())) return { id: item.id, qty };
  }
  return { id: null, qty };
}

export async function POST(req: Request) {
  const { clientId, secret, webhookId, serviceKey, missing } = config();

  if (missing.length) {
    console.log(
      JSON.stringify({
        kind: "PAYPAL_WEBHOOK_NOT_CONFIGURED",
        missing,
        note: "Set these in Vercel, then re-send the event from the PayPal dashboard.",
        at: new Date().toISOString(),
      }),
    );
    // 503, not 200: PayPal will retry, so nothing is lost once the keys land.
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const rawBody = await req.text();

  const token = await paypalToken(clientId!, secret!);
  if (!token) {
    console.log(JSON.stringify({ kind: "PAYPAL_TOKEN_FAILED", at: new Date().toISOString() }));
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const genuine = await verify(token, webhookId!, req.headers, rawBody);
  if (!genuine) {
    console.log(
      JSON.stringify({
        kind: "PAYPAL_WEBHOOK_REJECTED",
        reason: "signature did not verify",
        at: new Date().toISOString(),
      }),
    );
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type: string = event.event_type ?? "";
  const r = event.resource ?? {};
  const txnId: string | undefined = r.id;
  const amount = Number(r.amount?.value ?? r.seller_receivable_breakdown?.gross_amount?.value ?? 0);
  const currency: string = r.amount?.currency_code ?? "USD";

  // A refund or reversal writes a negative row rather than deleting the
  // original. The history stays honest and the totals self-correct.
  const isRefund =
    type === "PAYMENT.CAPTURE.REFUNDED" || type === "PAYMENT.CAPTURE.REVERSED";
  const isCapture = type === "PAYMENT.CAPTURE.COMPLETED";

  if (!isCapture && !isRefund) {
    // Acknowledge everything else so PayPal stops retrying it.
    return NextResponse.json({ ok: true, ignored: type });
  }
  if (!txnId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: true, ignored: "no usable amount" });
  }

  const payer = r.payer ?? event.resource?.payer ?? {};
  const description: string | null =
    r.invoice_id ?? r.custom_id ?? r.description ?? r.note_to_payer ?? null;
  const { id: itemId, qty } = matchItem(description);

  const row = {
    paypal_txn_id: isRefund ? `${txnId}:refund` : txnId,
    amount_usd: isRefund ? -Math.abs(amount) : amount,
    currency,
    fund: itemId ?? "Where it is needed most",
    item_id: itemId,
    quantity: qty,
    recurring: Boolean(r.billing_agreement_id || r.supplementary_data?.related_ids?.subscription_id),
    donor_name:
      [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(" ") || null,
    donor_email: payer.email_address ?? null,
    source: "paypal",
    status: "completed",
    note: isRefund ? `Refund of ${txnId}` : null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/donations`, {
    method: "POST",
    headers: {
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey!}`,
      "Content-Type": "application/json",
      // Duplicate transaction id = PayPal retrying a delivery it already made.
      // Ignoring it is what stops one $6 gift being counted three times.
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.log(
      JSON.stringify({
        kind: "PAYPAL_DONATION_WRITE_FAILED",
        txnId,
        amount,
        dbStatus: res.status,
        detail: detail.slice(0, 400),
        at: new Date().toISOString(),
      }),
    );
    // 500 so PayPal retries — better than losing a real gift.
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  console.log(
    JSON.stringify({
      kind: isRefund ? "PAYPAL_REFUND_RECORDED" : "PAYPAL_GIFT_RECORDED",
      txnId,
      amount,
      itemId,
      at: new Date().toISOString(),
    }),
  );
  return NextResponse.json({ ok: true });
}

/** A plain GET makes it easy to confirm the URL is reachable from PayPal. */
export function GET() {
  const { missing } = config();
  return NextResponse.json({
    ok: true,
    endpoint: "paypal-webhook",
    configured: missing.length === 0,
    missing,
  });
}
