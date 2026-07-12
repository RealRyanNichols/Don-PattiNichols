-- PayPal records donations via IPN keyed on the PayPal transaction id.
-- Add a unique column for idempotent inserts (retried IPNs are ignored).
-- The legacy stripe_session_id column is left in place, nullable and unused.
-- Applied to the hosted project via migration `donations_paypal_txn_id`.
alter table public.donations add column if not exists paypal_txn_id text;
create unique index if not exists donations_paypal_txn_id_key
  on public.donations (paypal_txn_id)
  where paypal_txn_id is not null;
