/**
 * DON & PATTI — profile data used on /don, /patti, bylines, and JSON-LD.
 * Family recollections are credited to the person who shared them.
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
      "He is Patti's husband and a father whose example made a lasting impression on his son Ryan. In a family conversation, Don recalled answering a question at his ordination with the priorities he has never forgotten: God first, his family second, and the church third.",
      "His memories include a night fishing with his father, teaching the Book of Daniel, and gathering family photographs for a fishing book. Alongside the mission updates, these stories offer a closer look at his life at home, his faith, and the generations of the Nichols family.",
    ],
  },
  patti: {
    slug: "patti",
    name: "Patti Nichols",
    role: "Mission Team Member",
    photo: "/images/patti.jpg", // [NEEDED] drop headshot at public/images/patti.jpg
    bio: [
      "Patti Nichols serves alongside Don in mission work in Belize and in their local community — meeting practical needs and sharing the love of Christ.",
      "To her son Ryan, she is also the mother who made church a steady part of childhood. He credits her example with shaping his faith and remembers her speaking up for their family when Don's work threatened to take more time away from home.",
      "Ryan recalls both parents caring for their own aging parents, helping their community, and showing up for their children. His reflections on Patti tell part of her story as a wife and mother, alongside the ministry she and Don share.",
    ],
  },
} as const;

export function authorNames(a: Author): string {
  if (a === "both") return "Don & Patti Nichols";
  return people[a].name;
}
