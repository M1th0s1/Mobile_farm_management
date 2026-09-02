import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { ChickenLineIcon } from "@/components/ui/Icons";
import { colors, gradients, radius, shadows, typography } from "@/theme/tokens";

export type CreateTurnusData = {
  count: number;
  startedAt: string;
  hallName?: string;
  feed?: string;
  price?: number;
};

export default function CreateTurnusModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (data: CreateTurnusData) => void;
}) {
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hall, setHall] = useState("");
  const [feed, setFeed] = useState("");

  const canSubmit = parseInt(count) > 0 && !!date;

  const unit = parseInt(count, 10) > 0 && parseFloat(price) > 0 ? parseFloat(price) / parseInt(count, 10) : null;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({
      count: parseInt(count, 10),
      startedAt: date,
      hallName: hall.trim() || undefined,
      feed: feed.trim() || undefined,
      price: parseFloat(price) > 0 ? parseFloat(price) : undefined,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: radius.lg,
    border: `1.5px solid ${colors.border}`, background: colors.bg,
    fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 500, color: colors.text,
    outline: "none", boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <BottomSheet
      onClose={onClose}
      overlayStyle={{ background: colors.overlay, zIndex: 60 }}
      sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: shadows.modal }}
      handleStyle={{ marginBottom: 16 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: colors.accent + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChickenLineIcon size={20} color={colors.dark} />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>Nový turnus</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark }}>Zaeviduj nákup nového kŕdľa</div>
        </div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Počet kusov *</div>
      <input
        type="number" min="1" value={count}
        onChange={e => setCount(e.target.value)}
        placeholder="napr. 500"
        style={{ ...inputStyle, fontSize: 24, fontWeight: 900, textAlign: "center", letterSpacing: -0.5 }}
      />

      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: -4, marginBottom: 14 }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Cena za všetky (€)</div>
          <input
            type="number" min="0" step="0.01" value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="napr. 128"
            style={{ ...inputStyle, marginBottom: 0, textAlign: "center", fontWeight: 800 }}
          />
        </div>
        <div style={{ flex: 1, padding: "11px 10px", borderRadius: radius.lg, background: colors.accent + "12", border: `1px solid ${colors.accent + "30"}`, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.5 }}>cena za ks</div>
          <div style={{ fontSize: 19, fontWeight: 900, color: colors.dark, letterSpacing: -0.3, marginTop: 2 }}>
            {unit !== null ? `${unit.toLocaleString("sk-SK", { maximumFractionDigits: 2 })} €` : "–"}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Dátum nákupu *</div>
      <input
        type="date" value={date}
        onChange={e => setDate(e.target.value)}
        style={inputStyle}
      />

      <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Hala (voliteľné)</div>
      <input
        value={hall}
        onChange={e => setHall(e.target.value)}
        placeholder="napr. Veľká hala"
        style={inputStyle}
      />

      <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Krmivo (voliteľné)</div>
      <input
        value={feed}
        onChange={e => setFeed(e.target.value)}
        placeholder="napr. BR1 (Štartér)"
        style={{ ...inputStyle, marginBottom: 20 }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "14px", borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
        <button onClick={submit} style={{
          flex: 2, padding: "14px", borderRadius: radius.xl, border: "none",
          background: canSubmit ? gradients.primary : colors.disabled,
          fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: canSubmit ? "pointer" : "default",
        }}>Vytvoriť turnus</button>
      </div>
    </BottomSheet>
  );
}
