/**
 * Per-item detail content for the /sponsor/[id] sales pages.
 *
 * CONTENT RULE: every quote and budget figure below is Don's existing
 * published wording, copied verbatim from the page named in `source`.
 * Never paraphrase, never invent. If an item needs new copy, mark it
 * [NEEDED] and ask Don.
 */

export type SupplyDetail = {
  /** Quote from Don's published writing — exact wording, with its source. */
  quote: {
    paragraphs: string[];
    source: string;
    href: string;
  };
  /** The matching line items from the published trip budget (/give). */
  budget: { label: string; value: string }[];
};

export const supplyDetails: Record<string, SupplyDetail> = {
  bible: {
    quote: {
      paragraphs: [
        "When the clinic closes and the team returns home, the mission does not end. The Bibles remain in the homes of families. The reading glasses continue helping people work, read, and study God's Word. The hygiene supplies continue serving daily needs. Local pastors continue ministering to their congregations. And the relationships built during that week continue through prayer, encouragement, and future visits.",
      ],
      source: "How a Mission Trip Changes Lives",
      href: "/blog/how-a-mission-trip-changes-lives",
    },
    budget: [{ label: "250 Bibles", value: "$625" }],
  },
  "hygiene-kit": {
    quote: {
      paragraphs: [
        "A towel. A sewing kit. Toothpaste and a toothbrush. A hair tie. Lip balm. A Gospel booklet.",
        "It isn't expensive. But to a family with limited access to these everyday items, it is a meaningful gift — a practical reminder that someone they have never met cared enough to help, and an open door to conversation, prayer, and the love of Christ.",
      ],
      source: "Behind the Mission",
      href: "/behind-the-mission",
    },
    budget: [{ label: "300 hygiene kits", value: "$900" }],
  },
  "reading-glasses": {
    quote: {
      paragraphs: [
        "One of the most rewarding moments comes when someone who has struggled to read for years puts on a pair of reading glasses and suddenly sees clearly again. Many smile, laugh, or even shed tears as they read their Bible, complete a form, thread a sewing needle, or simply recognize the faces of loved ones more clearly. These simple moments remind us that even the smallest gifts can have a lasting impact.",
      ],
      source: "How a Mission Trip Changes Lives",
      href: "/blog/how-a-mission-trip-changes-lives",
    },
    budget: [{ label: "300 pairs of reading glasses", value: "$180" }],
  },
  sunglasses: {
    quote: {
      paragraphs: [
        "Many villages are home to hardworking families whose livelihoods depend on farming, fishing, and manual labor.",
      ],
      source: "Why Belize?",
      href: "/belize",
    },
    budget: [{ label: "150 pairs of sunglasses", value: "$150" }],
  },
  tracts: {
    quote: {
      paragraphs: [
        "While physical needs are being addressed, our evangelism team ministers to the spiritual needs of every individual who desires prayer, encouragement, or a deeper understanding of the Gospel. Bibles and Gospel literature are distributed freely, conversations are shared, prayers are offered, and relationships are built. We believe that caring for the whole person means ministering to both body and soul.",
      ],
      source: "How a Mission Trip Changes Lives",
      href: "/blog/how-a-mission-trip-changes-lives",
    },
    budget: [{ label: "Gospel tracts", value: "$60" }],
  },
  "pastor-gift": {
    quote: {
      paragraphs: [
        "Our mission is not to replace the local church but to strengthen it. We work alongside Belizean pastors by encouraging them, praying with them, providing quality study Bibles and practical gifts, and supporting the ministry they faithfully carry out every day.",
      ],
      source: "Why Belize?",
      href: "/belize",
    },
    budget: [{ label: "Special gifts for three pastors and their wives", value: "$300" }],
  },
  trunk: {
    quote: {
      paragraphs: [
        "Every trunk carries numbered identification, owner information, a full inventory sheet, a Spanish translation, and a customs explanation — so officials know exactly what is inside and exactly why it is coming.",
      ],
      source: "Behind the Mission",
      href: "/behind-the-mission",
    },
    budget: [{ label: "Eight heavy-duty ministry trunks (~$25 each)", value: "$200" }],
  },
  baggage: {
    quote: {
      paragraphs: [
        "On our most recent trip, the team traveled with nine trunks, each weighing around fifty pounds — nearly 450 pounds of ministry supplies moving through airports, airline check-in, and Belize customs to reach remote villages.",
      ],
      source: "Behind the Mission",
      href: "/behind-the-mission",
    },
    budget: [{ label: "Six additional trunk baggage fees (~$200 each)", value: "$1,200" }],
  },
  customs: {
    quote: {
      paragraphs: [
        "Transporting these supplies is a ministry in itself. Every item must be purchased, sorted, packed, weighed, checked through the airline, transported internationally, cleared through Belize customs, and delivered to remote villages.",
      ],
      source: "Where the Money Goes",
      href: "/give",
    },
    budget: [
      { label: "Customs fees (based on our most recent trip)", value: "$75" },
      { label: "Emergency contingency fund", value: "$250" },
    ],
  },
  missionary: {
    quote: {
      paragraphs: [
        "Each missionary raises approximately $1,200 to serve on this mission. Every member of our team serves as an unpaid volunteer. No one receives a salary or financial compensation for participating in this ministry.",
      ],
      source: "Where the Money Goes",
      href: "/give",
    },
    budget: [
      { label: "Round-trip airfare", value: "$800" },
      { label: "Lodging, meals, and ground transportation in Belize", value: "$400" },
    ],
  },
};
