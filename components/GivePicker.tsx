"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";

const PRESETS = [10, 25, 50, 100, 250, 500];
const MIN = 1;
const MAX = 2000;

/** What a live amount unlocks — shown under the slider so the gift feels concrete. */
function impactLine(a: number): string {
  if (a >= 1200) return `Sends a missionary to Belize (and ${Math.floor((a - 1200) / 3)} more hygiene kits).`;
  if (a >= 200) return `Flies a full trunk of supplies to Belize, plus ${Math.floor((a - 200) / 2.5)} Bibles.`;
  if (a >= 100) return `A study Bible and gifts for a village pastor and his wife, and more.`;
  if (a >= 25) return `${Math.floor(a / 2.5)} Bibles into eager hands — or a ministry trunk.`;
  if (a >= 5.5) return `A hygiene kit and a Bible for ${Math.floor(a / 5.5)} ${Math.floor(a / 5.5) === 1 ? "person" : "people"}.`;
  if (a >= 3) return `A complete hygiene kit filled with practical necessities.`;
  return `A Bible placed into the hands of someone eager to read God's Word.`;
}

export default function GivePicker() {
  const [amount, setAmount] = useState(50);
  const [fundId, setFundId] = useState(site.giving.funds[0].id);

  const fund = site.giving.funds.find((f) => f.id === fundId) ?? site.giving.funds[0];
  const url = paypalDonateUrl(
    `${fund.label} — Don & Patti Nichols`,
    amount >= MIN ? amount : undefined
  );
  const pct = ((Math.min(MAX, Math.max(MIN, amount)) - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
      <p className="eyebrow">Give Any Amount</p>
      <h2 className="h-display mt-2 text-2xl sm:text-3xl">Choose your gift</h2>

      {/* live amount */}
      <div className="mt-6 text-center">
        <span className="font-serif text-5xl font-bold text-sea sm:text-6xl">
          ${amount.toLocaleString("en-US")}
        </span>
      </div>

      {/* slider */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={Math.min(MAX, amount)}
        onChange={(e) => setAmount(Number(e.target.value))}
        aria-label="Donation amount"
        className="mt-5 w-full cursor-pointer appearance-none rounded-full bg-transparent [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-gold [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:shadow"
        style={{
          height: "10px",
          background: `linear-gradient(to right, #c9962e 0%, #c9962e ${pct}%, #e5ded1 ${pct}%, #e5ded1 100%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-xs text-ink/50">
        <span>${MIN}</span>
        <span>${MAX.toLocaleString("en-US")}+</span>
      </div>

      {/* impact line */}
      <p className="mt-4 rounded-lg bg-sand-dark px-4 py-3 text-center text-sm font-medium text-ink/80">
        {impactLine(amount)}
      </p>

      {/* preset chips */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(p)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              amount === p
                ? "bg-sea text-white"
                : "bg-white text-ink/70 ring-1 ring-ink/15 hover:ring-sea"
            }`}
          >
            ${p}
          </button>
        ))}
        <label className="flex items-center rounded-full bg-white pl-3 pr-1 text-sm font-bold text-ink/70 ring-1 ring-ink/15 focus-within:ring-sea">
          <span className="text-ink/50">$</span>
          <input
            type="number"
            min={MIN}
            max={MAX}
            value={amount}
            onChange={(e) => setAmount(Math.max(MIN, Math.min(MAX, Number(e.target.value) || MIN)))}
            aria-label="Custom amount"
            className="w-20 rounded-full bg-transparent px-1 py-1.5 text-center focus:outline-none"
          />
        </label>
      </div>

      {/* fund selector */}
      <div className="mt-6">
        <label className="mb-2 block text-center text-sm font-semibold text-ink/70">
          Send my gift to
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {site.giving.funds.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFundId(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                fundId === f.id
                  ? "bg-gold text-ink"
                  : "bg-white text-ink/65 ring-1 ring-ink/15 hover:ring-gold"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* give */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("give_click", { location: "give_picker", fund: fundId, amount })}
        className="btn-give mt-6 w-full text-lg"
      >
        Give ${amount.toLocaleString("en-US")} with PayPal
      </a>
      <p className="mt-2 text-center text-xs text-ink/55">
        Secure checkout at PayPal — card, bank, or PayPal balance. Choose one-time or monthly
        there. No account required.
      </p>
    </div>
  );
}
