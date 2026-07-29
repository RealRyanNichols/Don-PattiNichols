import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

/**
 * Records that someone chose a supply item and headed for PayPal.
 *
 * Intent, not revenue — see lib/giftIntent.ts. Nothing identifying is stored,
 * and the table is readable only by signed-in authors.
 *
 * Always answers 200. A visitor mid-donation must never see an error because
 * our analytics write failed.
 */
export async function POST(req: Request) {
  try {
    const b = await req.json();

    const qty = Number(b.quantity);
    const amount = Number(b.amountUsd);

    await supabaseInsert("gift_intents", {
      item_id: typeof b.itemId === "string" ? b.itemId.slice(0, 80) : null,
      item_name: typeof b.itemName === "string" ? b.itemName.slice(0, 160) : null,
      quantity: Number.isFinite(qty) && qty > 0 ? Math.min(9999, Math.round(qty)) : 1,
      amount_usd:
        Number.isFinite(amount) && amount >= 0 ? Math.min(1_000_000, amount) : null,
      monthly: b.monthly === true,
      source_path:
        typeof b.sourcePath === "string" ? b.sourcePath.slice(0, 200) : null,
    });
  } catch {
    // Swallow deliberately.
  }
  return NextResponse.json({ ok: true });
}
