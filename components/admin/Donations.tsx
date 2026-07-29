"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { supplyDrive } from "@/content/supplies";

/**
 * GIFTS — the private view.
 *
 * This is the only place on the whole site where a donor's name sits next to
 * an amount. The public pages show the total and what it went toward and
 * nothing else, which is exactly how Don and Patti want it. That boundary is
 * enforced in the database: `donations` has no public read policy at all, and
 * the public totals come from a function that can only return sums.
 *
 * "Write it down myself" exists because not every gift comes through PayPal —
 * cash at church, a check in the mail, or a gift given before the website
 * could see PayPal at all. Ryan's own $6 on July 27 was one of those.
 */

type Gift = {
  id: string;
  amount_usd: string | number;
  currency: string;
  fund: string | null;
  item_id: string | null;
  quantity: number | null;
  recurring: boolean;
  donor_name: string | null;
  donor_email: string | null;
  source: string;
  status: string;
  note: string | null;
  created_at: string;
};

const CARD = "rounded-2xl border-2 border-ink/10 bg-white p-5";
const FIELD =
  "w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-4 text-lg text-ink placeholder:text-ink/35 focus:border-sea focus:outline-none focus:ring-4 focus:ring-sea/20";
const LABEL = "block text-lg font-bold text-ink";
const HELP = "mt-1.5 text-base leading-relaxed text-ink/60";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

const niceDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function Donations() {
  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase()
      .from("donations")
      .select(
        "id,amount_usd,currency,fund,item_id,quantity,recurring,donor_name,donor_email,source,status,note,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    setGifts((data as Gift[]) ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = useMemo(() => {
    const list = (gifts ?? []).filter((g) => g.status === "completed");
    const total = list.reduce((s, g) => s + Number(g.amount_usd), 0);
    return {
      total,
      count: list.length,
      monthly: list.filter((g) => g.recurring).length,
      pct: Math.min(100, Math.round((total / supplyDrive.goalUsd) * 100)),
    };
  }, [gifts]);

  if (gifts === null) {
    return <p className="text-lg text-ink/60">Getting the gifts…</p>;
  }

  return (
    <div className="space-y-6">
      <section className={CARD}>
        <h2 className="font-serif text-2xl font-bold text-ink">Gifts</h2>
        <p className={HELP}>
          Every gift, with the name of whoever gave it. Only you and Patti and
          Ryan can see this page — the website shows visitors the total and
          what it paid for, never a name or a single person&rsquo;s amount.
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="given so far" value={usd(totals.total)} />
          <Stat label={totals.count === 1 ? "gift" : "gifts"} value={String(totals.count)} />
          <Stat label="of the trip goal" value={`${totals.pct}%`} />
        </div>

        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="btn-primary mt-5 w-full !py-4"
        >
          {adding ? "Never mind" : "Write down a gift myself"}
        </button>
        <p className={HELP}>
          For cash, a check, or anything that didn&rsquo;t come through the
          website.
        </p>
      </section>

      {adding && (
        <AddGift
          onSaved={() => {
            setAdding(false);
            void load();
          }}
        />
      )}

      {gifts.length === 0 ? (
        <section className={CARD}>
          <p className="text-lg leading-relaxed text-ink/70">
            No gifts recorded yet. Once PayPal is connected to the website, every
            gift lands here by itself the moment it clears.
          </p>
        </section>
      ) : (
        <section className={CARD}>
          <ul className="divide-y divide-ink/10">
            {gifts.map((g) => {
              const amt = Number(g.amount_usd);
              const item = supplyDrive.items.find((i) => i.id === g.item_id);
              return (
                <li key={g.id} className="py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-xl font-bold text-ink">
                      {g.donor_name || "A friend of the mission"}
                    </p>
                    <p
                      className={`shrink-0 font-serif text-xl font-bold ${
                        amt < 0 ? "text-red-700" : "text-sea"
                      }`}
                    >
                      {usd(amt)}
                    </p>
                  </div>
                  <p className="mt-1 text-base text-ink/65">
                    {item ? item.name : g.fund || "Where it is needed most"}
                    {g.quantity ? ` · ${g.quantity}` : ""}
                    {g.recurring ? " · monthly" : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink/45">
                    {niceDate(g.created_at)}
                    {g.source === "manual" ? " · written down by hand" : " · through PayPal"}
                    {amt < 0 ? " · refunded" : ""}
                  </p>
                  {g.donor_email && (
                    <a
                      href={`mailto:${g.donor_email}`}
                      className="mt-1 inline-block text-base text-sea underline"
                    >
                      Say thank you
                    </a>
                  )}
                  {g.note && (
                    <p className="mt-1 text-sm italic text-ink/50">{g.note}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sand-dark px-2 py-4">
      <p className="font-serif text-2xl font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-sm leading-tight text-ink/60">{label}</p>
    </div>
  );
}

function AddGift({ onSaved }: { onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [itemId, setItemId] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Please put in how much was given, like 25 or 6.50.");
      return;
    }
    setBusy(true);
    const chosen = supplyDrive.items.find((i) => i.id === itemId);
    const { error: err } = await supabase().from("donations").insert({
      amount_usd: amt,
      currency: "USD",
      fund: chosen ? chosen.name : "Where it is needed most",
      item_id: itemId || null,
      // Whole units only — a $6 gift toward $0.60 glasses is 10 pairs.
      quantity:
        chosen && chosen.unitCost > 0 ? Math.floor(amt / chosen.unitCost) : null,
      recurring: false,
      donor_name: name.trim() || null,
      donor_email: email.trim() || null,
      source: "manual",
      status: "completed",
      note: note.trim() || null,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={save} className={`${CARD} space-y-5`}>
      <h3 className="font-serif text-xl font-bold text-ink">Write down a gift</h3>

      <div>
        <label htmlFor="amt" className={LABEL}>
          How much
        </label>
        <input
          id="amt"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="25"
          className={`${FIELD} mt-2`}
          required
        />
      </div>

      <div>
        <label htmlFor="who" className={LABEL}>
          Who gave it
        </label>
        <p className={HELP}>Leave it blank if they&rsquo;d rather not be named.</p>
        <input
          id="who"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First and last name"
          className={`${FIELD} mt-2`}
        />
      </div>

      <div>
        <label htmlFor="mail" className={LABEL}>
          Their email
        </label>
        <p className={HELP}>So you can send them a thank-you. Optional.</p>
        <input
          id="mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${FIELD} mt-2`}
        />
      </div>

      <div>
        <label htmlFor="what" className={LABEL}>
          What it&rsquo;s for
        </label>
        <select
          id="what"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className={`${FIELD} mt-2`}
        >
          <option value="">Where it&rsquo;s needed most</option>
          {supplyDrive.items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note" className={LABEL}>
          A note to yourself
        </label>
        <input
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Cash at church, check #1042…"
          className={`${FIELD} mt-2`}
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-base font-semibold text-red-700">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-give w-full !py-5 !text-lg">
        {busy ? "Saving…" : "Save this gift"}
      </button>
    </form>
  );
}
