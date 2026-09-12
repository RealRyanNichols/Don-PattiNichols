import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { behind } from "@/content/behind";
import { photos } from "@/lib/photos";
import GiveLink from "@/components/GiveLink";
import { keywords, ogCardImage } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/behind-the-mission",
  title: "Behind Every Mission Trip — Packing, Inventory & Customs",
  description:
    "The mission begins long before the airplane takes off. See the months of purchasing, packing, inventorying, and customs preparation behind every Belize medical mission trip.",
  keywords: keywords("packing", "core"),
  image: ogCardImage({
    eyebrow: "Behind the mission",
    title: "The mission begins long before the airplane takes off.",
    line: "Nine trunks. Fifty pounds each. Every item counted, translated and declared free of charge.",
    photo: "1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA",
  }),
});

export default function BehindPage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Transparency &amp; Preparation
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">
            {behind.title}
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-xl italic text-white/85">
            {behind.tagline}
          </p>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {behind.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>

        {/* The preparation, in pictures */}
        <div className="mt-10 grid grid-cols-2 gap-3">
          {photos.behindGallery.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={900}
              className="aspect-[4/3] w-full rounded-xl bg-sand-dark object-cover shadow-sm"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
        <p className="mt-3 text-center text-sm italic text-ink/60">
          The trunks, the supplies, the flight, the setup — months of
          preparation in four frames.
        </p>

        {/* Highlight quote */}
        <blockquote className="my-10 rounded-2xl bg-deep p-8 text-center">
          <p className="font-serif text-2xl font-bold italic text-gold sm:text-3xl">
            &ldquo;{behind.highlightQuote}&rdquo;
          </p>
          <cite className="mt-3 block text-sm not-italic text-white/70">
            {behind.highlightNote}
          </cite>
        </blockquote>

        {/* Trunk contents */}
        <div className="rounded-xl border border-ink/10 bg-white p-7 shadow-sm">
          <h2 className="font-serif text-2xl font-bold">
            What Rides in the Trunks
          </h2>
          <p className="mt-2 text-ink/75">{behind.trunkContents.intro}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {behind.trunkContents.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-ink/80">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Accountability */}
        <div className="mt-8">
          <h2 className="font-serif text-2xl font-bold">
            {behind.accountability.title}
          </h2>
          <div className="prose-mission mt-4">
            {behind.accountability.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>

        {/* Hygiene kit */}
        <div className="mt-8 rounded-xl bg-sand-dark p-7">
          <h2 className="font-serif text-2xl font-bold">
            {behind.hygieneKit.title}
          </h2>
          <div className="prose-mission mt-4">
            {behind.hygieneKit.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>

        {/* Journey timeline */}
        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold">
            The Story of Every Mission
          </h2>
          <ol className="mt-6 space-y-4">
            {behind.journey.map((s, i) => (
              <li key={s.step} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sea font-serif font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <Link
                    href={s.href}
                    className="font-serif text-lg font-bold hover:text-sea"
                  >
                    {s.step}
                  </Link>
                  <p className="text-ink/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* The same system, written up as a guide with the printable sheet */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Link
            href="/guides/what-to-pack-for-a-medical-mission-trip"
            className="group rounded-2xl border-2 border-sea/20 bg-white p-5 transition hover:border-sea/50 hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-sea">Guide</p>
            <p className="mt-1 font-serif text-lg font-bold text-ink group-hover:text-sea">
              What to pack for a medical mission trip
            </p>
            <p className="mt-1 text-sm text-ink/65">
              The trunk system above, step by step, for your own team.
            </p>
          </Link>
          <Link
            href="/tools/trunk-inventory-sheet"
            className="group rounded-2xl border-2 border-sea/20 bg-white p-5 transition hover:border-sea/50 hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-sea">Printable</p>
            <p className="mt-1 font-serif text-lg font-bold text-ink group-hover:text-sea">
              Trunk inventory sheet
            </p>
            <p className="mt-1 text-sm text-ink/65">
              The item-by-item sheet with the free-of-charge declaration.
            </p>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <GiveLink location="behind_page" className="btn-give">
            Help Fill the Trunks
          </GiveLink>
          <Link href="/belize" className="btn-outline">
            The Belize Mission
          </Link>
        </div>
      </section>
    </>
  );
}
