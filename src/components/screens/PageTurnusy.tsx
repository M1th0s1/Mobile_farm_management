import { useState } from "react";
import PageShell from "@/components/ui/PageShell";
import CreateTurnusModal from "@/components/dashboard/CreateTurnusModal";
import BatchDetail, { type BatchUpdate } from "@/components/dashboard/BatchDetail";
import { ChickenLineIcon, SkullIcon } from "@/components/ui/Icons";
import { batchPhaseGradient, colors, gradients, shadows, typography } from "@/theme/tokens";
import type { Batch } from "@/types";

export default function PageTurnusy({ batches, salesByBatch, onCreateTurnus, onEndTurnus, onUpdateTurnus, onDeleteTurnus, onMortality, onBack }: {
  batches: Batch[];
  salesByBatch?: Record<string, { ordered: number; toSell: number }>;
  onCreateTurnus: (data: { count: number; startedAt: string; hallName?: string; feed?: string }) => void;
  onEndTurnus: (b: Batch) => void;
  onUpdateTurnus: (b: Batch, data: BatchUpdate) => void;
  onDeleteTurnus: (b: Batch) => void;
  onMortality: (b: Batch, count: number) => void;
  onBack: () => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [detailBatch, setDetailBatch] = useState<Batch | null>(null);
  const totalCount = batches.reduce((s, b) => s + b.count, 0);
  const totalMortality = batches.reduce((s, b) => s + b.mortality, 0);

  return (
    <PageShell title="Všetky turnusy" icon={<ChickenLineIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px" }}>
        {/* Summary */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Turnusy", val: String(batches.length), grad: gradients.statDark },
            { label: "Celkom ks", val: totalCount.toLocaleString("sk-SK"), grad: gradients.statGreen },
            { label: "Úhyn spolu", val: String(totalMortality), grad: gradients.statDarker },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: s.grad, borderRadius: 14, padding: "12px 10px", textAlign: "center", boxShadow: shadows.statStrong }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: colors.white }}>{s.val}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowCreate(true)} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: gradients.primary, fontFamily: typography.fontFamily,
          fontWeight: 800, fontSize: 13, color: colors.white, cursor: "pointer", marginBottom: 16,
        }}>+ Nový turnus</button>

        {/* Batch cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {batches.map(b => {
            const phaseSales = salesByBatch?.[b.id] ?? { ordered: 0, toSell: 0 };
            const orderedPct = Math.min(100, Math.round((phaseSales.ordered / b.count) * 100));
            const phaseOrder = b.phase === "starter" ? 0 : b.phase === "growth" ? 1 : 2;

            const parseBatchId = (rawId: string) => {
              const match = rawId.match(/^(?:Turnus:?\s*)?([^(]+)(?:\(([^)]+)\))?/i);
              if (match) {
                const code = match[1].trim();
                const location = match[2]?.trim();
                const title = code.toLowerCase().startsWith("turnus") ? code : `Turnus ${code}`;
                return { title, location };
              }
              return { title: rawId, location: undefined };
            };

            const { title, location } = parseBatchId(b.id);
            const cardGradient = batchPhaseGradient(b.phase);

            return (
              <div key={b.id} onClick={() => setDetailBatch(b)} style={{
                background: cardGradient,
                borderRadius: 22, padding: "20px",
                position: "relative", overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                boxShadow: shadows.cardBatch,
                cursor: "pointer",
              }}>
                {/* Background Watermark */}
                <svg
                  style={{
                    position: "absolute",
                    right: -20,
                    top: -16,
                    width: 150,
                    height: 150,
                    opacity: 0.07,
                    pointerEvents: "none",
                  }}
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="2.5" strokeDasharray="4 2" />
                  <circle cx="50" cy="50" r="38" stroke="white" strokeWidth="1.5" />
                  <ellipse cx="50" cy="50" rx="14" ry="12" fill="white" />
                </svg>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative", zIndex: 2 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: colors.white, letterSpacing: -0.3 }}>{title}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
                      {location ? `${location} · ` : ""}Fáza {b.phaseLabel}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    {[0, 1, 2].map(idx => {
                      const isDone = idx < phaseOrder;
                      const isCurrent = idx === phaseOrder;
                      return (
                        <div key={idx} style={{
                          width: isCurrent ? 20 : 14,
                          height: 6,
                          borderRadius: 3,
                          background: isDone
                            ? "rgba(255,255,255,0.85)"
                            : isCurrent
                              ? colors.white
                              : "rgba(255,255,255,0.25)",
                          boxShadow: isCurrent ? "0 0 6px rgba(255,255,255,0.6)" : "none",
                          transition: "all 0.2s ease",
                        }} />
                      );
                    })}
                  </div>
                </div>

                {/* 3-Part Match Layout */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.18)",
                  marginBottom: 12,
                  position: "relative",
                  zIndex: 2,
                }}>
                  {/* Left: Flock */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                    }}>
                      <ChickenLineIcon color="white" size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: colors.white }}>{b.count.toLocaleString("sk-SK")} ks</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.5 }}>Kŕdeľ</div>
                    </div>
                  </div>

                  {/* Center: Day & Feed */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: colors.white, letterSpacing: -0.4 }}>{b.day}. deň</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{b.feed}</div>
                  </div>

                  {/* Right: Mortality */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: colors.white }}>{b.mortality} ks</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.5 }}>Úhyn</div>
                    </div>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(224,90,58,0.22) 0%, rgba(255,255,255,0.06) 100%)",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                    }}>
                      <SkullIcon color="white" size={20} strokeWidth={1.8} />
                    </div>
                  </div>
                </div>

                {/* Progress: ordered */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Objednané</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: colors.white }}>{phaseSales.ordered} ks · {orderedPct}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${orderedPct}%`, background: colors.white, borderRadius: 3, opacity: 0.9 }} />
                  </div>
                </div>

                {/* Footer: status */}
                <div style={{ position: "relative", zIndex: 2, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {b.endedAt && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                      ✓ Ukončený {b.endedAt}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreate && <CreateTurnusModal onClose={() => setShowCreate(false)} onCreate={onCreateTurnus} />}
      {detailBatch && (
        <BatchDetail
          batch={detailBatch}
          onClose={() => setDetailBatch(null)}
          onUpdate={onUpdateTurnus}
          onMortality={onMortality}
          onEnd={onEndTurnus}
          onDelete={onDeleteTurnus}
        />
      )}
    </PageShell>
  );
}