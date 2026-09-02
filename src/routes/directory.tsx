import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LookupTracker } from "@/components/lookup-tracker";
import { ANALYSTS, SPORTS, type SportId, winPct } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { formatSigned } from "@/lib/utils";

export const Route = createFileRoute("/directory")({ component: Directory });

function Directory() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState<SportId | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minBets, setMinBets] = useState(0);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ANALYSTS.filter((a) => {
      if (sport !== "all" && !a.sports.includes(sport)) return false;
      if (verifiedOnly && a.verification !== "verified") return false;
      if (a.bets < minBets) return false;
      if (!needle) return true;
      return (
        a.name.toLowerCase().includes(needle) ||
        a.handle.toLowerCase().includes(needle) ||
        a.city.toLowerCase().includes(needle)
      );
    }).sort((a, b) => b.trust - a.trust);
  }, [q, sport, verifiedOnly, minBets]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {q.trim() ? (
        <LookupTracker
          kind="search"
          title={`Search: ${q.trim()}`}
          href={`/directory?q=${encodeURIComponent(q.trim())}`}
          subtitle={`${rows.length} matches`}
        />
      ) : (
        <LookupTracker kind="index" title="Analyst directory" href="/directory" subtitle="Search public books" />
      )}
      <h1 className="font-display text-4xl tracking-tight">Directory</h1>
      <p className="mt-2 text-muted">Search names, cities, or handles. Filter by desk and sample size.</p>
      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search analysts"
            className="pl-9"
            aria-label="Search analysts"
          />
        </label>
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value as SportId | "all")}
          className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
        >
          <option value="all">All sports</option>
          {SPORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.short}
            </option>
          ))}
        </select>
        <select
          value={String(minBets)}
          onChange={(e) => setMinBets(Number(e.target.value))}
          className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
        >
          <option value="0">Any sample</option>
          <option value="100">100+ bets</option>
          <option value="150">150+ bets</option>
          <option value="250">250+ bets</option>
        </select>
        <label className="flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          Verified only
        </label>
      </div>
      <p className="mt-4 text-sm text-subtle">{rows.length} books</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map((a) => (
          <Link
            key={a.id}
            to="/analysts/$analystId"
            params={{ analystId: a.id }}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-5 hover:border-border-strong"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-fg">{a.name}</p>
                <p className="text-xs text-muted">
                  {a.handle} · {a.city}
                </p>
              </div>
              <p className="font-mono text-xl tabular-nums">{a.trust}</p>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-subtle">
              {a.sports.map((s) => s.toUpperCase()).join(" · ")}
            </p>
            <p className="mt-2 font-mono text-xs text-muted">
              {a.bets} bets · {winPct(a)}% · {formatSigned(a.units)}u · {a.verification}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
