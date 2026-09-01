import PageShell from "@/components/ui/PageShell";
import Card from "@/components/ui/Card";
import BarChart from "@/components/ui/BarChart";
import { ChartIcon } from "@/components/ui/Icons";
import { colors, typography } from "@/theme/tokens";
import { statTile } from "@/styles/shared";
import { mortalityWeeks, revenueMonths } from "@/data/mockData";

export default function PageStatistiky({ onBack }: { onBack: () => void }) {
  return (
    <PageShell title="Štatistiky" icon={<ChartIcon size={24} />} onBack={onBack}>
      <div style={{ padding: "0 16px 16px", fontFamily: typography.fontFamily }}>
        {/* KPI row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { label: "Priemerný úhyn", val: "1.8%", sub: "za turnus" },
            { label: "Kapacita", val: "87%", sub: "využitie" },
            { label: "Tržby aug.", val: "1 140 €", sub: "tento mesiac" },
          ].map(s => (
            <div key={s.label} style={statTile}>
              <div style={{ fontSize: 16, fontWeight: 900, color: colors.white, letterSpacing: -0.5 }}>{s.val}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mortality chart */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>Úhyn po týždňoch (ks)</div>
          <BarChart data={mortalityWeeks} color={colors.dark} unit="ks" />
        </Card>

        {/* Revenue chart */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>Tržby po mesiacoch (€)</div>
          <BarChart data={revenueMonths} color={colors.dark} unit="€" />
        </Card>

        {/* Utilization */}
        <Card>
          <div style={{ fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>Využitie kapacity hál</div>
          {[
            { label: "Veľká hala (700 ks)", used: 485 + 418, total: 1400 },
            { label: "Malá hala (400 ks)",  used: 320,       total: 400  },
          ].map(h => {
            const pct = Math.round((h.used / h.total) * 100);
            return (
              <div key={h.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: colors.dark }}>{h.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: colors.dark }}>{pct}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </PageShell>
  );
}