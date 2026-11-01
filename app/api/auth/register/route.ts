// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/index";
import { users } from "@/schema"; // Apna schema path check karein
import { eq } from "drizzle-orm";
import { 
  createSession, 
  setSessionCookie, 
  getUser 
} from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Validation
    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: "Email aur Password zaroori hai (Password min 6 characters)." },
        { status: 400 }
      );
    }

    // 2. Check karein ki email pehle se kisi real user ne toh nahi liya
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const existingUser = existingUsers[0];

    if (existingUser && !existingUser.isGuest) {
      return NextResponse.json(
        { error: "Yeh Email pehle se registered hai. Kripya Login karein." },
        { status: 400 }
      );
    }

    // 3. Password ko hash (encrypt) karein
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 4. Check karein ki current session koi Guest toh nahi hai
    const currentSessionUser = await getUser();
    let finalUser;

    if (currentSessionUser && currentSessionUser.isGuest) {
      // 🔥 SMART UPGRADE: Agar user Guest tha, toh usi ID ko update karke real user bana do
      // Isse uske purane chats/kundli delete nahi honge.
      const updatedUsers = await db.update(users)
        .set({ 
          name: name || "User", 
          email, 
          password: hashedPassword, 
          isGuest: false 
        })
        .where(eq(users.id, currentSessionUser.id))
        .returning();
      finalUser = updatedUsers[0];
    } else {
      // Naya user create karein
      const newUsers = await db.insert(users).values({
        name: name || "User",
        email,
        password: hashedPassword,
        isGuest: false,
        language: "en", // default
      }).returning();
      finalUser = newUsers[0];
    }

    if (!finalUser) {
      throw new Error("User creation failed in database");
    }

    // 5. Naya Session create karein aur cookie set karein
    const session = await createSession(finalUser.id);
    await setSessionCookie(session.token, session.expires);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: finalUser.id,
          name: finalUser.name,
          email: finalUser.email,
          isGuest: finalUser.isGuest,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Registration fail ho gaya. Kripya baad mein try karein." },
      { status: 500 }
    );
  }
}