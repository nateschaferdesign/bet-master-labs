import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: username || email.split("@")[0],
        });
        if (err) throw new Error(err.message || "Could not create account");
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message || "Could not sign in");
      }
      window.location.href = "/account";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">Free account</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        {mode === "in" ? "Sign in" : "Create a profile"}
      </h1>
      <p className="mt-3 text-sm text-muted">
        Email profiles are free. Recent lookups stay on your desk and open in one tap.
      </p>
      {!authEnabled ? (
        <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
      ) : (
        <>
          <form className="mt-8 space-y-3" onSubmit={onSubmit}>
            {mode === "up" ? (
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                minLength={3}
                maxLength={24}
                autoComplete="username"
              />
            ) : null}
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={8}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
            {error ? <p className="text-sm text-loss">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Working…" : mode === "in" ? "Sign in with email" : "Create free profile"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-3 text-sm text-muted hover:text-fg"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setError(null);
            }}
          >
            {mode === "in" ? "Need an account? Create one free" : "Already have a desk? Sign in"}
          </button>
          <div className="mt-8 space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/account" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        </>
      )}
      <p className="mt-8 text-xs text-subtle">
        By continuing you agree this is an information product only.{" "}
        <Link to="/methodology" className="underline">
          Read the method
        </Link>
        .
      </p>
    </div>
  );
}
