import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supplyDrive } from "@/content/supplies";
import { photo } from "@/content/albums";
import SponsorCheckout, { SponsorCard } from "@/components/SponsorCheckout";
import PageViews from "@/components/PageViews";
import ShareButton from "@/components/ShareButton";
import VerseRotator from "@/components/VerseRotator";
import { site } from "@/lib/site";
import { sponsorItemOg } from "@/lib/og";

export function generateStaticParams() {
  return supplyDrive.items.map((i) => ({ id: i.id }));
}

const getItem = (id: string) => supplyDrive.items.find((i) => i.id === id);

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const item = getItem(params.id);
  if (!item) return {};
  const price = item.unitCost % 1 ? item.unitCost.toFixed(2) : item.unitCost;
  const card = sponsorItemOg({
    photoId: item.photo,
    photoPx: item.photoPx,
    name: item.name,
    photoFrom: item.photoFrom,
  });
  return {
    title: `Sponsor ${item.name} — $${price} | Fill the Trunks`,
    description: `${item.blurb} Sponsor ${item.name.toLowerCase()} for the Nichols' Belize medical mission — $${price} each, given completely free to the people they serve.`,
    alternates: { canonical: `${site.url}/sponsor/${item.id}` },
    openGraph: {
      type: "website",
      url: `${site.url}/sponsor/${item.id}`,
      siteName: site.name,
      title: `Sponsor ${item.name} — $${price} — Don & Patti Nichols Mission`,
      description: item.blurb,
      // The item's own photograph when it is big enough to share; otherwise
      // the designed Fill the Trunks card. See lib/og.ts.
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title: `Sponsor ${item.name} — $${price}`,
      description: item.blurb,
      images: [card.url],
    },
  };
}

export default function SponsorItemPage({ params }: { params: { id: string } }) {
  const item = getItem(params.id);
  if (!item) notFound();

  const others = supplyDrive.items.filter((i) => i.id !== item.id).slice(0, 3);

  // Product structured data → Google shopping-rich results for "sponsor a bible
  // mission trip" style searches. Availability is honest: always in stock,
  // because the need is real.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.name} — Belize Mission Sponsorship`,
    description: item.blurb,
    image: photo(item.photo, 1200),
    url: `${site.url}/sponsor/${item.id}`,
    brand: { "@type": "Organization", name: "Don & Patti Nichols Mission Work" },
    offers: {
      "@type": "Offer",
      price: item.unitCost.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/sponsor/${item.id}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fill the Trunks", item: `${site.url}/sponsor` },
      { "@type": "ListItem", position: 2, name: item.name, item: `${site.url}/sponsor/${item.id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="bg-deep py-8 text-white">
        <div className="container-content">
          <nav className="text-sm" aria-label="Breadcrumb">
            <Link
              href="/sponsor"
              className="font-semibold uppercase tracking-widest text-gold hover:text-white"
            >
              ← Fill the Trunks
            </Link>
          </nav>
        </div>
      </section>

      <section className="container-content py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          {/* Product photograph — theirs, not stock */}
          <figure>
            <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-ink/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo(item.photo, Math.min(item.photoPx, 1400))}
                alt={`${item.name} — photograph from Don & Patti's mission archive`}
                width={1400}
                height={1050}
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm italic text-ink/60">
              {item.photoFrom} — photographed by the team, not a stock image.
            </figcaption>
          </figure>

          {/* Buy box */}
          <div>
            <p className="eyebrow">Sponsor</p>
            <h1 className="h-display mt-1 text-4xl sm:text-5xl">{item.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">{item.blurb}</p>
            <div className="mt-2"><PageViews path={`/sponsor/${item.id}`} /></div>
            <div className="mt-6">
              <SponsorCheckout item={item} />
            </div>
            <div className="mt-4">
              <ShareButton
                title={`Sponsor ${item.name} — Don & Patti Nichols Mission`}
                text={item.blurb}
                path={`/sponsor/${item.id}`}
                compact
              />
            </div>
          </div>
        </div>

        {/* The story */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="h-display text-2xl">Why this matters</h2>
            <div className="prose-mission mt-4">
              {item.story.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border-l-4 border-gold bg-sand-dark p-5">
              <p className="font-serif text-lg italic text-ink/85">
                &ldquo;All of this will be GIVEN FREE OF CHARGE.&rdquo;
              </p>
              <p className="mt-1 text-sm text-ink/55">— Don Nichols</p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl bg-deep p-6 text-white">
              <VerseRotator />
            </div>
            <div className="rounded-2xl bg-sand-dark p-5 text-sm leading-relaxed text-ink/75">
              <p className="font-bold text-ink">Where your money goes</p>
              <p className="mt-2">
                Gifts go through PayPal directly to the mission. Every price on
                this page is from Don&rsquo;s published trip budget — no markup,
                no overhead added.
              </p>
              <Link
                href="/give#budget"
                className="mt-3 inline-block font-semibold text-sea underline"
              >
                See the full budget
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Cross-sell — keep filling the trunk */}
      <section className="bg-sand-dark py-12">
        <div className="container-content">
          <h2 className="h-display text-2xl">Keep filling the trunk</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((o, i) => (
              <SponsorCard key={o.id} item={o} index={i} photoUrl={photo(o.photo, Math.min(o.photoPx, 800))} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
