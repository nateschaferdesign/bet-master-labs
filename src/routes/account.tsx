import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getProfile, listHistory, recordLookup, removeLookup, saveUsername, type HistoryRow } from "@/lib/history";
import { listLocalLookups, removeLocalLookup, subscribeLookups } from "@/lib/local-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/account")({ component: Account });

type Row = {
  id: string;
  numericId?: number;
  kind: string;
  title: string;
  href: string;
  subtitle?: string | null;
};

function mergeRows(server: HistoryRow[]): Row[] {
  const local = listLocalLookups();
  const byHref = new Map<string, Row>();
  for (const item of local) {
    byHref.set(item.href, {
      id: item.href,
      kind: item.kind,
      title: item.title,
      href: item.href,
      subtitle: item.subtitle,
    });
  }
  for (const item of server) {
    byHref.set(item.href, {
      id: String(item.id),
      numericId: item.id,
      kind: item.kind,
      title: item.title,
      href: item.href,
      subtitle: item.subtitle,
    });
  }
  return Array.from(byHref.values());
}

function Account() {
  const { user, isPending } = useCurrentUserState();
  const [username, setUsername] = useState("");
  const [savedName, setSavedName] = useState<string | null>(null);
  const [history, setHistory] = useState<Row[] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getProfile()
      .then((p) => {
        if (p?.username) {
          setSavedName(p.username);
          setUsername(p.username);
        } else if (user.displayName) {
          setUsername(user.displayName.replace(/\s+/g, "").slice(0, 24));
        }
      })
      .catch(() => undefined);

    const refresh = () => {
      void listHistory()
        .then((rows) => {
          setHistory(mergeRows(rows));
          for (const item of listLocalLookups()) {
            void recordLookup({
              data: {
                kind: item.kind,
                title: item.title,
                href: item.href,
                subtitle: item.subtitle,
              },
            }).catch(() => undefined);
          }
        })
        .catch(() => setHistory(mergeRows([])));
    };
    refresh();
    return subscribeLookups(refresh);
  }, [user]);

  if (isPending) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-muted">Loading desk…</div>;
  }
  if (!user) return <RedirectToSignIn />;

  async function onSaveName(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await saveUsername({ data: { username } });
      setSavedName(res.username);
      setMsg("Username saved.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not save username");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(row: Row) {
    removeLocalLookup(row.href);
    setHistory((rows) => rows?.filter((r) => r.href !== row.href) ?? null);
    if (row.numericId) {
      try {
        await removeLookup({ data: { id: row.numericId } });
      } catch {
        /* local already removed */
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">Your desk</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        {savedName ? `@${savedName}` : user.displayName || "Profile"}
      </h1>
      <p className="mt-2 text-sm text-muted">{user.primaryEmail}</p>

      <form onSubmit={onSaveName} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          minLength={3}
          maxLength={24}
          required
        />
        <Button type="submit" disabled={busy} className="sm:w-40">
          {busy ? "Saving" : "Save username"}
        </Button>
      </form>
      {msg ? <p className="mt-2 text-sm text-muted">{msg}</p> : null}

      <section className="mt-12">
        <h2 className="font-display text-2xl">Recent lookups</h2>
        <p className="mt-1 text-sm text-muted">One tap to reopen. Remove any row you do not want kept.</p>
        {history === null ? (
          <p className="mt-6 text-sm text-muted">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="mt-6 rounded-[var(--radius-md)] border border-border bg-bg-elevated p-5 text-sm text-muted">
            Nothing saved yet. Open a sport, analyst, or search and it will land here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated">
            {history.map((row) => (
              <li key={row.href} className="flex items-center gap-3 px-4 py-3">
                <a href={row.href} className="min-w-0 flex-1 hover:text-paper">
                  <span className="block truncate text-sm text-fg">{row.title}</span>
                  <span className="block truncate text-xs text-subtle">
                    {row.kind}
                    {row.subtitle ? ` · ${row.subtitle}` : ""}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => onRemove(row)}
                  className="h-11 shrink-0 px-2 text-sm text-muted hover:text-fg"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
