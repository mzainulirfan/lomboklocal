-- Lombok Local · homepage hero settings + gallery
-- Cara pakai: SQL Editor → paste → Run.

-- 1. Hero homepage via settings (kosong = pakai default web)
insert into public.site_settings (key, value) values
  ('hero_image_url', ''),
  ('hero_image_alt', '')
on conflict (key) do nothing;

-- 2. Galeri homepage
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null default '',
  alt text not null default '',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.gallery_images enable row level security;
drop policy if exists "Public read gallery" on public.gallery_images;
create policy "Public read gallery"
  on public.gallery_images for select using (true);

-- Seed 4 foto awal (sama dengan konten statis saat ini)
insert into public.gallery_images (image_url, alt, sort_order)
select * from (values
  ('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', 'Lombok coastline', 1),
  ('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'Turquoise beach', 2),
  ('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80', 'Surfing in Lombok', 3),
  ('https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&q=80', 'Waterfall in Lombok', 4)
) as s(image_url, alt, sort_order)
where not exists (select 1 from public.gallery_images);
