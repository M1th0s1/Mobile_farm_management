-- ============================================================
-- Farm Management Dashboard – Seed (ukážkové dáta)
-- SPUSTI AŽ PO REGISTRÁCII užívateľa (aby existovala farma).
-- Dáta sa vložia do NAJNOVŠEJ farmy (aktuálny účet).
-- ============================================================

-- ---------- HÁLY ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.halls (farm_id, name, capacity)
select f.id, v.name, v.capacity::int
from f cross join (values
  ('Veľká hala', 700),
  ('Malá hala', 400)
) as v(name, capacity);

-- ---------- PRODUKTY (cenník) ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.products (farm_id, key, label, unit_price)
select f.id, v.key, v.label, v.price::numeric
from f cross join (values
  ('cele',   'Celé kura',         2.85),
  ('porcie', 'Naporcované kura',  3.20),
  ('prsia',  'Len prsia',         4.50)
) as v(key, label, price);

-- ---------- TURNUSY ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.batches (farm_id, hall_id, code, phase, feed_type, initial_count, current_count, mortality, started_at, slaughter_start, slaughter_end)
select f.id, h.id, v.code, v.phase, v.feed, v.initial::int, v.current::int, v.mortality::int, v.start::date, v.s_start::date, v.s_end::date
from f
cross join (values
  ('01/2026', 'starter',   'BR1 (Štartér)', 325, 320, 5,  '2026-08-23', '2026-09-28', '2026-10-05', 'Malá hala'),
  ('02/2026', 'growth',    'BR2 (Rast)',    497, 485, 12, '2026-08-11', '2026-09-15', '2026-09-22', 'Veľká hala'),
  ('03/2026', 'slaughter', 'BR3 (Finiš)',   426, 418, 8,  '2026-07-26', '2026-08-30', '2026-09-05', 'Veľká hala')
) as v(code, phase, feed, initial, current, mortality, start, s_start, s_end, hall)
join public.halls h on h.farm_id = f.id and h.name = v.hall;

-- ---------- ZÁKAZNÍCI ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.customers (farm_id, name, phone, status)
select f.id, v.name, v.phone, v.status
from f cross join (values
  ('Martin Novák',    '+421 903 123 456', 'active'),
  ('Jana Kováčová',   '+421 911 654 321', 'active'),
  ('Peter Horváth',   '+421 908 321 654', 'pending'),
  ('Mária Slobodová', '+421 944 456 789', 'inactive'),
  ('Ján Blaho',       '+421 917 789 012', 'active')
) as v(name, phone, status);

-- ---------- OBJEDNÁVKY ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.orders (farm_id, customer_id, batch_id, number, status, note, paid_amount, order_date)
select f.id, c.id, b.id, v.number, v.status, v.note, v.paid::numeric, v.odate::date
from f
cross join (values
  ('OBJ-001', 'Jana Kováčová',   '02/2026', 'confirmed', '',                   0,    '2026-08-28'),
  ('OBJ-002', 'Martin Novák',    '02/2026', 'pending',   'Bez stehien prosím', 0,    '2026-08-30'),
  ('OBJ-003', 'Ján Blaho',       '03/2026', 'confirmed', '',                   0,    '2026-09-02'),
  ('OBJ-004', 'Peter Horváth',   '03/2026', 'pending',   '',                   0,    '2026-09-05'),
  ('OBJ-005', 'Mária Slobodová', '01/2026', 'delivered', 'Vakuované',          0,    '2026-09-10')
) as v(number, customer, turnus, status, note, paid, odate)
join public.customers c on c.farm_id = f.id and c.name = v.customer
join public.batches b on b.farm_id = f.id and b.code = v.turnus;

-- ---------- POLOŽKY OBJEDNÁVOK ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.order_items (order_id, product_key, qty, unit_price)
select o.id, v.key, v.qty::int, p.unit_price
from f
cross join (values
  ('OBJ-001', 'cele',   60),
  ('OBJ-002', 'porcie', 50),
  ('OBJ-003', 'cele',   80),
  ('OBJ-003', 'prsia',  40),
  ('OBJ-004', 'prsia',  80),
  ('OBJ-005', 'porcie', 35)
) as v(number, key, qty)
join public.orders o on o.farm_id = f.id and o.number = v.number
join public.products p on p.farm_id = f.id and p.key = v.key;

-- ---------- VÝDAVKY ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.expenses (farm_id, category, name, amount, expense_date)
select f.id, v.category, v.name, v.amount::numeric, v.edate::date
from f cross join (values
  ('krmivo',   'Krmivo BR2 — 85 kg',     42.50, '2026-08-19'),
  ('lek',      'Vitamíny — Brovit 1L',   24.50, '2026-08-17'),
  ('material', 'Podstielka — 50 balení', 65.00, '2026-08-15'),
  ('krmivo',   'Krmivo BR2 — 200 kg',    98.00, '2026-08-19'),
  ('lek',      'Dezinfekcia Virkon 5 kg', 38.90, '2026-08-08'),
  ('material', 'Žiarovky — 20 ks',       18.40, '2026-08-05')
) as v(category, name, amount, edate);

-- ---------- PLÁNY PORÁŽOK ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.slaughter_plans (batch_id, scheduled_date, planned_qty)
select b.id, v.sdate::date, v.qty::int
from f
cross join (values
  ('03/2026', '2026-08-25', 418),
  ('02/2026', '2026-09-12', 485),
  ('01/2026', '2026-09-28', 320)
) as v(code, sdate, qty)
join public.batches b on b.farm_id = f.id and b.code = v.code;

-- ---------- CHECKLIST (k najbližšej porážke) ----------
with f as (select id from public.farms order by created_at desc limit 1)
insert into public.slaughter_tasks (slaughter_plan_id, label, done)
select p.id, v.label, v.done
from f
cross join (values
  ('Kontaktovať jatky',              true),
  ('Pripraviť klietky na prepravu',  true),
  ('Objednať kamión',                false),
  ('Informovať zákazníkov',          false),
  ('Vystaviť faktúry',               false)
) as v(label, done)
join public.slaughter_plans p on p.scheduled_date = (select min(scheduled_date) from public.slaughter_plans);

