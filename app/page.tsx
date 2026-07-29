import Link from "next/link";
import { site } from "@/lib/site";
import { mission } from "@/content/mission";
import { whyBelize } from "@/content/belize";
import { upcomingTrip } from "@/content/trips";
import { sortedPosts } from "@/content/posts";
import { behind } from "@/content/behind";
import { photos } from "@/lib/photos";
import Countdown from "@/components/Countdown";
import VerseRotator from "@/components/VerseRotator";
import GoalMeter from "@/components/GoalMeter";
import GiveLink from "@/components/GiveLink";
import JoinForm from "@/components/JoinForm";
import PostCard from "@/components/PostCard";
import { albums, photo, totalPhotos } from "@/content/albums";

import type { Metadata } from "next";

/*
 * The homepage had no metadata export at all — it inherited everything from
 * the root layout, which meant no canonical tag. Declared here rather than in
 * layout.tsx on purpose: a canonical in the layout would be inherited by every
 * page that doesn't override it, so album and trip pages would each claim to
 * be the homepage.
 */
export const metadata: Metadata = {
  alternates: { canonical: site.url },
};

const journeySteps = behind.journey;

/**
 * One real photograph per journey step, all from Don & Patti's own archive
 * (each verified by eye): the well rig, the Anchor Mission sign, kits packed,
 * trunks rolling, the glasses table, Don with a pastor, a baptism in the sea,
 * and the team.
 */
const journeyPhotos = [
  "1o6QMRqsNqN_NUy-WOggOi8eauNfrX_zj", // 1 The Need — drilling rig, Malawi
  "1FA_f5nIT6gBF49wPpTDgCxLrljxtoQ-q", // 2 The Calling — Anchor Mission sign
  "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z", // 3 The Preparation — kits packed
  "1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA", // 4 The Journey — trunks on the move
  "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej", // 5 The Ministry — the glasses table
  "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF", // 6 The Relationships — Don & a pastor
  "1nVnUudrm76rHU7LTfLjYygjemRx7k6EW", // 7 The Results — baptism in the sea
  "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I", // 8 How You Can Help — the team
];

/**
 * What a gift does — told with the team's own photographs rather than three
 * empty boxes. Each `photo` was picked by eye out of the archive: Patti
 * fitting a man for glasses, the clinic room mid-morning, and hands joined in
 * prayer. `href` sends the reader straight to the thing they just looked at.
 */
const impact = [
  {
    title: "Reading Glasses & Vision Care",
    text: "A simple pair of reading glasses lets someone read again, sew clothing, study God's Word, complete paperwork, or keep earning a living.",
    photo: "1CXDEsZFj1QaEBvcqNg2LH_8h5QqTigYN",
    caption: "A fitting at the vision table — Belize",
    price: "$0.60 a pair",
    href: "/sponsor/reading-glasses",
  },
  {
    title: "Medications & Hygiene Kits",
    text: "Free medical evaluations, medications, and hygiene supplies for families in villages where care is hard to reach and hard to afford.",
    photo: "1ZwwAFnLVQHPshkFvBI35ksl0vbAUMgKx",
    caption: "The clinic, mid-morning — Belize",
    price: "$3 a kit",
    href: "/sponsor/hygiene-kit",
  },
  {
    title: "Bibles & Pastor Support",
    text: "Study Bibles, Gospel literature, and practical encouragement that strengthen village pastors and the local church.",
    photo: "1Q_EcBiYkUEopoM8dsGtO6S8J6DIu8ISP",
    caption: "Don beside a man reading again — Belize",
    price: "$2.50 a Bible",
    href: "/sponsor/bible",
  },
];

export default function HomePage() {
  // Malawi, DR, Belize, and the wells lead the home-page archive strip.
  const featuredAlbums = [
    "malawi",
    "dominican-republic",
    "water-wells",
    "widows-and-orphans",
    "sam-banda",
  ]
    .map((slug) => albums.find((a) => a.slug === slug)!)
    .filter(Boolean);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/*
          The hero photograph — Patti fitting a man for reading glasses in a
          Belize village. A 2000px original from their own archive, so it holds
          up full-bleed. It sits under a heavy teal scrim: the picture supplies
          the warmth, the scrim guarantees the headline still reads at AA on
          every screen. fetchPriority high because if the browser is going to
          treat something here as the Largest Contentful Paint, it should be
          this and it should arrive fast.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo("1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60", 1600)}
          alt="Patti Nichols fitting an older man with a pair of reading glasses at a village clinic in Belize"
          width={1600}
          height={1200}
          fetchPriority="high"
          decoding="async"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[62%_38%] opacity-45"
        />
        {/* layered light + watermark cross */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,61,64,0.96) 0%, rgba(10,61,64,0.88) 38%, rgba(10,61,64,0.60) 70%, rgba(10,61,64,0.45) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 75% -10%, rgba(201,150,46,0.22), transparent 60%), radial-gradient(60% 50% at 10% 110%, rgba(14,107,112,0.55), transparent 65%)",
          }}
        />
        {/*
          Watermark cross. This was a text glyph at 24rem, which made it the
          Largest Contentful Paint element on desktop — meaning the page's
          headline score was hostage to a font file downloading. As an inline
          SVG it paints with the HTML, costs nothing, and is no longer an LCP
          candidate at all. Keep it as vector art.
        */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="currentColor"
          className="pointer-events-none absolute -right-16 -top-28 h-[26rem] w-[26rem] select-none text-white/[0.05] sm:h-[34rem] sm:w-[34rem]"
        >
          <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
        </svg>
        <div className="container-content relative py-16 sm:py-24">
          <p className="identity-line">
            <span>Don &amp; Patti Nichols · Belize Medical Missions</span>
          </p>
          <h1 className="h-display mt-6 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Medical Care for the Body.{" "}
            <span className="italic text-gold">Hope for the Soul.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Free medical clinics, pharmacy services, vision care, and personal evangelism in the
            villages of Belize. Every patient served completely free of charge — because the
            love of Christ should never have a price tag.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <GiveLink location="hero" className="btn-give text-lg">
              Give to the Mission
            </GiveLink>
            <Link href="/belize" className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep">
              The Belize Mission
            </Link>
          </div>

          {upcomingTrip ? (
            <div className="mt-12 rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                    Next Trip · {upcomingTrip.dateLabel}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                    {upcomingTrip.title}
                  </h2>
                  <div className="mt-4 max-w-md">
                    <GoalMeter goalUsd={upcomingTrip.goalUsd} raisedUsd={upcomingTrip.raisedUsd} dark />
                  </div>
                </div>
                <Countdown startDate={upcomingTrip.startDate} label="Countdown to departure" />
              </div>
            </div>
          ) : null}
        </div>

        {/* rotating scripture strip */}
        <div className="relative border-t border-white/10 bg-black/10">
          <div className="container-content py-5 text-center">
            <VerseRotator />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="container-content py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Our Mission</p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Caring for people physically. Introducing them to eternal hope.
            </h2>
            <Link href="/mission" className="btn-primary mt-6">
              Read Our Full Mission
            </Link>
          </div>
          <div className="prose-mission">
            {mission.paragraphs.slice(0, 2).map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>

        {/* The team, on the ground */}
        <figure className="mt-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos.teamPhoto}
            alt="The mission team gathered in front of the Belize Anchor Mission church"
            width={1600}
            height={1067}
            className="aspect-[3/2] w-full rounded-2xl bg-sand-dark object-cover shadow-md"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="mt-3 text-center text-sm italic text-ink/60">
            The mission team in Belize — gathered where the work happens.
          </figcaption>
        </figure>
      </section>

      {/* IMPACT */}
      <section className="bg-sand-dark py-16 sm:py-20">
        <div className="container-content">
          <p className="eyebrow">What Your Gift Does</p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
            Every service, every item, every conversation — completely free.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {impact.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl shadow-lg ring-1 ring-ink/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[30rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo(card.photo, 900)}
                  alt={card.caption}
                  width={900}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                {/* Legibility gradient — dark enough at the bottom to carry
                    white type at AA, clear enough at the top that the
                    photograph stays the loudest thing on the card. */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,61,64,0.94) 0%, rgba(10,61,64,0.80) 32%, rgba(10,61,64,0.20) 62%, rgba(10,61,64,0.05) 100%)",
                  }}
                />
                <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-deep shadow">
                  {card.price}
                </span>
                <div className="relative p-6 sm:p-7">
                  <h3 className="font-serif text-2xl font-bold leading-snug text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/85">
                    {card.text}
                  </p>
                  <p className="mt-4 text-xs italic text-white/55">{card.caption}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold">
                    Sponsor this
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <GiveLink location="impact_section_sponsor" href="/sponsor" className="btn-give">
              Fill the Trunks — Sponsor Supplies
            </GiveLink>
            <GiveLink location="impact_section" className="btn-outline">
              Give Now
            </GiveLink>
            <GiveLink location="impact_section_monthly" href="/give#monthly" className="btn-outline">
              Give Monthly
            </GiveLink>
          </div>
        </div>
      </section>

      {/* WHY BELIZE teaser */}
      <section className="container-content py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/*
            A portrait photograph with a gold rule offset behind it — the frame
            gives the picture weight without a heavy border, and reads as
            deliberate rather than dropped-in.
          */}
          <div className="relative order-2 lg:order-1">
            <span
              aria-hidden
              className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl border-2 border-gold/45 sm:-bottom-5 sm:-left-5"
            />
            <figure className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo("1fpRWkrIGlztXxtCaS3DPwbFc27ubSrQr", 900)}
                  alt="A member of the mission team embracing a woman she has just served in Belize"
                  width={900}
                  height={1125}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm italic text-ink/55">
                Belize, June 2026 — the reason they keep going back.
              </figcaption>
            </figure>
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow">Why Belize?</p>
            <div className="prose-mission">
              {whyBelize.paragraphs.slice(0, 2).map((p) => (
                <p key={p.slice(0, 32)} className="mt-4">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border-l-4 border-gold bg-deep p-7 text-white shadow-lg sm:p-8">
              <p className="font-serif text-xl font-bold leading-snug sm:text-2xl">
                Hundreds of rural communities. Limited healthcare. A rich
                Christian heritage worth strengthening.
              </p>
              <Link href="/belize" className="btn-give mt-6 inline-block">
                See Why We Go
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE ARCHIVE — thirteen years of photographs */}
      <section className="bg-deep py-16 text-white sm:py-20">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                The Archive
              </p>
              <h2 className="h-display mt-2 max-w-2xl text-3xl !text-white sm:text-4xl">
                Thirteen years. Five countries. {totalPhotos} photographs.
              </h2>
              <p className="mt-3 max-w-xl text-white/75">
                Malawi, Mozambique, Zambia, the Dominican Republic, and Belize —
                every picture taken by Don and Patti themselves.
              </p>
            </div>
            <Link
              href="/albums"
              className="text-sm font-bold uppercase tracking-widest text-gold underline-offset-4 hover:underline"
            >
              Open the archive →
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featuredAlbums.map((album, i) => (
              <Link
                key={album.slug}
                href={`/albums/${album.slug}`}
                className={`group relative overflow-hidden rounded-xl ring-1 ring-white/10 ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <div className={i === 0 ? "aspect-square" : "aspect-[4/3]"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo(album.cover, i === 0 ? 900 : 600)}
                    alt={album.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,61,64,0) 45%, rgba(10,61,64,0.9) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <p
                    className={`font-serif font-bold text-white ${
                      i === 0 ? "text-xl sm:text-2xl" : "text-sm sm:text-base"
                    }`}
                  >
                    {album.title}
                  </p>
                  <p className="text-xs text-white/65">{album.era}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THE JOURNEY — every step illustrated by their own photographs */}
      <section className="container-content py-16 sm:py-20">
        <p className="eyebrow">The Story of a Mission</p>
        <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
          From the need to the harvest — how it all works
        </h2>

        {/*
          A photographic path, not a card grid. Each step is one of Don and
          Patti's own photographs with a deep-teal gradient and an oversized
          gold numeral. The center line walks the reader down the journey.
        */}
        <div className="relative mt-12">
          <span
            aria-hidden
            className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-gold/60 via-sea/30 to-gold/60 sm:left-1/2 sm:block"
          />
          <div className="space-y-6 sm:space-y-10">
            {journeySteps.map((s, i) => {
              const img = journeyPhotos[i % journeyPhotos.length];
              const left = i % 2 === 0;
              return (
                <div
                  key={s.step}
                  className={`relative sm:flex ${left ? "sm:justify-start" : "sm:justify-end"}`}
                >
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-sand bg-gold sm:block"
                  />
                  <Link
                    href={s.href}
                    className="group relative block overflow-hidden rounded-2xl shadow-md ring-1 ring-ink/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-[calc(50%-2.5rem)]"
                  >
                    <div className="aspect-[16/9]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo(img, 900)}
                        alt={s.step}
                        width={900}
                        height={506}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(200deg, rgba(10,61,64,0.05) 0%, rgba(10,61,64,0.55) 55%, rgba(10,61,64,0.94) 100%)",
                      }}
                    />
                    <span
                      aria-hidden
                      className="absolute right-4 top-1 font-serif text-7xl font-bold text-gold/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
                    >
                      {i + 1}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {s.step}
                      </h3>
                      <p className="mt-1 max-w-md text-sm leading-relaxed text-white/85">
                        {s.text}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/behind-the-mission" className="btn-outline">
            See What Happens Behind Every Trip
          </Link>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="bg-sand-dark py-16 sm:py-20">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From Don &amp; Patti</p>
              <h2 className="h-display mt-2 text-3xl sm:text-4xl">Latest Updates</h2>
            </div>
            <Link href="/blog" className="font-semibold text-sea hover:underline">
              All posts →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {sortedPosts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* VERSE */}
      <section className="bg-sea py-14 text-center text-white">
        <div className="container-content max-w-3xl">
          <p className="font-serif text-2xl italic leading-relaxed sm:text-3xl">
            &ldquo;{site.verse.text}&rdquo;
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-white/80">
            {site.verse.reference}
          </p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className="container-content py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Stay Connected</p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">Follow the mission by email</h2>
            <p className="mt-4 text-lg text-ink/75">
              Trip announcements, field updates, and words from Don &amp; Patti — straight to
              your inbox. No spam, ever.
            </p>
          </div>
          <JoinForm source="homepage" askName askPhone offerTexts submitLabel="Follow the mission" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-deep py-16 text-center text-white">
        <div className="container-content max-w-3xl">
          <h2 className="h-display text-3xl !text-white sm:text-4xl">
            Partner with the mission today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Your generosity carries medical care, Bibles, and the hope of Jesus Christ to
            families who might otherwise go without.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GiveLink location="footer_cta" className="btn-give text-lg">
              Give to the Mission
            </GiveLink>
            <Link
              href="/contact"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Send a Prayer Request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
