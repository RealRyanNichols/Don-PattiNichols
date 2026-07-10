/**
 * Fill the Trunks — the supply drive items, straight from Don's real trip budget.
 * Prices and quantities are Don's published figures — do not change them.
 *
 * `funded` counts are hand-updated as sponsorships come in (until live totals
 * are wired to the Supabase `donations` table).
 */

export type SupplyIconKind =
  | "bible"
  | "kit"
  | "glasses"
  | "sun"
  | "tract"
  | "gift"
  | "trunk"
  | "plane"
  | "shield"
  | "person";

export type SupplyItem = {
  id: string;
  name: string;
  unitCost: number;
  /** How many the trip needs — null for open-ended items (missionary). */
  needed: number | null;
  /** Hand-updated count of sponsored units. */
  funded: number;
  blurb: string;
  icon: SupplyIconKind;
  /** Default quantity in the stepper. */
  startQty: number;
  /** Shows the gold "Top Priority" badge. */
  topPriority?: boolean;
};

/** The supply goal thermometer target — Don's budget total for the items below. */
export const SUPPLY_GOAL_USD = 3940;

/**
 * The giving funnel, in Don's priority order — donations fill each stage
 * before the next one matters (you can't pay to fly a trunk that isn't
 * filled yet).
 */
export const supplyStages: { title: string; ids: string[] }[] = [
  { title: "Glasses & Bibles", ids: ["reading-glasses", "bible"] },
  { title: "The Trunks", ids: ["trunk"] },
  { title: "All the Supplies", ids: ["hygiene-kit", "sunglasses", "tracts", "pastor-gift"] },
  { title: "Fly the Trunks", ids: ["baggage", "customs"] },
  { title: "The Trip & Airfare", ids: ["missionary"] },
];

export function getSupply(id: string) {
  return supplies.find((item) => item.id === id);
}

/** The $5.50 combo level: one hygiene kit ($3) + one Bible ($2.50) for one person. */
export const KIT_AND_BIBLE = {
  id: "kit-and-bible",
  name: "A Kit & Bible",
  unitCost: 5.5,
  itemIds: ["hygiene-kit", "bible"] as const,
};

/**
 * Merge live PayPal/online totals (from the Supabase fund_totals view) into
 * the hand-updated counts. Hand counts stay the record for offline gifts;
 * live dollars convert to whole sponsored units per item. Gifts to the
 * "kit-and-bible" combo fund credit one unit each to the hygiene kit and
 * the Bible. Returns the merged items plus the total raised for the goal
 * thermometer.
 */
export function mergeLiveFunding(totals: Record<string, number>) {
  const comboUsd = totals[KIT_AND_BIBLE.id] ?? 0;
  const comboUnits = comboUsd > 0 ? Math.floor(comboUsd / KIT_AND_BIBLE.unitCost) : 0;

  const items = supplies.map((item) => {
    const liveUsd = totals[item.id] ?? 0;
    let liveUnits = liveUsd > 0 ? Math.floor(liveUsd / item.unitCost) : 0;
    if (comboUnits > 0 && (KIT_AND_BIBLE.itemIds as readonly string[]).includes(item.id)) {
      liveUnits += comboUnits;
    }
    return { ...item, funded: item.funded + liveUnits };
  });
  const raised = items.reduce((sum, item) => sum + item.funded * item.unitCost, 0);
  return { items, raised };
}

/**
 * CTA/title phrasing: "A Bible" → "Sponsor a Bible"; names already phrased
 * as actions ("Sponsor a Missionary", "Fly a Trunk to Belize") stay as-is.
 */
export function sponsorLabel(name: string) {
  if (name.startsWith("Sponsor ") || name.startsWith("Fly ")) return name;
  if (name.startsWith("A ")) return `Sponsor a ${name.slice(2)}`;
  return `Sponsor ${name}`;
}

/**
 * Item order = Don's donation priority (his instruction, July 10, 2026):
 * 1. Glasses and Bibles first
 * 2. Then trunks
 * 3. Then all the supplies
 * 4. Then the cost for the trunks to fly (8 trunks, 6 fly @ $200 each)
 *    + customs/contingency
 * 5. Finally the cost of the trip / airfare (Sponsor a Missionary)
 */
export const supplies: SupplyItem[] = [
  {
    id: "reading-glasses",
    name: "Reading Glasses",
    unitCost: 0.6,
    needed: 300,
    funded: 0,
    blurb: "One pair can mean reading Scripture, sewing, working, and seeing family clearly.",
    icon: "glasses",
    startQty: 10,
    topPriority: true,
  },
  {
    id: "bible",
    name: "A Bible",
    unitCost: 2.5,
    needed: 250,
    funded: 0,
    blurb: "Placed into the hands of someone eager to read God's Word.",
    icon: "bible",
    startQty: 4,
    topPriority: true,
  },
  {
    id: "trunk",
    name: "A Ministry Trunk",
    unitCost: 25,
    needed: 8,
    funded: 0,
    blurb: "The heavy-duty trunk itself — it will carry fifty pounds of supplies to Belize.",
    icon: "trunk",
    startQty: 1,
  },
  {
    id: "hygiene-kit",
    name: "A Hygiene Kit",
    unitCost: 3,
    needed: 300,
    funded: 0,
    blurb: "Towel, sewing kit, toothbrush, toothpaste, lip balm, and a Gospel booklet.",
    icon: "kit",
    startQty: 3,
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    unitCost: 1,
    needed: 150,
    funded: 0,
    blurb: "Protection for eyes that work all day under the Caribbean sun.",
    icon: "sun",
    startQty: 10,
  },
  {
    id: "tracts",
    name: "Gospel Tracts (bundle)",
    unitCost: 60,
    needed: 1,
    funded: 0,
    blurb: "The full supply of Gospel literature for the whole trip.",
    icon: "tract",
    startQty: 1,
  },
  {
    id: "pastor-gift",
    name: "Pastor & Wife Gift Set",
    unitCost: 100,
    needed: 3,
    funded: 0,
    blurb: "A study Bible and practical household gifts for a village pastor and his wife.",
    icon: "gift",
    startQty: 1,
  },
  {
    id: "baggage",
    name: "Fly a Trunk to Belize",
    unitCost: 200,
    needed: 6,
    funded: 0,
    blurb: "The airline baggage fee that gets one packed trunk onto the plane.",
    icon: "plane",
    startQty: 1,
  },
  {
    id: "customs",
    name: "Customs & Contingency Share",
    unitCost: 25,
    needed: 13,
    funded: 0,
    blurb: "Customs fees and the emergency fund that keeps the mission moving.",
    icon: "shield",
    startQty: 1,
  },
  {
    id: "missionary",
    name: "Sponsor a Missionary",
    unitCost: 1200,
    needed: null,
    funded: 0,
    blurb: "Airfare, lodging, meals, and ground transport for one unpaid volunteer to serve.",
    icon: "person",
    startQty: 1,
  },
];
