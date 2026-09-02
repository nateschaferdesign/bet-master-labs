import { createFileRoute, Link } from "@tanstack/react-router";
import { LookupTracker } from "@/components/lookup-tracker";
import { ANALYSTS, rankedAnalysts, winPct } from "@/lib/catalog";
import { formatSigned } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({ component: Leaderboard });

function Leaderboard() {
  const ranked = rankedAnalysts();
  const building = ANALYSTS.filter((a) => a.bets < 150).sort((a, b) => b.bets - a.bets);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <LookupTracker kind="index" title="Trust Index leaderboard" href="/leaderboard" />
      <h1 className="font-display text-4xl tracking-tight">Leaderboard</h1>
      <p className="mt-3 max-w-xl text-muted">
        Ranked books need 150 tracked bets. Smaller samples stay visible as building — they cannot
        buy a place on the board.
      </p>
      <ol className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated">
        {ranked.map((a, i) => (
          <li key={a.id}>
            <Link
              to="/analysts/$analystId"
              params={{ analystId: a.id }}
              className="flex flex-wrap items-center gap-3 px-4 py-4 hover:bg-bg-subtle"
            >
              <span className="w-6 font-mono text-subtle">{i + 1}</span>
              <span className="min-w-40 flex-1">
                <span className="block text-sm">{a.name}</span>
                <span className="block text-xs text-muted">{a.sports.map((s) => s.toUpperCase()).join(" · ")}</span>
              </span>
              <span className="font-mono text-xs text-muted">{a.bets}</span>
              <span className="font-mono text-xs">{winPct(a)}%</span>
              <span className="font-mono text-xs">{formatSigned(a.units)}</span>
              <span className="w-10 text-right font-mono text-lg">{a.trust}</span>
            </Link>
          </li>
        ))}
      </ol>
      <h2 className="mt-12 font-display text-2xl">Building sample</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {building.map((a) => (
          <li key={a.id}>
            <Link
              to="/analysts/$analystId"
              params={{ analystId: a.id }}
              className="block rounded-[var(--radius-md)] border border-border bg-bg-elevated px-4 py-4 hover:border-border-strong"
            >
              <p>{a.name}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {a.bets} / 150 bets · Trust {a.trust}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
