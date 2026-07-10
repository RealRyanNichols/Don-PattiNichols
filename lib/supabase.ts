/**
 * Minimal Supabase REST access — no client library needed.
 *
 * The publishable key below is intentionally hardcoded so the live forms
 * work even before env vars are configured; it is safe to expose (RLS
 * limits it to public INSERTs on `subscribers` and `messages`). Environment
 * variables override when set.
 */

const FALLBACK_URL = "https://rxjsykcbedtyxfvyfyhl.supabase.co";
const FALLBACK_KEY = "sb_publishable_1I_FBu2O4N1X0gqvloWzww_2fLSc2TZ";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

/** Insert a row into a public-INSERT table. Returns the raw Response. */
export async function supabaseInsert(table: string, row: Record<string, unknown>) {
  return fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
}
