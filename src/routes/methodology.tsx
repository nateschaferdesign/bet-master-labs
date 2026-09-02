import { createFileRoute, Link } from "@tanstack/react-router";
import { LookupTracker } from "@/components/lookup-tracker";
import { ModelStatus } from "@/components/model-status";
import { MODEL, TIER_COPY, trustFormulaCopy } from "@/lib/model";

export const Route = createFileRoute("/methodology")({ component: Method });

function Method() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <LookupTracker kind="page" title="Model card" href="/methodology" />
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">Versioned model card</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Methodology</h1>
      <div className="mt-6">
        <ModelStatus />
      </div>
      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted">
        <section>
          <h2 className="font-display text-2xl text-fg">What we capture</h2>
          <p className="mt-3">
            A public pick needs a timestamp, market, posted price, and a close. We grade against the
            close, not against a recap. Pending bets stay pending until the event settles. Stale
            books older than {MODEL.captureWindowHours} hours without a close are flagged as pending,
            not winners.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-fg">Trust Index · {MODEL.id}</h2>
          <p className="mt-3">{trustFormulaCopy()}</p>
          <ul className="mt-4 space-y-2 font-mono text-sm text-fg">
            <li>sample {MODEL.weights.sample}</li>
            <li>close-line value {MODEL.weights.clv}</li>
            <li>units {MODEL.weights.units}</li>
            <li>settled hit rate {MODEL.weights.hitRate}</li>
          </ul>
          <p className="mt-4">
            Books under {MODEL.sampleFloor} tracked bets remain visible but unranked. Rank cannot be
            purchased. Support and affiliates never touch this formula.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-fg">Verification tiers</h2>
          <ul className="mt-4 space-y-4">
            {(Object.keys(TIER_COPY) as Array<keyof typeof TIER_COPY>).map((key) => (
              <li key={key}>
                <p className="text-fg">{TIER_COPY[key].label}</p>
                <p className="mt-1 text-sm">{TIER_COPY[key].detail}</p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl text-fg">Provenance</h2>
          <p className="mt-3">
            Every headline number has a Verify this panel: original public source, capture time,
            calculation steps, and the independent close. Use{" "}
            <Link to="/verify" className="text-fg underline">
              Get verified
            </Link>{" "}
            to send an archive or a correction.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-fg">Sports coverage</h2>
          <p className="mt-3">
            The same rules apply to NFL, NBA, MLB, NHL, college football and basketball, WNBA, MLS,
            the big five European soccer desks, UFC, boxing, tennis, golf, and Formula 1.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl text-fg">What this is not</h2>
          <p className="mt-3">
            This is not a sportsbook, tout shop, or tip service. There are no deposit links and no
            wager buttons. Profiles are free. Optional support is disclosed on the{" "}
            <Link to="/lab" className="text-fg underline">
              lab page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
