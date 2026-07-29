/**
 * THANK YOU — the page Don and Patti care about most.
 *
 * Thanking the people who give is not a marketing tactic to them; it is the
 * point. Everything here is written to be replaced with their own words the
 * moment they send them, and the thank-you notes below are posted by Don and
 * Patti themselves from the admin area.
 */

/** [NEEDED] Replace with Don and Patti's own thank-you letter when they write it. */
export const thankYouLetter = [
  "We have never taken a single gift for granted.",
  "Every trip on this website happened because somebody decided that a village they will never visit, and a family they will never meet, mattered enough to give toward. A well got drilled because of that. A clinic opened because of that. A Bible ended up in somebody's hands because of that.",
  "We know what it costs you. We know some of you gave when it was not easy, and some of you have been giving quietly for years without ever asking for a word of thanks. We see it. We thank God for you by name.",
  "If you have given, prayed, packed a trunk, or carried one — this page is yours.",
];

export const thankYouSignature = "Don & Patti Nichols";

/** Ways people have supported the work — used for the recognition categories. */
export const waysGiven = [
  {
    title: "Gave financially",
    body: "One-time gifts and monthly support that put airfare, medicine, and Bibles on the ground.",
  },
  {
    title: "Prayed",
    body: "The support that never shows up on a receipt and matters more than the ones that do.",
  },
  {
    title: "Packed and carried",
    body: "Trunks labeled, inventoried, weighed, and hauled through customs by people who volunteered a whole day for it.",
  },
  {
    title: "Sent supplies",
    body: "Reading glasses, hygiene items, medicine, and Bibles donated by churches, businesses, and families.",
  },
];

export type ThankYouNote = {
  id: string;
  /** Who it is addressed to. First names or "the ___ family" unless they ask otherwise. */
  to: string;
  body: string;
  from: "Don" | "Patti" | "Don & Patti";
  date: string;
  /** What the gift became, when Don wants to name it. */
  forWhat?: string;
};

/**
 * Notes Don and Patti have posted. This seeds the page; new notes are written
 * from /admin and stored in Supabase.
 *
 * PRIVACY RULE: never publish a donor's full name, amount, address, email, or
 * phone number without their explicit permission. First names or "a family in
 * East Texas" is the default.
 */
export const thankYouNotes: ThankYouNote[] = [
  // [NEEDED] Don and Patti's first thank-you notes. Nothing is invented here —
  // the page shows an honest empty state until they write the first one.
];
