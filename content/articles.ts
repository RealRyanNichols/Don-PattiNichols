import type { Faq } from "@/lib/seo";
import { supplyDrive } from "./supplies";
import { suppliesBudget, logisticsBudget, missionaryCost } from "./support";
import { historyStats, countriesServed, missionTimeline } from "./history";
import { totalPhotos, albums } from "./albums";
import { behind } from "./behind";
import { tripsByCountry, unitsPer, monthlyInBibles } from "./charts";

/**
 * ARTICLES — the data pieces.
 *
 * Guides answer "how do I". Articles answer "show me": where the money goes,
 * what $25 buys, thirteen years in charts, the math of monthly giving, a quiz,
 * a checklist, fundraising ideas, Belize by the numbers. Each one is built
 * from blocks so a chart, an interactive, a capture form and a give button
 * can sit exactly where the reader has just been given a reason to act.
 *
 * SOURCING RULE, same as everywhere: every fact about the Nichols mission
 * comes from Don's published content and his own records. Every chart reads
 * live from those files. General advice sits in a labelled box. Nothing is
 * invented, estimated, or borrowed from another organisation.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string; from: string }
  | { kind: "list"; items: string[] }
  | { kind: "general"; paragraphs: string[] }
  | { kind: "chart"; id: string }
  | { kind: "stats"; items: { value: string; label: string; note?: string }[] }
  | { kind: "interactive"; name: "trunk-builder" | "quiz" | "checklist" | "fundraiser" | "monthly" }
  | { kind: "join"; heading: string; text: string; interest: string; source: string }
  | { kind: "give"; itemId?: string; heading: string; text: string }
  | { kind: "links"; heading: string; items: { label: string; href: string; blurb?: string }[] }
  | { kind: "photo"; id: string }
  | { kind: "table"; caption: string; head: string[]; rows: (string | number)[][] };

export type Article = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  keywords: string[];
  hero: string;
  datePublished: string;
  blocks: Block[];
  faqs: Faq[];
  /** One line for the share sheet. */
  shareText: string;
};

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });
const item = (id: string) => supplyDrive.items.find((i) => i.id === id)!;
const price = (id: string) => usd(item(id).unitCost);
const logisticsPct = Math.round((logisticsBudget.total / supplyDrive.goalUsd) * 100);
const tripCount = missionTimeline.filter((t) => !t.gap).length;
const byCountry = tripsByCountry();

export const articles: Article[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "where-does-a-mission-donation-go",
    title: `Where Does a Mission Trip Donation Actually Go? Don's ${usd(supplyDrive.goalUsd)} Budget, Charted`,
    eyebrow: "By the numbers",
    description: `Most ministries answer "where does my donation go" with a pie chart of percentages. This one answers with a receipt: every line of a ${usd(supplyDrive.goalUsd)} medical mission supply drive, charted, with nothing held back for overhead.`,
    keywords: [
      "where does my donation go",
      "mission trip budget breakdown",
      "charity transparency",
      "how much of my donation goes to the cause",
      "nonprofit overhead",
      "medical mission budget",
      "mission trip costs charted",
    ],
    hero: "1T4k_C9YSpbYNY0cNyOrvbCsocGP-ABop",
    datePublished: "2026-09-12",
    shareText: `Where a mission donation actually goes: Don Nichols' ${usd(supplyDrive.goalUsd)} budget, every line charted. ${logisticsPct}% of it is moving supplies, not buying them.`,
    blocks: [
      {
        kind: "p",
        text: `Ask most organisations where a donation goes and you get a percentage. Ask Don Nichols and you get a price list. He publishes the whole budget for a Belize medical mission because donors asked — a Bible is ${price("bible")}, a hygiene kit ${price("hygiene-kit")}, a pair of reading glasses ${price("reading-glasses")}, a missionary ${usd(missionaryCost.total)}. This article puts that budget into charts so you can see the shape of it in ten seconds.`,
      },
      {
        kind: "stats",
        items: [
          { value: usd(supplyDrive.goalUsd), label: "supply drive for one trip", note: "supplies plus getting them there" },
          { value: `${logisticsPct}%`, label: "of it is logistics", note: "trunks, baggage fees, customs, contingency" },
          { value: "$0", label: "held back as overhead", note: "nobody on the team is paid" },
        ],
      },
      { kind: "h2", text: "The split nobody publishes" },
      {
        kind: "p",
        text: `The first surprise is how much of a supply drive never buys a supply. ${usd(logisticsBudget.total)} of the ${usd(supplyDrive.goalUsd)} goes to trunks, airline baggage fees, customs, and an emergency fund. In Don's words: "Transporting these supplies is a ministry in itself."`,
      },
      { kind: "chart", id: "budget-split" },
      { kind: "h2", text: "What the supplies cost, line by line" },
      {
        kind: "p",
        text: `Everything on this chart is handed to somebody in a Belize village free of charge. Hygiene kits are the biggest line because there are three hundred of them; Bibles are second. The pastor gift sets — a study Bible and practical household gifts for three village pastors and their wives — are how the mission keeps preaching after the trunks are empty.`,
      },
      { kind: "chart", id: "supply-lines" },
      { kind: "h2", text: "And what it costs to get it there" },
      { kind: "quote", text: logisticsBudget.intro, from: "Don Nichols" },
      { kind: "chart", id: "logistics-lines" },
      {
        kind: "p",
        text: `Six trunks at ${price("baggage")} each in baggage fees is the largest single line on the whole drive — larger than all the Bibles. It is also the least glamorous gift on the list and, trip after trip, the one that still needs a sponsor.`,
      },
      { kind: "chart", id: "trunks" },
      {
        kind: "give",
        itemId: "baggage",
        heading: "Fly one trunk",
        text: `${price("baggage")} puts one fifty-pound trunk of Bibles, kits and glasses on the plane. It is the gift that makes every other gift arrive.`,
      },
      { kind: "h2", text: "Why the numbers are this small" },
      {
        kind: "p",
        text: "There is no organisation taking a cut. Don and Patti are not paid a salary from any of this, and no percentage is held back for overhead. When somebody sponsors a Bible for $2.50, $2.50 of Bible arrives in Belize. Prices are low because things are bought in bulk, in-country where possible, and carried in personally rather than shipped.",
      },
      {
        kind: "join",
        heading: "Get the budget every time it changes",
        text: "Don publishes the real numbers. Leave your name and number and you will get them as they change, plus photographs of what the money became.",
        interest: "the budget",
        source: "article_budget",
      },
      { kind: "h2", text: "See the receipts, not just the plan" },
      {
        kind: "links",
        heading: "Keep going",
        items: [
          { label: "Open Book — recorded gifts and expenses", href: "/transparency", blurb: "The live ledger, in the open." },
          { label: "What a mission trip actually costs", href: "/what-a-mission-trip-costs", blurb: "The full price list, to the dime." },
          { label: "Mission trip budget calculator", href: "/tools/mission-trip-budget-calculator", blurb: "Price your own trip from these numbers." },
        ],
      },
    ],
    faqs: [
      {
        q: "How much of a donation to the Nichols mission goes to the cause?",
        a: "All of it. Nobody on the team is paid, and no percentage is held back for overhead. A gift designated to an item on the Fill the Trunks page becomes that item; an undesignated gift goes to the most urgent need.",
      },
      {
        q: "Why is so much of the budget logistics?",
        a: `Because the team carries the supplies in personally. Flying six trunks as checked baggage costs ${usd(logisticsBudget.items[1].amount)}, the trunks themselves ${usd(logisticsBudget.items[0].amount)}, customs about $75, and a contingency fund ${usd(250)} — ${usd(logisticsBudget.total)} in all, or ${logisticsPct}% of the drive.`,
      },
      {
        q: "Where can I see actual gifts and expenses, not just the plan?",
        a: "The Open Book page shows recorded gifts and hand-entered expenses, clearly labelled as separate records. PayPal gifts are not yet synchronised automatically, and the page says so.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "what-25-dollars-buys-on-a-mission-trip",
    title: "What $25 Buys on a Medical Mission Trip (Build the Trunk Yourself)",
    eyebrow: "Interactive",
    description: `Twenty-five dollars is ${unitsPer(25).find((d) => d.label.includes("Glasses"))?.value} pairs of reading glasses, ten Bibles, or eight hygiene kits at Don Nichols' real prices. Pick a budget, tap what goes in the trunk, then make it real.`,
    keywords: [
      "what does $25 buy",
      "small donation impact",
      "what can $25 donate",
      "best way to donate $25",
      "how far does a donation go",
      "donate reading glasses",
      "sponsor Bibles",
    ],
    hero: "1IKE9SB5pmB42BcUTUxr0XDI0IbkOv1qi",
    datePublished: "2026-09-12",
    shareText: "Twenty-five dollars is forty-one pairs of reading glasses or ten Bibles at real mission prices. Build a trunk and see what yours buys.",
    blocks: [
      {
        kind: "p",
        text: `People underestimate twenty-five dollars because they have never seen a mission price list. Don Nichols publishes his. At the prices he actually pays, ${usd(25)} is ${unitsPer(25).map((d) => `${d.value} ${d.label.toLowerCase()}`).slice(0, 3).join(", or ")}. Here is the whole comparison, then a trunk you can pack yourself.`,
      },
      { kind: "chart", id: "units-per-25" },
      { kind: "h2", text: "Pack it yourself" },
      {
        kind: "p",
        text: "Pick a budget, tap items into the trunk, and watch what fits. When you like what you see, the button opens PayPal with your exact trunk in the item name — so the picture you built is the gift that arrives.",
      },
      { kind: "interactive", name: "trunk-builder" },
      { kind: "h2", text: "Why sixty cents is the most-remembered gift" },
      {
        kind: "quote",
        text: "A simple pair of reading glasses can enable someone to read again, sew clothing, study God's Word, complete paperwork, or continue earning a living.",
        from: "Don Nichols, Why Belize?",
      },
      {
        kind: "p",
        text: "Glasses are sorted by prescription before the trip and laid out in rows on a table. A person holds a page of printed text at the distance that works for them, and the pair that matches goes home with them — free, like everything else on the table.",
      },
      { kind: "photo", id: "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej" },
      {
        kind: "give",
        itemId: "reading-glasses",
        heading: "Sixty cents. One pair.",
        text: `${price("reading-glasses")} is a pair of reading glasses sorted, carried to Belize, and fitted at the table in that photograph. Twenty-five dollars is forty-one of them.`,
      },
      { kind: "h2", text: "What a hygiene kit is worth" },
      {
        kind: "quote",
        text: behind.hygieneKit.paragraphs[1],
        from: "Don Nichols, Behind Every Mission Trip",
      },
      {
        kind: "links",
        heading: "Keep going",
        items: [
          { label: "Fill the Trunks — sponsor a specific item", href: "/sponsor", blurb: "Every item, any quantity, straight to PayPal." },
          { label: "How to make a hygiene kit", href: "/guides/how-to-make-a-hygiene-kit", blurb: "Contents, cost, and a party planner." },
          { label: "Reading glasses on the mission field", href: "/guides/reading-glasses-mission-ministry", blurb: "How the vision table works." },
        ],
      },
    ],
    faqs: [
      {
        q: "What does $25 buy on a medical mission trip?",
        a: `At Don Nichols' published prices: ${unitsPer(25).map((d) => `${d.value} ${d.label.toLowerCase()}`).join(", ")}. Every item is handed to someone in Belize free of charge.`,
      },
      {
        q: "Can I choose exactly what my $25 buys?",
        a: "Yes. The trunk builder on this page and the Fill the Trunks page both open PayPal with your chosen items and quantity in the item name.",
      },
      {
        q: "Do small gifts actually matter?",
        a: `The cheapest line on Don's budget — reading glasses at ${price("reading-glasses")} — is the one he keeps coming back to when he describes what a trip does. Three hundred pairs cost ${usd(suppliesBudget.items[3].amount)}.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "mission-trip-timeline-in-charts",
    title: `${historyStats.yearSpan.replace("–", " to ")}: Thirteen Years of Mission Trips, in Charts`,
    eyebrow: "The record",
    description: `${tripCount} mission trips across ${countriesServed.length} countries since ${historyStats.firstYear}, the three years they could not go, and ${totalPhotos} photographs — Don Nichols' own timeline, charted.`,
    keywords: [
      "mission trip history",
      "long-term missionaries",
      "Malawi mission trips",
      "Dominican Republic mission trips",
      "Belize mission 2026",
      "mission trip timeline",
      "years of mission work",
    ],
    hero: "1o6QMRqsNqN_NUy-WOggOi8eauNfrX_zj",
    datePublished: "2026-09-12",
    shareText: `${tripCount} mission trips, ${countriesServed.length} countries, ${totalPhotos} photographs since ${historyStats.firstYear} — Don and Patti Nichols' record, in charts.`,
    blocks: [
      {
        kind: "p",
        text: `Don Nichols keeps a Mission Trip Timeline: every year, where he went, what the focus was, who was on the team. It is transcribed on this site exactly as he wrote it, including the years with no trips and why. Charted, it tells the story faster than any paragraph.`,
      },
      {
        kind: "stats",
        items: [
          { value: String(tripCount), label: "mission trips", note: `since ${historyStats.firstYear}` },
          { value: String(countriesServed.length), label: "countries", note: countriesServed.join(", ") },
          { value: String(totalPhotos), label: "photographs", note: "all taken by Don and Patti" },
        ],
      },
      { kind: "h2", text: "Trips per year, and the three years with none" },
      {
        kind: "p",
        text: "Three years are marked with a circle instead of a bar. 2020 was COVID travel restrictions. 2024 and 2025 were Don's open-heart surgery and recovery — and June 2026, Belize, was the road back. Hover any year for what Don recorded.",
      },
      { kind: "chart", id: "trips-per-year" },
      { kind: "h2", text: "Where the trips went" },
      {
        kind: "p",
        text: `Malawi is where it began, in July 2013, and where Don returned nearly every year through 2019 — including July 2015, when the work reached across the border into Mozambique and Zambia. Four trips to the Dominican Republic followed, and then Belize.`,
      },
      { kind: "chart", id: "trips-by-country" },
      { kind: "h2", text: "What grew out of those years" },
      {
        kind: "p",
        text: "Water wells drilled and handed over to villages. Sewing machines, thread and scissors set up as a working trade for widows and orphans. Bibles and Gospel literature distributed. Crowds gathered under whatever shade there was to hear preaching, with Malawian translators carrying every word the last few feet.",
      },
      { kind: "chart", id: "archive-by-album" },
      { kind: "photo", id: "1sTAXV2XNx7MwshLmPda_YuvaraGBpdaF" },
      {
        kind: "join",
        heading: "Be on the list for the next trip",
        text: "When Don announces the next one, the people on the list hear first — with a text when the team lands and when they get home.",
        interest: "next trip",
        source: "article_timeline",
      },
      {
        kind: "links",
        heading: "Keep going",
        items: [
          { label: "The full timeline, in Don's words", href: "/trips", blurb: "Every year since 2013." },
          { label: "The photo archive", href: "/albums", blurb: `${totalPhotos} photographs from five countries.` },
          { label: "Stories from the field", href: "/blog", blurb: "Written by Don and Patti themselves." },
        ],
      },
    ],
    faqs: [
      {
        q: "How many mission trips have Don and Patti Nichols taken?",
        a: `${tripCount} recorded trips since ${historyStats.firstYear}, across ${countriesServed.length} countries: ${countriesServed.join(", ")}.`,
      },
      {
        q: "Why were there no trips in 2020, 2024 and 2025?",
        a: "2020: no mission trips due to COVID-19 international travel restrictions. 2024 and 2025: Don's open-heart surgery and continued recovery. All three are recorded in his own timeline.",
      },
      {
        q: "Which country have they visited most?",
        a: `${byCountry[0].label}, with ${byCountry[0].value} trips between 2013 and 2019.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "monthly-giving-math",
    title: "The Math of Monthly Giving: What $25 a Month Does in a Year",
    eyebrow: "Giving",
    description: `Twelve months of ${usd(25)} is ${monthlyInBibles(25)} Bibles at Don Nichols' real price, or one missionary sponsored in ${Math.ceil(missionaryCost.total / 25)} months. Drag the slider and see what your monthly gift becomes.`,
    keywords: [
      "monthly giving",
      "recurring donation impact",
      "become a monthly donor",
      "monthly mission partner",
      "what does $25 a month do",
      "sustaining donor",
    ],
    hero: "1Q_EcBiYkUEopoM8dsGtO6S8J6DIu8ISP",
    datePublished: "2026-09-12",
    shareText: `${usd(25)} a month is ${monthlyInBibles(25)} Bibles a year at real mission prices. Drag the slider and see what yours does.`,
    blocks: [
      {
        kind: "p",
        text: "A one-time gift funds a trip. A monthly gift plans the next one. Recurring support lets the team buy supplies in bulk and say yes to a need the moment it appears, instead of waiting for the next fundraising season. Here is what the arithmetic looks like at Don Nichols' published prices.",
      },
      { kind: "chart", id: "monthly-year" },
      { kind: "h2", text: "Try your own number" },
      { kind: "interactive", name: "monthly" },
      { kind: "h2", text: `Or send one person: ${usd(missionaryCost.total)}` },
      { kind: "quote", text: missionaryCost.note, from: "Don Nichols" },
      { kind: "chart", id: "missionary-split" },
      {
        kind: "p",
        text: `Kept together, ${usd(100)} a month is one missionary a year — airfare, lodging, meals and ground transport for an unpaid volunteer who takes vacation time to serve.`,
      },
      {
        kind: "join",
        heading: "Hear what your monthly gift did",
        text: "Monthly partners get the trip recap first: patients seen, Bibles given, photographs from the villages.",
        interest: "monthly",
        source: "article_monthly",
      },
      {
        kind: "links",
        heading: "Keep going",
        items: [
          { label: "Give to the mission", href: "/give", blurb: "Every way to partner, one-time or monthly." },
          { label: "How to sponsor a missionary", href: "/guides/how-to-sponsor-a-missionary", blurb: `What ${usd(missionaryCost.total)} covers.` },
          { label: "Open Book", href: "/transparency", blurb: "Where the money goes, in the open." },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I give monthly to the Nichols mission?",
        a: "Every PayPal donate link on the site offers a monthly option at checkout. Use the slider on this page or any Give button, then tick \"monthly\" on the PayPal page. Cancel any time from your PayPal account.",
      },
      {
        q: "What does $25 a month buy?",
        a: `${usd(300)} a year — ${monthlyInBibles(25)} Bibles at ${price("bible")}, or ${Math.floor(300 / item("hygiene-kit").unitCost)} hygiene kits at ${price("hygiene-kit")}, or ${Math.floor(300 / item("reading-glasses").unitCost)} pairs of reading glasses at ${price("reading-glasses")}.`,
      },
      {
        q: "Why does monthly giving matter more than one-time?",
        a: "Recurring gifts let the team plan trips, buy supplies in bulk, and respond to needs the moment they appear, instead of waiting for the next fundraising season.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "medical-missions-quiz",
    title: "Quiz: How Much Do You Know About Medical Missions?",
    eyebrow: "Fun",
    description: "Ten questions, every answer a real number from Don Nichols' mission budget and trip record. Score yourself, share your result, and get the stories behind the answers.",
    keywords: [
      "missions quiz",
      "medical mission trivia",
      "mission trip quiz",
      "how much do you know about missions",
      "Christian missions quiz",
      "church quiz ideas",
    ],
    hero: "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I",
    datePublished: "2026-09-12",
    shareText: "Ten questions about medical missions, every answer a real number from a working mission budget. How many can you get?",
    blocks: [
      {
        kind: "p",
        text: "Every answer in this quiz is a fact Don Nichols has published on this site: what a Bible costs, what a trunk weighs, where the first trip went, what a patient pays. Each answer tells you where it came from, so you leave knowing more than you came with. Score it, share it, then go find the ones you missed.",
      },
      { kind: "interactive", name: "quiz" },
      { kind: "h2", text: "Where the answers live" },
      {
        kind: "links",
        heading: "Look them up",
        items: [
          { label: "What a mission trip actually costs", href: "/what-a-mission-trip-costs", blurb: "Every price on the budget." },
          { label: "Behind every mission trip", href: "/behind-the-mission", blurb: "Trunks, kits, inventory sheets." },
          { label: "Every trip since 2013", href: "/trips", blurb: "Don's own timeline." },
          { label: "Frequently asked questions", href: "/faq", blurb: "Straight answers." },
        ],
      },
      {
        kind: "give",
        heading: "Now that you know the prices",
        text: "Every question above is a thing somebody can buy. Pick one and it gets carried to Belize and handed to a person, free.",
      },
    ],
    faqs: [
      {
        q: "Are the quiz answers real?",
        a: "Yes. Every answer is a fact Don Nichols has published on this site — his budget, his trip timeline, his description of the trunks and kits — and each answer shows its source.",
      },
      {
        q: "Can I use this quiz at church?",
        a: "Yes. Put it on a screen for a missions Sunday or send the link to a small group; it works on any phone and nothing is stored.",
      },
      {
        q: "Will there be more quizzes?",
        a: "Leave your name and email at the end of the quiz and you will get the next one, along with Don's stories from the field.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "mission-trip-planning-checklist",
    title: "The 90-Day Mission Trip Checklist (Tick It Off, Print It)",
    eyebrow: "Planning",
    description: "From ninety days out to the week you get home: a mission trip planning checklist you can tick off in your browser and print, built around how the Nichols team actually packs, inventories and clears customs.",
    keywords: [
      "mission trip checklist",
      "mission trip planning timeline",
      "how to plan a medical mission trip",
      "90 day mission trip plan",
      "mission trip preparation",
      "mission team leader checklist",
    ],
    hero: "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z",
    datePublished: "2026-09-12",
    shareText: "A 90-day mission trip checklist you can tick off and print, built around how a working medical team packs and clears customs.",
    blocks: [
      {
        kind: "quote",
        text: behind.paragraphs[0],
        from: "Don Nichols, Behind Every Mission Trip",
      },
      {
        kind: "p",
        text: "The preparation is the trip. Hundreds of items purchased, sorted, inventoried, labelled, translated, packed, weighed and documented before the first patient walks in. This checklist lays that out over ninety days. The items marked with a gold diamond are how the Nichols team actually does it, from Don's own description; the rest is general planning guidance from the site.",
      },
      {
        kind: "general",
        paragraphs: [
          "The dates are a starting point, not a rule. A team that has done this before compresses it; a first-time team should give itself more room, especially for support-raising and for buying supplies in bulk. Tick items off as you go — progress is saved in your browser — and print the whole thing for the team meeting.",
        ],
      },
      { kind: "interactive", name: "checklist" },
      { kind: "h2", text: "The three documents every trunk carries" },
      {
        kind: "list",
        items: [
          "A numbered identification and the owner's information.",
          "A full inventory sheet — item by item, never \"medical supplies\" — with a Spanish translation.",
          "A customs explanation stating that everything was donated, nothing is for sale, and all of it is given free.",
        ],
      },
      { kind: "quote", text: behind.highlightQuote, from: behind.highlightNote.replace(/^— /, "") },
      {
        kind: "join",
        heading: "Planning a trip? Get the next tool first",
        text: "New guides, printables and checklist updates as they are published, plus a text when the Nichols team lands and when they get home.",
        interest: "planning",
        source: "article_checklist",
      },
      {
        kind: "links",
        heading: "Tools for the list",
        items: [
          { label: "Trunk inventory sheet", href: "/tools/trunk-inventory-sheet", blurb: "Printable, with the declaration." },
          { label: "Budget calculator", href: "/tools/mission-trip-budget-calculator", blurb: "Price the trip from real numbers." },
          { label: "Support letter generator", href: "/tools/support-letter", blurb: "Your first draft in five minutes." },
          { label: "Hygiene kit party planner", href: "/tools/hygiene-kit-party", blurb: "Shopping list for any number of kits." },
        ],
      },
    ],
    faqs: [
      {
        q: "How far in advance should you plan a mission trip?",
        a: "Don's own record says the preparation takes months. This checklist starts ninety days out; a first-time team should allow more, mainly for raising support and buying supplies in bulk.",
      },
      {
        q: "What paperwork does a mission trunk need for customs?",
        a: "Numbered identification, owner information, an item-by-item inventory sheet, a Spanish translation, and a customs explanation stating that nothing is for sale and everything is given free.",
      },
      {
        q: "Is my checklist progress saved?",
        a: "In your browser only. Nothing is sent anywhere. Print it for the team, and use Reset to start over.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "mission-trip-fundraising-ideas",
    title: "Mission Trip Fundraising Ideas That Actually Work (With a Goal Calculator)",
    eyebrow: "Fundraising",
    description: `Seven ways churches and families raise money for a mission trip, a calculator that turns any of them into a number of jars, plates or shirts, and the real goal to aim at: ${usd(missionaryCost.total)} per missionary.`,
    keywords: [
      "mission trip fundraising ideas",
      "how to raise money for a mission trip",
      "church fundraiser ideas",
      "fundraising for missions",
      "mission trip fundraiser",
      "youth mission trip fundraising",
    ],
    hero: "1whTYhZyf5tZ--MtRq4Fkq59TwwVXlF_b",
    datePublished: "2026-09-12",
    shareText: "Mission trip fundraising ideas with a calculator that tells you exactly how many jars, plates or shirts it takes to hit the goal.",
    blocks: [
      {
        kind: "p",
        text: `Every member of the Nichols team raises about ${usd(missionaryCost.total)} to go — ${usd(800)} of airfare and ${usd(400)} of lodging, meals and ground transport. That number is the point of this page. A fundraiser without a specific goal is a bake sale; a fundraiser with one is a plan.`,
      },
      { kind: "h2", text: "The one that has worked for years" },
      {
        kind: "p",
        text: "Patti Nichols runs what the family calls her Money Ministry: she cans salsa at her own kitchen counter and sells it, jar by jar, and every dollar goes to the mission field. It works because it is specific, repeatable, and the person buying knows exactly where the money goes.",
      },
      { kind: "h2", text: "Six more, with the math built in" },
      {
        kind: "general",
        paragraphs: [
          "These are the site's suggestions, not Don's words. Each one is a preset in the calculator below; the price and cost fields are yours to change.",
        ],
      },
      {
        kind: "list",
        items: [
          "A church dinner where the plate price and the trip goal are both printed on the ticket.",
          "A bake sale with the real budget taped to the table: this many cookies is one Bible.",
          "T-shirts with the trip on the front and the supply list on the back.",
          "A car wash run by the team that is going, so donors meet the people they are sending.",
          "A yard sale of donated items, priced to move, with the goal thermometer on a sign.",
          "A support letter — still the one that raises the most. The generator on this site writes the first draft.",
        ],
      },
      { kind: "interactive", name: "fundraiser" },
      { kind: "h2", text: "Say the number out loud" },
      {
        kind: "quote",
        text: "Some supporters are able to sponsor an entire missionary. Others choose to purchase Bibles, reading glasses, hygiene kits, ministry trunks, or help transport supplies into Belize. No matter the size of your gift, every donation becomes part of a ministry that is changing lives both physically and spiritually.",
        from: "Don Nichols, Join Us in Changing Lives",
      },
      {
        kind: "p",
        text: `Whatever you run, print the real numbers next to it. People give more to a Bible at ${price("bible")} than to "mission trip expenses." The cost page on this site is free to print and hand out.`,
      },
      {
        kind: "join",
        heading: "Raising money for a trip? Get the next tool",
        text: "Leave your name and number for new fundraising tools and templates as they come, and a text when the Nichols team lands.",
        interest: "fundraising",
        source: "article_fundraising",
      },
      {
        kind: "links",
        heading: "Tools for raising it",
        items: [
          { label: "Support letter generator", href: "/tools/support-letter", blurb: "Eight questions, one page." },
          { label: "Church poster with a QR code", href: "/tools/church-poster", blurb: "For the lobby and the bulletin." },
          { label: "\"I gave\" share card", href: "/tools/share-card", blurb: "So the next person gives too." },
          { label: "What a mission trip costs", href: "/what-a-mission-trip-costs", blurb: "Print it and tape it to the table." },
        ],
      },
    ],
    faqs: [
      {
        q: "How much does a person need to raise for a mission trip?",
        a: `On the Nichols team, about ${usd(missionaryCost.total)}: ${usd(800)} airfare and ${usd(400)} for lodging, meals and ground transportation. Supplies are funded separately through the supply drive.`,
      },
      {
        q: "What is the most effective mission trip fundraiser?",
        a: "A specific ask with a real number. The support letter still raises the most; Patti's canned salsa works because every buyer knows exactly where the money goes.",
      },
      {
        q: "How do I use the goal calculator?",
        a: "Pick a preset, set your goal, then enter what you will charge per item and what each costs you. It tells you how many you need to sell and how many that is per helper.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "belize-by-the-numbers",
    title: "Belize by the Numbers: What Is Beyond the Beaches",
    eyebrow: "Why Belize",
    description: "A country of just over 400,000 people, hundreds of rural communities, limited healthcare, and a rich Christian heritage — the Belize Don Nichols describes, in numbers and photographs, and what a free clinic day looks like there.",
    keywords: [
      "Belize facts",
      "Belize population",
      "rural Belize healthcare",
      "Belize villages",
      "Belize Christian churches",
      "medical missions in Belize",
      "Belize mission trip",
    ],
    hero: "159_AtWRZslTni2u-2woyzNjEhxTgWH-7",
    datePublished: "2026-09-12",
    shareText: "Belize beyond the beaches: 400,000 people, hundreds of rural communities, limited healthcare — and what a free clinic day looks like there.",
    blocks: [
      {
        kind: "quote",
        text: "Belize is a beautiful Caribbean nation known for its tropical forests, pristine beaches, and the world's second-largest barrier reef. Yet beyond the tourist destinations are hundreds of rural communities where families face challenges that many of us rarely experience.",
        from: "Don Nichols, Why Belize?",
      },
      {
        kind: "stats",
        items: [
          { value: "400,000+", label: "people call Belize home", note: "in Don's words, \"just over 400,000\"" },
          { value: "≈76", label: "years average life expectancy", note: "as Don records it" },
          { value: "100%", label: "of clinic care given free", note: "$0 charged to any patient, ever" },
        ],
      },
      { kind: "h2", text: "Healthcare, where the road ends" },
      {
        kind: "quote",
        text: "In many villages, access to healthcare is extremely limited. Although Belize has public health clinics, rural communities often struggle with shortages of medical personnel, medications, equipment, and transportation. For many families, receiving medical attention may require traveling long distances, often at a cost they cannot easily afford.",
        from: "Don Nichols, Why Belize?",
      },
      { kind: "photo", id: "1ZwwAFnLVQHPshkFvBI35ksl0vbAUMgKx" },
      { kind: "h2", text: "Work that depends on eyes and hands" },
      {
        kind: "quote",
        text: "Many villages are home to hardworking families whose livelihoods depend on farming, fishing, and manual labor. A simple pair of reading glasses can enable someone to read again, sew clothing, study God's Word, complete paperwork, or continue earning a living.",
        from: "Don Nichols, Why Belize?",
      },
      { kind: "chart", id: "units-per-25" },
      { kind: "h2", text: "A rich Christian heritage, and pastors with little training" },
      {
        kind: "quote",
        text: "Belize has a rich Christian heritage. Christianity remains the largest faith in the country, with churches found throughout the nation. However, many pastors serving in rural villages have had little opportunity for formal biblical or theological education.",
        from: "Don Nichols, Why Belize?",
      },
      {
        kind: "p",
        text: "That is why the budget carries three gift sets for village pastors and their wives — a study Bible and practical household gifts. In Don's words, the mission is not to replace the local church but to strengthen it.",
      },
      {
        kind: "give",
        itemId: "pastor-gift",
        heading: "Encourage a village pastor",
        text: `${price("pastor-gift")} is a study Bible and practical gifts for a pastor and his wife — how the mission keeps preaching after the team flies home.`,
      },
      { kind: "h2", text: "What a clinic day looks like" },
      {
        kind: "p",
        text: "The village church becomes the clinic. Intake at the door, providers seeing whoever comes, a pharmacy dispensing medications, reading glasses fitted at a table laid out with hundreds of pairs, and a conversation at the end of the line with a Spanish New Testament on the bench. Every service, every item and every conversation is free.",
      },
      { kind: "photo", id: "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI" },
      {
        kind: "join",
        heading: "Follow the next trip to Belize",
        text: "Leave your name and number for a text when the team lands and when they get home, and the photographs in between.",
        interest: "belize",
        source: "article_belize",
      },
      {
        kind: "links",
        heading: "Keep going",
        items: [
          { label: "Why Belize? — Don's full page", href: "/belize", blurb: "In his own words." },
          { label: "The Belize album", href: "/albums/belize", blurb: `${albums.find((a) => a.slug === "belize")?.photos.length ?? 0} photographs from June 2026.` },
          { label: "The June 2026 trip", href: "/trips/belize-2026", blurb: "The road back after surgery." },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the population of Belize?",
        a: "Just over 400,000 people, as Don Nichols records it, with an average life expectancy of about 76 years.",
      },
      {
        q: "Why do medical mission teams go to Belize?",
        a: "Beyond the tourist areas are hundreds of rural communities where access to healthcare is extremely limited: shortages of medical personnel, medications, equipment and transportation, and long, costly journeys to reach care.",
      },
      {
        q: "Is Belize a Christian country?",
        a: "In Don's words, Belize has a rich Christian heritage and Christianity remains the largest faith, but many rural pastors have had little opportunity for formal biblical training. The mission works alongside them rather than replacing them.",
      },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
