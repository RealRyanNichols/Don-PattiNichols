import { belize2026Gallery } from "@/lib/photos";

export type Trip = {
  slug: string;
  title: string;
  location: string;
  /** Human-readable date label, e.g. "June 2026". */
  dateLabel: string;
  /** Departure date YYYY-MM-DD — "" until Don announces it. Activates countdowns. */
  startDate: string;
  status: "upcoming" | "completed";
  /** Used as the page's meta description. */
  summary: string;
  /** Body paragraphs. */
  body: string[];
  /** [NEEDED] fundraising goal from Don — null until announced. */
  goalUsd: number | null;
  photos: { src: string; alt: string }[];
};

export const trips: Trip[] = [
  {
    slug: "belize-upcoming",
    title: "Belize Medical Mission Trip",
    location: "Belize",
    dateLabel: "Dates announced soon", // [NEEDED] real dates from Don
    startDate: "",
    status: "upcoming",
    summary:
      "Free medical clinics, pharmacy services, vision care, and personal evangelism in rural Belizean villages — every service and every item completely free to every patient.",
    body: [
      "Our team is preparing to return to Belize to serve rural villages with free medical clinics, pharmacy services, vision care, and personal evangelism.",
      "Every patient who visits our clinic receives compassionate medical care, medications when appropriate, reading glasses, hygiene supplies, and the opportunity to receive a Bible and hear the hope found in Jesus Christ — all completely free of charge.",
      "We also come alongside village pastors: encouraging them, praying with them, and providing quality study Bibles and practical gifts to strengthen the local church.",
    ],
    goalUsd: null,
    photos: [],
  },
  {
    slug: "belize-2026",
    title: "Belize Medical Mission",
    location: "Belize",
    dateLabel: "June 2026",
    startDate: "",
    status: "completed",
    summary:
      "Our team served rural Belizean communities with free medical care, medications, reading glasses, hygiene kits, and the Gospel of Jesus Christ.",
    body: [
      // [NEEDED] full recap, patient numbers, and testimonies from Don
      "Scenes from the field are below. The full recap, patient numbers, and testimonies from this trip are coming soon.",
    ],
    goalUsd: null,
    photos: belize2026Gallery.map((src) => ({
      src,
      alt: "Belize Medical Mission photo",
    })),
  },
];

export function getTrip(slug: string) {
  return trips.find((t) => t.slug === slug);
}
