-- Admin write access (gated by is_admin()) for the content tables the family
-- dashboard manages. Public read policies already exist; these add the admin
-- INSERT/UPDATE/DELETE, mirroring the posts policies. Only authenticated admins
-- match is_admin(); anon never evaluates it here.
-- Applied to the hosted project via migration `admin_write_trips_products_photos`.

-- trips
create policy "admins insert trips" on public.trips
  for insert to authenticated with check (is_admin());
create policy "admins update trips" on public.trips
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "admins delete trips" on public.trips
  for delete to authenticated using (is_admin());

-- products
create policy "admins insert products" on public.products
  for insert to authenticated with check (is_admin());
create policy "admins update products" on public.products
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "admins delete products" on public.products
  for delete to authenticated using (is_admin());

-- trip_photos
create policy "admins insert trip photos" on public.trip_photos
  for insert to authenticated with check (is_admin());
create policy "admins update trip photos" on public.trip_photos
  for update to authenticated using (is_admin()) with check (is_admin());
create policy "admins delete trip photos" on public.trip_photos
  for delete to authenticated using (is_admin());
