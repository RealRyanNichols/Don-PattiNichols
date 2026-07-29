"use client";

import { useState } from "react";
import type { SupplyItem } from "@/content/supplies";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";
import { recordGiftIntent } from "@/lib/giftIntent";

/**
 * A small give-box that sits at the bottom of a story.
 *
 * Three preset quantities and a total that updates as you tap — enough to make
 * the choice concrete ("ten Bibles is twenty-five dollars") without turning the
 * end of a testimony into a shopping cart. No custom quantity field, no upsell,
 * no monthly toggle here; those live on the item's own page for anyone who
 * wants them.
 */

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

export default function SponsorInline({ item }: { item: SupplyItem }) {
  // Round numbers that feel natural for the price. A $2.50 Bible offers
  // 1/5/10; a $100 pastor gift set offers 1/2/3.
  const presets =
    item.unitCost >= 50
      ? [1, 2, 3]
      : item.unitCost >= 10
        ? [1, 3, 5]
        : [5, 10, 25];

  const [qty, setQty] = useState(presets[1]);
  const total = Math.round(qty * item.unitCost * 100) / 100;
  const label = qty === 1 ? item.name : `${qty} × ${item.name}`;
  const url = paypalDonateUrl(`${label} — Belize Mission`, total);

  return (
    <div>
      <div className="flex gap-2" role="group" aria-label={`How many ${item.name}`}>
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setQty(n)}
            aria-pressed={qty === n}
            className={`flex-1 rounded-xl px-3 py-3 text-base font-bold transition ${
              qty === n
                ? "bg-gold text-deep"
                : "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("post_sponsor_click", { item: item.id, qty, total });
          recordGiftIntent({
            itemId: item.id,
            itemName: item.name,
            quantity: qty,
            amountUsd: total,
          });
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-lg font-bold text-deep shadow-sm transition hover:bg-gold-dark hover:text-white"
      >
        Give {fmt(total)}
        <span aria-hidden>→</span>
      </a>

      <p className="mt-2 text-center text-xs text-white/55">
        Secure PayPal — card, bank, or balance.
      </p>
    </div>
  );
}
