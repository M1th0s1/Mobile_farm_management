import { colors, gradients, shadows } from "@/theme/tokens";
import { ChevronRightIcon, menuIcons } from "@/components/ui/Icons";

const menuItems = [
  { key: "zakaznici",  label: "Zákazníci",  sub: "Správa zákazníkov a kontaktov" },
  { key: "objednavky", label: "Objednávky", sub: "Prehľad a evidencia objednávok" },
  { key: "nakupy",     label: "Nákupy",     sub: "Krmivo, lieky a materiál" },
  { key: "zabijacka",  label: "Zabijačka",  sub: "Plánovanie a záznamy porážok" },
  { key: "statistiky", label: "Štatistiky", sub: "Grafy výkonnosti a trendov" },
];

export default function MenuDrawer({ open, currentTitle, onClose, onNavigate }: {
  open: boolean; currentTitle: string; onClose: () => void; onNavigate: (key: string) => void;
}) {
  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40, background: colors.overlayLight, backdropFilter: "blur(3px)" }} />
      )}
      <div style={{
        position: "fixed", left: "50%",
        bottom: 0, width: "100%", maxWidth: 430, zIndex: 50,
        background: colors.white, borderRadius: "24px 24px 0 0",
        boxShadow: shadows.drawer,
        transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
        transform: open ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(110%)",
        paddingBottom: "max(env(safe-area-inset-bottom, 20px), 20px)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: colors.accent }} />
        </div>
        <div style={{ padding: "12px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: colors.text, letterSpacing: 0.5, textTransform: "uppercase" }}>Menu</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: colors.dark }}>{currentTitle}</span>
        </div>
        <div style={{ padding: "4px 12px 8px" }}>
          {menuItems.map((item, i) => (
            <button key={item.key} onClick={() => { onClose(); onNavigate(item.key); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                background: "none", border: "none", borderRadius: 16,
                padding: "13px 10px", cursor: "pointer",
                borderBottom: i < menuItems.length - 1 ? `1px solid ${colors.bg}` : "none",
                WebkitTapHighlightColor: "transparent",
                transition: "background 0.12s ease", textAlign: "left",
              }}
              onPointerDown={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.bg; }}
              onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: gradients.menuIcon, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {menuIcons[item.key]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: colors.text }}>{item.label}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: colors.dark, marginTop: 2 }}>{item.sub}</div>
              </div>
              <ChevronRightIcon />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}