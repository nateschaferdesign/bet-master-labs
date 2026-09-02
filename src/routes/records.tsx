import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LookupTracker } from "@/components/lookup-tracker";
import { ANALYSTS, PICKS, SPORTS, type PickResult, type SportId } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { formatSigned } from "@/lib/utils";

export const Route = createFileRoute("/records")({ component: Records });

function Records() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState<SportId | "all">("all");
  const [result, setResult] = useState<PickResult | "all">("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PICKS.filter((p) => {
      if (sport !== "all" && p.sport !== sport) return false;
      if (result !== "all" && p.result !== result) return false;
      if (!needle) return true;
      const a = ANALYSTS.find((x) => x.id === p.analystId);
      return (
        p.event.toLowerCase().includes(needle) ||
        p.market.toLowerCase().includes(needle) ||
        (a?.name.toLowerCase().includes(needle) ?? false)
      );
    }).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  }, [q, sport, result]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {q.trim() ? (
        <LookupTracker
          kind="search"
          title={`Records: ${q.trim()}`}
          href={`/records?q=${encodeURIComponent(q.trim())}`}
          subtitle={`${rows.length} picks`}
        />
      ) : (
        <LookupTracker kind="index" title="Public records" href="/records" />
      )}
      <h1 className="font-display text-4xl tracking-tight">Records</h1>
      <p className="mt-2 text-muted">Every captured public pick across the desk.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Event, market, or analyst" />
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
          value={result}
          onChange={(e) => setResult(e.target.value as PickResult | "all")}
          className="h-11 rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 text-sm"
        >
          <option value="all">Any result</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="push">Push</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <p className="mt-4 text-sm text-subtle">{rows.length} rows</p>
      <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-bg-elevated text-[11px] uppercase tracking-[0.14em] text-subtle">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Analyst</th>
              <th className="px-4 py-3">Sport</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Pick</th>
              <th className="px-4 py-3">u</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 80).map((p) => {
              const a = ANALYSTS.find((x) => x.id === p.analystId);
              return (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.postedAt}</td>
                  <td className="px-4 py-3">
                    {a ? (
                      <Link to="/analysts/$analystId" params={{ analystId: a.id }} className="hover:underline">
                        {a.name}
                      </Link>
                    ) : (
                      p.analystId
                    )}
                  </td>
                  <td className="px-4 py-3">{p.sport.toUpperCase()}</td>
                  <td className="px-4 py-3">{p.event}</td>
                  <td className="px-4 py-3 text-muted">
                    {p.market} {p.line}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{formatSigned(p.units)}</td>
                  <td className="px-4 py-3 capitalize">{p.result}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
