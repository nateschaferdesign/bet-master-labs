import { useEffect } from "react";
import { recordLookup } from "@/lib/history";
import { recordLocalLookup } from "@/lib/local-history";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function LookupTracker({
  kind,
  title,
  href,
  subtitle,
}: {
  kind: string;
  title: string;
  href: string;
  subtitle?: string;
}) {
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    recordLocalLookup({ kind, title, href, subtitle });
  }, [kind, title, href, subtitle]);

  useEffect(() => {
    if (isPending || !user) return;
    void recordLookup({ data: { kind, title, href, subtitle } }).catch(() => undefined);
  }, [isPending, user, kind, title, href, subtitle]);

  return null;
}
