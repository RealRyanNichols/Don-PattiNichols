"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { supplyDrive } from "@/content/supplies";
import { computeBudget, budgetCsv, DONS_PLAN, usd, type BudgetGroup } from "@/lib/budget";
import { track } from "@/lib/track";

/**
 * MISSION TRIP BUDGET CALCULATOR.
 *
 * Starts on Don's actual Belize plan and lets a team leader change any
 * quantity. Every unit price is his; the maths is in lib/budget.ts. Download
 * gives a CSV that opens in Excel or Sheets. The "logistics share" line is the
 * lesson most first-time teams learn the hard way: moving supplies costs more
 * than a good deal of the supplies.
 */

const GROUPS: { id: BudgetGroup; title: string; note: string }[] = [
  {
    id: "team",
    title: "The team",
    note: "Unpaid volunteers who each raise their own support.",
  },
  {
    id: "supplies",
    title: "What gets given away",
    note: "Every item is handed to someone free of charge.",
  },
  {
    id: "logistics",
    title: "Getting it there",
    note: "Trunks, airline baggage fees, customs and contingency.",
  },
];

export default function BudgetCalculator() {
  const [qty, setQty] = useState<Record<string, number>>(() => ({ ...DONS_PLAN, missionary: 8 }));
  const budget = useMemo(() => computeBudget(qty), [qty]);

  const set = (id: string, v: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(9999, Math.floor(v) || 0)) }));

  function download() {
    const blob = new Blob([budgetCsv(budget)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mission-trip-budget.csv";
    a.click();
    URL.revokeObjectURL(url);
    track("tool_download", { tool: "budget", total: budget.total });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-6">
        {GROUPS.map((g) => (
          <section
            key={g.id}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl font-bold text-ink">{g.title}</h2>
              <p className="font-serif text-xl font-bold text-sea">
                {usd(budget[g.id])}
              </p>
            </div>
            <p className="mt-1 text-sm text-ink/60">{g.note}</p>
            <ul className="mt-4 divide-y divide-ink/5">
              {budget.lines
                .filter((l) => l.group === g.id)
                .map((l) => {
                  const item = supplyDrive.items.find((i) => i.id === l.id)!;
                  return (
                    <li
                      key={l.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 sm:grid-cols-[1fr_7rem_6rem]"
                    >
                      <div className="min-w-0">
                        <Link
                          href={`/sponsor/${l.id}`}
                          className="font-semibold text-ink hover:text-sea"
                        >
                          {l.name}
                        </Link>
                        <p className="text-xs text-ink/55">
                          {usd(l.unitCost)} each
                          {item.needed !== null ? ` · Don's plan: ${item.needed}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center rounded-lg border border-ink/15 bg-sand">
                        <button
                          type="button"
                          aria-label={`Fewer ${l.name}`}
                          onClick={() => set(l.id, l.qty - 1)}
                          className="px-3 py-2 font-bold text-ink/60 hover:text-sea"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={9999}
                          value={l.qty}
                          onChange={(e) => set(l.id, Number(e.target.value))}
                          aria-label={`Quantity of ${l.name}`}
                          className="w-14 bg-transparent text-center font-serif text-lg font-bold tabular-nums focus:outline-none"
                        />
                        <button
                          type="button"
                          aria-label={`More ${l.name}`}
                          onClick={() => set(l.id, l.qty + 1)}
                          className="px-3 py-2 font-bold text-ink/60 hover:text-sea"
                        >
                          +
                        </button>
                      </div>
                      <p className="col-span-2 text-right font-semibold tabular-nums text-ink sm:col-span-1">
                        {usd(l.total)}
                      </p>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-deep p-6 text-white shadow-lg sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Your trip
          </p>
          <p className="mt-2 font-serif text-5xl font-bold tabular-nums">
            {usd(budget.total)}
          </p>
          <dl className="mt-5 space-y-2 border-t border-white/15 pt-4 text-sm">
            {GROUPS.map((g) => (
              <div key={g.id} className="flex justify-between gap-3">
                <dt className="text-white/70">{g.title}</dt>
                <dd className="font-semibold tabular-nums">{usd(budget[g.id])}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 rounded-xl bg-white/10 p-3 text-sm leading-relaxed text-white/85">
            <strong className="text-gold">{budget.logisticsShare}%</strong> of
            this budget is moving supplies rather than buying them. That is the
            line most first-time teams forget.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button type="button" onClick={download} className="btn-give w-full">
              Download as a spreadsheet
            </button>
            <button
              type="button"
              onClick={() => {
                setQty({ ...DONS_PLAN, missionary: 8 });
                track("tool_reset", { tool: "budget" });
              }}
              className="btn-outline w-full !border-white/50 !text-white hover:!bg-white hover:!text-deep"
            >
              Reset to Don&rsquo;s Belize plan
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/55">
            Don&rsquo;s plan: {usd(supplyDrive.goalUsd)} in supplies and logistics plus{" "}
            {usd(1200)} per team member. Team size is yours to set; eight is a
            starting point, not his number.
          </p>
        </div>
      </aside>
    </div>
  );
}
