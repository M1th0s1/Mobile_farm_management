-- ============================================================
-- Farm Management Dashboard – migrácia 0002
-- Zákazníka možno zmazať, objednávky ostanú (customer_id = NULL).
-- Spusti v Supabase SQL Editore.
-- ============================================================

alter table public.orders
  drop constraint if exists orders_customer_id_fkey,
  alter column customer_id drop not null;

alter table public.orders
  add constraint orders_customer_id_fkey
    foreign key (customer_id) references public.customers(id) on delete set null;
