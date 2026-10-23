import { cookies, headers } from "next/headers";
import { randomBytes } from "crypto";
import { eq, and, gt } from "drizzle-orm";

// Yahan maine path badal kar sahi kar diya hai
import { db } from "@/index";
import { users, sessions } from "@/schema";

export const SESSION_COOKIE = "gita_session";
const SESSION_DAYS = 30;

export type User = typeof users.$inferSelect;

/**
 * Get the currently authenticated user from the session cookie.
 */
export async function getUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  return rows[0]?.user ?? null;
}

/**
 * Create a session for an existing user.
 */
export async function createSession(
  userId: string
): Promise<{ token: string; expires: Date }> {
  const token = randomBytes(32).toString("hex");

  const expires = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  );

  await db.insert(sessions).values({
    token,
    userId,
    expiresAt: expires,
  });

  return { token, expires };
}

/**
 * Set the session cookie.
 */
export async function setSessionCookie(
  token: string,
  expires: Date
): Promise<void> {
  const store = await cookies();
  const requestHeaders = await headers();

  const proto = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();

  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase();

  const isLocal =
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/.test(
      host
    );

  const viaHttpsPage = /^https:\/\//i.test(
    requestHeaders.get("origin") ??
      requestHeaders.get("referer") ??
      ""
  );

  const https =
    proto === "https" ||
    viaHttpsPage ||
    (!isLocal && proto !== "http");

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: https ? "none" : "lax",
    secure: https,
    ...(https ? { partitioned: true } : {}),
    path: "/",
    expires,
  });
}

/**
 * Create a guest user.
 */
export async function createGuestUser(
  language = "en"
): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      isGuest: true,
      language,
    })
    .returning();

  if (!user) {
    throw new Error("Failed to create guest user");
  }

  return user;
}

/**
 * Delete the current session and clear its cookie.
 */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await db
      .delete(sessions)
      .where(eq(sessions.token, token));
  }

  store.delete(SESSION_COOKIE);
}
