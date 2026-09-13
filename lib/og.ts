/**
 * SOCIAL SHARE CARDS (Open Graph images)
 *
 * These are the pictures Facebook, X, iMessage, and WhatsApp show when someone
 * shares a link. Most traffic to this site arrives from Facebook, so the share
 * card is doing more work than almost anything else on the page.
 *
 * Every page now gets a GENERATED card — a photograph from the archive under
 * the teal scrim, with the page's own words on it — from `lib/ogCard.tsx`
 * (routes with an `opengraph-image.tsx`) or the `/og` route (static pages,
 * via `ogCardImage()` in `lib/seo.ts`). A bare photograph is never used as a
 * share image any more: a card with no words on it tells the feed nothing.
 *
 * HAND-DESIGNED ARTWORK (Ryan) can still override a route:
 *   1. Design it at 1200 × 630 and upload to the Drive Pictures folder.
 *   2. Copy the file id out of the Drive share link — the long string between
 *      /d/ and /view.
 *   3. Add a line to OG_IMAGES below: `"/route": "<file id>",` and use
 *      `ogImage("/route")` in that page's metadata.
 *
 * SIZE NOTE: 1200 × 630 (1.91:1) is what Facebook and X actually want.
 */

import { photo } from "@/content/albums";

/** Route path → Google Drive file id of a hand-designed share card. */
const OG_IMAGES: Record<string, string> = {};

/** Alt text so the card is described properly when a reader can't see it. */
const OG_ALT: Record<string, string> = {};

/**
 * Open Graph + Twitter image block for a hand-designed card, ready to spread
 * into a Next.js `metadata` export. Returns undefined when no card is set.
 */
export function ogImage(route: string) {
  const id = OG_IMAGES[route];
  if (!id) return undefined;
  return {
    url: photo(id, 1200),
    width: 1200,
    height: 630,
    alt: OG_ALT[route] ?? "Don & Patti Nichols mission work",
  };
}

/**
 * Facebook and X refuse to render a large share card from a small file — they
 * downgrade to a cramped thumbnail instead. Much of Don's archive is
 * compressed iCloud export at 300–480px: fine on the page, too small to fill
 * a 1200px card. Below this width the generated card frames the photograph
 * as an inset beside the words instead of stretching it behind them.
 */
export const MIN_FULL_BLEED_WIDTH = 900;

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

/**
 * The words on a supply item's share card. "A Bible" becomes "Sponsor a
 * Bible for $2.50"; names that already carry their verb ("Fly a Trunk to
 * Belize", "Sponsor a Missionary") keep it.
 */
export function sponsorCardCopy(item: {
  name: string;
  unitCost: number;
  blurb: string;
  photoPx: number;
}) {
  const price = usd(item.unitCost);
  const name = item.name.trim();
  const verbed = /^(Fly|Sponsor) /.test(name)
    ? name
    : /^An? /.test(name)
      ? `Sponsor ${name[0].toLowerCase()}${name.slice(1)}`
      : `Sponsor ${name}`;
  return {
    eyebrow: "Fill the Trunks",
    title: `${verbed} for ${price}`,
    line: item.blurb,
    meta: `${price} each, given free in Belize`,
    inset: item.photoPx < MIN_FULL_BLEED_WIDTH,
  };
}
