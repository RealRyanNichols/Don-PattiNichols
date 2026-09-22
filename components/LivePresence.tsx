"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabaseConfig } from "@/lib/supabase";

/** Lightweight page counts. No Realtime SDK or socket on every public page. */
export default function LivePresence() {
  const pathname = usePathname();
  const [stats, setStats] = useState<{
    path: string;
    total: number;
    today: number;
  } | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const headers = {
      apikey: supabaseConfig.key,
      Authorization: `Bearer ${supabaseConfig.key}`,
      "Content-Type": "application/json",
    };
    const run = async () => {
      try {
        const seenKey = `pv:${pathname}`;
        let seen = false;
        try {
          seen = sessionStorage.getItem(seenKey) === "1";
        } catch {
          /* Counts are optional. */
        }
        if (!seen) {
          const saved = await fetch(
            `${supabaseConfig.url}/rest/v1/page_views`,
            {
              method: "POST",
              headers: { ...headers, Prefer: "return=minimal" },
              body: JSON.stringify({ path: pathname }),
              signal: controller.signal,
            },
          );
          if (saved.ok) {
            try {
              sessionStorage.setItem(seenKey, "1");
            } catch {
              /* Restricted browser storage. */
            }
          }
        }
        const response = await fetch(
          `${supabaseConfig.url}/rest/v1/rpc/view_stats`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ p: pathname }),
            signal: controller.signal,
          },
        );
        if (!response.ok) return;
        const result = await response.json();
        const total = Number(result?.total);
        const today = Number(result?.today);
        if (
          !controller.signal.aborted &&
          Number.isFinite(total) &&
          Number.isFinite(today) &&
          total >= 0 &&
          today >= 0
        )
          setStats({ path: pathname, total, today });
      } catch {
        /* A count must never interrupt giving or reading. */
      }
    };
    // Let the page and its photograph finish loading before optional counting.
    const schedule = () => {
      timer = setTimeout(run, 2000);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      controller.abort();
      clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };
  }, [pathname]);

  if (
    !stats ||
    stats.path !== pathname ||
    pathname.startsWith("/admin") ||
    stats.total < 10
  )
    return null;
  return (
    <div className="border-t border-ink/10 bg-sand py-3 text-center text-xs text-ink/65">
      {stats.total.toLocaleString("en-US")} recorded visits to this page
    </div>
  );
}
