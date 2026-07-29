/**
 * DON & PATTI — profile data used on /don, /patti, bylines, and JSON-LD.
 * Bios are starter text; replace with their full stories when they send them.
 */

export type Author = "don" | "patti" | "both";

export const people = {
  don: {
    slug: "don",
    name: "Don Nichols",
    role: "Preacher & Mission Team Member",
    photo: "/images/don.jpg", // [NEEDED] drop headshot at public/images/don.jpg
    bio: [
      "Don Nichols preaches the Word of God and serves on medical mission teams bringing free clinics, Bibles, and the Gospel of Jesus Christ to rural villages in Belize.",
      // [NEEDED from Don]: preaching background, church, years in ministry, testimony
    ],
  },
  patti: {
    slug: "patti",
    name: "Patti Nichols",
    role: "Mission Team Member",
    photo: "/images/patti.jpg", // [NEEDED] drop headshot at public/images/patti.jpg
    bio: [
      "Patti Nichols serves alongside Don in mission work in Belize and in their local community — meeting practical needs and sharing the love of Christ.",
      // [NEEDED from Patti]: her story, her role on the team, testimony
    ],
  },
} as const;

export function authorNames(a: Author): string {
  if (a === "both") return "Don & Patti Nichols";
  return people[a].name;
}
