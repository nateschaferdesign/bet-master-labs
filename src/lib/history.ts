import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type HistoryRow = {
  id: number;
  kind: string;
  title: string;
  href: string;
  subtitle: string | null;
  created_at: string;
};

const lookupSchema = z.object({
  kind: z.string().min(1).max(32),
  title: z.string().min(1).max(160),
  href: z.string().min(1).max(240),
  subtitle: z.string().max(200).optional(),
});

export const listHistory = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<HistoryRow>`
      select id, kind, title, href, subtitle, created_at
      from lookup_history
      where user_id = ${context.userId}
      order by created_at desc
      limit 80
    `;
  });

export const recordLookup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => lookupSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into lookup_history (user_id, kind, title, href, subtitle)
      values (${context.userId}, ${data.kind}, ${data.title}, ${data.href}, ${data.subtitle ?? null})
      on conflict (user_id, href) do update
        set title = excluded.title,
            subtitle = excluded.subtitle,
            kind = excluded.kind,
            created_at = now()
    `;
    return { ok: true };
  });

export const removeLookup = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.number().int() }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from lookup_history where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(24)
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only");

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ username: string; created_at: string }>`
      select username, created_at from profiles where user_id = ${context.userId}
    `;
    return rows[0] ?? null;
  });

export const saveUsername = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ username: usernameSchema }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const taken = await sql<{ user_id: string }>`
      select user_id from profiles where lower(username) = lower(${data.username}) and user_id <> ${context.userId}
    `;
    if (taken.length) throw new Error("That username is taken");
    await sql`
      insert into profiles (user_id, username)
      values (${context.userId}, ${data.username})
      on conflict (user_id) do update set username = excluded.username
    `;
    return { username: data.username };
  });
