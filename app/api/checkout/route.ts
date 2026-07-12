import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { createCheckoutSession, isConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

/** Funds that designate a specific trip — the webhook credits its raised_usd. */
const TRIP_FUNDS: Record<string, string> = { "belize-trip": "belize-upcoming" };

const FUND_NAMES = new Map<string, string>(site.giving.funds.map((f) => [f.key, f.name]));

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return bad("Online giving is being set up and will be live here soon.", 503);
  }

  let body: { amount?: number; fund?: string; recurring?: boolean };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request");
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    return bad("Please enter an amount between $1 and $100,000.");
  }
  const fundKey = String(body.fund || "where-needed");
  const fundName = FUND_NAMES.get(fundKey);
  if (!fundName) return bad("Please choose a fund.");
  const recurring = body.recurring === true;

  try {
    const { url } = await createCheckoutSession({
      amountCents: Math.round(amount * 100),
      fundKey,
      fundName,
      recurring,
      tripSlug: TRIP_FUNDS[fundKey],
      origin: new URL(request.url).origin,
    });
    return NextResponse.json({ ok: true, url });
  } catch {
    return bad("We couldn't start checkout just now. Please try again.", 502);
  }
}
