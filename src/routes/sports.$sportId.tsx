import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LookupTracker } from "@/components/lookup-tracker";
import { SPORT_BY_ID, analystsForSport, winPct, type SportId } from "@/lib/catalog";
import { formatSigned } from "@/lib/utils";

export const Route = createFileRoute("/sports/$sportId")({ component: SportPage });

function SportPage() {
  const { sportId } = Route.useParams();
  const sport = SPORT_BY_ID[sportId as SportId];
  if (!sport) throw notFound();
  const analysts = analystsForSport(sport.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <LookupTracker
        kind="sport"
        title={sport.name}
        href={`/sports/${sport.id}`}
        subtitle={`${sport.group} · ${analysts.length} analysts`}
      />
      <Link to="/sports" className="text-sm text-muted hover:text-fg">
        All sports
      </Link>
      <h1 className="mt-4 font-display text-4xl tracking-tight">{sport.name}</h1>
      <p className="mt-3 max-w-xl text-muted">{sport.blurb}</p>
      <p className="mt-2 text-sm text-subtle">
        {sport.region} · {analysts.length} public books on this desk
      </p>
      <div className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated">
        {analysts.map((a) => (
          <Link
            key={a.id}
            to="/analysts/$analystId"
            params={{ analystId: a.id }}
            className="flex flex-wrap items-center gap-3 px-4 py-4 hover:bg-bg-subtle"
          >
            <span className="min-w-40 flex-1">
              <span className="block text-sm text-fg">{a.name}</span>
              <span className="block text-xs text-muted">
                {a.handle} · {a.city}
              </span>
            </span>
            <span className="font-mono text-xs text-subtle">{a.verification}</span>
            <span className="font-mono text-sm tabular-nums">{winPct(a)}%</span>
            <span className="font-mono text-sm tabular-nums">{formatSigned(a.units)}</span>
            <span className="w-10 text-right font-mono text-lg tabular-nums">{a.trust}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
