import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Dashboard from "@/components/dashboard/Dashboard";
import BottomNav from "@/components/dashboard/BottomNav";
import MenuDrawer from "@/components/dashboard/MenuDrawer";
import UhynModal from "@/components/dashboard/UhynModal";
import VydavokModal from "@/components/dashboard/VydavokModal";
import PageTurnusy from "@/components/screens/PageTurnusy";
import PageZakaznici from "@/components/screens/PageZakaznici";
import PageObjednavky from "@/components/screens/PageObjednavky";
import PageNakupy from "@/components/screens/PageNakupy";
import PageZabijacka from "@/components/screens/PageZabijacka";
import PageStatistiky from "@/components/screens/PageStatistiky";
import LoginScreen from "@/components/auth/LoginScreen";
import { batchPhaseGradient } from "@/theme/tokens";
import { filterBatches } from "@/utils/date";
import { authDisabled, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useBatches } from "@/hooks/useBatches";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense, SalesFilter } from "@/types";

export default function App() {
  const [activeIdx, setActiveIdx] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [showUhyn, setShowUhyn] = useState(false);
  const [showVydavok, setShowVydavok] = useState(false);
  const [showDashFilter, setShowDashFilter] = useState(false);
  const [dashFilter, setDashFilter] = useState<SalesFilter>({ type: "year", year: "2026" });
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const enabled = isSupabaseConfigured && !authDisabled && !!session;
  const { batches, recordMortality } = useBatches(enabled);
  const { customers, addCustomer } = useCustomers(enabled);
  const { orders, addOrder, changeStatus, setPaid, updateOrder, deleteOrder } = useOrders(enabled);
  const { expenses, addExpense } = useExpenses(enabled);

  // Auth session
  useEffect(() => {
    if (!isSupabaseConfigured) { setAuthReady(true); return; }
    supabase!.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: sub } = supabase!.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  // Lock body scroll when sheets open
  useEffect(() => {
    if (menuOpen || showUhyn || showVydavok) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, showUhyn, showVydavok]);

  const allDashYears = useMemo(() => Array.from(new Set([
    ...batches.map(b => b.purchaseDate?.split(".")[2] ?? ""),
    ...orders.map(o => o.date.split(".")[2] ?? ""),
    ...expenses.map(e => e.date.split(".")[2] ?? ""),
  ])).filter(Boolean).sort((a, b) => Number(b) - Number(a)), [batches, orders, expenses]);

  const filteredBatches = useMemo(() => filterBatches(batches, dashFilter), [batches, dashFilter]);

  const salesByBatch = useMemo(() => {
    const m: Record<string, { ordered: number; toSell: number }> = {};
    batches.forEach(b => { if (b.sales) m[b.id] = b.sales; });
    return m;
  }, [batches]);

  if (!authReady) return <div style={{ minHeight: "100vh", background: "#FFFFFF" }} />;

  if (isSupabaseConfigured && !authDisabled && !session) return <LoginScreen />;

  const handleUhyn = (batchIdx: number, count: number) => {
    const b = batches[batchIdx];
    if (b) recordMortality(b.id, count);
  };
  const handleVydavok = (e: Expense) => addExpense(e);
  const goBack = () => setActivePage(null);

  const handleLogout = async () => {
    if (!supabase) return;
    setMenuOpen(false);
    await supabase.auth.signOut().catch(err => console.error("logout:", err));
  };

  const sharedNav = (
    <>
      <BottomNav
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onUhyn={() => setShowUhyn(true)}
        onVydavok={() => setShowVydavok(true)}
        gradient={batches[activeIdx] ? batchPhaseGradient(batches[activeIdx].phase) : undefined}
      />
      <MenuDrawer open={menuOpen} activeIdx={activeIdx} onClose={() => setMenuOpen(false)} onNavigate={setActivePage} batches={batches} onLogout={isSupabaseConfigured && !authDisabled && session ? handleLogout : undefined} />
      {showUhyn && <UhynModal batches={batches} onClose={() => setShowUhyn(false)} onSubmit={handleUhyn} />}
      {showVydavok && <VydavokModal onClose={() => setShowVydavok(false)} onSubmit={handleVydavok} />}
    </>
  );

  // Sub-pages
  if (activePage === "turnusy")    return <>{<PageTurnusy batches={filteredBatches} salesByBatch={salesByBatch} onBack={goBack} />}{sharedNav}</>;
  if (activePage === "zakaznici")  return <>{<PageZakaznici customers={customers} onAddCustomer={addCustomer} onBack={goBack} />}{sharedNav}</>;
  if (activePage === "objednavky") return <>{<PageObjednavky customers={customers} orders={orders} onAdd={addOrder} onChangeStatus={changeStatus} onSetPaid={setPaid} onUpdate={updateOrder} onDelete={deleteOrder} onBack={goBack} />}{sharedNav}</>;
  if (activePage === "nakupy")     return <>{<PageNakupy onBack={goBack} expenses={expenses} />}{sharedNav}</>;
  if (activePage === "zabijacka")  return <>{<PageZabijacka onBack={goBack} />}{sharedNav}</>;
  if (activePage === "statistiky") return <>{<PageStatistiky onBack={goBack} />}{sharedNav}</>;

  // Dashboard
  return (
    <Dashboard
      batches={batches}
      orders={orders}
      expenses={expenses}
      activeIdx={activeIdx}
      menuOpen={menuOpen}
      dashFilter={dashFilter}
      allDashYears={allDashYears}
      showDashFilter={showDashFilter}
      showUhyn={showUhyn}
      showVydavok={showVydavok}
      onUhyn={handleUhyn}
      onVydavok={handleVydavok}
      onMenuOpenChange={setMenuOpen}
      onShowUhyn={setShowUhyn}
      onShowVydavok={setShowVydavok}
      onShowDashFilter={setShowDashFilter}
      onApplyFilter={setDashFilter}
      onNavigate={setActivePage}
    />
  );
}
