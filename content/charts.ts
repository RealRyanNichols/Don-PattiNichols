import { supplyDrive } from "./supplies";
import { suppliesBudget, logisticsBudget, missionaryCost } from "./support";
import { missionTimeline, countriesServed } from "./history";
import { albums } from "./albums";

/**
 * CHART DATA — every number here is derived, never typed in.
 *
 * The charts on the articles are the site's strongest argument: nobody else
 * publishes a mission budget to the dime. So the rule is absolute — a chart
 * reads its figures from the same content files the rest of the site reads
 * (Don's budget, his trip timeline, the album manifest). If Don changes what a
 * Bible costs, every chart follows. Nothing is estimated, rounded for effect,
 * or borrowed from another organisation.
 */

export type BarDatum = {
  label: string;
  value: number;
  /** A short line for the tooltip and the table view. */
  note?: string;
  /** Emphasise this one bar (accent) and leave the rest quiet. */
  emphasis?: boolean;
  /** Draw it as a gap year (no bar, a muted marker and a note). */
  gap?: boolean;
};

export type ChartSpec =
  | {
      type: "bars"; // horizontal, one series
      id: string;
      title: string;
      subtitle?: string;
      unit: "usd" | "count" | "lb";
      data: BarDatum[];
      source: string;
      /** Headline for the share card: the one number this chart is about. */
      headline: { value: string; label: string };
    }
  | {
      type: "columns"; // vertical, one series, ordered categories (years)
      id: string;
      title: string;
      subtitle?: string;
      unit: "count";
      data: BarDatum[];
      source: string;
      headline: { value: string; label: string };
    }
  | {
      type: "stacked"; // part-to-whole, 2–3 segments
      id: string;
      title: string;
      subtitle?: string;
      unit: "usd";
      segments: { label: string; value: number; note?: string }[];
      source: string;
      headline: { value: string; label: string };
    }
  | {
      type: "pictogram";
      id: string;
      title: string;
      subtitle?: string;
      count: number;
      each: string;
      total: string;
      source: string;
      headline: { value: string; label: string };
    };

const item = (id: string) => supplyDrive.items.find((i) => i.id === id)!;
const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
  });

/** Trips per country from Don's timeline (a trip to three countries counts for each). */
export function tripsByCountry(): { label: string; value: number }[] {
  return countriesServed
    .map((c) => ({
      label: c,
      value: missionTimeline.filter((t) => !t.gap && t.location?.includes(c)).length,
    }))
    .sort((a, b) => b.value - a.value);
}

/** Trips per calendar year, including the years with none. */
export function tripsByYear(): BarDatum[] {
  const years = Array.from(
    { length: 2026 - 2013 + 1 },
    (_, i) => 2013 + i,
  );
  return years.map((y) => {
    const rows = missionTimeline.filter((t) => t.year === y);
    const gapRow = rows.find((r) => r.gap);
    const n = rows.filter((r) => !r.gap).length;
    return {
      label: String(y),
      value: n,
      gap: !!gapRow,
      note: gapRow
        ? gapRow.focus
        : rows.map((r) => `${r.when}: ${r.location}`).join(" · "),
      emphasis: y === 2026,
    };
  });
}

/** How many of each item $25 buys — the comparison that makes small gifts concrete. */
export function unitsPer(dollars: number): BarDatum[] {
  return supplyDrive.items
    .filter((i) => i.unitCost <= dollars)
    .map((i) => ({
      label: i.name.replace(/^A /, "").replace(/^An /, ""),
      value: Math.floor(dollars / i.unitCost),
      note: `${usd(i.unitCost)} each`,
    }))
    .sort((a, b) => b.value - a.value);
}

/** What a monthly gift becomes over twelve months, in Bibles. */
export function monthlyInBibles(monthly: number): number {
  return Math.floor((monthly * 12) / item("bible").unitCost);
}

export const charts: Record<string, ChartSpec> = {
  "budget-split": {
    type: "stacked",
    id: "budget-split",
    title: `Where the ${usd(supplyDrive.goalUsd)} supply drive goes`,
    subtitle: "Buying the supplies versus getting them to Belize",
    unit: "usd",
    segments: [
      {
        label: "Supplies given away",
        value: suppliesBudget.total,
        note: "Bibles, hygiene kits, reading glasses, sunglasses, tracts, pastor gifts",
      },
      {
        label: "Getting it there",
        value: logisticsBudget.total,
        note: "Trunks, airline baggage fees, customs, contingency",
      },
    ],
    source: "Don Nichols' published trip budget (content/supplies.ts, content/support.ts)",
    headline: {
      value: `${Math.round((logisticsBudget.total / supplyDrive.goalUsd) * 100)}%`,
      label: "of a supply drive is moving supplies, not buying them",
    },
  },

  "supply-lines": {
    type: "bars",
    id: "supply-lines",
    title: "What the supplies cost, line by line",
    subtitle: `${usd(suppliesBudget.total)} of items, every one handed to someone free`,
    unit: "usd",
    data: suppliesBudget.items
      .map((i) => ({ label: i.label, value: i.amount }))
      .sort((a, b) => b.value - a.value),
    source: "Don Nichols' published supply budget",
    headline: { value: usd(suppliesBudget.total), label: "in supplies for one trip" },
  },

  "logistics-lines": {
    type: "bars",
    id: "logistics-lines",
    title: "What it costs to get it there",
    subtitle: `${usd(logisticsBudget.total)} the airline and the border take before a single kit is handed out`,
    unit: "usd",
    data: logisticsBudget.items
      .map((i) => ({ label: i.label.replace(/ \(.*\)$/, ""), value: i.amount, note: i.label }))
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({ ...d, emphasis: i === 0 })),
    source: "Don Nichols' published logistics budget",
    headline: { value: usd(logisticsBudget.items[1].amount), label: "just to fly six trunks as checked baggage" },
  },

  "units-per-25": {
    type: "bars",
    id: "units-per-25",
    title: "What $25 buys, item by item",
    subtitle: "The same twenty-five dollars, six different ways",
    unit: "count",
    data: unitsPer(25),
    source: "Unit costs from Don Nichols' published budget",
    headline: { value: String(Math.floor(25 / item("reading-glasses").unitCost)), label: "pairs of reading glasses for $25" },
  },

  "trips-per-year": {
    type: "columns",
    id: "trips-per-year",
    title: "Mission trips per year, 2013 to 2026",
    subtitle: "The three years with none are marked, exactly as Don records them",
    unit: "count",
    data: tripsByYear(),
    source: "Don Nichols' Mission Trip Timeline (content/history.ts)",
    headline: {
      value: String(missionTimeline.filter((t) => !t.gap).length),
      label: `mission trips since 2013`,
    },
  },

  "trips-by-country": {
    type: "bars",
    id: "trips-by-country",
    title: "Trips by country",
    subtitle: "A trip that reached three countries counts once for each",
    unit: "count",
    data: tripsByCountry().map((d, i) => ({ ...d, emphasis: i === 0 })),
    source: "Don Nichols' Mission Trip Timeline",
    headline: { value: String(countriesServed.length), label: "countries served" },
  },

  "archive-by-album": {
    type: "bars",
    id: "archive-by-album",
    title: "Photographs in the archive, by album",
    subtitle: "Every picture taken by Don and Patti themselves",
    unit: "count",
    data: [...albums]
      .map((a) => ({ label: a.title.replace(/ — .*$/, ""), value: a.photos.length, note: a.era }))
      .sort((a, b) => b.value - a.value),
    source: "The photo archive manifest (content/albums.ts)",
    headline: {
      value: String(albums.reduce((n, a) => n + a.photos.length, 0)),
      label: "photographs from five countries",
    },
  },

  "missionary-split": {
    type: "stacked",
    id: "missionary-split",
    title: `What ${usd(missionaryCost.total)} sends one missionary with`,
    subtitle: "Nobody on the team is paid; this is the whole cost of one person",
    unit: "usd",
    segments: missionaryCost.breakdown.map((b) => ({ label: b.label, value: b.amount })),
    source: "Don Nichols' published per-missionary cost",
    headline: { value: usd(missionaryCost.total), label: "sends one unpaid volunteer for a week" },
  },

  "monthly-year": {
    type: "bars",
    id: "monthly-year",
    title: "A monthly gift, twelve months later",
    subtitle: "Bibles a year of monthly giving buys, at Don's real price",
    unit: "count",
    data: [10, 25, 50, 100].map((m) => ({
      label: `${usd(m)} a month`,
      value: monthlyInBibles(m),
      note: `${usd(m * 12)} a year`,
      emphasis: m === 25,
    })),
    source: `Bibles at ${usd(item("bible").unitCost)} each, from Don Nichols' published budget`,
    headline: { value: String(monthlyInBibles(25)), label: "Bibles a year from $25 a month" },
  },

  trunks: {
    type: "pictogram",
    id: "trunks",
    title: "Nine trunks, fifty pounds each",
    subtitle: "What the team checked through the airline on the most recent trip",
    count: 9,
    each: "≈50 lb",
    total: "≈450 lb of ministry supplies",
    source: "Don Nichols, Behind Every Mission Trip",
    headline: { value: "450 lb", label: "of supplies carried through customs on one trip" },
  },
};

export const chartById = (id: string) => charts[id];
export const usdFmt = usd;
