import { useEffect, useState } from "react";
import {
  fetchOrders,
  insertOrder as dbInsertOrder,
  updateOrderStatus as dbUpdateOrderStatus,
  updateOrderPaid as dbUpdateOrderPaid,
  updateOrderDetails as dbUpdateOrderDetails,
  deleteOrder as dbDeleteOrder,
} from "@/lib/repositories";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { initialOrders } from "@/data/mockData";
import { productTypes } from "@/theme/tokens";
import type { Order, OrderItem, OrderStatus } from "@/types";

export function useOrders(enabled: boolean) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const reload = () => {
    fetchOrders()
      .then(d => setOrders(d))
      .catch(err => console.error("useOrders:", err));
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !enabled) return;
    reload();
    const channel = supabase!
      .channel("db-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, reload)
      .subscribe();
    return () => { supabase!.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  /** displayId = o.id (číslo "OBJ-001") */
  const findDbId = (displayId: string) => orders.find(o => o.id === displayId)?.dbId;

  const changeStatus = (displayId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => (o.id === displayId ? { ...o, status } : o)));
    const dbId = findDbId(displayId);
    if (isSupabaseConfigured && dbId) dbUpdateOrderStatus(dbId, status).catch(console.error);
  };

  const setPaid = (displayId: string, paid: number | undefined) => {
    setOrders(prev => prev.map(o => (o.id === displayId ? { ...o, paid } : o)));
    const dbId = findDbId(displayId);
    if (isSupabaseConfigured && dbId) dbUpdateOrderPaid(dbId, paid).catch(console.error);
  };

  const updateOrder = (displayId: string, items: OrderItem[], note: string) => {
    const qty = items.reduce((s, i) => s + i.qty, 0);
    const productType = items
      .map(i => productTypes.find(p => p.key === i.productKey)?.label ?? "")
      .join(" + ");
    setOrders(prev =>
      prev.map(o => (o.id === displayId ? { ...o, items, qty, productType, note } : o))
    );
    const dbId = findDbId(displayId);
    if (isSupabaseConfigured && dbId) dbUpdateOrderDetails(dbId, items, note).catch(console.error);
  };

  const deleteOrder = (displayId: string) => {
    setOrders(prev => prev.filter(o => o.id !== displayId));
    const dbId = findDbId(displayId);
    if (isSupabaseConfigured && dbId) dbDeleteOrder(dbId).catch(console.error);
  };

  const addOrder = (o: Order) => {
    setOrders(prev => [o, ...prev]);
    if (isSupabaseConfigured) dbInsertOrder(o).then(reload).catch(console.error);
  };

  return { orders, addOrder, changeStatus, setPaid, updateOrder, deleteOrder };
}
