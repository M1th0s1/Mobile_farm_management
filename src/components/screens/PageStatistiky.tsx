import { useState } from "react";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import BarChart from "@/components/ui/BarChart";
import GroupBars from "@/components/ui/GroupBars";
import SalesFilterSheet from "@/components/dashboard/SalesFilterSheet";
import { ChartIcon, FilterIcon } from "@/components/ui/Icons";
import { colors, gradients, typography } from "@/theme/tokens";
import { statTile } from "@/styles/shared";
import { computeFinance, fmtMoney } from "@/utils/finance";
import { filterLabel } from "@/utils/date";
import {
  avgMortality, batchPerformance, financeMonthly, hallUsage, mortalityMonthly, topCustomers,
} from "@/utils/stats";
import type { Batch, Customer, Expense, MortalityRecord, Order, SalesFilter } from "@/types";

const PHASE_META: Record<string, { label: string; color: string }> = {
  starter: { label: "Štartér", color: "#1F7C60" },
  growth: { label: "Rast", color: "#258667" },
  slaughter: { label: "Porážka", color: "#0F4537" },
};

function MiniStat({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ minWidth: 64, textAlign: "right" }}>
      <div style={{ fontSize: 13, fontWeight: 900, color: color ?? colors.text, letterSpacing: -0.3 }}>{value}</div>
      <div style={{ fontSize: 8, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2, opacity: 0.75 }}>{label}</div>
    </div>
  );
}

export default function PageStatistiky({ batches, mortalities, orders, expenses, customers, halls, filter, allYears, onApplyFilter, onBack }: {
  batches: Batch[];
  mortalities: MortalityRecord[];
  orders: Order[];
  expenses: Expense[];
  customers: Customer[];
  halls: { name: string; capacity: number }[];
  filter: SalesFilter;
  allYears: string[];
  onApplyFilter: (f: SalesFilter) => void;
  onBack: () => void;
}) {
  const [showFilter, setShowFilter] = useState(false);

  const fin = computeFinance(orders, expenses, filter);
  const positive = fin.profit >= 0;

  const monthly = financeMonthly(orders, expenses, filter);
  const mortMonths = mortalityMonthly(mortalities);
  const mortPct = avgMortality(batches);
  const hallsStat = hallUsage(batches, halls);
  const activeKs = batches.filter(b => !b.endedAt).reduce((s, b) => s + b.count, 0);
  const capacitySum = hallsStat.reduce((s, h) => s + h.capacity, 0);
  const capacityPct = capacitySum > 0 ? Math.min(100, Math.round((activeKs / capacitySum) * 100)) : 0;

  const perf = batchPerformance(batches);
  const top = topCustomers(customers);
  const maxOrder = Math.max(1, ...top.map(c => c.ordered));

  return (
    <PageShell title="Štatistiky" icon={<ChartIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px", fontFamily: typography.fontFamily }}>
        {/* Obdobie */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button onClick={() => setShowFilter(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 20,
            border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer",
            fontFamily: typography.fontFamily, fontSize: 11, fontWeight: 700, color: colors.dark,
          }}>
            <FilterIcon />
            {filterLabel(filter)}
          </button>
        </div>
        {/* KPI */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            {
              label: positive ? "Zisk" : "Strata",
              val: `${fmtMoney(fin.profit)} €`,
              sub: `za ${filterLabel(filter).toLowerCase()}`,
              arrow: positive ? "▲" : "▼",
            },
            { label: "Priem. úhyn", val: mortPct !== null ? `${mortPct.toFixed(1)}%` : "–", sub: "z nakúpených", arrow: "" },
            { label: "Kusy v halách", val: activeKs.toLocaleString("sk-SK"), sub: `obsadenosť ${capacityPct}%`, arrow: "" },
          ].map(s => (
            <div key={s.label} style={statTile}>
              <div style={{ fontSize: 13, fontWeight: 900, color: colors.white, letterSpacing: -0.4, fontVariantNumeric: "tabular-nums" }}>
                {s.arrow && <span style={{ color: positive ? "#A7F3C2" : "#FCA5A5", fontSize: 10 }}>{s.arrow} </span>}
                {s.val}
              </div>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 3 }}>{s.label}</div>
              <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tržby vs Náklady */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
            Tržby a náklady po mesiacoch (€)
          </div>
          <GroupBars data={monthly} a={{ label: "Tržby", color: "#258667" }} b={{ label: "Náklady", color: "#E05A3A" }} />
        </Card>

        {/* Úhyn */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>
            Úhyn po mesiacoch (ks)
          </div>
          {mortMonths.length === 0 ? (
            <div style={{ textAlign: "center", color: colors.dark, fontSize: 12, opacity: 0.5, padding: "24px 0" }}>Zatiaľ žiadne záznamy úhynov</div>
          ) : (
            <BarChart data={mortMonths} color={colors.dark} unit="ks" />
          )}
        </Card>

        {/* Hall usage */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
            Využitie kapacity hál
          </div>
          {hallsStat.length === 0 ? (
            <div style={{ textAlign: "center", color: colors.dark, fontSize: 12, opacity: 0.5, padding: "12px 0" }}>Žiadne haly</div>
          ) : hallsStat.map(h => (
            <div key={h.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.dark }}>{h.name}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: colors.dark }}>
                  {h.used.toLocaleString("sk-SK")} / {h.capacity.toLocaleString("sk-SK")} ks · {h.pct}%
                </span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill-primary" style={{ width: `${h.pct}%` }} />
              </div>
            </div>
          ))}
        </Card>
        {/* Top zákazníci */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>
            Top zákazníci (ks)
          </div>
          {top.length === 0 ? (
            <div style={{ textAlign: "center", color: colors.dark, fontSize: 12, opacity: 0.5, padding: "12px 0" }}>Zatiaľ žiadni zákazníci</div>
          ) : top.slice(0, 5).map(c => (
            <div key={c.name} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.dark }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: colors.text }}>{c.ordered} ks</span>
              </div>
              <div style={{ background: colors.border, height: 5, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${(c.ordered / maxOrder) * 100}%`, background: gradients.primary }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Výkonnosť turnusov */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
            Výkonnosť turnusov
          </div>
          {perf.length === 0 ? (
            <div style={{ textAlign: "center", color: colors.dark, fontSize: 12, opacity: 0.5, padding: "12px 0" }}>Zatiaľ žiadne turnusy</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {perf.map((p, i) => {
                const meta = PHASE_META[p.phase] ?? { label: p.phase, color: colors.dark };
                return (
                  <div key={p.code + i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
                    borderBottom: i < perf.length - 1 ? `1px solid ${colors.border}` : "none",
                  }}>
                    <div style={{ width: 84, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: colors.text, letterSpacing: -0.2 }}>{p.code}</span>
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: colors.dark, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.hall || meta.label} · {p.ended ? "ukončený" : p.day !== null ? `${p.day}. deň` : ""}
                      </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                      <MiniStat value={p.mortalityPct !== null ? `${p.mortalityPct.toFixed(1)}%` : "–"} label="úhyn" color="#E05A3A" />
                      <MiniStat value={p.preorderPct !== null ? `${p.preorderPct.toFixed(0)}%` : "–"} label="predpredaj" color="#258667" />
                      <MiniStat value={p.unitPrice !== null ? `${p.unitPrice.toFixed(2)}€` : "–"} label="€/ks" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {showFilter && (
        <SalesFilterSheet filter={filter} allYears={allYears} onApply={f => { onApplyFilter(f); setShowFilter(false); }} onClose={() => setShowFilter(false)} />
      )}
    </PageShell>
  );
}
