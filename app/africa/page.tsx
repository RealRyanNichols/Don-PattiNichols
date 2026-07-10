import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { africaPlaces, comingToThisPage } from "@/content/africa";

// Unlisted preview — not in the nav or sitemap, hidden from search engines
// until Don is ready to tell these stories.
export const metadata: Metadata = {
  title: "Africa — The Journeys Before and Beyond",
  description:
    "Don Nichols has served on multiple mission trips across Africa — Malawi, Mozambique, and many other places. Their stories, photographs, and the book about them are coming.",
  robots: { index: false, follow: false },
};

export default function AfricaPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-deep py-16 text-white sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 75% -10%, rgba(201,150,46,0.28), transparent 60%), radial-gradient(50% 60% at 10% 110%, rgba(14,107,112,0.5), transparent 65%)",
          }}
        />
        <div className="container-content relative">
          <p className="identity-line">
            <span>Don Nichols · Mission Journeys</span>
          </p>
          <h1 className="h-display mt-6 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Africa. <span className="italic text-gold">The stories are coming.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Don Nichols has served on multiple mission trips across Africa — to Malawi,
            Mozambique, and many other places. The stories from those journeys, the people God put
            in his path, and the photographs that came home with him deserve a place of their own.
            This page is being prepared for them — in Don&rsquo;s own words, as he tells them.
          </p>
        </div>
      </section>

      <section className="container-content py-14 sm:py-16">
        <p className="eyebrow">The Journeys</p>
        <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
          Where the road has already led
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {africaPlaces.map((place) => (
            <div
              key={place.name}
              className="flex h-full flex-col rounded-2xl border-2 border-dashed border-sea/40 bg-white p-7"
            >
              <h3 className="font-serif text-2xl font-bold">{place.name}</h3>
              <p className="mt-3 flex-1 text-ink/70">
                Stories and photographs coming — as Don tells them.
              </p>
              <p className="mt-4 rounded-full bg-gold/15 px-4 py-1 text-center text-xs font-bold uppercase tracking-widest text-gold-dark">
                Coming Soon
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div className="justify-self-center">
              {/* Placeholder book cover — replaced with the real cover when Don shares it. */}
              <div
                aria-hidden="true"
                className="relative flex h-80 w-56 flex-col justify-between rounded-r-xl rounded-l-sm bg-deep p-6 text-sand shadow-md"
              >
                <span className="absolute inset-y-0 left-0 w-2 rounded-l-sm bg-gold" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  The Africa Journeys
                </p>
                <div>
                  <p className="font-serif text-2xl font-bold leading-snug">
                    Title coming soon
                  </p>
                  <p className="mt-3 text-sm text-sand/70">Don Nichols</p>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-sand/50">
                  Cover in preparation
                </p>
              </div>
            </div>
            <div>
              <p className="eyebrow">The Book</p>
              <h2 className="h-display mt-2 text-3xl sm:text-4xl">
                Don wrote about these journeys
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                What he wrote is being prepared for release — and every copy sold will help fund
                future mission trips. Title, cover, and release details will appear here when
                Don is ready to share them.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/store" className="btn-primary">
                  The Store
                </Link>
                <Link href="/don" className="btn-outline">
                  About Don
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-content py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border-2 border-dashed border-sea/40 bg-white p-7">
            <p className="eyebrow">Coming to this page</p>
            <ul className="mt-4 space-y-2 text-ink/75">
              {comingToThisPage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-deep p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Why isn&rsquo;t this filled in yet?
            </p>
            <p className="mt-3 font-serif text-xl leading-relaxed">
              Don&rsquo;s focus right now is the Belize mission. When that work is where he wants
              it, he&rsquo;ll begin telling these stories.
            </p>
            <p className="mt-4 text-white/75">
              Want to be first to read them? Follow the mission by email.
            </p>
            <div className="mt-5 rounded-xl bg-sand p-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-7 text-center">
          <p className="text-lg text-ink/75">
            Today, the mission is Belize — free medical clinics, Bibles, and the hope of Jesus
            Christ.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/belize" className="btn-primary">
              The Belize Mission
            </Link>
            <Link href="/give" className="btn-give">
              Give to the Mission
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
