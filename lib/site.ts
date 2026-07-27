/**
 * Site-wide configuration — the single place to update names, URLs,
 * navigation, the upcoming trip, and (when Don sends them) PayPal links.
 */

export const site = {
  name: "Don & Patti Nichols",
  tagline: "Mission Work & Ministry",
  /** Canonical production domain. */
  url: "https://www.donandpatti.com",
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
   * Giving — PayPal (Don's decision).
   * [NEEDED] When Don creates his PayPal Donate buttons, paste the links into
   * paypalUrl (general) and each fund's paypalUrl. Empty string = the give
   * buttons route to /give#ways-to-give until then.
   *
   * PayPal "custom" field → what the IPN records as `donations.fund`.
   * On each Donate button, set the button's `custom` field to one of these
   * codes so gifts are attributed (and, for belize-trip, the trip total updates):
   *
   *   Designated funds (these keys):
   *     where-needed · belize-trip · medical-supplies · bibles-pastors ·
   *     community-outreach
   *   Fill-the-Trunks items (content/supplies.ts ids):
   *     reading-glasses · bible · trunk · hygiene-kit · sunglasses · tracts ·
   *     pastor-gift · baggage · customs · missionary
   *   Kit + Bible combo: kit-and-bible
   *
   * Only `belize-trip` maps to a trip (app/api/paypal/ipn TRIP_FUNDS); the
   * supply-item codes feed the Fill-the-Trunks meters via fund_totals.
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
        key: "community-outreach",
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
