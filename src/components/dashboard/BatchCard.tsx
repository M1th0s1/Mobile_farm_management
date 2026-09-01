import { batchPhaseGradient, colors } from "@/theme/tokens";
import { ChickenLineIcon, SkullIcon } from "@/components/ui/Icons";
import type { Batch } from "@/types";

export default function BatchCard({ batch, isCenter }: { batch: Batch; isCenter: boolean }) {
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

  // Gradient tones preserving the farm dark green / emerald brand palette
  const cardGradient = batchPhaseGradient(batch.phase);

  return (
    <div
      className="carousel-item flex-shrink-0"
      style={{
        width: "calc(100vw - 40px)",
        maxWidth: 390,
        borderRadius: 24,
        padding: "20px 20px 20px",
        position: "relative",
        overflow: "hidden",
        background: cardGradient,
        border: "1px solid rgba(255, 255, 255, 0.16)",
        boxShadow: isCenter
          ? "0 14px 32px -4px rgba(19, 94, 75, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.25)"
          : "0 6px 18px rgba(19, 94, 75, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, box-shadow 0.3s ease",
        transform: isCenter ? "scale(1)" : "scale(0.93)",
        opacity: isCenter ? 1 : 0.78,
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

        {/* Phase Stepper Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
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
    </div>
  );
}