"use client";

import { useState } from "react";
import { supplyDrive, type SupplyItem } from "@/content/supplies";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";
import { recordGiftIntent } from "@/lib/giftIntent";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

/**
 * CHECKOUT PANEL for one supply item — the buy box on its sales page.
 * Quantity picker, live total, live impact line, straight into PayPal with the
 * item name and exact amount pre-filled. One-time or monthly.
 */
export default function SponsorCheckout({ item }: { item: SupplyItem }) {
  const [qty, setQty] = useState(item.startQty);
  const [monthly, setMonthly] = useState(false);

  const total = Math.round(qty * item.unitCost * 100) / 100;
  const label = qty === 1 ? item.name : `${qty} × ${item.name}`;
  // PayPal's donate flow shows its own monthly checkbox; the toggle here just
  // sets expectations. The item name + exact amount are pre-filled either way.
  const url = paypalDonateUrl(`${label} — Belize Mission`, total);

  const remaining = item.needed === null ? null : item.needed - item.funded;
  const pct =
    item.needed === null
      ? 0
      : Math.min(100, Math.round((item.funded / item.needed) * 100));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink/10 sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-3xl font-bold text-ink">
          {fmt(item.unitCost)}
          <span className="ml-1 text-base font-normal text-ink/55">each</span>
        </p>
        {remaining !== null && (
          <p className="text-sm font-semibold text-sea">
            {item.funded} of {item.needed} sponsored
          </p>
        )}
      </div>

      {item.needed !== null && (
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sand-dark">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sea to-gold transition-[width] duration-700"
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-widest text-ink/60">
          How many?
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand-dark text-2xl font-bold text-ink transition hover:bg-sea hover:text-white"
            aria-label="Fewer"
          >
            −
          </button>
          <span className="min-w-[3.5rem] text-center font-serif text-3xl font-bold text-ink">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand-dark text-2xl font-bold text-ink transition hover:bg-sea hover:text-white"
            aria-label="More"
          >
            +
          </button>
          {item.needed !== null && (
            <div className="ml-2 flex flex-wrap gap-1.5">
              {[Math.max(1, Math.round((item.needed ?? 10) / 20)), Math.round((item.needed ?? 10) / 10), Math.round((item.needed ?? 10) / 4)]
                .filter((v, i, a) => v > 0 && a.indexOf(v) === i && v !== qty)
                .slice(0, 3)
                .map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setQty(v)}
                    className="rounded-full bg-sand px-3 py-1.5 text-sm font-semibold text-ink/70 ring-1 ring-ink/10 transition hover:ring-sea"
                  >
                    {v}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-sand p-4">
        <input
          type="checkbox"
          checked={monthly}
          onChange={(e) => setMonthly(e.target.checked)}
          className="h-5 w-5 accent-[#0e6b70]"
        />
        <span className="text-sm leading-snug text-ink/80">
          <strong>Make it monthly.</strong> PayPal will offer a monthly option at
          checkout — steady support is what plans the next trip.
        </span>
      </label>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("sponsor_checkout", {
            item: item.id,
            qty,
            total,
            monthly: monthly ? 1 : 0,
          });
          // Tells Don and Patti what people are choosing to fund. Intent only
          // — PayPal never reports back yet. See lib/giftIntent.ts.
          recordGiftIntent({
            itemId: item.id,
            itemName: item.name,
            quantity: qty,
            amountUsd: total,
            monthly,
          });
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-lg font-bold text-ink shadow-sm transition hover:bg-gold-dark hover:text-white"
      >
        Give {fmt(total)}
        <span aria-hidden>→</span>
      </a>

      <p className="mt-3 text-center text-sm text-ink/55">
        Secure PayPal checkout — card, bank, or PayPal balance.
        <br />
        Every {item.name.toLowerCase().replace(/^an? /, "")} is given away{" "}
        <strong>free of charge</strong>.
      </p>
    </div>
  );
}

/** The photo-forward item card used on the main /sponsor grid. */
export function SponsorCard({
  item,
  index,
  photoUrl,
}: {
  item: SupplyItem;
  index: number;
  photoUrl: string;
}) {
  const remaining = item.needed === null ? null : item.needed - item.funded;
  const pct =
    item.needed === null
      ? 0
      : Math.min(100, Math.round((item.funded / item.needed) * 100));

  return (
    <a
      href={`/sponsor/${item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl"
      onClick={() => track("sponsor_card_click", { item: item.id })}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={`${item.name} — from Don & Patti's mission archive`}
          width={800}
          height={600}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-deep/85 px-3 py-1.5 text-sm font-bold text-gold backdrop-blur">
          {fmt(item.unitCost)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-bold text-ink group-hover:text-sea">
          {item.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/70">
          {item.blurb}
        </p>

        {item.needed !== null ? (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold text-ink/55">
              <span>
                {item.funded} of {item.needed} sponsored
              </span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand-dark">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sea to-gold"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            {remaining === item.needed && (
              <p className="mt-1.5 text-xs text-gold-dark">Be the first.</p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-sea">
            Open-ended — every gift counts
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-sea">
          Sponsor this
          <span aria-hidden className="transition group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}

/** Overall drive thermometer, reused on the sponsor landing page. */
/**
 * The drive thermometer.
 *
 * `raisedUsd` is passed in from the server, where it comes from gifts that
 * actually arrived. It used to be computed from a hard-coded `funded` count in
 * content/supplies.ts that nobody ever updated, so it read $0 forever — even
 * after Ryan gave $6. Real number or nothing.
 */
export function DriveMeter({
  raisedUsd = 0,
  giftCount = 0,
}: {
  raisedUsd?: number;
  giftCount?: number;
}) {
  const raised = raisedUsd;
  const pct = Math.min(100, Math.round((raised / supplyDrive.goalUsd) * 100));
  return (
    <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
      <div className="flex items-baseline justify-between">
        <p className="font-serif text-2xl font-bold text-white">
          {fmt(raised)}{" "}
          <span className="text-base font-normal text-white/70">
            of {fmt(supplyDrive.goalUsd)}
          </span>
        </p>
        <p className="text-sm font-bold text-gold">{pct}%</p>
      </div>
      {giftCount > 0 && (
        <p className="mt-2 text-sm text-white/70">
          {giftCount} {giftCount === 1 ? "gift" : "gifts"} so far. Thank you.
        </p>
      )}
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-[width] duration-1000"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
    </div>
  );
}
