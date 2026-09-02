import { colors } from "@/theme/tokens";
import type { SeriesPoint } from "@/utils/stats";

/** Skrátený formát čísla pre hodnotu nad stĺpcom (1.2k / 450). */
function shortNum(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `${Math.round(v)}`;
}

/**
 * Pruhový graf s dvoma sériami (napr. Tržby zelená / Náklady oranžová).
 * Vrchol každej série má malú hodnotu; os x = popisok obdobia.
 */
export default function GroupBars({ data, a, b, unit = "€" }: {
  data: SeriesPoint[];
  a: { label: string; color: string };
  b: { label: string; color: string };
  unit?: string;
}) {
  const max = Math.max(1, ...data.flatMap(d => [d.a, d.b]));

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", color: colors.dark, fontSize: 12, opacity: 0.5, padding: "26px 0" }}>
        Zatiaľ žiadne dáta za zvolené obdobie
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 96, padding: "0 2px" }}>
        {data.map(d => (
          <div key={d.label} style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, height: "100%" }}>
            {[{ key: "a", val: d.a, color: a.color }, { key: "b", val: d.b, color: b.color }].map(s => (
              <div key={s.key} style={{ position: "relative", width: "100%", maxWidth: 16, height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <div style={{
                  width: "100%",
                  height: `${Math.max(4, (s.val / max) * 100)}%`,
                  background: s.val === 0 ? `${s.color}33` : `linear-gradient(180deg, ${s.color}, ${s.color}bb)`,
                  borderRadius: "5px 5px 2px 2px",
                }} />
                {s.val > 0 && (
                  <span style={{
                    position: "absolute", bottom: `calc(${Math.max(4, (s.val / max) * 100)}% + 2px)`,
                    fontSize: 7, fontWeight: 800, color: s.color, whiteSpace: "nowrap",
                  }}>
                    {shortNum(s.val)}{unit}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Os x – obdobia */}
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        {data.map(d => (
          <span key={d.label} style={{ flex: 1, textAlign: "center", fontSize: 9, fontWeight: 700, color: colors.dark }}>{d.label}</span>
        ))}
      </div>

      {/* Legenda */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10 }}>
        {[{ label: a.label, color: a.color }, { label: b.label, color: b.color }].map(s => (
          <span key={s.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, color: colors.dark }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, display: "inline-block" }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
