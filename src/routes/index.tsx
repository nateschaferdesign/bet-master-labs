import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FounderCard } from "@/components/founder-card";
import { ModelStatus } from "@/components/model-status";
import { ANALYSTS, GROUPS, PICKS, SPORTS, rankedAnalysts } from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const leaders = rankedAnalysts().slice(0, 5);
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">Research desk · 18 sports</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-[-0.03em] text-fg sm:text-6xl">
          Public records for people who publish picks.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Bet Master Labs timestamps the book, captures close-line value, and ranks only what can be
          audited. Free email profiles keep your lookups. Nothing here is a sportsbook.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/directory"
            className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-sm)] bg-paper px-5 text-sm font-medium text-ink"
          >
            Search the desk <ArrowRight size={16} />
          </Link>
          <Link
            to="/sports"
            className="inline-flex h-12 items-center rounded-[var(--radius-sm)] border border-border px-5 text-sm text-fg"
          >
            Browse sports
          </Link>
        </div>
        <div className="mt-12 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <FounderCard />
          <ModelStatus />
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Analysts", String(ANALYSTS.length)],
            ["Sports", String(SPORTS.length)],
            ["Public picks", String(PICKS.length)],
            ["Ranked books", String(rankedAnalysts().length)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-[var(--radius-md)] border border-border bg-bg-elevated px-4 py-5">
              <dt className="text-[11px] uppercase tracking-[0.16em] text-subtle">{k}</dt>
              <dd className="mt-2 font-mono text-2xl tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-y border-border bg-bg-elevated/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl tracking-tight">Desks by sport</h2>
            <Link to="/sports" className="text-sm text-muted hover:text-fg">
              All sports
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((group) => (
              <div key={group} className="rounded-[var(--radius-lg)] border border-border bg-bg p-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{group}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SPORTS.filter((s) => s.group === group).map((s) => (
                    <li key={s.id}>
                      <Link
                        to="/sports/$sportId"
                        params={{ sportId: s.id }}
                        className="inline-flex h-9 items-center rounded-full border border-border px-3 text-sm text-fg hover:border-border-strong"
                      >
                        {s.short}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-tight">Trust Index</h2>
          <Link to="/leaderboard" className="text-sm text-muted hover:text-fg">
            Full board
          </Link>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Ranked only at 150+ tracked bets. Sample size is a feature, not a filter you can buy past.
        </p>
        <ol className="mt-6 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-elevated">
          {leaders.map((a, i) => (
            <li key={a.id}>
              <Link
                to="/analysts/$analystId"
                params={{ analystId: a.id }}
                className="flex items-center gap-4 px-4 py-4 hover:bg-bg-subtle"
              >
                <span className="w-6 font-mono text-sm text-subtle">{i + 1}</span>
                <span className="flex-1">
                  <span className="block text-sm text-fg">{a.name}</span>
                  <span className="block text-xs text-muted">
                    {a.sports.map((s) => s.toUpperCase()).join(" · ")} · {a.city}
                  </span>
                </span>
                <span className="font-mono text-sm tabular-nums text-muted">{a.bets} bets</span>
                <span className="w-14 text-right font-mono text-lg tabular-nums">{a.trust}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
