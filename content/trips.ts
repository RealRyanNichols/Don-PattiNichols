import { albumBySlug } from "@/content/albums";
import { missionTimeline } from "@/content/history";

/**
 * MISSION TRIPS — the pages behind /trips.
 *
 * The authoritative year-by-year record lives in `content/history.ts` and comes
 * from Don's own Mission Trip Timeline document. This file adds the narrative
 * pages for each field. Anything not in Don's document or visible in his
 * photographs is marked [NEEDED] — never fill those in by guessing.
 */

export type Trip = {
  slug: string;
  title: string;
  location: string;
  /** Display label, e.g. "June 2026" or "Dates announced soon" */
  dateLabel: string;
  /** ISO date for the countdown. Leave empty until dates are confirmed. */
  startDate?: string;
  status: "upcoming" | "completed";
  summary: string;
  /** Fundraising goal in USD. Leave undefined until the number is set. */
  goalUsd?: number;
  /** Amount raised so far — update by hand for now; PayPal-powered in phase 2. */
  raisedUsd?: number;
  body: string[];
  /** Album slug whose photographs illustrate this trip. */
  albumSlug?: string;
  /** Extra album slugs shown as related galleries. */
  relatedAlbums?: string[];
};

export const trips: Trip[] = [
  {
    slug: "belize-2026",
    title: "Belize Medical Mission",
    location: "Belize",
    // Dates come from Don's own trunk inventory sheet: "for Belize June 8-13, 2026".
    dateLabel: "June 8\u201313, 2026",
    status: "completed",
    summary:
      "The first mission trip since 2023 \u2014 and the road back after open-heart surgery. Free medical clinics, reading glasses fitted one face at a time, Bibles given, and baptisms in the sea.",
    body: [
      "This was the trip that ended the longest pause of their ministry. After two years given to open-heart surgery and recovery, Don and Patti returned to the field June 8\u201313, 2026 \u2014 to Belize.",
      "Every patient who came through the clinic received care completely free of charge: medical evaluation, medications where appropriate, reading glasses, hygiene supplies, and the offer of a Bible and the hope found in Jesus Christ.",
      "The photographs below show what those six days looked like \u2014 the glasses laid out on the table, the exams, the team, and believers baptized in the sea.",
      // [NEEDED from Don]: patients seen, villages served, baptisms \u2014 his recap in his words
      // [NEEDED]: the NEXT trip \u2014 when Don announces it, add an upcoming entry here
    ],
    albumSlug: "belize",
  },
  {
    slug: "dominican-republic",
    title: "The Dominican Republic",
    location: "Dominican Republic",
    dateLabel: "2017 · 2021 · 2022 · 2023",
    status: "completed",
    summary:
      "Four trips to the Dominican Republic — beginning with logistics support in 2017 and returning three years running for medical clinics and evangelism.",
    body: [
      "Don first went to the Dominican Republic in February 2017 to run logistics — the unglamorous work of getting supplies where they need to be, on time and through customs.",
      "He and Patti returned together in June 2021, June 2022, and June 2023, each time for medical and evangelistic work. The photographs from those years show what the trips actually look like: trunks stacked and labeled, tables set up in borrowed rooms, pallets of bottled water, New Testaments handed out, and long days seeing whoever walked through the door.",
      // [NEEDED from Don]: patients seen, villages served, the stories behind these photographs
    ],
    albumSlug: "dominican-republic",
  },
  {
    slug: "malawi",
    title: "Malawi",
    location: "Malawi, Mozambique & Zambia",
    dateLabel: "2013 – 2019",
    status: "completed",
    summary:
      "Eight trips over seven years. Village evangelism, medical clinics, water wells, sewing enterprises for widows and orphans, and lasting partnership with Malawian pastors.",
    body: [
      "Malawi is where this began. Don made his first trip in July 2013 and returned nearly every year through 2019 — including July 2015, when the work reached across the border into Mozambique and Zambia. Patti joined him in June 2019.",
      "What grew out of those years is visible in the photographs. Water wells drilled and handed over to villages. Sewing machines, thread, and scissors set up as a working trade for widows and orphans. Bibles and Gospel literature distributed. Crowds gathered under whatever shade there was to hear preaching, with Malawian translators carrying every word the last few feet.",
      "The friendships are the part that does not photograph well: pastors, translators, and craftsmen like Sam Banda — a painter with no hands whose work Don and Patti have carried home for years.",
      // [NEEDED from Don]: village names, the story of the wells, how the widows' enterprise began
    ],
    albumSlug: "malawi",
    relatedAlbums: [
      "water-wells",
      "widows-and-orphans",
      "sam-banda",
      "translators",
      "bible-ministry",
      "witch-doctors",
      "ministry-items",
    ],
  },
];

export const upcomingTrip = trips.find((t) => t.status === "upcoming");
export const pastTrips = trips.filter((t) => t.status === "completed");
export function getTrip(slug: string) {
  return trips.find((t) => t.slug === slug);
}

/** Photographs for a trip page, drawn from its album. */
export function tripPhotos(trip: Trip): string[] {
  const album = trip.albumSlug ? albumBySlug(trip.albumSlug) : undefined;
  return album?.photos ?? [];
}

/** How many recorded trips went to this field, per Don's timeline. */
export function tripCountFor(trip: Trip): number {
  const country = trip.location.split(",")[0].trim();
  return missionTimeline.filter((t) => t.location?.includes(country)).length;
}
