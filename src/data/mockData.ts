/**
 * Statické/mock dáta aplikácie.
 */
import type { Batch, Customer, CustomerHistory, Order } from "@/types";

export const initialBatches: Batch[] = [
  {
    id: "Turnus: 01/2026 (Malá hala)",
    phase: "starter",
    phaseLabel: "Štartér",
    day: 8,
    feed: "BR1 (Štartér)",
    count: 320,
    mortality: 5,
    purchaseDate: "23.08.2026",
    slaughterRange: "28.09. – 05.10.2026",
  },
  {
    id: "Turnus: 02/2026 (Veľká hala)",
    phase: "growth",
    phaseLabel: "Rast",
    day: 20,
    feed: "BR2 (Rast)",
    count: 485,
    mortality: 12,
    purchaseDate: "11.08.2026",
    slaughterRange: "15.09. – 22.09.2026",
  },
  {
    id: "Turnus: 03/2026 (Veľká hala)",
    phase: "slaughter",
    phaseLabel: "Porážka",
    day: 36,
    feed: "BR3 (Finiš)",
    count: 418,
    mortality: 8,
    purchaseDate: "26.07.2026",
    slaughterRange: "30.08. – 05.09.2026",
  },
];

/** Predaj po turnusoch (dashboard batch karty) */
export const batchSales = [
  { ordered: 120, toSell: 200 },
  { ordered: 180, toSell: 305 },
  { ordered: 110, toSell: 70  },
];

export const initialCustomers: Customer[] = [
  { name: "Martin Novák",    phone: "+421 903 123 456", ordered: 50,  status: "active" },
  { name: "Jana Kováčová",   phone: "+421 911 654 321", ordered: 120, status: "active" },
  { name: "Peter Horváth",   phone: "+421 908 321 654", ordered: 80,  status: "pending" },
  { name: "Mária Slobodová", phone: "+421 944 456 789", ordered: 35,  status: "inactive" },
  { name: "Ján Blaho",       phone: "+421 917 789 012", ordered: 200, status: "active" },
];

export const customerHistory: CustomerHistory = {
  "Martin Novák":    [{ date: "30.08.2026", turnus: "02/2026", qty: 50,  status: "pending"   }, { date: "15.05.2026", turnus: "01/2025", qty: 40, status: "delivered" }],
  "Jana Kováčová":   [{ date: "28.08.2026", turnus: "02/2026", qty: 60,  status: "confirmed" }, { date: "10.03.2026", turnus: "01/2026", qty: 60, status: "delivered" }],
  "Peter Horváth":   [{ date: "05.09.2026", turnus: "03/2026", qty: 80,  status: "pending"   }],
  "Mária Slobodová": [{ date: "10.09.2026", turnus: "03/2026", qty: 35,  status: "pending"   }, { date: "20.01.2026", turnus: "00/2025", qty: 30, status: "delivered" }, { date: "05.11.2025", turnus: "03/2025", qty: 25, status: "delivered" }],
  "Ján Blaho":       [{ date: "02.09.2026", turnus: "03/2026", qty: 120, status: "confirmed" }, { date: "18.06.2026", turnus: "02/2026", qty: 80, status: "delivered" }],
};

export const initialOrders: Order[] = [
  { id: "OBJ-001", customer: "Jana Kováčová",   items: [{ productKey: "cele", qty: 60 }],                              productType: "Celé kura",        qty: 60,  note: "",                    date: "28.08.2026", status: "confirmed", turnus: "02/2026" },
  { id: "OBJ-002", customer: "Martin Novák",    items: [{ productKey: "porcie", qty: 50 }],                            productType: "Naporcované kura", qty: 50,  note: "Bez stehien prosím",  date: "30.08.2026", status: "pending",   turnus: "02/2026" },
  { id: "OBJ-003", customer: "Ján Blaho",       items: [{ productKey: "cele", qty: 80 }, { productKey: "prsia", qty: 40 }], productType: "Celé kura + Len prsia", qty: 120, note: "",         date: "02.09.2026", status: "confirmed", turnus: "03/2026" },
  { id: "OBJ-004", customer: "Peter Horváth",   items: [{ productKey: "prsia", qty: 80 }],                             productType: "Len prsia",        qty: 80,  note: "",                    date: "05.09.2026", status: "pending",   turnus: "03/2026" },
  { id: "OBJ-005", customer: "Mária Slobodová", items: [{ productKey: "porcie", qty: 35 }],                            productType: "Naporcované kura", qty: 35,  note: "Vakuované",           date: "10.09.2026", status: "delivered", turnus: "01/2026" },
];

/** Nákupy (statické – fallback, live dáta prichádzajú cez props) */
export const purchases = [
  { category: "krmivo",   name: "Krmivo BR2 — 200 kg",    amount: 98.00,  date: "19.08.2026" },
  { category: "lek",      name: "Vitamíny — Brovit 1L",    amount: 24.50,  date: "17.08.2026" },
  { category: "material", name: "Podstielka — 50 balení",  amount: 65.00,  date: "15.08.2026" },
  { category: "krmivo",   name: "Krmivo BR1 — 100 kg",    amount: 52.00,  date: "10.08.2026" },
  { category: "lek",      name: "Dezinfekcia Virkon 5 kg", amount: 38.90,  date: "08.08.2026" },
  { category: "material", name: "Žiarovky — 20 ks",        amount: 18.40,  date: "05.08.2026" },
];

export const slaughterPlans = [
  { turnus: "03/2026 (Veľká hala)", date: "25.08.2026", qty: 418, day: 36, daysLeft: 5 },
  { turnus: "02/2026 (Veľká hala)", date: "12.09.2026", qty: 485, day: 20, daysLeft: 22 },
  { turnus: "01/2026 (Malá hala)",  date: "28.09.2026", qty: 320, day: 8,  daysLeft: 38 },
];

export const mortalityWeeks = [
  { label: "T1", val: 3 }, { label: "T2", val: 7 }, { label: "T3", val: 5 },
  { label: "T4", val: 12 }, { label: "T5", val: 8 }, { label: "T6", val: 4 },
];

export const revenueMonths = [
  { label: "Mar", val: 820 }, { label: "Apr", val: 1240 }, { label: "Máj", val: 980 },
  { label: "Jún", val: 1560 }, { label: "Júl", val: 1320 }, { label: "Aug", val: 1140 },
];

/** Mená mesiacov (slovensky) */
export const MONTH_NAMES = ["Január","Február","Marec","Apríl","Máj","Jún","Júl","August","September","Október","November","December"];