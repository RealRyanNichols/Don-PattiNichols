import { ogCard, photoDataUrl, OG_SIZE } from "@/lib/ogCard";
import { malawiCampaign, campaignNeed } from "@/content/campaigns";

/**
 * The share card for Don's Malawi campaign. This is the link he will post on
 * Facebook and hand to churches, so the card carries the whole ask in words:
 * what, how much (his figure), and who receives it. The archive photograph is
 * an EARLIER well, framed small beside the words rather than stretched behind
 * them — both because it may be a small iCloud export, and because a card
 * should never imply a photograph shows this village.
 */

export const runtime = "nodejs";
// Rendered on request, never at build: a slow Drive fetch during a deploy
// would otherwise bake the fallback card in for a year.
export const dynamic = "force-dynamic";
export const alt =
  "A water well for a village in Malawi — $7,630 for the bore hole, gifts to Wings of Promise";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const well = campaignNeed("well");
  const hero = await photoDataUrl(malawiCampaign.photos.hero, 900);
  return ogCard({
    eyebrow: "Malawi · Asking publicly",
    title: "A water well for a village still drinking muddy water",
    line: `$${well.costUsd!.toLocaleString("en-US")} for the bore hole, plus a maize mill for a soccer ministry. Gifts go to Wings of Promise.`,
    meta: "donandpatti.com/malawi-water-well",
    photo: hero,
    inset: true,
  });
}
