import { cookies, headers } from "next/headers";
import { randomBytes } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions } from "@/db/schema";

export const SESSION_COOKIE = "gita_session";
const SESSION_DAYS = 30;

export type User = typeof users.$inferSelect;

export async function getUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0]?.user ?? null;
}

export async function createSession(userId: string): Promise<{ token: string; expires: Date }> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000);
  await db.insert(sessions).values({ token, userId, expiresAt: expires });
  return { token, expires };
}

export async function setSessionCookie(token: string, expires: Date) {
  const store = await cookies();
  const h = await headers();
  // Embedded previews (cross-site iframes) drop SameSite=Lax cookies, which caused
  // "Not signed in". Over HTTPS use SameSite=None + Secure + Partitioned (CHIPS).
  const proto = h.get("x-forwarded-proto")?.split(",")[0].trim();
  const host = (h.get("x-forwarded-host") || h.get("host") || "").toLowerCase();
  const isLocal = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/.test(host);
  const viaHttpsPage = /^https:\/\//.test(h.get("origin") || h.get("referer") || "");
  const https = proto === "https" || viaHttpsPage || (!isLocal && proto !== "http");
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: https ? "none" : "lax",
    secure: https,
    partitioned: https || undefined,
    path: "/",
    expires,
  });
}

export async function createGuestUser(language = "en"): Promise<User> {
  const [user] = await db.insert(users).values({ isGuest: true, language }).returning();
  return user;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.token, token));
  store.delete(SESSION_COOKIE);
}
