import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, guideBySlug } from "@/content/guides";
import { prayerDays } from "@/content/prayer";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt, photoCaption } from "@/content/captions";
import { site } from "@/lib/site";
import { keywords, articleLd, howToLd, faqLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";
import JoinForm from "@/components/JoinForm";
import GiveLink from "@/components/GiveLink";
import ReadingProgress from "@/components/ReadingProgress";
import PageViews from "@/components/PageViews";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const guide = guideBySlug((await params).slug);
  if (!guide) return {};
  // No `image` here — opengraph-image.tsx in this folder builds the card.
  return createPageMetadata({
    path: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.description,
    keywords: keywords(guide.keywordSet, "core"),
    type: "article",
    publishedTime: guide.datePublished,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const isPrayer = guide.slug === "how-to-pray-for-a-mission-team";

  const ld: unknown[] = [
    articleLd({
      headline: guide.title,
      description: guide.description,
      path,
      datePublished: guide.datePublished,
      image: photo(guide.hero, 1600),
      keywords: keywords(guide.keywordSet),
      author: { name: "Don & Patti Nichols", path: "/our-story" },
    }),
    faqLd(guide.faqs),
  ];
  if (guide.steps) {
    ld.push(
      howToLd({
        name: guide.title,
        description: guide.description,
        path,
        steps: guide.steps,
        image: photo(guide.hero, 1600),
      }),
    );
  }

  return (
    <article>
      <JsonLd data={ld} />
      <ReadingProgress />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(guide.hero, 1600)}
          srcSet={photoSrcSet(guide.hero, [900, 1600, 2000, 2400])}
          sizes="100vw"
          alt={photoAlt(guide.hero, guide.title, 0)}
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
              { name: guide.eyebrow, path },
            ]}
          />
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-gold">
            {guide.eyebrow}
          </p>
          <h1 className="h-display mt-3 text-4xl !text-white sm:text-5xl lg:text-[3.3rem] lg:leading-[1.08]">
            {guide.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            {guide.description}
          </p>
          <div className="byline mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
            <span>Built from Don Nichols&rsquo; published record</span>
            <span>
              {new Date(guide.datePublished + "T12:00:00").toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              )}
            </span>
            <PageViews path={path} label="reads" />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container-content max-w-3xl py-12 sm:py-14">
        <div className="guide-body">
          {guide.intro.map((p, i) => (
            <p key={i} className={i === 0 ? "article-lede dropcap" : undefined}>
              {p}
            </p>
          ))}

          {guide.sections.map((s) => (
            <div key={s.heading} className="reveal">
              <h2>{s.heading}</h2>
              {s.quote && (
                <figure className="mt-6 border-l-4 border-gold pl-6">
                  <blockquote className="font-serif text-xl font-bold italic leading-snug text-deep sm:text-2xl">
                    &ldquo;{s.quote.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 text-sm text-ink/55">
                    — {s.quote.from}
                  </figcaption>
                </figure>
              )}
              {s.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((li) => (
                    <li key={li}>
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.general && (
                <aside className="mt-6 rounded-2xl border border-sea/25 bg-sea/[0.06] p-5">
                  <p className="!mt-0 text-xs font-bold uppercase tracking-widest text-sea">
                    General guidance — not Don&rsquo;s words
                  </p>
                  {s.general.map((g, i) => (
                    <p key={i} className="!mt-3 !text-base">
                      {g}
                    </p>
                  ))}
                </aside>
              )}
            </div>
          ))}

          {isPrayer && (
            <div className="reveal">
              <h2>The seven days</h2>
              <ol className="mt-6 space-y-5">
                {prayerDays.map((d) => (
                  <li
                    key={d.day}
                    id={`day-${d.day}`}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10"
                  >
                    <div className="grid sm:grid-cols-[180px_1fr]">
                      <div className="relative min-h-[140px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo(d.photo, 600)}
                          srcSet={photoSrcSet(d.photo, [400, 600, 900])}
                          sizes="(min-width: 640px) 180px, 100vw"
                          alt={photoAlt(d.photo, "Prayer guide", d.day - 1)}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-deep">
                          Day {d.day}
                        </span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className="font-serif text-xl font-bold text-ink">
                          {d.title}
                        </h3>
                        <p className="!mt-2 !text-base text-ink/75">{d.focus}</p>
                        <p className="!mt-3 rounded-r-xl border-l-4 border-sea/40 bg-sea/[0.06] py-3 pl-4 pr-3 font-serif !text-base italic text-deep">
                          &ldquo;{d.verse.text}&rdquo;{" "}
                          <span className="not-italic text-xs font-bold uppercase tracking-widest text-sea">
                            {d.verse.ref}
                          </span>
                        </p>
                        <ul className="!mt-3">
                          {d.points.map((p) => (
                            <li key={p} className="!text-[15px]">
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {guide.steps && (
            <div className="reveal">
              <h2>Step by step</h2>
              <ol className="mt-6 space-y-4">
                {guide.steps.map((s, i) => (
                  <li
                    key={s.name}
                    id={`step-${i + 1}`}
                    className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-deep font-serif text-lg font-bold text-gold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ink">
                        {s.name}
                      </h3>
                      <p className="!mt-1.5 !text-base text-ink/80">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Hero photo, shown properly */}
        <figure className="reveal mt-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo(guide.hero, 1200)}
            srcSet={photoSrcSet(guide.hero, [800, 1200, 1600, 2000])}
            sizes="(min-width: 768px) 48rem, 100vw"
            alt={photoAlt(guide.hero, guide.title, 0)}
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl bg-sand-dark object-cover shadow-lg ring-1 ring-ink/10"
          />
          {photoCaption(guide.hero) && (
            <figcaption className="mt-3 text-center text-sm italic text-ink/55">
              {photoCaption(guide.hero)}
            </figcaption>
          )}
        </figure>

        {/* Tools */}
        <div className="reveal mt-12">
          <p className="eyebrow">Use it</p>
          <h2 className="h-display mt-2 text-2xl sm:text-3xl">
            Tools that go with this guide
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {guide.tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex flex-col rounded-2xl border-2 border-sea/20 bg-white p-6 transition hover:-translate-y-0.5 hover:border-sea/50 hover:shadow-md"
              >
                <p className="font-serif text-xl font-bold text-ink group-hover:text-sea">
                  {t.label}
                </p>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink/70">
                  {t.blurb}
                </p>
                <span className="mt-4 text-sm font-bold uppercase tracking-widest text-gold-dark">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="reveal mt-12">
          <h2 className="h-display text-2xl sm:text-3xl">Questions people ask</h2>
          <dl className="mt-6 space-y-4">
            {guide.faqs.map((f) => (
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

        {/* Give */}
        <div className="reveal mt-12 rounded-2xl bg-deep p-7 text-white sm:p-9">
          <h2 className="h-display text-2xl !text-white sm:text-3xl">
            Everything on this page is given away free in Belize.
          </h2>
          <p className="mt-3 max-w-xl text-white/80">
            Somebody back home pays for it first. If this guide was useful,
            that is how you stand in it.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <GiveLink location={`guide_${guide.slug}`} href="/sponsor" className="btn-give">
              Fill the Trunks
            </GiveLink>
            <ShareButton
              title={guide.title}
              text={guide.description}
              path={path}
              dark
            />
          </div>
        </div>

        {/* Follow */}
        <div className="reveal mt-10 rounded-2xl border-2 border-sea/20 bg-white p-6 sm:p-7">
          <h2 className="h-display text-2xl">Get the next guide</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
            Leave your email and you&rsquo;ll get new guides, trip announcements,
            and Don&rsquo;s own stories from the field.
          </p>
          <div className="mt-5 max-w-md">
            <JoinForm
              source={`guide_${guide.slug}`}
              interest={guide.keywordSet}
              askName
              submitLabel="Send me the next one"
            />
          </div>
        </div>

        {/* Related */}
        <div className="reveal mt-12">
          <h2 className="h-display text-2xl">Keep reading</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {guide.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-sea ring-1 ring-sea/15 transition hover:ring-sea"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* More guides */}
      <section className="bg-sand-dark py-14">
        <div className="container-content">
          <h2 className="h-display text-2xl sm:text-3xl">More guides</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/10 transition hover:shadow-lg"
              >
                <div className="aspect-[16/9] overflow-hidden bg-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo(g.hero, 700)}
                    srcSet={photoSrcSet(g.hero, [500, 700, 1000])}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    alt={photoAlt(g.hero, g.title, 0)}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-sea">
                    {g.eyebrow}
                  </p>
                  <p className="mt-1 font-serif text-lg font-bold leading-snug text-ink group-hover:text-sea">
                    {g.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink/60">
            All guides and tools live on the{" "}
            <Link href="/resources" className="font-semibold text-sea underline">
              Resources
            </Link>{" "}
            page. Every fact about the mission on them comes from what Don has
            published at{" "}
            <span className="font-semibold">{site.url.replace("https://", "")}</span>.
          </p>
        </div>
      </section>
    </article>
  );
}
