import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, absolute } from "@/lib/seo";
import { site } from "@/lib/site";
import { malawiCampaign, campaignNeed } from "@/content/campaigns";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CampaignGive from "@/components/CampaignGive";
import GoalMeter from "@/components/GoalMeter";
import JoinForm from "@/components/JoinForm";
import ShareButton from "@/components/ShareButton";
import CopyButton from "@/components/CopyButton";

/**
 * THE MALAWI WATER WELL & MAIZE MILL — Don's campaign page.
 *
 * Don asked, on 15 September, for this campaign to be "the first thing
 * visitors see" and for every gift to carry a designation. He had already
 * written the ask himself in three posts. This page does not rewrite him: every
 * sentence in quotation marks comes from content/campaigns.ts, which holds his
 * words exactly as he published them. Everything else on the page is plain
 * signposting — who receives the money, how to give, where the bid is.
 *
 * What it will not do: show a progress bar before a real forwarded total
 * exists, state the maize mill's price before Don writes it out, or say a
 * gift is tax-deductible in its own voice. The 501(c)(3) line is Don's, and it
 * is attributed to him.
 */

const c = malawiCampaign;
const well = campaignNeed("well");
const mill = campaignNeed("maize-mill");
const w = c.words;

const TITLE = "Fund a Water Well and a Maize Mill in Malawi";
const DESC =
  "A village in Malawi is still drinking muddy water. Don Nichols is raising $7,630 for a bore hole, and a maize mill that funds a soccer ministry sharing the Gospel. Gifts go to Wings of Promise, Inc.";

export const metadata: Metadata = createPageMetadata({
  path: c.path,
  title: TITLE,
  description: DESC,
  keywords: keywords("malawiWell", "giving", [
    "Malawi water well",
    "Don Nichols Malawi",
  ]),
  type: "article",
  publishedTime: `${c.launched}T12:00:00Z`,
  modifiedTime: `${c.updated}T12:00:00Z`,
  authors: ["Don Nichols"],
});

const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/** Every answer is built from Don's published words, and says so. */
const faqs = [
  {
    q: "How much does a water well cost in Malawi?",
    a: `For this well, the bid came in Malawian Kwacha. In Don's words: "${w.wellCost}" That is the price for this bore hole; Don published the bid itself in his "${well.postTitle}" post.`,
  },
  {
    q: "Who receives the money?",
    a: `${c.recipient.name} in Vidor, Texas. In Don's words: "${w.overseer}" Gifts made online go to Don's PayPal first; he has written: "Any money given to our PayPal account will be given publicly to Skipper Sauls and Wings of Promise."`,
  },
  {
    q: "How do I make sure my gift goes to the well and not a general fund?",
    a: `Give through the button on this page. It writes "${well.checkMemo}" (or "${mill.checkMemo}") onto the PayPal gift, so the designation goes with it. If you mail a check to Wings of Promise, write it on the check. Don: "${w.memo}"`,
  },
  {
    q: "Is my gift tax-deductible?",
    a: `Don describes Wings of Promise this way: "${w.nonprofit}" Receipts come from Wings of Promise, not from Don and Patti. If a receipt matters to you, mail your gift straight to Wings of Promise, or ask them how they receipt a gift Don forwards in your name.`,
  },
  {
    q: "What does a maize mill have to do with sharing the Gospel?",
    a: `In Don's words: "${w.millHow}" And: "${w.soccer}"`,
  },
  {
    q: "How much does the maize mill cost?",
    a: `Don posted the maize mill's price, in US dollars, as a photograph with his "${mill.postTitle}" post. This page only repeats figures Don has written out in text, so read the price there.`,
  },
];

export default function MalawiWaterWellPage() {
  const url = absolute(c.path);
  const hero = c.photos.hero;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: TITLE,
      description: DESC,
      datePublished: `${c.launched}T12:00:00Z`,
      dateModified: `${c.updated}T12:00:00Z`,
      image: [photo(hero, 1600)],
      author: { "@type": "Person", name: "Don Nichols", url: absolute("/don") },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      mainEntityOfPage: url,
      about: ["Water well", "Malawi", "Maize mill", "Sports evangelism"],
    },
    {
      "@context": "https://schema.org",
      "@type": "DonateAction",
      name: "Fund the Malawi water well and maize mill",
      description: c.summary,
      recipient: {
        "@type": "Organization",
        name: c.recipient.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: c.recipient.street,
          addressLocality: c.recipient.city,
          addressRegion: c.recipient.region,
          postalCode: c.recipient.postalCode,
          addressCountry: "US",
        },
      },
      target: { "@type": "EntryPoint", urlTemplate: `${url}#give` },
      actionStatus: "https://schema.org/PotentialActionStatus",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const address = c.recipient.lines.join("\n");

  return (
    <>
      <JsonLd data={ld} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(hero, 1600)}
          srcSet={photoSrcSet(hero, [900, 1600, 2000])}
          sizes="100vw"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,61,64,0.96) 0%, rgba(10,61,64,0.86) 55%, rgba(10,61,64,0.95) 100%)",
          }}
        />
        <div className="container-content relative py-12 sm:py-16">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Give", path: "/give" },
              { name: "Malawi water well", path: c.path },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
                Malawi · Asking publicly
              </p>
              <h1 className="h-display mt-3 text-4xl !text-white sm:text-5xl">
                A water well and a maize mill for a village in Malawi
              </h1>
              <figure className="mt-7 border-l-4 border-gold pl-5">
                <blockquote className="font-serif text-2xl italic leading-snug text-white sm:text-3xl">
                  “They are still drinking muddy, tainted water.”
                </blockquote>
                <figcaption className="mt-2 text-sm text-white/70">
                  Don Nichols,{" "}
                  <Link
                    href="/blog/bore-hole-or-1b520dc8"
                    className="underline underline-offset-4 hover:text-white"
                  >
                    Bore Hole or Maize Mill in Malawi
                  </Link>
                </figcaption>
              </figure>
              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    n: fmt(well.costUsd!),
                    l: "for the bore hole, in US dollars — Don’s figure from the bid",
                  },
                  {
                    n: "Wings of Promise",
                    l: "receives the funds, in Vidor, Texas",
                  },
                  {
                    n: "Skipper Sauls",
                    l: "oversees the funds and the project",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/15"
                  >
                    <dt className="font-serif text-xl font-bold text-gold sm:text-2xl">
                      {s.n}
                    </dt>
                    <dd className="mt-1 text-sm leading-snug text-white/75">
                      {s.l}
                    </dd>
                  </div>
                ))}
              </dl>
              {c.raisedUsd !== null && (
                <div className="mt-8 max-w-md">
                  <GoalMeter
                    goalUsd={well.costUsd!}
                    raisedUsd={c.raisedUsd}
                    dark
                  />
                </div>
              )}
              <div className="mt-8">
                <ShareButton
                  dark
                  title={TITLE}
                  text="A village in Malawi is still drinking muddy water. Don Nichols is asking publicly for a well."
                  path={c.path}
                />
              </div>
            </div>

            <div
              id="give"
              className="scroll-mt-24 rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/15 sm:p-7"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                Give online
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold">
                Your gift, marked for Malawi
              </h2>
              <div className="mt-5">
                <CampaignGive location="campaign_hero" dark />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE TWO NEEDS */}
      <section className="container-content py-14 sm:py-20">
        <p className="eyebrow">Two needs, one translator’s prayer</p>
        <h2 className="h-display mt-3 max-w-3xl text-3xl sm:text-4xl">
          What Don is asking for, in his own words
        </h2>
        <figure className="mt-6 max-w-3xl">
          <blockquote className="prose-mission">
            <p>“{w.millAsked}”</p>
          </blockquote>
          <figcaption className="mt-2 text-sm text-ink/60">
            Don Nichols,{" "}
            <Link
              href={`/blog/${mill.postSlug}`}
              className="text-sea underline underline-offset-4"
            >
              {mill.postTitle}
            </Link>
          </figcaption>
        </figure>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo(hero, 900)}
              srcSet={photoSrcSet(hero, [600, 900, 1200])}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={photoAlt(hero, "Water well", 0)}
              width={900}
              height={506}
              loading="lazy"
              decoding="async"
              className="aspect-[16/9] w-full bg-sand-dark object-cover"
            />
            <p className="px-6 pt-3 text-xs text-ink/60">
              An earlier donated well being drilled in Malawi, from Don and
              Patti’s archive. Not this village.
            </p>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-sea">
                Need one
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold">
                {well.name}
              </h3>
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink/80">
                “{w.wellRequest}”
              </blockquote>
              <div className="mt-6 rounded-xl bg-sand-dark p-4">
                <p className="font-serif text-3xl font-bold text-deep">
                  {fmt(well.costUsd!)}
                </p>
                <p className="mt-1 text-sm text-ink/70">“{w.wellCost}”</p>
                <Link
                  href={`/blog/${well.postSlug}`}
                  className="mt-3 inline-block text-sm font-semibold text-sea underline underline-offset-4"
                >
                  See the bid in Don’s post →
                </Link>
              </div>
            </div>
          </article>

          <article className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-sea">
              Need two
            </p>
            <h3 className="mt-2 font-serif text-2xl font-bold">{mill.name}</h3>
            <div className="mt-4 flex-1 space-y-4 leading-relaxed text-ink/80">
              <blockquote>“{w.soccer}”</blockquote>
              <blockquote>“{w.millHow}”</blockquote>
            </div>
            <div className="mt-6 rounded-xl bg-sand-dark p-4">
              <p className="font-serif text-xl font-bold text-deep">
                Price posted by Don
              </p>
              <p className="mt-1 text-sm text-ink/70">
                Don published the maize mill’s cost in US dollars as a
                photograph with his post. This page repeats only figures he has
                written out.
              </p>
              <Link
                href={`/blog/${mill.postSlug}`}
                className="mt-3 inline-block text-sm font-semibold text-sea underline underline-offset-4"
              >
                See the price in Don’s post →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* WHERE IT GOES */}
      <section className="bg-sand-dark py-14 sm:py-20">
        <div className="container-content grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">Where your gift goes</p>
            <h2 className="h-display mt-3 text-3xl">
              From your hands to the project
            </h2>
            <div className="prose-mission mt-5">
              <p>
                Online gifts arrive in Don’s PayPal account, marked for the well
                or the mill. Don has written that he forwards them to Wings of
                Promise, and that Skipper Sauls oversees the funds and the work.
              </p>
            </div>
            <figure className="mt-6 border-l-4 border-gold bg-white p-5">
              <blockquote className="font-serif text-lg leading-relaxed text-ink">
                “{w.paypalForwarded}”
              </blockquote>
              <figcaption className="mt-2 text-sm text-ink/60">
                Don Nichols
              </figcaption>
            </figure>
            <figure className="mt-5 border-l-4 border-sea/40 bg-white p-5">
              <blockquote className="leading-relaxed text-ink/85">
                “{w.overseer}”
              </blockquote>
              <blockquote className="mt-3 leading-relaxed text-ink/85">
                “{w.history}”
              </blockquote>
              <figcaption className="mt-2 text-sm text-ink/60">
                Don Nichols, on Skipper Sauls
              </figcaption>
            </figure>
            <p className="mt-6 text-sm leading-relaxed text-ink/70">
              The family records money received and spent on the{" "}
              <Link
                href="/transparency"
                className="font-semibold text-sea underline underline-offset-4"
              >
                Open Book ledger
              </Link>
              .
            </p>
          </div>

          <div
            id="by-mail"
            className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 sm:p-8"
          >
            <p className="eyebrow">Or give directly</p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-deep">
              Mail a check to Wings of Promise
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
              “{w.directToo}”
            </p>
            <address className="mt-5 whitespace-pre-line rounded-xl bg-sand-dark p-5 font-serif text-lg not-italic leading-relaxed text-ink">
              {address}
            </address>
            <div className="mt-3">
              <CopyButton
                text={address}
                label="Copy the address"
                what="wings_of_promise_address"
              />
            </div>
            <h3 className="mt-7 font-semibold text-ink">
              Write this on the check
            </h3>
            <ul className="mt-2 space-y-1 text-[15px] text-ink/80">
              <li>
                For the well: <strong>{well.checkMemo}</strong>
              </li>
              <li>
                For the maize mill: <strong>{mill.checkMemo}</strong>
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Don: “{w.memo}”
            </p>
            <div className="mt-6 rounded-xl border border-ink/10 p-4">
              <p className="text-sm font-semibold text-ink">About receipts</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">
                In Don’s words: “{w.nonprofit}” Receipts come from Wings of
                Promise, not from Don and Patti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRAYER */}
      <section className="container-content max-w-3xl py-14 sm:py-20">
        <p className="eyebrow">Asking God publicly</p>
        <h2 className="h-display mt-3 text-3xl">Why Don is asking out loud</h2>
        {/*
          Set off as a block quote rather than wrapped in quotation marks:
          Don's own lines already carry quotes ("That's too long!"), and
          wrapping them again doubles the closing marks.
        */}
        <figure className="mt-5 border-l-4 border-gold pl-6">
          <blockquote className="prose-mission">
            <p>{w.gibbsQuestion}</p>
            <p>{w.askedPublicly}</p>
            <p>{w.inPrayer}</p>
          </blockquote>
          <figcaption className="mt-2 text-sm text-ink/60">
            Don Nichols,{" "}
            <Link
              href="/blog/bore-hole-or-1b520dc8"
              className="text-sea underline underline-offset-4"
            >
              Bore Hole or Maize Mill in Malawi
            </Link>
          </figcaption>
        </figure>
        <figure className="mt-8 rounded-2xl bg-deep p-7 text-white">
          <blockquote className="space-y-3 font-serif text-lg italic leading-relaxed">
            <p>“{w.verse6}</p>
            <p>{w.verse7}”</p>
          </blockquote>
          <figcaption className="mt-4 text-sm font-bold uppercase tracking-widest text-gold">
            2 Corinthians 9:6–7, as Don quoted it
          </figcaption>
        </figure>
      </section>

      {/* FOLLOW */}
      <section className="border-y border-sea/15 bg-white">
        <div className="container-content grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Follow the well</p>
            <h2 className="h-display mt-3 text-3xl">
              Hear when the water comes up
            </h2>
            <p className="mt-4 text-ink/75">
              Don closed his first post with “More info to follow.” Leave your
              name and you’ll hear it when he posts it.
            </p>
          </div>
          <JoinForm
            source="malawi_water_well"
            interest="malawi_water_well"
            askName
            askPhone
            offerTexts
            submitLabel="Send me well updates"
            doneTitle="You’ll hear about the well."
            doneText="You’re on the list for Malawi water well updates. Nothing has been charged."
          />
        </div>
      </section>

      {/* DON'S POSTS */}
      <section className="container-content py-14 sm:py-20">
        <p className="eyebrow">Read it in Don’s words</p>
        <h2 className="h-display mt-3 text-3xl">The posts behind this page</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {c.posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-sea">
                  {new Date(`${p.date}T12:00:00Z`).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 font-serif text-xl font-bold leading-snug text-ink group-hover:text-sea">
                  {p.title}
                </p>
                <p className="mt-3 text-sm font-semibold text-sea">
                  Read Don’s post →
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/blog/believe-the-commercials-about-water-in-africa-84at"
            className="btn-outline"
          >
            Don on water in Africa
          </Link>
          <Link href="/albums/water-wells" className="btn-outline">
            Wells drilled on earlier trips
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sand-dark py-14 sm:py-20">
        <div className="container-content max-w-3xl">
          <h2 className="h-display text-3xl">Questions people ask</h2>
          <dl className="mt-8 space-y-5">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/10"
              >
                <dt className="font-serif text-xl font-bold text-ink">{f.q}</dt>
                <dd className="mt-3 leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CLOSE */}
      <section className="bg-deep py-14 text-center text-white">
        <div className="container-content max-w-2xl">
          <h2 className="h-display text-3xl !text-white">
            One well. One mill. A village hearing the Gospel.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#give" className="btn-give text-lg">
              Give to the well
            </a>
            <a
              href={`/api/campaign-poster`}
              target="_blank"
              rel="noopener"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Print a poster for your church
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
