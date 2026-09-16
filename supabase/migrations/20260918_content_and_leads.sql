-- Lombok Local · settings, transfer routes, tours, inquiries
-- Cara pakai: Supabase Dashboard → SQL Editor → New query → paste seluruh file → Run.

-- 1. Site settings (key-value: nomor WA, info kontak)
create table if not exists public.site_settings (
  key text primary key,
  value text not null default ''
);
alter table public.site_settings enable row level security;
drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings"
  on public.site_settings for select using (true);

insert into public.site_settings (key, value) values
  ('whatsapp_number', '6281234567890'),
  ('contact_phone_display', '+62 812-3456-7890'),
  ('contact_hours', 'daily 07:00–21:00 WITA'),
  ('base_location', 'Kuta, South Lombok · delivery & pickup available')
on conflict (key) do nothing;

-- 2. Transfer routes
create table if not exists public.transfer_routes (
  id uuid primary key default gen_random_uuid(),
  from_loc text not null default 'Lombok Airport',
  to_loc text not null,
  price integer not null default 0,
  sort_order integer not null default 0
);
alter table public.transfer_routes enable row level security;
drop policy if exists "Public read transfer routes" on public.transfer_routes;
create policy "Public read transfer routes"
  on public.transfer_routes for select using (true);

insert into public.transfer_routes (from_loc, to_loc, price, sort_order) values
  ('Lombok Airport', 'Kuta Lombok', 250000, 1),
  ('Lombok Airport', 'Senggigi', 350000, 2),
  ('Lombok Airport', 'Mataram', 300000, 3),
  ('Lombok Airport', 'Bangsal Harbour', 450000, 4);

-- 3. Tours
create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  area text not null default '',
  duration text not null default '1 day',
  type text not null default 'Private',
  price_amount integer not null default 0,
  price_note text not null default '',
  image_url text not null default '',
  description text not null default '',
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tours enable row level security;
drop policy if exists "Public read tours" on public.tours;
create policy "Public read tours"
  on public.tours for select using (true);

drop trigger if exists tours_updated_at on public.tours;
create trigger tours_updated_at
  before update on public.tours
  for each row execute function public.handle_updated_at();

-- 4. Tour itinerary
create table if not exists public.tour_itinerary (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  time text not null,
  place text not null,
  sort_order integer not null default 0
);
alter table public.tour_itinerary enable row level security;
drop policy if exists "Public read itinerary" on public.tour_itinerary;
create policy "Public read itinerary"
  on public.tour_itinerary for select using (true);

-- Seed tours (slug = slug lama agar link tidak rusak)
insert into public.tours (slug, title, area, duration, type, price_amount, price_note, image_url, description, included, excluded, sort_order)
values
  ('south-lombok-adventure', 'The Essential South', 'South Lombok', '1 day', 'Private', 1200000,
   'per trip · up to 4 guests',
   'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=1600&q=85',
   'Hidden beaches, Merese Hill sunset and local warungs — the classic south route, at your pace.',
   array['Private driver', 'Fuel & parking', 'Mineral water', 'Local guide'],
   array['Lunch', 'Entrance fees', 'Personal expenses'], 1),
  ('snorkel-slow-down', 'Snorkel & Slow Down', 'Island Life', '1 day', 'Boat', 850000,
   'per person · min 2',
   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
   'Clear water, coral gardens and a slow island lunch. No rush, just ocean.',
   array['Boat & captain', 'Snorkel gear', 'Lunch', 'Towels'],
   array['Underwater photos', 'Tips'], 2),
  ('waterfall-culture', 'Waterfalls & Sasak Village', 'North Lombok', '1 day', 'Private', 1100000,
   'per trip · up to 4 guests',
   'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=85',
   'Chase waterfalls in the morning, meet Sasak weavers in the afternoon.',
   array['Private driver', 'Local guide', 'Donations', 'Mineral water'],
   array['Lunch', 'Personal expenses'], 3)
on conflict (slug) do nothing;

-- Seed itinerary
insert into public.tour_itinerary (tour_id, time, place, sort_order)
select t.id, s.time, s.place, s.ord
from public.tours t
join (values
  ('south-lombok-adventure', '08:00', 'Hotel pickup (Kuta area)', 1),
  ('south-lombok-adventure', '09:00', 'Tanjung Aan Beach', 2),
  ('south-lombok-adventure', '11:00', 'Merese Hill', 3),
  ('south-lombok-adventure', '13:00', 'Local lunch', 4),
  ('south-lombok-adventure', '14:30', 'Mawun Beach', 5),
  ('south-lombok-adventure', '17:00', 'Return to hotel', 6),
  ('snorkel-slow-down', '08:30', 'Harbour pickup', 1),
  ('snorkel-slow-down', '09:30', 'Snorkel spot 1', 2),
  ('snorkel-slow-down', '11:30', 'Snorkel spot 2', 3),
  ('snorkel-slow-down', '13:00', 'Island lunch', 4),
  ('snorkel-slow-down', '15:30', 'Return', 5),
  ('waterfall-culture', '07:30', 'Hotel pickup', 1),
  ('waterfall-culture', '10:00', 'Sendang Gile waterfall', 2),
  ('waterfall-culture', '13:00', 'Local lunch', 3),
  ('waterfall-culture', '14:30', 'Sasak village visit', 4),
  ('waterfall-culture', '17:30', 'Return', 5)
) as s(slug, time, place, ord) on s.slug = t.slug
where not exists (
  select 1 from public.tour_itinerary ti where ti.tour_id = t.id
);

-- 5. Inquiries (lead). RLS on TANPA policy publik:
-- baca/tulis hanya via SERVICE ROLE dari Server Actions.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null default '',
  name text null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
