"use client";

import { useEffect, useState } from "react";
import { supabaseConfig } from "@/lib/supabase";

/**
 * Per-page read counter — "47 views" on a story or album.
 * Reads the same honest counter the pill uses (counting began July 28, 2026).
 * Hidden until a page has 5 real views so young pages don't look abandoned;
 * after that it only climbs, and readers can watch it climb.
 */
export default function PageViews({
  path,
  label = "views",
}: {
  path: string;
  label?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${supabaseConfig.url}/rest/v1/rpc/view_stats`, {
      method: "POST",
      headers: {
        apikey: supabaseConfig.key,
        Authorization: `Bearer ${supabaseConfig.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p: path }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setCount(Number(s?.page ?? 0)))
      .catch(() => {});
  }, [path]);

  if (count < 5) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ink/55">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
      {new Intl.NumberFormat("en-US").format(count)} {label}
    </span>
  );
}
