-- Lombok Local · USD rate setting
-- Cara pakai: SQL Editor → paste → Run.

insert into public.site_settings (key, value) values
  ('usd_rate', '16000')
on conflict (key) do nothing;
