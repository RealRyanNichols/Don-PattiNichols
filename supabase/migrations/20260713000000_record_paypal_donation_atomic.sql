-- Atomic donation recorder: resolves the trip, inserts the donation
-- idempotently (unique paypal_txn_id), and credits the trip's raised_usd in the
-- SAME transaction — so a donation can never be recorded without its trip credit
-- (fixing the previous non-atomic insert-then-increment dual write). Accepts a
-- signed amount so refunds/reversals (negative) net out correctly. Returns
-- 'recorded' on a fresh insert, 'duplicate' on a retried IPN. Service-role only.
-- Applied to the hosted project via migration `record_paypal_donation_atomic`.
create or replace function public.record_paypal_donation(
  p_txn_id text,
  p_amount numeric,
  p_currency text,
  p_fund text,
  p_trip_slug text,
  p_recurring boolean,
  p_donor_name text,
  p_donor_email text
) returns text
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_trip_id uuid;
  v_rows integer;
begin
  if p_trip_slug is not null then
    select id into v_trip_id from public.trips where slug = p_trip_slug;
  end if;

  insert into public.donations
    (paypal_txn_id, amount_usd, currency, fund, trip_id, recurring, donor_name, donor_email)
  values
    (p_txn_id, p_amount, p_currency, p_fund, v_trip_id, p_recurring, p_donor_name, p_donor_email)
  on conflict (paypal_txn_id) where paypal_txn_id is not null do nothing;

  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return 'duplicate';
  end if;

  -- Credit (or, for a negative refund amount, debit) the designated trip.
  if v_trip_id is not null then
    update public.trips
       set raised_usd = greatest(0, coalesce(raised_usd, 0) + p_amount)
     where id = v_trip_id;
  end if;

  return 'recorded';
end;
$fn$;

revoke all on function public.record_paypal_donation(text, numeric, text, text, text, boolean, text, text) from public, anon, authenticated;
grant execute on function public.record_paypal_donation(text, numeric, text, text, text, boolean, text, text) to service_role;
