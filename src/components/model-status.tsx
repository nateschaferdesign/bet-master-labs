import { Link } from "@tanstack/react-router";
import { MODEL } from "@/lib/model";

export function ModelStatus({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg-elevated px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">Model status</p>
        <Link to="/methodology" className="text-xs text-muted hover:text-fg">
          Model card
        </Link>
      </div>
      <p className="mt-2 font-mono text-sm tabular-nums text-fg">
        {MODEL.id} · v{MODEL.version}
      </p>
      {compact ? null : (
        <p className="mt-1 text-xs text-muted">
          Last published {MODEL.updatedAt} · rank floor {MODEL.sampleFloor} bets · grade vs close
        </p>
      )}
    </div>
  );
}
