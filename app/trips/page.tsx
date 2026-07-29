import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { trips, upcomingTrip } from "@/content/trips";
import { albumBySlug, photo } from "@/content/albums";
import {
  missionTimeline,
  countriesServed,
  ministryExperience,
  ministryExperienceIntro,
  ministryCommitment,
  historyStats,
} from "@/content/history";
import GiveLink from "@/components/GiveLink";
import Countdown from "@/components/Countdown";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/trips` },
  title: "Mission Trips — Every Trip Since 2013",
  description:
    "The complete record of Don & Patti Nichols' mission trips: Malawi, Mozambique, Zambia, the Dominican Republic, and Belize — from July 2013 to the upcoming June 2026 Belize medical mission.",
};

export default function TripsPage() {
  const timeline = [...missionTimeline].reverse();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-deep py-16 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${photo(albumBySlug("malawi")!.cover, 1600)})`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,61,64,0.85) 0%, rgba(10,61,64,0.96) 100%)",
          }}
        />
        <div className="container-content relative">
          <p className="identity-line">The Record</p>
          <h1 className="h-display mt-4 text-4xl !text-white sm:text-5xl lg:text-6xl">
            Every trip since 2013.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            {historyStats.tripCount} mission trips across{" "}
            {countriesServed.length} countries — and the two years they could
            not go. This is the whole record, exactly as Don keeps it.
          </p>
        </div>
      </section>

      {/* The fields */}
      <section className="container-content py-14 sm:py-16">
        <h2 className="h-display text-3xl">The fields</h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Three places, thirteen years. Each one has its own photographs and its
          own story.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {trips.map((trip) => {
            const album = trip.albumSlug ? albumBySlug(trip.albumSlug) : undefined;
            return (
              <Link
                key={trip.slug}
                href={`/trips/${trip.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-deep">
                  {album && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photo(album.cover, 900)}
                      alt={trip.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                  {trip.status === "upcoming" && (
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">
                      Next trip
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-sea">
                    {trip.dateLabel}
                  </p>
                  <h3 className="h-display mt-1 text-2xl">{trip.title}</h3>
                  <p className="mt-3 flex-1 text-ink/75">{trip.summary}</p>
                  <p className="mt-4 text-sm font-semibold text-sea">
                    Read the story
                    <span
                      aria-hidden
                      className="ml-1 inline-block transition group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Next trip callout */}
      {upcomingTrip && (
        <section className="bg-sand-dark py-12">
          <div className="container-content grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow">The next one</p>
              <h2 className="h-display mt-2 text-3xl">{upcomingTrip.title}</h2>
              <p className="mt-3 max-w-xl text-lg text-ink/80">
                {upcomingTrip.summary}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <GiveLink location="trips_next_trip" fund="belize-trip" className="btn-give">
                  Send Them
                </GiveLink>
                <Link href="/sponsor" className="btn-outline">
                  Fill the Trunks
                </Link>
              </div>
            </div>
            {upcomingTrip.startDate ? (
              <Countdown startDate={upcomingTrip.startDate} label="Countdown to departure" />
            ) : (
              <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-ink/5">
                <p className="text-xs font-bold uppercase tracking-widest text-sea">
                  Departing
                </p>
                <p className="h-display mt-2 text-4xl">June 2026</p>
                <p className="mt-2 text-sm text-ink/60">
                  Exact dates announced soon.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Full timeline — Don's record */}
      <section className="container-content py-14 sm:py-16">
        <h2 className="h-display text-3xl">Mission trip timeline</h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Kept by Don Nichols. Newest first.
        </p>

        <ol className="mt-8 border-l-2 border-sand-dark pl-5 sm:pl-7">
          {timeline.map((row) => (
            <li key={row.when + row.year} className="relative pb-8 last:pb-0">
              <span
                aria-hidden
                className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-sand sm:-left-[35px] ${
                  row.gap ? "bg-ink/25" : "bg-gold"
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="font-serif text-lg font-bold text-ink">{row.when}</p>
                {row.location && (
                  <p className="text-sm font-semibold uppercase tracking-widest text-sea">
                    {row.location}
                  </p>
                )}
              </div>
              <p className={`mt-1 ${row.gap ? "italic text-ink/55" : "text-ink/80"}`}>
                {row.focus}
              </p>
              {row.team && <p className="mt-1 text-sm text-ink/55">{row.team}</p>}
              {row.tripSlug && (
                <Link
                  href={`/trips/${row.tripSlug}`}
                  className="mt-1 inline-block text-sm font-semibold text-sea underline"
                >
                  See this field
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Countries + ministry experience — Don's words */}
      <section className="bg-sand-dark py-14">
        <div className="container-content grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="h-display text-2xl">Countries served</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {countriesServed.map((c) => (
                <li
                  key={c}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-sea ring-1 ring-sea/15"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-display text-2xl">Ministry experience</h2>
            <p className="mt-3 text-ink/75">{ministryExperienceIntro}</p>
            <ul className="mt-3 space-y-2">
              {ministryExperience.map((item) => (
                <li key={item} className="flex gap-3 text-ink/85">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container-content mt-10">
          <blockquote className="border-l-4 border-gold bg-white p-6 font-serif text-xl italic leading-relaxed text-ink/90 sm:p-8 sm:text-2xl">
            &ldquo;{ministryCommitment}&rdquo;
            <footer className="mt-4 font-sans text-sm not-italic text-ink/55">
              — Don Nichols
            </footer>
          </blockquote>
        </div>
      </section>

      {/* To the albums */}
      <section className="container-content py-14 text-center">
        <h2 className="h-display text-3xl">See it for yourself</h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-ink/75">
          Hundreds of photographs from every one of these trips.
        </p>
        <Link href="/albums" className="btn-primary mt-6">
          Open the Photo Archive
        </Link>
      </section>
    </>
  );
}
