/**
 * CAMPAIGNS — a named need with its own designation, recipient and page.
 *
 * Different from the supply drive. Supplies are bought by Don and carried into
 * Belize on the next trip. A campaign is money raised for one specific thing
 * and handed to someone else to carry out — here, a water well and a maize
 * mill in Malawi, overseen by Skipper Sauls through Wings of Promise.
 *
 * SOURCE OF RECORD: three posts Don published himself on this site —
 *   "Bore Hole or Maize Mill in Malawi"  13 Sep 2026  /blog/bore-hole-or-1b520dc8
 *   "Water Well Request"                 15 Sep 2026  /blog/water-well-request-a3986b64
 *   "Maize Mill Request"                 15 Sep 2026  /blog/maize-mill-request-6f42d0fc
 *
 * RULES FOR THIS FILE
 *   • Everything inside `words` is Don's text, copied character for character
 *     from those posts (curly quotes, "Tx.", his hyphen in "together-both").
 *     Never tidy it. If he edits a post, copy the new wording here.
 *   • The only dollar figure is the one Don wrote: $7,630.00 for the well.
 *     The maize mill price is in a photograph Don attached to his post; it is
 *     NOT transcribed here until Don confirms the number in writing. The page
 *     links to his post instead.
 *   • `raisedUsd` stays null until Don or Ryan records a real, forwarded
 *     total. Null hides the progress bar. Never estimate it.
 *   • `active: false` retires the campaign everywhere at once: homepage,
 *     give page, and the ask under Don's posts all fall back to normal.
 */

export type CampaignNeedId = "well" | "maize-mill";

export type CampaignNeed = {
  id: CampaignNeedId;
  /** Short label for buttons and toggles. */
  label: string;
  /** Full name as Don described it. */
  name: string;
  /** Don's published US-dollar figure, or null if he has not written one. */
  costUsd: number | null;
  /**
   * The designation, written into the PayPal gift itself. Don asked that
   * every gift carry one "or gifts fall into the general fund" — putting it
   * in PayPal's item name means the donor never has to remember to type it.
   */
  paypalItem: string;
  /** What to write on a check mailed straight to Wings of Promise. */
  checkMemo: string;
  /** The blog post where Don asks for this, and shows the bid. */
  postSlug: string;
  postTitle: string;
};

const needs: CampaignNeed[] = [
  {
    id: "well",
    label: "The water well",
    name: "A bore hole (water well)",
    costUsd: 7630,
    paypalItem: "Malawi Water Well — forwarded to Wings of Promise",
    checkMemo: "Malawi Water Well",
    postSlug: "water-well-request-a3986b64",
    postTitle: "Water Well Request",
  },
  {
    id: "maize-mill",
    label: "The maize mill",
    name: "A maize mill for the soccer ministry",
    costUsd: null,
    paypalItem:
      "Malawi Maize Mill (soccer sponsorship) — forwarded to Wings of Promise",
    checkMemo: "Malawi Maize Mill",
    postSlug: "maize-mill-request-6f42d0fc",
    postTitle: "Maize Mill Request",
  },
];

export const malawiCampaign = {
  active: true,
  slug: "malawi-water-well",
  path: "/malawi-water-well",
  /** Don's first public ask. Used as the page's published date. */
  launched: "2026-09-13",
  /** Last change to what the page says. */
  updated: "2026-09-22",
  title: "A Water Well and a Maize Mill for a Village in Malawi",
  shortTitle: "Malawi water well",
  /** One line for cards, banners and the share card. */
  summary:
    "Clean water for a village in Malawi, and a maize mill that keeps a soccer ministry sharing the Gospel. Don asks publicly. Wings of Promise carries it out.",

  needs,

  /** The organisation that receives and oversees the funds, as Don gave it. */
  recipient: {
    name: "Wings of Promise, Inc.",
    street: "995 S. Lakeside",
    city: "Vidor",
    region: "TX",
    postalCode: "77662",
    /** Exactly as Don typed it, for display. */
    lines: ["Wings of Promise, Inc.", "995 S. Lakeside", "Vidor, Tx. 77662"],
  },

  overseer: {
    name: "Skipper Sauls",
    role: "Student & Missions Pastor, Maplecrest Baptist Church, Vidor, Tx.",
  },

  /**
   * Total Don has recorded as forwarded to Wings of Promise for this
   * campaign. Null until a real number exists — the page then shows no bar.
   */
  raisedUsd: null as number | null,

  /** Don's own posts, newest first. */
  posts: [
    {
      slug: "maize-mill-request-6f42d0fc",
      title: "Maize Mill Request",
      date: "2026-09-15",
    },
    {
      slug: "water-well-request-a3986b64",
      title: "Water Well Request",
      date: "2026-09-15",
    },
    {
      slug: "bore-hole-or-1b520dc8",
      title: "Bore Hole or Maize Mill in Malawi",
      date: "2026-09-13",
    },
  ],

  /** Verbatim passages. Keys describe the passage, never rewrite it. */
  words: {
    stillDrinking:
      "A bore hole (water well) in Malawi, Africa for the village of McLean Chimwenje’s grandparents. I had the privilege of leading both of them to Christ several years ago. They are still drinking muddy, tainted water.",
    wellRequest:
      "So we are in the process of collecting financial support for a water well in Malawi, Africa. This well will be placed in a village where I have had the privilege of sharing the Gospel and leading people to Christ. They have no well and continue to drink dirty, tainted water.",
    wellCost:
      "Listed below is the bid for the water well (bore hole) in Kwacha. Actual cost in US dollars is $7,630.00.",
    millAsked:
      "He asked the Lord for a water well and a maize mill. The water well is for the village where his grandparents lived. The maize mill was for raising funds for a soccer team sponsorship.",
    millHow:
      "The sponsorship will consist of purchasing a maize mill in order to grind the corn into a powder known as “Nsima”. This is a staple in all the villages. People will bring their ears of corn and they will grind it while paying a fee. The money will be used for sponsorship of the team.",
    soccer:
      "The soccer team goes from village to village, playing soccer each Saturday, funds permitting. The entire village shows up to watch and at halftime, the Gospel is shared with everyone in attendance. It’s known as sports evangelism!",
    askedPublicly:
      "It’s been a good minute since I asked the Lord publicly for a miracle. “That’s too long!”",
    gibbsQuestion:
      "Bro. Gibbs said, “When was the last time you asked God publicly for a miracle?”",
    inPrayer:
      "I will be in prayer publicly about this as new light has already been shown to me!",
    overseer:
      "Skipper Sauls, the Student & Missions pastor from Maplecrest Baptist Church in Vidor, Tx., will be responsible for overseeing the funds and the project.",
    history:
      "He and I have done quite a bit of ministry mission work together-both in Vidor, Tx., after Hurricane Harvey and Malawi as well.",
    paypalForwarded:
      "Praise the Lord! Any money given to our PayPal account will be given publicly to Skipper Sauls and Wings of Promise. Just be sure to make a notation of Malawi water well or soccer sponsorship.",
    forwardedInName:
      "If you would like to donate financially for the maize mill, do it here and we will forward all funds in your name(s) to:",
    directToo: "You can also donate directly to them at this address.",
    memo: "Be sure to make a written comment about “Malawi Water Well”. They have money coming in for projects in many countries!",
    nonprofit:
      "This is a 501c3 nonprofit organization. Tax deductible slips will be mailed out every year.",
    /** 2 Corinthians 9:6 and 9:7, as Don quoted them (he numbered each verse). */
    verse6:
      "Remember this: Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously.",
    verse7:
      "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
  },

  /**
   * Archive photographs of EARLIER donated wells (album "Malawi Water Wells
   * Donated"). They illustrate what a bore hole is; captions must never
   * claim they show this village or this well.
   */
  photos: {
    hero: "1o6QMRqsNqN_NUy-WOggOi8eauNfrX_zj",
  },
};

export type MalawiCampaign = typeof malawiCampaign;

export const campaignNeed = (id: CampaignNeedId): CampaignNeed =>
  malawiCampaign.needs.find((n) => n.id === id)!;

/**
 * Words that mark a post as being about this campaign. Narrow on purpose:
 * "well" alone would catch "as well"; these phrases only appear when Don is
 * writing about water wells, the mill, or the organisation carrying them out.
 */
const CAMPAIGN_PHRASES = [
  "wings of promise",
  "maize mill",
  "bore hole",
  "borehole",
  "water well",
];
const MILL_PHRASES = ["maize mill", "soccer"];
const WELL_PHRASES = ["water well", "bore hole", "borehole"];

/**
 * Is this post about the Malawi campaign, and which need does it lead with?
 * Returns null when the campaign is inactive or the post is about something
 * else. A "Water Wells" tag Don chose himself counts on its own.
 */
export function campaignForPost(post: {
  title?: string | null;
  body?: string | null;
  tags?: string[] | null;
}): { need: CampaignNeedId } | null {
  if (!malawiCampaign.active) return null;
  const tags = (post.tags ?? []).map((t) => t.toLowerCase());
  const title = (post.title ?? "").toLowerCase();
  const hay = `${title} ${(post.body ?? "").toLowerCase()}`;
  const tagged = tags.includes("water wells");
  if (!tagged && !CAMPAIGN_PHRASES.some((p) => hay.includes(p))) return null;
  // The title decides first — the well when it names both, because Don lists
  // it first — otherwise whichever need the text leans on.
  if (WELL_PHRASES.some((p) => title.includes(p))) return { need: "well" };
  if (MILL_PHRASES.some((p) => title.includes(p)))
    return { need: "maize-mill" };
  const mill = MILL_PHRASES.reduce((n, p) => n + hay.split(p).length - 1, 0);
  const well = WELL_PHRASES.reduce((n, p) => n + hay.split(p).length - 1, 0);
  return { need: mill > well ? "maize-mill" : "well" };
}
