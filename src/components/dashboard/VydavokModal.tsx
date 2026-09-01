import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { EuroIcon, FeedIcon, MedicationIcon, PackageIcon, ToolIcon } from "@/components/ui/Icons";
import { colors, gradients, typography } from "@/theme/tokens";
import { sectionLabel, ghostButton } from "@/styles/shared";
import { formatDate } from "@/utils/date";
import type { Expense } from "@/types";

const expenseCategories = [
  { key: "krmivo",   label: "Krmivo" },
  { key: "lek",      label: "Lieky" },
  { key: "material", label: "Materiál" },
  { key: "ine",      label: "Iné" },
];

const categoryIconComp = {
  krmivo:   FeedIcon,
  lek:      MedicationIcon,
  material: ToolIcon,
  ine:      PackageIcon,
} as const;

export default function VydavokModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (e: Expense) => void;
}) {
  const [category, setCategory] = useState("krmivo");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => toInputDate(new Date()));
  const canSubmit = !!name.trim() && parseFloat(amount) > 0;

  /** Prevedie Date na RRRR-MM-DD (HTML input type="date" formát) */
  function toInputDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  const submit = () => {
    const a = parseFloat(amount.replace(",", "."));
    if (!name.trim() || !a || a <= 0) return;
    const d = date ? new Date(date + "T00:00:00") : new Date();
    onSubmit({ category, name: name.trim(), amount: a, date: formatDate(d) });
    onClose();
  };

  return (
    <BottomSheet
      onClose={onClose}
      sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: "0 -8px 40px rgba(19,94,75,0.2)" }}
      handleStyle={{ marginBottom: 16 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: colors.accent + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EuroIcon size={18} color={colors.dark} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>Nový výdavok</div>
      </div>

      <div style={sectionLabel}>Kategória</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {expenseCategories.map(c => {
          const active = category === c.key;
          return (
            <button key={c.key} onClick={() => setCategory(c.key)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 12, cursor: "pointer",
              border: `1.5px solid ${active ? colors.dark : colors.border}`,
              background: active ? colors.dark : colors.bg,
              fontFamily: typography.fontFamily, fontSize: 9, fontWeight: 800,
              color: active ? colors.white : colors.dark,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              transition: "all 0.15s ease",
            }}>
              <span style={{ display: "flex" }}>
                {(() => {
                  const IconComp = categoryIconComp[c.key as keyof typeof categoryIconComp];
                  return <IconComp color={active ? colors.white : colors.dark} size={24} />;
                })()}
              </span>
              {c.label}
            </button>
          );
        })}
      </div>

      <div style={sectionLabel}>Popis výdavku</div>
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="napr. Krmivo BR2 — 100 kg"
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${colors.border}`,
          background: colors.bg, fontFamily: typography.fontFamily, fontSize: 14,
          fontWeight: 600, color: colors.text, outline: "none", boxSizing: "border-box", marginBottom: 12,
        }}
      />

      <div style={sectionLabel}>Suma (€)</div>
      <input
        type="number" min="0" step="0.01" value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="0.00"
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${colors.border}`,
          background: colors.bg, fontFamily: typography.fontFamily, fontSize: 24,
          fontWeight: 900, color: colors.text, outline: "none", boxSizing: "border-box",
          textAlign: "center", letterSpacing: -0.5, marginBottom: 16,
        }}
      />

      <div style={sectionLabel}>Dátum</div>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${colors.border}`,
          background: colors.bg, fontFamily: typography.fontFamily, fontSize: 14,
          fontWeight: 600, color: colors.text, outline: "none", boxSizing: "border-box", marginBottom: 20,
        }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={ghostButton}>Zrušiť</button>
        <button onClick={submit} style={{
          flex: 2, padding: "14px", borderRadius: 14, border: "none",
          background: canSubmit ? gradients.primary : colors.disabled,
          fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer",
          transition: "background 0.2s ease",
        }}>Uložiť výdavok</button>
      </div>
    </BottomSheet>
  );
}