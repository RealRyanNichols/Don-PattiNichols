"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Trip departure date, YYYY-MM-DD. Empty string = not announced yet. */
  startDate: string;
  label?: string;
};

export default function Countdown({ startDate, label }: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!startDate) {
    return (
      <p className="inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest">
        Trip dates announced soon
      </p>
    );
  }

  const target = new Date(startDate + "T06:00:00").getTime();
  const diff = now === null ? 0 : Math.max(0, target - now);

  const units = [
    { v: Math.floor(diff / 86400000), l: "Days" },
    { v: Math.floor((diff % 86400000) / 3600000), l: "Hours" },
    { v: Math.floor((diff % 3600000) / 60000), l: "Minutes" },
    { v: Math.floor((diff % 60000) / 1000), l: "Seconds" },
  ];

  return (
    <div>
      {label ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest opacity-80">{label}</p>
      ) : null}
      <div className="flex gap-3 sm:gap-4" suppressHydrationWarning>
        {units.map((u) => (
          <div
            key={u.l}
            className="flex w-[72px] flex-col items-center rounded-xl bg-white/10 px-2 py-3 backdrop-blur sm:w-20"
          >
            <span className="font-serif text-3xl font-bold tabular-nums sm:text-4xl">
              {now === null ? "–" : u.v}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest opacity-75">
              {u.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
