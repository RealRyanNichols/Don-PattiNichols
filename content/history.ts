/**
 * MISSION HISTORY — Don Nichols' own record.
 *
 * SOURCE: the "Mission Trip Timeline" document Don wrote and placed in the
 * Google Drive archive (Pictures/Mission History, July 2026). Every year,
 * location, ministry focus, and team member below is transcribed from that
 * document exactly. Do NOT add trips, guess months, or embellish focus areas.
 * If a trip is missing, ask Don — do not infer it from photos.
 */

export type TripRecord = {
  /** Display label exactly as Don wrote it (e.g. "July 2013", "2020"). */
  when: string;
  /** Sort key — the year the entry belongs to. */
  year: number;
  /** Location, or null for a year with no trips. */
  location: string | null;
  focus: string;
  team: string | null;
  /** Slug of the trip page this row links to, when one exists. */
  tripSlug?: string;
  /** True for the years Don recorded with no trips (COVID, surgery). */
  gap?: boolean;
};

export const missionTimeline: TripRecord[] = [
  {
    when: "July 2013",
    year: 2013,
    location: "Malawi",
    focus: "Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "July 2014",
    year: 2014,
    location: "Malawi",
    focus: "Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "July 2015",
    year: 2015,
    location: "Malawi, Mozambique & Zambia",
    focus: "Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "July 2016",
    year: 2016,
    location: "Malawi",
    focus: "Medical & Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "February 2017",
    year: 2017,
    location: "Dominican Republic",
    focus: "Logistics Support",
    team: "Donald Nichols",
    tripSlug: "dominican-republic",
  },
  {
    when: "May 2017",
    year: 2017,
    location: "Malawi",
    focus: "Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "August 2018",
    year: 2018,
    location: "Malawi",
    focus: "Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "June 2019",
    year: 2019,
    location: "Malawi",
    focus: "Evangelism",
    team: "Donald & Patti Nichols",
    tripSlug: "malawi",
  },
  {
    when: "October 2019",
    year: 2019,
    location: "Malawi",
    focus: "Evangelism",
    team: "Donald Nichols",
    tripSlug: "malawi",
  },
  {
    when: "2020",
    year: 2020,
    location: null,
    focus: "No mission trips due to COVID-19 international travel restrictions.",
    team: null,
    gap: true,
  },
  {
    when: "June 2021",
    year: 2021,
    location: "Dominican Republic",
    focus: "Medical & Evangelism",
    team: "Donald & Patti Nichols",
    tripSlug: "dominican-republic",
  },
  {
    when: "June 2022",
    year: 2022,
    location: "Dominican Republic",
    focus: "Medical & Evangelism",
    team: "Donald & Patti Nichols",
    tripSlug: "dominican-republic",
  },
  {
    when: "June 2023",
    year: 2023,
    location: "Dominican Republic",
    focus: "Medical & Evangelism",
    team: "Donald & Patti Nichols",
    tripSlug: "dominican-republic",
  },
  {
    when: "2024",
    year: 2024,
    location: null,
    focus: "No mission trips due to Donald's open-heart surgery and recovery.",
    team: null,
    gap: true,
  },
  {
    when: "2025",
    year: 2025,
    location: null,
    focus: "Continued recovery from surgery. No mission trips.",
    team: null,
    gap: true,
  },
  {
    when: "June 2026",
    year: 2026,
    location: "Belize",
    focus: "Medical & Evangelism",
    team: "Donald & Patti Nichols",
    tripSlug: "belize-2026",
  },
];

/** Don's list, in his order. */
export const countriesServed = [
  "Belize",
  "Dominican Republic",
  "Malawi",
  "Mozambique",
  "Zambia",
];

/** Don's words, verbatim. */
export const ministryExperienceIntro = "Our ministry has included:";

export const ministryExperience = [
  "Evangelistic crusades and village outreach",
  "Medical clinics",
  "Prayer and discipleship",
  "Logistics and mission support",
  "Partnership with local churches and pastors",
  "Distribution of Bibles, Gospel literature, reading glasses, hygiene supplies, and other humanitarian aid",
];

/** Don's closing line, verbatim. */
export const ministryCommitment =
  "We remain committed to taking the Gospel to underserved communities while demonstrating Christ's love through compassionate medical care and practical assistance.";

/** Derived, not invented — counts come straight from the timeline above. */
export const historyStats = {
  firstYear: 2013,
  tripCount: missionTimeline.filter((t) => !t.gap).length,
  countryCount: countriesServed.length,
  yearSpan: `${2013}–${new Date().getFullYear() >= 2026 ? 2026 : 2026}`,
};
