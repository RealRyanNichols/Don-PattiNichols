-- Supabase default privileges auto-grant EXECUTE on new functions directly to
-- anon and authenticated, so the REVOKE ... FROM public in the previous
-- migration did not remove them. Revoke explicitly: only the service role (the
-- Stripe webhook) may credit a trip's total, so no anon/donor can inflate it.
-- Applied to the hosted project via migration `lock_down_increment_trip_raised`.
revoke execute on function public.increment_trip_raised(uuid, numeric) from anon, authenticated;
