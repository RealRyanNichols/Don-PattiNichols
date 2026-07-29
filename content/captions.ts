/**
 * Photo captions and alt text — written by looking at each photograph.
 *
 * WHY THIS FILE EXISTS
 * Every photo in the Belize 2026 album was previously described to Google,
 * to AI assistants, and to screen readers as the identical string
 * "Belize Medical Mission photo". Nine photographs, one description, zero
 * information. Google Images could not see a single thing in any of them.
 *
 * RULES FOR WRITING THESE (do not relax them)
 * - Describe only what is visible in the frame. Look at the photograph first.
 * - Never state a name, a village, a date, a diagnosis, or an outcome that is
 *   not already established in content/trips.ts or the album's own metadata.
 *   A wrong caption on a ministry site is worse than a dull one.
 * - If you cannot tell what is happening, describe the plain visible scene and
 *   stop there. Vagueness is honest; invention is not.
 * - `alt` is for search engines and screen readers: what is happening, who is
 *   doing it, where. `caption` is for readers, shown on the page.
 *
 * PRIVACY
 * These nine were already published and were re-checked frame by frame against
 * the rules in README.md ("Photo privacy") before captions were written. None
 * shows an address, a phone number, an email, or a document with a patient's
 * details legible. See the note on `belize-2026-01` below.
 */

export type PhotoCaption = {
  /** Search-engine and screen-reader description. */
  alt: string;
  /** Reader-facing caption shown beneath the photograph. */
  caption: string;
};

/**
 * Belize June 2026 — captions keyed by image path.
 *
 * The album is, in order: the vision-care table, the reading-glasses
 * inventory, patient intake, an evangelism conversation, a blood-pressure
 * check, a baptism in the lagoon, the group on the dock afterward, a team
 * member with her Bible, and two people walking out into the water.
 */
export const belize2026Captions: Record<string, PhotoCaption> = {
  "/images/belize-2026-01.jpg": {
    alt: "A mission team member holds a page of printed text for an older Belizean man to read while fitting him for reading glasses inside a village church",
    caption:
      "The reading test. A man holds the page at the distance that works for him, and the pair of glasses that matches goes home with him — free, like everything else on the table.",
  },
  "/images/belize-2026-02.jpg": {
    alt: "Dozens of pairs of donated reading glasses laid out in rows on a wooden table at a free vision clinic in Belize",
    caption:
      "The vision table, laid out and waiting. Reading glasses cost the mission about sixty cents a pair; to someone who has not been able to read their own Bible in years, they are worth considerably more.",
  },
  "/images/belize-2026-03.jpg": {
    alt: "Villagers wait and register at intake tables inside a green-walled church building serving as a temporary medical clinic in Belize",
    caption:
      "Intake. The village church becomes the clinic for the day — benches for the waiting room, school tables for registration.",
  },
  "/images/belize-2026-04.jpg": {
    alt: "A mission team member talks with a Belizean man and woman across a table, a Spanish New Testament titled Hay vida en Jesús resting on the bench beside them",
    caption:
      "A conversation at the end of the line. The Spanish New Testament on the bench — “Hay vida en Jesús” — goes with whoever wants one.",
  },
  "/images/belize-2026-05.jpg": {
    alt: "A nurse in blue scrubs takes a woman's blood pressure at a table in a village church clinic in Belize while another woman rests a hand on her shoulder",
    caption:
      "A blood-pressure check, and a hand on the shoulder. Most of what happens in the clinic looks like this: unhurried, and close.",
  },
  "/images/belize-2026-06.jpg": {
    alt: "A woman is baptized by immersion in the shallow green water of a Belizean lagoon, supported by two men, while a third steadies the dock ladder",
    caption: "A baptism in the lagoon, off the end of the village dock.",
  },
  "/images/belize-2026-07.jpg": {
    alt: "A group of Belizean villagers and mission team members stand together on a concrete dock beside the water, one woman with a towel around her shoulders and wet hair",
    caption: "On the dock afterward, with a towel and a crowd — which is the whole point of it.",
  },
  "/images/belize-2026-08.jpg": {
    alt: "A young woman from the mission team stands under a coconut palm in a Belizean village, holding a well-worn Bible",
    caption: "A team member and a Bible that has clearly been carried a while.",
  },
  "/images/belize-2026-09.jpg": {
    alt: "A man and a woman wade out together into the still, pale-green water of a Belizean lagoon, seen from the shore with the far treeline behind them",
    caption: "Walking out into the water.",
  },
};
