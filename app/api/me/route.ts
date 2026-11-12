// app/api/me/route.ts
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/auth";
import { db } from "@/index";
import { users, birthDetails, charts } from "@/schema";

export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*       🔥 PREMIUM PSYCHOLOGY & MARKETING HOOK (10 LANGUAGE SUPPORT)         */
/* -------------------------------------------------------------------------- */
// यह फंक्शन यूज़र के डेटा (वॉलेट, फ्री मैसेज, कुंडली) को देखकर तय करता है 
// कि फ्रंटएंड पर यूज़र को क्या "दिखाना" या "बेचना" (Marketing) चाहिए।
function getMarketingHook(lang: string, user: any, hasBirth: boolean): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      noBirth: "सटीक भविष्यवाणी के लिए अपनी जन्म कुंडली जोड़ें।",
      lowBalance: "आपके फ्री मैसेज खत्म हैं। ज्योतिषी से और बात करने के लिए रिचार्ज करें।",
      premium: "आप एक प्रीमियम सदस्य हैं। भविष्य की सभी विशेषताएं आपके लिए अनलॉक हैं!",
      welcome: "नमस्ते! आपकी पहली ज्योतिषीय सलाह बिल्कुल फ्री है।",
    },
    hinglish: {
      noBirth: "Sahi prediction ke liye apni Kundli add karein.",
      lowBalance: "Aapke free messages khatam hain. Aur chat karne ke liye recharge karein.",
      premium: "Aap ek Premium member hain. Aapke liye saari features unlock hain!",
      welcome: "Namaste! Aapki pehli Jyotish salah bilkul free hai.",
    },
    en: {
      noBirth: "Add your birth details for precise predictions.",
      lowBalance: "Free messages exhausted. Recharge to continue chatting.",
      premium: "You are a Premium member. All features are unlocked!",
      welcome: "Welcome! Your first astrological consultation is completely free.",
    },
    te: {
      noBirth: "ఖచ్చితమైన అంచనాల కోసం మీ జన్మ వివరాలను జోడించండి.",
      lowBalance: "ఉచిత సందేశాలు ముగిశాయి. చాటింగ్ కొనసాగించడానికి రీఛార్జ్ చేయండి.",
      premium: "మీరు ప్రీమియం సభ్యులు. అన్ని ఫీచర్లు అన్‌లాక్ చేయబడ్డాయి!",
      welcome: "స్వాగతం! మీ మొదటి జ్యోతిష్య సంప్రదింపు పూర్తిగా ఉచితం.",
    },
    ta: {
      noBirth: "துல்லியமான கணிப்புகளுக்கு உங்கள் பிறப்பு விவரங்களைச் சேர்க்கவும்.",
      lowBalance: "இலவச செய்திகள் தீர்ந்தன. அரட்டையைத் தொடர ரீசார்ஜ் செய்யுங்கள்.",
      premium: "நீங்கள் ஒரு பிரீமியம் உறுப்பினர். அனைத்து அம்சங்களும் திறக்கப்பட்டுள்ளன!",
      welcome: "வருக! உங்கள் முதல் ஜோதிட ஆலோசனை முற்றிலும் இலவசம்.",
    },
    kn: {
      noBirth: "ನಿಖರವಾದ ಮುನ್ಸೂಚನೆಗಳಿಗಾಗಿ ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ.",
      lowBalance: "ಉಚಿತ ಸಂದೇಶಗಳು ಮುಗಿದಿವೆ. ಚಾಟ್ ಮುಂದುವರಿಸಲು ರೀಚಾರ್ಜ್ ಮಾಡಿ.",
      premium: "ನೀವು ಪ್ರೀಮಿಯಂ ಸದಸ್ಯರು. ಎಲ್ಲಾ ವೈಶಿಷ್ಟ್ಯಗಳು ಅನ್‌ಲಾಕ್ ಆಗಿವೆ!",
      welcome: "ಸ್ವಾಗತ! ನಿಮ್ಮ ಮೊದಲ ಜ್ಯೋತಿಷ್ಯ ಸಮಾಲೋಚನೆ ಸಂಪೂರ್ಣ ಉಚಿತ.",
    },
    bn: {
      noBirth: "সঠিক ভবিষ্যদ্বাণীর জন্য আপনার জন্ম বিবরণ যোগ করুন।",
      lowBalance: "ফ্রি মেসেজ শেষ। চ্যাট চালিয়ে যেতে রিচার্জ করুন।",
      premium: "আপনি একজন প্রিমিয়াম সদস্য। সমস্ত বৈশিষ্ট্য আনলক করা হয়েছে!",
      welcome: "স্বাগতম! আপনার প্রথম জ্যোতিষ পরামর্শ সম্পূর্ণ বিনামূল্যে।",
    },
    mr: {
      noBirth: "अचूक भविष्यवाणीसाठी तुमची जन्म तपशील जोडा.",
      lowBalance: "मोफत संदेश संपले आहेत. चॅट सुरू ठेवण्यासाठी रिचार्ज करा.",
      premium: "तुम्ही प्रीमियम सदस्य आहात. सर्व वैशिष्ट्ये अनलॉक आहेत!",
      welcome: "स्वागत आहे! तुमचा पहिला ज्योतिष सल्ला पूर्णपणे मोफत आहे.",
    },
    gu: {
      noBirth: "સચોટ આગાહીઓ માટે તમારી જન્મ વિગતો ઉમેરો.",
      lowBalance: "ફ્રી મેસેજ ખતમ. ચેટ ચાલુ રાખવા માટે રિચાર્જ કરો.",
      premium: "તમે પ્રીમિયમ સભ્ય છો. બધા ફીચર્સ અનલોક છે!",
      welcome: "સ્વાગત છે! તમારી પ્રથમ જ્યોતિષ સલાહ સંપૂર્ણ મફત છે.",
    },
    ml: {
      noBirth: "കൃത്യമായ പ്രവചനങ്ങൾക്കായി നിങ്ങളുടെ ജനന വിവരങ്ങൾ ചേർക്കുക.",
      lowBalance: "സൗജന്യ സന്ദേശങ്ങൾ തീർന്നു. ചാറ്റ് തുടരാൻ റീചാർജ് ചെയ്യുക.",
      premium: "നിങ്ങൾ ഒരു പ്രീമിയം അംഗമാണ്. എല്ലാ സവിശേഷതകളും അൺലോക്ക് ചെയ്തിട്ടുണ്ട്!",
      welcome: "സ്വാഗതം! നിങ്ങളുടെ ആദ്യ ജ്യോതിഷ കൺസൾട്ടേഷൻ പൂർണ്ണമായും സൗജന്യമാണ്.",
    }
  };
  
  const text = dict[lang || "hi"] || dict["en"];

  if (user.premiumUntil && new Date(user.premiumUntil) > new Date()) return text.premium;
  if (!hasBirth) return text.noBirth;
  if ((user.walletBalancePaise ?? 0) < 200 && (user.freeMessagesUsed ?? 0) >= 3) return text.lowBalance;
  return text.welcome;
}

/* -------------------------------------------------------------------------- */
/*                              GET PROFILE                                   */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    const sessionUser = await getUser();
    if (!sessionUser) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // 🔥 OPTIMIZATION: Fetch all data in parallel using Promise.all to reduce latency
    const [userRowResult, birthRowResult, chartRowResult] = await Promise.all([
      db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1),
      db.select().from(birthDetails).where(eq(birthDetails.userId, sessionUser.id)).limit(1),
      db.select().from(charts).where(eq(charts.userId, sessionUser.id)).orderBy(desc(charts.createdAt)).limit(1)
    ]);

    const userRow = userRowResult[0];
    const birthRow = birthRowResult[0];
    const chartRow = chartRowResult[0];

    if (!userRow) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const birth = birthRow ? {
      name: birthRow.name,
      dob: birthRow.dob,
      birthTime: birthRow.birthTime,
      birthPlace: birthRow.birthPlace,
      gender: birthRow.gender,
      isBirthTimeUnknown: birthRow.isBirthTimeUnknown,
    } : null;

    // 🔥 SECURITY FIX: Dynamic Google Auth Check
    const isGoogleAuthConfigured = Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    );

    // 🔥 MARKETING: Generate Smart Hook based on user's psychological state
    const marketingHook = getMarketingHook(userRow.language || "hi", userRow, !!birth);

    return NextResponse.json({
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        language: userRow.language,
        isGuest: userRow.isGuest,
        walletBalancePaise: userRow.walletBalancePaise,
        freeMessagesUsed: userRow.freeMessagesUsed,
        premiumUntil: userRow.premiumUntil,
      },
      birth,
      hasChart: !!chartRow,
      googleAuthConfigured: isGoogleAuthConfigured, // 🔥 Now dynamic
      marketingHook, // 🔥 NAYA: Frontend isko sidha banner me dikha sakta hai
    }, { 
      headers: { 
        "Cache-Control": "no-store, max-age=0" 
      } 
    });

  } catch (error: any) {
    console.error("[API /me] Error:", error?.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}