import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/index";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie, getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 🔥 FIX 1: Type check lagaya hai taaki galat input se app crash na ho 🔥
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid input format." }, { status: 400 });
    }

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email aur Password zaroori hai (Password min 6 characters)." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const currentSessionUser = await getUser();

    // Check if email exists
    const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    const existingUser = existingUsers[0];

    if (existingUser) {
      if (!existingUser.isGuest) {
        return NextResponse.json({ error: "Yeh Email pehle se registered hai. Kripya Login karein." }, { status: 400 });
      }
      if (existingUser.id !== currentSessionUser?.id) {
        return NextResponse.json({ error: "Yeh Email kisi dusre account se juda hai." }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let finalUser;

    // Upgrade Guest or Create New
    if (currentSessionUser && currentSessionUser.isGuest) {
      const updatedUsers = await db.update(users)
        .set({ name: name || "User", email: normalizedEmail, password: hashedPassword, isGuest: false })
        .where(eq(users.id, currentSessionUser.id))
        .returning();
      finalUser = updatedUsers[0];
    } else {
      const newUsers = await db.insert(users).values({
        name: name || "User",
        email: normalizedEmail,
        password: hashedPassword,
        isGuest: false,
        language: "en",
      }).returning();
      finalUser = newUsers[0];
    }

    const session = await createSession(finalUser.id);
    await setSessionCookie(session.token, session.expires);

    // Creating a clean and secured user object to filter out password fields
    const safeUser = {
      id: finalUser.id,
      name: finalUser.name,
      email: finalUser.email,
      isGuest: finalUser.isGuest,
      language: finalUser.language,
      walletBalancePaise: finalUser.walletBalancePaise,
      freeMessagesUsed: finalUser.freeMessagesUsed,
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // 🔥 FIX 2: Production (Live) app par database error chhupaya hai 🔥
    return NextResponse.json({ 
      error: "Registration fail ho gaya.",
      details: process.env.NODE_ENV === "development" ? (error.message || String(error)) : undefined
    }, { status: 500 });
  }
}