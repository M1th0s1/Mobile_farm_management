import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { SkullIcon } from "@/components/ui/Icons";
import { colors, dangerColors, typography } from "@/theme/tokens";
import { sectionLabel, ghostButton } from "@/styles/shared";
import type { Batch } from "@/types";

export default function UhynModal({ batches, onClose, onSubmit }: {
  batches: Batch[];
  onClose: () => void;
  onSubmit: (batchIdx: number, count: number) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [value, setValue] = useState("");
  const canSubmit = !!value && parseInt(value) > 0;

  const submit = () => {
    const n = parseInt(value, 10);
    if (!canSubmit) return;
    onSubmit(selectedIdx, n);
    onClose();
  };

  return (
    <BottomSheet
      onClose={onClose}
      overlayStyle={{ background: colors.overlay, zIndex: 60 }}
      sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: "0 -8px 40px rgba(19,94,75,0.2)" }}
      handleStyle={{ marginBottom: 16 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: dangerColors.softBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SkullIcon size={18} color={dangerColors.dark} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text }}>Zapísať úhyn</div>
      </div>

      <div style={sectionLabel}>Vybrať turnus</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {batches.map((b, i) => {
          const active = selectedIdx === i;
          return (
            <button key={b.id} onClick={() => setSelectedIdx(i)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: 14, cursor: "pointer",
              border: `1.5px solid ${active ? colors.accent : colors.border}`,
              background: active ? colors.accent + "12" : colors.bg,
              fontFamily: typography.fontFamily, transition: "all 0.15s ease",
            }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: colors.text }}>{b.id}</div>
                <div style={{ fontSize: 10, fontWeight: 500, color: colors.dark, marginTop: 2 }}>{b.phaseLabel} · {b.day}. deň · zostatok {b.count} ks</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${active ? colors.accent : colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {active && <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.accent }} />}
              </div>
            </button>
          );
        })}
      </div>

      <div style={sectionLabel}>Počet uhynutých (ks)</div>
      <input
        type="number" min="1" value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="0"
        style={{
          width: "100%", padding: "14px", borderRadius: 12, border: `1.5px solid ${colors.border}`,
          background: colors.bg, fontFamily: typography.fontFamily, fontSize: 28,
          fontWeight: 900, color: colors.text, outline: "none", boxSizing: "border-box",
          textAlign: "center", letterSpacing: -1,
        }}
      />
      <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, textAlign: "center", marginTop: 6, marginBottom: 20 }}>
        Zostatok po zápise: <strong style={{ color: colors.dark }}>{Math.max(0, (batches[selectedIdx]?.count ?? 0) - (parseInt(value) || 0))} ks</strong>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onClose} style={ghostButton}>Zrušiť</button>
        <button onClick={submit} style={{
          flex: 2, padding: "14px", borderRadius: 14, border: "none",
          background: canSubmit ? dangerColors.gradient : colors.disabled,
          fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer",
          transition: "background 0.2s ease",
        }}>Zapísať úhyn</button>
      </div>
    </BottomSheet>
  );
}