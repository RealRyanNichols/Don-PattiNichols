import type { Metadata } from "next";
import Link from "next/link";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";
import { supplyDrive } from "@/content/supplies";
import { missionaryCost } from "@/content/support";
import { historyStats, countriesServed } from "@/content/history";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage, faqLd } from "@/lib/seo";
import { site } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import CopyButton from "@/components/CopyButton";
import GiveLink from "@/components/GiveLink";

const TITLE = "For Churches — Invite Don Nichols to Speak & Partner With the Mission";
const DESC =
  "Invite Don Nichols to share the Belize medical mission at your church, and five concrete ways a congregation partners: sponsor a missionary, fill a trunk, host a hygiene-kit day, pray through the seven-day guide, and print the poster.";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

export const metadata: Metadata = createPageMetadata({
  path: "/churches",
  title: TITLE,
  description: DESC,
  keywords: keywords("churches", "core", "giving"),
  image: ogCardImage({
    eyebrow: "For churches",
    title: "Invite Don to speak. Fill a trunk together.",
    line: "Five concrete ways a congregation partners with the Belize medical mission.",
    photo: "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I",
  }),
});

const HERO = "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I";

const price = (id: string) => usd(supplyDrive.items.find((i) => i.id === id)!.unitCost);

const ways = [
  {
    title: "Sponsor a missionary",
    text: `${usd(missionaryCost.total)} sends one unpaid volunteer — ${usd(800)} airfare, ${usd(400)} lodging, meals and ground transport. A Sunday-school class can do it in a month.`,
    href: "/sponsor/missionary",
    cta: "Sponsor one",
  },
  {
    title: "Fill a trunk",
    text: `A trunk is ${price("trunk")}, it flies for ${price("baggage")}, and it carries fifty pounds of Bibles at ${price("bible")}, hygiene kits at ${price("hygiene-kit")} and reading glasses at ${price("reading-glasses")}. Pick the line your church covers.`,
    href: "/sponsor",
    cta: "Fill the trunks",
  },
  {
    title: "Host a hygiene-kit day",
    text: "Towel, sewing kit, toothbrush, toothpaste, hair tie, lip balm, Gospel booklet. The planner sizes the shopping list for any number of kits and prints the checklist for the table.",
    href: "/tools/hygiene-kit-party",
    cta: "Plan a kit day",
  },
  {
    title: "Pray for seven days",
    text: "One day for each stage of a trip, with Scripture and the four things Don asks for. Print the cards, hand them out the Sunday before a team leaves.",
    href: "/tools/prayer-cards",
    cta: "Print the cards",
  },
  {
    title: "Invite Don to speak",
    text: "For years Don and Patti have shared the mission face to face, church by church. Use the form below, and print a poster with your church's name and a QR code for the lobby.",
    href: "#invite",
    cta: "Invite Don",
  },
];

const churchFaqs = [
  {
    q: "What does Don talk about when he visits a church?",
    a: "The mission in his own words: free medical clinics, pharmacy services, vision care and personal evangelism in the villages of Belize, why the team goes, what a gift actually buys, and what God has done across thirteen years in Malawi, the Dominican Republic and Belize.",
  },
  {
    q: "Is there a cost to have Don speak?",
    a: "Send an invitation through the form and Don will talk through the details with you directly. This site makes no claim about fees or availability on his behalf.",
  },
  {
    q: "Can our church designate a gift to something specific?",
    a: `Yes. Fill the Trunks lets a church sponsor the exact item — Bibles at ${price("bible")}, hygiene kits at ${price("hygiene-kit")}, reading glasses at ${price("reading-glasses")}, a trunk at ${price("trunk")}, a missionary at ${usd(missionaryCost.total)} — and every gift goes through PayPal with the item name recorded.`,
  },
  {
    q: "Is a church's gift tax-deductible?",
    a: "Details for tax-deductible giving through the mission's sponsoring organization are being finalized and will be posted on the Give page. Until then the site makes no claim about deductibility.",
  },
];

const bulletin = `Don & Patti Nichols — Medical Care for the Body. Hope for the Soul.
Free medical clinics, reading glasses, hygiene kits, Bibles and the Gospel in the villages of Belize — ${historyStats.tripCount} mission trips across ${countriesServed.length} countries since ${historyStats.firstYear}. Every patient is served free of charge. A Bible is ${price("bible")}. Reading glasses are ${price("reading-glasses")}. A missionary is ${usd(missionaryCost.total)}. Every number is published.
Give, pray, or follow the mission at ${site.url.replace("https://", "")}`;

export default function ChurchesPage() {
  return (
    <>
      <JsonLd data={faqLd(churchFaqs)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(HERO, 1600)}
          srcSet={photoSrcSet(HERO, [900, 1600, 2000, 2400])}
          sizes="100vw"
          alt={photoAlt(HERO, "For churches", 0)}
          width={1600}
          height={1067}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_35%] opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,61,64,0.97) 0%, rgba(10,61,64,0.88) 45%, rgba(10,61,64,0.55) 100%)",
          }}
        />
        <div className="container-content relative py-16 sm:py-20">
          <Breadcrumbs dark crumbs={[{ name: "For churches", path: "/churches" }]} />
          <p className="identity-line mt-6">For pastors, missions committees &amp; Sunday-school classes</p>
          <h1 className="h-display mt-5 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Invite Don to speak. Fill a trunk together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            For years Don and Patti have shared the mission the same way — face
            to face, church by church, one conversation at a time. This page is
            for the church that wants to be next: what a visit looks like, five
            ways to partner, and everything you need to print.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#invite" className="btn-give">
              Invite Don to speak
            </a>
            <Link
              href="/tools/church-poster"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Make the poster
            </Link>
          </div>
        </div>
      </section>

      {/* Ways to partner */}
      <section className="container-content py-16 sm:py-20">
        <p className="eyebrow">Five ways a church partners</p>
        <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
          Pick one. Every one of them ends in a village in Belize.
        </h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ways.map((w, i) => (
            <li
              key={w.title}
              className="reveal flex flex-col rounded-2xl border border-ink/10 border-t-4 border-t-gold bg-white p-6 shadow-sm"
            >
              <span className="font-serif text-4xl font-bold text-gold/70">{i + 1}</span>
              <h3 className="mt-2 font-serif text-xl font-bold text-ink">{w.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink/75">{w.text}</p>
              <Link
                href={w.href}
                className="mt-5 text-sm font-bold uppercase tracking-widest text-sea hover:underline"
              >
                {w.cta} →
              </Link>
            </li>
          ))}
          <li className="reveal flex flex-col justify-center rounded-2xl bg-deep p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              And always
            </p>
            <p className="mt-2 font-serif text-xl font-bold">
              Ask for the receipts.
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-white/80">
              The Open Book page shows recorded gifts and expenses; the cost
              page shows every price Don pays. A missions committee can read
              both before it votes.
            </p>
            <Link href="/transparency" className="mt-4 text-sm font-bold uppercase tracking-widest text-gold hover:underline">
              Open Book →
            </Link>
          </li>
        </ol>
      </section>

      {/* Printables */}
      <section className="bg-sand-dark py-16 sm:py-20">
        <div className="container-content grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">For the lobby and the bulletin</p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Everything you need to print
            </h2>
            <div className="mt-8 space-y-4">
              <Link
                href="/tools/church-poster"
                className="group flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 transition hover:shadow-md"
              >
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo("1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60", 300)}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-ink group-hover:text-sea">
                    Poster with your church&rsquo;s name and a QR code
                  </p>
                  <p className="mt-1 text-sm text-ink/65">
                    Type the church, the date and the time; download a print-ready 8½×11.
                  </p>
                </div>
              </Link>
              <Link
                href="/tools/prayer-cards"
                className="group flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 transition hover:shadow-md"
              >
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-sea/10 font-serif text-3xl font-bold text-sea">
                  7
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-ink group-hover:text-sea">
                    Seven-day prayer cards
                  </p>
                  <p className="mt-1 text-sm text-ink/65">
                    One sheet, seven days, Scripture and Don&rsquo;s four requests.
                  </p>
                </div>
              </Link>
              <Link
                href="/tools/hygiene-kit-party"
                className="group flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 transition hover:shadow-md"
              >
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-gold/15 font-serif text-2xl font-bold text-gold-dark">
                  $3
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-ink group-hover:text-sea">
                    Hygiene-kit checklist and shopping list
                  </p>
                  <p className="mt-1 text-sm text-ink/65">
                    Sized to however many kits your church will make.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="reveal rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-7">
            <p className="eyebrow">Bulletin text</p>
            <h3 className="h-display mt-2 text-2xl">Paste this in the bulletin</h3>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-sand-dark p-4 font-sans text-[15px] leading-relaxed text-ink/85">
              {bulletin}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={bulletin} label="Copy the bulletin text" what="bulletin" />
              <CopyButton
                text={site.url}
                label="Copy the website address"
                what="site_url"
              />
            </div>
            <p className="mt-4 text-xs text-ink/50">
              Every number in it is live from Don&rsquo;s published budget. If a price changes on the site, come back and copy it again.
            </p>
          </div>
        </div>
      </section>

      {/* Invite */}
      <section id="invite" className="container-content scroll-mt-24 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Invite Don to speak</p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Tell him about your church
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              A Sunday morning, a Wednesday night, a missions conference, a
              men&rsquo;s breakfast. Say who you are, where you are, and when.
              Every message is read personally.
            </p>
            <dl className="mt-8 space-y-4">
              {churchFaqs.map((f) => (
                <div key={f.q} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10">
                  <dt className="font-serif text-lg font-bold text-ink">{f.q}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink/75">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink/10 sm:p-8">
            <ContactForm defaultTopic="speaking" />
          </div>
        </div>
      </section>

      <section className="bg-deep py-14 text-center text-white">
        <div className="container-content max-w-3xl">
          <h2 className="h-display text-3xl !text-white">
            Your church could send the next trunk.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            {historyStats.tripCount} trips, {countriesServed.length} countries, every patient served free — because congregations decided to.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GiveLink location="churches_bottom" href="/sponsor" className="btn-give text-lg">
              Fill the Trunks
            </GiveLink>
            <Link
              href="/what-a-mission-trip-costs"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              See what it costs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
