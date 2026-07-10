"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { supabase } from "@/lib/supabase-browser";
import { supplies } from "@/content/supplies";
import { money } from "@/lib/format";

type Donation = {
  id: string;
  amount_usd: number;
  fund: string | null;
  recurring: boolean;
  donor_name: string | null;
  donor_email: string | null;
  created_at: string;
};

function fundLabel(fund: string | null) {
  if (!fund) return "Where Needed Most";
  const supply = supplies.find((s) => s.id === fund);
  if (supply) return supply.name;
  const siteFund = site.giving.funds.find((f) => f.key === fund);
  if (siteFund) return siteFund.name;
  return fund;
}

export default function DonationsTab() {
  const [donations, setDonations] = useState<Donation[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("donations")
      .select("id, amount_usd, fund, recurring, donor_name, donor_email, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Couldn't load donations. Try refreshing the page.");
        else setDonations(data as Donation[]);
      });
  }, []);

  const total = (donations ?? []).reduce((s, d) => s + Number(d.amount_usd || 0), 0);
  const byFund = new Map<string, number>();
  for (const d of donations ?? []) {
    const key = fundLabel(d.fund);
    byFund.set(key, (byFund.get(key) ?? 0) + Number(d.amount_usd || 0));
  }

  return (
    <div>
      <h2 className="h-display text-2xl">Donations</h2>
      <p className="mt-2 text-lg text-ink/70">
        Every online gift will appear here automatically once PayPal giving is connected.
        Checks and cash gifts you receive directly won't show here.
      </p>

      {error ? <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</p> : null}
      {donations === null && !error ? <p className="mt-8 text-lg text-ink/60">Loading…</p> : null}

      {donations !== null && donations.length === 0 ? (
        <p className="mt-8 rounded-xl bg-sand-dark p-6 text-lg text-ink/70">
          No online donations yet. When PayPal is connected and the first gift comes in, you'll
          see it here — who gave, how much, and which part of the mission they chose.
        </p>
      ) : null}

      {donations !== null && donations.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-ink/10 bg-white p-6 text-center shadow-sm">
              <p className="font-serif text-4xl font-bold text-sea">{money(total)}</p>
              <p className="mt-1 text-ink/70">given online in total</p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="eyebrow">By fund</p>
              <ul className="mt-2 space-y-1 text-sm text-ink/75">
                {Array.from(byFund.entries()).map(([label, amount]) => (
                  <li key={label} className="flex justify-between gap-2">
                    <span>{label}</span>
                    <span className="font-semibold">{money(amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {donations.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-ink/10 bg-white p-5 shadow-sm"
              >
                <p className="font-serif text-2xl font-bold text-sea tabular-nums">
                  {money(Number(d.amount_usd))}
                </p>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold">
                    {d.donor_name || "Anonymous"}
                    {d.recurring ? (
                      <span className="ml-2 rounded-full bg-sea/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-sea">
                        Monthly
                      </span>
                    ) : null}
                  </p>
                  <p className="text-ink/60">
                    {fundLabel(d.fund)} ·{" "}
                    {new Date(d.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {d.donor_email ? ` · ${d.donor_email}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
