"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  created_at: string;
};

export default function FollowersTab() {
  const [subs, setSubs] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("subscribers")
      .select("id, email, name, phone, source, created_at")
      .order("created_at", { ascending: false });
    if (error) setError("Couldn't load the follower list. Try refreshing the page.");
    else setSubs(data as Subscriber[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(sub: Subscriber) {
    const sure = window.confirm(
      `Remove ${sub.email} from the follower list? They will stop getting updates.`,
    );
    if (!sure) return;
    const { error } = await supabase.from("subscribers").delete().eq("id", sub.id);
    if (!error) setSubs((all) => (all ?? []).filter((s) => s.id !== sub.id));
  }

  return (
    <div>
      <h2 className="h-display text-2xl">Followers</h2>
      <p className="mt-2 text-lg text-ink/70">
        Everyone who signed up on the website to follow the mission by email
        {subs ? ` — ${subs.length} ${subs.length === 1 ? "person" : "people"} so far.` : "."}
      </p>

      {error ? <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}
      {subs === null && !error ? <p className="mt-8 text-lg text-ink/60">Loading…</p> : null}
      {subs !== null && subs.length === 0 ? (
        <p className="mt-8 rounded-xl bg-sand-dark p-6 text-lg text-ink/70">
          No followers yet — share the website and they'll appear here.
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {(subs ?? []).map((sub) => (
          <div
            key={sub.id}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-lg font-semibold">{sub.name || sub.email}</p>
              <p className="text-ink/60">
                {sub.name ? `${sub.email} · ` : ""}
                {sub.phone ? `${sub.phone} · ` : ""}
                joined{" "}
                {new Date(sub.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => remove(sub)}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
