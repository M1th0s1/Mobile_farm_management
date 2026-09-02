import { useState } from "react";
import { colors, gradients, typography } from "@/theme/tokens";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { computeFinance, fmtMoney } from "@/utils/finance";
import { filterLabel } from "@/utils/date";
import type { Expense, Order, SalesFilter } from "@/types";

/**
 * Plochý finančný prehľad (bez kartového vzhľadu – žiadne pozadie/rámik).
 * Layout kopíruje pôvodný „Predaj a tržby", aby turnusová karta vynikla.
 */
export default function FinanceLedger({ orders, expenses, filter }: {
  orders: Order[];
  expenses: Expense[];
  filter: SalesFilter;
}) {
  const [expanded, setExpanded] = useState(false);
  const { delivered, totalRevenue, deliveredQty, totalExpenses, profit } = computeFinance(orders, expenses, filter);
  const positive = profit >= 0;
  const period = filterLabel(filter);

  const ledgerRow = (label: string, value: number, sign: string, color: string, valueStyle?: React.CSSProperties) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 8, fontWeight: 800, color }}>{sign}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: colors.dark, letterSpacing: 0.3, textTransform: "uppercase" }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: colors.text, fontVariantNumeric: "tabular-nums", ...valueStyle }}>
        {fmtMoney(value)} €
      </span>
    </div>
  );

  return (
    <div style={{ padding: "10px 20px 6px" }}>
      {/* Hlavička – ako bežná sekcia obsahu */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: colors.text, letterSpacing: 0.5, textTransform: "uppercase" }}>Predaj a tržby</div>
          <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark, marginTop: 2 }}>Odovzdané objednávky so sumou</div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: colors.dark, opacity: 0.7 }}>{period}</div>
      </div>

      {/* Tržba – hero číslo */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 34, fontWeight: 900, color: colors.text, letterSpacing: -1.2, fontVariantNumeric: "tabular-nums" }}>{fmtMoney(totalRevenue)}</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: colors.dark }}>€</span>
        {deliveredQty > 0 && <span style={{ fontSize: 10, fontWeight: 600, color: colors.dark, marginLeft: 4 }}>· {deliveredQty} ks</span>}
      </div>

      {/* Ledger riadky */}
      <div style={{ marginTop: 14 }}>
        {ledgerRow("Tržby", totalRevenue, "▲", colors.accent)}
        {ledgerRow("Náklady", totalExpenses, "▼", "#E05A3A")}

        <div style={{ borderTop: `1px solid ${colors.border}`, margin: "6px 0 4px" }} />

        {/* Zisk / Strata – zvýraznený pás (zelený pri zisku, červený pri strate) */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: positive ? gradients.primary : gradients.danger,
          borderRadius: 12, padding: "11px 14px", marginTop: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: positive ? "#A7F3C2" : "#FCA5A5" }}>{positive ? "▲" : "▼"}</span>
            <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: 0.5, textTransform: "uppercase" }}>
              {positive ? "Zisk" : "Strata"} · {period}
            </span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
            {fmtMoney(profit)} €
          </span>
        </div>
      </div>

      {/* Detail odovzdaných objednávok */}
      {delivered.length === 0 ? (
        <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 10, padding: "10px 0 2px", textAlign: "center", fontSize: 11, color: colors.dark, opacity: 0.5 }}>
          Žiadne odovzdané objednávky so sumou
        </div>
      ) : (
        <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 10, paddingTop: 8 }}>
          <button onClick={() => setExpanded(v => !v)} style={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "none", border: "none", cursor: "pointer", padding: "6px 0 8px", fontFamily: typography.fontFamily,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Detail ({delivered.length} objednávok)
            </span>
            <ChevronDownIcon rotated={expanded} />
          </button>
          {expanded && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 8 }}>
              {delivered.map(o => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customer}</div>
                    <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark }}>{o.qty} ks · {o.date}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: colors.dark }}>{fmtMoney(o.paid ?? 0)} €</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
