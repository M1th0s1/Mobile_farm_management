import type { CSSProperties } from "react";
import { colors, radius, typography } from "@/theme/tokens";

/** Zdieľaný štýl pre textové inputy (text, number, textarea) */
export const inputBase: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: radius.lg,
  border: `1.5px solid ${colors.border}`,
  background: colors.bg,
  fontFamily: typography.fontFamily,
  fontSize: 13,
  fontWeight: 500,
  color: colors.text,
  outline: "none",
  boxSizing: "border-box",
};

/** Štýl malého sekčného nadpisu (SECTION LABEL) */
export const sectionLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: colors.dark,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  marginBottom: 8,
};

/** Štýl drag handle v bottom sheetoch */
export const sheetDragHandle: CSSProperties = {
  width: 36,
  height: 4,
  borderRadius: 2,
  background: colors.border,
  margin: "0 auto 18px",
};

/** Štýl overlay vrstvy pre modály */
export const sheetOverlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: colors.overlayBlack,
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "flex-end",
  zIndex: 300,
};

/** Kostra bottom sheetu (obsah sa líši podľa modálu) */
export const bottomSheet: CSSProperties = {
  width: "100%",
  background: colors.white,
  borderRadius: "24px 24px 0 0",
  fontFamily: typography.fontFamily,
};

/** Štýl primárneho tlačidla (tmavé plné) */
export const primaryButton: CSSProperties = {
  flex: 2,
  padding: "14px",
  borderRadius: radius.xl,
  border: "none",
  background: colors.dark,
  fontFamily: typography.fontFamily,
  fontWeight: 800,
  fontSize: 13,
  color: colors.white,
  cursor: "pointer",
  transition: "background 0.2s ease",
};

/** Štýl sekundárneho (ghost) tlačidla */
export const ghostButton: CSSProperties = {
  flex: 1,
  padding: "14px",
  borderRadius: radius.xl,
  border: `1.5px solid ${colors.border}`,
  background: colors.white,
  fontFamily: typography.fontFamily,
  fontWeight: 700,
  fontSize: 13,
  color: colors.dark,
  cursor: "pointer",
};

/** Štýl floating action button (+ ) */
export const fabButton: CSSProperties = {
  position: "fixed",
  bottom: 90,
  right: 20,
  width: 54,
  height: 54,
  borderRadius: "50%",
  background: colors.dark,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(19,94,75,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 26,
  color: colors.white,
  fontWeight: 300,
  lineHeight: 1,
  zIndex: 200,
};

/** Štýl dlaždice štatistiky (tmavý podklad) */
export const statTile: CSSProperties = {
  flex: 1,
  background: colors.dark,
  borderRadius: 14,
  padding: "12px 10px",
  textAlign: "center",
};