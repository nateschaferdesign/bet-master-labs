export type LocalLookup = {
  id: string;
  kind: string;
  title: string;
  href: string;
  subtitle?: string;
  createdAt: string;
};

const KEY = "bml.lookups.v1";
const listeners = new Set<() => void>();

function readRaw(): LocalLookup[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]") as LocalLookup[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRaw(rows: LocalLookup[]) {
  window.localStorage.setItem(KEY, JSON.stringify(rows.slice(0, 80)));
  listeners.forEach((fn) => fn());
}

export function listLocalLookups() {
  return readRaw();
}

export function recordLocalLookup(input: Omit<LocalLookup, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const next: LocalLookup = {
    ...input,
    id: input.href,
    createdAt: new Date().toISOString(),
  };
  const rows = readRaw().filter((r) => r.href !== input.href);
  rows.unshift(next);
  writeRaw(rows);
}

export function removeLocalLookup(href: string) {
  writeRaw(readRaw().filter((r) => r.href !== href));
}

export function subscribeLookups(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
