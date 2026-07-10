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
};

/** The supply goal thermometer target — Don's budget total for the items below. */
export const SUPPLY_GOAL_USD = 3940;

/** Dollars raised so far across all items (funded counts × unit cost). */
export function suppliesRaisedUsd() {
  return supplies.reduce((sum, item) => sum + item.funded * item.unitCost, 0);
}

export function getSupply(id: string) {
  return supplies.find((item) => item.id === id);
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

export const supplies: SupplyItem[] = [
  {
    id: "bible",
    name: "A Bible",
    unitCost: 2.5,
    needed: 250,
    funded: 0,
    blurb: "Placed into the hands of someone eager to read God's Word.",
    icon: "bible",
    startQty: 4,
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
    id: "reading-glasses",
    name: "Reading Glasses",
    unitCost: 0.6,
    needed: 300,
    funded: 0,
    blurb: "One pair can mean reading Scripture, sewing, working, and seeing family clearly.",
    icon: "glasses",
    startQty: 10,
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
