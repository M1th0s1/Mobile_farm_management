import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { colors, typography } from "@/theme/tokens";
import { MONTH_NAMES } from "@/data/mockData";
import type { SalesFilter } from "@/types";

type Mode = "all" | "year" | "month" | "range";

/** Prevedie DD.MM.RRRR na RRRR-MM-DD (HTML date input) */
function toInputDate(s: string): string {
  const [dd, mm, yyyy] = s.split(".");
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm}-${dd}`;
}

/** Prevedie RRRR-MM-DD (HTML date input) na DD.MM.RRRR */
function toAppDate(s: string): string {
  const [yyyy, mm, dd] = s.split("-");
  if (!yyyy || !mm || !dd) return "";
  return `${dd}.${mm}.${yyyy}`;
}

export default function SalesFilterSheet({ filter, allYears, onApply, onClose }: {
  filter: SalesFilter;
  allYears: string[];
  onApply: (f: SalesFilter) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<Mode>(filter.type);
  const [year, setYear] = useState("year" in filter ? filter.year : (allYears[0] ?? "2026"));
  const [month, setMonth] = useState("month" in filter ? (filter as { month: string }).month : "01");
  const [from, setFrom] = useState("range" in filter ? toInputDate((filter as { from: string }).from) : "");
  const [to, setTo]   = useState("range" in filter ? toInputDate((filter as { to: string }).to) : "");

  function apply() {
    if (mode === "all")   { onApply({ type: "all" }); onClose(); }
    if (mode === "year")  { onApply({ type: "year", year }); onClose(); }
    if (mode === "month") { onApply({ type: "month", year, month }); onClose(); }
    if (mode === "range" && from && to) { onApply({ type: "range", from: toAppDate(from), to: toAppDate(to) }); onClose(); }
  }

  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "11px 14px", borderRadius: 12, border: `1.5px solid ${colors.border}`,
    fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 600, color: colors.text,
    background: colors.bg, outline: "none", boxSizing: "border-box",
  };

  const modeBtn = (m: Mode, label: string) => (
    <button key={m} onClick={() => setMode(m)} style={{
      flex: 1, padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${mode === m ? colors.dark : colors.border}`,
      background: mode === m ? colors.dark : colors.white, cursor: "pointer",
      fontFamily: typography.fontFamily, fontSize: 10, fontWeight: 800,
      color: mode === m ? colors.white : colors.dark, textTransform: "uppercase" as const, letterSpacing: 0.3,
      transition: "all 0.15s ease",
    }}>{label}</button>
  );

  return (
    <BottomSheet
      onClose={onClose}
      sheetStyle={{ padding: "20px 20px 40px" }}
      handleStyle={{ marginBottom: 18 }}
    >
      <div style={{ fontSize: 15, fontWeight: 900, color: colors.text, marginBottom: 18 }}>Filter obdobia</div>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {modeBtn("all", "Všetko")}
        {modeBtn("year", "Rok")}
        {modeBtn("month", "Mesiac")}
        {modeBtn("range", "Rozsah")}
      </div>

      {(mode === "year" || mode === "month") && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Rok</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: allYears.length > 1 ? 8 : 0 }}>
            <button onClick={() => setYear(y => String(Number(y) - 1))} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer", fontSize: 18, color: colors.dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>‹</button>
            <input
              type="number" value={year} onChange={e => setYear(e.target.value)}
              style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 12, border: `1.5px solid ${colors.dark}`, fontFamily: typography.fontFamily, fontSize: 15, fontWeight: 900, color: colors.dark, background: colors.dark + "08", outline: "none" }}
            />
            <button onClick={() => setYear(y => String(Number(y) + 1))} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${colors.border}`, background: colors.white, cursor: "pointer", fontSize: 18, color: colors.dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>›</button>
          </div>
          {allYears.length > 1 && (
            <div style={{ display: "flex", gap: 6 }}>
              {allYears.map(y => (
                <button key={y} onClick={() => setYear(y)} style={{
                  flex: 1, padding: "7px 0", borderRadius: 10, border: `1.5px solid ${year === y ? colors.dark : colors.border}`,
                  background: year === y ? colors.dark : colors.white, cursor: "pointer",
                  fontFamily: typography.fontFamily, fontSize: 12, fontWeight: 800,
                  color: year === y ? colors.white : colors.dark,
                }}>{y}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {mode === "month" && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Mesiac</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {MONTH_NAMES.map((mn, i) => {
              const m = String(i + 1).padStart(2, "0");
              return (
                <button key={m} onClick={() => setMonth(m)} style={{
                  padding: "8px 4px", borderRadius: 10, border: `1.5px solid ${month === m ? colors.dark : colors.border}`,
                  background: month === m ? colors.dark : colors.white, cursor: "pointer",
                  fontFamily: typography.fontFamily, fontSize: 10, fontWeight: 700,
                  color: month === m ? colors.white : colors.dark,
                }}>{mn.slice(0, 3)}</button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "range" && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Od – Do</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              style={{ ...inputStyle, minWidth: 0 }}
            />
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              style={{ ...inputStyle, minWidth: 0 }}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 14, borderRadius: 14, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
        <button onClick={apply} style={{ flex: 2, padding: 14, borderRadius: 14, border: "none", background: colors.dark, fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer" }}>Použiť filter</button>
      </div>
    </BottomSheet>
  );
}