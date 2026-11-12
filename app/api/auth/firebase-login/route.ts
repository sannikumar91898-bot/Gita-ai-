// app/api/auth/firebase-login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/index";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔥 Marketing Hook (Aapke baaki code ki tarah 10 languages me)
function getWelcomeMessage(lang: string): string {
  const dict: Record<string, string> = {
    hi: "स्वागत है! आपका अकाउंट सुरक्षित रूप से लॉगिन हो गया है।",
    hinglish: "Welcome! Aapka account securely login ho gaya hai.",
    en: "Welcome! Your account has been securely logged in.",
    te: "స్వాగతం! మీ ఖాతా సురక్షితంగా లాగిన్ అయింది.",
    ta: "வருக! உங்கள் கணக்கு பாதுகாப்பாக உள்நுழைந்துள்ளது.",
    kn: "ಸ್ವಾಗತ! ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗಿನ್ ಮಾಡಲಾಗಿದೆ.",
    bn: "স্বাগতম! আপনার অ্যাকাউন্ট নিরাপদে লগইন হয়েছে।",
    mr: "स्वागत आहे! तुमचे खाते सुरक्षितपणे लॉग इन झाले आहे.",
    gu: "સ્વાગત છે! તમારું એકાઉન્ટ સુરક્ષિત રીતે લોગિન થઈ ગયું છે.",
    ml: "സ്വാഗതം! നിങ്ങളുടെ അക്കൗണ്ട് സുരക്ഷിതമായി ലോഗിൻ ചെയ്തു."
  };
  return dict[lang] || dict["en"];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, identifier, language = "en" } = body;

    if (!token) {
      return NextResponse.json({ error: "Firebase token is required" }, { status: 400 });
    }

    // 🔥 1. Verify Firebase ID Token using Google Identity Toolkit
    // Isse humein pakka pata chalega ki user ne sach me Google/OTP se verify kiya hai.
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error("Firebase API Key missing in env!");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.users || verifyData.users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired Firebase token" }, { status: 401 });
    }

    // Token verified! Ab humein user ka data mil gaya.
    const firebaseUser = verifyData.users[0];
    const verifiedEmail = firebaseUser.email || identifier || "";
    const verifiedPhone = firebaseUser.phoneNumber || "";
    
    // Email ya Phone me se jo bhi mile, use identifier banayenge
    const finalIdentifier = verifiedEmail || verifiedPhone;

    if (!finalIdentifier) {
      return NextResponse.json({ error: "No email or phone found in token" }, { status: 400 });
    }

    // 🔥 2. Database me User Check karein
    // Agar email hai to email se dhundo, agar phone hai to email field me phone save karke dhundo
    const normalizedIdentifier = finalIdentifier.trim().toLowerCase();
    
    const existingUsers = await db.select().from(users).where(eq(users.email, normalizedIdentifier)).limit(1);
    let user = existingUsers[0];

    if (!user) {
      // Agar naya user hai, toh Database me create karein
      const newUsers = await db.insert(users).values({
        name: firebaseUser.displayName || "User",
        email: normalizedIdentifier, // Phone number ko email field me save kar rahe hain (ya aap alag column bana sakte hain)
        password: null, // Firebase users ka password nahi hota
        isGuest: false,
        language: language,
      }).returning();
      
      user = newUsers[0];
    } else if (user.isGuest) {
      // Agar pehle se guest tha, toh usey upgrade kar dein
      const updatedUsers = await db.update(users)
        .set({ isGuest: false, language: language })
        .where(eq(users.id, user.id))
        .returning();
      user = updatedUsers[0];
    }

    // 🔥 3. Session create karein aur Cookie set karein
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

    return NextResponse.json({
      success: true,
      user: safeUser,
      welcomeMessage: getWelcomeMessage(language)
    }, { status: 200 });

  } catch (error: any) {
    console.error("Firebase Login Error:", error?.message);
    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}