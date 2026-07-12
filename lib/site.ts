/**
 * Site-wide configuration — the single place to update names, URLs,
 * navigation, the upcoming trip, and (when Don sends them) PayPal links.
 */

export const site = {
  name: "Don & Patti Nichols",
  tagline: "Mission Work & Ministry",
  /** Ryan's Vercel project — update again when a custom domain is purchased. */
  url: "https://don-patti-nichols.vercel.app",
  description:
    "Don & Patti Nichols share the love of Jesus Christ through free medical mission clinics in Belize, preaching, and local community ministry. Follow their work, read their updates, and partner with them in the mission.",
  keywords: [
    "Don Nichols",
    "Patti Nichols",
    "Belize medical mission",
    "medical mission trip",
    "mission trip donations",
    "Christian missions Belize",
    "free medical clinic Belize",
  ],

  nav: [
    { label: "Our Mission", href: "/mission" },
    { label: "Belize", href: "/belize" },
    { label: "Behind the Mission", href: "/behind-the-mission" },
    { label: "Fill the Trunks", href: "/sponsor" },
    { label: "Trips", href: "/trips" },
    { label: "Timeline", href: "/blog" },
    { label: "Our Story", href: "/our-story" },
    { label: "Contact", href: "/contact" },
  ],

  /**
   * The next trip. [NEEDED] from Don: dates and fundraising goal.
   * Setting startDate (YYYY-MM-DD) activates the homepage countdown
   * automatically; dateLabel is the human-readable version.
   */
  trip: {
    title: "Belize Medical Mission Trip",
    location: "Belize",
    dateLabel: "",
    startDate: "",
    goalUsd: null as number | null,
  },

  /**
   * Giving — PayPal-first (Don's decision).
   * [NEEDED] When Don creates his PayPal Donate buttons, paste the links into
   * paypalUrl (general) and each fund's paypalUrl. Empty string = the give
   * buttons route to /give#ways-to-give until then.
   */
  giving: {
    paypalUrl: "",
    funds: [
      {
        key: "belize-trip",
        name: "Belize Mission Trip",
        blurb:
          "Sends the team: travel, clinic setup, and on-the-ground trip costs for the upcoming Belize medical mission.",
        paypalUrl: "",
      },
      {
        key: "medical-supplies",
        name: "Medical & Pharmacy Supplies",
        blurb:
          "Medications, reading glasses, hygiene kits, and clinic supplies — given free to every patient.",
        paypalUrl: "",
      },
      {
        key: "bibles-pastors",
        name: "Bibles & Pastor Support",
        blurb:
          "Study Bibles, Gospel literature, and practical support for village pastors in Belize.",
        paypalUrl: "",
      },
      {
        key: "local-outreach",
        name: "Local Community Outreach",
        blurb: "The Nichols' ongoing church and community work here at home.",
        paypalUrl: "",
      },
      {
        key: "where-needed",
        name: "Where Needed Most",
        blurb: "Unrestricted — goes to the most urgent need at the time.",
        paypalUrl: "",
      },
    ],
    /**
     * [NEEDED] 501(c)(3) entity details. Tax-deductibility language stays OFF
     * the site until these arrive.
     */
    org501c3: {
      legalName: "",
      mailingAddress: "",
      memoInstructions: "",
    },
  },

  /**
   * GA4 / Meta Pixel IDs — set NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_META_PIXEL_ID in
   * the environment when ads start. Empty = scripts not loaded (never breaks the
   * build). Wired through AnalyticsScripts.
   */
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  },
} as const;
