import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

/**
 * Records a checkout choice, not a completed donation.
 *
 * Intent, not revenue — see lib/giftIntent.ts. Nothing identifying is stored,
 * and the table is readable only by signed-in authors.
 *
 * Acknowledges success only after storage accepts the record. The browser
 * sends this in the background and never waits for it before opening PayPal.
 */
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (raw.length > 4096)
      return NextResponse.json({ ok: false }, { status: 413 });
    let b: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      b = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const qty = b.quantity ?? 1;
    const amount = b.amountUsd ?? null;
    if (
      typeof qty !== "number" ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      qty > 9999 ||
      (amount !== null &&
        (typeof amount !== "number" ||
          !Number.isFinite(amount) ||
          amount < 0.01 ||
          amount > 1_000_000))
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const res = await supabaseInsert("gift_intents", {
      item_id: typeof b.itemId === "string" ? b.itemId.slice(0, 80) : null,
      item_name:
        typeof b.itemName === "string" ? b.itemName.slice(0, 160) : null,
      quantity: qty,
      amount_usd: amount === null ? null : Math.round(amount * 100) / 100,
      monthly: b.monthly === true,
      source_path:
        typeof b.sourcePath === "string" &&
        b.sourcePath.startsWith("/") &&
        !b.sourcePath.startsWith("//")
          ? b.sourcePath.split(/[?#]/, 1)[0].slice(0, 200)
          : null,
    });
    if (!res.ok) {
      console.error("GIFT_INTENT_SAVE_FAILED", { dbStatus: res.status });
      return NextResponse.json({ ok: false }, { status: 503 });
    }
  } catch {
    console.error("GIFT_INTENT_SAVE_FAILED");
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
