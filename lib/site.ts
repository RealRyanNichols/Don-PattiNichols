/**
 * SITE CONFIGURATION — the one file to edit most often.
 * Payment links, analytics IDs, addresses, and nav all live here.
 * Anything marked [NEEDED] is waiting on real info from Don & Patti.
 */

import { paypalDonateUrl } from "./paypal";

export const site = {
  name: "Don & Patti Nichols",
  shortName: "The Nichols",
  tagline: "Medical Care for the Body. Hope for the Soul.",
  description:
    "Don & Patti Nichols share the love of Jesus Christ through free medical mission clinics in Belize, preaching, and local community ministry. Follow their work, read their updates, and partner with them in the mission.",
  /*
   * Custom domain, purchased July 2026 (GoDaddy) and pointed at Vercel.
   *
   * MUST be the www host. The apex 308-redirects to www, so when this was
   * "https://donandpatti.com" every canonical tag, every Open Graph url, and
   * every entry in the sitemap pointed at a URL that immediately redirects.
   * Search engines follow it, but it wastes crawl budget and invites Google to
   * pick its own idea of the canonical URL. Point at where the pages actually
   * live.
   */
  url: "https://www.donandpatti.com",
  locale: "en_US",

  verse: {
    text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.",
    reference: "Matthew 28:19",
  },

  /**
   * TOP NAVIGATION — deliberately eight short labels.
   *
   * This list was ten items with long labels ("Behind the Mission", "Fill the
   * Trunks"), which wrapped onto two lines at 1024–1300px and crushed the
   * wordmark beside it. A header that wraps reads as unfinished no matter how
   * good the rest of the page is. Everything trimmed from here still lives in
   * `footerNav` below, so no page loses its link.
   */
  nav: [
    { label: "Our Mission", href: "/mission" },
    { label: "Belize", href: "/belize" },
    { label: "Trips", href: "/trips" },
    { label: "Photos", href: "/albums" },
    { label: "Stories", href: "/blog" },
    { label: "Sponsor", href: "/sponsor" },
    { label: "Open Book", href: "/transparency" },
    { label: "Contact", href: "/contact" },
  ],

  /** The full map — the footer carries every public page. */
  footerNav: [
    { label: "Our Mission", href: "/mission" },
    { label: "The Belize Mission", href: "/belize" },
    { label: "Behind the Mission", href: "/behind-the-mission" },
    { label: "Fill the Trunks", href: "/sponsor" },
    { label: "Mission Trips", href: "/trips" },
    { label: "Photo Archive", href: "/albums" },
    { label: "Open Book", href: "/transparency" },
    { label: "What a Trip Costs", href: "/what-a-mission-trip-costs" },
    { label: "Stories", href: "/blog" },
    { label: "Our Story", href: "/our-story" },
    { label: "Thank You", href: "/thank-you" },
    { label: "Contact", href: "/contact" },
  ],

  /**
   * GIVING — PAYPAL IS THE PRIMARY PROCESSOR (Don & Patti's choice).
   *
   * SETUP (Don or Ryan, in their PayPal account):
   *   1. paypal.com → Pay & Get Paid → "Donate" button (PayPal Donate).
   *   2. Create ONE button per fund below (name it after the fund).
   *      Each button supports one-time AND monthly recurring in the same flow.
   *   3. Paste each button's hosted URL into `paypalUrl` below
   *      (looks like https://www.paypal.com/donate/?hosted_button_id=XXXXXXX).
   *   4. If they get 501(c)(3) confirmed-charity status with PayPal, fees drop —
   *      ask PayPal about nonprofit rates.
   *
   * Until real links are pasted, buttons route to /give#ways-to-give.
   * Stripe fields kept as optional secondary processor for later.
   */
  giving: {
    funds: [
      {
        id: "belize-trip",
        label: "Belize Mission Trip",
        blurb:
          "Sends the team: travel, clinic setup, and on-the-ground trip costs for the upcoming Belize medical mission.",
        paypalUrl: paypalDonateUrl("Belize Mission Trip — Don & Patti Nichols"),
      },
      {
        id: "medical-supplies",
        label: "Medical & Pharmacy Supplies",
        blurb:
          "Medications, reading glasses, hygiene kits, and clinic supplies — given free to every patient.",
        paypalUrl: paypalDonateUrl("Medical & Pharmacy Supplies — Belize Mission"),
      },
      {
        id: "bibles-pastors",
        label: "Bibles & Pastor Support",
        blurb:
          "Study Bibles, Gospel literature, and practical support for village pastors in Belize.",
        paypalUrl: paypalDonateUrl("Bibles & Pastor Support — Belize Mission"),
      },
      {
        id: "local-outreach",
        label: "Local Community Outreach",
        blurb: "The Nichols' ongoing church and community work here at home.",
        paypalUrl: paypalDonateUrl("Local Community Outreach — Nichols Ministry"),
      },
      {
        id: "where-needed",
        label: "Where Needed Most",
        blurb: "Unrestricted — goes to the most urgent need at the time.",
        paypalUrl: paypalDonateUrl("Where Needed Most — Belize Mission"),
      },
    ],
    /** General PayPal giving link — donor picks any amount. */
    paypalUrl: paypalDonateUrl("Belize Mission — Don & Patti Nichols"),
    /**
     * Tax-deductible giving runs through the sponsoring 501(c)(3).
     * Fill these in and the Give page will show the official language.
     */
    org501c3: {
      name: "", // [NEEDED] exact legal name of the church/501(c)(3)
      instructions: "", // [NEEDED] e.g. memo line "Nichols – Belize Mission"
      address: "", // [NEEDED] mailing address for checks
    },
  },

  contactEmail: "", // [NEEDED] ministry inbox, e.g. hello@...
  socials: {
    facebook: "", // [NEEDED] page URLs when created
    instagram: "",
    youtube: "",
  },

  analytics: {
    ga4Id: "", // [NEEDED] paste GA4 measurement ID (G-XXXX) to enable
    metaPixelId: "", // [NEEDED] paste Meta Pixel ID to enable
  },
};

export type Fund = (typeof site.giving.funds)[number];
