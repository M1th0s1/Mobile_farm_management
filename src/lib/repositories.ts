import { supabase } from "./supabase";
import type { Batch, Customer, Expense, MortalityRecord, Order, OrderItem, OrderStatus } from "@/types";

const PHASE_LABELS: Record<string, string> = { starter: "Štartér", growth: "Rast", slaughter: "Porážka" };
const PRODUCT_LABELS: Record<string, string> = { cele: "Celé kura", porcie: "Naporcované kura", prsia: "Len prsia" };

// ---------- pomocné ----------
function toAppDate(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
function toIsoDate(app: string): string {
  const [d, m, y] = app.split(".");
  return `${y}-${m}-${d}`;
}
function daysSince(iso: string): number {
  const [y, m, d] = iso.split("-");
  const start = new Date(Number(y), Number(m) - 1, Number(d));
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
}
function toDisplayId(code: string, hallName?: string | null): string {
  return `Turnus: ${code} (${hallName ?? ""})`;
}

// ---------- BATCHES ----------
export async function fetchBatches(): Promise<Batch[]> {
  const [res, salesRes] = await Promise.all([
    supabase!.from("batches").select("*, halls(name)").order("started_at", { ascending: false }),
    supabase!.from("batch_sales").select("batch_id, ordered, to_sell"),
  ]);
  if (res.error) throw res.error;
  const salesMap = new Map<string, { ordered: number; toSell: number }>();
  (salesRes.data ?? []).forEach((s: any) => {
    salesMap.set(s.batch_id, { ordered: s.ordered ?? 0, toSell: s.to_sell ?? 0 });
  });
  return (res.data ?? []).map((r: any): Batch => {
    const hallName = r.halls?.name ?? "";
    return {
      dbId: r.id,
      id: toDisplayId(r.code, hallName),
      phase: r.phase,
      phaseLabel: PHASE_LABELS[r.phase] ?? r.phase,
      day: daysSince(r.started_at),
      feed: r.feed_type,
      count: r.current_count,
      mortality: r.mortality,
      purchaseDate: toAppDate(r.started_at),
      slaughterRange: r.slaughter_start
        ? (r.slaughter_end && r.slaughter_end !== r.slaughter_start
            ? `${toAppDate(r.slaughter_start)} – ${toAppDate(r.slaughter_end)}`
            : toAppDate(r.slaughter_start))
        : undefined,
      slaughterDate: toAppDate(r.slaughter_start),
      endedAt: toAppDate(r.ended_at),
      sales: salesMap.get(r.id) ?? { ordered: 0, toSell: r.current_count },
    };
  });
}

export async function recordMortality(dbId: string, count: number): Promise<void> {
  const { error } = await supabase!.rpc("record_mortality", { p_batch_id: dbId, p_count: count });
  if (error) throw error;
}

export async function fetchMortalities(): Promise<MortalityRecord[]> {
  const { data, error } = await supabase!
    .from("mortalities")
    .select("*, batches(code)")
    .order("recorded_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []).map((r: any) => ({
    dbId: r.id,
    batchId: r.batch_id,
    batchCode: r.batches?.code ?? "",
    recordedAt: toAppDate(r.recorded_at) ?? "",
    count: r.count,
  }));
}

export async function fetchHalls(): Promise<{ name: string; capacity: number }[]> {
  const { data, error } = await supabase!.from("halls").select("name, capacity").order("name");
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ name: r.name, capacity: r.capacity }));
}

/** Vytvorí nový turnus (fáza starter) s automatickým kódom NN/YYYY */
export async function createBatch(data: { count: number; startedAt: string; hallName?: string; feed?: string }): Promise<void> {
  const year = new Date().getFullYear().toString();
  const { data: existing, error: qErr } = await supabase!
    .from("batches")
    .select("code")
    .ilike("code", `%/${year}`);
  if (qErr) throw qErr;
  const nums = (existing ?? [])
    .map((r: any) => parseInt(String(r.code).split("/")[0]))
    .filter(n => !isNaN(n));
  const code = `${(Math.max(0, ...nums) + 1).toString().padStart(2, "0")}/${year}`;

  let hallId: string | null = null;
  if (data.hallName) {
    const { data: hall } = await supabase!.from("halls").select("id").eq("name", data.hallName).maybeSingle();
    hallId = hall?.id ?? null;
  }

  const { error } = await supabase!.from("batches").insert({
    code,
    phase: "starter",
    feed_type: data.feed ?? "",
    initial_count: data.count,
    current_count: data.count,
    mortality: 0,
    started_at: data.startedAt,
  });
  if (error) throw error;
}

/** Ukončí turnus (ended_at = dnes) */
export async function endBatch(dbId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase!.from("batches").update({ ended_at: today }).eq("id", dbId);
  if (error) throw error;
}

/** Upraví turnus (počet, krmivo, plánovaná porážka) */
export async function updateBatch(dbId: string, data: { count?: number; feed?: string; slaughterDate?: string }): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (data.count !== undefined) patch.current_count = data.count;
  if (data.feed !== undefined) patch.feed_type = data.feed;
  if (data.slaughterDate !== undefined) {
    patch.slaughter_start = data.slaughterDate || null;
    patch.slaughter_end = null;
  }
  const { error } = await supabase!.from("batches").update(patch).eq("id", dbId);
  if (error) throw error;
}

/** Zmaže turnus (objednávky sa odpoja cez set null, úhyny/porážky cascade) */
export async function deleteBatch(dbId: string): Promise<void> {
  const { error } = await supabase!.from("batches").delete().eq("id", dbId);
  if (error) throw error;
}

// ---------- CUSTOMERS ----------
export async function fetchCustomers(): Promise<Customer[]> {
  const [res, statsRes] = await Promise.all([
    supabase!.from("customers").select("*").order("name"),
    supabase!.from("customer_stats").select("customer_id, total_qty"),
  ]);
  if (res.error) throw res.error;
  const statMap = new Map<string, number>();
  (statsRes.data ?? []).forEach((s: any) => statMap.set(s.customer_id, s.total_qty ?? 0));
  return (res.data ?? []).map((r: any): Customer => ({
    dbId: r.id,
    name: r.name,
    phone: r.phone ?? "",
    ordered: statMap.get(r.id) ?? 0,
    status: r.status,
  }));
}

export async function insertCustomer(c: { name: string; phone: string; status: string }): Promise<void> {
  const { error } = await supabase!.from("customers").insert({ name: c.name, phone: c.phone, status: c.status });
  if (error) throw error;
}

export async function updateCustomer(dbId: string, data: { name: string; phone: string; status: string }): Promise<void> {
  const { error } = await supabase!.from("customers")
    .update({ name: data.name, phone: data.phone, status: data.status })
    .eq("id", dbId);
  if (error) throw error;
}

export async function deleteCustomer(dbId: string): Promise<void> {
  const { error } = await supabase!.from("customers").delete().eq("id", dbId);
  if (error) throw error;
}

// ---------- EXPENSES ----------
export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase!.from("expenses").select("*").order("expense_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any): Expense => ({
    dbId: r.id,
    category: r.category,
    name: r.name,
    amount: Number(r.amount),
    date: toAppDate(r.expense_date) ?? "",
  }));
}

export async function insertExpense(e: { category: string; name: string; amount: number; date: string }): Promise<void> {
  const { error } = await supabase!.from("expenses").insert({
    category: e.category,
    name: e.name,
    amount: e.amount,
    expense_date: toIsoDate(e.date),
  });
  if (error) throw error;
}

// ---------- ORDERS ----------
export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase!
    .from("orders")
    .select("*, customers(name), batches(code), order_items(product_key, qty)")
    .order("order_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any): Order => {
    const items = (r.order_items ?? []).map((i: any) => ({ productKey: i.product_key, qty: i.qty }));
    const qty = items.reduce((s: number, i: { qty: number }) => s + i.qty, 0);
    const productType = items
      .map((i: { productKey: string }) => PRODUCT_LABELS[i.productKey] ?? i.productKey)
      .join(" + ");
    return {
      dbId: r.id,
      id: r.number,
      customer: r.customers?.name ?? "—",
      items,
      productType,
      qty,
      note: r.note ?? "",
      paid: r.paid_amount ? Number(r.paid_amount) : undefined,
      date: toAppDate(r.order_date) ?? "",
      status: r.status,
      turnus: r.batches?.code ?? "",
    };
  });
}

export async function insertOrder(o: Order): Promise<void> {
  const [custRes, batchRes] = await Promise.all([
    supabase!.from("customers").select("id").eq("name", o.customer).maybeSingle(),
    supabase!.from("batches").select("id").eq("code", o.turnus).maybeSingle(),
  ]);
  const { data, error } = await supabase!.from("orders")
    .insert({
      customer_id: custRes.data?.id,
      batch_id: batchRes.data?.id ?? null,
      number: o.id,
      status: o.status,
      note: o.note,
      paid_amount: o.paid ?? 0,
      order_date: toIsoDate(o.date),
    })
    .select("id")
    .single();
  if (error) throw error;
  if (o.items.length > 0) {
    const { error: insErr } = await supabase!.from("order_items").insert(
      o.items.map(i => ({ order_id: data.id, product_key: i.productKey, qty: i.qty, unit_price: 0 }))
    );
    if (insErr) throw insErr;
  }
}

export async function updateOrderStatus(dbId: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase!.from("orders").update({ status }).eq("id", dbId);
  if (error) throw error;
}

export async function updateOrderPaid(dbId: string, paid: number | undefined): Promise<void> {
  const { error } = await supabase!.from("orders").update({ paid_amount: paid ?? 0 }).eq("id", dbId);
  if (error) throw error;
}

export async function updateOrderDetails(dbId: string, items: OrderItem[], note: string): Promise<void> {
  const { error } = await supabase!.from("orders").update({ note }).eq("id", dbId);
  if (error) throw error;
  const { error: delErr } = await supabase!.from("order_items").delete().eq("order_id", dbId);
  if (delErr) throw delErr;
  if (items.length > 0) {
    const { error: insErr } = await supabase!.from("order_items").insert(
      items.map(i => ({ order_id: dbId, product_key: i.productKey, qty: i.qty, unit_price: 0 }))
    );
    if (insErr) throw insErr;
  }
}

export async function deleteOrder(dbId: string): Promise<void> {
  const { error } = await supabase!.from("orders").delete().eq("id", dbId);
  if (error) throw error;
}

