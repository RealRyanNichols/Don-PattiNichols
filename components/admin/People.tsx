"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * YOUR PEOPLE — the supporter list, in plain language.
 *
 * Everyone who has ever left an email on the site: what they said they cared
 * about, where they came from, whether they'll take a text during a trip.
 * Tapping a row opens the phone's own mail or dialer app, because that is how
 * Don and Patti actually reach people.
 *
 * "Save the list" downloads a real spreadsheet. This list is theirs, and they
 * should be able to walk away with it any day — no export request, no waiting
 * on Ryan.
 *
 * The "chose to fund" panel below is INTENT, not money. It counts the people
 * who picked an item and headed for PayPal. Some of them did not finish. It is
 * labelled that way everywhere it appears, because the alternative is Don
 * reading a number as income and being wrong.
 */

type Person = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  interest: string | null;
  city_state: string | null;
  wants_texts: boolean;
  source: string | null;
  created_at: string;
};

type Intent = {
  item_name: string | null;
  quantity: number;
  amount_usd: string | number | null;
  monthly: boolean;
  created_at: string;
};

const CARD = "rounded-2xl border-2 border-ink/10 bg-white p-5";

function niceDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "post_gift" → "Gave a gift" — nobody should have to read a database value. */
function sourceLabel(s: string | null) {
  switch (s) {
    case "post_gift":
      return "Gave a gift";
    case "website":
    case "site":
      return "Signed up on the site";
    case "footer":
      return "Footer signup";
    case "transparency":
      return "Open Book page";
    default:
      return s ? s.replace(/[_-]+/g, " ") : "Signed up";
  }
}

export default function People() {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [intents, setIntents] = useState<Intent[] | null>(null);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    const sb = supabase();
    const [{ data: subs }, { data: gi }] = await Promise.all([
      sb
        .from("subscribers")
        .select("id,email,name,phone,interest,city_state,wants_texts,source,created_at")
        .order("created_at", { ascending: false })
        .limit(1000),
      sb
        .from("gift_intents")
        .select("item_name,quantity,amount_usd,monthly,created_at")
        .order("created_at", { ascending: false })
        .limit(500),
    ]);
    setPeople((subs as Person[]) ?? []);
    setIntents((gi as Intent[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const shown = useMemo(() => {
    if (!people) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return people;
    return people.filter((p) =>
      [p.name, p.email, p.phone, p.city_state, p.interest]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(needle)),
    );
  }, [people, q]);

  const withPhone = useMemo(
    () => (people ?? []).filter((p) => p.phone).length,
    [people],
  );
  const textable = useMemo(
    () => (people ?? []).filter((p) => p.wants_texts).length,
    [people],
  );

  /** Top items by number of people who chose them. */
  const topItems = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const i of intents ?? []) {
      const key = i.item_name ?? "A gift";
      const prev = map.get(key) ?? { count: 0, total: 0 };
      map.set(key, {
        count: prev.count + 1,
        total: prev.total + Number(i.amount_usd ?? 0),
      });
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6);
  }, [intents]);

  function download() {
    const rows = [
      ["Name", "Email", "Phone", "Town", "Cares about", "Okay to text", "How they found you", "Joined"],
      ...(people ?? []).map((p) => [
        p.name ?? "",
        p.email,
        p.phone ?? "",
        p.city_state ?? "",
        p.interest ?? "",
        p.wants_texts ? "Yes" : "No",
        sourceLabel(p.source),
        niceDate(p.created_at),
      ]),
    ];
    // Quote every field and double interior quotes — a name like O'Brien, Jr.
    // or a note with a comma must not split into extra columns.
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      // The BOM makes Excel open UTF-8 correctly instead of mangling accents.
      new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `don-and-patti-supporters-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (people === null) {
    return <p className="text-lg text-ink/60">Getting your list…</p>;
  }

  return (
    <div className="space-y-6">
      <section className={CARD}>
        <h2 className="font-serif text-2xl font-bold text-ink">Your people</h2>
        <p className="mt-1.5 text-base leading-relaxed text-ink/60">
          Everyone who has given you their email. This list belongs to you — you
          can save a copy any time.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat n={people.length} label="on the list" />
          <Stat n={withPhone} label="gave a phone" />
          <Stat n={textable} label="okay to text" />
        </div>

        <button
          type="button"
          onClick={download}
          disabled={people.length === 0}
          className="btn-primary mt-5 w-full !py-4 disabled:opacity-50"
        >
          Save the list to my phone
        </button>
      </section>

      {people.length === 0 ? (
        <section className={CARD}>
          <p className="text-lg leading-relaxed text-ink/70">
            Nobody has signed up yet. The moment someone does, they show up
            here — with their name, and their phone number if they left one.
          </p>
        </section>
      ) : (
        <section className={CARD}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find someone by name, town, or email"
            aria-label="Search your list"
            className="w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-lg placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20"
          />

          <ul className="mt-4 divide-y divide-ink/10">
            {shown.map((p) => (
              <li key={p.id} className="py-4">
                <p className="font-serif text-xl font-bold text-ink">
                  {p.name || p.email}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-ink/65">
                  <a href={`mailto:${p.email}`} className="text-sea underline">
                    {p.email}
                  </a>
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="text-sea underline">
                      {p.phone}
                    </a>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink/50">
                  {sourceLabel(p.source)}
                  {p.city_state ? ` · ${p.city_state}` : ""}
                  {p.wants_texts ? " · okay to text" : ""}
                  {` · ${niceDate(p.created_at)}`}
                </p>
              </li>
            ))}
            {shown.length === 0 && (
              <li className="py-6 text-lg text-ink/55">
                Nobody matches &ldquo;{q}&rdquo;.
              </li>
            )}
          </ul>
        </section>
      )}

      <section className={CARD}>
        <h2 className="font-serif text-2xl font-bold text-ink">
          What people are choosing
        </h2>
        <p className="mt-1.5 text-base leading-relaxed text-ink/60">
          These are the supplies people picked before heading to PayPal. It
          shows you what moves people &mdash; it is <strong>not</strong> money
          received. Some of these never finished paying, and PayPal doesn&rsquo;t
          report back to this website yet. The Money tab is the only place a
          real dollar goes.
        </p>

        {topItems.length === 0 ? (
          <p className="mt-4 text-lg text-ink/55">
            Nothing yet. As people start choosing supplies, the most popular
            ones show up here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10">
            {topItems.map(([name, v]) => (
              <li key={name} className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-lg font-semibold text-ink">{name}</span>
                <span className="shrink-0 text-base text-ink/60">
                  {v.count} {v.count === 1 ? "person" : "people"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl bg-sand-dark px-2 py-4">
      <p className="font-serif text-3xl font-bold text-ink">{n}</p>
      <p className="mt-0.5 text-sm leading-tight text-ink/60">{label}</p>
    </div>
  );
}
