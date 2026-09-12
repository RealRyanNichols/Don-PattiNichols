import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/content/guides";
import { tools } from "@/content/tools";
import { articles } from "@/content/articles";
import { faqGroups } from "@/content/faq";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ResourceCard from "@/components/ResourceCard";
import JoinForm from "@/components/JoinForm";
import { site } from "@/lib/site";

const TITLE = "Mission Trip Resources — Free Guides, Tools & Downloads";
const DESC =
  "Free guides and tools from thirteen years of medical missions: what to pack, how to make a hygiene kit, how to pray for a team, a budget calculator built on real costs, a support-letter generator, printable prayer cards, church posters and more.";

export const metadata: Metadata = createPageMetadata({
  path: "/resources",
  title: TITLE,
  description: DESC,
  keywords: keywords("packing", "hygiene", "prayer", "support", "costs", "core"),
  image: ogCardImage({
    eyebrow: "Resources",
    title: "Free guides & tools for mission teams and churches",
    line: "Built from Don Nichols' real numbers and thirteen years of packing trunks.",
    meta: `${guides.length} guides · ${tools.length} tools · ${articles.length} articles`,
    photo: "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z",
  }),
});

export default function ResourcesPage() {
  const heroPhoto = "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z";
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mission trip guides and tools",
    itemListElement: [
      ...guides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.title,
        url: `${site.url}/guides/${g.slug}`,
      })),
      ...tools.map((t, i) => ({
        "@type": "ListItem",
        position: guides.length + i + 1,
        name: t.title,
        url: `${site.url}${t.href}`,
      })),
      ...articles.map((a, i) => ({
        "@type": "ListItem",
        position: guides.length + tools.length + i + 1,
        name: a.title,
        url: `${site.url}/articles/${a.slug}`,
      })),
    ],
  };
  const featuredArticles = articles.slice(0, 3);

  return (
    <>
      <JsonLd data={itemList} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(heroPhoto, 1600)}
          srcSet={photoSrcSet(heroPhoto, [900, 1600, 2000, 2400])}
          sizes="100vw"
          alt={photoAlt(heroPhoto, "Resources", 0)}
          width={1600}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,61,64,0.97) 0%, rgba(10,61,64,0.90) 40%, rgba(10,61,64,0.55) 100%)",
          }}
        />
        <div className="container-content relative py-16 sm:py-20">
          <Breadcrumbs dark crumbs={[{ name: "Resources", path: "/resources" }]} />
          <p className="identity-line mt-6">Free to use, free to share</p>
          <h1 className="h-display mt-5 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Guides and tools from thirteen years of packing trunks.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            What Don and Patti know about medical missions, written down for
            the next team and the next church: what to pack, what it costs, how
            to pray, how to ask. Every number is real and every tool runs in
            your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#guides" className="btn-give">
              The guides
            </a>
            <a
              href="#tools"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              The tools
            </a>
            <a
              href="#articles"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              By the numbers
            </a>
          </div>
        </div>
      </section>

      {/* Guides */}
      <section id="guides" className="container-content py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Guides</p>
            <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
              The questions people ask before they know Don&rsquo;s name
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink/60">
            Every fact about the mission comes from Don&rsquo;s own published
            record. Where a guide offers general advice, it says so.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => (
            <div key={g.slug} className="reveal">
              <ResourceCard
                href={`/guides/${g.slug}`}
                title={g.title}
                blurb={g.description}
                photoId={g.hero}
                kind={g.eyebrow}
                eager={i < 3}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="bg-sand-dark py-16 sm:py-20">
        <div className="container-content">
          <p className="eyebrow">Tools</p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
            Use it, print it, download it
          </h2>
          <p className="mt-3 max-w-2xl text-ink/70">
            Nothing here asks for an account and nothing is saved. Calculate a
            budget, plan a kit party, print the prayer cards, make a poster for
            your church, or write your support letter.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={t.href}
                className="group reveal flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo(t.photo, 700)}
                    srcSet={photoSrcSet(t.photo, [500, 700, 1000, 1400])}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    alt={photoAlt(t.photo, t.title, 0)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-deep/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-gold backdrop-blur">
                    {t.output === "calculator"
                      ? "Calculator"
                      : t.output === "printable"
                        ? "Printable"
                        : t.output === "image"
                          ? "Download"
                          : "Generator"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-lg font-bold leading-snug text-ink group-hover:text-sea">
                    {t.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {t.blurb}
                  </p>
                  <span className="mt-4 text-sm font-bold text-sea">
                    Open the tool →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Articles — charts, quiz, calculators */}
      <section id="articles" className="container-content py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">By the numbers</p>
            <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
              Where the money goes, what $25 buys, thirteen years in charts
            </h2>
          </div>
          <Link href="/articles" className="font-semibold text-sea hover:underline">
            All {articles.length} articles →
          </Link>
        </div>
        <p className="mt-3 max-w-2xl text-ink/70">
          Data pieces with charts you can share, a quiz, a trunk you can pack
          yourself, a monthly-giving slider and a 90-day checklist. Every
          figure reads from Don&rsquo;s published budget and trip record.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredArticles.map((a) => (
            <div key={a.slug} className="reveal">
              <ResourceCard
                href={`/articles/${a.slug}`}
                title={a.title}
                blurb={a.description}
                photoId={a.hero}
                kind={a.eyebrow}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ + churches */}
      <section className="container-content pb-16 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Link
            href="/faq"
            className="group reveal rounded-2xl border-2 border-sea/20 bg-white p-7 transition hover:border-sea/50 hover:shadow-md sm:p-9"
          >
            <p className="eyebrow">Frequently asked questions</p>
            <h2 className="h-display mt-2 text-2xl group-hover:text-sea sm:text-3xl">
              {faqGroups.reduce((n, g) => n + g.faqs.length, 0)} straight answers
            </h2>
            <p className="mt-3 text-ink/70">
              Is the care really free? How much does a trip cost? Are Don and
              Patti paid? Can my church make kits? Can Don speak at my church?
            </p>
            <span className="mt-5 inline-block text-sm font-bold uppercase tracking-widest text-gold-dark">
              Read the FAQ →
            </span>
          </Link>
          <Link
            href="/churches"
            className="group reveal rounded-2xl bg-deep p-7 text-white transition hover:bg-sea-dark sm:p-9"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              For churches
            </p>
            <h2 className="h-display mt-2 text-2xl !text-white sm:text-3xl">
              Invite Don to speak. Fill a trunk together.
            </h2>
            <p className="mt-3 text-white/80">
              A poster with your church&rsquo;s name and a QR code, bulletin
              text, the prayer cards, and five concrete ways a congregation
              partners with the mission.
            </p>
            <span className="mt-5 inline-block text-sm font-bold uppercase tracking-widest text-gold">
              For churches →
            </span>
          </Link>
        </div>

        <div className="reveal mt-12 grid items-center gap-8 rounded-2xl bg-sand-dark p-7 sm:p-9 lg:grid-cols-2">
          <div>
            <p className="eyebrow">New guides as they come</p>
            <h2 className="h-display mt-2 text-2xl sm:text-3xl">
              Get the next one by email
            </h2>
            <p className="mt-3 text-ink/70">
              Guides, tools, trip announcements, and Don&rsquo;s stories from
              the field. Nothing else.
            </p>
          </div>
          <JoinForm source="resources" interest="guides" askName submitLabel="Send me the next guide" />
        </div>
      </section>
    </>
  );
}
