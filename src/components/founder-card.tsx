import { Link } from "@tanstack/react-router";
import { LAB } from "@/lib/lab";

export function FounderCard() {
  return (
    <Link
      to="/lab"
      className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-4 hover:border-border-strong"
    >
      <img
        src={LAB.portrait}
        alt="Founder and CEO of Bet Master Labs"
        className="h-16 w-16 rounded-full object-cover object-top"
        width={64}
        height={64}
      />
      <span>
        <span className="block text-[11px] uppercase tracking-[0.16em] text-subtle">{LAB.founderTitle}</span>
        <span className="mt-1 block font-display text-xl tracking-tight text-fg">{LAB.founderName}</span>
        <span className="mt-1 block text-sm text-muted">{LAB.name} · rank stays unbuyable</span>
      </span>
    </Link>
  );
}
