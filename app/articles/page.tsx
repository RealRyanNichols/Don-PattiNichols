import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/content/articles";
import { chartById } from "@/content/charts";
import { supplyDrive } from "@/content/supplies";
import { logisticsBudget } from "@/content/support";
import { historyStats, missionTimeline, countriesServed } from "@/content/history";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ResourceCard from "@/components/ResourceCard";
import ChartFigure from "@/components/charts/ChartFigure";
import JoinForm from "@/components/JoinForm";

const HERO = "1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop";
const TITLE = "Mission Trips by the Numbers — Charts, Quizzes & Calculators";
const DESC =
  "Where a mission donation goes, what $25 buys, thirteen years of trips charted, the math of monthly giving, a quiz, a 90-day checklist and fundraising ideas — every number from Don Nichols' published budget and trip record.";

export const metadata: Metadata = createPageMetadata({
  path: "/articles",
  title: TITLE,
  description: DESC,
  keywords: keywords(
    ["mission trip statistics", "where does my donation go", "mission trip budget breakdown", "medical missions quiz", "mission trip fundraising ideas"],
    "costs",
    "giving",
    "core",
  ),
  image: ogCardImage({
    eyebrow: "Articles",
    title: "Mission trips, by the numbers",
    line: "Charts, calculators and a quiz built from Don Nichols' real budget and thirteen years of trips.",
    meta: `${articles.length} articles`,
    photo: HERO,
  }),
});

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

export default function ArticlesPage() {
  const logisticsPct = Math.round((logisticsBudget.total / supplyDrive.goalUsd) * 100);
  const tripCount = missionTimeline.filter((t) => !t.gap).length;
  const teaser = chartById("trips-per-year");

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mission trips by the numbers",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${site.url}/articles/${a.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(HERO, 1600)}
          srcSet={photoSrcSet(HERO, [900, 1600, 2000, 2400])}
          sizes="100vw"
          alt={photoAlt(HERO, "Articles", 0)}
          width={1600}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,61,64,0.97) 0%, rgba(10,61,64,0.90) 40%, rgba(10,61,64,0.55) 100%)",
          }}
        />
        <div className="container-content relative py-16 sm:py-20">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Resources", path: "/resources" },
              { name: "Articles", path: "/articles" },
            ]}
          />
          <p className="identity-line mt-6">By the numbers</p>
          <h1 className="h-display mt-5 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Nobody else publishes a mission budget to the dime. Here it is, charted.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Where a donation goes, what twenty-five dollars buys, thirteen
            years of trips, the math of a monthly gift. Every chart reads
            from Don&rsquo;s own budget and trip record. Every tool runs in
            your browser. Every one is free to share.
          </p>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            {[
              { value: `${logisticsPct}%`, label: "of a supply drive is logistics" },
              { value: String(tripCount), label: `trips since ${historyStats.firstYear}` },
              { value: usd(supplyDrive.goalUsd), label: "one trip's supply drive" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/15 sm:p-4">
                <p className="font-serif text-2xl font-bold text-gold sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-white/75 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section id="articles" className="container-content py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Articles</p>
            <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
              Read it, play with it, share it
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink/60">
            Charts derive from the same files the rest of the site reads. If
            Don changes what a Bible costs, every chart follows.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <div key={a.slug} className="reveal">
              <ResourceCard
                href={`/articles/${a.slug}`}
                title={a.title}
                blurb={a.description}
                photoId={a.hero}
                kind={a.eyebrow}
                eager={i < 3}
              />
            </div>
          ))}
        </div>
      </section>

      {/* One chart, right here */}
      {teaser && (
        <section className="bg-sand-dark py-16 sm:py-20">
          <div className="container-content grid items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow">A taste</p>
              <h2 className="h-display mt-2 text-3xl sm:text-4xl">
                {tripCount} trips. {countriesServed.length} countries. Three years with none.
              </h2>
              <p className="mt-4 text-ink/70">
                Don keeps the timeline himself, including the years the team
                could not go and why. The article puts the whole record in
                charts, with every photograph from those years.
              </p>
              <Link href="/articles/mission-trip-timeline-in-charts" className="btn-primary mt-6">
                See thirteen years in charts
              </Link>
            </div>
            <ChartFigure spec={teaser} sharePath="/articles/mission-trip-timeline-in-charts" />
          </div>
        </section>
      )}

      {/* Follow */}
      <section className="container-content py-16 sm:py-20">
        <div className="reveal grid items-center gap-8 rounded-2xl border-2 border-sea/20 bg-white p-7 sm:p-9 lg:grid-cols-2">
          <div>
            <p className="eyebrow">New numbers as they come</p>
            <h2 className="h-display mt-2 text-2xl sm:text-3xl">
              Get the next article, and the trip texts
            </h2>
            <p className="mt-3 text-ink/70">
              Don publishes the real budget. Leave your name and number and
              you will get it as it changes, plus a text when the team lands
              and when they get home.
            </p>
          </div>
          <JoinForm
            source="articles_hub"
            interest="articles"
            askName
            askPhone
            offerTexts
            submitLabel="Send me the next one"
          />
        </div>
        <p className="mt-8 text-sm text-ink/60">
          Looking for the how-to guides, the calculators and the printables?
          They are on the{" "}
          <Link href="/resources" className="font-semibold text-sea underline">
            Resources
          </Link>{" "}
          page.
        </p>
      </section>
    </>
  );
}
