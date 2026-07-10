"use client";

import { useEffect, useState } from "react";
import { SUPPLY_GOAL_USD } from "@/content/supplies";
import { money } from "@/lib/format";

/** The trip supply goal thermometer — animates its fill on mount. */
export default function GoalMeter({ raised }: { raised: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(id);
  }, []);

  const pct = Math.min(100, Math.round((raised / SUPPLY_GOAL_USD) * 100));

  return (
    <div className="rounded-2xl bg-deep p-6 text-white sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Trip Supply Goal
          </p>
          <p className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
            {money(raised)}{" "}
            <span className="text-lg font-medium text-white/60">of {money(SUPPLY_GOAL_USD)}</span>
          </p>
        </div>
        <p className="font-serif text-2xl font-bold text-gold">{pct}%</p>
      </div>
      <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-1000 ease-out"
          style={{ width: mounted ? `${Math.max(pct, 1)}%` : "0%" }}
        />
      </div>
      <p className="mt-2 text-sm text-white/70">
        Every item below comes straight from the trip budget. When the bars fill, the trunks fly.
      </p>
    </div>
  );
}
