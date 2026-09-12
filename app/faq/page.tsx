import type { Metadata } from "next";
import Link from "next/link";
import { faqGroups, allFaqs } from "@/content/faq";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, faqLd, ogCardImage } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import GiveLink from "@/components/GiveLink";
import ShareButton from "@/components/ShareButton";

const TITLE = "Frequently Asked Questions — Belize Medical Missions";
const DESC =
  "Straight answers about Don & Patti Nichols' medical mission work: is the care really free, what a trip costs, how to give, whether gifts are tax-deductible, what is in a hygiene kit, how supplies clear customs, and how to invite Don to speak.";

export const metadata: Metadata = createPageMetadata({
  path: "/faq",
  title: TITLE,
  description: DESC,
  keywords: keywords("core", "giving", "costs", "churches"),
  image: ogCardImage({
    eyebrow: "Questions people ask",
    title: "Is the care really free? What does a trip cost? Who is paid?",
    line: `${allFaqs.length} straight answers from Don Nichols' published record.`,
    photo: "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI",
  }),
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd(allFaqs)} />

      <section className="relative overflow-hidden bg-deep text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 85% -10%, rgba(201,150,46,0.25), transparent 60%)",
          }}
        />
        <div className="container-content relative py-14 sm:py-18">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Resources", path: "/resources" },
              { name: "FAQ", path: "/faq" },
            ]}
          />
          <p className="identity-line mt-6">Questions people ask</p>
          <h1 className="h-display mt-4 max-w-3xl text-4xl !text-white sm:text-5xl">
            Straight answers.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Everything below is drawn from what Don has published on this site
            and from his own trip record. Where a detail is not public yet, the
            answer says so instead of guessing.
          </p>
          <nav aria-label="Sections" className="mt-7 flex flex-wrap gap-2">
            {faqGroups.map((g) => (
              <a
                key={g.title}
                href={`#${g.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                {g.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="container-content max-w-3xl py-12 sm:py-14">
        {faqGroups.map((g) => (
          <div
            key={g.title}
            id={g.title.toLowerCase().replace(/[^a-z]+/g, "-")}
            className="reveal scroll-mt-24 [&+&]:mt-12"
          >
            <h2 className="h-display text-2xl sm:text-3xl">{g.title}</h2>
            <div className="mt-5 space-y-3">
              {g.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl bg-white shadow-sm ring-1 ring-ink/10 open:ring-sea/40"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-serif text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sand-dark text-sea transition group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 leading-relaxed text-ink/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="reveal mt-14 rounded-2xl bg-deep p-7 text-white sm:p-9">
          <h2 className="h-display text-2xl !text-white sm:text-3xl">
            Didn&rsquo;t find it?
          </h2>
          <p className="mt-3 max-w-xl text-white/80">
            Send a message and Don or Patti will answer it personally. If it is
            a question other people will have too, it goes on this page.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-give">
              Ask a question
            </Link>
            <GiveLink
              location="faq"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Give to the mission
            </GiveLink>
            <ShareButton title={TITLE} text={DESC} path="/faq" dark />
          </div>
        </div>
      </section>
    </>
  );
}
