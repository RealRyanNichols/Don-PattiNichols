"use client";

import { useEffect, useState } from "react";
import type { SupplyItem } from "@/content/supplies";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";
import { recordGiftIntent } from "@/lib/giftIntent";

/**
 * A slim bar that slides up once the reader is most of the way through.
 *
 * The rules that keep this from being obnoxious:
 *   • it does not exist until 55% read — nobody is asked before they've been
 *     given something
 *   • it is a bar, not a modal. It covers no words and blocks nothing.
 *   • it has an X, and once dismissed it stays gone for the rest of the visit
 *   • it says the real price of a real thing, with no countdown and no
 *     "only 3 left"
 *
 * This is the difference between a story someone enjoyed and a story that
 * bought a Bible. It should feel like a hand offered, not a hand out.
 */
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

export default function StickyGive({
  item,
  headline,
}: {
  item: SupplyItem;
  headline: string;
}) {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (gone) return;
    function onScroll() {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      if (scrollable <= 0) return;
      setShow(h.scrollTop / scrollable > 0.55);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [gone]);

  if (gone || !show) return null;

  const qty = item.unitCost >= 50 ? 1 : item.unitCost >= 10 ? 3 : 10;
  const total = Math.round(qty * item.unitCost * 100) / 100;
  const label = qty === 1 ? item.name : `${qty} × ${item.name}`;

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 animate-[fadeIn_260ms_ease-out] border-t border-white/10 bg-deep/95 px-4 py-3 backdrop-blur">
      <div className="container-content flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white sm:text-base">
            {headline}
          </p>
          <p className="text-xs text-white/60">
            {fmt(item.unitCost)} each · given free in Belize
          </p>
        </div>
        <a
          href={paypalDonateUrl(`${label} — Belize Mission`, total)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track("sticky_give_click", { item: item.id, qty, total });
            recordGiftIntent({
              itemId: item.id,
              itemName: item.name,
              quantity: qty,
              amountUsd: total,
            });
          }}
          className="shrink-0 rounded-xl bg-gold px-5 py-3 text-base font-bold text-deep transition hover:bg-gold-dark hover:text-white"
        >
          Give {fmt(total)}
        </a>
        <button
          type="button"
          onClick={() => setGone(true)}
          aria-label="Hide this"
          className="shrink-0 rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
