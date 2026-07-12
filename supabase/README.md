# Supabase

Project: **Don&PattiNichols** — ref `rxjsykcbedtyxfvyfyhl`.

Schema (tables, RLS policies, the admin allowlist, the `fund_totals` aggregate,
and the `posts` timeline) was applied directly to the hosted project. The
`migrations/` folder mirrors migrations for review going forward — each new
change is a **new** file; existing migrations are never edited.

## Client wiring

- `lib/donations.ts` reads live per-fund totals from the `fund_totals()`
  function via `/rest/v1/rpc/fund_totals` (aggregates only; donor rows stay
  behind RLS). Falls back to the hand-updated counts in `content/supplies.ts`
  if the call fails.
- `lib/posts-live.ts` merges published `posts` rows with the TS seeds.
- Forms POST to `/api/contact` (→ `messages`) and `/api/subscribe`
  (→ `subscribers`). Public INSERT is intentionally open; spam is filtered at
  the app layer (honeypot + best-effort rate limit).

## Advisor status

After `20260712000000_security_hardening_advisors.sql`: **no ERROR-level
advisors.** Remaining WARNs are intentional and documented in that migration —
open public INSERT on `messages`/`subscribers` (the contact + newsletter
forms), and anon/authenticated EXECUTE on the `fund_totals()` public aggregate
and the `is_admin()` dashboard gate.
