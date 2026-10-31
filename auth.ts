import { cookies, headers } from "next/headers";
import { randomBytes, randomUUID } from "crypto";
import { eq, and, gt } from "drizzle-orm";

import { db } from "@/index";
import { users, sessions } from "@/schema";

export const SESSION_COOKIE = "gita_session";
const SESSION_DAYS = 30;

export type User = typeof users.$inferSelect;

/**
 * Get the currently authenticated user from the session cookie.
 */
export async function getUser(): Promise<User | null> {
  try {
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
  } catch (error) {
    // 🔥 FIX: Database error ko chupao mat, throw karo taaki API ko pata chale
    console.error("Database error in getUser:", error);
    throw new Error("Database connection failed during auth");
  }
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

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
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
  const guestId = randomUUID();

  const [user] = await db
    .insert(users)
    .values({
      id: guestId,
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
