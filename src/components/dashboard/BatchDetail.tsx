import { useState } from "react";
import BottomSheet from "@/components/ui/BottomSheet";
import { SkullIcon } from "@/components/ui/Icons";
import { batchPhaseGradient, colors, gradients, radius, shadows, typography } from "@/theme/tokens";
import type { Batch } from "@/types";

export type BatchUpdate = { count?: number; feed?: string; slaughterDate?: string; price?: number | null };

function toInputDate(app?: string): string {
  if (!app) return "";
  const [d, m, y] = app.split(".");
  return `${y}-${m}-${d}`;
}
function toAppDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default function BatchDetail({ batch, onClose, onUpdate, onMortality, onEnd, onDelete }: {
  batch: Batch;
  onClose: () => void;
  onUpdate: (b: Batch, data: BatchUpdate) => void;
  onMortality: (b: Batch, count: number) => void;
  onEnd: (b: Batch) => void;
  onDelete: (b: Batch) => void;
}) {
  const [count, setCount] = useState(String(batch.count));
  const [feed, setFeed] = useState(batch.feed);
  const [price, setPrice] = useState(batch.purchasePrice != null ? String(batch.purchasePrice) : "");
  const [slaughterDate, setSlaughterDate] = useState(() => toInputDate(batch.slaughterDate));
  const [mortality, setMortality] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  const unit = parseFloat(price) > 0 && batch.initialCount ? parseFloat(price) / batch.initialCount : null;

  const save = () => {
    onUpdate(batch, {
      count: parseInt(count, 10),
      feed,
      slaughterDate: slaughterDate ? toAppDate(slaughterDate) : undefined,
      price: price.trim() !== "" && parseFloat(price) > 0 ? parseFloat(price) : null,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const submitMortality = () => {
    const n = parseInt(mortality, 10);
    if (n > 0) onMortality(batch, n);
    setMortality("");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: radius.lg,
    border: `1.5px solid ${colors.border}`, background: colors.bg,
    fontFamily: typography.fontFamily, fontSize: 13, fontWeight: 600, color: colors.text,
    outline: "none", boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: colors.white, zIndex: 90, overflowY: "auto", fontFamily: typography.fontFamily }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 10px" }}>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 12, background: colors.white, border: `1.5px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d="M8 2L2 8L8 14" stroke={colors.dark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, letterSpacing: -0.4, flex: 1 }}>{batch.id}</div>
        {batch.endedAt && (
          <span style={{ fontSize: 9, fontWeight: 800, color: colors.dark, background: colors.dark + "10", padding: "5px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>Ukončený</span>
        )}
      </div>

      <div style={{ padding: "0 16px 40px" }}>
        {/* Summary card */}
        <div style={{ background: batchPhaseGradient(batch.phase), borderRadius: 20, padding: 18, marginBottom: 16, color: colors.white, boxShadow: shadows.statStrong }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.8 }}>Fáza</div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.4 }}>{batch.phaseLabel}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.8 }}>Deň</div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{batch.day}.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{batch.count.toLocaleString("sk-SK")} ks</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: 2 }}>Kŕdeľ</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>{batch.mortality} ks</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: 2 }}>Úhyn</div>
            </div>
          </div>
        </div>

        {/* Edit */}
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, margin: "16px 0 10px" }}>Úprava turnusu</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Počet kusov</div>
        <input type="number" min="0" value={count} onChange={e => setCount(e.target.value)} style={inputStyle} />
        <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>Krmivo</div>
        <input value={feed} onChange={e => setFeed(e.target.value)} placeholder="napr. BR1 (Štartér)" style={inputStyle} />

        {/* Purchase price */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.6, flex: 1 }}>Cena za všetky (€)</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.accent, background: colors.accent + "14", padding: "4px 10px", borderRadius: 20 }}>cena za ks: {unit !== null ? `${unit.toLocaleString("sk-SK", { maximumFractionDigits: 2 })} €` : "–"}</div>
        </div>
        <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="napr. 128" style={inputStyle} />

        {/* Úhyn quick entry */}
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, margin: "16px 0 10px" }}>Zapísať úhyn</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" min="1" value={mortality} onChange={e => setMortality(e.target.value)} placeholder="Počet ks" style={{ ...inputStyle, marginBottom: 12, flex: 1 }} />
          <button onClick={submitMortality} style={{
            width: 52, height: 44, borderRadius: radius.lg, border: "none", flexShrink: 0,
            background: gradients.primary, color: colors.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}><SkullIcon size={20} color="white" /></button>
        </div>

        {/* Slaughter planning */}
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, margin: "16px 0 10px" }}>Plánovaná porážka</div>
        <input type="date" value={slaughterDate} onChange={e => setSlaughterDate(e.target.value)} style={inputStyle} />

        <button onClick={save} style={{
          width: "100%", padding: "14px 0", borderRadius: radius.xl, border: "none",
          background: gradients.primary, fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer",
        }}>Uložiť zmeny</button>

        {!batch.endedAt && (
          <button onClick={() => setConfirmEnd(true)} style={{
            width: "100%", padding: "13px 0", borderRadius: radius.xl, marginTop: 12,
            border: `1.5px solid #FCA5A5`, background: "#FFF5F5",
            fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 12, color: "#B91C1C", cursor: "pointer",
          }}>Ukončiť turnus</button>
        )}

        {/* Delete – skryté v spodku */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => setConfirmDelete(true)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: typography.fontFamily, fontSize: 10, fontWeight: 600,
            color: colors.dark, opacity: 0.45, textDecoration: "underline",
          }}>Zmazať turnus</button>
        </div>
      </div>

      {saved && (
        <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", background: "#14532D", color: "#FFFFFF", padding: "10px 18px", borderRadius: 12, fontSize: 12, fontWeight: 700, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 6 }}>
          ✓ Zmeny uložené
        </div>
      )}

      {confirmEnd && (
        <BottomSheet onClose={() => setConfirmEnd(false)} overlayStyle={{ background: colors.overlay, zIndex: 95 }} sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: shadows.modal }} handleStyle={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, marginBottom: 8 }}>Ukončiť turnus?</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: colors.dark, marginBottom: 20 }}>Turnus <strong>{batch.id}</strong> sa uzavrie. Potom môžeš začať nový.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmEnd(false)} style={{ flex: 1, padding: "14px", borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
            <button onClick={() => { onEnd(batch); onClose(); }} style={{ flex: 2, padding: "14px", borderRadius: radius.xl, border: "none", background: "#B91C1C", fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer" }}>Ukončiť</button>
          </div>
        </BottomSheet>
      )}

      {confirmDelete && (
        <BottomSheet onClose={() => setConfirmDelete(false)} overlayStyle={{ background: colors.overlay, zIndex: 95 }} sheetStyle={{ padding: "20px 20px max(env(safe-area-inset-bottom, 24px), 24px)", boxShadow: shadows.modal }} handleStyle={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: colors.text, marginBottom: 8 }}>Zmazať turnus?</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: colors.dark, marginBottom: 20 }}>Turnus <strong>{batch.id}</strong> sa natrvalo odstráni. Objednávky ostanú (odpoja sa), úhyny a plány porážok sa zmažú.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: "14px", borderRadius: radius.xl, border: `1.5px solid ${colors.border}`, background: colors.white, fontFamily: typography.fontFamily, fontWeight: 700, fontSize: 13, color: colors.dark, cursor: "pointer" }}>Zrušiť</button>
            <button onClick={() => { onDelete(batch); onClose(); }} style={{ flex: 2, padding: "14px", borderRadius: radius.xl, border: "none", background: "#B91C1C", fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer" }}>Áno, zmazať</button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

