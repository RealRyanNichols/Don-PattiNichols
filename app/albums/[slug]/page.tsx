import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums, albumBySlug, photo } from "@/content/albums";
import { missionTimeline } from "@/content/history";
import PhotoWall from "@/components/PhotoWall";
import PageViews from "@/components/PageViews";
import GiveLink from "@/components/GiveLink";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return albums.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const album = albumBySlug(params.slug);
  if (!album) return {};
  return {
    title: `${album.title} — Photo Album`,
    description: album.blurb,
    alternates: { canonical: `${site.url}/albums/${album.slug}` },
    openGraph: {
      title: `${album.title} — Don & Patti Nichols`,
      description: album.blurb,
      images: [photo(album.cover, 1200)],
    },
  };
}

/** Trips from Don's timeline that match this album's country, newest first. */
function relatedTrips(albumSlug: string) {
  const match: Record<string, string> = {
    malawi: "Malawi",
    "water-wells": "Malawi",
    "widows-and-orphans": "Malawi",
    "sam-banda": "Malawi",
    translators: "Malawi",
    "witch-doctors": "Malawi",
    "ministry-items": "Malawi",
    "dominican-republic": "Dominican Republic",
    belize: "Belize",
  };
  const country = match[albumSlug];
  if (!country) return [];
  return missionTimeline
    .filter((t) => t.location?.includes(country))
    .sort((a, b) => b.year - a.year);
}

export default function AlbumPage({ params }: { params: { slug: string } }) {
  const album = albumBySlug(params.slug);
  if (!album) notFound();

  const trips = relatedTrips(album.slug);
  const others = albums.filter((a) => a.slug !== album.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${album.title} — Don & Patti Nichols`,
    description: album.blurb,
    url: `${site.url}/albums/${album.slug}`,
    image: photo(album.cover, 1200),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Full-bleed cover */}
      <section className="relative">
        <div className="relative h-[46vh] min-h-[300px] w-full overflow-hidden sm:h-[58vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo(album.cover, 2000)}
            alt={album.title}
            width={2000}
            height={1125}
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,61,64,0.55) 0%, rgba(10,61,64,0.35) 40%, rgba(10,61,64,0.95) 100%)",
            }}
          />
          <div className="container-content absolute inset-x-0 bottom-0 pb-8">
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold transition hover:text-white"
            >
              <span aria-hidden>←</span> All albums
            </Link>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/70">
              {album.era}
            </p>
            <h1 className="h-display mt-1 text-4xl !text-white sm:text-5xl lg:text-6xl">
              {album.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="container-content py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="max-w-2xl font-serif text-xl leading-relaxed text-ink/85">
              {album.blurb}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink/55">
              <span>
                {album.photos.length} photographs from Don and Patti&rsquo;s own
                archive.
              </span>
              <PageViews path={`/albums/${album.slug}`} />
            </p>
          </div>

          {trips.length > 0 && (
            <aside className="rounded-2xl bg-sand-dark p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sea">
                Trips to this field
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {trips.map((t) => (
                  <li key={t.when} className="flex justify-between gap-3">
                    <span className="font-semibold text-ink">{t.when}</span>
                    <span className="text-right text-ink/60">{t.focus}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/trips"
                className="mt-4 inline-block text-sm font-semibold text-sea underline"
              >
                See the full timeline
              </Link>
            </aside>
          )}
        </div>

        <div className="divider-cross" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z" />
          </svg>
        </div>

        <PhotoWall ids={album.photos} albumTitle={album.title} />
      </section>

      {/* Give */}
      <section className="bg-deep py-14 text-white">
        <div className="container-content text-center">
          <h2 className="h-display text-3xl !text-white">
            Every one of these photographs started as somebody&rsquo;s gift.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            The well, the Bible, the clinic, the plane ticket. Someone gave, and
            this is what it became.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GiveLink location="album_page" className="btn-give">
              Give to the Mission
            </GiveLink>
            <Link href="/sponsor" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-deep">
              Fill the Trunks
            </Link>
          </div>
        </div>
      </section>

      {/* Keep browsing */}
      <section className="container-content py-14">
        <h2 className="h-display text-2xl">More from the archive</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((a) => (
            <Link
              key={a.slug}
              href={`/albums/${a.slug}`}
              className="group overflow-hidden rounded-xl bg-deep ring-1 ring-ink/5"
            >
              <div className="aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo(a.cover, 600)}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="font-serif font-bold text-white">{a.title}</p>
                <p className="mt-0.5 text-xs text-white/60">
                  {a.photos.length} photographs
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
