"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { money } from "@/lib/format";
import type { TabId } from "./AdminApp";

type Counts = {
  newMessages: number | null;
  followers: number | null;
  donationTotal: number | null;
  posts: number | null;
};

export default function HomeTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const [counts, setCounts] = useState<Counts>({
    newMessages: null,
    followers: null,
    donationTotal: null,
    posts: null,
  });

  useEffect(() => {
    (async () => {
      const [msgs, subs, dons, posts] = await Promise.all([
        supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("handled", false),
        supabase.from("subscribers").select("id", { count: "exact", head: true }),
        supabase.from("donations").select("amount_usd"),
        supabase.from("posts").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        newMessages: msgs.count ?? 0,
        followers: subs.count ?? 0,
        donationTotal: (dons.data ?? []).reduce((s, r) => s + Number(r.amount_usd || 0), 0),
        posts: posts.count ?? 0,
      });
    })();
  }, []);

  const tiles: {
    tab: TabId;
    title: string;
    big: string;
    caption: string;
    highlight?: boolean;
  }[] = [
    {
      tab: "messages",
      title: "Messages & Prayer Requests",
      big: counts.newMessages === null ? "…" : String(counts.newMessages),
      caption:
        counts.newMessages === 1 ? "new message waiting for you" : "new messages waiting for you",
      highlight: (counts.newMessages ?? 0) > 0,
    },
    {
      tab: "followers",
      title: "Followers",
      big: counts.followers === null ? "…" : String(counts.followers),
      caption: "people following the mission by email",
    },
    {
      tab: "donations",
      title: "Donations",
      big: counts.donationTotal === null ? "…" : money(counts.donationTotal),
      caption: "given online so far",
    },
    {
      tab: "updates",
      title: "Write an Update",
      big: counts.posts === null ? "…" : String(counts.posts),
      caption: "updates written so far — tap to write a new one",
      highlight: true,
    },
  ];

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        {tiles.map((tile) => (
          <button
            key={tile.tab}
            onClick={() => onNavigate(tile.tab)}
            className={`rounded-2xl border p-7 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              tile.highlight
                ? "border-gold/40 bg-white ring-1 ring-gold/30"
                : "border-ink/10 bg-white"
            }`}
          >
            <p className="eyebrow">{tile.title}</p>
            <p className="mt-3 font-serif text-5xl font-bold text-sea tabular-nums">{tile.big}</p>
            <p className="mt-2 text-lg text-ink/70">{tile.caption}</p>
            <p className="mt-4 text-sm font-semibold text-sea">Open →</p>
          </button>
        ))}
      </div>
      <p className="mt-8 rounded-xl bg-sand-dark p-5 text-lg text-ink/75">
        New here? Tap <span className="font-semibold">Help</span> above for a simple step-by-step
        guide to everything on this page.
      </p>
    </div>
  );
}
