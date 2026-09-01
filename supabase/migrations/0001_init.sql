-- ============================================================
-- Farm Management Dashboard – Supabase migrácia (0001_init)
-- Spusti v Supabase SQL Editore (celý súbor).
-- ============================================================

-- ---------- HELPERY & TRIGGERY ----------

-- Automatický updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Po registrácii automaticky vytvorí farmu
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.farms (owner_id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'farm_name', 'Moja farma'))
  on conflict (owner_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- TABUĽKY ----------

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists farms_updated_at on public.farms;
create trigger farms_updated_at before update on public.farms
  for each row execute function public.set_updated_at();

-- Vráti id farmy prihláseného užívateľa (pre RLS).
-- MUSÍ byť až po `farms` (language sql sa validuje pri vytvorení).
-- security definer: obíde RLS pri lookupe (inak by bola rekurzia).
create or replace function public.current_farm_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.farms where owner_id = auth.uid() limit 1;
$$;

create table if not exists public.halls (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null default public.current_farm_id() references public.farms(id) on delete cascade,
  name text not null,
  capacity int not null check (capacity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null default public.current_farm_id() references public.farms(id) on delete cascade,
  hall_id uuid references public.halls(id) on delete set null,
  code text not null,
  phase text not null default 'starter' check (phase in ('starter','growth','slaughter')),
  feed_type text not null default '',
  initial_count int not null default 0 check (initial_count >= 0),
  current_count int not null default 0 check (current_count >= 0),
  mortality int not null default 0 check (mortality >= 0),
  started_at date not null,
  slaughter_start date,
  slaughter_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);
drop trigger if exists batches_updated_at on public.batches;
create trigger batches_updated_at before update on public.batches
  for each row execute function public.set_updated_at();

create table if not exists public.mortalities (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  recorded_at date not null default current_date,
  count int not null check (count > 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null default public.current_farm_id() references public.farms(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  status text not null default 'active' check (status in ('active','pending','inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at before update on public.customers
  for each row execute function public.set_updated_at();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null default public.current_farm_id() references public.farms(id) on delete cascade,
  key text not null,
  label text not null,
  unit_price numeric(10,2) not null default 0,
  unique (farm_id, key)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null default public.current_farm_id() references public.farms(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete restrict,
  batch_id uuid references public.batches(id) on delete set null,
  number text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','delivered','cancelled')),
  note text,
  paid_amount numeric(10,2) not null default 0,
  order_date date not null default current_date,
  delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, number)
);
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_key text not null,
  qty int not null check (qty > 0),
  unit_price numeric(10,2) not null default 0
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null default public.current_farm_id() references public.farms(id) on delete cascade,
  category text not null check (category in ('krmivo','lek','material','ine')),
  name text not null,
  amount numeric(10,2) not null check (amount >= 0),
  expense_date date not null default current_date,
  batch_id uuid references public.batches(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.slaughter_plans (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  scheduled_date date not null,
  planned_qty int not null check (planned_qty >= 0),
  status text not null default 'planned' check (status in ('planned','done','cancelled')),
  created_at timestamptz not null default now(),
  unique (batch_id, scheduled_date)
);

create table if not exists public.slaughter_tasks (
  id uuid primary key default gen_random_uuid(),
  slaughter_plan_id uuid not null references public.slaughter_plans(id) on delete cascade,
  label text not null,
  done boolean not null default false
);

-- ---------- VIEWS (derivované dáta) ----------

create or replace view public.customer_stats
with (security_invoker = true) as
  select c.id as customer_id,
         c.farm_id,
         count(distinct o.id) as order_count,
         coalesce(sum(oi.qty), 0)::int as total_qty,
         coalesce(sum(o.paid_amount), 0) as total_paid
  from public.customers c
  left join public.orders o on o.customer_id = c.id
  left join public.order_items oi on oi.order_id = o.id
  group by c.id;

create or replace view public.batch_sales
with (security_invoker = true) as
  select b.id as batch_id,
         b.farm_id,
         coalesce(sum(case when o.status in ('confirmed','delivered') then oi.qty end), 0)::int as ordered,
         b.current_count as to_sell
  from public.batches b
  left join public.orders o on o.batch_id = b.id
  left join public.order_items oi on oi.order_id = o.id
  group by b.id;

-- ---------- RPC FUNKCIE ----------

-- Atómový zápis úhynu: upraví turnus + založí auditný záznam
create or replace function public.record_mortality(p_batch_id uuid, p_count int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_count <= 0 then return; end if;
  update public.batches
    set current_count = greatest(0, current_count - p_count),
        mortality = mortality + p_count,
        updated_at = now()
    where id = p_batch_id;
  insert into public.mortalities (batch_id, recorded_at, count)
    values (p_batch_id, current_date, p_count);
end; $$;

-- ---------- ROW LEVEL SECURITY ----------

alter table public.farms enable row level security;
alter table public.halls enable row level security;
alter table public.batches enable row level security;
alter table public.mortalities enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.expenses enable row level security;
alter table public.slaughter_plans enable row level security;
alter table public.slaughter_tasks enable row level security;

-- farma: vlastník
drop policy if exists "farm_owner_access" on public.farms;
create policy "farm_owner_access" on public.farms
  for all using (id = public.current_farm_id())
  with check (id = public.current_farm_id());

-- tabuľky s farm_id
do $$
declare t text;
begin
  foreach t in array array['halls','batches','customers','products','orders','expenses'] loop
    execute format('drop policy if exists "farm_%s_access" on public.%I', t, t);
    execute format('create policy "farm_%s_access" on public.%I for all using (farm_id = public.current_farm_id()) with check (farm_id = public.current_farm_id())', t, t);
  end loop;
end $$;

-- úhyny cez turnus
drop policy if exists "mortalities_via_batch" on public.mortalities;
create policy "mortalities_via_batch" on public.mortalities
  for all using (exists (select 1 from public.batches b where b.id = mortalities.batch_id and b.farm_id = public.current_farm_id()))
  with check (exists (select 1 from public.batches b where b.id = mortalities.batch_id and b.farm_id = public.current_farm_id()));

-- položky objednávok cez objednávku
drop policy if exists "order_items_via_order" on public.order_items;
create policy "order_items_via_order" on public.order_items
  for all using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.farm_id = public.current_farm_id()))
  with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.farm_id = public.current_farm_id()));

-- checklist porážok cez plán
drop policy if exists "slaughter_tasks_via_plan" on public.slaughter_tasks;
create policy "slaughter_tasks_via_plan" on public.slaughter_tasks
  for all using (exists (
    select 1 from public.slaughter_plans p
    join public.batches b on b.id = p.batch_id
    where p.id = slaughter_tasks.slaughter_plan_id and b.farm_id = public.current_farm_id()))
  with check (exists (
    select 1 from public.slaughter_plans p
    join public.batches b on b.id = p.batch_id
    where p.id = slaughter_tasks.slaughter_plan_id and b.farm_id = public.current_farm_id()));

-- plány porážok cez turnus
drop policy if exists "slaughter_plans_via_batch" on public.slaughter_plans;
create policy "slaughter_plans_via_batch" on public.slaughter_plans
  for all using (exists (
    select 1 from public.batches b where b.id = slaughter_plans.batch_id and b.farm_id = public.current_farm_id()))
  with check (exists (
    select 1 from public.batches b where b.id = slaughter_plans.batch_id and b.farm_id = public.current_farm_id()));


