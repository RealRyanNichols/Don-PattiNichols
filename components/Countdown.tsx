"use client";

import { useEffect, useState } from "react";

/** Live countdown to a trip start date. Renders nothing until a date is set. */
export default function Countdown({ startDate, label }: { startDate?: string; label?: string }) {
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
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const cells = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: mins, l: "Minutes" },
    { v: secs, l: "Seconds" },
  ];

  return (
    <div>
      {label ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest opacity-80">{label}</p>
      ) : null}
      <div className="flex gap-3 sm:gap-4" suppressHydrationWarning>
        {cells.map((c) => (
          <div
            key={c.l}
            className="flex w-[72px] flex-col items-center rounded-xl bg-white/10 px-2 py-3 backdrop-blur sm:w-20"
          >
            <span className="font-serif text-3xl font-bold tabular-nums sm:text-4xl">
              {now === null ? "–" : c.v}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest opacity-75">
              {c.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
