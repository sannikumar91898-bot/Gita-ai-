// app/api/auth/guest/route.ts
import { NextResponse } from "next/server";
import {
  createGuestUser,
  createSession,
  setSessionCookie,
  getUser,
} from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*               🔥 PREMIUM TRANSLATIONS & MARKETING HOOKS                    */
/* -------------------------------------------------------------------------- */

// Psychology: Agar server fail ho, toh user ko uski bhasha me batao
function getGuestError(lang: string): string {
  const dict: Record<string, string> = {
    hi: "गेस्ट सेशन शुरू नहीं हो पाया। कृपया पुनः प्रयास करें।",
    hinglish: "Guest session shuru nahi ho paya. Kripya phir se try karein.",
    en: "Unable to start guest session. Please try again.",
    te: "గెస్ట్ సెషన్ ప్రారంభించడం సాధ్యపడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    ta: "விருந்தினர் அமர்வைத் தொடங்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    kn: "ಅತಿಥಿ ಸೆಷನ್ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    bn: "গেস্ট সেশন শুরু করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
    mr: "गेस्ट सेशन सुरू करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
    gu: "ગેસ્ટ સેશન શરૂ કરી શકાયું નથી. ફરી પ્રયાસ કરો.",
    ml: "ഗസ്റ്റ് സെഷൻ ആരംഭിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
  };
  return dict[lang || "en"] || dict["en"];
}

// Business Marketing: Guest user ko login karne ke liye attract karo
function getGuestHook(lang: string): string {
  const dict: Record<string, string> = {
    hi: "आप गेस्ट के रूप में हैं। अपनी चैट सेव करने और पूरी कुंडली देखने के लिए लॉगिन करें।",
    hinglish: "Aap Guest ke roop mein hain. Apni chat save karne aur puri kundli dekhne ke liye login karein.",
    en: "You are in Guest mode. Login to save your chats and unlock full Kundli.",
    te: "మీరు గెస్ట్ మోడ్‌లో ఉన్నారు. మీ చాట్‌లను సేవ్ చేయడానికి మరియు పూర్తి కుండలిని చూడటానికి లాగిన్ చేయండి.",
    ta: "நீங்கள் விருந்தினர் பயன்முறையில் உள்ளீர்கள். உங்கள் அரட்டைகளைச் சேமிக்கவும் முழு ஜாதகத்தையும் பார்க்கவும் உள்நுழையவும்.",
    kn: "ನೀವು ಅತಿಥಿ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ. ನಿಮ್ಮ ಚಾಟ್‌ಗಳನ್ನು ಉಳಿಸಲು ಮತ್ತು ಪೂರ್ಣ ಕುಂಡಲಿ ನೋಡಲು ಲಾಗಿನ್ ಮಾಡಿ.",
    bn: "আপনি গেস্ট মোডে আছেন। আপনার চ্যাট সংরক্ষণ করতে এবং সম্পূর্ণ কুণ্ডলী দেখতে লগইন করুন।",
    mr: "तुम्ही गेस्ट मोडमध्ये आहात. तुमची चॅट जतन करण्यासाठी आणि संपूर्ण कुंडली पाहण्यासाठी लॉग इन करा.",
    gu: "તમે ગેસ્ટ મોડમાં છો. તમારી ચેટ સાચવવા અને સંપૂર્ણ કુંડળી જોવા લોગિન કરો.",
    ml: "നിങ്ങൾ ഗസ്റ്റ് മോഡിലാണ്. നിങ്ങളുടെ ചാറ്റുകൾ സേവ് ചെയ്യാനും പൂർണ്ണ കുണ്ഡലി കാണാനും ലോഗിൻ ചെയ്യുക.",
  };
  return dict[lang || "en"] || dict["en"];
}

/* -------------------------------------------------------------------------- */
/*                              POST HANDLER                                  */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  // 🔥 FIX: Language ko try block ke bahar declare kiya taaki catch block me bhi pata rahe
  let language = "hinglish"; 

  try {
    // 🔥 Parse language from request body (Frontend se aayegi)
    try {
      const body = await request.json();
      if (body?.language) language = body.language;
    } catch {
      // Agar body empty hai, toh default language use hogi
    }

    // 🔥 Agar user ka session pehle se hai, toh naya guest mat banao
    const existingUser = await getUser();
    if (existingUser) {
      return NextResponse.json(
        {
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            language: existingUser.language || language,
            isGuest: existingUser.isGuest,
            walletBalancePaise: existingUser.walletBalancePaise,
            freeMessagesUsed: existingUser.freeMessagesUsed,
          },
          // Agar user pehle se hai, toh usey dobara hook mat dikhao
          isNewGuest: false 
        },
        { status: 200 }
      );
    }

    // Agar naya user hai, toh guest create karo uski language me
    const guest = await createGuestUser(language);
    const session = await createSession(guest.id);

    await setSessionCookie(session.token, session.expires);

    return NextResponse.json(
      {
        user: {
          id: guest.id,
          name: guest.name,
          email: guest.email,
          language: guest.language,
          isGuest: guest.isGuest,
          walletBalancePaise: guest.walletBalancePaise,
          freeMessagesUsed: guest.freeMessagesUsed,
        },
        isNewGuest: true,
        welcomeMessage: getGuestHook(language), // 🔥 NAYA: Frontend isko banner par dikha sakta hai
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guest session creation failed:", error);

    // 🔥 FIX: Ab catch block me 'language' available hai, toh error sahi bhasha me jayega
    return NextResponse.json(
      { error: getGuestError(language) },
      { status: 500 }
    );
  }
}