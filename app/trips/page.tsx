import type { Metadata } from "next";
import Link from "next/link";
import { getAllTrips } from "@/lib/trips-live";
import { money } from "@/lib/format";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = socialMetadata({
  title: "Mission Trips",
  description: "Upcoming and past medical mission trips with Don & Patti Nichols — free clinics, pharmacy services, vision care, and evangelism in the villages of Belize.",
  path: "/trips",
  eyebrow: "The Work in the Field",
  image: "/images/belize-2026-06.jpg",
});

/** Refresh live trip data (and fundraising progress) every 5 minutes. */
export const revalidate = 300;

export default async function TripsPage() {
  const trips = await getAllTrips();
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Work in the Field
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">Mission Trips</h1>
        </div>
      </section>

      <section className="container-content py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <article
              key={trip.slug}
              className="flex h-full flex-col rounded-xl border border-ink/10 bg-white p-7 shadow-sm"
            >
              <p className="eyebrow">
                {trip.status === "completed" ? "Completed Trip" : "Upcoming Trip"} ·{" "}
                {trip.dateLabel}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold">
                <Link href={`/trips/${trip.slug}`} className="hover:text-sea">
                  {trip.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm font-semibold text-ink/60">{trip.location}</p>
              <p className="mt-3 flex-1 text-ink/75">{trip.summary}</p>
              {trip.status === "upcoming" ? (
                <div className="mt-5">
                  {trip.goalUsd ? (
                    <>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-semibold text-ink">{money(trip.raisedUsd)} raised</span>
                        <span className="text-ink/60">of {money(trip.goalUsd)}</span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
                          style={{
                            width: `${Math.max(1, Math.min(100, Math.round((trip.raisedUsd / trip.goalUsd) * 100)))}%`,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-ink/70">
                      Trip fundraising goal will be posted soon. Every gift given now goes straight
                      to the mission.
                    </p>
                  )}
                </div>
              ) : null}
              <Link
                href={`/trips/${trip.slug}`}
                className="mt-5 font-semibold text-sea hover:underline"
              >
                {trip.status === "upcoming" ? "Trip details & giving →" : "Read about this trip →"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
