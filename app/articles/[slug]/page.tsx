import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, articleBySlug } from "@/content/articles";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";
import { keywords, articleLd, faqLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";
import GiveLink from "@/components/GiveLink";
import ReadingProgress from "@/components/ReadingProgress";
import PageViews from "@/components/PageViews";
import ResourceCard from "@/components/ResourceCard";
import ArticleBlocks, { articleOutline } from "@/components/ArticleBlocks";

/**
 * /articles/[slug] — the data pieces.
 *
 * Same skeleton as a guide (hero, breadcrumbs, Article + FAQPage schema,
 * reading progress, share, FAQ, related), but the body is a run of blocks
 * so charts, interactives, the capture form and the give box land exactly
 * where the content file puts them. Every article is static: the charts
 * derive from content files, so nothing here needs a database at request
 * time.
 */

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = articleBySlug((await params).slug);
  if (!article) return {};
  // No `image` here — opengraph-image.tsx in this folder builds the card.
  return createPageMetadata({
    path: `/articles/${article.slug}`,
    title: article.title,
    description: article.description,
    keywords: keywords(article.keywords, "core"),
    type: "article",
    publishedTime: article.datePublished,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = articleBySlug((await params).slug);
  if (!article) notFound();

  const path = `/articles/${article.slug}`;
  const outline = articleOutline(article.blocks);
  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const hasCharts = article.blocks.some((b) => b.kind === "chart");
  const hasInteractive = article.blocks.some((b) => b.kind === "interactive");

  const ld: unknown[] = [
    articleLd({
      headline: article.title,
      description: article.description,
      path,
      datePublished: article.datePublished,
      image: photo(article.hero, 1600),
      keywords: keywords(article.keywords),
      author: { name: "Don & Patti Nichols", path: "/our-story" },
    }),
    faqLd(article.faqs),
  ];

  return (
    <article>
      <JsonLd data={ld} />
      <ReadingProgress />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(article.hero, 1600)}
          srcSet={photoSrcSet(article.hero, [900, 1600, 2000, 2400])}
          sizes="100vw"
          alt={photoAlt(article.hero, article.title, 0)}
          width={1600}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,61,64,0.97) 0%, rgba(10,61,64,0.90) 45%, rgba(10,61,64,0.62) 100%)",
          }}
        />
        <div className="container-content relative max-w-3xl py-14 sm:py-20">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Resources", path: "/resources" },
              { name: "Articles", path: "/articles" },
              { name: article.eyebrow, path },
            ]}
          />
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-gold">
            {article.eyebrow}
          </p>
          <h1 className="h-display mt-3 text-4xl !text-white sm:text-5xl lg:text-[3.3rem] lg:leading-[1.08]">
            {article.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            {article.description}
          </p>
          <div className="byline mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
            <span>Every number from Don Nichols&rsquo; published record</span>
            <span>
              {new Date(article.datePublished + "T12:00:00").toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              )}
            </span>
            <PageViews path={path} label="reads" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest">
            {hasCharts && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/85 ring-1 ring-white/20">
                Charts
              </span>
            )}
            {hasInteractive && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-white/85 ring-1 ring-white/20">
                Interactive
              </span>
            )}
            <span className="rounded-full bg-white/10 px-3 py-1 text-white/85 ring-1 ring-white/20">
              Free to share
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container-content max-w-3xl py-12 sm:py-14">
        {outline.length > 2 && (
          <nav
            aria-label="In this article"
            className="mb-10 rounded-2xl bg-sand-dark p-5 text-sm sm:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-ink/55">
              In this article
            </p>
            <ol className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {outline.map((h, i) => (
                <li key={h.id} className="flex gap-2">
                  <span className="tabular-nums text-gold-dark">{i + 1}.</span>
                  <a href={`#${h.id}`} className="font-semibold text-sea hover:underline">
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <ArticleBlocks blocks={article.blocks} path={path} />

        {/* FAQ */}
        <div className="reveal mt-12">
          <h2 className="h-display text-2xl sm:text-3xl">Questions people ask</h2>
          <dl className="mt-6 space-y-4">
            {article.faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10 sm:p-6"
              >
                <dt className="font-serif text-lg font-bold text-ink">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-ink/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Share + give */}
        <div className="reveal mt-12 rounded-2xl bg-deep p-7 text-white sm:p-9">
          <h2 className="h-display text-2xl !text-white sm:text-3xl">
            Pass the numbers on.
          </h2>
          <p className="mt-3 max-w-xl text-white/80">
            Most people have never seen what a mission trip actually costs.
            One share puts this in front of somebody who will give because they
            finally can see it.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ShareButton
              title={article.title}
              text={article.shareText}
              path={path}
              dark
            />
            <GiveLink location={`article_${article.slug}_footer`} href="/sponsor" className="btn-give">
              Fill the Trunks
            </GiveLink>
          </div>
        </div>
      </section>

      {/* More articles */}
      <section className="bg-sand-dark py-14">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display text-2xl sm:text-3xl">More by the numbers</h2>
            <Link href="/articles" className="font-semibold text-sea hover:underline">
              All {articles.length} articles →
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((a) => (
              <ResourceCard
                key={a.slug}
                href={`/articles/${a.slug}`}
                title={a.title}
                blurb={a.description}
                photoId={a.hero}
                kind={a.eyebrow}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-ink/60">
            Guides, tools, and the FAQ live on the{" "}
            <Link href="/resources" className="font-semibold text-sea underline">
              Resources
            </Link>{" "}
            page. Every fact about the mission on them comes from what Don has
            published here.
          </p>
        </div>
      </section>
    </article>
  );
}
