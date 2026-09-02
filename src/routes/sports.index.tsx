import { createFileRoute, Link } from "@tanstack/react-router";
import { GROUPS, SPORTS, analystsForSport } from "@/lib/catalog";
import { LookupTracker } from "@/components/lookup-tracker";

export const Route = createFileRoute("/sports/")({ component: SportsIndex });

function SportsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <LookupTracker kind="index" title="Sports desk" href="/sports" subtitle="All major betting sports" />
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">Coverage</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Every major desk</h1>
      <p className="mt-3 max-w-xl text-muted">
        US majors, college, European soccer, combat sports, and individual tours — same verification
        rules on every book.
      </p>
      <div className="mt-10 space-y-10">
        {GROUPS.map((group) => (
          <section key={group}>
            <h2 className="font-display text-xl">{group}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SPORTS.filter((s) => s.group === group).map((s) => {
                const n = analystsForSport(s.id).length;
                return (
                  <Link
                    key={s.id}
                    to="/sports/$sportId"
                    params={{ sportId: s.id }}
                    className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-5 transition-colors hover:border-border-strong"
                  >
                    <p className="font-display text-2xl tracking-tight">{s.short}</p>
                    <p className="mt-1 text-sm text-muted">{s.name}</p>
                    <p className="mt-3 text-sm leading-relaxed text-subtle">{s.blurb}</p>
                    <p className="mt-4 font-mono text-xs text-muted">
                      {n} analyst{n === 1 ? "" : "s"} · {s.region}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
