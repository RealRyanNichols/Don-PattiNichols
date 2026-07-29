import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { whyBelize } from "@/content/belize";
import { upcomingTrip } from "@/content/trips";
import { photos } from "@/lib/photos";
import Countdown from "@/components/Countdown";
import GoalMeter from "@/components/GoalMeter";
import GiveLink from "@/components/GiveLink";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/belize` },
  title: "Why Belize? — The Belize Medical Mission",
  description:
    "Beyond the tourist destinations are hundreds of rural Belizean communities with limited access to healthcare. Learn why Don & Patti Nichols serve in Belize and how your gift carries hope, healing, and the Gospel.",
};

export default function BelizePage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Belize Medical Mission
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">{whyBelize.title}</h1>

          {upcomingTrip ? (
            <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                  Next Trip · {upcomingTrip.dateLabel}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold">{upcomingTrip.title}</h2>
                <div className="mt-4">
                  <GoalMeter goalUsd={upcomingTrip.goalUsd} raisedUsd={upcomingTrip.raisedUsd} dark />
                </div>
                <GiveLink location="belize_hero" fund="belize-trip" className="btn-give mt-5">
                  Fund This Trip
                </GiveLink>
              </div>
              <Countdown startDate={upcomingTrip.startDate} label="Countdown to departure" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <figure className="mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos.anchorSign}
            alt="The Belize Anchor Mission sign, painted with Ephesians 2:22"
            width={1600}
            height={1067}
            className="aspect-[3/2] w-full rounded-2xl bg-sand-dark object-cover shadow-md"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="mt-3 text-center text-sm italic text-ink/60">
            &ldquo;In him you also are being built together into a dwelling place for God by his
            Spirit.&rdquo; — painted on the mission church in Belize
          </figcaption>
        </figure>

        <div className="prose-mission">
          {whyBelize.paragraphs.map((p, i) => (
            <p key={p.slice(0, 32)} className={i === 0 ? "dropcap" : undefined}>
              {p}
            </p>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { n: "400,000+", l: "people call Belize home" },
            { n: "100%", l: "of care given completely free" },
            { n: "$0", l: "charged to any patient, ever" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-ink/10 bg-white p-6 text-center shadow-sm">
              <p className="font-serif text-3xl font-bold text-sea">{s.n}</p>
              <p className="mt-1 text-sm text-ink/70">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-deep p-8 text-white">
          <h2 className="font-serif text-2xl font-bold">
            Carry hope to the villages of Belize
          </h2>
          <p className="mt-2 text-white/80">
            Medical care for families. Reading glasses that restore a livelihood. Study Bibles
            for village pastors. This is what your generosity does.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="belize_bottom" fund="belize-trip" className="btn-give">
              Give to the Belize Mission
            </GiveLink>
            <Link
              href="/trips"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              See Past Trips
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
