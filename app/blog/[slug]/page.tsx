import { Fragment } from "react";
import PageViews from "@/components/PageViews";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/content/posts";
import { authorNames } from "@/content/people";
import { site } from "@/lib/site";
import GiveLink from "@/components/GiveLink";
import Comments from "@/components/Comments";
import ShareButton from "@/components/ShareButton";
import PostEnrichment, { PullQuote } from "@/components/PostEnrichment";
import { enrichPost } from "@/lib/postEnrich";
import PostPhotos from "@/components/PostPhotos";
import ArticleBody from "@/components/ArticleBody";
import ReadingProgress from "@/components/ReadingProgress";
import StickyGive from "@/components/StickyGive";
import { storageImage } from "@/lib/storageImage";
import {
  fetchDbPost,
  dbAuthorName,
  dbAuthorHref,
  dbPostDate,
  dbPostParagraphs,
} from "@/lib/postsDb";

/**
 * Two kinds of posts share this route:
 *   - founding posts from content/posts.ts (statically generated)
 *   - posts Don & Patti publish from /admin (fetched live, revalidated 60s)
 * Unknown slugs fall through to the database before 404ing.
 */
export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) {
    const db = await fetchDbPost(params.slug);
    if (!db) return {};
    /*
     * No `images` here on purpose. `opengraph-image.tsx` in this folder builds
     * a designed 1200×630 card — Don's photograph in a panel beside the title —
     * and Next wires it up automatically. Setting images manually would
     * override it and put the raw, face-cropped photo back.
     */
    return {
      title: db.title,
      description: db.excerpt,
      alternates: { canonical: `${site.url}/blog/${db.slug}` },
      openGraph: {
        type: "article",
        title: db.title,
        description: db.excerpt,
        url: `${site.url}/blog/${db.slug}`,
        publishedTime: db.published_at ?? undefined,
        authors: [dbAuthorName(db.author_handle)],
      },
      /*
       * Twitter/X needs its own tags. Without these it fell back to the
       * site-wide defaults, so sharing Don's story showed "Don & Patti Nichols
       * — Mission Work & Ministry" instead of the title he wrote.
       */
      twitter: {
        card: "summary_large_image",
        title: db.title,
        description: db.excerpt,
      },
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) {
    const db = await fetchDbPost(params.slug);
    if (!db) notFound();
    const paragraphs = dbPostParagraphs(db);
    /** Don's line for photo n, if he wrote one. Trimmed; blank means none. */
    const caption = (n: number) => (db.photo_captions?.[n] ?? "").trim();
    /*
     * Everything the article needs beyond Don's words — worked out from what
     * he actually wrote. He does none of this; he types a story and taps
     * Publish. See lib/postEnrich.ts for what it will and will not do.
     */
    const enrich = enrichPost(db);
    const dbJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: db.title,
      description: db.excerpt,
      datePublished: db.published_at ?? db.created_at,
      // Google will not show an Article rich result without an image.
      ...(db.photo_urls[0]
        ? { image: [storageImage(db.photo_urls[0], 1200, 80)] }
        : {}),
      author: {
        "@type": "Person",
        name: dbAuthorName(db.author_handle),
        url: `${site.url}${dbAuthorHref(db.author_handle)}`,
      },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      mainEntityOfPage: `${site.url}/blog/${db.slug}`,
    };
    return (
      <article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dbJsonLd) }}
        />
        <ReadingProgress />

        {/*
          THE HEADER. This was a flat teal band with the title on it. Now the
          reader's own photograph carries the title — the same treatment the
          rest of the site got. If a post has no photo it falls back to the
          plain band, so a text-only story still looks deliberate.
        */}
        {/*
          THE HEADER.
          
          This briefly used the post's lead photo as a full-bleed background
          behind the title. That was wrong for this content: Don's lead photo is
          a near-square posed portrait of him and Patti (960×913). Cropping a
          face to a wide banner and dropping it to 40% opacity under a gradient
          turned the picture he chose into wallpaper.
          
          So: the band carries the title, and his photograph is shown properly
          underneath it at its own shape. The photo he put first is the first
          thing you see, the way he meant it.
        */}
        <section className="relative overflow-hidden bg-deep text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 70% at 80% -20%, rgba(201,150,46,0.20), transparent 62%), radial-gradient(60% 60% at 0% 120%, rgba(14,107,112,0.55), transparent 65%)",
            }}
          />
          <div className="container-content relative max-w-3xl py-16 sm:py-20">
            {db.tags[0] && (
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">
                {db.tags[0]}
              </p>
            )}
            <h1 className="h-display mt-3 max-w-2xl text-4xl !text-white sm:text-5xl lg:text-[3.3rem] lg:leading-[1.08]">
              {db.title}
            </h1>
            <div className="byline mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/70">
              <span>
                By{" "}
                <Link
                  href={dbAuthorHref(db.author_handle)}
                  className="font-semibold text-gold hover:underline"
                >
                  {dbAuthorName(db.author_handle)}
                </Link>
              </span>
              <span>{dbPostDate(db)}</span>
              <span>{enrich.readingMinutes} min read</span>
              <PageViews path={`/blog/${db.slug}`} label="reads" />
            </div>
          </div>
        </section>

        <section className="container-content max-w-3xl py-12">
          {/*
            Photographs carry Don's own captions when he has written them. The
            caption becomes BOTH the visible line under the picture and the alt
            text, which is what makes the photo findable in Google Images and
            audible to anyone using a screen reader. Before this, every photo
            here had alt="" — 56 pictures from Malawi that no search engine and
            no blind reader could see at all.
          */}
          {/* His photograph, shown at its own shape — not cropped to a banner. */}
          {db.photo_urls[0] && (
            <figure className="mx-auto mb-10 max-w-[40rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storageImage(db.photo_urls[0], 1000)}
                alt={
                  caption(0) ||
                  `${db.title} — photograph by ${dbAuthorName(db.author_handle)}`
                }
                width={1000}
                height={950}
                fetchPriority="high"
                className="w-full rounded-2xl bg-sand-dark object-cover shadow-lg ring-1 ring-ink/10"
              />
              {caption(0) && (
                <figcaption className="mt-3 text-center text-sm italic text-ink/55">
                  {caption(0)}
                </figcaption>
              )}
            </figure>
          )}

          <ArticleBody
            paragraphs={paragraphs}
            pullQuote={enrich.pullQuote}
            pullQuoteAfter={enrich.pullQuoteAfter}
            links={enrich.links}
          />

          {/* Twelve photographs, then a button for the rest. See PostPhotos. */}
          <PostPhotos
            urls={db.photo_urls.slice(1)}
            captions={db.photo_urls.slice(1).map((_, n) => db.photo_captions?.[n + 1] ?? null)}
            title={db.title}
          />

          {db.link_url && db.link_label && (
            <a
              href={db.link_url}
              className="btn-give mt-8"
              {...(db.link_url.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {db.link_label}
            </a>
          )}

          {/*
            Built automatically from the story: the matching supply item, the
            follow box, sharing, and the album from that country. All of it
            sits after his last line — nothing interrupts the read.
          */}
          <PostEnrichment
            e={enrich}
            title={db.title}
            path={`/blog/${db.slug}`}
            authorName={dbAuthorName(db.author_handle)}
          />

          <Comments postId={db.id} />

          <div className="mt-10 text-center">
            <Link href="/blog" className="btn-outline">
              Read more stories
            </Link>
          </div>
        </section>

        {/* Appears only once the reader is 55% through, and can be dismissed. */}
        {enrich.item && (
          <StickyGive item={enrich.item} headline={enrich.askHeadline} />
        )}
      </article>
    );
  }

  const date = new Date(post.date + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author:
      post.author === "both"
        ? [
            { "@type": "Person", name: "Don Nichols", url: `${site.url}/don` },
            { "@type": "Person", name: "Patti Nichols", url: `${site.url}/patti` },
          ]
        : { "@type": "Person", name: authorNames(post.author), url: `${site.url}/${post.author}` },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-deep py-14 text-white">
        <div className="container-content max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {post.category}
          </p>
          <h1 className="h-display mt-2 text-3xl !text-white sm:text-5xl">{post.title}</h1>
          <div className="mt-3"><PageViews path={`/blog/${post.slug}`} label="reads" /></div>
          <p className="mt-4 text-white/75">
            By{" "}
            {post.author === "both" ? (
              <span className="font-semibold text-white">Don &amp; Patti Nichols</span>
            ) : (
              <Link href={`/${post.author}`} className="font-semibold text-gold hover:underline">
                {authorNames(post.author)}
              </Link>
            )}{" "}
            · {date}
          </p>
        </div>
      </section>

      <section className="container-content max-w-3xl py-12">
        <div className="prose-mission">
          {post.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-7">
          <h2 className="font-serif text-xl font-bold">Stand with the mission</h2>
          <p className="mt-2 text-ink/75">
            If this stirred your heart, share it with someone — and consider partnering with the
            work in Belize.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="blog_post" className="btn-give">
              Give to the Mission
            </GiveLink>
            <ShareButton
              title={post.title}
              text="A story from the mission field — Don & Patti Nichols"
              path={`/blog/${post.slug}`}
            />
            <Link href="/blog" className="btn-outline">
              More Posts
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
