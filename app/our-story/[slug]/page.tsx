import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLifeStory, lifeStories } from "@/content/life-stories";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LifeStoryCard from "@/components/LifeStoryCard";
import ReadingProgress from "@/components/ReadingProgress";
import ShareButton from "@/components/ShareButton";
import { createPageMetadata } from "@/lib/metadata";
import { articleLd, ogCardImage } from "@/lib/seo";

function displayDate(value: string) {
  return new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    },
  );
}

export function generateStaticParams() {
  return lifeStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getLifeStory(slug);
  if (!story) return {};
  return createPageMetadata({
    path: `/our-story/${story.slug}`,
    title: story.title,
    description: story.excerpt,
    type: "article",
    publishedTime: story.publishedOn,
    authors: [story.narrator],
    keywords: [
      "Don and Patti Nichols",
      "Nichols family stories",
      story.category,
      ...story.subjects.map((subject) =>
        subject === "don" ? "Don Nichols" : "Patti Nichols",
      ),
    ],
    image: ogCardImage({
      eyebrow: story.category,
      title: story.title,
      line: story.excerpt,
      meta: `As remembered by ${story.narrator}`,
    }),
  });
}

export default async function LifeStoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getLifeStory(slug);
  if (!story) notFound();
  const position = lifeStories.findIndex((item) => item.slug === story.slug);
  const narratorPath =
    story.narrator === "Don Nichols" ? "/don" : "/our-story#ryan-nichols";
  const words = story.paragraphs.join(" ").trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));
  const related = [
    ...lifeStories.filter(
      (item) => item.slug !== story.slug && item.category === story.category,
    ),
    ...lifeStories.filter(
      (item) => item.slug !== story.slug && item.category !== story.category,
    ),
  ].slice(0, 2);
  const shareImage = ogCardImage({
    eyebrow: story.category,
    title: story.title,
    line: story.excerpt,
    meta: `As remembered by ${story.narrator}`,
  });
  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={articleLd({
          headline: story.title,
          description: story.excerpt,
          path: `/our-story/${story.slug}`,
          datePublished: story.publishedOn,
          image: shareImage.url,
          author: { name: story.narrator, path: narratorPath },
          keywords: ["Don and Patti Nichols", story.category],
        })}
      />
      <article>
        <header className="border-b border-sea/20 bg-deep text-white">
          <div className="container-content max-w-5xl pb-12 pt-7 sm:pb-16 sm:pt-9">
            <Breadcrumbs
              dark
              crumbs={[
                { name: "Our Story", path: "/our-story" },
                { name: story.title, path: `/our-story/${story.slug}` },
              ]}
            />
            <div className="mt-10 flex items-center gap-4 sm:mt-14">
              <span aria-hidden className="font-serif text-4xl text-gold">
                {String(position + 1).padStart(2, "0")}
              </span>
              <span aria-hidden className="h-8 w-px bg-white/25" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                {story.category}
              </p>
            </div>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              {story.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
              {story.excerpt}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm leading-relaxed text-white/75">
              <p>
                As remembered by{" "}
                <Link
                  href={narratorPath}
                  className="font-semibold text-white underline decoration-gold/80 underline-offset-4 hover:decoration-white"
                >
                  {story.narrator}
                </Link>
              </p>
              <p>{readingMinutes} min read</p>
            </div>
          </div>
        </header>
        <div className="container-content max-w-5xl py-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-12">
            <aside className="border-b border-sea/15 pb-5 lg:border-b-0 lg:pb-0">
              <p className="text-xs font-bold uppercase tracking-[0.17em] text-sea">
                A family memory
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                Published{" "}
                <time dateTime={story.publishedOn}>
                  {displayDate(story.publishedOn)}
                </time>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/65">
                Part of the Don &amp; Patti Nichols family collection.
              </p>
            </aside>
            <div className="min-w-0">
              <div className="article-body">
                {story.paragraphs.map((paragraph, index) => (
                  <Fragment key={`${story.slug}-${index}`}>
                    <p>{paragraph}</p>
                    {story.quote && index === 1 && (
                      <figure className="border-y border-gold/35 py-7 sm:py-9">
                        <blockquote className="font-serif text-2xl italic leading-relaxed text-sea sm:text-3xl">
                          &ldquo;{story.quote}&rdquo;
                        </blockquote>
                        <figcaption className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-ink/60">
                          {story.narrator}
                        </figcaption>
                      </figure>
                    )}
                  </Fragment>
                ))}
              </div>
              <div className="mt-9 border-l-2 border-gold/60 pl-5 text-sm leading-relaxed text-ink/65">
                <p>
                  Adapted from {story.narrator}&rsquo;s recollections, recorded
                  on{" "}
                  <time dateTime={story.recordedOn}>
                    {displayDate(story.recordedOn)}
                  </time>
                  . This is an edited retelling; words in quotation marks are
                  the speaker&rsquo;s own. The recording date is not the date
                  the events took place.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/our-story#stories"
                  className="inline-flex min-h-11 items-center text-sm font-bold text-sea underline-offset-4 hover:underline"
                >
                  <span aria-hidden className="mr-2">
                    ←
                  </span>{" "}
                  All family stories
                </Link>
                <ShareButton
                  title={story.title}
                  text={story.excerpt}
                  path={`/our-story/${story.slug}`}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
      <section
        className="border-t border-sea/15 bg-sand-dark/40"
        aria-labelledby="read-next-heading"
      >
        <div className="container-content max-w-5xl py-12 sm:py-16">
          <p className="eyebrow">Another chapter</p>
          <h2
            id="read-next-heading"
            className="mb-7 mt-3 font-serif text-3xl font-bold tracking-tight text-deep"
          >
            Stay a little longer.
          </h2>
          <div className="grid gap-x-10 md:grid-cols-2">
            {related.map((item) => (
              <LifeStoryCard key={item.slug} story={item} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-deep text-white">
        <div className="container-content flex max-w-5xl flex-col justify-between gap-6 py-10 sm:py-12 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-2xl font-bold">
              Be part of the next chapter.
            </p>
            <p className="mt-3 max-w-xl leading-relaxed text-white/80">
              Follow Don and Patti&rsquo;s mission work and the people they
              serve.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/blog"
              className="btn border border-white/60 text-white hover:bg-white hover:text-deep"
            >
              Mission stories
            </Link>
            <Link href="/give" className="btn-give">
              Support the work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
