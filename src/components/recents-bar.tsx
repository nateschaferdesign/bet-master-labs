import { useEffect, useState } from "react";
import { listLocalLookups, subscribeLookups, type LocalLookup } from "@/lib/local-history";

export function RecentsBar() {
  const [rows, setRows] = useState<LocalLookup[]>([]);

  useEffect(() => {
    const refresh = () => setRows(listLocalLookups().slice(0, 6));
    refresh();
    return subscribeLookups(refresh);
  }, []);

  if (!rows.length) return null;

  return (
    <div className="border-b border-border bg-bg-elevated/60">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2">
        <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-subtle">Recent</span>
        {rows.map((row) => (
          <a
            key={row.href}
            href={row.href}
            className="inline-flex h-8 shrink-0 items-center rounded-full border border-border px-3 text-xs text-fg hover:border-border-strong"
          >
            {row.title}
          </a>
        ))}
        <a href="/account" className="shrink-0 text-xs text-muted hover:text-fg">
          Manage
        </a>
      </div>
    </div>
  );
}
