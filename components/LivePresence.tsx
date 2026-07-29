"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { supabaseConfig } from "@/lib/supabase";

/**
 * THE VISITOR PILL — live presence + cumulative visit counter.
 *
 * Two truthful data sources, combined into one always-honest pill:
 *   1. LIVE: a Supabase Realtime presence channel counts actually-connected
 *      visitors, per page.
 *   2. CUMULATIVE: every page view writes one row to `page_views` (write-only
 *      for the public; only COUNTS are readable, via the view_stats RPC).
 *
 * Ryan's rule: visible numbers build morale and momentum — people give where
 * they see other people moving. My rule: the numbers must be real. So the pill
 * shows the strongest TRUE stat available and never invents one:
 *
 *   live >= 2            → "3 people here right now"  (+ visits alongside)
 *   else today >= 5      → "27 visits today"
 *   else total >= 10     → "312 visits"
 *   else                 → hidden (a brand-new counter reading "2 visits"
 *                          hurts more than it helps; it earns its place fast)
 *
 * Counting started July 28, 2026 — the numbers only ever grow.
 */

const nf = new Intl.NumberFormat("en-US");

export default function LivePresence() {
  const pathname = usePathname();
  const [live, setLive] = useState(0);
  const [onThisPage, setOnThisPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [visible, setVisible] = useState(false);

  // ---- cumulative counter: record this view, then read the counts ----
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const run = async () => {
      try {
        // One count per page per browser session — reloads don't stuff the box.
        const seenKey = `pv:${pathname}`;
        const alreadyCounted = sessionStorage.getItem(seenKey);
        if (!alreadyCounted) {
          sessionStorage.setItem(seenKey, "1");
          await fetch(`${supabaseConfig.url}/rest/v1/page_views`, {
            method: "POST",
            headers: {
              apikey: supabaseConfig.key,
              Authorization: `Bearer ${supabaseConfig.key}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({ path: pathname }),
          });
        }
        const res = await fetch(
          `${supabaseConfig.url}/rest/v1/rpc/view_stats`,
          {
            method: "POST",
            headers: {
              apikey: supabaseConfig.key,
              Authorization: `Bearer ${supabaseConfig.key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ p: pathname }),
          },
        );
        if (res.ok) {
          const stats = await res.json();
          setTotal(Number(stats?.total ?? 0));
          setToday(Number(stats?.today ?? 0));
        }
      } catch {
        // Counting is decoration, never a blocker.
      }
    };
    run();
  }, [pathname]);

  // ---- live presence ----
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const sb = supabase();
    const key =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v-${Math.random().toString(36).slice(2)}`;

    const channel = sb.channel("presence:site-visitors", {
      config: { presence: { key } },
    });

    const update = () => {
      const state = channel.presenceState<{ path: string }>();
      setLive(Object.keys(state).length);
      setOnThisPage(
        Object.values(state)
          .flat()
          .filter((p) => p.path === pathname).length,
      );
    };

    channel
      .on("presence", { event: "sync" }, update)
      .on("presence", { event: "join" }, update)
      .on("presence", { event: "leave" }, update)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ path: pathname });
          update();
        }
      });

    return () => {
      sb.removeChannel(channel);
    };
  }, [pathname]);

  // ---- choose the strongest true statement ----
  let primary = "";
  let secondary = "";
  if (live >= 2) {
    primary =
      onThisPage >= 2 && pathname !== "/"
        ? `${onThisPage} reading this page right now`
        : `${live} people here right now`;
    if (today >= 5) secondary = `${nf.format(today)} visits today`;
  } else if (today >= 5) {
    primary = `${nf.format(today)} visits today`;
    if (total > today) secondary = `${nf.format(total)} all time`;
  } else if (total >= 10) {
    primary = `${nf.format(total)} visits`;
  }

  useEffect(() => {
    const show = primary !== "";
    const t = setTimeout(() => setVisible(show), show ? 600 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary]);

  if (!visible || !primary || (pathname && pathname.startsWith("/admin")))
    return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-40 animate-[fadeIn_0.6s_ease]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 rounded-full bg-deep/90 py-2 pl-3 pr-4 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
        <span className="relative flex h-2.5 w-2.5">
          {live >= 2 && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
          )}
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
        </span>
        <span>
          {primary}
          {secondary && (
            <span className="ml-2 font-normal text-white/60">· {secondary}</span>
          )}
        </span>
      </div>
    </div>
  );
}
