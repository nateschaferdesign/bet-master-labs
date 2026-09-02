import { createFileRoute, Link } from "@tanstack/react-router";
import { LookupTracker } from "@/components/lookup-tracker";
import { ModelStatus } from "@/components/model-status";
import { LAB } from "@/lib/lab";

export const Route = createFileRoute("/lab")({ component: LabPage });

function LabPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <LookupTracker kind="page" title="The lab" href="/lab" subtitle="Founder and support" />
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">The lab</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">Who runs the desk</h1>
      <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-bg-elevated">
        <img
          src={LAB.portrait}
          alt={`${LAB.founderName}, founder and CEO of Bet Master Labs`}
          className="h-80 w-full object-cover object-top sm:h-96"
        />
        <div className="p-6">
          <p className="text-[11px] uppercase tracking-[0.16em] text-subtle">{LAB.founderTitle}</p>
          <p className="mt-2 font-display text-3xl tracking-tight">{LAB.founderName}</p>
          <p className="mt-1 text-sm text-muted">{LAB.founderTitle} · {LAB.name}</p>
          <p className="mt-3 text-muted">{LAB.stance}</p>
        </div>
      </div>
      <div className="mt-8">
        <ModelStatus />
      </div>
      <section className="mt-12 space-y-4 text-[15px] leading-relaxed text-muted">
        <h2 className="font-display text-2xl text-fg">How the desk stays independent</h2>
        <p>
          The public core stays free: directory, records, Trust Index, and email profiles. The
          formula is published on the model card. Money does not buy audit status or a board slot.
        </p>
        <p>{LAB.supportNote}</p>
      </section>
      <section className="mt-10 rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-5">
        <h2 className="font-display text-xl text-fg">Support the lab</h2>
        <p className="mt-3 text-sm text-muted">
          If the desk is useful, keep using the free records. Optional support is welcome later as a
          tip or research brief. It will be listed here with a public disclosure. It will never
          appear as a ranking boost.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/methodology"
            className="inline-flex h-11 items-center rounded-[var(--radius-sm)] bg-paper px-4 text-sm text-ink"
          >
            Read the model card
          </Link>
          <Link
            to="/verify"
            className="inline-flex h-11 items-center rounded-[var(--radius-sm)] border border-border px-4 text-sm"
          >
            Send a correction
          </Link>
        </div>
      </section>
    </div>
  );
}
