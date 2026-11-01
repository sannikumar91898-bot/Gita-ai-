// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/index";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email aur Password daalein." }, { status: 400 });
    }

    // User dhundo
    const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = foundUsers[0];

    // Agar user nahi hai, ya guest hai, ya password nahi hai
    if (!user || user.isGuest || !user.password) {
      return NextResponse.json({ error: "Galat Email ya Password." }, { status: 401 });
    }

    // Password check karo
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Galat Email ya Password." }, { status: 401 });
    }

    // Session create karo
    const session = await createSession(user.id);
    await setSessionCookie(session.token, session.expires);

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Login fail ho gaya." }, { status: 500 });
  }
}