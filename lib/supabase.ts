/**
 * Supabase connection — used by server API routes only.
 *
 * The publishable key below is PUBLIC BY DESIGN (it ships to every browser on
 * any Supabase-powered site). Security is enforced by Row Level Security:
 * the form tables are write-only for the public — nothing can be read back.
 *
 * When the repo moves to GitHub + Vercel env vars, set:
 *   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
 * and they take precedence automatically.
 */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://rxjsykcbedtyxfvyfyhl.supabase.co",
  key:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "sb_publishable_1I_FBu2O4N1X0gqvloWzww_2fLSc2TZ",
};

/**
 * Call a Postgres function via Supabase REST.
 *
 * Used for `join_list`, which is SECURITY DEFINER: the public can call it but
 * cannot touch the `subscribers` table directly. That is what lets a returning
 * supporter add their phone number to a row they could never read or edit.
 */
export async function supabaseRpc(fn: string, args: Record<string, unknown>) {
  return fetch(`${supabaseConfig.url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: supabaseConfig.key,
      Authorization: `Bearer ${supabaseConfig.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
}

/** Insert a row via Supabase REST. Returns the raw Response. */
export async function supabaseInsert(table: string, row: Record<string, unknown>) {
  return fetch(`${supabaseConfig.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: supabaseConfig.key,
      Authorization: `Bearer ${supabaseConfig.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
}
