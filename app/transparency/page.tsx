import Link from "next/link";
import { supabaseConfig } from "@/lib/supabase";
import { supplyDrive } from "@/content/supplies";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import { albumBySlug, photo } from "@/content/albums";
import JoinForm from "@/components/JoinForm";
import ShareButton from "@/components/ShareButton";
import GiveLink from "@/components/GiveLink";
import GivingProgress from "@/components/GivingProgress";
import {
  fetchDonationTotals,
  fetchItemFunding,
  buildAllocation,
  usd,
} from "@/lib/donations";

export const metadata = createPageMetadata({
  path: "/transparency",
  title: "Open Book — Mission Giving and Expenses, in the Open",
  description:
    "See recorded mission gifts, manually entered expenses, and Don and Patti Nichols' published supply budget, with clear notes about what the records show.",
  keywords: keywords("giving", "costs", [
    "mission transparency",
    "where does my donation go",
    "open ledger ministry",
  ]),
  image: ogCardImage({
    eyebrow: "Open Book",
    title: "Giving and expenses, in the open.",
    line: "Recorded gifts, hand-entered expenses, and the published supply budget. Nothing hidden.",
    photo: "1IKE9SB5pmB42BcUTUxr0XDI0IbkOv1qi",
  }),
});

/** The page re-checks the ledger every minute. */
export const revalidate = 60;

type Entry = {
  id: string;
  kind: "spent";
  amount_usd: number;
  category: string;
  note: string | null;
  entry_date: string;
};

const fmt = usd;

async function fetchLedger(): Promise<{
  spent: number | null;
  entries: Entry[] | null;
}> {
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
        `${supabaseConfig.url}/rest/v1/ledger_entries?select=id,kind,amount_usd,category,note,entry_date&kind=eq.spent&order=entry_date.desc,created_at.desc&limit=30`,
        { headers, next: { revalidate: 60 } },
      ),
    ]);
    const totals: unknown = totalsRes.ok ? await totalsRes.json() : null;
    const rows: unknown = entriesRes.ok ? await entriesRes.json() : null;
    const spent =
      totals &&
      typeof totals === "object" &&
      "spent" in totals &&
      (typeof totals.spent === "number" || typeof totals.spent === "string") &&
      String(totals.spent).trim() !== ""
        ? Number(totals.spent)
        : null;
    const entries =
      Array.isArray(rows) &&
      rows.every((entry: unknown) => {
        if (!entry || typeof entry !== "object") return false;
        const row = entry as Record<string, unknown>;
        return (
          typeof row.id === "string" &&
          row.kind === "spent" &&
          typeof row.amount_usd === "number" &&
          Number.isFinite(row.amount_usd) &&
          row.amount_usd >= 0 &&
          typeof row.category === "string" &&
          typeof row.entry_date === "string" &&
          (row.note === null || typeof row.note === "string")
        );
      })
        ? (rows as Entry[])
        : null;
    return {
      spent:
        spent !== null && Number.isFinite(spent) && spent >= 0 ? spent : null,
      entries,
    };
  } catch {
    return { spent: null, entries: null };
  }
}

const itemName = (category: string) =>
  supplyDrive.items.find((i) => i.id === category)?.name ??
  category
    .split("-")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");

export default async function TransparencyPage() {
  const [{ spent, entries }, donationTotals, itemFunding] = await Promise.all([
    fetchLedger(),
    fetchDonationTotals(),
    fetchItemFunding(),
  ]);
  const allocation = buildAllocation(donationTotals, itemFunding);
  const wells = albumBySlug("water-wells");
  const bibles = albumBySlug("bible-ministry");
  const widows = albumBySlug("widows-and-orphans");
  const goal = supplyDrive.goalUsd;
  const pct = allocation.status === "available" ? allocation.pctOfGoal : null;

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
            Giving and expenses, in the open.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            See the gifts recorded on the website, Don and Patti&rsquo;s manual
            expense ledger, and the published supply budget. The gift totals and
            expense entries are separate records; they are not added together.
          </p>

          {/* The same donation totals used in GivingProgress below. */}
          <div className="mt-9 max-w-xl rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
            {donationTotals !== null && pct !== null ? (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-serif text-3xl font-bold">
                    {fmt(donationTotals.totalUsd)}
                    <span className="ml-2 text-base font-normal text-white/70">
                      in recorded gifts against the {fmt(goal)} supply budget
                    </span>
                  </p>
                  <p className="text-sm font-bold text-gold">{pct}%</p>
                </div>
                <div
                  className="mt-3 h-3.5 overflow-hidden rounded-full bg-white/15"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Recorded gifts as a percentage of the supply budget"
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-lg text-white/85">
                Giving records are temporarily unavailable. Please check again
                later.
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Recorded gifts
                </p>
                <p className="font-serif text-2xl font-bold">
                  {donationTotals?.giftCount ?? "Unavailable"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Recorded expenses
                </p>
                <p className="font-serif text-2xl font-bold">
                  {spent === null ? "Unavailable" : fmt(spent)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              PayPal gifts are not currently synchronized automatically. The
              website records may be incomplete and do not confirm payment
              settlement. Expenses below are entered by hand.
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="transparency_hero" className="btn-give">
              Support the Mission
            </GiveLink>
            <ShareButton
              title="Open Book — Don & Patti Nichols Mission"
              text="See the mission's recorded gifts, expenses, and published supply budget."
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

      {/* Recorded donations use one source throughout this page. */}
      <section className="container-content py-14">
        <GivingProgress a={allocation} />
      </section>

      {/* The running ledger */}
      <section className="bg-sand-dark py-14">
        <div className="container-content grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="h-display text-3xl">The expense ledger</h2>
            <p className="mt-2 max-w-xl text-ink/70">
              Expenses entered by hand by Don and Patti. The 30 most recent
              entries appear first. These entries are separate from the gift
              totals above and are not a payment processor statement.
            </p>

            {entries === null ? (
              <p className="mt-6 rounded-2xl bg-white p-6 text-ink/70">
                The expense ledger is temporarily unavailable. Please check
                again later; this does not mean no expenses have been recorded.
              </p>
            ) : entries.length === 0 ? (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-ink/15 bg-white/60 p-8 text-center">
                <p className="font-serif text-xl text-ink/75">
                  No expenses are listed yet.
                </p>
                <p className="mx-auto mt-2 max-w-md text-ink/60">
                  This ledger shows expenses once Don and Patti enter them. An
                  empty ledger does not establish that no money has been spent.
                </p>
                <GiveLink
                  location="transparency_empty"
                  className="btn-give mt-5"
                >
                  Support the Mission
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
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-lg font-bold text-gold-dark"
                      >
                        →
                      </span>
                      <div>
                        <p className="font-semibold text-ink">
                          Recorded expense · {itemName(e.category)}
                        </p>
                        {e.note && (
                          <p className="text-sm text-ink/60">{e.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl font-bold text-gold-dark">
                        {fmt(e.amount_usd)}
                      </p>
                      <p className="text-xs text-ink/45">
                        {new Date(
                          e.entry_date + "T12:00:00",
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* The plan — Don's published budget */}
          <aside>
            <h2 className="h-display text-2xl">
              Don&rsquo;s published supply budget
            </h2>
            <p className="mt-2 text-ink/70">
              Planned costs, separate from gifts and expenses recorded above.
            </p>
            <ul className="mt-5 space-y-2.5">
              {supplyDrive.items.map((i) => {
                const need = i.needed === null ? null : i.needed * i.unitCost;
                return (
                  <li
                    key={i.id}
                    className="rounded-xl bg-white p-3.5 ring-1 ring-ink/10"
                  >
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <Link
                        href={`/sponsor/${i.id}`}
                        className="font-semibold text-ink hover:text-sea"
                      >
                        {i.name}
                      </Link>
                      <span className="text-ink/60">
                        {need !== null ? fmt(need) : "open-ended"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/sponsor"
              className="btn-primary mt-5 w-full text-center"
            >
              Sponsor Something Specific
            </Link>
          </aside>
        </div>
      </section>

      {/* What past giving became — evidence, not claims */}
      <section className="bg-sand-dark py-14">
        <div className="container-content">
          <h2 className="h-display text-3xl">
            Photographs from past mission work
          </h2>
          <p className="mt-2 max-w-2xl text-ink/70">
            Explore the mission photo archive. These photographs document past
            work; they do not reconcile the current gift and expense records.
          </p>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {[
              {
                album: wells,
                label: "Water wells drilled and donated in Malawi",
              },
              {
                album: bibles,
                label: "Bibles bought in-country and given away",
              },
              {
                album: widows,
                label: "Sewing trades funded for widows & orphans",
              },
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
                      <p className="font-serif font-bold text-white">
                        {x.label}
                      </p>
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
              Follow the mission.
            </h2>
            <p className="mt-3 text-white/80">
              Sign up for updates from Don and Patti about their mission work
              and future trips.
            </p>
          </div>
          <JoinForm
            source="transparency"
            interest="the ledger"
            askName
            askPhone
            offerTexts
            dark
            submitLabel="Follow the ledger"
          />
        </div>
      </section>
    </>
  );
}
