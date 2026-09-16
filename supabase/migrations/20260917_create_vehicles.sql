-- Lombok Local · vehicles table + public read + image storage + seed
-- Cara pakai: Supabase Dashboard → SQL Editor → New query → paste seluruh file → Run.

-- 1. Tabel
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('scooter', 'car')),
  name text not null,
  spec text not null default '',
  daily_price integer not null default 0,
  weekly_price integer null,
  image_url text not null default '',
  perks text[] not null default '{}',
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at otomatis
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists vehicles_updated_at on public.vehicles;
create trigger vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.handle_updated_at();

-- 2. RLS: baca publik, tulis hanya via SERVICE ROLE (dipakai halaman /admin server-side)
alter table public.vehicles enable row level security;

drop policy if exists "Public read vehicles" on public.vehicles;
create policy "Public read vehicles"
  on public.vehicles for select
  using (true);

-- 3. Storage publik untuk foto kendaraan
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read vehicle images" on storage.objects;
create policy "Public read vehicle images"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

-- 4. Seed data awal (sama dengan konten statis web saat ini)
insert into public.vehicles (category, name, spec, daily_price, weekly_price, image_url, perks, available, sort_order)
values
  ('scooter', 'Honda Scoopy', 'Automatic · 2 persons', 75000, 450000,
   'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85',
   array['2 helmets', 'Phone holder', 'Free delivery*'], true, 1),
  ('scooter', 'Honda Vario', 'Automatic · 2 persons', 100000, 600000,
   'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1000&q=85',
   array['2 helmets', 'Phone holder', 'Free delivery*'], true, 2),
  ('car', 'Toyota Avanza', 'Manual · 6 seats · With driver', 650000, null,
   'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85',
   array['Driver + fuel', 'Hotel pickup', 'Flexible route'], true, 1),
  ('car', 'Toyota Innova', 'Manual · 7 seats · With driver', 850000, null,
   'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85',
   array['Driver + fuel', 'Extra comfort', 'Long trip ready'], true, 2);
