import { colors, typography } from "@/theme/tokens";

type BarDatum = { label: string; val: number };

export default function BarChart({ data, color, unit }: { data: BarDatum[]; color: string; unit: string }) {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90, padding: "0 4px" }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%",
              height: `${Math.max(8, (d.val / max) * 100)}%`,
              background: `linear-gradient(180deg, ${color}, ${color}88)`,
              borderRadius: "6px 6px 3px 3px",
              position: "relative",
            }}>
              <span style={{
                position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)",
                fontSize: 9, fontWeight: 800, color, whiteSpace: "nowrap",
              }}>{d.val}{unit}</span>
            </div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 600, color: colors.dark }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}