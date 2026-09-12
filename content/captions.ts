/**
 * PHOTO CAPTIONS — keyed by Google Drive file id.
 *
 * THE RULE: a caption here describes only what is VISIBLE in the frame, or a
 * fact Don has already published. Nothing is guessed. No village names, no
 * patient names, no dates that are not in content/history.ts. A wrong caption
 * on a ministry site is worse than none, so a photograph with no entry here
 * simply renders as "<Album> — photograph N" until Don supplies the words.
 *
 * Every line below was carried over from a description that already existed
 * elsewhere on the site (lib/photos.ts, app/page.tsx, content/supplies.ts,
 * BELIZE-2026-PHOTO-INTERVIEW.md) — descriptions written by looking at the
 * picture. New entries should be added the same way: look first, then write.
 *
 * The caption is BOTH the visible line under the picture and the alt text,
 * which is what makes a photograph findable in Google Images and audible to
 * anyone using a screen reader.
 */

export type Caption = {
  /** Full sentence for alt text and the lightbox. */
  alt: string;
  /** Short line under the tile, when different from the alt. */
  caption?: string;
};

export const captions: Record<string, Caption> = {
  // ---- Belize, June 2026 ----
  "1p64gHV_x_TstBKJXK3QCQaCPQ2RAII60": {
    alt: "Patti Nichols fitting an older man with a pair of reading glasses at a village clinic in Belize, June 2026",
    caption: "The reading test — a pair that fits goes home with him, free",
  },
  "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej": {
    alt: "Dozens of pairs of donated reading glasses laid out in rows on a wooden table at the Belize clinic, June 2026",
    caption: "The vision table, laid out and waiting — about sixty cents a pair",
  },
  "159_AtWRZslTni2u-2woyzNjEhxTgWH-7": {
    alt: "Villagers waiting and registering at intake tables inside a village church used as the clinic, Belize 2026",
    caption: "Intake — the village church becomes the clinic for the day",
  },
  "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI": {
    alt: "A team member talking with a man and a woman across a table at the Belize clinic; a Spanish New Testament sits on the bench",
    caption: "A conversation at the end of the line",
  },
  "1ZwwAFnLVQHPshkFvBI35ksl0vbAUMgKx": {
    alt: "Inside the clinic room mid-morning during the June 2026 Belize medical mission",
    caption: "The clinic, mid-morning — Belize",
  },
  "1EsG6FWuS7IKoSEOveU1uZ8mg6D1GE2B5": {
    alt: "A woman being baptized by immersion in a lagoon off the end of a village dock in Belize, two men supporting her",
    caption: "A baptism in the lagoon, off the end of the village dock",
  },
  "16tL49j4iE0UCThonJjUSno9EIHHZUF3c": {
    alt: "A group gathered on a concrete dock by the water after a baptism in Belize, one woman with a towel and wet hair",
    caption: "On the dock afterward, with a towel and a crowd",
  },
  "1hIOqWtRNR7h6t-RC5DO3AkLpNUEPUpqg": {
    alt: "A young woman from the mission team under a coconut palm in Belize, holding a well-worn Bible",
    caption: "A team member and a Bible that has clearly been carried a while",
  },
  "1fOur4mZtWqvLpmacSmtiXB4DJJk5mAg5": {
    alt: "A man and a woman wading out into still water in Belize, seen from the shore",
    caption: "Walking out into the water",
  },
  "1nVnUudrm76rHU7LTfLjYygjemRx7k6EW": {
    alt: "A baptism in the sea during the June 2026 Belize mission",
    caption: "A baptism in the sea — Belize, June 2026",
  },
  "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I": {
    alt: "The mission team gathered in front of the Belize Anchor Mission church, June 2026",
    caption: "The team in Belize — gathered where the work happens",
  },
  "1FA_f5nIT6gBF49wPpTDgCxLrljxtoQ-q": {
    alt: "The Belize Anchor Mission sign, painted with Ephesians 2:22",
    caption: "The Anchor Mission sign, Ephesians 2:22",
  },
  "1CXDEsZFj1QaEBvcqNg2LH_8h5QqTigYN": {
    alt: "A fitting at the vision table during the Belize medical mission, June 2026",
    caption: "A fitting at the vision table — Belize",
  },
  "1Q_EcBiYkUEopoM8dsGtO6S8J6DIu8ISP": {
    alt: "Don Nichols beside a man reading again with new glasses, Belize 2026",
    caption: "Don beside a man reading again — Belize",
  },
  "1fpRWkrIGlztXxtCaS3DPwbFc27ubSrQr": {
    alt: "A member of the mission team embracing a woman she has just served in Belize, June 2026",
    caption: "Belize, June 2026 — the reason they keep going back",
  },
  "1B8apaW2hx5UTMxmJ2VJ8Mp3SRpevs4Sd": {
    alt: "The flight to Belize, carrying hundreds of pounds of donated supplies",
    caption: "The flight down — hundreds of pounds of donated supplies aboard",
  },
  "1pBAtiNSriWluEkgBxC04n6V-BEHWDAv4": {
    alt: "Setting up clinic tables inside the village church in Belize",
    caption: "Setting up the clinic tables inside the village church",
  },

  // ---- Dominican Republic ----
  "1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA": {
    alt: "Heavy-duty ministry trunks on the move in the Dominican Republic, packed with donated supplies",
    caption: "Trunks on the move — Dominican Republic",
  },
  "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z": {
    alt: "Hygiene kits packed and sealed on the table before a Dominican Republic mission trip",
    caption: "Kits packed for the Dominican Republic",
  },
  "1whTYhZyf5tZ--MtRq4Fkq59TwwVXlF_b": {
    alt: "Sunglasses priced and bagged for the mission field",
    caption: "Priced and bagged for the field",
  },
  "1fYNKv7lYMb68Lp38-2N-7-S1a_gUnDIo": {
    alt: "Gospel literature stacked and counted before packing for a mission trip",
    caption: "Gospel literature stacked for a trip",
  },
  "1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop": {
    alt: "Packed ministry trunks headed for the mission field",
    caption: "Packed trunks headed for the field",
  },
  "1Chc8cl28yNH_v0o4DAEbXb7i9tjGTMBz": {
    alt: "Mission supplies staged for the clinic in the Dominican Republic",
    caption: "Supplies staged for the clinic",
  },

  // ---- Malawi ----
  "1o6QMRqsNqN_NUy-WOggOi8eauNfrX_zj": {
    alt: "A drilling rig at work on a donated water well in Malawi",
    caption: "The drilling rig — a well for a Malawian village",
  },
  "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF": {
    alt: "Don Nichols with a village pastor on the field in Malawi",
    caption: "Don with a pastor on the field — Malawi",
  },
  "1IKE9SB5pmB42BcUTUxr0XDI0IbkOv1qi": {
    alt: "Bibles from the Bible ministry in Malawi, bought in-country and given away",
    caption: "From the Bible ministry — Malawi",
  },
};

/** Alt text for a photo: the verified caption, or an honest generic line. */
export function photoAlt(id: string, albumTitle: string, index: number): string {
  return captions[id]?.alt ?? `${albumTitle} — photograph ${index + 1}`;
}

/** The visible caption line, when one exists. */
export function photoCaption(id: string): string | null {
  const c = captions[id];
  if (!c) return null;
  return c.caption ?? c.alt;
}

export const captionedCount = Object.keys(captions).length;
