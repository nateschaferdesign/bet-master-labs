import { cn } from "@/lib/utils";

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "win" | "loss" | "neutral";
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-elevated p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      <p
        className={cn(
          "mt-2 font-mono text-2xl tabular-nums tracking-tight",
          tone === "win" && "text-win",
          tone === "loss" && "text-loss",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
