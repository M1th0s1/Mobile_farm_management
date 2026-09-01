/**
 * Zdieľané TypeScript typy aplikácie.
 */

/** Turnus (batch) hydiny */
export type Phase = "starter" | "growth" | "slaughter";

export type Batch = {
  dbId?: string;             // uuid v Supabase (ak je pripojené)
  id: string;                // zobrazovacie id "Turnus: 01/2026 (Malá hala)"
  phase: Phase;
  phaseLabel: string;
  day: number;
  feed: string;
  count: number;
  mortality: number;
  purchaseDate?: string;
  slaughterRange?: string;
  sales?: { ordered: number; toSell: number };
};

/** Výdavok / nákup */
export type Expense = {
  dbId?: string;
  category: string;
  name: string;
  amount: number;
  date: string;
};

/** Zákazník */
export type Customer = {
  dbId?: string;
  name: string;
  phone: string;
  ordered: number;
  status: string;
};

/** Položka objednávky (produkt × množstvo) */
export type OrderItem = {
  productKey: string;
  qty: number;
};

export type OrderStatus = "confirmed" | "pending" | "delivered";

/** Objednávka */
export type Order = {
  dbId?: string;
  id: string;                // číslo objednávky "OBJ-001"
  customer: string;
  items: OrderItem[];
  productType: string;
  qty: number;
  note: string;
  paid?: number;
  date: string;
  status: OrderStatus;
  turnus: string;
};

/** História objednávok zákazníka */
export type CustomerHistoryEntry = {
  date: string;
  turnus: string;
  qty: number;
  status: string;
};

export type CustomerHistory = Record<string, CustomerHistoryEntry[]>;

/** Filter pre tržby na dashboarde */
export type SalesFilter =
  | { type: "all" }
  | { type: "year"; year: string }
  | { type: "month"; year: string; month: string }
  | { type: "range"; from: string; to: string };