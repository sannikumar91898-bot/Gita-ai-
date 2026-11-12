// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/index";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*               🔥 PREMIUM TRANSLATIONS & MARKETING HOOKS                    */
/* -------------------------------------------------------------------------- */

// Psychology: User ko uski bhasha me error do, trust badhta hai.
function getLoginError(lang: string, type: "missing" | "invalid" | "server"): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      missing: "कृपया ईमेल और पासवर्ड दर्ज करें।",
      invalid: "गलत ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।",
      server: "लॉगिन में समस्या आई। कृपया बाद में प्रयास करें।"
    },
    hinglish: {
      missing: "Kripya Email aur Password daalein.",
      invalid: "Galat Email ya Password. Kripya phir se try karein.",
      server: "Login me problem aayi. Kripya baad me try karein."
    },
    en: {
      missing: "Please enter email and password.",
      invalid: "Invalid email or password. Please try again.",
      server: "Login failed. Please try again later."
    },
    te: {
      missing: "దయచేసి ఇమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
      invalid: "తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.",
      server: "లాగిన్‌లో సమస్య ఉంది. దయచేసి తర్వాత ప్రయత్నించండి."
    },
    ta: {
      missing: "மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
      invalid: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.",
      server: "உள்நுழைவில் சிக்கல். பின்னர் முயற்சிக்கவும்."
    },
    kn: {
      missing: "ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
      invalid: "ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      server: "ಲಾಗಿನ್‌ನಲ್ಲಿ ಸಮಸ್ಯೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ."
    },
    bn: {
      missing: "অনুগ্রহ করে ইমেল এবং পাসওয়ার্ড লিখুন।",
      invalid: "ভুল ইমেল বা পাসওয়ার্ড। আবার চেষ্টা করুন।",
      server: "লগইনে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।"
    },
    mr: {
      missing: "कृपया ईमेल आणि पासवर्ड प्रविष्ट करा.",
      invalid: "चुकीचा ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा.",
      server: "लॉगिनमध्ये समस्या आली. कृपया नंतर प्रयत्न करा."
    },
    gu: {
      missing: "કૃપા કરીને ઇમેઇલ અને પાસવર્ડ દાખલ કરો.",
      invalid: "ખોટો ઇમેઇલ અથવા પાસવર્ડ. ફરી પ્રયાસ કરો.",
      server: "લોગિનમાં સમસ્યા. પછી પ્રયાસ કરો."
    },
    ml: {
      missing: "ദയവായി ഇമെയിലും പാസ്‌വേഡും നൽകുക.",
      invalid: "തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്. വീണ്ടും ശ്രമിക്കുക.",
      server: "ലോഗിനിൽ പ്രശ്നമുണ്ട്. പിന്നീട് ശ്രമിക്കുക."
    }
  };
  return dict[lang || "en"]?.[type] || dict["en"][type];
}

// Marketing: Login ke baad user ko premium feel dene ke liye hook.
function getWelcomeBackHook(lang: string): string {
  const dict: Record<string, string> = {
    hi: "वापसी पर स्वागत है! आइए आज आपकी कुंडली देखते हैं।",
    hinglish: "Welcome back! Aaiye aaj aapki kundli dekhein.",
    en: "Welcome back! Let's check your stars today.",
    te: "తిరిగి స్వాగతం! ఈరోజు మీ కుండలిని చూద్దాం.",
    ta: "மீண்டும் வருக! இன்று உங்கள் ஜாதகத்தைப் பார்ப்போம்.",
    kn: "ಮತ್ತೆ ಸ್ವಾಗತ! ಇಂದು ನಿಮ್ಮ ಕುಂಡಲಿ ನೋಡೋಣ.",
    bn: "ফিরে আসার জন্য স্বাগতম! আজ আপনার কুণ্ডলী দেখি।",
    mr: "पुन्हा स्वागत आहे! चला आज तुमची कुंडली पाहू.",
    gu: "પાછા સ્વાગત છે! ચાલો આજે તમારી કુંડળી જોઈએ.",
    ml: "വീണ്ടും സ്വാഗതം! ഇന്ന് നിങ്ങളുടെ കുണ്ഡലി നോക്കാം."
  };
  return dict[lang] || dict["en"];
}

/* -------------------------------------------------------------------------- */
/*                              POST HANDLER                                  */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, language = "en" } = body; // 🔥 Extracting language

    if (!email || !password) {
      return NextResponse.json({ error: getLoginError(language, "missing") }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const foundUsers = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    const user = foundUsers[0];

    // Security: Generic error message for wrong email or password to prevent enumeration attacks
    if (!user || user.isGuest || !user.password) {
      return NextResponse.json({ error: getLoginError(language, "invalid") }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: getLoginError(language, "invalid") }, { status: 401 });
    }

    const session = await createSession(user.id);
    await setSessionCookie(session.token, session.expires);

    // 🔥 Returning full user object so frontend can instantly update state
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
      welcomeMessage: getWelcomeBackHook(language) // 🔥 NAYA: Frontend isko toast me dikha sakta hai
    });

  } catch (error: any) {
    console.error("Login Error:", error?.message);
    return NextResponse.json({ 
      error: getLoginError("en", "server") // Fallback to English for server error
    }, { status: 500 });
  }
}