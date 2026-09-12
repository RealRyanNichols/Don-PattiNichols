"use client";

import { useState } from "react";
import { supplyDrive } from "@/content/supplies";
import { missionaryCost } from "@/content/support";
import { usd } from "@/lib/budget";
import { paypalDonateUrl } from "@/lib/paypal";
import { recordGiftIntent } from "@/lib/giftIntent";
import { track } from "@/lib/track";

/**
 * MONTHLY GIVING SLIDER — drag a monthly amount and watch a year of it turn
 * into Bibles, kits, glasses, or months toward one missionary. Every rate is
 * Don's. The PayPal link carries the monthly amount; the donor picks
 * "monthly" at checkout (every Nichols donate link allows it).
 */

const item = (id: string) => supplyDrive.items.find((i) => i.id === id)!;

export default function MonthlyGivingSlider() {
  const [m, setM] = useState(25);
  const year = m * 12;
  const bible = item("bible");
  const kit = item("hygiene-kit");
  const glasses = item("reading-glasses");
  const monthsToMissionary = Math.ceil(missionaryCost.total / m);
  const pct = ((m - 5) / (200 - 5)) * 100;

  const rows = [
    { label: "Bibles", n: Math.floor(year / bible.unitCost), each: bible.unitCost },
    { label: "Hygiene kits", n: Math.floor(year / kit.unitCost), each: kit.unitCost },
    { label: "Pairs of reading glasses", n: Math.floor(year / glasses.unitCost), each: glasses.unitCost },
  ];
  const max = rows[2].n;

  return (
    <div className="my-10 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-sea">Try a monthly amount</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-5xl font-bold text-deep">{usd(m)}</span>
        <span className="text-ink/60">a month</span>
        <span className="ml-auto font-semibold text-ink/70">{usd(year)} a year</span>
      </div>
      <input
        type="range"
        min={5}
        max={200}
        step={5}
        value={m}
        onChange={(e) => setM(Number(e.target.value))}
        aria-label="Monthly amount"
        className="mt-4 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gold [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow"
        style={{ height: 10, background: `linear-gradient(to right, #c9962e 0%, #c9962e ${pct}%, #e9e4d8 ${pct}%, #e9e4d8 100%)` }}
      />
      <div className="mt-1 flex justify-between text-xs text-ink/50">
        <span>$5</span>
        <span>$200</span>
      </div>

      {/* one year, three ways — a single-series bar set, direct-labelled */}
      <div className="viz mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-semibold text-ink">{r.label}</span>
              <span className="text-ink/60">
                <strong className="text-ink">{r.n.toLocaleString("en-US")}</strong> a year at {usd(r.each)}
              </span>
            </div>
            <div className="mt-1 h-4 overflow-hidden rounded-r bg-transparent">
              <div className="h-full rounded-r bg-[var(--viz-series-1)] transition-[width] duration-300" style={{ width: `${Math.max(1.5, (r.n / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-xl bg-sand-dark p-4 text-sm leading-relaxed text-ink/80">
        Or, kept together: <strong>{usd(m)} a month sponsors one missionary in {monthsToMissionary} {monthsToMissionary === 1 ? "month" : "months"}</strong> — {usd(missionaryCost.total)} of airfare, lodging, meals and ground transport for an unpaid volunteer.
      </p>

      <a
        href={paypalDonateUrl(`${usd(m)} monthly — Belize Mission (Don & Patti Nichols)`, m)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("give_click", { location: "monthly_slider", amount: m, monthly: 1 });
          recordGiftIntent({ itemId: "monthly", itemName: `${usd(m)} monthly`, quantity: 1, amountUsd: m, monthly: true });
        }}
        className="btn-give mt-5 w-full text-lg"
      >
        Give {usd(m)} a month
      </a>
      <p className="mt-2 text-center text-xs text-ink/55">
        Tick &ldquo;monthly&rdquo; on the PayPal page. Cancel any time from your PayPal account.
      </p>
    </div>
  );
}
