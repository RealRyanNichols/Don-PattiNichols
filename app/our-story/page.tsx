import type { Metadata } from "next";
import Link from "next/link";
import { lifeStories } from "@/content/life-stories";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import LifeStoriesExplorer from "@/components/LifeStoriesExplorer";
import { createPageMetadata } from "@/lib/metadata";
import { absolute, ogCardImage } from "@/lib/seo";
import { site } from "@/lib/site";

const portrait =
  "https://rxjsykcbedtyxfvyfyhl.supabase.co/storage/v1/object/public/mission-photos/2026/00fbecb8-4cb7-48c7-89f5-345266ae8290.jpeg";

export const metadata: Metadata = createPageMetadata({
  path: "/our-story",
  title: "Our Story: Life, Family & Faith",
  description:
    "Meet Don and Patti Nichols through family memories, marriage, fishing stories, and a life of Christian ministry, remembered by Don and their son Ryan.",
  keywords: [
    "Don and Patti Nichols",
    "Don Nichols family",
    "Patti Nichols faith",
    "Nichols family stories",
    "Christian marriage and ministry",
  ],
  image: ogCardImage({
    eyebrow: "The Nichols family",
    title: "A life shared. A faith lived.",
    line: "The family, the ministry, and the memories that make Don and Patti who they are.",
    alt: "Our Story: Life, Family and Faith of Don and Patti Nichols",
  }),
});

export default function OurStoryPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Our Story: Life, Family & Faith",
          description:
            "Family memories and ministry stories about Don and Patti Nichols, remembered by Don and their son Ryan.",
          url: absolute("/our-story"),
          image: portrait,
          about: [
            { "@type": "Person", name: "Don Nichols", url: absolute("/don") },
            {
              "@type": "Person",
              name: "Patti Nichols",
              url: absolute("/patti"),
            },
          ],
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: lifeStories.length,
            itemListElement: lifeStories.map((story, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: story.title,
              url: absolute(`/our-story/${story.slug}`),
            })),
          },
        }}
      />
      <section className="overflow-hidden border-b border-sea/15">
        <div className="container-content pb-12 pt-7 sm:pb-16 sm:pt-9">
          <Breadcrumbs crumbs={[{ name: "Our Story", path: "/our-story" }]} />
          <div className="mt-9 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
            <div className="py-2 lg:py-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sea">
                Don &amp; Patti Nichols · Our story
              </p>
              <h1 className="mt-5 font-serif text-[2.85rem] font-bold leading-[1.07] tracking-tight text-deep sm:text-6xl lg:text-[4.5rem]">
                A life shared.
                <br />
                <span className="font-normal italic text-sea">
                  A faith lived.
                </span>
              </h1>
              <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/80 sm:text-xl">
                A marriage. A family. A calling to serve. Get to know the people
                behind the mission through the moments their family remembers.
              </p>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/70">
                From raising their boys to caring for neighbors, from a fishing
                boat to a village clinic, these are chapters in Don and
                Patti&rsquo;s life together.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#stories" className="btn-primary">
                  Read their stories <span aria-hidden>↓</span>
                </a>
                <Link
                  href="/albums"
                  className="inline-flex min-h-12 items-center justify-center px-4 text-sm font-semibold text-sea underline decoration-sea/35 underline-offset-4 hover:decoration-sea"
                >
                  Open the photo albums
                </Link>
              </div>
            </div>
            <figure className="mx-auto w-full max-w-lg">
              <div className="rounded-t-[6rem] border border-sea/20 bg-white p-3 shadow-[0_18px_50px_-28px_rgba(10,61,64,0.45)] sm:rounded-t-[8rem] sm:p-4">
                {/* Keep the full photograph, including both people and the glasses table. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={portrait}
                  alt="Don and Patti Nichols sitting together behind a table of reading glasses in Belize"
                  width={735}
                  height={809}
                  fetchPriority="high"
                  className="h-auto w-full rounded-t-[5.25rem] sm:rounded-t-[7rem]"
                />
              </div>
              <figcaption className="mt-3 flex items-start gap-3 px-1 text-xs leading-relaxed text-ink/65">
                <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-gold" />
                Don and Patti at the reading-glasses table in Belize.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section
        id="stories"
        aria-labelledby="stories-heading"
        className="container-content scroll-mt-28 py-14 sm:py-20"
      >
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow">The family collection</p>
            <h2
              id="stories-heading"
              className="mt-3 font-serif text-3xl font-bold tracking-tight text-deep sm:text-4xl"
            >
              The moments that stay with us.
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-relaxed text-ink/75">
            A decision that put family first. A mother&rsquo;s steady faith. A
            night on the lake that still makes a good story. Begin anywhere.
            Each memory offers another way to know Don and Patti.
          </p>
        </div>
        <LifeStoriesExplorer stories={lifeStories} />
      </section>
      <section className="border-y border-sea/15 bg-sand-dark/60">
        <div className="container-content grid gap-10 py-12 sm:py-16 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <div>
            <p className="eyebrow">The people in these pages</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-deep">
              Get to know Don &amp; Patti.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-ink/75">
              Their life at home and their work in the mission field belong to
              the same story: faith lived out in the people they love and serve.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/don" className="btn-primary">
                Meet Don
              </Link>
              <Link href="/patti" className="btn-outline">
                Meet Patti
              </Link>
            </div>
          </div>
          <div
            id="ryan-nichols"
            className="scroll-mt-28 border-l-2 border-gold/60 pl-6 sm:pl-8"
          >
            <h3 className="font-serif text-xl font-bold text-deep">
              Remembered by Don and their son, Ryan
            </h3>
            <p className="mt-4 leading-relaxed text-ink/75">
              These stories are adapted from recorded family recollections. Don
              shares memories from his own life; Ryan Nichols reflects on
              growing up as Don and Patti&rsquo;s son. Each story identifies
              whose memory you are reading.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Recording dates tell you when a memory was shared, rather than
              when the events happened.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-deep text-white">
        <div className="container-content grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Their story continues
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Walk alongside the mission.
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
              Read Don and Patti&rsquo;s updates from the field, pray for the
              people they serve, or help make their next trip possible.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
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
        <div className="container-content border-t border-white/15 pb-8 pt-6 text-sm italic leading-relaxed text-white/70">
          &ldquo;{site.verse.text}&rdquo;{" "}
          <span className="whitespace-nowrap not-italic">
            {site.verse.reference}
          </span>
        </div>
      </section>
    </>
  );
}
