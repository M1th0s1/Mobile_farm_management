import type { CSSProperties, ReactNode } from "react";
import { colors, typography } from "@/theme/tokens";

type BottomSheetProps = {
  /** Zavrie modál – klik na overlay */
  onClose: () => void;
  children: ReactNode;
  /** Dodatočné štýly pre sheet (padding, maxHeight, display…) */
  sheetStyle?: CSSProperties;
  /** Prepíše default pozadie overlay */
  overlayStyle?: CSSProperties;
  /** Prepíše default margin drag handle */
  handleStyle?: CSSProperties;
  /** Skryje drag handle (napr. pri špecifických modáloch) */
  hideHandle?: boolean;
};

/**
 * Univerzálna kostra bottom-sheet modálu.
 * Overlay + sheet + drag handle – eliminuje duplicitnú štruktúru naprieč appkou.
 */
export default function BottomSheet({ onClose, children, sheetStyle, overlayStyle, handleStyle, hideHandle }: BottomSheetProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: colors.overlayBlack, backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end",
        ...overlayStyle,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 430, margin: "0 auto",
          background: colors.white, borderRadius: "24px 24px 0 0",
          fontFamily: typography.fontFamily,
          ...sheetStyle,
        }}
      >
        {!hideHandle && (
          <div style={{ width: 36, height: 4, borderRadius: 2, background: colors.border, margin: "0 auto 18px", flexShrink: 0, ...handleStyle }} />
        )}
        {children}
      </div>
    </div>
  );
}