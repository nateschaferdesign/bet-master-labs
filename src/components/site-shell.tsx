import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { RecentsBar } from "@/components/recents-bar";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/sports", label: "Sports" },
  { href: "/directory", label: "Directory" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/records", label: "Records" },
  { href: "/methodology", label: "Method" },
  { href: "/lab", label: "Lab" },
];

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-9 w-20 animate-pulse rounded-[var(--radius-sm)] bg-bg-subtle" />;
  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex h-9 items-center rounded-[var(--radius-sm)] border border-border px-3 text-sm text-fg hover:border-border-strong"
      >
        Sign in
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link to="/account" className="hidden text-sm text-muted hover:text-fg sm:inline">
        Profile
      </Link>
      <UserButton />
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="grain" />
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-xs)] border border-border-strong bg-bg-elevated font-display text-sm tracking-tight">
              B
            </span>
            <span className="leading-none">
              <span className="block font-display text-[15px] tracking-tight">Bet Master Labs</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-subtle">Public records</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={cn(
                  "text-sm transition-colors",
                  pathname === l.href || pathname.startsWith(`${l.href}/`)
                    ? "text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <AuthSlot />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] border border-border md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-border px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center text-sm text-fg"
                >
                  {l.label}
                </Link>
              ))}
              <SignedOut>
                <Link to="/login" onClick={() => setOpen(false)} className="flex h-11 items-center text-sm">
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link to="/account" onClick={() => setOpen(false)} className="flex h-11 items-center text-sm">
                  Profile
                </Link>
              </SignedIn>
            </div>
          </div>
        ) : null}
        <RecentsBar />
      </header>
      <main>{children}</main>
      <footer className="mt-20 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Information only. No sportsbook. No wagering. Rank cannot be bought.</p>
          <p className="text-subtle">
            <Link to="/lab" className="hover:text-fg">
              Founder desk
            </Link>
            {" · "}
            <Link to="/methodology" className="hover:text-fg">
              Model card
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
