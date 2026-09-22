import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JoinForm from "@/components/JoinForm";
import GiveLink from "@/components/GiveLink";
import MerchLink from "@/components/MerchLink";
import ShareMissionPrompt from "@/components/ShareMissionPrompt";
import { merchStorefront } from "@/lib/merch";
import { ogCardImage } from "@/lib/seo";
import { supplyDrive } from "@/content/supplies";
import { supplyPhotoUrl } from "@/lib/supplyPhotos";
import { usd } from "@/lib/donations";

export const metadata: Metadata = createPageMetadata({
  path: "/store",
  title: "Mission Shop & Supply Sponsorship",
  description:
    "Support Don and Patti Nichols through mission supply sponsorship. Explore ways to give today and join the list for news about their merchandise shop.",
  image: ogCardImage({
    eyebrow: "Don & Patti Nichols",
    title: "Support the work. Share the mission.",
    line: "Practical gifts for the mission. News from the mission shop.",
  }),
});

const featuredSupplies = ["bible", "hygiene-kit", "trunk"].map((id) =>
  supplyDrive.items.find((item) => item.id === id)!,
);

export default function StorePage() {
  const shop = merchStorefront();
  return (
    <>
      <section className="border-b border-sea/15 bg-deep text-white">
        <div className="container-content grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              The mission shop
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Support the work.
              <br />
              <span className="font-normal italic text-gold">
                Share the mission.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Every supply has a purpose. Every trip begins with people who
              help. Find your way to stand with Don and Patti.
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link href="#supply-gifts" className="btn-give">
                Sponsor mission supplies
              </Link>
              <a
                href="#merchandise"
                className="min-h-12 py-3 text-sm font-semibold text-white underline decoration-white/50 underline-offset-4"
              >
                {shop ? "Browse merchandise" : "Merchandise news"} →
              </a>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-xs lg:max-w-sm">
            <Image
              src="/images/don-and-patti-airport.png"
              alt="Don and Patti Nichols together beside their travel trunks at the airport"
              width={1536}
              height={2048}
              sizes="(min-width: 1024px) 360px, 320px"
              loading="eager"
              className="h-auto w-full rounded-t-[5rem] border-4 border-white/20"
            />
            <figcaption className="mt-3 text-sm text-white/75">
              Don and Patti Nichols, together at the airport.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="supply-gifts"
        className="container-content scroll-mt-24 py-14 sm:py-20"
        aria-labelledby="supply-gifts-title"
      >
        <p className="eyebrow">A way to help today</p>
        <h2
          id="supply-gifts-title"
          className="mt-3 font-serif text-3xl font-bold text-deep sm:text-4xl"
        >
          Put something practical in a mission trunk.
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink/75">
          These are <strong>donations toward supplies for the mission</strong>,
          not products shipped to you. The amounts come from Don’s published
          budget. Choose a supply to see its story and give through PayPal.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featuredSupplies.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-xl border border-ink/15 bg-white"
            >
              {/* Existing documentary photographs from the family's published archive. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={supplyPhotoUrl(item.photo)}
                alt={item.photoFrom}
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full bg-sand-dark object-contain"
              />
              <p className="px-6 pt-3 text-xs text-ink/60">{item.photoFrom}</p>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-sea">
                  Mission supply sponsorship
                </p>
                <h3 className="mt-3 font-serif text-2xl font-bold">
                  {item.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">
                  {item.blurb}
                </p>
                <p className="mt-5 text-xl font-bold text-sea">
                  {usd(item.unitCost)}{" "}
                  <span className="text-sm font-normal text-ink/65">
                    per item in the budget
                  </span>
                </p>
                <GiveLink
                  href={`/sponsor/${item.id}`}
                  location="store_supply"
                  className="btn-primary mt-4 w-full"
                >
                  Choose your gift →
                </GiveLink>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink/70">
          Prefer to let them decide where help is needed?{" "}
          <Link
            href="/give"
            className="font-semibold text-sea underline underline-offset-4"
          >
            Give any amount
          </Link>
          .
        </p>
      </section>

      <section
        id="merchandise"
        className="scroll-mt-24 border-y border-sea/15 bg-sand-dark"
      >
        <div className="container-content grid gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Wear your support</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-deep">
              Mission merchandise
            </h2>
            {shop ? (
              <>
                <p className="mt-4 max-w-xl leading-relaxed text-ink/75">
                  Visit Don and Patti’s merchandise shop for available designs,
                  sizes, prices, and shipping information. Purchases and
                  delivery are handled through their shop.
                </p>
                <MerchLink href={shop} />
              </>
            ) : (
              <>
                <p className="mt-4 max-w-xl leading-relaxed text-ink/75">
                  We’re preparing a small collection inspired by Don and Patti’s
                  faith and ministry. Add your name to the merchandise list for
                  shop news.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink/65">
                  Merchandise is not available to order yet. Joining the list
                  does not place an order or charge you.
                </p>
              </>
            )}
          </div>
          <div className="rounded-xl border border-sea/15 bg-white p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-deep">
              Keep me posted about the shop
            </h3>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-ink/70">
              Leave your email for merchandise news from Don and Patti.
            </p>
            <JoinForm
              source="merchandise_shop"
              interest="mission_merchandise"
              submitLabel="Join the merchandise list"
              doneTitle="Your interest is saved."
              doneText="You are on Don and Patti’s merchandise list. No order has been placed and no payment has been taken."
            />
          </div>
        </div>
      </section>
      <div className="container-content pt-8">
        <ShareMissionPrompt />
      </div>
      <section className="container-content flex flex-col justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-serif text-2xl font-bold text-deep">
            See the work your support makes possible.
          </h2>
          <p className="mt-3 text-ink/75">
            Read the latest mission updates and the published giving records.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/blog" className="btn-outline">
            Mission updates
          </Link>
          <Link href="/transparency" className="btn-outline">
            Giving records
          </Link>
        </div>
      </section>
    </>
  );
}
