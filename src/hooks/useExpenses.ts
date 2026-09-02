import { useEffect, useState } from "react";
import {
  fetchExpenses,
  insertExpense as dbInsertExpense,
} from "@/lib/repositories";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Expense } from "@/types";

const initialExpenses: Expense[] = [
  { category: "kurcata", name: "Nákup kurčiat – 01/2026", amount: 146.25, date: "23.08.2026" },
  { category: "krmivo",   name: "Krmivo BR2 — 85 kg",    amount: 42.50, date: "19.08.2026" },
  { category: "lek",      name: "Vitamíny — Brovit 1L",   amount: 24.50, date: "17.08.2026" },
  { category: "material", name: "Podstielka — 50 balení", amount: 65.00, date: "15.08.2026" },
];

export function useExpenses(enabled: boolean) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const reload = () => {
    fetchExpenses()
      .then(d => setExpenses(d))
      .catch(err => console.error("useExpenses:", err));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !enabled) return;
    reload();
    const channel = supabase!
      .channel("db-expenses")
      .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, reload)
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const addExpense = (e: Expense) => {
    setExpenses(prev => [e, ...prev]);
    if (isSupabaseConfigured) {
      dbInsertExpense(e).then(reload).catch(err => console.error("addExpense:", err));
    }
  };

  return { expenses, addExpense };
}
