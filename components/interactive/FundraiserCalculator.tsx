"use client";

import { useState } from "react";
import { missionaryCost } from "@/content/support";
import { usd } from "@/lib/budget";
import JoinForm from "@/components/JoinForm";

/**
 * FUNDRAISER GOAL CALCULATOR — how many jars, plates, shirts or car washes
 * it takes to reach a goal, once the cost of each is taken out.
 *
 * The goal defaults to Don's real per-missionary figure. The price and cost
 * fields are YOUR numbers — the presets are only starting points to edit,
 * not claims about what anything sells for.
 */

const PRESETS = [
  { name: "Salsa jars", unit: "jar", price: 8, cost: 3 },
  { name: "Bake sale", unit: "item", price: 3, cost: 1 },
  { name: "Church dinner", unit: "plate", price: 12, cost: 5 },
  { name: "T-shirts", unit: "shirt", price: 20, cost: 9 },
  { name: "Car wash", unit: "car", price: 10, cost: 1 },
  { name: "Yard sale", unit: "sale", price: 400, cost: 0 },
];

export default function FundraiserCalculator() {
  const [goal, setGoal] = useState(missionaryCost.total);
  const [preset, setPreset] = useState(0);
  const [price, setPrice] = useState(PRESETS[0].price);
  const [cost, setCost] = useState(PRESETS[0].cost);
  const [helpers, setHelpers] = useState(6);

  const net = Math.max(0, price - cost);
  const units = net > 0 ? Math.ceil(goal / net) : null;
  const perHelper = units !== null ? Math.ceil(units / Math.max(1, helpers)) : null;
  const unit = PRESETS[preset].unit;
  const field =
    "w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-ink focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/30";

  return (
    <div className="my-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-sea">Goal calculator</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setPreset(i);
                setPrice(p.price);
                setCost(p.cost);
              }}
              aria-pressed={preset === i}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                preset === i ? "bg-sea text-white" : "bg-sand text-ink/70 ring-1 ring-ink/10 hover:ring-sea"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Goal (USD)
            <input type="number" inputMode="numeric" min={1} value={goal} onChange={(e) => setGoal(Math.max(1, Number(e.target.value) || 1))} className={`${field} mt-1`} />
            <span className="mt-1 block text-xs font-normal text-ink/50">{usd(missionaryCost.total)} sends one missionary on the Nichols team.</span>
          </label>
          <label className="block text-sm font-semibold">
            People helping
            <input type="number" inputMode="numeric" min={1} max={500} value={helpers} onChange={(e) => setHelpers(Math.max(1, Math.min(500, Number(e.target.value) || 1)))} className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">
            Price per {unit}
            <input type="number" inputMode="decimal" min={0} step="0.5" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))} className={`${field} mt-1`} />
          </label>
          <label className="block text-sm font-semibold">
            Your cost per {unit}
            <input type="number" inputMode="decimal" min={0} step="0.5" value={cost} onChange={(e) => setCost(Math.max(0, Number(e.target.value) || 0))} className={`${field} mt-1`} />
          </label>
        </div>
        <p className="mt-3 text-xs text-ink/50">Price and cost are your numbers — the presets are starting points to change, not facts about anyone&rsquo;s fundraiser.</p>
      </div>

      <div className="rounded-2xl bg-deep p-6 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">To reach {usd(goal)}</p>
        {units === null ? (
          <p className="mt-3 font-serif text-2xl font-bold">Price has to be higher than cost.</p>
        ) : (
          <>
            <p className="mt-3 font-serif text-5xl font-bold">
              {units.toLocaleString("en-US")} <span className="text-2xl text-white/60">{unit}{units === 1 ? "" : "s"}</span>
            </p>
            <p className="mt-2 text-white/80">
              at {usd(net)} net each ({usd(price)} price minus {usd(cost)} cost).
            </p>
            <p className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
              With {helpers} {helpers === 1 ? "person" : "people"} helping, that is about <strong className="text-gold">{perHelper}</strong> {unit}{perHelper === 1 ? "" : "s"} each.
            </p>
          </>
        )}
        <p className="mt-4 text-xs text-white/50">
          Patti&rsquo;s Money Ministry works exactly this way: she cans it at her own kitchen counter and sells it jar by jar, and every dollar goes to the field.
        </p>
        <div className="mt-5 rounded-2xl bg-white p-4 text-ink">
          <p className="font-serif font-bold">Raising for a trip? Tell Don.</p>
          <p className="mt-1 text-sm text-ink/70">He has raised support for thirteen years of trips and answers questions from other teams.</p>
          <div className="mt-3">
            <JoinForm source="fundraiser_calculator" interest="fundraising" askName askPhone submitLabel="I'm raising for a trip" doneTitle="Got it." doneText="Don will be in touch." />
          </div>
        </div>
      </div>
    </div>
  );
}
