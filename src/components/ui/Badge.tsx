export default function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: 0.5, padding: "3px 8px",
      borderRadius: 20, background: color + "20", color, textTransform: "uppercase",
    }}>{label}</span>
  );
}