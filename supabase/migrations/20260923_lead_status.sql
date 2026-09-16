-- Lombok Local · status pipeline leads
-- Cara pakai: SQL Editor → paste → Run.

alter table public.inquiries
  add column if not exists status text not null default 'baru'
  check (status in ('baru', 'dihubungi', 'deal', 'batal'));

create index if not exists inquiries_status_idx
  on public.inquiries (status, created_at desc);
