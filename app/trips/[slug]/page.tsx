import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import GalleryLightbox from "@/components/GalleryLightbox";
import GiveLink from "@/components/GiveLink";
import { trips as seedTrips } from "@/content/trips";
import { getTripLive } from "@/lib/trips-live";
import { money } from "@/lib/format";
import { socialMetadata } from "@/lib/seo";

type Props = { params: { slug: string } };

/** Refresh live trip data (and fundraising progress) every 5 minutes. */
export const revalidate = 300;
/** Trips added later from the dashboard still render on demand. */
export const dynamicParams = true;

export function generateStaticParams() {
  return seedTrips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trip = await getTripLive(params.slug);
  if (!trip) return {};
  return socialMetadata({
    title: `${trip.title} — ${trip.dateLabel}`,
    description: trip.summary,
    path: `/trips/${trip.slug}`,
    eyebrow: `${trip.status === "completed" ? "Completed Trip" : "Upcoming Trip"} · ${trip.location}`,
    image: trip.photos[0]?.src || "/images/flight-to-belize.jpg",
  });
}

export default async function TripPage({ params }: Props) {
  const trip = await getTripLive(params.slug);
  if (!trip) notFound();

  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {trip.status === "completed" ? "Completed Trip" : "Upcoming Trip"} · {trip.dateLabel} ·{" "}
            {trip.location}
          </p>
          <h1 className="h-display mt-2 max-w-3xl text-4xl !text-white sm:text-5xl">
            {trip.title}
          </h1>
          {trip.status === "upcoming" ? (
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md flex-1">
                {trip.goalUsd ? (
                  <div>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-white">
                        {money(trip.raisedUsd)} raised
                      </span>
                      <span className="text-white/70">of {money(trip.goalUsd)}</span>
                    </div>
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
                        style={{
                          width: `${Math.max(1, Math.min(100, Math.round((trip.raisedUsd / trip.goalUsd) * 100)))}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/75">
                    Trip fundraising goal will be posted soon. Every gift given now goes straight to
                    the mission.
                  </p>
                )}
                <GiveLink location="trip_page" fund="belize-trip" className="btn-give mt-5">
                  Fund This Trip
                </GiveLink>
              </div>
              <Countdown startDate={trip.startDate} label="Countdown to departure" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {trip.body.map((text) => (
            <p key={text.slice(0, 32)}>{text}</p>
          ))}
        </div>

        {trip.photos.length > 0 ? (
          <GalleryLightbox
            photos={trip.photos}
            gridClassName="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3"
            imgClassName="aspect-square w-full rounded-lg object-cover"
          />
        ) : (
          <p className="mt-10 rounded-xl bg-sand-dark p-6 text-ink/70">
            Photos from this trip are coming soon.
          </p>
        )}

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <GiveLink location="trip_page_bottom" className="btn-give">
            Give to the Mission
          </GiveLink>
          <Link href="/trips" className="btn-outline">
            All Trips
          </Link>
        </div>
      </section>
    </>
  );
}
