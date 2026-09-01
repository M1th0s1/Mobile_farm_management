import { useEffect, useState } from "react";
import {
  fetchBatches,
  fetchMortalities,
  createBatch as dbCreateBatch,
  endBatch as dbEndBatch,
  updateBatch as dbUpdateBatch,
  deleteBatch as dbDeleteBatch,
  recordMortality as dbRecordMortality,
} from "@/lib/repositories";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { initialBatches, batchSales } from "@/data/mockData";
import type { Batch, MortalityRecord } from "@/types";

const mockWithSales = initialBatches.map((b, i) => ({
  ...b,
  sales: batchSales[i] ?? { ordered: 0, toSell: 0 },
}));

export function useBatches(enabled: boolean) {
  const [batches, setBatches] = useState<Batch[]>(mockWithSales);
  const [mortalities, setMortalities] = useState<MortalityRecord[]>([]);

  const reload = () => {
    fetchBatches()
      .then(d => setBatches(d))
      .catch(err => console.error("useBatches:", err));
    fetchMortalities()
      .then(d => setMortalities(d))
      .catch(err => console.error("useMortalities:", err));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !enabled) return;
    reload();
    const channel = supabase!
      .channel("db-batches")
      .on("postgres_changes", { event: "*", schema: "public", table: "batches" }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "mortalities" }, reload)
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

  const createBatch = (data: { count: number; startedAt: string; hallName?: string; feed?: string }) => {
    const year = new Date().getFullYear();
    const nums = batches
      .map(b => b.id.match(/(\d+)\/\d+/)?.[1])
      .filter(Boolean)
      .map(Number)
      .filter(n => !isNaN(n));
    const code = `${(Math.max(0, ...nums) + 1).toString().padStart(2, "0")}/${year}`;
    const newBatch: Batch = {
      id: `Turnus: ${code} (${data.hallName ?? ""})`,
      phase: "starter",
      phaseLabel: "Štartér",
      day: 0,
      feed: data.feed ?? "",
      count: data.count,
      mortality: 0,
      purchaseDate: data.startedAt,
      sales: { ordered: 0, toSell: data.count },
    };
    setBatches(prev => [newBatch, ...prev]);
    if (isSupabaseConfigured) {
      dbCreateBatch(data).then(reload).catch(err => console.error("createBatch:", err));
    }
  };

  /** displayId = b.id */
  const endBatch = (displayId: string) => {
    const now = new Date();
    const fmt = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
    setBatches(prev => prev.map(b => (b.id === displayId ? { ...b, endedAt: fmt } : b)));
    const row = batches.find(b => b.id === displayId);
    if (isSupabaseConfigured && row?.dbId) {
      dbEndBatch(row.dbId).catch(err => console.error("endBatch:", err));
    }
  };

  /** displayId = b.id */
  const updateBatch = (displayId: string, data: { count?: number; feed?: string; slaughterDate?: string }) => {
    setBatches(prev => prev.map(b =>
      b.id === displayId
        ? {
            ...b,
            count: data.count !== undefined ? data.count : b.count,
            feed: data.feed !== undefined ? data.feed : b.feed,
            slaughterDate: data.slaughterDate !== undefined ? (data.slaughterDate || undefined) : b.slaughterDate,
            slaughterRange: data.slaughterDate !== undefined ? (data.slaughterDate || undefined) : b.slaughterRange,
          }
        : b
    ));
    const row = batches.find(b => b.id === displayId);
    if (isSupabaseConfigured && row?.dbId) {
      dbUpdateBatch(row.dbId, data).then(reload).catch(err => console.error("updateBatch:", err));
    }
  };

  /** displayId = b.id */
  const deleteBatch = (displayId: string) => {
    setBatches(prev => prev.filter(b => b.id !== displayId));
    const row = batches.find(b => b.id === displayId);
    if (isSupabaseConfigured && row?.dbId) {
      dbDeleteBatch(row.dbId).catch(err => console.error("deleteBatch:", err));
    }
  };

  return { batches, mortalities, recordMortality, createBatch, endBatch, updateBatch, deleteBatch };
}
