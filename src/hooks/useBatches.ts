import { useEffect, useState } from "react";
import { fetchBatches, recordMortality as dbRecordMortality } from "@/lib/repositories";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { initialBatches, batchSales } from "@/data/mockData";
import type { Batch } from "@/types";

const mockWithSales = initialBatches.map((b, i) => ({
  ...b,
  sales: batchSales[i] ?? { ordered: 0, toSell: 0 },
}));

export function useBatches(enabled: boolean) {
  const [batches, setBatches] = useState<Batch[]>(mockWithSales);

  const reload = () => {
    fetchBatches()
      .then(d => setBatches(d))
      .catch(err => console.error("useBatches:", err));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !enabled) return;
    reload();
    const channel = supabase!
      .channel("db-batches")
      .on("postgres_changes", { event: "*", schema: "public", table: "batches" }, reload)
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  /** displayId = b.id (napr. "Turnus: 02/2026 (Veľká hala)") */
  const recordMortality = (displayId: string, count: number) => {
    setBatches(prev => prev.map(b =>
      b.id === displayId
        ? { ...b, count: Math.max(0, b.count - count), mortality: b.mortality + count }
        : b
    ));
    const row = batches.find(b => b.id === displayId);
    if (isSupabaseConfigured && row?.dbId) {
      dbRecordMortality(row.dbId, count).catch(err => console.error("recordMortality:", err));
    }
  };

  return { batches, recordMortality };
}
