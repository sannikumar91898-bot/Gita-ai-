// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/index";
import { users } from "@/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie, getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*               🔥 PREMIUM TRANSLATIONS & MARKETING HOOKS                    */
/* -------------------------------------------------------------------------- */

// Psychology: User ko uski bhasha me error do, trust badhta hai.
function getRegError(lang: string, type: "email_format" | "email_exists" | "short_pass" | "server"): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      email_format: "कृपया एक सही ईमेल एड्रेस दर्ज करें।",
      email_exists: "यह ईमेल पहले से रजिस्टर्ड है। कृपया लॉगिन करें।",
      short_pass: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
      server: "रजिस्ट्रेशन में समस्या आई। कृपया पुनः प्रयास करें।"
    },
    hinglish: {
      email_format: "Kripya ek sahi Email Address daalein.",
      email_exists: "Yeh Email pehle se registered hai. Kripya Login karein.",
      short_pass: "Password kam se kam 6 characters ka hona chahiye.",
      server: "Registration me problem aayi. Kripya phir se try karein."
    },
    en: {
      email_format: "Please enter a valid email address.",
      email_exists: "This email is already registered. Please login.",
      short_pass: "Password must be at least 6 characters long.",
      server: "Registration failed. Please try again."
    },
    te: {
      email_format: "దయచేసి సరైన ఇమెయిల్ చిరునామా నమోదు చేయండి.",
      email_exists: "ఈ ఇమెయిల్ ఇప్పటికే నమోదు చేయబడింది. దయచేసి లాగిన్ చేయండి.",
      short_pass: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
      server: "నమోదులో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి."
    },
    ta: {
      email_format: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
      email_exists: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. உள்நுழையவும்.",
      short_pass: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்.",
      server: "பதிவில் சிக்கல். மீண்டும் முயற்சிக்கவும்."
    },
    kn: {
      email_format: "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.",
      email_exists: "ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.",
      short_pass: "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು.",
      server: "ನೋಂದಣಿಯಲ್ಲಿ ಸಮಸ್ಯೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
    },
    bn: {
      email_format: "অনুগ্রহ করে একটি সঠিক ইমেল ঠিকানা লিখুন।",
      email_exists: "এই ইমেলটি ইতিমধ্যে নিবন্ধিত। অনুগ্রহ করে লগইন করুন।",
      short_pass: "পাসওয়ার্ড কমপক্ষে 6 অক্ষরের হতে হবে।",
      server: "নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
    },
    mr: {
      email_format: "कृपया योग्य ईमेल पत्ता प्रविष्ट करा.",
      email_exists: "हा ईमेल आधीच नोंदणीकृत आहे. कृपया लॉग इन करा.",
      short_pass: "पासवर्ड किमान 6 अक्षरांचा असावा.",
      server: "नोंदणीमध्ये समस्या आली. कृपया पुन्हा प्रयत्न करा."
    },
    gu: {
      email_format: "કૃપા કરીને સાચું ઇમેઇલ સરનામું દાખલ કરો.",
      email_exists: "આ ઇમેઇલ પહેલેથી નોંધાયેલ છે. કૃપા કરીને લોગિન કરો.",
      short_pass: "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ.",
      server: "નોંધણીમાં સમસ્યા. ફરી પ્રયાસ કરો."
    },
    ml: {
      email_format: "ദയവായി ശരിയായ ഇമെയിൽ വിലാസം നൽകുക.",
      email_exists: "ഈ ഇമെയിൽ ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ട്. ദയവായി ലോഗിൻ ചെയ്യുക.",
      short_pass: "പാസ്‌വേഡിന് കുറഞ്ഞത് 6 പ്രതീകങ്ങൾ ഉണ്ടായിരിക്കണം.",
      server: "രജിസ്ട്രേഷനിൽ പ്രശ്നമുണ്ട്. വീണ്ടും ശ്രമിക്കുക."
    }
  };
  return dict[lang || "en"]?.[type] || dict["en"][type];
}

// Marketing: Registration ke baad user ko premium feel dene ke liye hook.
function getWelcomeHook(lang: string): string {
  const dict: Record<string, string> = {
    hi: "आपका स्वागत है! आपकी पहली ज्योतिषीय सलाह बिल्कुल फ्री है।",
    hinglish: "Aapka swagat hai! Aapki pehli jyotish salah bilkul free hai.",
    en: "Welcome! Your first astrological consultation is completely free.",
    te: "స్వాగతం! మీ మొదటి జ్యోతిష్య సంప్రదింపు పూర్తిగా ఉచితం.",
    ta: "வருக! உங்கள் முதல் ஜோதிட ஆலோசனை முற்றிலும் இலவசம்.",
    kn: "ಸ್ವಾಗತ! ನಿಮ್ಮ ಮೊದಲ ಜ್ಯೋತಿಷ್ಯ ಸಮಾಲೋಚನೆ ಸಂಪೂರ್ಣ ಉಚಿತ.",
    bn: "স্বাগতম! আপনার প্রথম জ্যোতিষ পরামর্শ সম্পূর্ণ বিনামূল্যে।",
    mr: "स्वागत आहे! तुमचा पहिला ज्योतिष सल्ला पूर्णपणे मोफत आहे.",
    gu: "સ્વાગત છે! તમારી પ્રથમ જ્યોતિષ સલાહ સંપૂર્ણ મફત છે.",
    ml: "സ്വാഗതം! നിങ്ങളുടെ ആദ്യ ജ്യോതിഷ കൺസൾട്ടേഷൻ പൂർണ്ണമായും സൗജന്യമാണ്."
  };
  return dict[lang] || dict["en"];
}

/* -------------------------------------------------------------------------- */
/*                              POST HANDLER                                  */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, language = "en" } = body; // 🔥 Extracting language

    // 🔥 FIX 1: Type check
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: getRegError(language, "email_format") }, { status: 400 });
    }

    // 🔥 FIX 2: Basic Email Format Check (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: getRegError(language, "email_format") }, { status: 400 });
    }

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: getRegError(language, "short_pass") }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = typeof name === "string" && name.trim() ? name.trim() : "User";
    const currentSessionUser = await getUser();

    // Check if email exists
    const existingUsers = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    const existingUser = existingUsers[0];

    if (existingUser) {
      if (!existingUser.isGuest) {
        return NextResponse.json({ error: getRegError(language, "email_exists") }, { status: 400 });
      }
      if (existingUser.id !== currentSessionUser?.id) {
        return NextResponse.json({ error: getRegError(language, "email_exists") }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let finalUser;

    // Upgrade Guest or Create New
    if (currentSessionUser && currentSessionUser.isGuest) {
      const updatedUsers = await db.update(users)
        .set({ 
          name: cleanName, 
          email: normalizedEmail, 
          password: hashedPassword, 
          isGuest: false,
          language: language // 🔥 Update user's preferred language
        })
        .where(eq(users.id, currentSessionUser.id))
        .returning();
      finalUser = updatedUsers[0];
    } else {
      const newUsers = await db.insert(users).values({
        name: cleanName,
        email: normalizedEmail,
        password: hashedPassword,
        isGuest: false,
        language: language, // 🔥 Save user's preferred language
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

    return NextResponse.json({ 
      success: true, 
      user: safeUser,
      welcomeMessage: getWelcomeHook(language) // 🔥 NAYA: Frontend isko alert/toast me dikha sakta hai
    }, { status: 201 });

  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // 🔥 Production (Live) app par database error chhupaya hai
    return NextResponse.json({ 
      error: getRegError("en", "server"), // Fallback to english for server error
      details: process.env.NODE_ENV === "development" ? (error.message || String(error)) : undefined
    }, { status: 500 });
  }
}