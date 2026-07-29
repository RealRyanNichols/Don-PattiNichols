import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { albums, photo, totalPhotos } from "@/content/albums";
import { countriesServed, historyStats } from "@/content/history";
import VerseRotator from "@/components/VerseRotator";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/albums` },
  title: "Photo Albums — Thirteen Years on the Mission Field",
  description:
    "Photographs from Don & Patti Nichols' mission work in Malawi, the Dominican Republic, Mozambique, Zambia, and Belize — water wells, medical clinics, village preaching, and the people they have served since 2013.",
};

export default function AlbumsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-deep py-16 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${photo(albums[0].cover, 1600)})`,
            backgroundSize: "cover",
            backgroundPosition: "center 35%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,61,64,0.82) 0%, rgba(10,61,64,0.94) 100%)",
          }}
        />
        <div className="container-content relative">
          <p className="identity-line">The Archive</p>
          <h1 className="h-display mt-4 text-4xl !text-white sm:text-5xl lg:text-6xl">
            Thirteen years, five countries,
            <br />
            one calling.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            These photographs were taken by Don and Patti themselves, on trips
            stretching back to {historyStats.firstYear}. Wells drilled. Clinics
            opened. Villages gathered under a tree to hear the Gospel. Nothing
            here is staged and nothing here is stock.
          </p>

          <dl className="mt-9 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-gold">
                Photographs
              </dt>
              <dd className="mt-1 font-serif text-3xl font-bold">{totalPhotos}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-gold">
                Albums
              </dt>
              <dd className="mt-1 font-serif text-3xl font-bold">{albums.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-gold">
                Countries
              </dt>
              <dd className="mt-1 font-serif text-3xl font-bold">
                {countriesServed.length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-content py-14 sm:py-16">
        <div className="max-w-3xl">
          <VerseRotator />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album, i) => (
            <Link
              key={album.slug}
              href={`/albums/${album.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-deep shadow-sm ring-1 ring-ink/5 transition hover:shadow-xl ${
                i === 0 || i === 1 ? "sm:col-span-1 lg:col-span-1" : ""
              }`}
            >
              <div className={i < 2 ? "aspect-[4/3]" : "aspect-[5/4]"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo(album.cover, 900)}
                  alt={album.title}
                  width={900}
                  height={i < 2 ? 675 : 720}
                  loading={i < 3 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  decoding="async"
                  className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,61,64,0) 30%, rgba(10,61,64,0.88) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {album.era}
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold text-white">
                  {album.title}
                </h2>
                <p className="mt-1 text-sm text-white/70">
                  {album.photos.length} photographs
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-sand-dark p-7 sm:p-9">
          <h2 className="h-display text-2xl">Where these pictures were taken</h2>
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
          <p className="mt-5 max-w-2xl text-ink/75">
            The full year-by-year record — every trip since 2013, and the two
            years they could not go — is on the{" "}
            <Link href="/trips" className="font-semibold text-sea underline">
              trips page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
