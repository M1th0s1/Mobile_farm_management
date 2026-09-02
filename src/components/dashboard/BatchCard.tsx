import { batchPhaseGradient, colors } from "@/theme/tokens";
import { daysLeftLabel } from "@/utils/date";
import { ChickenLineIcon, EuroIcon, SkullIcon } from "@/components/ui/Icons";
import type { Batch } from "@/types";

export default function BatchCard({ batch, onClick }: { batch: Batch; onClick?: () => void }) {
  const phaseOrder = batch.phase === "starter" ? 0 : batch.phase === "growth" ? 1 : 2;
  const phases = [0, 1, 2];

  // Parse batch title and location cleanly
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

  const { title, location } = parseBatchId(batch.id);
  const slaughterLabel = daysLeftLabel(batch.slaughterDate);
  const totalPrice = batch.purchasePrice != null ? batch.purchasePrice : null;
  const unitPrice = totalPrice !== null && batch.initialCount ? totalPrice / batch.initialCount : null;
  const fmtEur = (n: number) => n.toLocaleString("sk-SK", { maximumFractionDigits: 2 });

  // Gradient tones preserving the farm dark green / emerald brand palette
  const cardGradient = batchPhaseGradient(batch.phase);

  return (
    <div
      className="carousel-item flex-shrink-0"
      onClick={onClick}
      style={{
        width: "calc(100vw - 40px)",
        maxWidth: 390,
        cursor: onClick ? "pointer" : undefined,
        borderRadius: 24,
        padding: "20px 20px 20px",
        position: "relative",
        overflow: "hidden",
        background: cardGradient,
        border: "1px solid rgba(255, 255, 255, 0.16)",
        boxShadow: "none",
      }}
    >
      {/* Top Header: Title, Subtitle, and Phase Indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.3,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.72)",
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {location ? `${location} · ` : ""}Fáza {batch.phaseLabel}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7 }}>
          {totalPrice !== null && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 10,
                padding: "3px 9px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }}
            >
              <EuroIcon color="white" size={11} strokeWidth={2.4} />
              <span style={{ fontSize: 11, fontWeight: 900, color: colors.white, letterSpacing: -0.2 }}>
                {fmtEur(totalPrice)} €
              </span>
            </div>
          )}

          {/* Phase Stepper Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {phases.map((idx) => {
              const isDone = idx < phaseOrder;
              const isCurrent = idx === phaseOrder;
              return (
                <div
                  key={idx}
                  style={{
                    width: isCurrent ? 22 : 16,
                    height: 6,
                    borderRadius: 3,
                    background: isDone
                      ? "rgba(255, 255, 255, 0.85)"
                      : isCurrent
                      ? colors.white
                      : "rgba(255, 255, 255, 0.25)",
                    boxShadow: isCurrent ? "0 0 8px rgba(255, 255, 255, 0.7)" : "none",
                    transition: "all 0.25s ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 3-Column Match Style Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          padding: "4px 4px 2px",
        }}
      >
        {/* Left Team/Entity: Kŕdeľ / Počet kusov */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 86,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)",
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
              boxShadow: "0 6px 14px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <ChickenLineIcon color="white" size={28} />
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.3,
              lineHeight: 1.15,
            }}
          >
            {batch.count.toLocaleString("sk-SK")} ks
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 2,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Kŕdeľ
          </div>
          {unitPrice !== null && (
            <div
              style={{
                marginTop: 5,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 7,
                padding: "2px 7px",
                fontSize: 9,
                fontWeight: 800,
                color: colors.white,
                letterSpacing: -0.2,
                whiteSpace: "nowrap",
              }}
            >
              {fmtEur(unitPrice)} €/ks
            </div>
          )}
        </div>

        {/* Center Match Highlight: Vek & Krmivo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 6px",
            minWidth: 100,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: colors.white,
              letterSpacing: -0.5,
              lineHeight: 1,
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {batch.day}. deň
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "rgba(255, 255, 255, 0.88)",
              marginTop: 6,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: 110,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {batch.feed}
          </div>
        </div>

        {/* Right Team/Entity: Úhyn */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 86,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(224,90,58,0.22) 0%, rgba(255,255,255,0.06) 100%)",
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
              boxShadow: "0 6px 14px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <SkullIcon color="white" size={24} strokeWidth={1.8} />
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: colors.white,
              letterSpacing: -0.3,
              lineHeight: 1.15,
            }}
          >
            {batch.mortality} ks
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.7)",
              marginTop: 2,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Úhyn
          </div>
        </div>
      </div>

      {/* Planned slaughter – pod riadkom, s odstupom od dní */}
      {(batch.slaughterDate || batch.slaughterRange) && (
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: 0.3 }}>
            Porážka: {batch.slaughterDate || batch.slaughterRange}
          </div>
          {slaughterLabel && (
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
              {slaughterLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}