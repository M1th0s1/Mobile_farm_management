import type { Batch, Customer, Expense, MortalityRecord, Order, SalesFilter } from "@/types";
import { parseDate } from "@/utils/date";

/** Krátke názvy mesiacov (slovensky) */
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"];

export type SeriesPoint = { label: string; a: number; b: number };

/** Vráti názov haly z id turnusu (napr. „Malá hala" z „Turnus: 01/2026 (Malá hala)"). */
export function hallOf(batchId: string): string {
  const m = batchId.match(/\(([^)]+)\)/);
  return m?.[1]?.trim() ?? "";
}

/** Kód turnusu z id („01/2026") */
export function codeOf(batchId: string): string {
  return batchId.match(/(\d{2}\/\d{4})/)?.[1] ?? batchId;
}

/**
 * Tržby (odovzdané + zaplatené) a náklady po mesiacoch.
 * – filter „rok" → mesiace roka; „mesiac" → jeden mesiac; „všetko" → roky.
 */
export function financeMonthly(orders: Order[], expenses: Expense[], filter: SalesFilter | undefined): SeriesPoint[] {
  const isAll = !filter || filter.type === "all" || filter.type === "range";
  const year = filter && (filter.type === "year" || filter.type === "month") ? Number(filter.year) : null;
  const month = filter && filter.type === "month" ? filter.month : null;
  const rangeFrom = filter && filter.type === "range" ? parseDate(filter.from) : null;
  const rangeTo = filter && filter.type === "range" ? parseDate(filter.to) : null;

  const map = new Map<string, SeriesPoint>();
  const ensure = (key: string, label: string) => {
    let p = map.get(key);
    if (!p) { p = { label, a: 0, b: 0 }; map.set(key, p); }
    return p;
  };
  const inc = (dateStr: string, amount: number, kind: "a" | "b") => {
    const d = parseDate(dateStr);
    if (!d) return;
    if (rangeFrom && d < rangeFrom) return;
    if (rangeTo && d > rangeTo) return;
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    if (year !== null && y !== year) return;
    if (month !== null && String(m).padStart(2, "0") !== month) return;
    const key = isAll ? `${y}` : `${y}-${String(m).padStart(2, "0")}`;
    const label = isAll ? `${y}` : MONTHS_SHORT[d.getMonth()];
    ensure(key, label)[kind] += amount;
  };

  orders
    .filter(o => o.status === "delivered" && o.paid !== undefined)
    .forEach(o => inc(o.date, o.paid ?? 0, "a"));
  expenses.forEach(e => inc(e.date, e.amount, "b"));

  return [...map.entries()].sort((x, y) => (x[0] < y[0] ? -1 : 1)).map(([, v]) => v);
}

/** Tržby (odovzdané + zaplatené) po posledných N mesiacoch vrátane nulových. */
export function revenueTrend(orders: Order[], months = 6): { label: string; val: number }[] {
  const now = new Date();
  const buckets: { key: string; label: string }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: MONTHS_SHORT[d.getMonth()],
    });
  }
  const vals = new Map<string, number>();
  orders
    .filter(o => o.status === "delivered" && o.paid !== undefined)
    .forEach(o => {
      const d = parseDate(o.date);
      if (!d) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      vals.set(key, (vals.get(key) ?? 0) + (o.paid ?? 0));
    });
  return buckets.map(b => ({ label: b.label, val: vals.get(b.key) ?? 0 }));
}

/** Úhyn po mesiacoch (z reálnych záznamov) – posledných 8 mesiacov. */
export function mortalityMonthly(mortalities: MortalityRecord[]): { label: string; val: number }[] {
  const map = new Map<string, { label: string; val: number }>();
  mortalities.forEach(r => {
    const d = parseDate(r.recordedAt);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const cur = map.get(key) ?? { label: MONTHS_SHORT[d.getMonth()], val: 0 };
    cur.val += r.count;
    map.set(key, cur);
  });
  return [...map.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : 1))
    .slice(-8)
    .map(([, v]) => v);
}

/** Priemerný úhyn % z nakúpených kusov naprieč turnusmi. */
export function avgMortality(batches: Batch[]): number | null {
  let initial = 0;
  let lost = 0;
  batches.forEach(b => {
    const init = b.initialCount ?? b.count + b.mortality;
    initial += init;
    lost += b.mortality;
  });
  if (initial <= 0) return null;
  return (lost / initial) * 100;
}

/** Aktívne kusy a obsadenosť hál. */
export type HallStat = { name: string; capacity: number; used: number; pct: number };

const FALLBACK_CAPACITY: Record<string, number> = { "Malá hala": 400, "Veľká hala": 700 };

export function hallUsage(batches: Batch[], halls: { name: string; capacity: number }[]): HallStat[] {
  const names = Array.from(new Set([
    ...halls.map(h => h.name),
    ...batches.map(b => hallOf(b.id)).filter(Boolean),
  ]));
  return names.map(name => {
    const used = batches
      .filter(b => !b.endedAt && hallOf(b.id) === name)
      .reduce((s, b) => s + b.count, 0);
    const capacity = halls.find(h => h.name === name)?.capacity ?? FALLBACK_CAPACITY[name] ?? 500;
    return { name, capacity, used, pct: capacity > 0 ? Math.min(100, Math.round((used / capacity) * 100)) : 0 };
  }).sort((a, b) => a.name.localeCompare(b.name, "sk"));
}

/** Rebríček zákazníkov podľa objednaných kusov. */
export function topCustomers(customers: Customer[]): Customer[] {
  return [...customers].sort((a, b) => b.ordered - a.ordered);
}

/** Výkonnosť turnusov pre tabuľku. */
export type BatchStat = {
  code: string;
  hall: string;
  phase: string;
  day: number | null;
  ended: boolean;
  count: number;
  mortalityPct: number | null;
  preorderPct: number | null;
  unitPrice: number | null;
};

export function batchPerformance(batches: Batch[]): BatchStat[] {
  return batches.map(b => {
    const init = b.initialCount ?? b.count + b.mortality;
    const ordered = b.sales?.ordered ?? 0;
    const toSell = b.sales?.toSell ?? 0;
    const planned = ordered + toSell;
    return {
      code: codeOf(b.id),
      hall: hallOf(b.id),
      phase: b.phase,
      day: b.endedAt ? null : b.day,
      ended: !!b.endedAt,
      count: b.count,
      mortalityPct: init > 0 ? (b.mortality / init) * 100 : null,
      preorderPct: planned > 0 ? (ordered / planned) * 100 : null,
      unitPrice: b.purchasePrice != null && b.initialCount ? b.purchasePrice / b.initialCount : null,
    };
  });
}
