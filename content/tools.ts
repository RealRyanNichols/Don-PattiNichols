/**
 * TOOLS — things a visitor can use, print, or download.
 *
 * Every tool runs in the browser or as an image route, stores nothing about
 * the visitor, and is built from Don's real numbers where numbers appear. They
 * exist for two reasons: they are genuinely useful to churches and teams, and
 * a useful page gets linked, shared and ranked in a way a brochure never is.
 */

export type Tool = {
  slug: string;
  href: string;
  title: string;
  blurb: string;
  /** What comes out the other end. */
  output: "calculator" | "printable" | "download" | "image";
  /** Drive photo id with a verified caption. */
  photo: string;
  keywords: string[];
};

export const tools: Tool[] = [
  {
    slug: "mission-trip-budget-calculator",
    href: "/tools/mission-trip-budget-calculator",
    title: "Mission Trip Budget Calculator",
    blurb:
      "Price a whole medical mission from Don's real unit costs — team, Bibles, kits, glasses, trunks, baggage — and download the sheet.",
    output: "calculator",
    photo: "1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop",
    keywords: [
      "mission trip budget calculator",
      "medical mission trip cost calculator",
      "mission trip budget template",
      "how to budget a mission trip",
    ],
  },
  {
    slug: "hygiene-kit-party",
    href: "/tools/hygiene-kit-party",
    title: "Hygiene Kit Checklist & Party Planner",
    blurb:
      "Tell it how many kits you want to make; get the shopping list, the cost, and a printable checklist for the assembly table.",
    output: "printable",
    photo: "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z",
    keywords: [
      "hygiene kit checklist",
      "hygiene kit packing party",
      "hygiene kit shopping list",
      "church service project hygiene kits",
    ],
  },
  {
    slug: "prayer-cards",
    href: "/tools/prayer-cards",
    title: "Seven-Day Prayer Cards",
    blurb:
      "The whole prayer guide on one printable sheet — a verse and prayer points for each day a team is on the ground.",
    output: "printable",
    photo: "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI",
    keywords: [
      "printable prayer cards missions",
      "prayer guide for mission trip printable",
      "missionary prayer cards",
    ],
  },
  {
    slug: "wallpapers",
    href: "/tools/wallpapers",
    title: "Scripture Phone Wallpapers",
    blurb:
      "Seven lock-screen wallpapers, one verse per day of the prayer guide, over photographs from the mission field.",
    output: "image",
    photo: "1fOur4mZtWqvLpmacSmtiXB4DJJk5mAg5",
    keywords: [
      "scripture phone wallpaper",
      "bible verse lock screen",
      "christian phone wallpaper free",
      "missions wallpaper",
    ],
  },
  {
    slug: "support-letter",
    href: "/tools/support-letter",
    title: "Support Letter Generator",
    blurb:
      "Answer eight questions and get a one-page mission trip support letter to copy or download. Nothing is saved.",
    output: "download",
    photo: "1B8apaW2hx5UTMxmJ2VJ8Mp3SRpevs4Sd",
    keywords: [
      "mission trip support letter generator",
      "support letter template",
      "mission trip fundraising letter",
    ],
  },
  {
    slug: "share-card",
    href: "/tools/share-card",
    title: "\"I Gave\" Share Card",
    blurb:
      "Make a picture that says what you sent — ten Bibles, a trunk, a missionary — and post it so the next person gives too.",
    output: "image",
    photo: "1IKE9SB5pmB42BcUTUxr0XDI0IbkOv1qi",
    keywords: [
      "donation share card",
      "i gave social media image",
      "share my gift facebook",
    ],
  },
  {
    slug: "church-poster",
    href: "/tools/church-poster",
    title: "Church Poster & Bulletin Insert",
    blurb:
      "Put your church's name and the date on a printable poster with a QR code to the mission, ready for the lobby or the bulletin.",
    output: "image",
    photo: "1FA_f5nIT6gBF49wPpTDgCxLrljxtoQ-q",
    keywords: [
      "missionary visit poster",
      "church bulletin insert missions",
      "mission speaker poster template",
      "QR code church poster",
    ],
  },
  {
    slug: "trunk-inventory-sheet",
    href: "/tools/trunk-inventory-sheet",
    title: "Trunk Inventory Sheet",
    blurb:
      "The item-by-item inventory sheet that travels with every trunk through customs, with the free-of-charge declaration, ready to print.",
    output: "printable",
    photo: "1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA",
    keywords: [
      "mission trip inventory sheet",
      "customs inventory list template",
      "trunk packing list mission",
    ],
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
