"use client";

import { useState } from "react";
import GiveLink from "@/components/GiveLink";
import { sponsorLabel, type SupplyItem } from "@/content/supplies";
import { money } from "@/lib/format";

const presets = [1, 5, 10, 25];

/** Quantity picker + sponsor CTA for an item's sales page. */
export default function SponsorPurchase({ item }: { item: SupplyItem }) {
  const [qty, setQty] = useState(item.startQty);
  const total = qty * item.unitCost;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-7">
      <p className="eyebrow">{sponsorLabel(item.name)}</p>
      <p className="mt-2 text-sm text-ink/70">
        Choose how many — the total updates as you go.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Quick quantities">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setQty(n)}
            aria-pressed={qty === n}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              qty === n
                ? "bg-sea text-white"
                : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
            }`}
          >
            ×{n}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center rounded-lg border border-ink/15">
          <button
            aria-label="Fewer"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 font-bold text-ink/60 hover:text-sea"
          >
            −
          </button>
          <span className="min-w-8 text-center font-serif text-xl font-bold tabular-nums">
            {qty}
          </span>
          <button
            aria-label="More"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            className="px-4 py-2.5 font-bold text-ink/60 hover:text-sea"
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/55">Your gift</p>
          <p
            className="font-serif text-3xl font-bold tabular-nums text-sea"
            aria-live="polite"
          >
            {money(total)}
          </p>
        </div>
      </div>

      <GiveLink
        href="/give#ways-to-give"
        location="item_page"
        fund={item.id}
        className="btn-give mt-5 w-full"
      >
        Sponsor {qty > 1 ? `${qty} · ` : "· "}
        {money(total)}
      </GiveLink>

      <p className="mt-3 text-center text-xs text-ink/55">
        Online checkout is being connected now — this button walks you to the Ways to Give page,
        where every gift method works today.
      </p>
    </div>
  );
}
