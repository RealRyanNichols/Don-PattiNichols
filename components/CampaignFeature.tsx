import Link from "next/link";
import { malawiCampaign, campaignNeed } from "@/content/campaigns";
import GiveLink from "./GiveLink";

/**
 * Don's current campaign, pinned where he asked for it: "the first thing
 * visitors see." Renders nothing once `malawiCampaign.active` is false, so
 * retiring the campaign is a one-line change.
 *
 * The quote is his sentence, verbatim. The figure is his. The card never shows
 * a progress bar of its own — only the campaign page does, and only once a
 * real forwarded total is recorded.
 */
export default function CampaignFeature({
  variant = "dark",
  location,
}: {
  variant?: "dark" | "light";
  location: string;
}) {
  if (!malawiCampaign.active) return null;
  const well = campaignNeed("well");
  const dark = variant === "dark";

  return (
    <aside
      aria-labelledby={`campaign-${location}`}
      className={`rounded-2xl p-6 sm:p-8 ${
        dark
          ? "bg-white/[0.06] text-white ring-1 ring-gold/40"
          : "border-l-4 border-gold bg-white shadow-sm ring-1 ring-ink/10"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p
            className={`text-xs font-bold uppercase tracking-[0.2em] ${
              dark ? "text-gold" : "text-sea"
            }`}
          >
            Don is asking now · Malawi
          </p>
          <h2
            id={`campaign-${location}`}
            className={`mt-2 font-serif text-2xl font-bold leading-snug sm:text-3xl ${
              dark ? "text-white" : "text-deep"
            }`}
          >
            A water well for a village still drinking muddy water
          </h2>
          <p
            className={`mt-3 text-[15px] leading-relaxed ${
              dark ? "text-white/80" : "text-ink/75"
            }`}
          >
            <strong className={dark ? "text-gold" : "text-deep"}>
              ${well.costUsd!.toLocaleString("en-US")}
            </strong>{" "}
            for the bore hole, and a maize mill that funds a soccer ministry
            sharing the Gospel at halftime. Gifts are marked for Malawi and
            forwarded to Wings of Promise.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <GiveLink
            href={`${malawiCampaign.path}#give`}
            location={location}
            fund="malawi-water-well"
            className="btn-give"
          >
            Give to the well
          </GiveLink>
          <Link
            href={malawiCampaign.path}
            className={
              dark
                ? "btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
                : "btn-outline"
            }
          >
            Read Don’s ask
          </Link>
        </div>
      </div>
    </aside>
  );
}
