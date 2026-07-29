import { supabaseConfig } from "./supabase";
import { supplyDrive } from "@/content/supplies";

/**
 * PUBLIC GIVING NUMBERS.
 *
 * Ryan's rule for this site: the public sees the total and what it went
 * toward, so anyone can tell what has been accomplished and what still needs
 * funding. They never see who gave or how much any one person gave.
 *
 * That rule is enforced in the database, not here — `donation_totals()` and
 * `donation_by_item()` are security-definer functions that return only sums
 * and counts. The `donations` table itself is unreadable without an author
 * login. Even if this file were rewritten carelessly, there is no public path
 * to a donor's name.
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

async function rpc<T>(fn: string): Promise<T[]> {
  try {
    const res = await fetch(`${supabaseConfig.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        apikey: supabaseConfig.key,
        Authorization: `Bearer ${supabaseConfig.key}`,
        "Content-Type": "application/json",
      },
      body: "{}",
      // Pages revalidate every 60s, so a new gift shows up within the minute
      // without rebuilding the site.
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    // A giving page that fails to render is worse than one showing no total.
    return [];
  }
}

export async function fetchDonationTotals(): Promise<DonationTotals> {
  const rows = await rpc<{
    total_usd: string | number;
    gift_count: number;
    donor_count: number;
    monthly_count: number;
    last_gift_at: string | null;
  }>("donation_totals");
  const r = rows[0];
  return {
    totalUsd: Number(r?.total_usd ?? 0),
    giftCount: Number(r?.gift_count ?? 0),
    donorCount: Number(r?.donor_count ?? 0),
    monthlyCount: Number(r?.monthly_count ?? 0),
    lastGiftAt: r?.last_gift_at ?? null,
  };
}

export async function fetchItemFunding(): Promise<Map<string, ItemFunding>> {
  const rows = await rpc<{
    item_id: string;
    total_usd: string | number;
    units: number;
    gift_count: number;
  }>("donation_by_item");
  const map = new Map<string, ItemFunding>();
  for (const r of rows) {
    map.set(r.item_id, {
      itemId: r.item_id,
      totalUsd: Number(r.total_usd ?? 0),
      units: Number(r.units ?? 0),
      giftCount: Number(r.gift_count ?? 0),
    });
  }
  return map;
}

/**
 * What the money has bought, and what is still short.
 *
 * Undesignated gifts (someone who tapped "Give" rather than picking an item)
 * are counted in the total but deliberately NOT spread across the items. A
 * progress bar that fills itself from money nobody assigned to it would be a
 * pleasant lie, and this site does not tell those. They are reported on their
 * own line as "where it's needed most".
 */
export type Allocation = {
  /** True until the first real gift arrives — the UI says so instead of showing an empty campaign. */
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
  totals: DonationTotals,
  byItem: Map<string, ItemFunding>,
): Allocation {
  const goalUsd = supplyDrive.goalUsd;

  const items = supplyDrive.items.map((item) => {
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
    const targetUsd = item.needed === null ? null : item.needed * item.unitCost;
    return {
      id: item.id,
      name: item.name,
      unitCost: item.unitCost,
      needed: item.needed,
      unitsFunded,
      fundedUsd,
      stillNeededUsd:
        targetUsd === null ? null : Math.max(0, Math.round((targetUsd - fundedUsd) * 100) / 100),
      pct:
        targetUsd === null || targetUsd === 0
          ? 0
          : Math.min(100, Math.round((fundedUsd / targetUsd) * 100)),
    };
  });

  const designated = items.reduce((s, i) => s + i.fundedUsd, 0);

  return {
    giftless: totals.giftCount === 0,
    giftCount: totals.giftCount,
    monthlyCount: totals.monthlyCount,
    raisedUsd: totals.totalUsd,
    goalUsd,
    pctOfGoal: goalUsd > 0 ? Math.min(100, Math.round((totals.totalUsd / goalUsd) * 100)) : 0,
    stillNeededUsd: Math.max(0, Math.round((goalUsd - totals.totalUsd) * 100) / 100),
    undesignatedUsd: Math.max(0, Math.round((totals.totalUsd - designated) * 100) / 100),
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
