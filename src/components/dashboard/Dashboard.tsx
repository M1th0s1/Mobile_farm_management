import { useMemo } from "react";
import BatchCard from "./BatchCard";
import SalesCard from "./SalesCard";
import SalesFilterSheet from "./SalesFilterSheet";
import UhynModal from "./UhynModal";
import VydavokModal from "./VydavokModal";
import BottomNav from "./BottomNav";
import MenuDrawer from "./MenuDrawer";
import { CheckIcon, CloseIcon, EuroIcon, FilterIcon } from "@/components/ui/Icons";
import { batchPhaseGradient, colors, shadows, typography } from "@/theme/tokens";
import { filterBatches, filterLabel } from "@/utils/date";
import type { Batch, Expense, Order, SalesFilter } from "@/types";

type DashboardProps = {
  batches: Batch[];
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
  onMenuOpenChange: (v: boolean) => void;
  onShowUhyn: (v: boolean) => void;
  onShowVydavok: (v: boolean) => void;
  onShowDashFilter: (v: boolean) => void;
  onApplyFilter: (f: SalesFilter) => void;
  onNavigate: (key: string) => void;
};

export default function Dashboard(props: DashboardProps) {
  const {
    batches, orders, expenses, activeIdx, menuOpen, dashFilter, allDashYears,
    showDashFilter, showUhyn, showVydavok,
    onUhyn, onVydavok, onMenuOpenChange,
    onShowUhyn, onShowVydavok, onShowDashFilter, onApplyFilter, onNavigate,
  } = props;

  const filteredBatches = useMemo(() => filterBatches(batches, dashFilter), [batches, dashFilter]);
  const totalCount = useMemo(() => filteredBatches.reduce((s, b) => s + b.count, 0), [filteredBatches]);
  const totalMortality = useMemo(() => filteredBatches.reduce((s, b) => s + b.mortality, 0), [filteredBatches]);

  const summary = [
    { label: "Turnusy", val: String(filteredBatches.length), unit: "akt.", dark: true },
    { label: "Kusy celkom", val: totalCount.toLocaleString("sk-SK"), unit: "ks", dark: true },
    { label: "Úhyny celkom", val: String(totalMortality), unit: "ks", dark: true },
  ];

  const recentEvents = [
    { time: "08:30", type: "Úhyn",    desc: "Turnus 02/2026 — 3 ks",         color: colors.dark,    bg: colors.dark + "18",   icon: <CloseIcon size={14} color={colors.dark} /> },
    { time: "07:15", type: "Výdavok", desc: "Krmivo BR2 — 85 kg · 42,50 €",  color: colors.dark,    bg: colors.dark + "12",   icon: <EuroIcon size={18} color={colors.dark} /> },
    { time: "Včera", type: "Zákazník", desc: "Novák M. — 50 ks objednávka",  color: colors.dark,    bg: colors.accent + "20", icon: <CheckIcon size={13} color={colors.dark} /> },
  ];

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

      {/* Single Active Batch Card */}
      <div style={{ padding: "0 16px 18px", display: "flex", justifyContent: "center" }}>
        {batches[activeIdx] && <BatchCard batch={batches[activeIdx]} isCenter={true} />}
      </div>

      {/* Sales section */}
      <SalesCard
        orders={orders}
        expenses={expenses}
        filter={dashFilter}
        headerGradient={batches[activeIdx] ? batchPhaseGradient(batches[activeIdx].phase) : undefined}
      />

      {/* Recent events */}
      <div style={{ margin: "0 16px 110px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Posledné záznamy</div>
        {recentEvents.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${colors.border}` : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: e.color, flexShrink: 0, border: `1px solid ${e.color}25` }}>
              {e.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{e.type}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 1 }}>{e.desc}</div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: colors.dark }}>{e.time}</div>
          </div>
        ))}
      </div>

      <MenuDrawer open={menuOpen} activeIdx={activeIdx} onClose={() => onMenuOpenChange(false)} onNavigate={onNavigate} batches={batches} />
      <BottomNav
        menuOpen={menuOpen}
        setMenuOpen={onMenuOpenChange}
        onUhyn={() => onShowUhyn(true)}
        onVydavok={() => onShowVydavok(true)}
        gradient={batches[activeIdx] ? batchPhaseGradient(batches[activeIdx].phase) : undefined}
      />
      {showUhyn && <UhynModal batches={batches} onClose={() => onShowUhyn(false)} onSubmit={onUhyn} />}
      {showVydavok && <VydavokModal onClose={() => onShowVydavok(false)} onSubmit={onVydavok} />}
      {showDashFilter && <SalesFilterSheet filter={dashFilter} allYears={allDashYears} onApply={f => onApplyFilter(f)} onClose={() => onShowDashFilter(false)} />}
    </div>
  );
}