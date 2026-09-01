import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import { CalendarIcon, CheckSmallIcon, KnifeIcon } from "@/components/ui/Icons";
import { colors, dangerColors, radius, typography } from "@/theme/tokens";
import { slaughterPlans } from "@/data/mockData";

function Countdown({ days }: { days: number }) {
  return (
    <div style={{ background: colors.dark + "18", borderRadius: radius.md, padding: "6px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: colors.dark, letterSpacing: -1 }}>{days}</div>
      <div style={{ fontSize: 8, fontWeight: 700, color: colors.dark, textTransform: "uppercase", letterSpacing: 0.5 }}>dní</div>
    </div>
  );
}

export default function PageZabijacka({ onBack }: { onBack: () => void }) {
  const next = slaughterPlans[0];

  return (
    <PageShell title="Zabijačka" icon={<KnifeIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px", fontFamily: typography.fontFamily }}>
        {/* Next slaughter highlight */}
        <div style={{
          background: dangerColors.gradient,
          borderRadius: 20, padding: "20px", marginBottom: 16,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1 }}>Najbližšia porážka</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: colors.white, marginTop: 6 }}>Turnus {next.turnus}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" }}>Dátum</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.white }}>{next.date}</div>
            </div>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" }}>Počet</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.white }}>{next.qty} ks</div>
            </div>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.2)" }} />
            <div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" }}>Zostáva</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.white }}>{next.daysLeft} dní</div>
            </div>
          </div>
        </div>

        {/* All plans */}
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Plán porážok</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {slaughterPlans.map(p => (
            <Card key={p.turnus}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Countdown days={p.daysLeft} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: colors.text }}>Turnus {p.turnus}</div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                    <CalendarIcon size={12} color={colors.dark} />
                    {p.date} · {p.qty} ks · {p.day}. deň
                  </div>
                </div>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <path d="M1 1L7 7L1 13" stroke="#BBBBBB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Card>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, margin: "20px 0 12px" }}>Prípravný checklist</div>
        <Card>
          {[
            { label: "Kontaktovať jatky", done: true },
            { label: "Pripraviť klietky na prepravu", done: true },
            { label: "Objednať kamión", done: false },
            { label: "Informovať zákazníkov", done: false },
            { label: "Vystaviť faktúry", done: false },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${colors.bg}` : "none",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: item.done ? colors.accent : colors.bg,
                border: `1.5px solid ${item.done ? colors.accent : colors.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {item.done && <CheckSmallIcon />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, textDecoration: item.done ? "line-through" : "none", opacity: item.done ? 0.45 : 1 }}>{item.label}</span>
            </div>
          ))}
        </Card>
      </div>
    </PageShell>
  );
}