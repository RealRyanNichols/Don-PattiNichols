import type { Metadata } from "next";
import Link from "next/link";
import Countdown from "@/components/Countdown";
import GiveLink from "@/components/GiveLink";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why Belize? — The Belize Medical Mission",
  description:
    "Beyond the tourist destinations are hundreds of rural Belizean communities with limited access to healthcare. Learn why Don & Patti Nichols serve in Belize and how your gift carries hope, healing, and the Gospel.",
};

import { belizeParagraphs } from "@/content/belize";

const stats = [
  { value: "400,000+", label: "people call Belize home" },
  { value: "100%", label: "of care given completely free" },
  { value: "$0", label: "charged to any patient, ever" },
];

export default function BelizePage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Belize Medical Mission
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">Why Belize?</h1>

          <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                Next Trip · {site.trip.dateLabel || "Dates announced soon"}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold">{site.trip.title}</h2>
              <div className="mt-4">
                <p className="text-sm text-white/75">
                  Trip fundraising goal will be posted soon. Every gift given now goes straight to
                  the mission.
                </p>
              </div>
              <GiveLink location="belize_hero" fund="belize-trip" className="btn-give mt-5">
                Fund This Trip
              </GiveLink>
            </div>
            <Countdown startDate={site.trip.startDate} label="Countdown to departure" />
          </div>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <figure className="mb-10">
          <img
            src={photos.anchorSign}
            alt="The Belize Anchor Mission sign, painted with Ephesians 2:22"
            className="w-full rounded-2xl object-cover shadow-md"
            loading="lazy"
          />
          <figcaption className="mt-3 text-center text-sm italic text-ink/60">
            &ldquo;In him you also are being built together into a dwelling place for God by his
            Spirit.&rdquo; &mdash; painted on the mission church in Belize
          </figcaption>
        </figure>

        <div className="prose-mission">
          {belizeParagraphs.map((text, i) => (
            <p key={text.slice(0, 32)} className={i === 0 ? "dropcap" : undefined}>
              {text}
            </p>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-ink/10 bg-white p-6 text-center shadow-sm"
            >
              <p className="font-serif text-3xl font-bold text-sea">{stat.value}</p>
              <p className="mt-1 text-sm text-ink/70">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-deep p-8 text-white">
          <h2 className="font-serif text-2xl font-bold">Carry hope to the villages of Belize</h2>
          <p className="mt-2 text-white/80">
            Medical care for families. Reading glasses that restore a livelihood. Study Bibles for
            village pastors. This is what your generosity does.
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
