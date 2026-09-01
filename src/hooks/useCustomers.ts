import { useEffect, useState } from "react";
import {
  fetchCustomers,
  insertCustomer,
  updateCustomer as dbUpdateCustomer,
  deleteCustomer as dbDeleteCustomer,
} from "@/lib/repositories";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { initialCustomers } from "@/data/mockData";
import type { Customer } from "@/types";

export function useCustomers(enabled: boolean) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const reload = () => {
    fetchCustomers()
      .then(d => setCustomers(d))
      .catch(err => console.error("useCustomers:", err));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !enabled) return;
    reload();
    const channel = supabase!
      .channel("db-customers")
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, reload)
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const addCustomer = (c: Customer) => {
    setCustomers(prev => [c, ...prev]);
    if (isSupabaseConfigured) {
      insertCustomer(c).then(reload).catch(err => console.error("addCustomer:", err));
    }
  };

  const updateCustomer = (c: Customer, data: { name: string; phone: string; status: string }) => {
    setCustomers(prev =>
      prev.map(x => (x.dbId === c.dbId ? { ...x, name: data.name, phone: data.phone, status: data.status } : x))
    );
    if (isSupabaseConfigured && c.dbId) {
      dbUpdateCustomer(c.dbId, data).then(reload).catch(err => console.error("updateCustomer:", err));
    }
  };

  const deleteCustomer = (c: Customer) => {
    setCustomers(prev => prev.filter(x => x.dbId !== c.dbId));
    if (isSupabaseConfigured && c.dbId) {
      dbDeleteCustomer(c.dbId).catch(err => console.error("deleteCustomer:", err));
    }
  };

  return { customers, addCustomer, updateCustomer, deleteCustomer };
}
