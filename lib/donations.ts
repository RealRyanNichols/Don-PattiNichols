import { supabaseAnonKey, supabaseUrl } from "./supabase";

/** fund key → total dollars given, from the fund_totals aggregate function. */
export type FundTotals = Record<string, number>;

/**
 * Live donation totals per designated fund.
 *
 * Reads the public `fund_totals()` SECURITY DEFINER function (aggregates only —
 * donor details stay behind RLS; the function replaced the old SECURITY DEFINER
 * view that tripped the Supabase advisor). It's marked STABLE, so PostgREST
 * serves it over GET. Cached/revalidated every 5 minutes. Returns {} on any
 * failure so progress meters always fall back to the hand-updated counts in
 * content/supplies.ts.
 */
export async function fetchFundTotals(): Promise<FundTotals> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/fund_totals`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return {};
    const rows: { fund: string; total_usd: number | string }[] = await res.json();
    return Object.fromEntries(rows.map((r) => [r.fund, Number(r.total_usd) || 0]));
  } catch {
    return {};
  }
}
