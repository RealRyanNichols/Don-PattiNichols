import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { albums, albumBySlug, photo, photoSrcSet } from "@/content/albums";
import { missionTimeline } from "@/content/history";
import { photoAlt, photoCaption } from "@/content/captions";
import PhotoWall from "@/components/PhotoWall";
import PageViews from "@/components/PageViews";
import GiveLink from "@/components/GiveLink";
import ShareButton from "@/components/ShareButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { keywords, imageObjectsLd } from "@/lib/seo";

export function generateStaticParams() {
  return albums.map((a) => ({ slug: a.slug }));
}

/** The country an album belongs to, for related trips and albums. */
const COUNTRY: Record<string, string> = {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const album = albumBySlug(slug);
  if (!album) return {};
  const country = COUNTRY[album.slug];
  /*
   * No `images` here on purpose: opengraph-image.tsx in this folder builds a
   * designed card from the cover photograph, and a manual image would
   * override it.
   */
  return {
    title: `${album.title} — Photo Album (${album.photos.length} photographs)`,
    description: album.blurb,
    keywords: keywords("archive", [
      `${album.title} photos`,
      ...(country ? [`${country} mission photos`, `${country} mission trip`] : []),
    ]),
    alternates: { canonical: `${site.url}/albums/${album.slug}` },
    openGraph: {
      type: "website",
      url: `${site.url}/albums/${album.slug}`,
      siteName: site.name,
      title: `${album.title} — Don & Patti Nichols`,
      description: album.blurb,
    },
    twitter: {
      card: "summary_large_image",
      title: `${album.title} — Don & Patti Nichols`,
      description: album.blurb,
    },
  };
}

/** Trips from Don's timeline that match this album's country, newest first. */
function relatedTrips(albumSlug: string) {
  const country = COUNTRY[albumSlug];
  if (!country) return [];
  return missionTimeline
    .filter((t) => t.location?.includes(country))
    .sort((a, b) => b.year - a.year);
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = albumBySlug(slug);
  if (!album) notFound();

  const trips = relatedTrips(album.slug);
  const country = COUNTRY[album.slug];
  // Same country first, then the rest — a stranger who arrived on Water
  // Wells should be offered Malawi before Belize.
  const others = [
    ...albums.filter((a) => a.slug !== album.slug && COUNTRY[a.slug] === country),
    ...albums.filter((a) => a.slug !== album.slug && COUNTRY[a.slug] !== country),
  ].slice(0, 4);
  const tripSlug = trips.find((t) => t.tripSlug)?.tripSlug;
  const captioned = album.photos.filter((id) => photoCaption(id)).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${album.title} — Don & Patti Nichols`,
    description: album.blurb,
    url: `${site.url}/albums/${album.slug}`,
    image: photo(album.cover, 1200),
    numberOfItems: album.photos.length,
    creator: { "@type": "Person", name: "Don & Patti Nichols", url: `${site.url}/our-story` },
    ...(country ? { contentLocation: { "@type": "Country", name: country } } : {}),
    // Every photograph, with its verified caption where one exists.
    associatedMedia: imageObjectsLd(
      album.photos.map((id, i) => ({
        url: photo(id, 1600),
        name: photoAlt(id, album.title, i),
        caption: photoCaption(id) ?? undefined,
      })),
    ),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Full-bleed cover */}
      <section className="relative">
        <div className="relative h-[46vh] min-h-[300px] w-full overflow-hidden sm:h-[58vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo(album.cover, 2000)}
            srcSet={photoSrcSet(album.cover, [1200, 1600, 2000, 2400])}
            sizes="100vw"
            alt={photoAlt(album.cover, album.title, 0)}
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
            <Breadcrumbs
              dark
              crumbs={[
                { name: "Photo archive", path: "/albums" },
                { name: album.title, path: `/albums/${album.slug}` },
              ]}
            />
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
                archive{captioned > 0 ? `, ${captioned} with captions` : ""}.
              </span>
              <PageViews path={`/albums/${album.slug}`} />
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ShareButton
                title={`${album.title} — Don & Patti Nichols`}
                text={album.blurb}
                path={`/albums/${album.slug}`}
                compact
              />
              {tripSlug && (
                <Link
                  href={`/trips/${tripSlug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-sea ring-1 ring-sea/30 transition hover:bg-sea hover:text-white"
                >
                  Read the trip story →
                </Link>
              )}
            </div>
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

        <PhotoWall
          ids={album.photos}
          albumTitle={album.title}
          albumPath={`/albums/${album.slug}`}
        />
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
            <Link
              href="/sponsor"
              className="btn-outline !border-white !text-white hover:!bg-white hover:!text-deep"
            >
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
                  srcSet={photoSrcSet(a.cover, [400, 600, 900])}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  alt={photoAlt(a.cover, a.title, 0)}
                  loading="lazy"
                  decoding="async"
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
