import type { CSSProperties, ReactNode } from "react";
import { colors } from "@/theme/tokens";

export default function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 800, color: colors.text, textTransform: "uppercase",
      letterSpacing: 0.5, ...style,
    }}>
      {children}
    </div>
  );
}