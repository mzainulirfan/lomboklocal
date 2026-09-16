-- Lombok Local · kode referensi booking di leads
-- Cara pakai: SQL Editor → paste → Run.
-- NULL diizinkan agar leads lama tetap valid; kode baru selalu terisi.

alter table public.inquiries
  add column if not exists ref_code text unique;
