import type { ReactNode } from "react";
import { colors, radius } from "@/theme/tokens";

export default function PageShell({ title, icon, onBack, children }: {
  title: string; icon?: ReactNode; onBack: () => void; children: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100svh", background: colors.white, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 10px" }}>
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: radius.md, background: colors.white, border: `1.5px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8 2L2 8L8 14" stroke={colors.dark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: colors.text, letterSpacing: -0.5 }}>{title}</div>
        </div>
        <div style={{ fontSize: 24 }}>{icon}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 100 }}>
        {children}
      </div>
    </div>
  );
}