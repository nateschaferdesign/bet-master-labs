import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LookupTracker } from "@/components/lookup-tracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/verify")({ component: Verify });

function Verify() {
  const [mode, setMode] = useState<"book" | "correction">("book");
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <LookupTracker kind="page" title="Get verified" href="/verify" />
      <h1 className="font-display text-4xl tracking-tight">
        {mode === "book" ? "Get verified" : "Send a correction"}
      </h1>
      <p className="mt-3 text-muted">
        {mode === "book"
          ? "Send a public archive. We review timestamps and sample size. Verification is free and does not move Trust Index on its own."
          : "Flag a number, source, or grade. Corrections are reviewed against the public book. They never buy rank."}
      </p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("book");
            setSent(false);
          }}
          className="h-11 rounded-full border border-border px-4 text-sm"
        >
          Archive
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("correction");
            setSent(false);
          }}
          className="h-11 rounded-full border border-border px-4 text-sm"
        >
          Correction
        </button>
      </div>
      {sent ? (
        <p className="mt-8 rounded-[var(--radius-md)] border border-border bg-bg-elevated p-4 text-sm">
          Request saved on this device. We review public books in order.
        </p>
      ) : (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Input name="name" required placeholder="Name" />
          <Input name="handle" required placeholder={mode === "book" ? "Public handle" : "Record or analyst"} />
          <Input
            name="url"
            required
            placeholder={mode === "book" ? "Archive URL" : "Source URL or note"}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
