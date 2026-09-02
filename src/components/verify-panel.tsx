import { useState } from "react";
import { TIER_COPY, trustFormulaCopy, type VerifyTier } from "@/lib/model";

export function VerifyPanel({
  label,
  value,
  tier,
  source,
  capturedAt,
  steps,
}: {
  label: string;
  value: string;
  tier: VerifyTier;
  source: string;
  capturedAt: string;
  steps: string[];
}) {
  const [open, setOpen] = useState(false);
  const copy = TIER_COPY[tier];
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-subtle">{label}</p>
          <p className="mt-1 font-mono text-lg tabular-nums">{value}</p>
          <p className="mt-1 text-xs text-muted">{copy.label}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-11 shrink-0 px-2 text-xs text-muted hover:text-fg"
        >
          {open ? "Hide" : "Verify this"}
        </button>
      </div>
      {open ? (
        <dl className="mt-3 space-y-2 border-t border-border pt-3 text-xs text-muted">
          <div>
            <dt className="text-subtle">Source</dt>
            <dd className="mt-0.5 text-fg">{source}</dd>
          </div>
          <div>
            <dt className="text-subtle">Captured</dt>
            <dd className="mt-0.5 font-mono text-fg">{capturedAt}</dd>
          </div>
          <div>
            <dt className="text-subtle">Tier</dt>
            <dd className="mt-0.5 text-fg">{copy.detail}</dd>
          </div>
          <div>
            <dt className="text-subtle">Steps</dt>
            <dd className="mt-0.5 space-y-1 text-fg">
              {steps.map((s) => (
                <p key={s}>{s}</p>
              ))}
              <p>{trustFormulaCopy()}</p>
            </dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}
