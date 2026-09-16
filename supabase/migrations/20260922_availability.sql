-- Lombok Local · blokir ketersediaan per tanggal
-- Cara pakai: SQL Editor → paste → Run.
-- item_type: 'vehicle' | 'tour'. item_id = id baris di tabel vehicles/tours.

create table if not exists public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  item_type text not null check (item_type in ('vehicle', 'tour')),
  item_id uuid not null,
  date date not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (item_type, item_id, date)
);
alter table public.availability_blocks enable row level security;
drop policy if exists "Public read blocks" on public.availability_blocks;
create policy "Public read blocks"
  on public.availability_blocks for select using (true);
create index if not exists availability_lookup_idx
  on public.availability_blocks (item_type, item_id, date);
