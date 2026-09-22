import type { Faq } from "@/lib/seo";
import { supplyDrive } from "./supplies";
import { missionaryCost } from "./support";
import { historyStats, countriesServed } from "./history";
import { totalPhotos } from "./albums";
import { malawiCampaign, campaignNeed } from "./campaigns";

const well = campaignNeed("well");
const wop = malawiCampaign.recipient.lines.join(", ");

/**
 * FREQUENTLY ASKED QUESTIONS — one page that answers what people ask before
 * they give, go, or invite Don to speak.
 *
 * Every answer is drawn from something Don has published on this site or from
 * his own trip timeline. Where a detail is not yet public (the 501(c)(3), a
 * next trip date) the answer says so rather than guessing.
 */

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

const price = (id: string) => usd(supplyDrive.items.find((i) => i.id === id)!.unitCost);

export type FaqGroup = { title: string; faqs: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "The mission",
    faqs: [
      {
        q: "What do Don and Patti Nichols do?",
        a: "In Don's words: \"Our mission is to share the love of Jesus Christ by meeting both the physical and spiritual needs of the people of Belize. Through free medical clinics, pharmacy services, vision care, and personal evangelism, our team strives to bring hope, healing, and the Gospel to villages where healthcare and Christian resources are often limited.\"",
      },
      {
        q: "Why Belize?",
        a: "Beyond the tourist destinations are hundreds of rural communities where access to healthcare is extremely limited and where many village pastors have had little opportunity for formal biblical training. The team goes to serve those communities and to strengthen — not replace — the local church.",
      },
      {
        q: "Is the medical care really free?",
        a: "Yes. Every patient receives medical evaluation, medications when appropriate, reading glasses, hygiene supplies, Bibles, Gospel literature and prayer at absolutely no cost. In Don's words, \"the love of Christ should never have a price tag.\"",
      },
      {
        q: "Who is on the team?",
        a: "Experienced physicians, nurse practitioners, physician assistants, nurses, pharmacists, pharmacy technicians and volunteers who have served on medical mission trips throughout South America, the Caribbean, Africa and Europe, alongside an evangelism team that shares Christ, prays with families, distributes Bibles and encourages local pastors.",
      },
      {
        q: "How long have they been doing this?",
        a: `Since ${historyStats.firstYear}. Don's own timeline records ${historyStats.tripCount} mission trips across ${countriesServed.length} countries — ${countriesServed.join(", ")} — including the June 2026 return to the field after his open-heart surgery.`,
      },
      {
        q: "When is the next trip?",
        a: "The next trip has not been announced yet. When Don sets the date, the homepage countdown and the fundraising goal turn on automatically, and everyone on the email list hears first.",
      },
    ],
  },
  {
    title: "Giving",
    faqs: [
      {
        q: "How much does a medical mission trip cost?",
        a: `On Don's published budget, ${usd(missionaryCost.total)} sends one missionary (${usd(800)} airfare and ${usd(400)} lodging, meals and ground transport) and the supply drive for a trip is ${usd(supplyDrive.goalUsd)}. A Bible is ${price("bible")}, a hygiene kit ${price("hygiene-kit")}, a pair of reading glasses ${price("reading-glasses")}, and it costs ${price("baggage")} to fly one fifty-pound trunk of supplies.`,
      },
      {
        q: "How do I give?",
        a: "Through PayPal — card, bank or PayPal balance, no account required — from the Give page or by picking a specific item on the Fill the Trunks page. Every link offers a one-time or monthly option at checkout.",
      },
      {
        q: "Can I choose what my gift buys?",
        a: `Yes. Fill the Trunks lets you sponsor the exact item — ${price("bible")} for a Bible, ${price("hygiene-kit")} for a hygiene kit, ${price("reading-glasses")} for reading glasses, ${price("trunk")} for a trunk, ${price("baggage")} to fly one, ${usd(missionaryCost.total)} to send a missionary.`,
      },
      {
        q: "Is my gift tax-deductible?",
        a: "Details for tax-deductible giving through the mission's sponsoring organization are being finalized and will be posted on the Give page. Until then the site makes no claim about deductibility; please consult your tax advisor.",
      },
      {
        q: "Are Don and Patti paid from the gifts?",
        a: "No. Every member of the team, Don and Patti included, serves as an unpaid volunteer. No one receives a salary or financial compensation, and no percentage is held back for overhead.",
      },
      {
        q: "Where can I see where the money goes?",
        a: "The Open Book page shows recorded gifts and hand-entered expenses in the open, and the cost page lists every line of the budget at the price actually paid.",
      },
      {
        q: "Can I give by check?",
        a: `For the Malawi water well and maize mill, yes: Don has published the address — ${wop} — and asks that the check be marked "${well.checkMemo}". For everything else, mailing instructions will be posted on the Give page; until then, send a message through the contact page and Don and Patti will send them to you directly.`,
      },
      ...(malawiCampaign.active
        ? [
            {
              q: "How can I help fund the Malawi water well?",
              a: `Don is raising ${usd(well.costUsd!)} — his figure from the bid — for a bore hole in a Malawi village, and a maize mill whose fees sponsor a soccer team that shares the Gospel at halftime. Give on the Malawi Water Well page, where the gift is marked for Malawi automatically, or mail a check to Wings of Promise, Inc., which receives the funds. Skipper Sauls of Maplecrest Baptist Church in Vidor, Texas oversees the project.`,
            },
          ]
        : []),
    ],
  },
  {
    title: "Serving and supplies",
    faqs: [
      {
        q: "What is in a hygiene kit?",
        a: "A towel, a sewing kit, toothpaste and a toothbrush, a hair tie, lip balm and a Gospel booklet — about three dollars, and one of the most-remembered gifts a family receives.",
      },
      {
        q: "How do the supplies get to Belize?",
        a: "In heavy-duty trunks, about fifty pounds each, packed by hand to an item-by-item inventory sheet with a Spanish translation and a customs explanation. On the most recent trip the team traveled with nine trunks — nearly 450 pounds of supplies.",
      },
      {
        q: "Can my church collect supplies or make hygiene kits?",
        a: "Yes — supplies donated by churches, businesses and families are one of the ways people have supported the work. Contact Don and Patti first so what you collect matches the customs inventory sheets.",
      },
      {
        q: "Can I go on a trip?",
        a: "Send a message through the contact page. Team members are unpaid volunteers who raise about $1,200 to go; Don can tell you what the next team needs.",
      },
      {
        q: "What is Patti's Money Ministry?",
        a: "Patti cans salsa at her own kitchen counter and sells it jar by jar, and every dollar goes to the mission field. Her photographs are in the archive.",
      },
    ],
  },
  {
    title: "Churches and speaking",
    faqs: [
      {
        q: "Can Don speak at my church?",
        a: "Yes. For years Don and Patti have shared the mission face to face, church by church. Use the contact page and choose \"Invite Don to Speak\"; the For Churches page has a printable poster and bulletin text for the day.",
      },
      {
        q: "How can a church partner with the mission?",
        a: "Sponsor a missionary, fill a trunk, host a hygiene-kit assembly day, pray through the seven-day guide while the team is on the ground, or invite Don to speak. The For Churches page walks through each.",
      },
    ],
  },
  {
    title: "The website",
    faqs: [
      {
        q: "Who took the photographs?",
        a: `Don and Patti themselves, on trips going back to ${historyStats.firstYear}. There are ${totalPhotos} photographs in the archive across ${countriesServed.length} countries. Nothing is staged and nothing is stock.`,
      },
      {
        q: "Who writes the posts?",
        a: "Don and Patti, from their phones, under their own bylines. Not one word is edited or ghostwritten.",
      },
      {
        q: "How do I follow the mission?",
        a: "Join the email list on the homepage or the Mission Partners Hub. You can also ask for a text when the team lands and when they get home, and the site has an RSS feed at /feed.xml.",
      },
    ],
  },
];

export const allFaqs: Faq[] = faqGroups.flatMap((g) => g.faqs);
