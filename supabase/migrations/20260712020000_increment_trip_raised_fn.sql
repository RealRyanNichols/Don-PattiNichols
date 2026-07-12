-- Atomic increment of a trip's raised_usd, called only by the Stripe webhook
-- (service role) after a completed checkout. A single UPDATE is atomic;
-- SECURITY DEFINER + pinned search_path; execute restricted to service_role so
-- no donor/anon can inflate the total via RPC.
-- Applied to the hosted project via migration `increment_trip_raised_fn`.
create or replace function public.increment_trip_raised(p_trip_id uuid, p_amount numeric)
returns numeric
language sql
security definer
set search_path = ''
as $fn$
  update public.trips
     set raised_usd = coalesce(raised_usd, 0) + p_amount
   where id = p_trip_id
  returning raised_usd;
$fn$;

revoke all on function public.increment_trip_raised(uuid, numeric) from public;
grant execute on function public.increment_trip_raised(uuid, numeric) to service_role;
