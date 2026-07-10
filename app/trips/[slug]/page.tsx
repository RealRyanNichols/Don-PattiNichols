import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import GalleryLightbox from "@/components/GalleryLightbox";
import GiveLink from "@/components/GiveLink";
import { getTrip, trips } from "@/content/trips";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const trip = getTrip(params.slug);
  if (!trip) return {};
  return {
    title: `${trip.title} — ${trip.dateLabel}`,
    description: trip.summary,
  };
}

export default function TripPage({ params }: Props) {
  const trip = getTrip(params.slug);
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
                <p className="text-sm text-white/75">
                  Trip fundraising goal will be posted soon. Every gift given now goes straight to
                  the mission.
                </p>
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
