"use client";

import { useEffect, useState } from "react";
import { supplyDrive, type SupplyItem } from "@/content/supplies";
import { paypalDonateUrl } from "@/lib/paypal";
import { track } from "@/lib/track";

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

/** Tiny line icons — no libraries, no emoji. */
function Icon({ kind, className }: { kind: SupplyItem["icon"]; className?: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {kind === "bible" && (
        <>
          <path {...p} d="M5 4a2 2 0 0 1 2-2h12v18H7a2 2 0 0 0-2 2V4Z" />
          <path {...p} d="M12 6v6M9.5 8.5h5" />
        </>
      )}
      {kind === "kit" && (
        <>
          <rect {...p} x="3" y="8" width="18" height="12" rx="2" />
          <path {...p} d="M9 8V6a3 3 0 0 1 6 0v2M12 11v5M9.5 13.5h5" />
        </>
      )}
      {kind === "glasses" && (
        <>
          <circle {...p} cx="7" cy="14" r="3.5" />
          <circle {...p} cx="17" cy="14" r="3.5" />
          <path {...p} d="M10.5 14h3M3.5 14 2 9M20.5 14 22 9" />
        </>
      )}
      {kind === "sun" && (
        <>
          <circle {...p} cx="12" cy="12" r="4" />
          <path {...p} d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </>
      )}
      {kind === "trunk" && (
        <>
          <rect {...p} x="3" y="7" width="18" height="13" rx="2" />
          <path {...p} d="M3 12h18M9 7V5h6v2M9 12v2M15 12v2" />
        </>
      )}
      {kind === "plane" && (
        <path {...p} d="M10.5 13.5 3 11l1.5-2 6.5 1L16 4.5 18.5 5l-3 6.5 5 1.5-1 2-6-.5-2.5 5H9l1.5-6Z" />
      )}
      {kind === "gift" && (
        <>
          <rect {...p} x="4" y="10" width="16" height="10" rx="1.5" />
          <path {...p} d="M4 10h16M12 10v10M12 10c-4 0-5-2-5-3.5A1.8 1.8 0 0 1 9 5c2 0 3 2.5 3 5 0-2.5 1-5 3-5a1.8 1.8 0 0 1 2 1.5C17 8 16 10 12 10Z" />
        </>
      )}
      {kind === "tract" && (
        <>
          <path {...p} d="M4 5h9v15H4zM13 5h7v15h-7z" />
          <path {...p} d="M7 9h3M7 12h3M16 9h1.5" />
        </>
      )}
      {kind === "shield" && (
        <>
          <path {...p} d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
          <path {...p} d="M12 8v5M9.5 10.5h5" />
        </>
      )}
      {kind === "person" && (
        <>
          <circle {...p} cx="12" cy="8" r="3.5" />
          <path {...p} d="M5 20c1-3.5 3.7-5.5 7-5.5s6 2 7 5.5" />
        </>
      )}
    </svg>
  );
}

const ACCENTS = [
  { text: "text-sea", bg: "bg-sea", soft: "bg-sea/10" },
  { text: "text-gold-dark", bg: "bg-gold", soft: "bg-gold/15" },
  { text: "text-deep", bg: "bg-deep", soft: "bg-deep/10" },
];

function ItemCard({ item, index }: { item: SupplyItem; index: number }) {
  const [qty, setQty] = useState(item.startQty);
  const [barOn, setBarOn] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  useEffect(() => {
    const t = setTimeout(() => setBarOn(true), 150 + index * 90);
    return () => clearTimeout(t);
  }, [index]);

  const pct =
    item.needed === null ? 0 : Math.min(100, Math.round((item.funded / item.needed) * 100));
  const remaining = item.needed === null ? null : item.needed - item.funded;
  const total = Math.round(qty * item.unitCost * 100) / 100;
  const label = qty === 1 ? item.name : `${qty} × ${item.name}`;
  const payUrl = paypalDonateUrl(`${label} — Belize Mission`, total);

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.soft} ${accent.text}`}>
          <Icon kind={item.icon} className="h-7 w-7" />
        </span>
        <span className="rounded-full bg-sand-dark px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink/70">
          {fmt(item.unitCost)} each
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl font-bold">{item.name}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/70">{item.blurb}</p>

      {/* progress */}
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
              className={`h-full rounded-full ${accent.bg} transition-[transform,box-shadow,background-color,color] duration-200 duration-1000 ease-out`}
              style={{ width: barOn ? `${Math.max(pct, 1.5)}%` : "0%" }}
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
          Every missionary serves unpaid and raises {fmt(item.unitCost)} to go.
        </p>
      )}

      {/* stepper + give */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-ink/15">
          <button
            aria-label="Fewer"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 font-bold text-ink/60 hover:text-sea"
          >
            −
          </button>
          <span className="min-w-8 text-center font-serif text-lg font-bold tabular-nums">{qty}</span>
          <button
            aria-label="More"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            className="px-3 py-2 font-bold text-ink/60 hover:text-sea"
          >
            +
          </button>
        </div>
        <a
          href={payUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("give_click", { location: "supply_drive", fund: item.id, qty, amount: total })}
          className="btn-give flex-1 !px-3 !py-2.5 !text-xs"
        >
          Sponsor · {fmt(total)}
        </a>
      </div>
    </div>
  );
}

export default function SupplyDrive() {
  const [barOn, setBarOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarOn(true), 200);
    return () => clearTimeout(t);
  }, []);

  const raised = supplyDrive.items.reduce((sum, i) => sum + i.funded * i.unitCost, 0);
  const pct = Math.min(100, Math.round((raised / supplyDrive.goalUsd) * 100));

  return (
    <div>
      {/* Overall thermometer */}
      <div className="rounded-2xl bg-deep p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Trip Supply Goal
            </p>
            <p className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
              {fmt(raised)} <span className="text-lg font-medium text-white/60">of {fmt(supplyDrive.goalUsd)}</span>
            </p>
          </div>
          <p className="font-serif text-2xl font-bold text-gold">{pct}%</p>
        </div>
        <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-[transform,box-shadow,background-color,color] duration-200 duration-1000 ease-out"
            style={{ width: barOn ? `${Math.max(pct, 1)}%` : "0%" }}
          />
        </div>
        <p className="mt-2 text-sm text-white/70">
          Every item below comes straight from the trip budget. When the bars fill, the trunks fly.
        </p>
      </div>

      {/* Item grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {supplyDrive.items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
