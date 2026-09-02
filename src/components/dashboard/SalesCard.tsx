import { useState } from "react";
import { colors, gradients, shadows, typography } from "@/theme/tokens";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { filterByPeriod, filterLabel } from "@/utils/date";
import type { Expense, Order, SalesFilter } from "@/types";

export default function SalesCard({ orders, expenses, filter, headerGradient }: {
  orders: Order[]; expenses: Expense[]; filter: SalesFilter; headerGradient?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const delivered      = filterByPeriod(orders, filter).filter(o => o.status === "delivered" && o.paid !== undefined);
  const totalRevenue   = delivered.reduce((s, o) => s + (o.paid ?? 0), 0);
  const deliveredQty   = delivered.reduce((s, o) => s + o.qty, 0);
  const totalExpenses  = filterByPeriod(expenses, filter).reduce((s, e) => s + e.amount, 0);
  const profit         = totalRevenue - totalExpenses;
  const profitPositive = profit >= 0;
  const profitGradient = profitPositive ? gradients.primary : gradients.danger;

  return (
    <div style={{
      margin: "0 16px 16px",
      width: "calc(100vw - 40px)",
      maxWidth: 390,
      borderRadius: 24,
      overflow: "hidden",
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.card,
      background: colors.white,
    }}>
      {/* Header band – flat ledger style with watermark */}
      <div style={{ position: "relative", background: headerGradient ?? colors.dark, padding: "18px 18px 16px", overflow: "hidden" }}>
        {/* Obdobie – dynamické z aktívneho filtra */}
        <div style={{
          position: "absolute", right: 18, top: 16, fontSize: 9, fontWeight: 700,
          color: colors.textOnDarkDim, textTransform: "uppercase" as const, letterSpacing: 0.6,
          pointerEvents: "none", userSelect: "none",
        }}>
          Obdobie: {filterLabel(filter)}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: colors.textOnDarkDim, textTransform: "uppercase", letterSpacing: 1.2 }}>Predaj a tržby</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: colors.textOnDarkWeak, marginTop: 3 }}>Odovzdané objednávky so sumou</div>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: colors.white, letterSpacing: -0.75 }}>{totalRevenue.toFixed(2)}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: colors.textOnDark }}>€</span>
          <span style={{ fontSize: 10, fontWeight: 500, color: colors.textOnDarkWeak, marginLeft: 5 }}>tržba{deliveredQty > 0 ? ` · ${deliveredQty} ks` : ""}</span>
        </div>

        {/* Accent connector band – flows visually into the dominant Zisk tile */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2.5, background: profitGradient }} />
      </div>

      {/* Ledger rows – Tržby / Náklady / Zisk ako finančný výkaz */}
      <div style={{ background: colors.white, padding: "16px 18px 14px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: delivered.length > 0 ? 14 : 4 }}>
          {[
            { label: "Tržby", val: `${totalRevenue.toFixed(2)} €`, accent: colors.accent, sign: "▲" },
            { label: "Náklady", val: `${totalExpenses.toFixed(2)} €`, accent: "#E05A3A", sign: "▼" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: r.accent }}>{r.sign}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: colors.dark, letterSpacing: 0.4, textTransform: "uppercase" }}>{r.label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{r.val}</span>
            </div>
          ))}

          {/* Separator */}
          <div style={{ borderTop: `1.5px solid ${colors.border}`, margin: "3px 0" }} />

          {/* Profit – dominant footer row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: profitGradient, borderRadius: 10, padding: "10px 12px",
            boxShadow: shadows.statStrong,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: 0.6, textTransform: "uppercase" }}>Zisk</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: colors.white, letterSpacing: -0.3 }}>{profit.toFixed(2)} €</span>
          </div>
        </div>

        {delivered.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: 11, color: colors.dark, opacity: 0.45, paddingBottom: 4 }}>Žiadne odovzdané objednávky so sumou</div>
        ) : (
          <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
            <button onClick={() => setExpanded(v => !v)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", border: "none", cursor: "pointer", padding: "2px 0 8px", fontFamily: typography.fontFamily,
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.8 }}>Detail ({delivered.length} objednávok)</span>
              <ChevronDownIcon rotated={expanded} />
            </button>
            {expanded && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 4 }}>
                {delivered.map(o => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{o.customer}</div>
                      <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark }}>{o.qty} ks · {o.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: colors.dark }}>{(o.paid ?? 0).toFixed(2)} €</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}