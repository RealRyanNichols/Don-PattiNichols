"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";
import { recordGiftIntent } from "@/lib/giftIntent";
import { giftAmount, giftExample } from "@/lib/giftAmount";

const PRESETS = [10, 25, 50, 100];

export default function GivePicker() {
  const [input, setInput] = useState("25");
  const [fundId, setFundId] = useState("where-needed");
  const fund =
    site.giving.funds.find((f) => f.id === fundId) ?? site.giving.funds[0];
  const max = fund.maxUsd ?? 2000;
  const amount = giftAmount(input, max);
  // A campaign fund carries its own designation (e.g. "Malawi Water Well —
  // forwarded to Wings of Promise") so the gift can't land in a general fund.
  const url =
    amount === null
      ? null
      : paypalDonateUrl(
          fund.designation ?? `${fund.label} — Don & Patti Nichols`,
          amount,
        );

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
      <p className="eyebrow">Give once or make it monthly</p>
      <h2 className="h-display mt-2 text-2xl sm:text-3xl">Choose your gift</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">
        Help Don and Patti bring medical care, practical supplies, and Christian
        ministry to the people they serve.
      </p>
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-ink">
          Gift amount (USD)
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={amount === preset}
              onClick={() => setInput(String(preset))}
              className={`min-h-12 rounded-lg border px-2 py-3 text-lg font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${amount === preset ? "border-sea bg-sea text-white" : "border-ink/20 bg-white text-ink hover:border-sea"}`}
            >
              ${preset}
            </button>
          ))}
        </div>
        <label
          htmlFor="gift-amount"
          className="mt-4 block text-sm font-semibold text-ink/80"
        >
          Or enter an amount
        </label>
        <div className="mt-2 flex items-center rounded-lg border border-ink/25 bg-white px-4 focus-within:ring-2 focus-within:ring-sea">
          <span aria-hidden className="text-lg text-ink/65">
            $
          </span>
          <input
            id="gift-amount"
            type="text"
            inputMode="decimal"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={amount === null}
            aria-describedby={amount === null ? "gift-amount-error" : undefined}
            className="min-h-12 w-full bg-transparent px-3 py-2 text-lg text-ink focus:outline-none"
          />
          <span className="text-sm text-ink/65">USD</span>
        </div>
        {amount === null && (
          <p id="gift-amount-error" className="mt-2 text-sm text-red-700">
            Enter $1 to ${max.toLocaleString("en-US")}, with no more than two
            decimal places.
          </p>
        )}
      </fieldset>
      <label
        htmlFor="gift-fund"
        className="mb-2 mt-5 block text-sm font-semibold text-ink/80"
      >
        Where would you like to help?
      </label>
      <select
        id="gift-fund"
        value={fundId}
        onChange={(event) => setFundId(event.target.value)}
        className="min-h-12 w-full rounded-lg border border-ink/25 bg-white px-3 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sea"
      >
        {site.giving.funds.map((choice) => (
          <option key={choice.id} value={choice.id}>
            {choice.label}
          </option>
        ))}
      </select>
      {amount !== null && (
        <p
          className="mt-4 rounded-lg bg-sand-dark px-4 py-3 text-sm leading-relaxed text-ink/80"
          aria-live="polite"
        >
          {giftExample(amount, fundId)}
        </p>
      )}
      {url && amount !== null ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track("give_click", {
              location: "give_picker",
              fund: fundId,
              amount,
            });
            recordGiftIntent({
              itemId: fundId,
              itemName: fund.designation ?? fund.label,
              amountUsd: amount,
            });
          }}
          className="btn-give mt-6 w-full text-base sm:text-lg"
        >
          Give $
          {amount.toLocaleString("en-US", {
            minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
            maximumFractionDigits: 2,
          })}{" "}
          securely
        </a>
      ) : (
        <button disabled className="btn-give mt-6 w-full opacity-50">
          Enter an amount to continue
        </button>
      )}
      <p className="mt-3 text-center text-sm font-medium text-ink/80">
        Debit or credit card · PayPal
      </p>
      <p className="mt-2 text-center text-xs leading-relaxed text-ink/65">
        Opens PayPal checkout for <strong>Donald Nichols</strong>. Choose
        “Donate with Debit or Credit Card” or use PayPal. Select “Make this a
        monthly donation” there if you want a recurring gift.
      </p>
      <p className="mt-3 text-center text-xs leading-relaxed text-ink/65">
        Your payment details stay with PayPal. A donation is completed only
        after PayPal confirms it.
      </p>
    </div>
  );
}
