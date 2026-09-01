import { colors, gradients, shadows, typography } from "@/theme/tokens";
import { BurgerIcon, CloseIcon, EuroIcon, SkullIcon } from "@/components/ui/Icons";

type NavBtnProps = { onPress?: () => void; children: React.ReactNode };

function NavBtn({ children, onPress }: NavBtnProps) {
  return (
    <button
      onClick={onPress}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        background: colors.white, border: `1.5px solid ${colors.border}`, borderRadius: 16,
        padding: "12px 8px 10px", cursor: "pointer",
        fontFamily: typography.fontFamily, fontWeight: 800,
        fontSize: 9, letterSpacing: 0.7, color: colors.text,
        WebkitTapHighlightColor: "transparent",
        transition: "transform 0.1s ease",
        boxShadow: shadows.navBtn,
      }}
      onPointerDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)"; }}
      onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

export default function BottomNav({ menuOpen, setMenuOpen, onUhyn, onVydavok, gradient }: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  onUhyn: () => void;
  onVydavok: () => void;
  gradient?: string;
}) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      padding: "0 20px max(env(safe-area-inset-bottom, 16px), 16px)",
      background: "rgba(255,255,255,0.94)",
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${colors.border}`,
      zIndex: 30,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <NavBtn onPress={onVydavok}>
          <EuroIcon size={20} color={colors.dark} />
          VÝDAVOK
        </NavBtn>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -22 }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 56, height: 56, borderRadius: "50%",
              background: menuOpen ? gradients.dark : (gradient ?? gradients.primary),
              border: `4px solid ${colors.bg}`,
              boxShadow: shadows.fabMenu,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", WebkitTapHighlightColor: "transparent",
              transition: "transform 0.1s ease, background 0.2s ease",
            }}
            onPointerDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)"; }}
            onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >
            {menuOpen ? (
              <CloseIcon size={20} color="white" />
            ) : (
              <BurgerIcon size={22} color="white" />
            )}
          </button>
          <span style={{ fontSize: 8, fontWeight: 800, color: colors.dark, letterSpacing: 0.6, marginTop: 5, fontFamily: typography.fontFamily }}>MENU</span>
        </div>

        <NavBtn onPress={onUhyn}>
          <SkullIcon size={20} color={colors.dark} />
          ÚHYN
        </NavBtn>
      </div>
    </div>
  );
}