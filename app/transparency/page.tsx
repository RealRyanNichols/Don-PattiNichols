import type { Metadata } from "next";
import Link from "next/link";
import { supabaseConfig } from "@/lib/supabase";
import { supplyDrive } from "@/content/supplies";
import { site } from "@/lib/site";
import { albumBySlug, photo } from "@/content/albums";
import JoinForm from "@/components/JoinForm";
import ShareButton from "@/components/ShareButton";
import GiveLink from "@/components/GiveLink";
import GivingProgress from "@/components/GivingProgress";
import {
  fetchDonationTotals,
  fetchItemFunding,
  buildAllocation,
} from "@/lib/donations";

export const metadata: Metadata = {
  title: "Open Book — Every Dollar, Accounted For",
  description:
    "Full financial transparency for Don & Patti Nichols' mission work: every gift received, every dollar spent, the published trip budget, and the photographs proving where it all went.",
  alternates: { canonical: `${site.url}/transparency` },
};

/** The page re-checks the ledger every minute. */
export const revalidate = 60;

type Ledger = {
  raised: number;
  spent: number;
  gifts: number;
  by_category: Record<string, number>;
};

type Entry = {
  id: string;
  kind: "gift" | "spent";
  amount_usd: number;
  category: string;
  note: string;
  entry_date: string;
};

const fmt = (n: number) =>
  Number(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

async function fetchLedger(): Promise<{ totals: Ledger; entries: Entry[] }> {
  const empty = { raised: 0, spent: 0, gifts: 0, by_category: {} };
  try {
    const headers = {
      apikey: supabaseConfig.key,
      Authorization: `Bearer ${supabaseConfig.key}`,
      "Content-Type": "application/json",
    };
    const [totalsRes, entriesRes] = await Promise.all([
      fetch(`${supabaseConfig.url}/rest/v1/rpc/ledger_totals`, {
        method: "POST",
        headers,
        body: "{}",
        next: { revalidate: 60 },
      }),
      fetch(
        `${supabaseConfig.url}/rest/v1/ledger_entries?select=id,kind,amount_usd,category,note,entry_date&order=entry_date.desc,created_at.desc&limit=30`,
        { headers, next: { revalidate: 60 } },
      ),
    ]);
    return {
      totals: totalsRes.ok ? await totalsRes.json() : empty,
      entries: entriesRes.ok ? await entriesRes.json() : [],
    };
  } catch {
    return { totals: empty, entries: [] };
  }
}

const itemName = (category: string) =>
  supplyDrive.items.find((i) => i.id === category)?.name ??
  category
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

export default async function TransparencyPage() {
  const [{ totals, entries }, donationTotals, itemFunding] = await Promise.all([
    fetchLedger(),
    fetchDonationTotals(),
    fetchItemFunding(),
  ]);
  const allocation = buildAllocation(donationTotals, itemFunding);
  const wells = albumBySlug("water-wells");
  const bibles = albumBySlug("bible-ministry");
  const widows = albumBySlug("widows-and-orphans");
  const goal = supplyDrive.goalUsd;
  const pct = Math.min(100, Math.round((totals.raised / goal) * 100));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-deep py-16 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 85% -10%, rgba(201,150,46,0.25), transparent 60%)",
          }}
        />
        <div className="container-content relative">
          <p className="identity-line">Open Book</p>
          <h1 className="h-display mt-4 text-4xl !text-white sm:text-5xl lg:text-6xl">
            Every dollar, accounted for.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            No salaries. No overhead. No markup. Money comes in, supplies go to
            the field, and everything is given away free. This page is the
            ledger — updated by Don and Patti themselves as gifts arrive and
            dollars are spent.
          </p>

          {/* Live thermometer toward Don's published goal */}
          <div className="mt-9 max-w-xl rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-serif text-3xl font-bold">
                {fmt(totals.raised)}
                <span className="ml-2 text-base font-normal text-white/70">
                  raised of the {fmt(goal)} trip budget
                </span>
              </p>
              <p className="text-sm font-bold text-gold">{pct}%</p>
            </div>
            <div className="mt-3 h-3.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
                style={{ width: `${Math.max(pct, 2)}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Gifts
                </p>
                <p className="font-serif text-2xl font-bold">{totals.gifts}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Deployed
                </p>
                <p className="font-serif text-2xl font-bold">{fmt(totals.spent)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Kept as pay
                </p>
                <p className="font-serif text-2xl font-bold">$0</p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="transparency_hero" className="btn-give">
              Add Your Gift to the Ledger
            </GiveLink>
            <ShareButton
              title="Open Book — Don & Patti Nichols Mission"
              text="Every dollar accounted for. See where mission gifts actually go."
              path="/transparency"
              dark
            />
          </div>

          {/*
            The ledger says what came in and what went out. The cost page says
            what each thing costs before anyone gives. People reading one almost
            always want the other.
          */}
          <p className="mt-6 text-sm text-white/70">
            Want the prices themselves?{" "}
            <Link
              href="/what-a-mission-trip-costs"
              className="font-semibold text-white underline decoration-gold/60 underline-offset-4 hover:decoration-gold"
            >
              Here is what a medical mission trip actually costs
            </Link>{" "}
            — every line item, to the dime.
          </p>
        </div>
      </section>

      {/*
        WHAT GIVING HAS DONE — gifts that actually arrived, and what each one
        was designated for. This is the answer to "what is being accomplished
        and what still needs to be funded". It sits above the hand-kept ledger
        because it updates itself, while the ledger below is Don recording
        money as he spends it.
      */}
      <section className="container-content py-14">
        <GivingProgress a={allocation} />
      </section>

      {/* The running ledger */}
      <section className="bg-sand-dark py-14">
        <div className="container-content grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="h-display text-3xl">The ledger</h2>
            <p className="mt-2 max-w-xl text-ink/70">
              Recorded by hand, by the people who carry the trunks. Newest
              first.
            </p>

            {entries.length === 0 ? (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-ink/15 bg-white/60 p-8 text-center">
                <p className="font-serif text-xl text-ink/75">
                  The ledger opens with the next gift.
                </p>
                <p className="mx-auto mt-2 max-w-md text-ink/60">
                  Every entry from here forward — received or spent — will be
                  listed on this page for anyone to inspect.
                </p>
                <GiveLink location="transparency_empty" className="btn-give mt-5">
                  Be the First Entry
                </GiveLink>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink/10"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${
                          e.kind === "gift"
                            ? "bg-sea/10 text-sea"
                            : "bg-gold/15 text-gold-dark"
                        }`}
                      >
                        {e.kind === "gift" ? "+" : "→"}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">
                          {e.kind === "gift" ? "Gift received" : "Deployed"} ·{" "}
                          {itemName(e.category)}
                        </p>
                        {e.note && (
                          <p className="text-sm text-ink/60">{e.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-serif text-xl font-bold ${
                          e.kind === "gift" ? "text-sea" : "text-gold-dark"
                        }`}
                      >
                        {fmt(e.amount_usd)}
                      </p>
                      <p className="text-xs text-ink/45">
                        {new Date(e.entry_date + "T12:00:00").toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* The plan — Don's published budget */}
          <aside>
            <h2 className="h-display text-2xl">The plan for every dollar</h2>
            <p className="mt-2 text-ink/70">
              Don&rsquo;s published budget — the prices are real and unchanged.
            </p>
            <ul className="mt-5 space-y-2.5">
              {supplyDrive.items.map((i) => {
                const given = totals.by_category[i.id] ?? 0;
                const need =
                  i.needed === null ? null : i.needed * i.unitCost;
                const barPct =
                  need === null
                    ? 0
                    : Math.min(100, Math.round((given / need) * 100));
                return (
                  <li key={i.id} className="rounded-xl bg-white p-3.5 ring-1 ring-ink/10">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <Link
                        href={`/sponsor/${i.id}`}
                        className="font-semibold text-ink hover:text-sea"
                      >
                        {i.name}
                      </Link>
                      <span className="text-ink/60">
                        {given > 0 && (
                          <strong className="mr-1 text-sea">{fmt(given)}</strong>
                        )}
                        {need !== null ? `of ${fmt(need)}` : "open-ended"}
                      </span>
                    </div>
                    {need !== null && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-dark">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sea to-gold"
                          style={{ width: `${Math.max(barPct, given > 0 ? 4 : 0)}%` }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link href="/sponsor" className="btn-primary mt-5 w-full text-center">
              Sponsor Something Specific
            </Link>
          </aside>
        </div>
      </section>

      {/* What past giving became — evidence, not claims */}
      <section className="bg-sand-dark py-14">
        <div className="container-content">
          <h2 className="h-display text-3xl">What giving has already become</h2>
          <p className="mt-2 max-w-2xl text-ink/70">
            Not promises — photographs. Thirteen years of gifts turned into
            things you can look at.
          </p>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {[
              { album: wells, label: "Water wells drilled and donated in Malawi" },
              { album: bibles, label: "Bibles bought in-country and given away" },
              { album: widows, label: "Sewing trades funded for widows & orphans" },
            ].map(
              (x) =>
                x.album && (
                  <Link
                    key={x.album.slug}
                    href={`/albums/${x.album.slug}`}
                    className="group overflow-hidden rounded-2xl bg-deep shadow-sm ring-1 ring-ink/5"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo(x.album.cover, 800)}
                        alt={x.label}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-serif font-bold text-white">{x.label}</p>
                      <p className="mt-1 text-xs text-gold">
                        See the photographs →
                      </p>
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
      </section>

      {/* Capture + convert */}
      <section className="container-content py-14">
        <div className="grid items-center gap-8 rounded-2xl bg-deep p-8 text-white sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="h-display text-3xl !text-white">
              Watch the ledger fill up.
            </h2>
            <p className="mt-3 text-white/80">
              Follow the mission and you&rsquo;ll hear when gifts arrive, when
              trunks get packed, and when the next trip is announced.
            </p>
          </div>
          <JoinForm source="transparency" interest="the ledger" askName askPhone offerTexts dark submitLabel="Follow the ledger" />
        </div>
      </section>
    </>
  );
}
