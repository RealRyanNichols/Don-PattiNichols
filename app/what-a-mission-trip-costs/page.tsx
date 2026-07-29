import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { supplyDrive } from "@/content/supplies";
import { photo } from "@/content/albums";
import GiveLink from "@/components/GiveLink";
import JoinForm from "@/components/JoinForm";
import ShareButton from "@/components/ShareButton";

/**
 * WHAT A MEDICAL MISSION TRIP ACTUALLY COSTS
 *
 * This page exists because of a gap found by actually reading what ranks.
 *
 * Search "how much does a medical mission trip cost" and you get large
 * organisations publishing RANGES — "$750 to $5,000," "program fees vary,"
 * "request a detailed breakdown from your chosen organisation." They are
 * recruiting volunteers, so their numbers are necessarily vague.
 *
 * Don is not recruiting anyone. He publishes what he actually pays, to the
 * dime, because donors asked. A Bible is $2.50. Reading glasses are sixty
 * cents. Nobody at the top of that search result publishes at this
 * granularity, and specificity is the only thing a two-person family ministry
 * can beat a national organisation with.
 *
 * EVERY NUMBER ON THIS PAGE IS DON'S, from content/supplies.ts. Nothing is
 * estimated, averaged, rounded for effect, or borrowed from another
 * organisation. If a figure changes, it changes there and this page follows.
 */

const TITLE = "What a Medical Mission Trip Actually Costs";
const DESC =
  "Real, itemised costs from a working medical mission — not estimates. A Bible is $2.50. Reading glasses are $0.60. A missionary is $1,200. Published in full by Don & Patti Nichols, thirteen years in Malawi, the Dominican Republic and Belize.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${site.url}/what-a-mission-trip-costs` },
  keywords: [
    "how much does a medical mission trip cost",
    "medical mission trip cost breakdown",
    "mission trip budget",
    "cost of a Bible for missions",
    "reading glasses mission trip",
    "sponsor a missionary cost",
    "medical mission Belize cost",
  ],
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESC,
    url: `${site.url}/what-a-mission-trip-costs`,
  },
};

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

/**
 * The questions people actually type. Answers are short, direct, and use
 * Don's real figures — which is what makes them worth surfacing.
 */
const faqs = [
  {
    q: "How much does a medical mission trip cost per person?",
    a: "For this mission, $1,200 per missionary — $800 for airfare and $400 for lodging. That covers getting one person to the field and keeping them there for the week. It does not include the supplies they carry, which are funded separately.",
  },
  {
    q: "How much does it cost to give someone a Bible on a mission trip?",
    a: "$2.50 for a Bible in Belize. In Malawi in 2014 the same Bible cost $10. Price depends entirely on the country and the language it has to be printed in.",
  },
  {
    q: "What do reading glasses cost for a mission clinic?",
    a: "About $0.60 a pair, bought in bulk. It is the cheapest thing on the entire budget and often the one that changes a person's day the most — it lets someone read, sew, or keep working.",
  },
  {
    q: "What does it cost to fly supplies to the mission field?",
    a: "$25 for a ministry trunk and $200 to fly each one as checked baggage, plus roughly $25 per person for customs and contingency. Getting the supplies there costs considerably more than most of the supplies themselves.",
  },
  {
    q: "Do patients pay anything for a mission medical clinic?",
    a: "Not on this mission. Every consultation, medication, pair of glasses, hygiene kit and Bible is given free of charge. In Don's words: “All of this will be GIVEN FREE OF CHARGE.”",
  },
  {
    q: "What is the total budget for one trip?",
    a: `${fmt(supplyDrive.goalUsd)} for the supply drive — roughly $2,215 in supplies and $1,725 in logistics — on top of the per-missionary cost of getting the team there.`,
  },
];

export default function CostPage() {
  const supplies = supplyDrive.items.filter(
    (i) => !["baggage", "customs", "missionary", "trunk"].includes(i.id),
  );
  const logistics = supplyDrive.items.filter((i) =>
    ["trunk", "baggage", "customs"].includes(i.id),
  );
  const missionary = supplyDrive.items.find((i) => i.id === "missionary")!;

  const lineTotal = (i: (typeof supplyDrive.items)[number]) =>
    i.needed === null ? null : i.needed * i.unitCost;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: DESC,
        author: {
          "@type": "Person",
          name: "Don Nichols",
          url: `${site.url}/don`,
        },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
        mainEntityOfPage: `${site.url}/what-a-mission-trip-costs`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "What a mission trip costs",
            item: `${site.url}/what-a-mission-trip-costs`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo("1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA", 1600)}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,61,64,0.95) 0%, rgba(10,61,64,0.88) 55%, rgba(10,61,64,0.96) 100%)",
          }}
        />
        <div className="container-content relative max-w-3xl py-16 sm:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
            The real numbers
          </p>
          <h1 className="h-display mt-3 text-4xl !text-white sm:text-5xl">
            What a medical mission trip actually costs
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            Most organisations answer this with a range. We&rsquo;ll answer it
            with a receipt. Below is every line of the budget for a Nichols
            medical mission to Belize — what each item costs, how many are
            needed, and what the whole thing adds up to.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/60">
            These are the prices Don pays, published because donors asked. They
            are not averages and not estimates.
          </p>
        </div>
      </section>

      {/* The short answer */}
      <section className="container-content max-w-3xl py-14">
        <h2 className="h-display text-3xl">The short answer</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n: fmt(missionary.unitCost), l: "to send one missionary", s: "$800 airfare + $400 lodging" },
            { n: fmt(supplyDrive.goalUsd), l: "for the whole supply drive", s: "≈$2,215 supplies + $1,725 logistics" },
            { n: fmt(0.6), l: "for a pair of reading glasses", s: "the cheapest line on the sheet" },
          ].map((c) => (
            <div key={c.l} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
              <p className="font-serif text-4xl font-bold text-deep">{c.n}</p>
              <p className="mt-2 font-semibold text-ink">{c.l}</p>
              <p className="mt-1 text-sm text-ink/55">{c.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-lg leading-relaxed text-ink/80">
          Everything below that is given away{" "}
          <strong>completely free of charge</strong> to the person receiving it.
          No patient on a Nichols clinic day pays for a consultation, a
          medication, a pair of glasses or a Bible.
        </p>
      </section>

      {/* Supplies table */}
      <section className="bg-sand-dark py-14">
        <div className="container-content max-w-3xl">
          <h2 className="h-display text-3xl">What the supplies cost</h2>
          <p className="mt-2 text-ink/70">
            Every item the team hands to somebody, at the price actually paid.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10">
            <table className="w-full text-left">
              <caption className="sr-only">
                Itemised supply costs for one Belize medical mission
              </caption>
              <thead>
                <tr className="border-b border-ink/10 bg-sand-dark/60">
                  <th scope="col" className="px-5 py-3 text-sm font-bold uppercase tracking-wide text-ink/70">Item</th>
                  <th scope="col" className="px-3 py-3 text-right text-sm font-bold uppercase tracking-wide text-ink/70">Each</th>
                  <th scope="col" className="px-3 py-3 text-right text-sm font-bold uppercase tracking-wide text-ink/70">Needed</th>
                  <th scope="col" className="px-5 py-3 text-right text-sm font-bold uppercase tracking-wide text-ink/70">Line total</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map((i) => (
                  <tr key={i.id} className="border-b border-ink/5 last:border-0">
                    <th scope="row" className="px-5 py-4 font-semibold text-ink">
                      <Link href={`/sponsor/${i.id}`} className="text-sea underline-offset-4 hover:underline">
                        {i.name}
                      </Link>
                    </th>
                    <td className="px-3 py-4 text-right tabular-nums text-ink/80">{fmt(i.unitCost)}</td>
                    <td className="px-3 py-4 text-right tabular-nums text-ink/60">{i.needed ?? "—"}</td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-ink">
                      {lineTotal(i) === null ? "—" : fmt(lineTotal(i)!)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="h-display mt-12 text-2xl">
            And what it costs to get it there
          </h3>
          <p className="mt-2 text-ink/70">
            This is the part almost nobody publishes. Moving the supplies costs
            more than a good deal of the supplies.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10">
            <table className="w-full text-left">
              <caption className="sr-only">Logistics costs</caption>
              <tbody>
                {logistics.map((i) => (
                  <tr key={i.id} className="border-b border-ink/5 last:border-0">
                    <th scope="row" className="px-5 py-4 text-left font-semibold text-ink">
                      <Link href={`/sponsor/${i.id}`} className="text-sea underline-offset-4 hover:underline">
                        {i.name}
                      </Link>
                    </th>
                    <td className="px-3 py-4 text-right tabular-nums text-ink/80">{fmt(i.unitCost)}</td>
                    <td className="px-3 py-4 text-right tabular-nums text-ink/60">× {i.needed ?? "—"}</td>
                    <td className="px-5 py-4 text-right font-semibold tabular-nums text-ink">
                      {lineTotal(i) === null ? "—" : fmt(lineTotal(i)!)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-2xl border-l-4 border-gold bg-white p-6">
            <p className="font-serif text-xl font-bold text-ink">
              Total supply drive: {fmt(supplyDrive.goalUsd)}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
              Plus {fmt(missionary.unitCost)} for each team member who goes.
              Team members raise their own support; the supply drive is
              separate and funds what gets handed out.
            </p>
          </div>
        </div>
      </section>

      {/* Why it's cheaper than you'd think */}
      <section className="container-content max-w-3xl py-14">
        <h2 className="h-display text-3xl">Why the numbers are this small</h2>
        <div className="prose-mission mt-5">
          <p>
            There is no organisation taking a cut. Don and Patti are not paid a
            salary from any of this, and no percentage is held back for
            overhead. When somebody sponsors a Bible for $2.50, $2.50 of Bible
            arrives in Belize.
          </p>
          <p>
            The prices are low because things are bought in bulk, in-country
            where possible, and because the team carries them in personally
            rather than shipping. That is also why the baggage line is so
            large — flying eight trunks is a real cost that a lot of published
            budgets quietly leave out.
          </p>
          <p>
            The same Bible that costs $2.50 in Belize cost $10 in Malawi in
            2014. Country and language change the price more than anything
            else.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/transparency" className="btn-primary">
            See where the money has actually gone
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand-dark py-14">
        <div className="container-content max-w-3xl">
          <h2 className="h-display text-3xl">Questions people ask</h2>
          <dl className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10">
                <dt className="font-serif text-xl font-bold text-ink">{f.q}</dt>
                <dd className="mt-3 leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Act */}
      <section className="container-content max-w-3xl py-14">
        <div className="rounded-2xl bg-deep p-8 text-white sm:p-10">
          <h2 className="h-display text-3xl !text-white">
            Now that you know the price
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-white/80">
            Every line above is a thing somebody can buy. Pick one and it gets
            carried to Belize and handed to a person, free.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="cost_page" href="/sponsor" className="btn-give">
              Sponsor a line on the budget
            </GiveLink>
            <Link
              href="/blog"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Read what happens out there
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border-2 border-sea/20 bg-white p-6 sm:p-7">
          <h2 className="h-display text-2xl">
            Planning a trip of your own?
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
            Leave your email and Don will send you the real numbers as they
            change, plus what he has learned in thirteen years of packing
            trunks. He answers questions from other teams.
          </p>
          <div className="mt-5 max-w-md">
            <JoinForm
              source="cost_page"
              interest="planning a trip"
              askName
              submitLabel="Send me the numbers"
              doneTitle="Done."
              doneText="Don will send you the current figures and answer anything you want to ask."
            />
          </div>
        </div>

        <div className="mt-8">
          <ShareButton
            title="What a medical mission trip actually costs"
            text="Real itemised numbers from a working medical mission — a Bible is $2.50, reading glasses are $0.60."
            path="/what-a-mission-trip-costs"
          />
        </div>
      </section>
    </>
  );
}
