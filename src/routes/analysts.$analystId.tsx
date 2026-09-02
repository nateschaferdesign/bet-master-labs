import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LookupTracker } from "@/components/lookup-tracker";
import { Stat } from "@/components/stat";
import { VerifyPanel } from "@/components/verify-panel";
import { SPORT_BY_ID, getAnalyst, picksForAnalyst, winPct } from "@/lib/catalog";
import { verifyTier } from "@/lib/model";
import { formatSigned } from "@/lib/utils";

export const Route = createFileRoute("/analysts/$analystId")({ component: AnalystPage });

function AnalystPage() {
  const { analystId } = Route.useParams();
  const a = getAnalyst(analystId);
  if (!a) throw notFound();
  const picks = picksForAnalyst(a.id);
  let run = 0;
  const chart = picks
    .slice()
    .reverse()
    .map((p, i) => {
      run += p.units;
      return { i: i + 1, units: Number(run.toFixed(2)) };
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <LookupTracker
        kind="analyst"
        title={a.name}
        href={`/analysts/${a.id}`}
        subtitle={`${a.sports.map((s) => s.toUpperCase()).join(" / ")} · Trust ${a.trust}`}
      />
      <Link to="/directory" className="text-sm text-muted hover:text-fg">
        Directory
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">{a.name}</h1>
          <p className="mt-2 text-sm text-muted">
            {a.handle} · {a.city} · {verifyTier(a)}
          </p>
        </div>
        <p className="font-mono text-5xl tabular-nums leading-none">{a.trust}</p>
      </div>
      <p className="mt-5 max-w-2xl text-muted">{a.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {a.sports.map((s) => (
          <Link
            key={s}
            to="/sports/$sportId"
            params={{ sportId: s }}
            className="inline-flex h-9 items-center rounded-full border border-border px-3 text-sm"
          >
            {SPORT_BY_ID[s].short}
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Record" value={`${a.wins}-${a.losses}-${a.pushes}`} hint={`${winPct(a)}% decided`} />
        <Stat label="Units" value={formatSigned(a.units)} tone={a.units >= 0 ? "win" : "loss"} />
        <Stat label="ROI" value={`${formatSigned(a.roi)}%`} />
        <Stat label="CLV" value={`${formatSigned(a.clv, 2)}%`} />
      </div>
      <div className="mt-3">
        <VerifyPanel
          label="Trust Index"
          value={String(a.trust)}
          tier={verifyTier(a)}
          source={`Public book · ${a.handle} · ${a.city}`}
          capturedAt={picks[0]?.postedAt ?? "2026-09-02"}
          steps={[
            `${a.wins}-${a.losses}-${a.pushes} settled as posted.`,
            `Close-line value ${formatSigned(a.clv, 2)}% vs posted price.`,
            `${a.bets} tracked bets. Rank floor is 150.`,
          ]}
        />
      </div>
      <section className="mt-10 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-5">
        <h2 className="font-display text-xl">Cumulative units</h2>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <XAxis dataKey="i" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#121214", border: "1px solid #2a2a30", borderRadius: 8 }}
                labelStyle={{ color: "#a7a39a" }}
              />
              <Area type="monotone" dataKey="units" stroke="#b7c4cf" fill="#b7c4cf22" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-xl">Recent public picks</h2>
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-bg-elevated text-[11px] uppercase tracking-[0.14em] text-subtle">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Sport</th>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">Line</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.postedAt}</td>
                  <td className="px-4 py-3">{p.sport.toUpperCase()}</td>
                  <td className="px-4 py-3">{p.event}</td>
                  <td className="px-4 py-3 text-muted">{p.market}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {p.line} {p.odds}
                  </td>
                  <td className="px-4 py-3 capitalize">{p.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
