import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trips, getTrip, tripPhotos, tripCountFor } from "@/content/trips";
import { albumBySlug, photo } from "@/content/albums";
import { missionTimeline } from "@/content/history";
import Countdown from "@/components/Countdown";
import GoalMeter from "@/components/GoalMeter";
import GiveLink from "@/components/GiveLink";
import PhotoWall from "@/components/PhotoWall";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const trip = getTrip(params.slug);
  if (!trip) return {};
  const album = trip.albumSlug ? albumBySlug(trip.albumSlug) : undefined;
  return {
    title: `${trip.title} — ${trip.dateLabel}`,
    description: trip.summary,
    alternates: { canonical: `${site.url}/trips/${trip.slug}` },
    openGraph: {
      title: `${trip.title} — Don & Patti Nichols`,
      description: trip.summary,
      images: album ? [photo(album.cover, 1200)] : undefined,
    },
  };
}

export default function TripPage({ params }: { params: { slug: string } }) {
  const trip = getTrip(params.slug);
  if (!trip) notFound();

  const album = trip.albumSlug ? albumBySlug(trip.albumSlug) : undefined;
  const gallery = tripPhotos(trip);
  const related = (trip.relatedAlbums ?? [])
    .map((s) => albumBySlug(s))
    .filter(Boolean);

  const country = trip.location.split(",")[0].trim();
  const years = missionTimeline
    .filter((t) => t.location?.includes(country))
    .sort((a, b) => a.year - b.year);

  return (
    <>
      {/* Cover */}
      <section className="relative">
        <div className="relative h-[44vh] min-h-[290px] w-full overflow-hidden bg-deep sm:h-[56vh]">
          {album && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photo(album.cover, 2000)}
              alt={trip.title}
              width={2000}
              height={1125}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,61,64,0.55) 0%, rgba(10,61,64,0.4) 40%, rgba(10,61,64,0.96) 100%)",
            }}
          />
          <div className="container-content absolute inset-x-0 bottom-0 pb-8">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold transition hover:text-white"
            >
              <span aria-hidden>←</span> All trips
            </Link>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/70">
              {trip.dateLabel} · {trip.location}
            </p>
            <h1 className="h-display mt-1 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
              {trip.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Upcoming: goal + countdown */}
      {trip.status === "upcoming" && (
        <section className="bg-deep pb-12 text-white">
          <div className="container-content flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md flex-1">
              <GoalMeter goalUsd={trip.goalUsd} raisedUsd={trip.raisedUsd} dark />
              <GiveLink
                location="trip_page"
                fund="belize-trip"
                className="btn-give mt-5"
              >
                Fund This Trip
              </GiveLink>
            </div>
            <Countdown startDate={trip.startDate} label="Countdown to departure" />
          </div>
        </section>
      )}

      {/* Story */}
      <section className="container-content py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="max-w-3xl">
            <div className="prose-mission dropcap">
              {trip.body.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-sand-dark p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sea">
                Trips to this field
              </h2>
              <p className="h-display mt-2 text-4xl">{tripCountFor(trip)}</p>
              <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
                {years.map((y) => (
                  <li key={y.when} className="flex justify-between gap-3">
                    <span className="font-semibold text-ink">{y.when}</span>
                    <span className="text-right text-ink/60">{y.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
            {album && (
              <Link
                href={`/albums/${album.slug}`}
                className="block rounded-2xl bg-deep p-5 text-white transition hover:bg-sea-dark"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  Full album
                </p>
                <p className="mt-1 font-serif text-xl font-bold">{album.title}</p>
                <p className="mt-1 text-sm text-white/70">
                  {album.photos.length} photographs →
                </p>
              </Link>
            )}
          </aside>
        </div>

        {gallery.length > 0 ? (
          <>
            <div className="divider-cross" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
              </svg>
            </div>
            <h2 className="h-display mb-6 text-2xl">From the field</h2>
            <PhotoWall ids={gallery} albumTitle={trip.title} initialCount={18} />
          </>
        ) : (
          <p className="mt-10 rounded-xl bg-sand-dark p-6 text-ink/70">
            Photographs from this trip are coming soon.
          </p>
        )}
      </section>

      {/* Related albums */}
      {related.length > 0 && (
        <section className="bg-sand-dark py-14">
          <div className="container-content">
            <h2 className="h-display text-2xl">The work that came out of it</h2>
            <p className="mt-2 max-w-2xl text-ink/70">
              Each of these grew out of the trips above.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((a) => (
                <Link
                  key={a!.slug}
                  href={`/albums/${a!.slug}`}
                  className="group overflow-hidden rounded-xl bg-deep ring-1 ring-ink/5"
                >
                  <div className="aspect-[4/3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo(a!.cover, 600)}
                      alt={a!.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-serif font-bold text-white">{a!.title}</p>
                    <p className="mt-0.5 text-xs text-white/60">
                      {a!.photos.length} photographs
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-content py-12">
        <div className="flex flex-col gap-3 sm:flex-row">
          <GiveLink location="trip_page_bottom" className="btn-give">
            Give to the Mission
          </GiveLink>
          <Link href="/trips" className="btn-outline">
            All Trips
          </Link>
          <Link href="/albums" className="btn-outline">
            Photo Archive
          </Link>
        </div>
      </section>
    </>
  );
}
