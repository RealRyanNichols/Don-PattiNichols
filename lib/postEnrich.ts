import { supplyDrive, type SupplyItem } from "@/content/supplies";
import { albums } from "@/content/albums";
import type { DbPost } from "./postsDb";

/**
 * AUTOMATIC POST ENRICHMENT
 *
 * Don types a story on his phone and taps Publish. He is a preacher in his
 * sixties; he is never going to lay out a page, pick a product, or place a
 * donate button. This reads what he wrote and builds the rest of the article
 * around it.
 *
 * WHAT IT WILL AND WILL NOT DO
 *
 * It will: pull one line of his own writing out as a quote, work out what the
 * story is about, put the matching supply item underneath it, invite the reader
 * to follow, and point at the photo album from that country.
 *
 * It will NOT: change a single word he wrote, interrupt the story with anything,
 * stack up five products, invent a fact, or manufacture urgency. His words run
 * top to bottom, uninterrupted, and everything else lives around them.
 *
 * The whole thing is deliberately modest. A story about leading an elderly
 * woman to Christ does not need a countdown timer under it. One honest ask,
 * placed after the last line, is worth more than a page full of buttons — and
 * it is the only version of this that Don would be proud to show his church.
 */

export type Enrichment = {
  /** One sentence of his own, displayed large. Never edited, never truncated. */
  pullQuote: string | null;
  /** Insert the quote after this many paragraphs. */
  pullQuoteAfter: number;
  /** The supply item this story is actually about, if any. */
  item: SupplyItem | null;
  /** Why that item was chosen — shown to Don in the admin, never to readers. */
  matchReason: string;
  /** Countries named in the story, used to suggest an album. */
  album: { slug: string; title: string } | null;
  /** A short, honest line for the giving card headline. */
  askHeadline: string;
  /** What the follow box offers, tuned to the story. */
  followInterest: string;
  /** Minutes to read, for the byline. */
  readingMinutes: number;
  /** First-mention links to quietly weave into the prose. */
  links: { phrase: string; href: string; title: string }[];
};

/**
 * Words that mean a given supply item. Deliberately narrow — a loose match
 * that puts hygiene kits under a story about baptism is worse than no match at
 * all, because it reads as a machine guessing.
 */
const ITEM_WORDS: Record<string, string[]> = {
  bible: ["bible", "bibles", "scripture", "god's word", "new testament", "testament"],
  "hygiene-kit": ["hygiene", "soap", "toothbrush", "kit", "kits"],
  "reading-glasses": ["reading glasses", "eyeglasses", "spectacles", "vision", "eyesight", "could not read", "couldn't read"],
  sunglasses: ["sunglasses", "sun glasses"],
  tracts: ["tract", "tracts", "gospel literature", "literature"],
  "pastor-gift": ["pastor", "pastors", "preacher", "village church"],
  trunk: ["trunk", "trunks", "footlocker"],
  baggage: ["baggage", "checked bag", "luggage", "airline"],
  customs: ["customs", "duty", "border"],
  missionary: ["missionary", "missionaries", "team member", "sponsor a missionary"],
};

/** Countries we have albums for, and the words that name them. */
const COUNTRY_ALBUMS: { slug: string; words: string[] }[] = [
  { slug: "malawi", words: ["malawi", "lilongwe", "blantyre"] },
  { slug: "dominican-republic", words: ["dominican", "santo domingo"] },
  { slug: "belize", words: ["belize", "belizean"] },
  { slug: "water-wells", words: ["well", "wells", "borehole", "clean water"] },
  { slug: "widows-and-orphans", words: ["widow", "widows", "orphan", "orphans"] },
];

const count = (haystack: string, needle: string) =>
  haystack.split(needle).length - 1;

/**
 * Choose the supply item the story is genuinely about.
 *
 * A tag Don typed himself is worth far more than a word that happened to
 * appear once, so tags win outright. Otherwise an item has to earn it: the
 * title counts heavily, and a passing mention in the body is not enough.
 */
function matchItem(post: DbPost): { item: SupplyItem | null; reason: string } {
  const tags = (post.tags ?? []).map((t) => t.toLowerCase());
  const title = (post.title ?? "").toLowerCase();
  const body = (post.body ?? "").toLowerCase();

  // 1. An explicit tag from the author.
  for (const item of supplyDrive.items) {
    const words = ITEM_WORDS[item.id] ?? [];
    if (tags.some((t) => words.includes(t) || t === item.id)) {
      return { item, reason: `tagged "${item.name}"` };
    }
  }

  // 2. Otherwise, score. Title mentions are worth five body mentions.
  let best: { item: SupplyItem; score: number } | null = null;
  for (const item of supplyDrive.items) {
    const words = ITEM_WORDS[item.id] ?? [];
    let score = 0;
    for (const w of words) {
      score += count(title, w) * 5;
      score += count(body, w);
    }
    if (score > 0 && (!best || score > best.score)) best = { item, score };
  }

  // A story has to be properly about something before we put a price on it.
  if (best && best.score >= 3) {
    return { item: best.item, reason: `mentioned ${best.score}×` };
  }
  return { item: null, reason: "no clear subject — showing the general ask" };
}

/**
 * Pull one sentence out of his writing to set large.
 *
 * Rules exist to keep this from embarrassing him:
 *   • complete sentences only, never a fragment cut mid-thought
 *   • not the opening line (that is already the top of the article)
 *   • short enough to read as a quote, long enough to say something
 *   • his voice preferred — first person, or a line with real force
 * If nothing clears the bar, there is no pull-quote. That is a fine outcome.
 */
function pickPullQuote(body: string): { quote: string | null; after: number } {
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length < 3) return { quote: null, after: 0 };

  type Cand = { text: string; para: number; score: number };
  const cands: Cand[] = [];

  paras.forEach((para, pIdx) => {
    // Skip the first paragraph — it is already visible at the top.
    if (pIdx === 0) return;
    const sentences = para.match(/[^.!?]+[.!?]+/g) ?? [];
    for (const raw of sentences) {
      const text = raw.trim();
      if (text.length < 25 || text.length > 150) continue;
      // Must be a whole sentence.
      if (!/[.!?]$/.test(text)) continue;
      // Skip anything with an unclosed quotation mark — it would read as
      // dialogue torn out of its exchange.
      const quoteMarks = (text.match(/["“”]/g) ?? []).length;
      if (quoteMarks % 2 !== 0) continue;

      let score = 0;
      if (/!$/.test(text)) score += 3;
      // A short line ending in an exclamation is almost always the line people
      // remember — "I was using my mustard seed!" beats a longer, safer
      // sentence every time. Without this the scoring ties at the top and
      // simply takes whichever came first, which is not the same as best.
      if (text.length < 60 && /!$/.test(text)) score += 3;
      // Concrete detail — a number, a price — reads as true rather than pious.
      if (/[$0-9]/.test(text)) score += 1;
      if (/\b(I|my|we|our)\b/.test(text)) score += 2;
      if (/\b(God|Lord|Jesus|Christ|Holy Spirit|faith|prayed|pray)\b/i.test(text)) score += 2;
      // Middle of the piece reads better than the very end.
      if (pIdx > 1 && pIdx < paras.length - 1) score += 1;
      if (text.length > 60 && text.length < 120) score += 1;

      if (score >= 3) cands.push({ text, para: pIdx, score });
    }
  });

  if (!cands.length) return { quote: null, after: 0 };
  cands.sort((a, b) => b.score - a.score || a.para - b.para);
  const win = cands[0];
  return { quote: win.text, after: Math.max(1, win.para) };
}

function matchAlbum(post: DbPost) {
  const hay = `${post.title ?? ""} ${post.body ?? ""}`.toLowerCase();
  let best: { slug: string; hits: number } | null = null;
  for (const c of COUNTRY_ALBUMS) {
    const hits = c.words.reduce((n, w) => n + count(hay, w), 0);
    if (hits > 0 && (!best || hits > best.hits)) best = { slug: c.slug, hits };
  }
  if (!best) return null;
  const album = albums.find((a) => a.slug === best!.slug);
  return album ? { slug: album.slug, title: album.title } : null;
}


/**
 * The headline over the giving card.
 *
 * Note the capital B in Bible. An earlier version lowercased the whole item
 * name to fit the sentence and produced "Put a bible in someone's hands" —
 * which is exactly the kind of small wrongness a preacher notices immediately.
 * Only the leading article gets lowercased; the name itself is left alone.
 */
function askLine(item: SupplyItem): string {
  const name = item.name.replace(/^A /, "a ").replace(/^An /, "an ");
  switch (item.id) {
    case "bible":
      return "Put a Bible in someone's hands";
    case "reading-glasses":
      return "Give someone their reading back";
    case "hygiene-kit":
      return "Send a hygiene kit with the team";
    case "pastor-gift":
      return "Encourage a village pastor";
    case "missionary":
      return "Send someone to the field";
    default:
      return `Send ${name} with the next trip`;
  }
}


/**
 * Places and things worth linking the first time they are named.
 *
 * Kept short on purpose. Two or three links in a story help the reader and
 * help Google understand how these pages relate; a paragraph full of them
 * reads like a press release.
 */
function buildLinks(
  post: DbPost,
  item: SupplyItem | null,
  album: { slug: string; title: string } | null,
): { phrase: string; href: string; title: string }[] {
  const out: { phrase: string; href: string; title: string }[] = [];
  const hay = `${post.title ?? ""} ${post.body ?? ""}`;

  if (album) {
    const named = COUNTRY_ALBUMS.find((c) => c.slug === album.slug);
    const phrase = named?.words.find((w) =>
      new RegExp(`\\b${w}\\b`, "i").test(hay),
    );
    if (phrase) {
      out.push({
        phrase,
        href: `/albums/${album.slug}`,
        title: `Photographs from ${album.title}`,
      });
    }
  }

  if (item) {
    const words = ITEM_WORDS[item.id] ?? [];
    const phrase = words.find((w) => new RegExp(`\\b${w}\\b`, "i").test(hay));
    if (phrase) {
      out.push({
        phrase,
        href: `/sponsor/${item.id}`,
        title: `Sponsor ${item.name.toLowerCase()} for the next trip`,
      });
    }
  }

  // Always offer the open ledger once, if the story talks about money at all.
  if (/\$\d|cost|paid|donat|gave money|afford/i.test(hay)) {
    out.push({
      phrase: "cost",
      href: "/transparency",
      title: "See exactly where the money goes",
    });
  }

  return out;
}

export function enrichPost(post: DbPost): Enrichment {
  const { item, reason } = matchItem(post);
  const { quote, after } = pickPullQuote(post.body ?? "");
  const album = matchAlbum(post);

  return {
    pullQuote: quote,
    pullQuoteAfter: after,
    item,
    matchReason: reason,
    album,
    askHeadline: item ? askLine(item) : "Stand with the next trip",
    followInterest: item ? item.id : (album?.slug ?? "the mission"),
    // 200 words a minute is the usual estimate for comfortable reading.
    readingMinutes: Math.max(
      1,
      Math.round((post.body ?? "").trim().split(/\s+/).filter(Boolean).length / 200),
    ),
    links: buildLinks(post, item, album),
  };
}
