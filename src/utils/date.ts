import type { SalesFilter } from "@/types";
import { MONTH_NAMES } from "@/data/mockData";

/** Formátuje Date na DD.MM.RRRR (rovnako ako pôvodný kód v modáloch) */
export function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

/** Parsuje DD.MM.RRRR na Date (alebo null) */
export function parseDate(d: string): Date | null {
  const [dd, mm, yyyy] = d.split(".");
  if (!dd || !mm || !yyyy) return null;
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

/** Filtruje položky s dátumom podľa obdobia */
export function filterByPeriod<T extends { date: string }>(items: T[], f: SalesFilter | undefined): T[] {
  if (!f) return items;
  return items.filter(item => {
    const d = parseDate(item.date);
    if (!d) return false;
    if (f.type === "all") return true;
    if (f.type === "year") return String(d.getFullYear()) === f.year;
    if (f.type === "month") return String(d.getFullYear()) === f.year && String(d.getMonth() + 1).padStart(2, "0") === f.month;
    if (f.type === "range") {
      const from = parseDate(f.from), to = parseDate(f.to);
      return !!from && !!to && d >= from && d <= to;
    }
    return true;
  });
}

/** Filtruje turnusy podľa obdobia (podľa dátumu nákupu `purchaseDate`) */
export function filterBatches<T extends { purchaseDate?: string }>(batches: T[], f: SalesFilter | undefined): T[] {
  if (!f) return batches;
  return batches.filter(b => {
    const d = b.purchaseDate ? parseDate(b.purchaseDate) : null;
    if (!d) return false;
    if (f.type === "all") return true;
    if (f.type === "year") return String(d.getFullYear()) === f.year;
    if (f.type === "month") return String(d.getFullYear()) === f.year && String(d.getMonth() + 1).padStart(2, "0") === f.month;
    if (f.type === "range") {
      const from = parseDate(f.from), to = parseDate(f.to);
      return !!from && !!to && d >= from && d <= to;
    }
    return true;
  });
}

/** Popis aktívneho filtra */
export function filterLabel(f: SalesFilter): string {
  if (f.type === "all") return "Všetky obdobia";
  if (f.type === "year") return f.year;
  if (f.type === "month") return `${MONTH_NAMES[Number(f.month) - 1]} ${f.year}`;
  if (f.type === "range") return `${f.from} – ${f.to}`;
  return "";
}

/** Počet dní od dnes do dátumu (DD.MM.RRRR). null = neplatný dátum */
export function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const [d, m, y] = dateStr.split(".");
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  if (isNaN(dt.getTime())) return null;
  dt.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((dt.getTime() - today.getTime()) / 86400000);
}

/** Text „Ostáva: X dní" / „Dnes" / „Prebehla" podľa dátumu */
export function daysLeftLabel(dateStr?: string): string | null {
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days > 0) return `Ostáva: ${days} dní`;
  if (days === 0) return "Dnes";
  return "Prebehla";
}