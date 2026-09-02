import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import Dashboard from "@/components/dashboard/Dashboard";
import BottomNav from "@/components/dashboard/BottomNav";
import MenuDrawer from "@/components/dashboard/MenuDrawer";
import UhynModal from "@/components/dashboard/UhynModal";
import VydavokModal from "@/components/dashboard/VydavokModal";
import PageLayer from "@/components/ui/PageLayer";
import PageTurnusy from "@/components/screens/PageTurnusy";
import PageZakaznici from "@/components/screens/PageZakaznici";
import PageObjednavky from "@/components/screens/PageObjednavky";
import PageNakupy from "@/components/screens/PageNakupy";
import PageZabijacka from "@/components/screens/PageZabijacka";
import PageStatistiky from "@/components/screens/PageStatistiky";
import LoginScreen from "@/components/auth/LoginScreen";
import { batchPhaseGradient, colors } from "@/theme/tokens";
import { filterBatches } from "@/utils/date";
import { authDisabled, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useBatches } from "@/hooks/useBatches";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { useExpenses } from "@/hooks/useExpenses";
import type { Batch, Expense, SalesFilter } from "@/types";

const PAGE_KEYS = ["turnusy", "zakaznici", "objednavky", "nakupy", "zabijacka", "statistiky"];

export default function App() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState<string | null>(null);
  const [showUhyn, setShowUhyn] = useState(false);
  const [showVydavok, setShowVydavok] = useState(false);
  const [showDashFilter, setShowDashFilter] = useState(false);
  const [dashFilter, setDashFilter] = useState<SalesFilter>({ type: "year", year: "2026" });
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const pageRef = useRef<string | null>(null);
  useEffect(() => { pageRef.current = page; }, [page]);

  const enabled = isSupabaseConfigured && !authDisabled && !!session;
  const { batches, mortalities, recordMortality, createBatch, endBatch, updateBatch, deleteBatch } = useBatches(enabled);
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers(enabled);
  const { orders, addOrder, changeStatus, setPaid, updateOrder, deleteOrder } = useOrders(enabled);
  const { expenses, addExpense } = useExpenses(enabled);

  // Auth session
  useEffect(() => {
    if (!isSupabaseConfigured) { setAuthReady(true); return; }
    supabase!.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: sub } = supabase!.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  // „Späť" prehliadača / Android hardvérové tlačidlo – ostaneme v apke
  useEffect(() => {
    const onPop = () => {
      const next = (window.history.state as { app?: string } | null)?.app ?? null;
      setPage(prev => (prev === next ? prev : next));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Otvorenie stránky + synchronizácia s históriou (push pre novú, replace pre zmenu)
  const openPage = useCallback((key: string) => {
    if (!PAGE_KEYS.includes(key)) return;
    setMenuOpen(false);
    const cur = pageRef.current;
    if (cur === key) return;
    if (cur) window.history.replaceState({ app: key }, "");
    else window.history.pushState({ app: key }, "");
    setPage(key);
  }, []);

  // Návrat späť / domov cez históriu (overlay animovane odíde)
  const goBack = useCallback(() => {
    setMenuOpen(false);
    if (pageRef.current) window.history.back();
  }, []);

  // Lock body scroll, keď je otvorený sheet / stránka
  useEffect(() => {
    if (menuOpen || showUhyn || showVydavok || page) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, showUhyn, showVydavok, page]);

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

  const activeBatches = useMemo(() => batches.filter(b => !b.endedAt), [batches]);
  const heroBatch = activeBatches.length
    ? activeBatches[Math.min(heroIdx, activeBatches.length - 1)]
    : undefined;

  useEffect(() => {
    if (activeBatches.length > 0 && heroIdx >= activeBatches.length) {
      setHeroIdx(Math.max(0, activeBatches.length - 1));
    }
  }, [activeBatches.length, heroIdx]);

  if (!authReady) return <div style={{ minHeight: "100vh", background: "#FFFFFF" }} />;

  if (isSupabaseConfigured && !authDisabled && !session) return <LoginScreen />;

  const handleUhyn = (batchIdx: number, count: number) => {
    const b = batches[batchIdx];
    if (b) recordMortality(b.id, count);
  };
  const handleVydavok = (e: Expense) => addExpense(e);
  const handleMortality = (b: Batch, count: number) => recordMortality(b.id, count);
  const handleUpdateTurnus = (b: Batch, data: { count?: number; feed?: string; slaughterDate?: string; price?: number | null }) => updateBatch(b.id, data);
  const handleDeleteTurnus = (b: Batch) => deleteBatch(b.id);

  const handleLogout = async () => {
    if (!supabase) return;
    setMenuOpen(false);
    await supabase.auth.signOut().catch(err => console.error("logout:", err));
  };

  const pageContent: ReactNode = page === "turnusy" ? (
    <PageTurnusy batches={filteredBatches} salesByBatch={salesByBatch} onCreateTurnus={createBatch} onEndTurnus={b => endBatch(b.id)} onUpdateTurnus={handleUpdateTurnus} onDeleteTurnus={handleDeleteTurnus} onMortality={handleMortality} onBack={goBack} />
  ) : page === "zakaznici" ? (
    <PageZakaznici customers={customers} onAddCustomer={addCustomer} onUpdateCustomer={updateCustomer} onDeleteCustomer={deleteCustomer} onBack={goBack} />
  ) : page === "objednavky" ? (
    <PageObjednavky customers={customers} orders={orders} onAdd={addOrder} onChangeStatus={changeStatus} onSetPaid={setPaid} onUpdate={updateOrder} onDelete={deleteOrder} onBack={goBack} />
  ) : page === "nakupy" ? (
    <PageNakupy onBack={goBack} expenses={expenses} />
  ) : page === "zabijacka" ? (
    <PageZabijacka onBack={goBack} />
  ) : page === "statistiky" ? (
    <PageStatistiky onBack={goBack} />
  ) : null;

  const navGradient = heroBatch ? batchPhaseGradient(heroBatch.phase) : undefined;

  return (
    <div style={{ minHeight: "100svh", background: colors.white, maxWidth: 430, margin: "0 auto", position: "relative" }}>
      <Dashboard
        batches={batches}
        mortalities={mortalities}
        orders={orders}
        expenses={expenses}
        userEmail={session?.user?.email ?? undefined}
        dashFilter={dashFilter}
        allDashYears={allDashYears}
        showDashFilter={showDashFilter}
        onCreateTurnus={createBatch}
        onEndTurnus={b => endBatch(b.id)}
        onUpdateTurnus={handleUpdateTurnus}
        onDeleteTurnus={handleDeleteTurnus}
        onMortality={handleMortality}
        onHeroChange={setHeroIdx}
        onShowDashFilter={setShowDashFilter}
        onApplyFilter={setDashFilter}
        onNavigate={openPage}
        onLogout={isSupabaseConfigured && !authDisabled && session ? handleLogout : undefined}
      />

      <BottomNav
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onUhyn={() => setShowUhyn(true)}
        onVydavok={() => setShowVydavok(true)}
        gradient={navGradient}
      />
      <MenuDrawer open={menuOpen} currentTitle={heroBatch?.id ?? ""} onClose={() => setMenuOpen(false)} onNavigate={openPage} />
      {showUhyn && <UhynModal batches={batches} onClose={() => setShowUhyn(false)} onSubmit={handleUhyn} />}
      {showVydavok && <VydavokModal onClose={() => setShowVydavok(false)} onSubmit={handleVydavok} />}

      <PageLayer open={page !== null} pageKey={page} onBack={goBack}>
        {pageContent}
      </PageLayer>
    </div>
  );
}
