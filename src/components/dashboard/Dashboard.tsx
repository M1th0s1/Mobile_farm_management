import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import BatchCard from "./BatchCard";
import BatchDetail, { type BatchUpdate } from "./BatchDetail";
import SalesCard from "./SalesCard";
import SalesFilterSheet from "./SalesFilterSheet";
import UhynModal from "./UhynModal";
import VydavokModal from "./VydavokModal";
import BottomNav from "./BottomNav";
import MenuDrawer from "./MenuDrawer";
import CreateTurnusModal from "./CreateTurnusModal";
import { CheckIcon, CloseIcon, EuroIcon, FilterIcon } from "@/components/ui/Icons";
import { batchPhaseGradient, colors, shadows, typography } from "@/theme/tokens";
import { filterBatches, filterLabel, parseDate } from "@/utils/date";
import type { Batch, Expense, MortalityRecord, Order, SalesFilter } from "@/types";

type DashboardProps = {
  batches: Batch[];
  mortalities: MortalityRecord[];
  orders: Order[];
  expenses: Expense[];
  activeIdx: number;
  menuOpen: boolean;
  dashFilter: SalesFilter;
  allDashYears: string[];
  showDashFilter: boolean;
  showUhyn: boolean;
  showVydavok: boolean;
  onUhyn: (batchIdx: number, count: number) => void;
  onVydavok: (e: Expense) => void;
  onCreateTurnus: (data: { count: number; startedAt: string; hallName?: string; feed?: string }) => void;
  onEndTurnus: (b: Batch) => void;
  onUpdateTurnus: (b: Batch, data: BatchUpdate) => void;
  onDeleteTurnus: (b: Batch) => void;
  onMortality: (b: Batch, count: number) => void;
  onMenuOpenChange: (v: boolean) => void;
  onShowUhyn: (v: boolean) => void;
  onShowVydavok: (v: boolean) => void;
  onShowDashFilter: (v: boolean) => void;
  onApplyFilter: (f: SalesFilter) => void;
  onNavigate: (key: string) => void;
};

export default function Dashboard(props: DashboardProps) {
  const {
    batches, mortalities, orders, expenses, activeIdx, menuOpen, dashFilter, allDashYears,
    showDashFilter, showUhyn, showVydavok,
    onUhyn, onVydavok, onCreateTurnus, onEndTurnus, onUpdateTurnus, onDeleteTurnus, onMortality,
    onMenuOpenChange,
    onShowUhyn, onShowVydavok, onShowDashFilter, onApplyFilter, onNavigate,
  } = props;

  const [showCreate, setShowCreate] = useState(false);
  const [detailBatch, setDetailBatch] = useState<Batch | null>(null);
  const [activeBatchIdx, setActiveBatchIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeBatches = batches.filter(b => !b.endedAt);
  const currentBatch = activeBatches.length
    ? activeBatches[Math.min(activeBatchIdx, activeBatches.length - 1)]
    : undefined;

  useEffect(() => {
    if (activeBatches.length > 0 && activeBatchIdx >= activeBatches.length) {
      setActiveBatchIdx(activeBatches.length - 1);
    }
  }, [activeBatches.length, activeBatchIdx]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0, minDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveBatchIdx(closest);
  };

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "smooth" });
    setActiveBatchIdx(idx);
  };

  const filteredBatches = useMemo(() => filterBatches(activeBatches, dashFilter), [activeBatches, dashFilter]);
  const totalCount = useMemo(() => filteredBatches.reduce((s, b) => s + b.count, 0), [filteredBatches]);
  const totalMortality = useMemo(() => filteredBatches.reduce((s, b) => s + b.mortality, 0), [filteredBatches]);

  const summary = [
    { label: "Turnusy", val: String(filteredBatches.length), unit: "akt.", dark: true },
    { label: "Kusy celkom", val: totalCount.toLocaleString("sk-SK"), unit: "ks", dark: true },
    { label: "Úhyny celkom", val: String(totalMortality), unit: "ks", dark: true },
  ];

  const recentEvents = useMemo(() => {
    const list: { date: Date; label: string; type: string; desc: string; color: string; bg: string; icon: ReactNode }[] = [];
    mortalities.forEach(m => {
      const d = parseDate(m.recordedAt);
      if (d) list.push({ date: d, label: m.recordedAt.slice(0, 5), type: "Úhyn", desc: `Turnus ${m.batchCode} — ${m.count} ks`, color: colors.dark, bg: colors.dark + "18", icon: <CloseIcon size={14} color={colors.dark} /> });
    });
    expenses.forEach(e => {
      const d = parseDate(e.date);
      if (d) list.push({ date: d, label: e.date.slice(0, 5), type: "Výdavok", desc: `${e.name} · ${e.amount.toFixed(2)} €`, color: colors.dark, bg: colors.dark + "12", icon: <EuroIcon size={18} color={colors.dark} /> });
    });
    orders.forEach(o => {
      const d = parseDate(o.date);
      if (d) list.push({ date: d, label: o.date.slice(0, 5), type: "Zákazník", desc: `${o.customer} — ${o.qty} ks objednávka`, color: colors.dark, bg: colors.accent + "20", icon: <CheckIcon size={13} color={colors.dark} /> });
    });
    return list.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 3);
  }, [mortalities, expenses, orders]);

  return (
    <div style={{ minHeight: "100svh", background: colors.white, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", position: "relative", fontFamily: typography.fontFamily }}>
      {/* Main header */}
      <div style={{ padding: "16px 20px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: colors.text, letterSpacing: -0.5, lineHeight: 1.1 }}>PREHĽAD FARMY</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 2 }}>Aktualizované: dnes, 9:41</div>
          </div>
          <button onClick={() => onShowDashFilter(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 20,
            border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer",
            fontFamily: typography.fontFamily, fontSize: 11, fontWeight: 700, color: colors.dark,
            boxShadow: shadows.filter,
          }}>
            <FilterIcon />
            {filterLabel(dashFilter)}
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {summary.map(s => (
            <div key={s.label} style={{
              flex: 1,
              background: s.dark ? colors.dark : colors.darkDeep,
              borderRadius: 16,
              padding: "12px 10px 10px 12px",
              boxShadow: shadows.stat,
            }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 5 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: colors.white, letterSpacing: -0.5 }}>{s.val}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "16px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: colors.text, letterSpacing: 0.5, textTransform: "uppercase" }}>Aktuálny turnus</div>
        <button onClick={() => onNavigate("turnusy")} style={{ fontSize: 11, fontWeight: 600, color: colors.dark, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: typography.fontFamily }}>Všetky turnusy →</button>
      </div>

      {/* Active Batch Carousel */}
      {activeBatches.length === 0 ? (
        <div style={{ padding: "0 16px 18px", display: "flex", justifyContent: "center" }}>
          <button onClick={() => setShowCreate(true)} style={{
            width: "100%", maxWidth: 390, padding: "22px", borderRadius: 22,
            border: `1.5px dashed ${colors.dark}`, background: colors.dark + "08",
            fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 14, color: colors.dark, cursor: "pointer",
          }}>+ Vytvoriť nový turnus</button>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="carousel-snap scrollbar-hide"
            style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 16px 4px", scrollSnapType: "x mandatory" }}
          >
            {activeBatches.map(b => (
              <BatchCard
                key={b.id}
                batch={b}
                isCenter={b.id === currentBatch?.id}
                onClick={() => setDetailBatch(b)}
              />
            ))}
          </div>
          {activeBatches.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "10px 0 6px" }}>
              {activeBatches.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => scrollTo(i)}
                  style={{
                    width: i === activeBatchIdx ? 20 : 6, height: 6, borderRadius: 3, border: "none", padding: 0,
                    background: i === activeBatchIdx ? colors.dark : colors.border, cursor: "pointer", transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Sales section */}
      <SalesCard
        orders={orders}
        expenses={expenses}
        filter={dashFilter}
        headerGradient={currentBatch ? batchPhaseGradient(currentBatch.phase) : undefined}
      />

      {/* Recent events */}
      <div style={{ margin: "0 16px 110px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Posledné záznamy</div>
        {recentEvents.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: 12, color: colors.dark, opacity: 0.5, padding: "16px 0" }}>Zatiaľ žiadne záznamy</div>
        ) : (
          recentEvents.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${colors.border}` : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: e.color, flexShrink: 0, border: `1px solid ${e.color}25` }}>
                {e.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{e.type}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 1 }}>{e.desc}</div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: colors.dark }}>{e.label}</div>
            </div>
          ))
        )}
      </div>

      <MenuDrawer open={menuOpen} activeIdx={activeBatchIdx} onClose={() => onMenuOpenChange(false)} onNavigate={onNavigate} batches={batches} />
      <BottomNav
        menuOpen={menuOpen}
        setMenuOpen={onMenuOpenChange}
        onUhyn={() => onShowUhyn(true)}
        onVydavok={() => onShowVydavok(true)}
        gradient={currentBatch ? batchPhaseGradient(currentBatch.phase) : undefined}
      />
      {showUhyn && <UhynModal batches={batches} onClose={() => onShowUhyn(false)} onSubmit={onUhyn} />}
      {showVydavok && <VydavokModal onClose={() => onShowVydavok(false)} onSubmit={onVydavok} />}
      {showDashFilter && <SalesFilterSheet filter={dashFilter} allYears={allDashYears} onApply={f => onApplyFilter(f)} onClose={() => onShowDashFilter(false)} />}
      {showCreate && <CreateTurnusModal onClose={() => setShowCreate(false)} onCreate={onCreateTurnus} />}
      {detailBatch && (
        <BatchDetail
          batch={detailBatch}
          onClose={() => setDetailBatch(null)}
          onUpdate={onUpdateTurnus}
          onMortality={onMortality}
          onEnd={onEndTurnus}
          onDelete={onDeleteTurnus}
        />
      )}
    </div>
  );
}