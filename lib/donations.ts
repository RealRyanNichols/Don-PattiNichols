import { supabaseConfig } from "./supabase";
import { supplyDrive } from "@/content/supplies";

/**
 * PUBLIC GIVING NUMBERS.
 *
 * Ryan's rule for this site: the public sees the total and what it went
 * toward, so anyone can tell what has been accomplished and what still needs
 * funding. They never see who gave or how much any one person gave.
 *
 * Read only the aggregate RPCs here. Do not fetch individual donation rows
 * into a public page. Access to donor records is governed by database RLS.
 */

export type DonationTotals = {
  totalUsd: number;
  giftCount: number;
  donorCount: number;
  monthlyCount: number;
  lastGiftAt: string | null;
};

export type ItemFunding = {
  itemId: string;
  totalUsd: number;
  units: number;
  giftCount: number;
};

async function rpc(fn: string): Promise<unknown[] | null> {
  try {
    const res = await fetch(`${supabaseConfig.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: supabaseConfig.key,
        Authorization: `Bearer ${supabaseConfig.key}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      // Refresh recorded totals without rebuilding the site. This does not
      // establish that PayPal has synchronized or settled a gift.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const rows: unknown = await res.json();
    return Array.isArray(rows) ? rows : null;
  } catch {
    // Unavailable data must never become a claim that no one has given.
    return null;
  }
}

function nonnegativeNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export async function fetchDonationTotals(): Promise<DonationTotals | null> {
  const rows = await rpc("donation_totals");
  const r = rows?.[0];
  if (!r || typeof r !== "object") return null;
  const row = r as Record<string, unknown>;
  const totalUsd = nonnegativeNumber(row.total_usd);
  const giftCount = nonnegativeNumber(row.gift_count);
  const donorCount = nonnegativeNumber(row.donor_count);
  const monthlyCount = nonnegativeNumber(row.monthly_count);
  if (
    totalUsd === null ||
    giftCount === null ||
    donorCount === null ||
    monthlyCount === null
  )
    return null;
  if (![giftCount, donorCount, monthlyCount].every(Number.isInteger))
    return null;
  return {
    totalUsd,
    giftCount,
    donorCount,
    monthlyCount,
    lastGiftAt: typeof row.last_gift_at === "string" ? row.last_gift_at : null,
  };
}

export async function fetchItemFunding(): Promise<Map<
  string,
  ItemFunding
> | null> {
  const rows = await rpc("donation_by_item");
  if (rows === null) return null;
  const map = new Map<string, ItemFunding>();
  for (const r of rows) {
    if (!r || typeof r !== "object") return null;
    const row = r as Record<string, unknown>;
    // General gifts have no item designation and stay in the total only.
    if (row.item_id === null || row.item_id === "") continue;
    const totalUsd = nonnegativeNumber(row.total_usd);
    const units = row.units === null ? 0 : nonnegativeNumber(row.units);
    const giftCount = nonnegativeNumber(row.gift_count);
    if (
      typeof row.item_id !== "string" ||
      totalUsd === null ||
      units === null ||
      giftCount === null
    )
      return null;
    if (!Number.isInteger(giftCount)) return null;
    map.set(row.item_id, {
      itemId: row.item_id,
      totalUsd,
      units,
      giftCount,
    });
  }
  return map;
}

/**
 * Recorded gift designations compared with the published budget.
 *
 * Undesignated gifts (someone who tapped "Give" rather than picking an item)
 * are counted in the total but deliberately NOT spread across the items. A
 * progress bar that fills itself from money nobody assigned to it would be a
 * pleasant lie, and this site does not tell those. They are reported on their
 * own line without claiming that supplies have been purchased or delivered.
 */
export type Allocation =
  | { status: "unavailable"; goalUsd: number }
  | {
      status: "available";
      itemsAvailable: boolean;
      /** No gifts are present in the website's records. */
      giftless: boolean;
      giftCount: number;
      monthlyCount: number;
      raisedUsd: number;
      goalUsd: number;
      pctOfGoal: number;
      stillNeededUsd: number;
      undesignatedUsd: number;
      items: {
        id: string;
        name: string;
        unitCost: number;
        needed: number | null;
        /** Units covered by designated gifts. */
        unitsFunded: number;
        fundedUsd: number;
        /** Dollars still required to finish this line. null = open-ended. */
        stillNeededUsd: number | null;
        pct: number;
      }[];
    };

export function buildAllocation(
  totals: DonationTotals | null,
  byItem: Map<string, ItemFunding> | null,
): Allocation {
  const goalUsd = supplyDrive.goalUsd;
  if (totals === null) return { status: "unavailable", goalUsd };

  const items =
    byItem === null
      ? []
      : supplyDrive.items.map((item) => {
          const got = byItem.get(item.id);
          const fundedUsd = got?.totalUsd ?? 0;
          // Prefer the recorded unit count; fall back to dollars ÷ unit price for
          // gifts that arrived without a quantity.
          const unitsFunded =
            got?.units && got.units > 0
              ? got.units
              : item.unitCost > 0
                ? Math.floor(fundedUsd / item.unitCost)
                : 0;
          const targetUsd =
            item.needed === null ? null : item.needed * item.unitCost;
          return {
            id: item.id,
            name: item.name,
            unitCost: item.unitCost,
            needed: item.needed,
            unitsFunded,
            fundedUsd,
            stillNeededUsd:
              targetUsd === null
                ? null
                : Math.max(0, Math.round((targetUsd - fundedUsd) * 100) / 100),
            pct:
              targetUsd === null || targetUsd === 0
                ? 0
                : Math.min(100, Math.round((fundedUsd / targetUsd) * 100)),
          };
        });

  const designated = items.reduce((s, i) => s + i.fundedUsd, 0);

  return {
    status: "available",
    itemsAvailable: byItem !== null,
    giftless: totals.giftCount === 0,
    giftCount: totals.giftCount,
    monthlyCount: totals.monthlyCount,
    raisedUsd: totals.totalUsd,
    goalUsd,
    pctOfGoal:
      goalUsd > 0
        ? Math.min(100, Math.round((totals.totalUsd / goalUsd) * 100))
        : 0,
    stillNeededUsd: Math.max(
      0,
      Math.round((goalUsd - totals.totalUsd) * 100) / 100,
    ),
    undesignatedUsd: Math.max(
      0,
      Math.round((totals.totalUsd - designated) * 100) / 100,
    ),
    items,
  };
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
