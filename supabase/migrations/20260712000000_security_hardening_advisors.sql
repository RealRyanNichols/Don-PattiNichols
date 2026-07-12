-- Security & performance hardening pass (Supabase advisors).
-- Applied to the hosted project (ref rxjsykcbedtyxfvyfyhl) via migration
-- `security_hardening_advisors_2026_07`. Mirrored here for review.
-- New migration only — existing schema/migrations are left untouched.

-- 1. fund_totals: the SECURITY DEFINER *view* trips the security_definer_view
--    ERROR. Replace it with a SECURITY DEFINER *function* with a pinned
--    search_path. The function still exposes only aggregates (fund, total,
--    count) — never donor PII — so the public progress meters keep working
--    without granting anon any access to the donations rows themselves.
drop view if exists public.fund_totals;

create or replace function public.fund_totals()
returns table (fund text, total_usd numeric, donation_count integer)
language sql
stable
security definer
set search_path = ''
as $fn$
  select d.fund,
         coalesce(sum(d.amount_usd), 0)::numeric as total_usd,
         count(*)::integer as donation_count
  from public.donations d
  where d.fund is not null
  group by d.fund;
$fn$;

revoke all on function public.fund_totals() from public;
grant execute on function public.fund_totals() to anon, authenticated, service_role;

-- 2. is_admin(): keep SECURITY DEFINER (RLS policies and the admin dashboard
--    both need it) but stop anon from calling it over RPC. authenticated keeps
--    EXECUTE — the dashboard calls supabase.rpc('is_admin') and every admin
--    policy evaluates it. search_path is already pinned to 'public'.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- 3. touch_updated_at(): pin an empty search_path (body only calls now()).
alter function public.touch_updated_at() set search_path = '';

-- 4. Covering indexes for the trip_id foreign keys.
create index if not exists idx_donations_trip_id on public.donations (trip_id);
create index if not exists idx_trip_photos_trip_id on public.trip_photos (trip_id);

-- 5. Collapse the duplicate authenticated SELECT policies on posts into one
--    policy per role. anon reads published rows only and never evaluates
--    is_admin() (which it can no longer execute); authenticated reads
--    published-or-admin.
drop policy if exists "admins read all posts" on public.posts;
drop policy if exists "public read published posts" on public.posts;

create policy "anon read published posts" on public.posts
  for select to anon
  using (published = true);

create policy "auth read published or admin posts" on public.posts
  for select to authenticated
  using (published = true or is_admin());
