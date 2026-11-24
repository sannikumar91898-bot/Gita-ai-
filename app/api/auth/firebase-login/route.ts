// app/api/auth/firebase-login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/index";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie } from "@/auth";
// FIX: Admin SDK import kiya gaya hai secure verification ke liye
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marketing Hook (Aapke baaki code ki tarah 10 languages me)
function getWelcomeMessage(lang: string): string {
  const dict: Record<string, string> = {
    hi: "",
    hinglish: "Welcome! Aapka account securely login ho gaya hai.",
    en: "Welcome! Your account has been securely logged in.",
    te: "",
    ta: "",
    kn: "",
    bn: "",
    mr: "",
    gu: "",
    ml: "",
  };
  return dict[lang] || dict["en"];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // FIX: Hum ab client ke bheje gaye 'identifier' par bharosa nahi karenge
    const { token, language = "en" } = body;

    if (!token) {
      return NextResponse.json({ error: "Firebase token is required" }, { status: 400 });
    }

    // 1. Verify Firebase ID Token securely using Admin SDK
    // Isse humein pakka pata chalega ki token genuine hai aur expired nahi hai
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (verifyError: any) {
      console.error("Firebase Token Verification Failed:", verifyError.message);
      return NextResponse.json({ error: "Invalid or expired Firebase token" }, { status: 401 });
    }

    // Token verified! Ab humein user ka data decodedToken se milega
    const verifiedEmail = decodedToken.email || "";
    const verifiedPhone = decodedToken.phone_number || "";
    const firebaseName = decodedToken.name || "User";

    // Email ya Phone me se jo bhi mile, use identifier banayenge
    const finalIdentifier = verifiedEmail || verifiedPhone;
    if (!finalIdentifier) {
      return NextResponse.json({ error: "No email or phone found in token" }, { status: 400 });
    }

    // 2. Database me User Check karein
    const normalizedIdentifier = finalIdentifier.trim().toLowerCase();

    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedIdentifier))
      .limit(1);

    let user = existingUsers[0];

    if (!user) {
      // Agar naya user hai, toh Database me create karein
      const newUsers = await db
        .insert(users)
        .values({
          name: firebaseName,
          email: normalizedIdentifier, // Agar phone hai, toh woh email field me save hoga
          password: null, // Firebase users ka password nahi hota
          isGuest: false,
          language: language,
        })
        .returning();

      user = newUsers[0];
    } else if (user.isGuest) {
      // Agar pehle se guest tha, toh usey upgrade kar dein
      const updatedUsers = await db
        .update(users)
        .set({ isGuest: false, language: language })
        .where(eq(users.id, user.id))
        .returning();
      user = updatedUsers[0];
    }

    // 3. Session create karein aur Cookie set karein (Aapka purana logic, bilkul waisa hi)
    const session = await createSession(user.id);
    await setSessionCookie(session.token, session.expires);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      isGuest: user.isGuest,
      language: user.language,
      walletBalancePaise: user.walletBalancePaise,
      freeMessagesUsed: user.freeMessagesUsed,
      premiumUntil: user.premiumUntil,
    };

    return NextResponse.json(
      {
        success: true,
        user: safeUser,
        welcomeMessage: getWelcomeMessage(language),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Firebase Login Error:", error);

    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error?.message || "Unknown error",
        code: error?.code || "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}