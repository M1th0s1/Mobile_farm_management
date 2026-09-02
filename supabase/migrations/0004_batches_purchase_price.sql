-- ============================================================
-- Farm Management Dashboard – migrácia 0004
-- Turnusy: pridanie stĺpca purchase_price (cena za celý nákup).
-- Spusti v Supabase SQL Editore.
-- ============================================================

alter table public.batches add column if not exists purchase_price numeric(10,2);
