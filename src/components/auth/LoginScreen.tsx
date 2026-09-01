import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { colors, gradients, radius, typography } from "@/theme/tokens";

export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [farmName, setFarmName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.includes("@") && password.length >= 6;

  async function submit() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase!.auth.signUp({
          email,
          password,
          options: { data: { farm_name: farmName } },
        });
        if (error) throw error;
        setInfo("Registrácia prebehla. Skontroluj e-mail na potvrdenie (ak je povinné).");
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Chyba pri prihlásení";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", borderRadius: radius.lg,
    border: `1.5px solid ${colors.border}`, background: "rgba(255,255,255,0.92)",
    fontFamily: typography.fontFamily, fontSize: 14, fontWeight: 600,
    color: colors.text, outline: "none", boxSizing: "border-box", marginBottom: 12,
  };

  return (
    <div style={{
      minHeight: "100svh", background: gradients.darkDeep, color: colors.white,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      fontFamily: typography.fontFamily,
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>PREHĽAD FARMY</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.65)", marginBottom: 24 }}>
          Prihlás sa do svojho farmárskeho dashboardu
        </div>

        <div style={{
          background: colors.white, borderRadius: radius.huge, padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {(["login", "signup"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setInfo(""); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: radius.lg, cursor: "pointer",
                  border: `1.5px solid ${mode === m ? colors.dark : colors.border}`,
                  background: mode === m ? colors.dark : colors.white,
                  fontFamily: typography.fontFamily, fontSize: 12, fontWeight: 800,
                  color: mode === m ? colors.white : colors.dark,
                }}>
                {m === "login" ? "Prihlásenie" : "Registrácia"}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <input value={farmName} onChange={e => setFarmName(e.target.value)}
              placeholder="Názov farmy" style={inputStyle} />
          )}
          <input value={email} onChange={e => setEmail(e.target.value)}
            type="email" placeholder="E-mail" style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)}
            type="password" placeholder="Heslo (min. 6 znakov)" style={inputStyle} />

          {error && (
            <div style={{ fontSize: 12, color: "#B91C1C", background: "#FEF2F2", padding: "10px 12px", borderRadius: 10, marginBottom: 12 }}>
              {error}
            </div>
          )}
          {info && (
            <div style={{ fontSize: 12, color: "#14532D", background: "#F0FDF4", padding: "10px 12px", borderRadius: 10, marginBottom: 12 }}>
              {info}
            </div>
          )}

          <button onClick={submit} disabled={!canSubmit || loading} style={{
            width: "100%", padding: "14px 0", borderRadius: radius.xl, border: "none", cursor: canSubmit && !loading ? "pointer" : "default",
            background: canSubmit && !loading ? gradients.primary : colors.disabled,
            fontFamily: typography.fontFamily, fontWeight: 800, fontSize: 14, color: colors.white,
          }}>
            {loading ? "…" : mode === "login" ? "Prihlásiť sa" : "Vytvoriť účet"}
          </button>
        </div>
      </div>
    </div>
  );
}
