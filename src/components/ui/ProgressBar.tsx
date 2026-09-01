/** Progress bar s dvoma variantmi (primary/secondary) – triedy z index.css. */

export default function ProgressBar({ value, total, variant }: {
  value: number; total: number; variant?: "primary" | "secondary";
}) {
  const pct = Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="progress-bar-track">
      <div
        className={variant === "secondary" ? "progress-bar-fill-secondary" : "progress-bar-fill-primary"}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}