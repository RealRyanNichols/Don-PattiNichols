import { supabaseAnonKey, supabaseUrl } from "./supabase";

/** fund key → total dollars given, from the fund_totals aggregate view. */
export type FundTotals = Record<string, number>;

/**
 * Live donation totals per designated fund.
 *
 * Reads the public `fund_totals` view (aggregates only — donor details stay
 * behind RLS). Cached/revalidated every 5 minutes. Returns {} on any failure
 * so progress meters always fall back to the hand-updated counts in
 * content/supplies.ts.
 */
export async function fetchFundTotals(): Promise<FundTotals> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/fund_totals?select=fund,total_usd`, {
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
