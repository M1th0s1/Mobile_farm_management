import type { CSSProperties, ReactNode } from "react";
import { colors, radius, shadows } from "@/theme/tokens";

export default function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: colors.white, borderRadius: radius.card, border: `1.5px solid ${colors.border}`, padding: "16px", boxShadow: shadows.card, ...style }}>
      {children}
    </div>
  );
}