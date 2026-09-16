-- Lombok Local · pembeda singkat kendaraan (chip di kartu)
-- Cara pakai: SQL Editor → paste → Run.

alter table public.vehicles
  add column if not exists highlight text not null default '';
