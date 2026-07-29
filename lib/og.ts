/**
 * SOCIAL SHARE CARDS (Open Graph images)
 *
 * These are the pictures Facebook, X, iMessage, and WhatsApp show when someone
 * shares a link. Most traffic to this site arrives from Facebook, so the share
 * card is doing more work than almost anything else on the page.
 *
 * HOW TO ADD ONE (Ryan):
 *   1. Design it at 1200 × 630 and upload to the Drive Pictures folder.
 *   2. Copy the file id out of the Drive share link — the long string between
 *      /d/ and /view.
 *   3. Add a line below: `"/route": "<file id>",`
 * Any route without an entry falls back to the site-wide generated card.
 *
 * SIZE NOTE: 1200 × 630 (1.91:1) is what Facebook and X actually want. A 16:9
 * card (1200 × 675) still works — the platforms letterbox or trim a few pixels
 * top and bottom — so keep faces and text away from the very top and bottom
 * edges of the artwork.
 */

import { photo } from "@/content/albums";

/** Route path → Google Drive file id of its share card. */
const OG_IMAGES: Record<string, string> = {
  // "Fill the Trunks — Send real mission supplies to Belize" (1200 × 675)
  "/sponsor": "1rAKkeiy2Ofh1iRpsfI2kPr-ma5AG_kpU",
};

/** Alt text so the card is described properly when a reader can't see it. */
const OG_ALT: Record<string, string> = {
  "/sponsor":
    "Fill the Trunks — a mission trunk packed with Bibles, towels, reading glasses, and hygiene supplies, outside a village church in Belize",
};

/**
 * Open Graph + Twitter image block for a route, ready to spread into a
 * Next.js `metadata` export. Returns undefined when no card is set, which
 * leaves the site-wide default in place.
 */
export function ogImage(route: string) {
  const id = OG_IMAGES[route];
  if (!id) return undefined;
  return {
    url: photo(id, 1200),
    width: 1200,
    // The Fill the Trunks artwork is 16:9. Declared dimensions must match the
    // real bytes or the numbers are just noise — platforms measure the file.
    height: 675,
    alt: OG_ALT[route] ?? "Don & Patti Nichols mission work",
  };
}

/**
 * Facebook and X refuse to render a large share card from a small file — they
 * downgrade to a cramped thumbnail instead. Much of Don's archive is
 * compressed iCloud export at 300-480px, which is fine on the page but too
 * small to share.
 *
 * Below this width, use the designed Fill the Trunks card instead of the
 * item's own photograph. A crisp generic card beats a blurry specific one.
 */
export const MIN_SHARE_WIDTH = 600;

/** The share card for one supply item, falling back when its photo is small. */
export function sponsorItemOg(opts: {
  photoId: string;
  photoPx: number;
  name: string;
  photoFrom: string;
}) {
  if (opts.photoPx >= MIN_SHARE_WIDTH) {
    return {
      url: photo(opts.photoId, 1200),
      width: 1200,
      height: 900,
      alt: `${opts.name} — ${opts.photoFrom}`,
    };
  }
  return ogImage("/sponsor")!;
}
