import Link from "next/link";
import { site } from "@/lib/site";
import { featuredVideo, videoDuration } from "@/content/videos";
import MissionVideo from "@/components/MissionVideo";
import VideoShareActions from "@/components/VideoShareActions";
import GiveLink from "@/components/GiveLink";

export default function HomeVideoHero() {
  const localFund = site.giving.funds.find(
    (fund) => fund.id === "local-outreach",
  )!;
  return (
    <section
      className="relative overflow-hidden bg-deep text-white"
      aria-labelledby="home-video-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,150,46,0.16),transparent_70%)]"
      />
      <div className="container-content relative grid gap-5 py-5 sm:gap-7 sm:py-8 lg:grid-cols-[1.15fr_1fr] lg:gap-x-12 lg:py-10">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Don &amp; Patti Nichols · Watch the mission
          </p>
          <h1
            id="home-video-heading"
            className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
          >
            Love in action.
            <br />
            <span className="italic text-gold">Right here at home.</span>
          </h1>
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <MissionVideo
            video={featuredVideo}
            className="mx-auto h-[min(46svh,26rem)] min-h-64 w-full max-w-sm sm:h-[min(58svh,34rem)]"
          />
          <p className="mt-3 text-center text-sm text-white/80">
            Food, Time &amp; Service · {videoDuration(featuredVideo.seconds)} ·
            Sound and captions available
          </p>
        </div>
        <div className="min-w-0 lg:col-start-1 lg:row-start-2 lg:self-start">
          <GiveLink
            href={localFund.paypalUrl}
            fund="local-outreach"
            location="homepage_video"
            className="btn-give w-full text-base sm:w-auto"
          >
            Help feed local families
          </GiveLink>
          <p className="mt-2 text-xs text-white/70">
            Gifts go to Local Community Outreach. Choose your amount at PayPal.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <Link
              href="/watch/don-mission-outside-the-doors"
              className="inline-flex min-h-11 items-center text-gold underline underline-offset-4"
            >
              Watch the 15-second message
            </Link>
            <Link
              href="/watch/don-ministry-extended-story"
              className="inline-flex min-h-11 items-center text-white underline underline-offset-4"
            >
              The full five-minute story
            </Link>
          </div>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85">
            Cake mix, eggs, oil, and icing for 60 families. Join Don for a
            moment in Ore City, and hear why serving our neighbors matters. A
            gift, a helping hand, or a shared story can carry this work further.
          </p>
          <div className="mt-5">
            <VideoShareActions
              id={featuredVideo.id}
              title={featuredVideo.title}
              dark
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            <a
              href="/videos/ore-city-ministry/"
              className="inline-flex min-h-11 items-center text-gold underline underline-offset-4"
            >
              Explore all 11 videos →
            </a>
            <Link
              href="/our-story"
              className="inline-flex min-h-11 items-center text-white underline underline-offset-4"
            >
              Meet Don &amp; Patti →
            </Link>
          </div>
          <p className="mt-2 text-xs text-white/60">
            Recorded September 15, 2026 · Ore City, Texas
          </p>
        </div>
      </div>
    </section>
  );
}
