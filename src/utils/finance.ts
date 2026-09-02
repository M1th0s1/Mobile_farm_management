import type { Expense, Order, SalesFilter } from "@/types";
import { filterByPeriod } from "@/utils/date";

/** Spoločný výpočet financií za zvolené obdobie (Tržby / Náklady / Zisk). */
export function computeFinance(orders: Order[], expenses: Expense[], filter: SalesFilter | undefined) {
  const delivered = filterByPeriod(orders, filter).filter(o => o.status === "delivered" && o.paid !== undefined);
  const totalRevenue = delivered.reduce((s, o) => s + (o.paid ?? 0), 0);
  const deliveredQty = delivered.reduce((s, o) => s + o.qty, 0);
  const totalExpenses = filterByPeriod(expenses, filter).reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  return { delivered, totalRevenue, deliveredQty, totalExpenses, profit };
}

/** Formát meny zhodný so zvyškom appky (desatinná bodka, 2 miesta). */
export function fmtMoney(n: number): string {
  return n.toFixed(2);
}
