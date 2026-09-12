import type { Faq, HowToStep } from "@/lib/seo";
import { supplyDrive } from "./supplies";
import { behind } from "./behind";
import { missionaryCost, suppliesBudget, logisticsBudget } from "./support";

/**
 * GUIDES — the pages people search for before they ever search for a name.
 *
 * Nobody types "Don Nichols" into Google until they have heard him speak.
 * They type "what to pack for a medical mission trip", "how to make a hygiene
 * kit", "how to pray for a mission team". Don has thirteen years of
 * first-hand answers to those questions and a published budget almost nobody
 * else publishes. These guides put that in front of the people asking.
 *
 * SOURCING RULE. Every fact about the Nichols mission on these pages comes
 * from content Don has already published on this site: content/behind.ts,
 * content/support.ts, content/supplies.ts, content/mission.ts,
 * content/belize.ts, content/posts.ts and content/history.ts. Where a guide
 * offers general advice that is NOT Don's, it says so in a labelled note.
 * Nothing is invented; if a figure changes in the source file, it changes
 * here.
 */

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** A sentence of Don's, set apart and attributed. */
  quote?: { text: string; from: string };
  /** General advice that is the site's, not Don's — always labelled. */
  general?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  /** Short label above the title. */
  eyebrow: string;
  /** One-sentence promise for search results and share cards. */
  description: string;
  keywordSet: "packing" | "hygiene" | "prayer" | "glasses" | "giving" | "support";
  /** Drive file id of the hero photograph (must have a verified caption). */
  hero: string;
  datePublished: string;
  intro: string[];
  sections: GuideSection[];
  /** Step-by-step guides also emit HowTo structured data. */
  steps?: HowToStep[];
  faqs: Faq[];
  tools: { label: string; href: string; blurb: string }[];
  related: { label: string; href: string }[];
};

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

const item = (id: string) => supplyDrive.items.find((i) => i.id === id)!;

const bible = item("bible");
const kit = item("hygiene-kit");
const glasses = item("reading-glasses");
const trunk = item("trunk");
const baggage = item("baggage");
const missionary = item("missionary");

export const guides: Guide[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "what-to-pack-for-a-medical-mission-trip",
    title: "What to Pack for a Medical Mission Trip: The Trunk System",
    eyebrow: "Packing guide",
    description:
      "How Don Nichols packs a medical mission: fifty-pound trunks, item-by-item inventory sheets, Spanish translations, and customs letters. Real weights, real costs, and a printable inventory sheet.",
    keywordSet: "packing",
    hero: "1EO8Zg0tTRa0MX-dW9Ak1_lLOTG7u95nA",
    datePublished: "2026-09-12",
    intro: [
      "Most packing lists for a mission trip are about your suitcase. This one is about the trunks — because on a medical mission the supplies you carry are the mission, and getting several hundred pounds of donated goods through an airline and a customs office is a ministry in itself.",
      "Everything below is how Don and Patti Nichols actually do it, taken from what Don has published about the preparation behind every trip. Where this page offers general advice that is not his, it says so.",
    ],
    sections: [
      {
        heading: "Start with the trunk, not the suitcase",
        paragraphs: [
          `Everything the mission gives away travels in heavy-duty trunks. Each one costs about ${usd(trunk.unitCost)} and carries roughly fifty pounds of supplies packed to a written inventory. A trunk makes more than one trip.`,
          behind.accountability.paragraphs[2],
        ],
      },
      {
        heading: "What rides in the trunks",
        paragraphs: [behind.trunkContents.intro],
        list: behind.trunkContents.items,
      },
      {
        heading: "Every trunk carries its own paperwork",
        paragraphs: [
          behind.accountability.paragraphs[0],
          behind.accountability.paragraphs[1],
        ],
        quote: {
          text: behind.highlightQuote,
          from: behind.highlightNote.replace(/^— /, ""),
        },
      },
      {
        heading: "Sort before you pack",
        paragraphs: [behind.paragraphs[2]],
      },
      {
        heading: "What it costs to move it",
        paragraphs: [
          logisticsBudget.intro,
          `On Don's published budget, moving the supplies costs ${usd(logisticsBudget.total)}: eight trunks at about ${usd(trunk.unitCost)} each, six additional trunk baggage fees at about ${usd(baggage.unitCost)} each, customs fees of about $75 based on the most recent trip, and a ${usd(250)} emergency contingency fund. That is more than a good deal of the supplies themselves — and it is the line most published budgets leave out.`,
        ],
        list: logisticsBudget.items.map((i) => `${i.label} — ${usd(i.amount)}`),
      },
      {
        heading: "A general timeline for your own team",
        general: [
          "This part is general guidance, not Don's words. Don's own record says the preparation takes months, so plan backwards from departure.",
          "Three to four months out: confirm what the host clinic actually needs, set your supply budget, and start purchasing in bulk. Two months out: assemble kits, sort glasses by prescription, and begin inventory sheets as you pack, not after. One month out: translate every inventory sheet into the local language, prepare a customs explanation, and weigh each trunk. The week of: print two copies of every document — one inside the trunk, one carried by the team.",
          "For your own bag, keep it small: documents, medications you personally need, modest clothing suited to a hot climate, and a copy of every customs document. The trunks are the priority; your suitcase is not.",
        ],
      },
    ],
    steps: [
      {
        name: "Purchase and sort the supplies",
        text: "Months before departure, purchase donated items in bulk and sort them by ministry: clinic supplies, New Testaments, reading glasses sorted by prescription, hygiene kits, Gospel literature, gifts for pastors, children's items, and evangelism materials.",
      },
      {
        name: "Assemble and count everything",
        text: "Assemble hygiene kits one item at a time. Count every Bible, every pair of glasses, every kit. The count is what goes on the inventory sheet.",
      },
      {
        name: "Pack each trunk to about fifty pounds",
        text: "Pack by hand into heavy-duty trunks, each holding around fifty pounds of supplies designated for specific ministries.",
      },
      {
        name: "Number the trunk and add owner information",
        text: "Every trunk carries numbered identification and owner information so it can be matched to its paperwork at check-in and at customs.",
      },
      {
        name: "Write the inventory sheet, item by item",
        text: "List the contents specifically — New Testaments, reading glasses, sewing kits, hygiene supplies — never a vague line like 'medical supplies'. State that nothing is for sale and everything is given free.",
      },
      {
        name: "Translate and add the customs explanation",
        text: "Include a Spanish translation of the inventory and a customs explanation so officials know exactly what is inside and why it is coming.",
      },
      {
        name: "Weigh, check in, and clear customs",
        text: "Weigh each trunk, check it through the airline as baggage, and carry the paperwork through customs to the villages.",
      },
    ],
    faqs: [
      {
        q: "How much does a mission trunk weigh?",
        a: "Around fifty pounds each. On the Nichols' most recent trip the team traveled with nine trunks — nearly 450 pounds of ministry supplies.",
      },
      {
        q: "What paperwork does each trunk need?",
        a: "Numbered identification, owner information, a full item-by-item inventory sheet, a Spanish translation, and a customs explanation stating that nothing is for sale and everything is given free.",
      },
      {
        q: "How much does it cost to fly a trunk of supplies?",
        a: `About ${usd(baggage.unitCost)} per trunk in airline baggage fees, plus about ${usd(trunk.unitCost)} for the trunk itself. Customs fees on the most recent trip were about $75 for the whole team.`,
      },
      {
        q: "Can I sponsor a trunk instead of packing one?",
        a: `Yes. ${usd(trunk.unitCost)} buys a trunk and ${usd(baggage.unitCost)} flies one. Both are on the Fill the Trunks page, and every item inside is handed to someone free of charge.`,
      },
    ],
    tools: [
      {
        label: "Printable trunk inventory sheet",
        href: "/tools/trunk-inventory-sheet",
        blurb: "The item-by-item sheet, with the free-of-charge declaration, ready to print.",
      },
      {
        label: "Mission trip budget calculator",
        href: "/tools/mission-trip-budget-calculator",
        blurb: "Price a whole trip from Don's real unit costs.",
      },
    ],
    related: [
      { label: "Behind every mission trip", href: "/behind-the-mission" },
      { label: "Sponsor a ministry trunk", href: "/sponsor/trunk" },
      { label: "Fly a trunk to Belize", href: "/sponsor/baggage" },
      { label: "What a mission trip costs", href: "/what-a-mission-trip-costs" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "how-to-make-a-hygiene-kit",
    title: `How to Make a Hygiene Kit for a Mission Trip (About ${usd(kit.unitCost)} Each)`,
    eyebrow: "Hygiene kit guide",
    description:
      "What goes in a mission hygiene kit, what it costs, how the Nichols team assembles hundreds of them, and a printable checklist plus a party planner for churches.",
    keywordSet: "hygiene",
    hero: "1wpCC6blQUYgHpOt4qSb71U-NWrxGxw0z",
    datePublished: "2026-09-12",
    intro: [
      `A hygiene kit is the least expensive thing on Don Nichols' mission budget after a pair of reading glasses — about ${usd(kit.unitCost)} — and one of the most-remembered things a family receives. Don's Belize plan calls for ${suppliesBudget.items[0].label.replace(/^\d+ /, "")} at a cost of ${usd(suppliesBudget.items[0].amount)}.`,
      "Here is what goes in one, why it matters, and how to assemble a few hundred of them without losing count.",
    ],
    sections: [
      {
        heading: "What's in a hygiene kit",
        paragraphs: [behind.hygieneKit.paragraphs[0]],
        list: [
          "A towel",
          "A sewing kit",
          "Toothpaste and a toothbrush",
          "A hair tie",
          "Lip balm",
          "A Gospel booklet",
        ],
        general: [
          "Don's story about how a mission trip changes lives also names soap, nail clippers and a comb among the ordinary items in a kit. The exact contents shift with what is donated; the towel, toothbrush, toothpaste and Gospel booklet are the constants.",
        ],
      },
      {
        heading: "Why it matters",
        quote: {
          text: behind.hygieneKit.paragraphs[1],
          from: "Don Nichols, Behind Every Mission Trip",
        },
        paragraphs: [
          "From Don's account of what a trip does: \"What may seem like ordinary items—a toothbrush, toothpaste, soap, lip balm, nail clippers, a comb, and a small towel—can become meaningful gifts to families who have limited access to these everyday necessities. They are practical reminders that someone they have never met cared enough to help.\"",
        ],
      },
      {
        heading: "How the team assembles them",
        paragraphs: [
          "Don's rule is in his own description of the preparation: \"Every hygiene kit is assembled one item at a time.\" Kits are counted, recorded on the trunk inventory sheet, and packed by hand into fifty-pound trunks alongside Bibles, reading glasses and Gospel literature.",
        ],
      },
      {
        heading: "Hosting a kit-assembly day at your church",
        general: [
          "This is general guidance from the site, not Don's words. Kit days work because the job splits cleanly: one table per item, one person sealing bags, one person counting into boxes of twenty-five.",
          "Before you buy anything, contact the mission so the contents match the inventory sheets that travel through customs — a kit that does not match the paperwork creates a problem at the border. Use the party planner below to size the shopping list, then send the finished count so it can go on the sheet.",
        ],
      },
    ],
    steps: [
      {
        name: "Gather the items in bulk",
        text: "Buy or collect towels, sewing kits, toothbrushes, toothpaste, hair ties, lip balm and Gospel booklets in quantity — one of each per kit.",
      },
      {
        name: "Set up one station per item",
        text: "Lay the items out in order along a table so each kit is assembled one item at a time, the way the Nichols team does it.",
      },
      {
        name: "Seal each kit",
        text: "Place the completed set in a bag and seal it so it survives the trunk and the customs inspection intact.",
      },
      {
        name: "Count and record",
        text: "Count finished kits into boxes and record the total for the trunk inventory sheet, which lists contents item by item.",
      },
      {
        name: "Pack into trunks",
        text: "Pack the kits by hand into heavy-duty trunks at about fifty pounds each, ready to be checked through the airline.",
      },
    ],
    faqs: [
      {
        q: "What is in a mission trip hygiene kit?",
        a: "On the Nichols mission: a towel, a sewing kit, toothpaste and a toothbrush, a hair tie, lip balm, and a Gospel booklet. Soap, nail clippers and a comb are sometimes included depending on what is donated.",
      },
      {
        q: "How much does a hygiene kit cost?",
        a: `About ${usd(kit.unitCost)} each on Don's published budget. Three hundred kits for one trip cost ${usd(suppliesBudget.items[0].amount)}.`,
      },
      {
        q: "Can my church make hygiene kits for the mission?",
        a: "Yes — supplies donated by churches, businesses and families are one of the ways people have supported the work. Contact Don and Patti first so the contents match the customs inventory sheets, then use the party planner to size your shopping list.",
      },
      {
        q: "Can I sponsor kits instead of assembling them?",
        a: `Yes. ${usd(kit.unitCost)} sponsors one complete kit on the Fill the Trunks page, and every kit is handed to a family free of charge.`,
      },
    ],
    tools: [
      {
        label: "Hygiene kit checklist & party planner",
        href: "/tools/hygiene-kit-party",
        blurb: "Enter how many kits you want to make; get the shopping list, the cost, and a printable checklist.",
      },
    ],
    related: [
      { label: "Sponsor a hygiene kit", href: "/sponsor/hygiene-kit" },
      { label: "Behind every mission trip", href: "/behind-the-mission" },
      { label: "How a mission trip changes lives", href: "/blog/how-a-mission-trip-changes-lives" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "how-to-pray-for-a-mission-team",
    title: "How to Pray for a Mission Team: A Seven-Day Guide",
    eyebrow: "Prayer guide",
    description:
      "Seven days of prayer for a medical mission team — preparation, travel, the clinic, the vision table, the pastors, the Gospel, and the return home — with Scripture for each day and printable prayer cards.",
    keywordSet: "prayer",
    hero: "1H_UUg6nB7UHwtS5SsUzz5kpiSOfIpfYI",
    datePublished: "2026-09-12",
    intro: [
      "Don Nichols puts prayer beside money, not behind it: \"Just as important as financial support are your prayers.\" This guide walks a week of prayer for a mission team, one day for each stage of a trip, with a verse to pray and the specific things Don has asked people to pray for.",
      "Use it for the Nichols team, or for any team your church sends. Print the cards, set the lock-screen wallpaper, and pray it through.",
    ],
    sections: [
      {
        heading: "What Don asks people to pray for",
        quote: {
          text: "We ask you to pray for the safety of our team, for wisdom as medical decisions are made, for strength and encouragement for the pastors who faithfully serve their communities throughout the year, and most importantly, that every person we meet will experience the love of Christ and respond to the truth of the Gospel.",
          from: "Don Nichols, Join Us in Changing Lives",
        },
        paragraphs: [
          "Four requests: safety, wisdom, strength for the pastors, and salvation. Every day below points at one of them.",
        ],
      },
      {
        heading: "The seven days",
        paragraphs: [
          "The full guide — a focus, a verse, and prayer points for each day — is laid out below and on the printable cards. Day one is the months of preparation; day seven is the team coming home and the work that keeps going after they leave.",
        ],
      },
      {
        heading: "How to use this with a church",
        general: [
          "General guidance from the site: hand out the cards the Sunday before a team leaves, assign one day to each small group, or read one day aloud at the start of each midweek service while the team is on the ground. Don and Patti's list sends a text when the team lands and when they get home; join it and pray on the same schedule.",
        ],
      },
    ],
    faqs: [
      {
        q: "What should I pray for a mission team?",
        a: "Don Nichols asks for four things: the safety of the team, wisdom as medical decisions are made, strength and encouragement for the local pastors, and that every person the team meets will experience the love of Christ and respond to the Gospel.",
      },
      {
        q: "How long is this prayer guide?",
        a: "Seven days — one for each stage of a trip, from preparation to the return home. Each day has a verse and three or four specific prayer points.",
      },
      {
        q: "Can I print it?",
        a: "Yes. The prayer cards tool prints all seven days on a single sheet, and there are phone wallpapers for each day's verse.",
      },
    ],
    tools: [
      {
        label: "Printable prayer cards",
        href: "/tools/prayer-cards",
        blurb: "All seven days on one printable sheet.",
      },
      {
        label: "Scripture wallpapers",
        href: "/tools/wallpapers",
        blurb: "Lock-screen wallpapers with each day's verse.",
      },
    ],
    related: [
      { label: "Send a prayer request", href: "/contact" },
      { label: "Follow the mission by email and text", href: "/members" },
      { label: "Join us in changing lives", href: "/give" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "reading-glasses-mission-ministry",
    title: `Reading Glasses on the Mission Field: The ${usd(glasses.unitCost)} Gift`,
    eyebrow: "Vision ministry",
    description:
      "Why a sixty-cent pair of reading glasses is the cheapest line on a medical mission budget and often the one that changes a person's day the most — how the vision table works and how to sponsor it.",
    keywordSet: "glasses",
    hero: "1jWP34WzUkI2eLQ7qNpi1wuypCVFUE1ej",
    datePublished: "2026-09-12",
    intro: [
      `${usd(glasses.unitCost)}. That is what a pair of reading glasses costs on Don Nichols' published mission budget — ${suppliesBudget.items[3].label} come to ${usd(suppliesBudget.items[3].amount)}. It is the cheapest thing the team hands anyone, and Don keeps coming back to it when he explains what a trip does.`,
    ],
    sections: [
      {
        heading: "What a pair of glasses does",
        quote: {
          text: "A simple pair of reading glasses can enable someone to read again, sew clothing, study God's Word, complete paperwork, or continue earning a living.",
          from: "Don Nichols, Why Belize?",
        },
        paragraphs: [
          "From Don's account of a clinic day: \"One of the most rewarding moments comes when someone who has struggled to read for years puts on a pair of reading glasses and suddenly sees clearly again. Many smile, laugh, or even shed tears as they read their Bible, complete a form, thread a sewing needle, or simply recognize the faces of loved ones more clearly. These simple moments remind us that even the smallest gifts can have a lasting impact.\"",
        ],
      },
      {
        heading: "How the vision table works",
        paragraphs: [
          "Before the trip, every pair is sorted by prescription and packed to the trunk inventory. On a clinic day the glasses are laid out in rows on a table. Volunteers assist with vision testing; a person holds a page of printed text at the distance that works for them, and the pair that matches goes home with them — free, like everything else on the table.",
        ],
      },
      {
        heading: "Why the numbers are this small",
        paragraphs: [
          `Glasses are bought in bulk. Nobody takes a cut, nobody is paid, and the team carries them in personally rather than shipping. When someone sponsors ten pairs for ${usd(glasses.unitCost * 10)}, ten pairs arrive in Belize.`,
        ],
      },
      {
        heading: "Sunglasses, too",
        paragraphs: [
          `The budget also carries ${suppliesBudget.items[4].label} at ${usd(suppliesBudget.items[4].amount)} — about a dollar a pair. For people who work outdoors all day near the equator, sunglasses are eye protection most families never buy for themselves.`,
        ],
      },
    ],
    faqs: [
      {
        q: "How much do reading glasses cost for a mission trip?",
        a: `About ${usd(glasses.unitCost)} a pair bought in bulk. Three hundred pairs cost ${usd(suppliesBudget.items[3].amount)} on Don's published budget.`,
      },
      {
        q: "How are glasses fitted at a mission clinic?",
        a: "Pairs are sorted by prescription before the trip. At the clinic a person reads a printed page at the distance that works for them, and the matching pair goes home with them free of charge.",
      },
      {
        q: "Can I donate reading glasses instead of money?",
        a: "Reading glasses donated by churches, businesses and families have supported the work. Contact Don and Patti first so donated pairs can be sorted by prescription and listed on the customs inventory.",
      },
      {
        q: "Does anyone pay for glasses at the clinic?",
        a: "No. Every pair, like every medication, hygiene kit and Bible, is given completely free of charge.",
      },
    ],
    tools: [
      {
        label: "Sponsor reading glasses",
        href: "/sponsor/reading-glasses",
        blurb: `${usd(glasses.unitCost)} a pair, any quantity, straight to PayPal.`,
      },
      {
        label: "\"I gave\" share card",
        href: "/tools/share-card",
        blurb: "Make a picture for Facebook that says what you sent.",
      },
    ],
    related: [
      { label: "Why Belize?", href: "/belize" },
      { label: "The Belize album", href: "/albums/belize" },
      { label: "What a mission trip costs", href: "/what-a-mission-trip-costs" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "how-to-sponsor-a-missionary",
    title: `How to Sponsor a Missionary: What ${usd(missionary.unitCost)} Covers`,
    eyebrow: "Giving guide",
    description:
      "Sponsoring a missionary on the Nichols medical team costs $1,200 — $800 airfare and $400 lodging, meals and ground transport. Nobody is paid. Here is exactly what the money does and how to give it.",
    keywordSet: "giving",
    hero: "1RJ0lERx8MG_t60w_OBGpumkdrxLKfX8I",
    datePublished: "2026-09-12",
    intro: [
      `Every member of the Nichols mission team is an unpaid volunteer who raises about ${usd(missionary.unitCost)} to go. Sponsoring one of them is the single largest gift on the budget and the most direct: it puts a physician, a nurse, a pharmacist or an evangelism volunteer in a Belize village for a week.`,
    ],
    sections: [
      {
        heading: "The breakdown",
        quote: { text: missionaryCost.note, from: "Don Nichols" },
        list: missionaryCost.breakdown.map((b) => `${b.label} — ${usd(b.amount)}`),
      },
      {
        heading: "Who is on the team",
        paragraphs: [
          "From Don's mission statement: \"Each mission team is made up of experienced physicians, nurse practitioners, physician assistants, nurses, pharmacists, pharmacy technicians, and dedicated volunteers who have served on medical mission trips throughout South America, the Caribbean, Africa, and Europe. Alongside our medical professionals, an experienced evangelism team shares the message of Jesus Christ, prays with families, distributes Bibles, and encourages local pastors and churches.\"",
        ],
      },
      {
        heading: "What the sponsorship does not cover",
        paragraphs: [
          `The supplies a missionary hands out are funded separately through the ${usd(supplyDrive.goalUsd)} supply drive — Bibles at ${usd(bible.unitCost)}, hygiene kits at ${usd(kit.unitCost)}, reading glasses at ${usd(glasses.unitCost)}. Team members raise their own support; the supply drive funds what gets given away.`,
        ],
      },
      {
        heading: "Ways to give it",
        paragraphs: [
          `Sponsor a missionary in full for ${usd(missionary.unitCost)}, or in part — a monthly gift of ${usd(100)} covers a full sponsorship over a year. Every gift goes through PayPal with the item name filled in, so Don's records show exactly what it was for.`,
        ],
        general: [
          "Don's words on partial gifts: \"Some supporters are able to sponsor an entire missionary. Others choose to purchase Bibles, reading glasses, hygiene kits, ministry trunks, or help transport supplies into Belize. No matter the size of your gift, every donation becomes part of a ministry that is changing lives both physically and spiritually.\"",
        ],
      },
    ],
    faqs: [
      {
        q: "How much does it cost to sponsor a missionary?",
        a: `${usd(missionary.unitCost)} on the Nichols team: ${usd(800)} for round-trip airfare and ${usd(400)} for lodging, meals and ground transportation in Belize.`,
      },
      {
        q: "Are the missionaries paid?",
        a: "No. In Don's words, every member of the team serves as an unpaid volunteer; no one receives a salary or financial compensation for participating.",
      },
      {
        q: "Does the sponsorship include the supplies they hand out?",
        a: `No. Supplies are funded through the separate ${usd(supplyDrive.goalUsd)} supply drive. A sponsorship gets one person to the field and keeps them there for the week.`,
      },
      {
        q: "Can I give monthly toward a missionary?",
        a: "Yes. Every PayPal link offers a monthly option at checkout. About $100 a month covers one full sponsorship over a year.",
      },
    ],
    tools: [
      {
        label: "Sponsor a missionary",
        href: "/sponsor/missionary",
        blurb: `${usd(missionary.unitCost)}, one-time or monthly.`,
      },
      {
        label: "Mission trip budget calculator",
        href: "/tools/mission-trip-budget-calculator",
        blurb: "See what a whole team costs from Don's real numbers.",
      },
    ],
    related: [
      { label: "Give to the mission", href: "/give" },
      { label: "Open Book — where the money goes", href: "/transparency" },
      { label: "Our mission", href: "/mission" },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "mission-trip-support-letter",
    title: "How to Write a Mission Trip Support Letter (Free Generator)",
    eyebrow: "Fundraising guide",
    description:
      "A support letter that gets answered names a place, a date, a specific job, a specific dollar amount and a way to give. Here is the structure, a worked example using real mission numbers, and a generator that writes your first draft.",
    keywordSet: "support",
    hero: "1B8apaW2hx5UTMxmJ2VJ8Mp3SRpevs4Sd",
    datePublished: "2026-09-12",
    intro: [
      `Every member of Don Nichols' team raises about ${usd(missionary.unitCost)} to go. That money is raised the same way it has been raised for generations: a letter to the people who know you. This guide is the site's own — not a letter Don wrote — but the numbers in the example are his, and specificity is what makes a support letter work.`,
    ],
    sections: [
      {
        heading: "What a good support letter contains",
        general: [
          "General guidance from the site. A support letter that gets answered does six things, in order: says who you are and why you are going; names the place and the dates; describes the actual work in one concrete paragraph; asks for a specific amount with a specific deadline; tells the reader exactly how to give; and asks for prayer with two or three specific requests. Then it thanks them, whether or not they give.",
        ],
      },
      {
        heading: "Be specific about the money",
        paragraphs: [
          `Vague asks get vague answers. "Any amount helps" is true and useless. Compare it with Don's published breakdown: ${usd(missionary.unitCost)} sends one missionary — ${usd(800)} of it is airfare and ${usd(400)} is a week of lodging, meals and ground transport. A reader who knows that ${usd(bible.unitCost)} is a Bible and ${usd(kit.unitCost)} is a hygiene kit can picture what their gift becomes.`,
        ],
      },
      {
        heading: "Be specific about the work",
        paragraphs: [
          "Don's description of a clinic day is the standard to aim for: \"Once we arrive, our work begins early each morning and often continues until the last patient has been seen. Medical providers evaluate illnesses and injuries, pharmacists carefully dispense medications, and volunteers assist with patient flow, registration, vision testing, reading glasses, and hygiene kit distribution.\" One paragraph, no adjectives doing the work of facts.",
        ],
      },
      {
        heading: "Ask for prayer as seriously as money",
        paragraphs: [
          "Don puts it plainly: \"Just as important as financial support are your prayers.\" Name two or three things — safe travel, wisdom for the medical team, the pastors you will serve alongside — and give people a way to hear back from you after the trip.",
        ],
      },
      {
        heading: "Use the generator, then make it yours",
        general: [
          "The generator below writes a first draft from your answers. Read it aloud once, cut anything you would not say to the person's face, and send it by mail if you can — a letter in an envelope still gets opened.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long should a mission trip support letter be?",
        a: "One page. Who you are, where and when, what you will do, a specific ask with a deadline, how to give, and two or three prayer requests.",
      },
      {
        q: "How much should I ask for?",
        a: `Name the real number. On the Nichols team a missionary raises about ${usd(missionary.unitCost)} — ${usd(800)} airfare and ${usd(400)} lodging — and readers respond better to a breakdown than to a round figure.`,
      },
      {
        q: "Should I ask for prayer in a support letter?",
        a: "Yes. Don Nichols treats prayer as just as important as financial support. Ask for specific things and tell people how they will hear back.",
      },
      {
        q: "Is the generator free?",
        a: "Yes. It runs in your browser, saves nothing, and you can copy or download the letter as a text file.",
      },
    ],
    tools: [
      {
        label: "Support letter generator",
        href: "/tools/support-letter",
        blurb: "Answer eight questions; get a one-page draft to copy or download.",
      },
    ],
    related: [
      { label: "What a mission trip costs", href: "/what-a-mission-trip-costs" },
      { label: "How to sponsor a missionary", href: "/guides/how-to-sponsor-a-missionary" },
      { label: "For churches", href: "/churches" },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
