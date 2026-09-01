-- ============================================================
-- Farm Management Dashboard – migrácia 0003
-- Turnusy: pridanie stĺpca ended_at (ukončený turnus).
-- Spusti v Supabase SQL Editore.
-- ============================================================

alter table public.batches add column if not exists ended_at date;
