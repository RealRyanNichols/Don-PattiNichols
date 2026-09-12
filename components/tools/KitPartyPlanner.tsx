"use client";

import Link from "next/link";
import { useState } from "react";
import { supplyDrive } from "@/content/supplies";
import { usd } from "@/lib/budget";
import PrintButton from "@/components/PrintButton";

/**
 * HYGIENE KIT CHECKLIST & PARTY PLANNER.
 *
 * The contents are Don's list from Behind Every Mission Trip; the price is
 * his ($3). Type a number of kits and the shopping list scales, with the
 * boxes-of-25 count the team uses for the trunk inventory sheet.
 */

const CONTENTS = [
  { item: "Towel", note: "small, quick-dry" },
  { item: "Sewing kit", note: "needle, thread, a few buttons" },
  { item: "Toothbrush", note: "individually wrapped" },
  { item: "Toothpaste", note: "travel size" },
  { item: "Hair tie", note: "" },
  { item: "Lip balm", note: "" },
  { item: "Gospel booklet", note: "in the language people read — Spanish for Belize" },
];

const OPTIONAL = ["Soap", "Nail clippers", "Comb"];

export default function KitPartyPlanner() {
  const [kits, setKits] = useState(100);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const kit = supplyDrive.items.find((i) => i.id === "hygiene-kit")!;
  const n = Math.max(1, Math.min(9999, Math.floor(kits) || 1));
  const boxes = Math.ceil(n / 25);
  const cost = Math.round(n * kit.unitCost * 100) / 100;
  const perTable = Math.ceil(n / 6);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="print:hidden">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
          <label htmlFor="kits" className="block font-serif text-xl font-bold text-ink">
            How many kits will you make?
          </label>
          <div className="mt-3 flex items-center gap-3">
            <input
              id="kits"
              type="range"
              min={10}
              max={600}
              step={10}
              value={Math.min(600, n)}
              onChange={(e) => setKits(Number(e.target.value))}
              className="w-full accent-[#c9962e]"
            />
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={9999}
              value={kits}
              onChange={(e) => setKits(Number(e.target.value))}
              aria-label="Number of kits"
              className="w-24 rounded-lg border border-ink/15 bg-sand px-3 py-2 text-center font-serif text-xl font-bold"
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-sand-dark p-3">
              <p className="font-serif text-2xl font-bold text-deep">{usd(cost)}</p>
              <p className="text-xs text-ink/60">at {usd(kit.unitCost)} a kit</p>
            </div>
            <div className="rounded-xl bg-sand-dark p-3">
              <p className="font-serif text-2xl font-bold text-deep">{boxes}</p>
              <p className="text-xs text-ink/60">boxes of 25</p>
            </div>
            <div className="rounded-xl bg-sand-dark p-3">
              <p className="font-serif text-2xl font-bold text-deep">~{perTable}</p>
              <p className="text-xs text-ink/60">kits per table of 6</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Don&rsquo;s Belize plan calls for 300 kits at {usd(kit.unitCost)} — {usd(300 * kit.unitCost)}. Before you buy, contact Don and Patti so the contents match the trunk inventory sheets that go through customs.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <PrintButton label="Print the checklist" what="kit_checklist" />
            <Link href="/sponsor/hygiene-kit" className="btn-outline">
              Or sponsor kits instead
            </Link>
          </div>
        </div>
      </div>

      <div className="print-sheet">
        <div className="print-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-sea">
            Hygiene kit checklist · {n} kits
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-ink">Shopping list</h2>
          <table className="mt-4 w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/60">
                <th className="py-2 pr-2">Done</th>
                <th className="py-2 pr-2">Item</th>
                <th className="py-2 pr-2 text-right">Qty</th>
                <th className="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {CONTENTS.map((c) => (
                <tr key={c.item} className="border-b border-ink/5">
                  <td className="py-2.5 pr-2">
                    <input
                      type="checkbox"
                      aria-label={`${c.item} bought`}
                      checked={!!checked[c.item]}
                      onChange={(e) => setChecked((s) => ({ ...s, [c.item]: e.target.checked }))}
                      className="h-5 w-5 accent-[#0e6b70]"
                    />
                  </td>
                  <td className="py-2.5 pr-2 font-semibold text-ink">{c.item}</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums">{n}</td>
                  <td className="py-2.5 text-ink/60">{c.note}</td>
                </tr>
              ))}
              {OPTIONAL.map((o) => (
                <tr key={o} className="border-b border-ink/5 text-ink/60">
                  <td className="py-2.5 pr-2">
                    <input
                      type="checkbox"
                      aria-label={`${o} bought`}
                      checked={!!checked[o]}
                      onChange={(e) => setChecked((s) => ({ ...s, [o]: e.target.checked }))}
                      className="h-5 w-5 accent-[#0e6b70]"
                    />
                  </td>
                  <td className="py-2.5 pr-2">{o}</td>
                  <td className="py-2.5 pr-2 text-right tabular-nums">{n}</td>
                  <td className="py-2.5">optional — if donated</td>
                </tr>
              ))}
              <tr>
                <td className="py-2.5 pr-2" />
                <td className="py-2.5 pr-2 font-semibold text-ink">Zip bags</td>
                <td className="py-2.5 pr-2 text-right tabular-nums">{n}</td>
                <td className="py-2.5 text-ink/60">one per kit, sealed</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2" />
                <td className="py-2.5 pr-2 font-semibold text-ink">Boxes</td>
                <td className="py-2.5 pr-2 text-right tabular-nums">{boxes}</td>
                <td className="py-2.5 text-ink/60">25 kits each, labelled with the count</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-8 font-serif text-xl font-bold text-ink">The assembly table</h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink/80">
            <li>One station per item, in the order above. Bags first, booklet last.</li>
            <li>Assemble one item at a time — Don&rsquo;s rule — so every kit is complete.</li>
            <li>Seal the bag. Count into boxes of 25. Write the count on the box.</li>
            <li>Send the finished total to Don and Patti for the trunk inventory sheet.</li>
          </ol>
          <p className="mt-6 border-t border-ink/10 pt-3 text-xs text-ink/50">
            Contents from Don Nichols, Behind Every Mission Trip. Every kit is given to a family free of charge. donandpatti.com/tools/hygiene-kit-party
          </p>
        </div>
      </div>
    </div>
  );
}
