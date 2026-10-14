import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findVideo,
  missionVideos,
  videoDuration,
  videoMediaBase,
} from "@/content/videos";
import { site } from "@/lib/site";
import { createPageMetadata } from "@/lib/metadata";
import MissionVideo from "@/components/MissionVideo";
import VideoShareActions from "@/components/VideoShareActions";
import GiveLink from "@/components/GiveLink";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return missionVideos.map((video) => ({ slug: video.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const video = findVideo((await params).slug);
  if (!video) return {};
  return createPageMetadata({
    path: `/watch/${video.id}`,
    title: video.title,
    description: `${video.description} Watch, share the story, and support Don & Patti Nichols.`,
    image: {
      url: `${videoMediaBase}/${video.poster}`,
      width: 720,
      height: 1280,
      alt: video.title,
    },
  });
}

export default async function WatchVideo({ params }: Props) {
  const video = findVideo((await params).slug);
  if (!video) notFound();
  const extended = video.id === "don-ministry-extended-story";
  const localFund = site.giving.funds.find(
    (fund) => fund.id === "local-outreach",
  )!;
  return (
    <section className="container-content py-6 sm:py-10">
      <a
        href="/videos/ore-city-ministry/"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-sea underline"
      >
        ← All mission videos
      </a>
      <div className="mt-4 grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <MissionVideo
          video={video}
          className="mx-auto h-[min(62svh,38rem)] min-h-64 w-full max-w-sm"
        />
        <div>
          <p className="eyebrow">
            Don &amp; Patti Nichols · {videoDuration(video.seconds)}
          </p>
          <h1 className="h-display mt-3 text-3xl sm:text-4xl">{video.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink/75">
            {video.description}
          </p>
          {extended && (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              The story begins with service in Ore City, then turns to Don’s
              memories of mission work in Malawi.
            </p>
          )}
          <div className="mt-6 rounded-xl border border-gold/40 bg-sand-dark p-5">
            <GiveLink
              href={extended ? "/give" : localFund.paypalUrl}
              fund={extended ? undefined : "local-outreach"}
              location={`video_${video.id}`}
              className="btn-give w-full sm:w-auto"
            >
              {extended ? "Support the mission" : "Help feed local families"}
            </GiveLink>
            <p className="mt-3 text-sm text-ink/70">
              {extended
                ? "Choose the part of the ministry you want to support."
                : "Gifts go to Local Community Outreach. Choose your amount at PayPal."}
            </p>
          </div>
          <div className="mt-6">
            <VideoShareActions id={video.id} title={video.title} />
          </div>
          <p className="mt-6 text-xs text-ink/60">
            Recorded <time dateTime="2026-09-15">September 15, 2026</time> · Ore
            City, Texas
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex min-h-11 items-center font-semibold text-sea underline"
          >
            Want to lend a hand? Get in touch →
          </Link>
        </div>
      </div>
    </section>
  );
}
