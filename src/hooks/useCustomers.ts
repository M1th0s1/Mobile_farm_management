import { useEffect, useState } from "react";
import { fetchCustomers, insertCustomer } from "@/lib/repositories";
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

  return { customers, addCustomer };
}
