"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GiveLink from "@/components/GiveLink";
import GoalMeter from "@/components/GoalMeter";
import SupplyIcon from "@/components/SupplyIcon";
import type { SupplyItem } from "@/content/supplies";
import { money } from "@/lib/format";

const tints = [
  { text: "text-sea", bg: "bg-sea", soft: "bg-sea/10" },
  { text: "text-gold-dark", bg: "bg-gold", soft: "bg-gold/15" },
  { text: "text-deep", bg: "bg-deep", soft: "bg-deep/10" },
];

function ItemCard({ item, index }: { item: SupplyItem; index: number }) {
  const [qty, setQty] = useState(item.startQty);
  const [mounted, setMounted] = useState(false);
  const tint = tints[index % tints.length];

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 150 + 90 * index);
    return () => clearTimeout(id);
  }, [index]);

  const pct = item.needed === null ? 0 : Math.min(100, Math.round((item.funded / item.needed) * 100));
  const remaining = item.needed === null ? null : item.needed - item.funded;
  const total = qty * item.unitCost;

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/sponsor/${item.id}`}
          aria-label={`${item.name} — full details`}
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint.soft} ${tint.text}`}
        >
          <SupplyIcon kind={item.icon} className="h-7 w-7" />
        </Link>
        <span className="rounded-full bg-sand-dark px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink/70">
          {money(item.unitCost)} each
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl font-bold">
        <Link href={`/sponsor/${item.id}`} className="hover:text-sea">
          {item.name}
        </Link>
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{item.blurb}</p>
      <p className="mt-1.5 flex-1">
        <Link
          href={`/sponsor/${item.id}`}
          className="text-xs font-semibold text-sea hover:underline"
        >
          Full details →
        </Link>
      </p>

      {item.needed !== null ? (
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-ink/60">
            <span>
              {item.funded} of {item.needed} sponsored
            </span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full rounded-full ${tint.bg} transition-all duration-1000 ease-out`}
              style={{ width: mounted ? `${Math.max(pct, 1.5)}%` : "0%" }}
            />
          </div>
          <p className="mt-1.5 text-xs font-medium text-ink/55">
            {item.funded === 0
              ? "Be the first to sponsor one."
              : remaining && remaining > 0
                ? `${remaining} still needed — help finish this one.`
                : "Fully sponsored — praise God!"}
          </p>
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-sand-dark px-3 py-2 text-xs font-medium text-ink/65">
          Every missionary serves unpaid and raises {money(item.unitCost)} to go.
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-ink/15">
          <button
            aria-label="Fewer"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 font-bold text-ink/60 hover:text-sea"
          >
            −
          </button>
          <span className="min-w-8 text-center font-serif text-lg font-bold tabular-nums">
            {qty}
          </span>
          <button
            aria-label="More"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            className="px-3 py-2 font-bold text-ink/60 hover:text-sea"
          >
            +
          </button>
        </div>
        <GiveLink
          href="/give#ways-to-give"
          location="supply_drive"
          fund={item.id}
          className="btn-give flex-1 !px-3 !py-2.5 !text-xs"
        >
          Sponsor · {money(total)}
        </GiveLink>
      </div>
    </div>
  );
}

export default function SupplyDrive({
  items,
  raised,
}: {
  items: SupplyItem[];
  raised: number;
}) {
  return (
    <div>
      <GoalMeter raised={raised} />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
