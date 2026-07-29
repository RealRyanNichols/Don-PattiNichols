import { mission } from "./mission";
import { whyBelize } from "./belize";
import type { Author } from "./people";

/**
 * BLOG POSTS — add a new object to publish. Newest date shows first.
 * Phase 2 moves these into Supabase with an admin page for Don & Patti.
 */

export type Post = {
  slug: string;
  title: string;
  author: Author;
  date: string; // ISO: "2026-07-09"
  category: "Mission Updates" | "Preaching & Teaching" | "Belize" | "Family & Faith";
  excerpt: string;
  paragraphs: string[];
};

export const posts: Post[] = [
  {
    slug: "how-a-mission-trip-changes-lives",
    title: "How a Mission Trip Changes Lives",
    author: "don",
    date: "2026-07-09",
    category: "Mission Updates",
    excerpt:
      "A mission trip is far more than a week of travel. It is months of prayer, preparation, planning, fundraising, and trusting God to open doors that only He can open.",
    paragraphs: [
      "A mission trip is far more than a week of travel. It is months of prayer, preparation, planning, fundraising, purchasing supplies, packing equipment, and trusting God to open doors that only He can open.",
      "Long before our team boards an airplane, hundreds of Bibles, hygiene kits, reading glasses, medications, and ministry supplies have already been purchased, sorted, packed into heavy-duty trunks, weighed, transported through airports, cleared through international customs, and delivered to remote villages throughout Belize.",
      "Once we arrive, our work begins early each morning and often continues until the last patient has been seen. Medical providers evaluate illnesses and injuries, pharmacists carefully dispense medications, and volunteers assist with patient flow, registration, vision testing, reading glasses, and hygiene kit distribution. Every person is treated with dignity, compassion, and respect.",
      "While physical needs are being addressed, our evangelism team ministers to the spiritual needs of every individual who desires prayer, encouragement, or a deeper understanding of the Gospel. Bibles and Gospel literature are distributed freely, conversations are shared, prayers are offered, and relationships are built. We believe that caring for the whole person means ministering to both body and soul.",
      "One of the most rewarding moments comes when someone who has struggled to read for years puts on a pair of reading glasses and suddenly sees clearly again. Many smile, laugh, or even shed tears as they read their Bible, complete a form, thread a sewing needle, or simply recognize the faces of loved ones more clearly. These simple moments remind us that even the smallest gifts can have a lasting impact.",
      "The same is true of a hygiene kit. What may seem like ordinary items—a toothbrush, toothpaste, soap, lip balm, nail clippers, a comb, and a small towel—can become meaningful gifts to families who have limited access to these everyday necessities. They are practical reminders that someone they have never met cared enough to help.",
      "Perhaps the greatest impact, however, is not measured by the number of patients treated, medications distributed, or Bibles given away. It is found in the relationships formed, the prayers shared, the encouragement offered to local pastors, and the lives touched by the love of Jesus Christ.",
      "We do not come to Belize because we believe we have all the answers. We come to serve alongside local churches, encourage village pastors, and use the gifts God has given us to meet needs wherever we can. Our prayer is that every act of kindness points people to Christ and strengthens the work that God is already doing through His people in Belize.",
      "When the clinic closes and the team returns home, the mission does not end. The Bibles remain in the homes of families. The reading glasses continue helping people work, read, and study God's Word. The hygiene supplies continue serving daily needs. Local pastors continue ministering to their congregations. And the relationships built during that week continue through prayer, encouragement, and future visits.",
      "This is why every donation matters. Every gift becomes part of a much larger story—a story of compassion, service, partnership, and faith. Together, we are not simply delivering supplies; we are investing in people, strengthening local churches, and sharing the hope of Jesus Christ in ways that can impact lives for years to come.",
    ],
  },
  {
    slug: "our-mission",
    title: "Our Mission",
    author: "don",
    date: "2026-07-08",
    category: "Mission Updates",
    excerpt:
      "Our mission is to share the love of Jesus Christ by meeting both the physical and spiritual needs of the people of Belize.",
    paragraphs: [...mission.paragraphs],
  },
  {
    slug: "why-belize",
    title: "Why Belize?",
    author: "don",
    date: "2026-07-07",
    category: "Belize",
    excerpt:
      "Beyond the tourist destinations are hundreds of rural communities where families face challenges that many of us rarely experience.",
    paragraphs: [...whyBelize.paragraphs],
  },
  {
    slug: "welcome",
    title: "Welcome to Our New Online Home",
    author: "both",
    date: "2026-07-06",
    category: "Family & Faith",
    excerpt:
      "For years we have shared our mission work face to face, church by church. Now there is one place to follow it all.",
    paragraphs: [
      "For years we have shared our mission work the same way — face to face, church by church, one conversation at a time. We are grateful for every congregation and every friend who has listened, prayed, and given.",
      "This website is the new home for all of it. Here you can read about our mission and why we serve in Belize, follow upcoming trips, see what God did on past ones, and partner with us through prayer and giving.",
      "We will both be writing here — updates from the field, lessons from the Word, and stories from the work God has put in front of us.",
      "Thank you for standing with us. We hope you will subscribe, follow along, and pray for the people of Belize with us.",
    ],
  },
];

export const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
export function postsByAuthor(author: Author) {
  return sortedPosts.filter((p) => p.author === author || p.author === "both");
}
