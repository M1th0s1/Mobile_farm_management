-- ============================================================
-- Farm Management Dashboard – migrácia 0005
-- Nákup kurčiat (cena pri vytvorení turnusu) sa automaticky
-- účtuje ako výdavok kategórie 'kurcata'.
-- Spusti v Supabase SQL Editore.
-- ============================================================

alter table public.expenses drop constraint if exists expenses_category_check;
alter table public.expenses add constraint expenses_category_check
  check (category in ('krmivo','lek','material','kurcata','ine'));
