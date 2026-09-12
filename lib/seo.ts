import { site } from "./site";

/**
 * SEARCH — the one place the site describes itself to Google, Bing, and the
 * AI assistants that read structured data before they read prose.
 *
 * Two rules keep this honest:
 *   1. Every keyword set below describes something the site GENUINELY answers.
 *      A phrase the pages cannot back up is bait, and Google's helpful-content
 *      systems punish bait. So "mission trip packing list" is here because
 *      Don's trunk system is a real packing list; "cheap flights to Belize" is
 *      not, because nobody here sells flights.
 *   2. Structured data must match the visible page. A FAQ in JSON-LD that is
 *      not on the page is a policy violation, so every builder here takes the
 *      same array the page renders.
 */

/** Phrases people actually type, grouped by the page that answers them. */
export const KEYWORDS = {
  core: [
    "Don Nichols",
    "Patti Nichols",
    "Don and Patti Nichols",
    "donandpatti.com",
    "Belize medical mission",
    "Belize mission trip",
    "medical mission trip Belize",
    "Christian medical missions",
    "free medical clinic Belize",
    "East Texas missionaries",
  ],
  belize: [
    "why Belize missions",
    "rural Belize healthcare",
    "Belize village pastors",
    "Belize mission trip 2026",
    "medical missions Belize villages",
    "Belize evangelism",
  ],
  giving: [
    "donate to a mission trip",
    "sponsor a missionary",
    "sponsor a Bible",
    "mission trip donations",
    "give to Belize missions",
    "monthly mission support",
    "PayPal mission donation",
  ],
  costs: [
    "how much does a medical mission trip cost",
    "mission trip cost breakdown",
    "mission trip budget",
    "cost to send a missionary",
    "cost of a Bible for missions",
    "reading glasses mission trip cost",
    "hygiene kit cost",
  ],
  packing: [
    "what to pack for a medical mission trip",
    "mission trip packing list",
    "medical mission trunk inventory",
    "mission trip customs paperwork",
    "how to pack mission supplies",
    "mission trip checklist",
  ],
  hygiene: [
    "how to make a hygiene kit",
    "hygiene kit for mission trip",
    "hygiene kit contents list",
    "hygiene kit assembly church",
    "hygiene kit packing party",
    "mission hygiene kits",
  ],
  prayer: [
    "how to pray for missionaries",
    "prayer guide for mission team",
    "pray for a mission trip",
    "missionary prayer points",
    "7 day prayer guide missions",
    "scripture for missionaries",
  ],
  glasses: [
    "reading glasses ministry",
    "reading glasses for missions",
    "donate reading glasses mission trip",
    "vision clinic mission trip",
    "reading glasses distribution",
  ],
  support: [
    "mission trip support letter",
    "mission trip fundraising letter template",
    "how to write a support letter for a mission trip",
    "missionary support letter example",
    "raise money for a mission trip",
  ],
  churches: [
    "invite a missionary to speak",
    "missionary speaker for church",
    "mission speaker East Texas",
    "church mission partnership",
    "church mission trip sponsorship",
    "missions Sunday speaker",
  ],
  archive: [
    "mission trip photos",
    "Malawi mission photos",
    "Dominican Republic medical mission",
    "Malawi water wells",
    "Belize mission photos",
    "mission photo archive",
  ],
  history: [
    "Malawi mission trip",
    "Mozambique Zambia evangelism",
    "Dominican Republic mission trip",
    "mission trip timeline since 2013",
    "Sam Banda painter with no hands",
  ],
} as const;

export type KeywordSet = keyof typeof KEYWORDS;

/** Merge keyword sets (deduplicated, order preserved). */
export function keywords(...sets: (KeywordSet | string[])[]): string[] {
  const out: string[] = [];
  for (const s of sets) {
    const list = typeof s === "string" ? KEYWORDS[s] : s;
    for (const k of list) if (!out.includes(k)) out.push(k);
  }
  return out;
}

export const absolute = (path: string) =>
  path.startsWith("http") ? path : `${site.url}${path}`;

/** JSON-LD BreadcrumbList. Home is always the first crumb. */
export function breadcrumbLd(
  crumbs: { name: string; path: string }[],
): Record<string, unknown> {
  const items = [{ name: "Home", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

export type Faq = { q: string; a: string };

/** JSON-LD FAQPage — pass the SAME array the page renders. */
export function faqLd(faqs: Faq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export type HowToStep = { name: string; text: string };

/** JSON-LD HowTo for the guides that are genuinely step-by-step. */
export function howToLd(opts: {
  name: string;
  description: string;
  path: string;
  steps: HowToStep[];
  totalCost?: { value: number; currency?: string };
  supplies?: string[];
  image?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.totalCost
      ? {
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: opts.totalCost.currency ?? "USD",
            value: opts.totalCost.value,
          },
        }
      : {}),
    ...(opts.supplies?.length
      ? {
          supply: opts.supplies.map((s) => ({ "@type": "HowToSupply", name: s })),
        }
      : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${absolute(opts.path)}#step-${i + 1}`,
    })),
  };
}

/** JSON-LD Article with the publisher and author already filled in. */
export function articleLd(opts: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string | string[];
  author?: { name: string; path: string } | { name: string; path: string }[];
  keywords?: string[];
}): Record<string, unknown> {
  const authors = opts.author
    ? Array.isArray(opts.author)
      ? opts.author
      : [opts.author]
    : [{ name: "Don Nichols", path: "/don" }];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(", ") } : {}),
    author: authors.map((a) => ({
      "@type": "Person",
      name: a.name,
      url: absolute(a.path),
    })),
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/pwa-icon/512` },
    },
    mainEntityOfPage: absolute(opts.path),
    isAccessibleForFree: true,
  };
}

/**
 * JSON-LD Event for a mission trip. Past trips are still worth marking up:
 * Google understands "this happened, here, then" and connects the album to
 * the place.
 */
export function tripEventLd(opts: {
  name: string;
  description: string;
  path: string;
  location: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  status: "upcoming" | "completed";
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: opts.name,
    description: opts.description,
    url: absolute(opts.path),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.startDate ? { startDate: opts.startDate } : {}),
    ...(opts.endDate ? { endDate: opts.endDate } : {}),
    eventStatus:
      opts.status === "upcoming"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: opts.location,
      address: { "@type": "PostalAddress", addressCountry: opts.location.split(",")[0].trim() },
    },
    organizer: {
      "@type": "Organization",
      name: `${site.name} Mission Work`,
      url: site.url,
    },
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absolute("/give"),
      description: "Every patient is served completely free of charge.",
    },
  };
}

/** JSON-LD ImageObject list for a photo album, using verified captions only. */
export function imageObjectsLd(
  images: { url: string; name: string; caption?: string }[],
): Record<string, unknown>[] {
  return images.map((img) => ({
    "@type": "ImageObject",
    contentUrl: img.url,
    url: img.url,
    name: img.name,
    ...(img.caption ? { caption: img.caption, description: img.caption } : {}),
    creator: { "@type": "Person", name: "Don & Patti Nichols" },
    copyrightNotice: "© Don & Patti Nichols",
    creditText: "Don & Patti Nichols",
  }));
}

/** JSON-LD DonateAction for the giving pages. */
export function donateActionLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: "Give to the Belize medical mission",
    description:
      "Partner with Don & Patti Nichols: Bibles, hygiene kits, reading glasses, and the cost of sending a missionary — all given free to the people served.",
    recipient: {
      "@type": "Organization",
      name: `${site.name} Mission Work`,
      url: site.url,
    },
    target: { "@type": "EntryPoint", urlTemplate: absolute("/give") },
    actionStatus: "https://schema.org/PotentialActionStatus",
  };
}

/**
 * The share card for a static page that has no opengraph-image.tsx of its
 * own — rendered by app/og/route.tsx. Returns the absolute URL plus the size
 * the route always produces, ready for createPageMetadata({ image }).
 */
export function ogCardImage(opts: {
  eyebrow: string;
  title: string;
  line?: string;
  meta?: string;
  photo?: string;
  alt?: string;
}) {
  const q = new URLSearchParams();
  q.set("e", opts.eyebrow);
  q.set("t", opts.title);
  if (opts.line) q.set("l", opts.line);
  if (opts.meta) q.set("m", opts.meta);
  if (opts.photo) q.set("p", opts.photo);
  return {
    url: `${site.url}/og?${q.toString()}`,
    width: 1200,
    height: 630,
    alt: opts.alt ?? `${opts.title} — Don & Patti Nichols`,
  };
}

/** Serialize for a <script type="application/ld+json"> tag safely. */
export function ldJson(data: unknown): string {
  // "</script>" inside a string would end the tag early; escape the slash.
  return JSON.stringify(data).replace(/<\//g, "<\\/");
}
