import { useState } from "react";
import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SalesFilterSheet from "@/components/dashboard/SalesFilterSheet";
import { expenseIcons, FilterIcon, MoneyIcon, ShoppingBagIcon } from "@/components/ui/Icons";
import { colors, gradients, typography } from "@/theme/tokens";
import { purchases } from "@/data/mockData";
import { filterByPeriod, filterLabel } from "@/utils/date";
import type { Expense, SalesFilter } from "@/types";

const catLabel: Record<string, string> = { krmivo: "Krmivo", lek: "Lieky", material: "Materiál", ine: "Iné" };

export default function PageNakupy({ onBack, expenses: livePurchases }: { onBack: () => void; expenses?: Expense[] }) {
  const [tab, setTab] = useState("all");
  const [nFilter, setNFilter] = useState<SalesFilter>({ type: "all" });
  const [showFilter, setShowFilter] = useState(false);
  const allPurchases = livePurchases && livePurchases.length > 0 ? livePurchases : purchases;
  const purchased = filterByPeriod(allPurchases, nFilter);
  const filtered = tab === "all" ? purchased : purchased.filter(p => p.category === tab);
  const total = filtered.reduce((s, p) => s + p.amount, 0);
  const years = Array.from(new Set(allPurchases.map(p => p.date.split(".")[2] ?? ""))).filter(Boolean).sort((a, b) => Number(b) - Number(a));

  return (
    <PageShell title="Nákupy" icon={<ShoppingBagIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px" }}>
        {/* Filter obdobia */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5 }}>Nákupy</span>
          <button onClick={() => setShowFilter(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 20,
            border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer",
            fontFamily: typography.fontFamily, fontSize: 11, fontWeight: 700, color: colors.dark,
          }}>
            <FilterIcon />
            {filterLabel(nFilter)}
          </button>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {(["all", "krmivo", "lek", "material", "ine"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: "8px 4px", borderRadius: 12, border: "none", cursor: "pointer",
              fontFamily: typography.fontFamily, fontSize: 10, fontWeight: 700,
              background: tab === t ? colors.dark : colors.white,
              color: tab === t ? colors.white : colors.dark,
              transition: "all 0.15s ease",
            }}>
              {t === "all" ? "Všetko" : expenseIcons[t]}
              {" "}{t === "all" ? "" : catLabel[t] ?? "Iné"}
            </button>
          ))}
        </div>

        {/* Total */}
        <div style={{
          background: gradients.dark,
          borderRadius: 18, padding: "18px 20px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Celkové výdavky</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: colors.white, letterSpacing: -1, marginTop: 4 }}>{total.toFixed(2)} €</div>
          </div>
          <div style={{ opacity: 0.4, display: "flex" }}><MoneyIcon size={36} color={colors.white} /></div>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p, i) => (
            <Card key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: colors.dark + "18",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>
                  {expenseIcons[p.category]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <Badge label={catLabel[p.category]} color={colors.dark} />
                    <span style={{ fontSize: 10, fontWeight: 500, color: colors.dark }}>{p.date}</span>
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: colors.dark }}>{p.amount.toFixed(2)} €</div>
              </div>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (
          <Card>
            <div style={{ textAlign: "center", color: colors.dark, fontSize: 13, padding: "20px 0" }}>
              Žiadne nákupy v zvolenom období
            </div>
          </Card>
        )}
      </div>

      {showFilter && (
        <SalesFilterSheet filter={nFilter} allYears={years} onApply={f => setNFilter(f)} onClose={() => setShowFilter(false)} />
      )}
    </PageShell>
  );
}
