"use client";

import { useState } from "react";
import Link from "next/link";
import { malawiCampaign, type CampaignNeedId } from "@/content/campaigns";
import { paypalDonateUrl } from "@/lib/paypal";
import { giftAmount } from "@/lib/giftAmount";
import { track } from "@/lib/track";
import { recordGiftIntent } from "@/lib/giftIntent";

/**
 * GIVE TO THE MALAWI WELL OR THE MAIZE MILL.
 *
 * The one thing this box exists to guarantee: the designation Don asked for
 * travels WITH the gift. It is written into PayPal's item name, so the donor
 * never has to remember to type "Malawi Water Well" into a note field — which
 * is exactly where a designation gets lost and a gift lands in the general
 * fund.
 *
 * Everyday giving caps at $2,000. Here the cap is $10,000 so a single donor
 * can fund the whole $7,630 well if they are moved to.
 */

const PRESETS = [25, 50, 100, 250];
const MAX = 10_000;

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export default function CampaignGive({
  defaultNeed = "well",
  location,
  dark = false,
}: {
  defaultNeed?: CampaignNeedId;
  location: string;
  dark?: boolean;
}) {
  const [needId, setNeedId] = useState<CampaignNeedId>(defaultNeed);
  const [input, setInput] = useState("50");
  const need =
    malawiCampaign.needs.find((n) => n.id === needId) ??
    malawiCampaign.needs[0];
  const amount = giftAmount(input, MAX);
  const url = amount === null ? null : paypalDonateUrl(need.paypalItem, amount);

  const text = dark ? "text-white" : "text-ink";
  const soft = dark ? "text-white/70" : "text-ink/70";
  const faint = dark ? "text-white/55" : "text-ink/60";

  return (
    <div>
      <fieldset>
        <legend className={`mb-3 text-sm font-semibold ${text}`}>
          What would you like to fund?
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {malawiCampaign.needs.map((n) => (
            <button
              key={n.id}
              type="button"
              aria-pressed={needId === n.id}
              onClick={() => setNeedId(n.id)}
              className={`min-h-12 rounded-lg border px-3 py-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                needId === n.id
                  ? "border-gold bg-gold text-deep"
                  : dark
                    ? "border-white/30 bg-transparent text-white hover:border-gold"
                    : "border-ink/20 bg-white text-ink hover:border-sea"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className={`mb-3 text-sm font-semibold ${text}`}>
          Gift amount (USD)
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={amount === p}
              onClick={() => setInput(String(p))}
              className={`min-h-12 rounded-lg border px-2 py-3 text-base font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                amount === p
                  ? "border-sea bg-sea text-white"
                  : dark
                    ? "border-white/30 text-white hover:border-gold"
                    : "border-ink/20 bg-white text-ink hover:border-sea"
              }`}
            >
              ${p}
            </button>
          ))}
        </div>
        <label
          htmlFor={`campaign-amount-${location}`}
          className={`mt-4 block text-sm font-semibold ${soft}`}
        >
          Or enter an amount
        </label>
        <div
          className={`mt-2 flex items-center rounded-lg border px-4 focus-within:ring-2 focus-within:ring-gold ${
            dark ? "border-white/30 bg-white/5" : "border-ink/25 bg-white"
          }`}
        >
          <span aria-hidden className={`text-lg ${faint}`}>
            $
          </span>
          <input
            id={`campaign-amount-${location}`}
            type="text"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-invalid={amount === null}
            className={`min-h-12 w-full bg-transparent px-3 py-2 text-lg focus:outline-none ${text}`}
          />
          <span className={`text-sm ${faint}`}>USD</span>
        </div>
        {amount === null && (
          <p
            className={`mt-2 text-sm ${dark ? "text-red-200" : "text-red-700"}`}
          >
            Enter $1 to {fmt(MAX)}, with no more than two decimal places.
          </p>
        )}
        {need.costUsd !== null && (
          <button
            type="button"
            onClick={() => setInput(String(need.costUsd))}
            className={`mt-3 text-sm font-semibold underline underline-offset-4 ${
              dark ? "text-gold" : "text-sea"
            }`}
          >
            Fund the whole well: {fmt(need.costUsd)}
          </button>
        )}
      </fieldset>

      {url && amount !== null ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track("give_click", {
              location,
              fund: `malawi-${need.id}`,
              amount,
            });
            recordGiftIntent({
              itemId: `malawi-${need.id}`,
              itemName: need.paypalItem,
              amountUsd: amount,
            });
          }}
          className="btn-give mt-6 w-full text-base sm:text-lg"
        >
          Give {fmt(amount)} to {need.label.replace(/^The /, "the ")}
        </a>
      ) : (
        <button disabled className="btn-give mt-6 w-full opacity-50">
          Enter an amount to continue
        </button>
      )}

      <p className={`mt-3 text-xs leading-relaxed ${faint}`}>
        Opens PayPal checkout for <strong>Donald Nichols</strong>. The gift is
        marked <strong>“{need.checkMemo}”</strong> automatically, so the
        designation goes with it. Don has said every gift is forwarded publicly
        to Wings of Promise.{" "}
        <Link
          href={`${malawiCampaign.path}#by-mail`}
          className={`font-semibold underline underline-offset-2 ${
            dark ? "text-gold" : "text-sea"
          }`}
        >
          Prefer to give to Wings of Promise directly?
        </Link>
      </p>
    </div>
  );
}
