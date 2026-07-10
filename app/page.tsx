import Link from "next/link";
import Countdown from "@/components/Countdown";
import GiveLink from "@/components/GiveLink";
import NewsletterForm from "@/components/NewsletterForm";
import PostCard from "@/components/PostCard";
import VerseRotator from "@/components/VerseRotator";
import { belizeParagraphs } from "@/content/belize";
import { journeySteps } from "@/content/journey";
import { missionParagraphs } from "@/content/mission";
import { posts } from "@/content/posts";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

const giftCards = [
  {
    title: "Reading Glasses & Vision Care",
    text: "A simple pair of reading glasses lets someone read again, sew clothing, study God's Word, complete paperwork, or keep earning a living.",
  },
  {
    title: "Medications & Hygiene Kits",
    text: "Free medical evaluations, medications, and hygiene supplies for families in villages where care is hard to reach and hard to afford.",
  },
  {
    title: "Bibles & Pastor Support",
    text: "Study Bibles, Gospel literature, and practical encouragement that strengthen village pastors and the local church.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-deep text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 75% -10%, rgba(201,150,46,0.22), transparent 60%), radial-gradient(60% 50% at 10% 110%, rgba(14,107,112,0.55), transparent 65%)",
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-24 select-none font-serif text-[24rem] font-bold leading-none text-white/[0.05] sm:text-[30rem]"
        >
          ✝
        </span>
        <div className="container-content relative py-16 sm:py-24">
          <p className="identity-line">
            <span>Don &amp; Patti Nichols · Belize Medical Missions</span>
          </p>
          <h1 className="h-display mt-6 max-w-3xl text-4xl !text-white sm:text-5xl lg:text-6xl">
            Medical Care for the Body. <span className="italic text-gold">Hope for the Soul.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Free medical clinics, pharmacy services, vision care, and personal evangelism in the
            villages of Belize. Every patient served completely free of charge — because the love
            of Christ should never have a price tag.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <GiveLink location="hero" className="btn-give text-lg">
              Give to the Mission
            </GiveLink>
            <Link
              href="/belize"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              The Belize Mission
            </Link>
          </div>

          <div className="mt-12 rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                  Next Trip · {site.trip.dateLabel || "Dates announced soon"}
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                  {site.trip.title}
                </h2>
                <div className="mt-4 max-w-md">
                  <p className="text-sm text-white/75">
                    Trip fundraising goal will be posted soon. Every gift given now goes straight
                    to the mission.
                  </p>
                </div>
              </div>
              <Countdown startDate={site.trip.startDate} label="Countdown to departure" />
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-black/10">
          <div className="container-content py-5 text-center">
            <VerseRotator />
          </div>
        </div>
      </section>

      <section className="container-content py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Our Mission</p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">
              Caring for people physically. Introducing them to eternal hope.
            </h2>
            <Link href="/mission" className="btn-primary mt-6">
              Read Our Full Mission
            </Link>
          </div>
          <div className="prose-mission">
            {missionParagraphs.slice(0, 2).map((text) => (
              <p key={text.slice(0, 32)}>{text}</p>
            ))}
          </div>
        </div>
        <figure className="mt-12">
          <img
            src={photos.team}
            alt="The mission team gathered in front of the Belize Anchor Mission church"
            className="w-full rounded-2xl object-cover shadow-md"
            loading="lazy"
          />
          <figcaption className="mt-3 text-center text-sm italic text-ink/60">
            The mission team in Belize — gathered where the work happens.
          </figcaption>
        </figure>
      </section>

      <section className="bg-sand-dark py-16 sm:py-20">
        <div className="container-content">
          <p className="eyebrow">What Your Gift Does</p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
            Every service, every item, every conversation — completely free.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {giftCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-xl font-bold">{card.title}</h3>
                <p className="mt-3 text-ink/75">{card.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row">
            <GiveLink location="impact_section_sponsor" href="/sponsor" className="btn-give">
              Fill the Trunks — Sponsor Supplies
            </GiveLink>
            <GiveLink location="impact_section" className="btn-outline">
              Give Now
            </GiveLink>
            <GiveLink location="impact_section_monthly" href="/give#monthly" className="btn-outline">
              Give Monthly
            </GiveLink>
          </div>
        </div>
      </section>

      <section className="container-content py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="prose-mission">
            <p className="eyebrow">Why Belize?</p>
            {belizeParagraphs.slice(0, 2).map((text) => (
              <p key={text.slice(0, 32)} className="mt-4">
                {text}
              </p>
            ))}
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-deep p-8 text-white">
            <p className="font-serif text-2xl font-bold leading-snug">
              Hundreds of rural communities. Limited healthcare. A rich Christian heritage worth
              strengthening.
            </p>
            <Link href="/belize" className="btn-give mt-6 self-start">
              See Why We Go
            </Link>
          </div>
        </div>
      </section>

      <section className="container-content py-16 sm:py-20">
        <p className="eyebrow">The Story of a Mission</p>
        <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
          From the need to the harvest — how it all works
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journeySteps.map((step, i) => (
            <Link
              key={step.title}
              href={step.href}
              className="group rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-serif text-3xl font-bold text-gold">{i + 1}</p>
              <h3 className="mt-1 font-serif text-lg font-bold group-hover:text-sea">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink/70">{step.text}</p>
            </Link>
          ))}
        </div>
        <Link href="/behind-the-mission" className="btn-outline mt-8">
          See What Happens Behind Every Trip
        </Link>
      </section>

      <section className="bg-sand-dark py-16 sm:py-20">
        <div className="container-content">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From Don &amp; Patti</p>
              <h2 className="h-display mt-2 text-3xl sm:text-4xl">Latest Updates</h2>
            </div>
            <Link href="/blog" className="font-semibold text-sea hover:underline">
              All posts →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sea py-14 text-center text-white">
        <div className="container-content max-w-3xl">
          <p className="font-serif text-2xl italic leading-relaxed sm:text-3xl">
            &ldquo;
            {
              "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
            }
            &rdquo;
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-white/80">
            Matthew 28:19
          </p>
        </div>
      </section>

      <section id="newsletter" className="container-content py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Stay Connected</p>
            <h2 className="h-display mt-2 text-3xl sm:text-4xl">Follow the mission by email</h2>
            <p className="mt-4 text-lg text-ink/75">
              Trip announcements, field updates, and words from Don &amp; Patti — straight to your
              inbox. No spam, ever.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <section className="bg-deep py-16 text-center text-white">
        <div className="container-content max-w-3xl">
          <h2 className="h-display text-3xl !text-white sm:text-4xl">
            Partner with the mission today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Your generosity carries medical care, Bibles, and the hope of Jesus Christ to families
            who might otherwise go without.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GiveLink location="footer_cta" className="btn-give text-lg">
              Give to the Mission
            </GiveLink>
            <Link
              href="/contact"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Send a Prayer Request
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
