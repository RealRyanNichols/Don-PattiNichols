import type { Metadata } from "next";
import Link from "next/link";
import { supplyDrive } from "@/content/supplies";
import { photo } from "@/content/albums";
import { SponsorCard, DriveMeter } from "@/components/SponsorCheckout";
import GivingProgress from "@/components/GivingProgress";
import {
  fetchDonationTotals,
  fetchItemFunding,
  buildAllocation,
} from "@/lib/donations";
import VerseRotator from "@/components/VerseRotator";
import { site } from "@/lib/site";
import { ogImage } from "@/lib/og";

const TITLE = "Fill the Trunks — Sponsor Real Mission Supplies";
const DESCRIPTION =
  "Sponsor the actual supplies flying to Belize with Don & Patti Nichols: $2.50 sends a Bible, $3 packs a hygiene kit, $0.60 buys reading glasses, $200 flies a fifty-pound trunk. Real photos, real budget, everything given free.";

/** Most people reach this page from a shared Facebook link, so the share card matters. */
const CARD = ogImage("/sponsor");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${site.url}/sponsor` },
  openGraph: {
    type: "website",
    url: `${site.url}/sponsor`,
    siteName: site.name,
    title: "Fill the Trunks — Send Real Mission Supplies to Belize",
    description:
      "Pick what your gift becomes: a Bible, a hygiene kit, reading glasses, or the trunk itself. Everything is given away free of charge.",
    images: CARD ? [CARD] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Fill the Trunks — Send Real Mission Supplies to Belize",
    description:
      "Pick what your gift becomes: a Bible, a hygiene kit, reading glasses, or the trunk itself. Everything is given away free of charge.",
    images: CARD ? [CARD.url] : undefined,
  },
};

/** Re-checks giving every minute, so a new gift shows on the meter fast. */
export const revalidate = 60;

export default async function SponsorPage() {
  const [donationTotals, itemFunding] = await Promise.all([
    fetchDonationTotals(),
    fetchItemFunding(),
  ]);
  const allocation = buildAllocation(donationTotals, itemFunding);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fill the Trunks — Mission Supply Sponsorships",
    itemListElement: supplyDrive.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/sponsor/${item.id}`,
      name: item.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />

      {/* Hero with a real trunk photograph */}
      <section className="relative overflow-hidden bg-deep py-16 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${photo("1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA", 1600)})`,
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(10,61,64,0.95) 30%, rgba(10,61,64,0.75) 100%)",
          }}
        />
        <div className="container-content relative">
          <p className="identity-line">The Supply Drive</p>
          <h1 className="h-display mt-4 text-4xl !text-white sm:text-5xl lg:text-6xl">
            Fill the Trunks
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Every trunk that flies to the mission field is packed with things
            people gave. Pick what your gift becomes — a Bible, a hygiene kit, a
            pair of reading glasses, the trunk itself — and watch the next trip
            fill up.
          </p>
          <div className="mt-8 max-w-lg">
            <DriveMeter raisedUsd={donationTotals.totalUsd} giftCount={donationTotals.giftCount} />
          </div>
        </div>
      </section>

      {/* The store */}
      <section className="container-content py-12 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="h-display text-3xl">Choose what your gift becomes</h2>
            <p className="mt-2 max-w-2xl text-ink/70">
              Every photograph below is from Don and Patti&rsquo;s own trips.
              Every price is from Don&rsquo;s published budget.
            </p>
          </div>
          <p className="rounded-full bg-sand-dark px-4 py-2 text-sm font-bold text-sea">
            {supplyDrive.items.length} ways to give
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supplyDrive.items.map((item, i) => (
            <SponsorCard
              key={item.id}
              item={item}
              index={i}
              photoUrl={photo(item.photo, Math.min(item.photoPx, 800))}
            />
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-deep p-7 text-center text-white sm:p-9">
          <div className="mx-auto max-w-2xl">
            <VerseRotator />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-white/80">
            Every &ldquo;Give&rdquo; button goes straight to secure PayPal
            checkout with your item and amount already filled in — card, bank,
            or PayPal balance, one-time or monthly. And every single item is
            handed to someone in Belize{" "}
            <strong className="text-gold">completely free of charge</strong>.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/give" className="btn-give">
              All Ways to Give
            </Link>
            <Link
              href="/behind-the-mission"
              className="btn-outline !border-white !text-white hover:!bg-white hover:!text-deep"
            >
              See Where It All Goes
            </Link>
          </div>
        </div>
      </section>

      {/*
        The receipts. Anyone deciding whether to give can see exactly what has
        come in, what it covered, and what is still short — before they choose.
      */}
      <section className="bg-sand-dark py-14">
        <div className="container-content">
          <GivingProgress
            a={allocation}
            heading="What has been funded, and what still needs a sponsor"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/transparency" className="btn-outline">
              Open the full ledger
            </Link>
            <Link href="/what-a-mission-trip-costs" className="btn-outline">
              What a mission trip actually costs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
