/**
 * Design tokens – jediný zdroj pravdy pre farby, spacing, radius,
 * typografiu, gradienty a tiene.
 *
 * Paleta: #135E4B | #4CB572 | #A1D8B5 | #CCDCDB
 */
import type { Phase } from "@/types";

export const colors = {
  accent: "#4CB572",
  dark: "#135E4B",
  darkAlt: "#1D7A5F",
  darkDeep: "#1A7059",
  bg: "#CCDCDB",
  white: "#FFFFFF",
  border: "#B5CCCB",
  muted: "#2A2A2A",
  surface: "#DDE9E8",
  text: "#111111",
  textOnDark: "rgba(255,255,255,0.7)",
  textOnDarkDim: "rgba(255,255,255,0.6)",
  textOnDarkFaint: "rgba(255,255,255,0.55)",
  textOnDarkWeak: "rgba(255,255,255,0.5)",
  hairlineOnDark: "rgba(255,255,255,0.2)",
  hairlineOnDarkSoft: "rgba(255,255,255,0.18)",
  overlay: "rgba(19,94,75,0.4)",
  overlayLight: "rgba(19,94,75,0.35)",
  overlayBlack: "rgba(0,0,0,0.45)",
  iconChevron: "#BBBBBB",
  iconChevronLight: "#CCCCCC",
  disabled: "#DDDDDD",
  progressTrack: "#DDE0DF",
} as const;

/** Status farby objednávok */
export const statusColors = {
  pending: { label: "Čakajúca", color: "#B91C1C", bg: "#FEF2F2", dot: "#EF4444" },
  confirmed: { label: "Potvrdená", color: "#92400E", bg: "#FFFBEB", dot: "#F59E0B" },
  delivered: { label: "Odovzdaná", color: "#14532D", bg: "#F0FDF4", dot: "#22C55E" },
} as const;

/** Akcentové farby (úhyn, porážka, mazanie) */
export const dangerColors = {
  primary: "#E05A3A",
  dark: "#C0392B",
  gradient: "linear-gradient(145deg, #E05A3A, #C0392B)",
  softBg: "#E05A3A18",
  border: "#FCA5A5",
  deleteBg: "#FFF5F5",
  deleteText: "#B91C1C",
} as const;

/** Spacing – jednotná škála */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  xxxl: 20,
  huge: 24,
} as const;

/** Border radius – jednotná škála */
export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  card: 18,
  huge: 20,
  full: 24,
  pill: 999,
} as const;

/** Typografia */
export const typography = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  sizes: {
    xs: 8,
    sm: 9,
    base: 10,
    md: 11,
    lg: 12,
    xl: 13,
    xxl: 14,
    xxxl: 16,
    huge: 17,
    giant: 22,
    hero: 58,
  },
  weights: {
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    heavy: 900,
  },
} as const;

/** Zdieľané gradienty – jednotná „kartová" paleta (#258667 / #166852 / #135E4B / #0F4537) */
export const gradients = {
  primary: "linear-gradient(145deg, #258667, #135E4B)",
  dark: "linear-gradient(135deg, #166852, #0F4537)",
  darkDeep: "linear-gradient(135deg, #258667, #135E4B)",
  darkGreen: "linear-gradient(145deg, #258667, #1A6953)",
  darkest: "linear-gradient(145deg, #0F4537, #0A372B)",
  danger: "linear-gradient(145deg, #E05A3A, #C0392B)",
  menuIcon: "linear-gradient(145deg, #25866722, #135E4B18)",
  avatar: "linear-gradient(145deg, #258667, #135E4B)",
  statDark: "linear-gradient(135deg, #1F7C60, #135E4B)",
  statGreen: "linear-gradient(135deg, #258667, #166852)",
  statDarker: "linear-gradient(135deg, #0F4537, #0A372B)",
} as const;

/** Tiene */
export const shadows = {
  card: "0 2px 12px rgba(19,94,75,0.06)",
  subtle: "0 2px 8px rgba(74,65,60,0.07)",
  panel: "0 2px 10px rgba(19,94,75,0.18)",
  modal: "0 -8px 40px rgba(19,94,75,0.2)",
  drawer: "0 -8px 40px rgba(19,94,75,0.18)",
  navBtn: "0 2px 8px rgba(74,65,60,0.07)",
  fab: "0 4px 20px rgba(19,94,75,0.4)",
  cardCenter: "0 16px 40px rgba(74,65,60,0.25)",
  cardSide: "0 6px 18px rgba(74,65,60,0.12)",
  cardBatch: "0 6px 20px rgba(19,94,75,0.2)",
  stat: "0 2px 10px rgba(19,94,75,0.18)",
  statStrong: "0 4px 14px rgba(19,94,75,0.18)",
  chipActive: "0 3px 10px rgba(19,94,75,0.25)",
  sales: "0 4px 24px rgba(19,94,75,0.12)",
  filter: "0 2px 8px rgba(19,94,75,0.1)",
  fabMenu: "0 6px 20px rgba(76,181,114,0.38)",
} as const;

/** Fázy turnusov */
export const phaseConfig = {
  starter: { gradientClass: "phase-starter" },
  growth: { gradientClass: "phase-growth" },
  slaughter: { gradientClass: "phase-slaughter" },
} as const;

export const phaseGrad = {
  starter: "linear-gradient(135deg, #1F7C60, #135E4B)",
  growth: "linear-gradient(135deg, #258667, #166852)",
  slaughter: "linear-gradient(135deg, #1A6953, #115342)",
} as const;

/** Gradient hlavnej turnus karty – podľa fázy (zdieľané: BatchCard, SalesCard, PageTurnusy) */
export function batchPhaseGradient(phase: Phase): string {
  if (phase === "starter") return "linear-gradient(135deg, #1F7C60 0%, #135E4B 50%, #0D3E31 100%)";
  if (phase === "growth") return "linear-gradient(135deg, #258667 0%, #166852 50%, #0F4537 100%)";
  return "linear-gradient(135deg, #1A6953 0%, #115342 50%, #0A372B 100%)";
}

/** Kategórie výdavkov – ikony sú v @/components/ui/Icons (expenseIcons) */
export const expenseCategoryMeta = {
  krmivo: { label: "Krmivo", color: "#135E4B" },
  lek: { label: "Lieky", color: "#135E4B" },
  material: { label: "Materiál", color: "#135E4B" },
  ine: { label: "Iné", color: "#135E4B" },
} as const;

/** Produkty – ikony sú v @/components/ui/Icons (productIcons) */
export const productTypes = [
  { key: "cele", label: "Celé kura" },
  { key: "porcie", label: "Naporcované kura" },
  { key: "prsia", label: "Len prsia" },
] as const;
