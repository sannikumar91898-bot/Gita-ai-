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
    const { name, email, password } = await request.json();

    // 1. Basic Validation
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email aur Password zaroori hai (Password min 6 characters)." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const currentSessionUser = await getUser();

    // 2. Check karein ki Email kisi real user ne toh nahi le rakha
    const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    const existingUser = existingUsers[0];

    if (existingUser && !existingUser.isGuest) {
      return NextResponse.json(
        { error: "Yeh Email pehle se registered hai. Kripya Login karein." },
        { status: 400 }
      );
    }

    // 3. Password ko hash (encrypt) karein
    const hashedPassword = await bcrypt.hash(password, 10);
    let finalUser;

    // 4. Agar current user Guest hai, toh usi ID ko upgrade karein (Data safe rahega)
    if (currentSessionUser && currentSessionUser.isGuest) {
      const updatedUsers = await db.update(users)
        .set({ 
          name: name || "User", 
          email: normalizedEmail, 
          password: hashedPassword, 
          isGuest: false 
        })
        .where(eq(users.id, currentSessionUser.id))
        .returning();
      finalUser = updatedUsers[0];
    } else {
      // 5. Agar naya user hai, toh naya record banayein
      const newUsers = await db.insert(users).values({
        name: name || "User",
        email: normalizedEmail,
        password: hashedPassword,
        isGuest: false,
        language: "en",
      }).returning();
      finalUser = newUsers[0];
    }

    if (!finalUser) throw new Error("User creation failed");

    // 6. Naya Session create karein aur cookie set karein
    const session = await createSession(finalUser.id);
    await setSessionCookie(session.token, session.expires);

    return NextResponse.json(
      { 
        success: true, 
        user: { id: finalUser.id, name: finalUser.name, email: finalUser.email, isGuest: finalUser.isGuest } 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Registration fail ho gaya." }, { status: 500 });
  }
}