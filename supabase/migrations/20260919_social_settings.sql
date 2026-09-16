-- Lombok Local · social links settings
-- Cara pakai: SQL Editor → paste → Run.

insert into public.site_settings (key, value) values
  ('instagram_url', ''),
  ('google_maps_url', '')
on conflict (key) do nothing;
