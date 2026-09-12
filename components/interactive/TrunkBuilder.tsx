"use client";

import { useMemo, useState } from "react";
import { supplyDrive } from "@/content/supplies";
import { usd } from "@/lib/budget";
import { paypalDonateUrl } from "@/lib/paypal";
import { recordGiftIntent } from "@/lib/giftIntent";
import { track } from "@/lib/track";
import ShareButton from "@/components/ShareButton";
import JoinForm from "@/components/JoinForm";

/**
 * BUILD YOUR TRUNK — pick a budget, tap items into a trunk, watch the total.
 *
 * The fun part is the constraint: $25 does not go as far as people think
 * until they see that it is forty-one pairs of reading glasses or ten Bibles.
 * The honest part is the end: "Make it real" opens PayPal with the exact
 * basket in the item name, so the picture a person just built is the gift
 * that actually arrives. Every price is Don's.
 */

const PRESETS = [25, 50, 100, 250];

const shortName = (name: string) =>
  name.replace(/^A |^An /, "").replace("Gospel Tracts (bundle)", "Tract bundle").replace("Pastor & Wife Gift Set", "Pastor gift set").replace("Fly a Trunk to Belize", "Baggage fee").replace("Customs & Contingency Share", "Customs share").replace("Sponsor a Missionary", "Missionary");

export default function TrunkBuilder() {
  const [budget, setBudget] = useState(25);
  const [custom, setCustom] = useState("");
  const [basket, setBasket] = useState<Record<string, number>>({});

  const items = supplyDrive.items.filter((i) => i.id !== "missionary" || budget >= 1200);
  const total = useMemo(
    () =>
      Math.round(
        supplyDrive.items.reduce((s, i) => s + (basket[i.id] ?? 0) * i.unitCost, 0) * 100,
      ) / 100,
    [basket],
  );
  const remaining = Math.round((budget - total) * 100) / 100;
  const count = Object.values(basket).reduce((s, n) => s + n, 0);

  const add = (id: string, cost: number) => {
    if (cost > remaining + 1e-9) return;
    setBasket((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
    track("trunk_add", { item: id });
  };
  const remove = (id: string) =>
    setBasket((b) => {
      const n = (b[id] ?? 0) - 1;
      const next = { ...b };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  const fillWith = (id: string) => {
    const it = supplyDrive.items.find((i) => i.id === id)!;
    const n = Math.floor((remaining + 1e-9) / it.unitCost);
    if (n > 0) setBasket((b) => ({ ...b, [id]: (b[id] ?? 0) + n }));
    track("trunk_fill", { item: id, qty: n });
  };

  const summary = supplyDrive.items
    .filter((i) => basket[i.id])
    .map((i) => `${basket[i.id]} ${shortName(i.name)}`)
    .join(", ");
  const payLabel = `Trunk: ${summary || "your choice"} — Belize Mission`.slice(0, 120);

  return (
    <div className="my-10 rounded-2xl bg-deep p-5 text-white shadow-lg sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Build your trunk</p>
      <h3 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
        Pick a budget. Tap what goes in.
      </h3>
      <p className="mt-2 text-sm text-white/75">
        Every price is from Don&rsquo;s published budget. Everything in the trunk is handed to someone free of charge.
      </p>

      {/* Budget */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setBudget(p);
              setBasket({});
              setCustom("");
            }}
            aria-pressed={budget === p && !custom}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              budget === p && !custom ? "bg-gold text-deep" : "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20"
            }`}
          >
            {usd(p)}
          </button>
        ))}
        <label className="flex items-center rounded-full bg-white/10 pl-3 pr-1 text-sm font-bold ring-1 ring-white/20">
          <span className="text-white/60">$</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={100000}
            value={custom}
            placeholder="custom"
            onChange={(e) => {
              setCustom(e.target.value);
              const v = Math.max(1, Math.min(100000, Number(e.target.value) || 0));
              if (v > 0) {
                setBudget(v);
                setBasket({});
              }
            }}
            aria-label="Custom budget"
            className="w-24 bg-transparent px-2 py-1.5 text-white placeholder:text-white/40 focus:outline-none"
          />
        </label>
      </div>

      {/* Meter */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">
            {usd(total)} packed <span className="text-white/60">of {usd(budget)}</span>
          </span>
          <span className="text-gold">{remaining > 0 ? `${usd(remaining)} left` : "Full!"}</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={Math.min(100, Math.round((total / budget) * 100))} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-[width] duration-300" style={{ width: `${Math.min(100, (total / budget) * 100)}%` }} />
        </div>
      </div>

      {/* Items */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((i) => {
          const n = basket[i.id] ?? 0;
          const can = i.unitCost <= remaining + 1e-9;
          return (
            <div key={i.id} className={`rounded-xl p-3 ring-1 transition ${n > 0 ? "bg-white/15 ring-gold/60" : "bg-white/5 ring-white/10"}`}>
              <p className="text-sm font-bold leading-tight">{shortName(i.name)}</p>
              <p className="text-xs text-white/60">{usd(i.unitCost)} each</p>
              <div className="mt-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  disabled={n === 0}
                  aria-label={`Remove one ${shortName(i.name)}`}
                  className="h-8 w-8 rounded-lg bg-white/10 font-bold disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-6 text-center font-serif text-lg font-bold tabular-nums">{n}</span>
                <button
                  type="button"
                  onClick={() => add(i.id, i.unitCost)}
                  disabled={!can}
                  aria-label={`Add one ${shortName(i.name)}`}
                  className="h-8 w-8 rounded-lg bg-gold font-bold text-deep disabled:opacity-30"
                >
                  +
                </button>
                {can && remaining >= i.unitCost * 2 && (
                  <button
                    type="button"
                    onClick={() => fillWith(i.id)}
                    className="ml-auto text-[11px] font-bold uppercase tracking-wider text-gold hover:underline"
                  >
                    Fill
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* The trunk */}
      <div className="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">In your trunk</p>
        {count === 0 ? (
          <p className="mt-2 text-sm text-white/70">Nothing yet. Tap + on anything above, or &ldquo;Fill&rdquo; to spend it all on one thing.</p>
        ) : (
          <p className="mt-2 font-serif text-lg font-bold leading-snug">
            {summary}
            <span className="text-white/60"> · {usd(total)}</span>
          </p>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={paypalDonateUrl(payLabel, total > 0 ? total : undefined)}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={count === 0}
            onClick={(e) => {
              if (count === 0) {
                e.preventDefault();
                return;
              }
              track("give_click", { location: "trunk_builder", amount: total, items: count });
              recordGiftIntent({ itemId: "trunk-builder", itemName: payLabel, quantity: count, amountUsd: total });
            }}
            className={`btn-give ${count === 0 ? "pointer-events-none opacity-50" : ""}`}
          >
            Make it real · give {usd(total)}
          </a>
          <ShareButton
            title="I packed a mission trunk"
            text={count > 0 ? `I packed ${summary} for Belize with ${usd(total)}. Build yours:` : "Build a mission trunk with real prices:"}
            path="/articles/what-25-dollars-buys-on-a-mission-trip"
            dark
          />
        </div>
        <p className="mt-3 text-xs text-white/50">
          PayPal opens with your exact trunk in the item name. Choose one-time or monthly there. Goes to the next trip.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 text-ink">
        <p className="font-serif text-lg font-bold">See what your trunk becomes.</p>
        <p className="mt-1 text-sm text-ink/70">
          Leave your name and number and Don and Patti will send photographs from the trip your trunk goes on.
        </p>
        <div className="mt-3">
          <JoinForm source="trunk_builder" interest="trunk-builder" askName askPhone offerTexts submitLabel="Send me the photographs" />
        </div>
      </div>
    </div>
  );
}
