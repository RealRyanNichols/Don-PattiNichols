import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import {
  thankYouLetter,
  thankYouSignature,
  waysGiven,
  thankYouNotes,
} from "@/content/gratitude";
import { albumBySlug, photo } from "@/content/albums";
import { historyStats } from "@/content/history";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/thank-you` },
  title: "Thank You",
  description:
    "A word of thanks from Don & Patti Nichols to everyone who has given, prayed, packed a trunk, or carried one — thirteen years of mission work made possible by people who gave.",
};

export default function ThankYouPage() {
  const well = albumBySlug("water-wells");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-deep py-16 text-white sm:py-20">
        {well && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${photo(well.cover, 1600)})`,
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,61,64,0.86) 0%, rgba(10,61,64,0.96) 100%)",
          }}
        />
        <div className="container-content relative text-center">
          <p className="identity-line justify-center">From Don &amp; Patti</p>
          <h1 className="h-display mx-auto mt-5 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Thank you.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            None of this was ours to do alone, and we have never pretended it
            was.
          </p>
        </div>
      </section>

      {/* The letter */}
      <section className="container-content py-14 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="prose-mission dropcap">
            {thankYouLetter.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <p className="mt-8 font-serif text-2xl font-bold text-sea">
            — {thankYouSignature}
          </p>
        </div>

        <div className="divider-cross" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
          </svg>
        </div>

        {/* What giving built */}
        <div className="rounded-2xl bg-sand-dark p-7 sm:p-10">
          <h2 className="h-display text-center text-3xl">
            What your giving has already built
          </h2>
          <dl className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-sea">
                Years
              </dt>
              <dd className="h-display mt-1 text-4xl">13</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-sea">
                Trips
              </dt>
              <dd className="h-display mt-1 text-4xl">{historyStats.tripCount}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-sea">
                Countries
              </dt>
              <dd className="h-display mt-1 text-4xl">
                {historyStats.countryCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-widest text-sea">
                Charged to patients
              </dt>
              <dd className="h-display mt-1 text-4xl">$0</dd>
            </div>
          </dl>
          <p className="mt-6 text-center text-ink/70">
            Every clinic, every Bible, every pair of reading glasses — given free
            of charge, every single time.
          </p>
          <div className="mt-6 text-center">
            <Link href="/albums" className="btn-outline">
              See What It Looks Like
            </Link>
          </div>
        </div>
      </section>

      {/* Ways people gave */}
      <section className="container-content pb-14">
        <h2 className="h-display text-3xl">This page is for all of you</h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Support has never come in only one form.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {waysGiven.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5"
            >
              <h3 className="font-serif text-lg font-bold text-ink">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes from Don & Patti */}
      <section className="bg-sand-dark py-14">
        <div className="container-content">
          <h2 className="h-display text-3xl">Notes from Don &amp; Patti</h2>
          <p className="mt-3 max-w-2xl text-ink/70">
            Thank-you notes they write themselves, to the people who gave.
          </p>

          {thankYouNotes.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {thankYouNotes.map((note) => (
                <figure
                  key={note.id}
                  className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    To {note.to}
                  </p>
                  <blockquote className="mt-3 flex-1 font-serif text-lg leading-relaxed text-ink/90">
                    {note.body}
                  </blockquote>
                  {note.forWhat && (
                    <p className="mt-4 rounded-lg bg-sand px-3 py-2 text-sm text-ink/70">
                      Your gift became: {note.forWhat}
                    </p>
                  )}
                  <figcaption className="mt-4 border-t border-ink/10 pt-3 text-sm text-ink/55">
                    {note.from} · {note.date}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-ink/15 bg-white/60 p-10 text-center">
              <p className="font-serif text-xl text-ink/70">
                Don and Patti are writing their first notes now.
              </p>
              <p className="mx-auto mt-2 max-w-lg text-ink/55">
                They post them here themselves — no ghostwriting, no form
                letters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Gentle CTA */}
      <section className="container-content py-14 text-center">
        <h2 className="h-display text-3xl">
          If you have not given, there is still a trip to send.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-ink/75">
          Belize is next. Nothing about it is funded by anyone but people who
          decide to.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/give" className="btn-give">
            Give to the Mission
          </Link>
          <Link href="/sponsor" className="btn-outline">
            Fill the Trunks
          </Link>
        </div>
      </section>
    </>
  );
}
