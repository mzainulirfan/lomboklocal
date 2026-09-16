-- Lombok Local · nomor WA pemesan di leads
-- Cara pakai: SQL Editor → paste → Run.

alter table public.inquiries
  add column if not exists phone text not null default '';
