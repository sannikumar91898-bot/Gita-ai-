// app/api/kundli/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { aiResponseCache, birthDetails, charts, users } from "@/schema";
import {
  RASHIS_HI,
  chartSummary,
  computeChart,
  type KundliChart,
} from "@/vedic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 18_000;
const DEFAULT_MODEL = "gemini-1.5-flash";

type PlaceHit = { lat: number; lng: number; timeZone: string; };
type InterpretationStatus = "ready" | "quota" | "unavailable" | "not_configured" | "empty";

/* -------------------------------------------------------------------------- */
/*               🔥 PREMIUM 10-LANGUAGE ERROR TRANSLATIONS                    */
/* -------------------------------------------------------------------------- */

function getKundliError(lang: string, type: "invalid_req" | "consent" | "missing_fields" | "bad_details" | "future_date" | "place_not_found" | "calc_failed" | "guest_blocked"): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      invalid_req: "अमान्य अनुरोध। कृपया पुनः प्रयास करें।",
      consent: "कुंडली बनाने के लिए सहमति (Consent) आवश्यक है।",
      missing_fields: "कृपया सभी जन्म विवरण भरें।",
      bad_details: "कृपया अपने जन्म विवरण की जाँच करें।",
      future_date: "जन्म तिथि भविष्य की नहीं हो सकती।",
      place_not_found: "इस जन्म स्थान की लोकेशन नहीं मिली। शहर और राज्य साफ लिखें।",
      calc_failed: "इन जन्म विवरणों से कुंडली गणना नहीं हो सकी।",
      guest_blocked: "कुंडली बनाने के लिए कृपया लॉगिन या रजिस्टर करें।"
    },
    hinglish: {
      invalid_req: "Invalid request. Kripya phir se try karein.",
      consent: "Kundli banane ke liye consent zaroori hai.",
      missing_fields: "Kripya sabhi birth details bharein.",
      bad_details: "Kripya apne birth details check karein.",
      future_date: "Birth date future ki nahi ho sakti.",
      place_not_found: "Is birth place ki location nahi mili. Sheher aur state saaf likhein.",
      calc_failed: "In birth details se kundli calculate nahi ho saki.",
      guest_blocked: "Kundli banane ke liye kripya login ya register karein."
    },
    en: {
      invalid_req: "Invalid request. Please try again.",
      consent: "Consent is required to generate kundli.",
      missing_fields: "Please fill in all birth details.",
      bad_details: "Please check your birth details.",
      future_date: "Birth date cannot be in the future.",
      place_not_found: "Location for this birth place not found. Please write city and state clearly.",
      calc_failed: "Could not calculate kundli from these birth details.",
      guest_blocked: "Registration required to generate Kundli. Please login or register."
    },
    te: {
      invalid_req: "చెల్లని అభ్యర్థన. దయచేసి మళ్లీ ప్రయత్నించండి.",
      consent: "కుండలి రూపొందించడానికి సమ్మతి అవసరం.",
      missing_fields: "దయచేసి అన్ని పుట్టిన వివరాలను పూరించండి.",
      bad_details: "దయచేసి మీ పుట్టిన వివరాలను తనిఖీ చేయండి.",
      future_date: "పుట్టిన తేదీ భవిష్యత్తులో ఉండకూడదు.",
      place_not_found: "ఈ పుట్టిన స్థలం స్థానం కనుగొనబడలేదు. నగరం మరియు రాష్ట్రాన్ని స్పష్టంగా రాయండి.",
      calc_failed: "ఈ పుట్టిన వివరాల నుండి కుండలి లెక్కించబడలేదు.",
      guest_blocked: "కుండలి రూపొందించడానికి దయచేసి లాగిన్ లేదా నమోదు చేసుకోండి."
    },
    ta: {
      invalid_req: "தவறான கோரிக்கை. மீண்டும் முயற்சிக்கவும்.",
      consent: "ஜாதகத்தை உருவாக்க ஒப்புதல் தேவை.",
      missing_fields: "அனைத்து பிறப்பு விவரங்களையும் நிரப்பவும்.",
      bad_details: "உங்கள் பிறப்பு விவரங்களைச் சரிபார்க்கவும்.",
      future_date: "பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது.",
      place_not_found: "இந்த பிறந்த இடத்தின் இருப்பிடம் கிடைக்கவில்லை. நகரம் மற்றும் மாநிலத்தை தெளிவாக எழுதுங்கள்.",
      calc_failed: "இந்த பிறப்பு விவரங்களிலிருந்து ஜாதகத்தை கணக்கிட முடியவில்லை.",
      guest_blocked: "ஜாதகத்தை உருவாக்க உள்நுழையவும் அல்லது பதிவு செய்யவும்."
    },
    kn: {
      invalid_req: "ಅಮಾನ್ಯ ವಿನಂತಿ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      consent: "ಕುಂಡಲಿ ರಚಿಸಲು ಒಪ್ಪಿಗೆ ಅಗತ್ಯವಿದೆ.",
      missing_fields: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಜನ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
      bad_details: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      future_date: "ಜನ್ಮ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿರಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      place_not_found: "ಈ ಜನ್ಮ ಸ್ಥಳದ ಸ್ಥಳ ಕಂಡುಬಂದಿಲ್ಲ. ನಗರ ಮತ್ತು ರಾಜ್ಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಿರಿ.",
      calc_failed: "ಈ ಜನ್ಮ ವಿವರಗಳಿಂದ ಕುಂಡಲಿ ಲೆಕ್ಕಹಾಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
      guest_blocked: "ಕುಂಡಲಿ ರಚಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಾಯಿಸಿ."
    },
    bn: {
      invalid_req: "অবৈধ অনুরোধ। আবার চেষ্টা করুন।",
      consent: "কুণ্ডলী তৈরি করতে সম্মতি প্রয়োজন।",
      missing_fields: "সমস্ত জন্ম বিবরণ পূরণ করুন।",
      bad_details: "আপনার জন্ম বিবরণ পরীক্ষা করুন।",
      future_date: "জন্ম তারিখ ভবিষ্যতে হতে পারে না।",
      place_not_found: "এই জন্মস্থানের অবস্থান পাওয়া যায়নি। শহর এবং রাজ্য স্পষ্টভাবে লিখুন।",
      calc_failed: "এই জন্ম বিবরণ থেকে কুণ্ডলী গণনা করা যায়নি।",
      guest_blocked: "কুণ্ডলী তৈরি করতে লগইন বা নিবন্ধন করুন।"
    },
    mr: {
      invalid_req: "अवैध विनंती. कृपया पुन्हा प्रयत्न करा.",
      consent: "कुंडली तयार करण्यासाठी संमती आवश्यक आहे.",
      missing_fields: "कृपया सर्व जन्म तपशील भरा.",
      bad_details: "कृपया तुमचे जन्म तपशील तपासा.",
      future_date: "जन्म तारीख भविष्यातील असू शकत नाही.",
      place_not_found: "या जन्मस्थानाचे स्थान सापडले नाही. शहर आणि राज्य स्पष्टपणे लिहा.",
      calc_failed: "या जन्म तपशीलांवरून कुंडलीची गणना करता आली नाही.",
      guest_blocked: "कुंडली तयार करण्यासाठी कृपया लॉग इन किंवा नोंदणी करा."
    },
    gu: {
      invalid_req: "અમાન્ય વિનંતી. ફરી પ્રયાસ કરો.",
      consent: "કુંડળી બનાવવા માટે સંમતિ જરૂરી છે.",
      missing_fields: "કૃપા કરીને બધી જન્મ વિગતો ભરો.",
      bad_details: "કૃપા કરીને તમારી જન્મ વિગતો તપાસો.",
      future_date: "જન્મ તારીખ ભવિષ્યની હોઈ શકતી નથી.",
      place_not_found: "આ જન્મ સ્થળનું સ્થાન મળ્યું નથી. શહેર અને રાજ્ય સ્પષ્ટ લખો.",
      calc_failed: "આ જન્મ વિગતોમાંથી કુંડળીની ગણતરી કરી શકાઈ નથી.",
      guest_blocked: "કુંડળી બનાવવા માટે લોગિન અથવા નોંધણી કરો."
    },
    ml: {
      invalid_req: "അസാധുവായ അഭ്യർത്ഥന. വീണ്ടും ശ്രമിക്കുക.",
      consent: "കുണ്ഡലി സൃഷ്ടിക്കാൻ സമ്മതം ആവശ്യമാണ്.",
      missing_fields: "എല്ലാ ജനന വിവരങ്ങളും പൂരിപ്പിക്കുക.",
      bad_details: "നിങ്ങളുടെ ജനന വിവരങ്ങൾ പരിശോധിക്കുക.",
      future_date: "ജനനത്തീയതി ഭാവിയിൽ ആകാൻ കഴിയില്ല.",
      place_not_found: "ഈ ജനനസ്ഥലത്തിന്റെ സ്ഥാനം കണ്ടെത്തിയില്ല. നഗരവും സംസ്ഥാനവും വ്യക്തമായി എഴുതുക.",
      calc_failed: "ഈ ജനന വിവരങ്ങളിൽ നിന്ന് കുണ്ഡലി കണക്കാക്കാൻ കഴിഞ്ഞില്ല.",
      guest_blocked: "കുണ്ഡലി സൃഷ്ടിക്കാൻ ദയവായി ലോഗിൻ ചെയ്യുക അല്ലെങ്കിൽ രജിസ്റ്റർ ചെയ്യുക."
    }
  };
  return dict[lang || "hi"]?.[type] || dict["en"][type];
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    y >= 1900 &&
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

function validTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [h, m] = value.split(":").map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function publicChart(chart: KundliChart) {
  return {
    lagna: { rashiName: chart.lagna.rashiName, rashiNameHi: RASHIS_HI[chart.lagna.rashi], degreeInSign: chart.lagna.degreeInSign },
    moonSign: { rashiName: chart.moonSign.rashiName, rashiNameHi: RASHIS_HI[chart.moonSign.rashi] },
    nakshatra: { name: chart.nakshatra.name, pada: chart.nakshatra.pada },
    currentDasha: chart.currentDasha ? { maha: chart.currentDasha.maha.lord, mahaUntil: chart.currentDasha.maha.end.slice(0, 10), antar: chart.currentDasha.antar.lord, antarUntil: chart.currentDasha.antar.end.slice(0, 10) } : null,
    planets: chart.planets.map((planet) => ({ planet: planet.planet, rashiName: planet.rashiName, house: planet.house, retrograde: planet.retrograde })),
  };
}

function calculatedReport(name: string, chart: KundliChart): string {
  const view = publicChart(chart);
  const lines = [
    name + " की गणना की गई कुंडली",
    "लग्न: " + view.lagna.rashiNameHi + " (" + view.lagna.rashiName + ") " + view.lagna.degreeInSign + "°",
    "चंद्र राशि: " + view.moonSign.rashiNameHi + " (" + view.moonSign.rashiName + ")",
    "जन्म नक्षत्र: " + view.nakshatra.name + ", पद " + view.nakshatra.pada,
  ];
  if (view.currentDasha) {
    lines.push("वर्तमान महादशा: " + view.currentDasha.maha + " (" + view.currentDasha.mahaUntil + " तक), अंतरदशा: " + view.currentDasha.antar);
  }
  lines.push("ग्रह स्थिति:");
  for (const planet of view.planets) {
    lines.push(planet.planet + " — " + planet.rashiName + ", भाव " + planet.house + (planet.retrograde ? " (वक्री)" : ""));
  }
  lines.push("ये स्थितियाँ गणना से बनी हैं। ये भविष्य की गारंटी नहीं हैं।");
  return lines.join("\n");
}

async function resolvePlace(place: string): Promise<PlaceHit | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?count=5&format=json&name=" + encodeURIComponent(place),
      { cache: "no-store", signal: controller.signal }
    );
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.results)) return null;
    for (const item of data.results) {
      if (!isRecord(item)) continue;
      if (typeof item.latitude === "number" && typeof item.longitude === "number" && typeof item.timezone === "string" && item.timezone) {
        return { lat: item.latitude, lng: item.longitude, timeZone: item.timezone };
      }
    }
    return null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(data: unknown): string {
  if (!isRecord(data) || !Array.isArray(data.candidates)) return "";
  const candidate = data.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content)) return "";
  const parts = candidate.content.parts;
  if (!Array.isArray(parts)) return "";
  return parts.filter((part): part is Record<string, unknown> => isRecord(part) && typeof part.text === "string" && part.thought !== true).map((part) => part.text as string).join("").trim();
}

function getLangInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Write strictly in Hindi (Devanagari script).", hinglish: "Write strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Write strictly in English.", te: "Write strictly in Telugu (తెలుగు).", ta: "Write strictly in Tamil (தமிழ்).",
    kn: "Write strictly in Kannada (ಕನ್ನಡ).", bn: "Write strictly in Bengali (বাংলা).", mr: "Write strictly in Marathi (मराठी).",
    gu: "Write strictly in Gujarati (ગુજરાતી).", ml: "Write strictly in Malayalam (മലയാളം).",
  };
  return map[lang] || map["hinglish"];
}

async function writeInterpretation(params: { name: string; dateOfBirth: string; timeOfBirth: string; placeOfBirth: string; chart: KundliChart; language: string; }): Promise<{ text: string | null; status: InterpretationStatus }> {
  const cacheKey = ["kundli", params.dateOfBirth, params.timeOfBirth, params.placeOfBirth.toLowerCase().replace(/\s+/g, ""), params.language].join("_");

  try {
    const cached = await db.select().from(aiResponseCache).where(eq(aiResponseCache.questionKey, cacheKey)).limit(1);
    if (cached[0]?.aiAnswer?.trim()) return { text: cached[0].aiAnswer, status: "ready" };
  } catch (error) {}

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  if (!apiKey) return { text: null, status: "not_configured" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: `You are a premium human Vedic Astrologer. ${getLangInstruction(params.language)} Use only the calculated chart facts supplied. DO NOT invent planets. Provide a short, highly engaging reflection with headings for Nature (स्वभाव), Career (करियर), Relationships (संबंध), and a specific "Problem/Dosh" (दोष) section. This Problem section will be used to prompt a chat consultation, so make it sound like a serious but solvable issue (e.g., "Mangal Dosh is creating marriage delays").` }],
        },
        contents: [{ role: "user", parts: [{ text: `Write the reflection.\n\n${chartSummary(params.chart, params.name)}\nPlace: ${params.placeOfBirth}` }] }],
        generationConfig: { maxOutputTokens: 900, temperature: 0.7 },
      }),
    });

    if (response.status === 429) return { text: null, status: "quota" };
    if (!response.ok) return { text: null, status: "unavailable" };

    const text = extractText(await response.json());
    if (!text) return { text: null, status: "empty" };

    try {
      await db.insert(aiResponseCache).values({ id: crypto.randomUUID(), questionKey: cacheKey, originalQuestion: "Kundli interpretation for " + params.name, aiAnswer: text }).onConflictDoNothing();
    } catch (error) {}
    
    return { text, status: "ready" };
  } catch (error) {
    return { text: null, status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

// 🔥 FIXED: RASHIS_HI ka use kiya gaya hai
function getSuggestedChatPrompt(lang: string, name: string, chart: KundliChart): string {
  const moon = RASHIS_HI[chart.moonSign.rashi]; // 🔥 Yahan fix kiya gaya hai
  const dasha = chart.currentDasha ? chart.currentDasha.maha.lord : "Shani";
  
  const dict: Record<string, string> = {
    hi: `नमस्ते, मेरा नाम ${name} है। मैंने अभी अपनी कुंडली देखी और मुझे चिंता है कि मेरी ${moon} राशि और वर्तमान ${dasha} महादशा में कुछ रुकावटें दिख रही हैं। क्या आप मेरी कुंडली के दोषों का सटीक कारण और उसका उपाय बता सकती हैं?`,
    hinglish: `Namaste, mera naam ${name} hai. Maine abhi apni kundli dekhi aur mujhe chinta hai ki meri ${moon} rashi aur current ${dasha} mahadasha me kuch rukawatein dikh rahi hain. Kya aap meri kundli ke doshon ka exact reason aur upay bata sakti hain?`,
    en: `Hello, my name is ${name}. I just checked my Kundli and I'm concerned about some blockages showing in my ${moon} moon sign and current ${dasha} mahadasha. Can you tell me the exact cause of these doshas and their remedies?`,
    te: `నమస్తే, నా పేరు ${name}. నేను ఇప్పుడే నా కుండలిని చూశాను మరియు నా ${moon} రాశి మరియు ప్రస్తుత ${dasha} మహాదశలో కొన్ని అడ్డంకులు కనిపిస్తున్నాయని ఆందోళన చెందుతున్నాను. దయచేసి ఈ దోషాల ఖచ్చితమైన కారణం మరియు పరిహారం చెప్పగలరా?`,
    ta: `வணக்கம், என் பெயர் ${name}. நான் இப்போதுதான் என் ஜாதகத்தைப் பார்த்தேன், எனது ${moon} ராசி மற்றும் தற்போதைய ${dasha} மகாதசையில் சில தடைகள் இருப்பதாகக் கவலைப்படுகிறேன். இந்த தோஷங்களுக்கான சரியான காரணத்தையும் பரிகாரத்தையும் சொல்ல முடியுமா?`,
    kn: `ನಮಸ್ಕಾರ, ನನ್ನ ಹೆಸರು ${name}. ನಾನು ಈಗಷ್ಟೇ ನನ್ನ ಕುಂಡಲಿ ನೋಡಿದೆ ಮತ್ತು ನನ್ನ ${moon} ರಾಶಿ ಮತ್ತು ಪ್ರಸ್ತುತ ${dasha} ಮಹಾದಶೆಯಲ್ಲಿ ಕೆಲವು ಅಡೆತಡೆಗಳು ಕಂಡುಬರುತ್ತಿವೆ ಎಂದು ಚಿಂತೆಗೊಳಗಾಗಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಈ ದೋಷಗಳ ನಿಖರವಾದ ಕಾರಣ ಮತ್ತು ಪರಿಹಾರವನ್ನು ಹೇಳಬಹುದೇ?`,
    bn: `নমস্কার, আমার নাম ${name}। আমি এইমাত্র আমার কুণ্ডলী দেখেছি এবং আমার ${moon} রাশি এবং বর্তমান ${dasha} মহাদশায় কিছু বাধা দেখতে পাচ্ছি। আপনি কি এই দোষগুলির সঠিক কারণ এবং প্রতিকার বলতে পারেন?`,
    mr: `नमस्कार, माझे नाव ${name} आहे. मी नुकतीच माझी कुंडली पाहिली आणि माझ्या ${moon} राशी आणि सध्याच्या ${dasha} महादशेत काही अडथळे दिसत आहेत. कृपया या दोषांचे नेमके कारण आणि उपाय सांगू शकाल का?`,
    gu: `નમસ્તે, મારું નામ ${name} છે. મેં હમણાં જ મારી કુંડળી જોઈ અને મારી ${moon} રાશિ અને વર્તમાન ${dasha} મહાદશામાં કેટલીક રુકાવટો દેખાઈ રહી છે. શું તમે આ દોષોનું ચોક્કસ કારણ અને ઉપાય જણાવી શકશો?`,
    ml: `നമസ്തേ, എന്റെ പേര് ${name}. ഞാൻ ഇപ്പോൾ എന്റെ കുണ്ഡലി പരിശോധിച്ചു, എന്റെ ${moon} രാശിയിലും നിലവിലെ ${dasha} മഹാദശയിലും ചില തടസ്സങ്ങൾ കാണുന്നതിൽ ഞാൻ ആശങ്കാകുലനാണ്. ഈ ദോഷങ്ങളുടെ കൃത്യമായ കാരണവും പരിഹാരവും നൽകാമോ?`
  };
  return dict[lang] || dict["hinglish"];
}

export async function GET() {
  const user = await getUser();
  
  if (!user || user.isGuest) {
    return NextResponse.json({ birth: null, chart: null }, { headers: { "Cache-Control": "no-store" } });
  }

  const [birthRows, chartRows] = await Promise.all([
    db.select().from(birthDetails).where(eq(birthDetails.userId, user.id)).limit(1),
    db.select().from(charts).where(eq(charts.userId, user.id)).orderBy(desc(charts.createdAt)).limit(1),
  ]);

  const birth = birthRows[0] ? {
    name: birthRows[0].name, dob: birthRows[0].dob, birthTime: birthRows[0].birthTime, birthPlace: birthRows[0].birthPlace, gender: birthRows[0].gender, isBirthTimeUnknown: birthRows[0].isBirthTimeUnknown,
  } : null;

  const stored = birthRows[0] && chartRows[0] ? (chartRows[0].data as KundliChart) : null;
  return NextResponse.json({
    birth,
    chart: stored && stored.lagna ? publicChart(stored) : null,
    calculatedReport: stored && stored.lagna ? calculatedReport(birth?.name || "", stored) : null,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let body: unknown;
  let language = "hinglish"; // Fallback
  
  try { 
    body = await req.json(); 
    if (isRecord(body) && typeof body.language === "string") language = body.language;
  } catch { 
    return jsonError(getKundliError(language, "invalid_req"), 400); 
  }
  
  if (!isRecord(body)) return jsonError(getKundliError(language, "invalid_req"), 400);

  const user = await getUser();
  if (!user || user.isGuest) {
    return jsonError(getKundliError(language, "guest_blocked"), 401);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const gender = typeof body.gender === "string" ? body.gender.trim() : "Not specified";
  const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth.trim() : "";
  const rawTimeOfBirth = typeof body.timeOfBirth === "string" ? body.timeOfBirth.trim() : "";
  const placeOfBirth = typeof body.placeOfBirth === "string" ? body.placeOfBirth.trim() : "";
  const isTimeUnknown = body.isTimeUnknown === true;
  const consent = body.consent === true;
  const timeOfBirth = isTimeUnknown ? "12:00" : rawTimeOfBirth;

  if (!consent) return jsonError(getKundliError(language, "consent"), 400);
  if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) return jsonError(getKundliError(language, "missing_fields"), 400);
  if (name.length > 100 || placeOfBirth.length > 200 || !validDate(dateOfBirth) || !validTime(timeOfBirth)) return jsonError(getKundliError(language, "bad_details"), 400);
  if (dateOfBirth > new Date().toISOString().slice(0, 10)) return jsonError(getKundliError(language, "future_date"), 400);

  const place = await resolvePlace(placeOfBirth);
  if (!place) return jsonError(getKundliError(language, "place_not_found"), 422);

  let chart: KundliChart;
  try {
    chart = computeChart({ dob: dateOfBirth, time: timeOfBirth, lat: place.lat, lng: place.lng, timeZone: place.timeZone });
  } catch (error) {
    return jsonError(getKundliError(language, "calc_failed"), 422);
  }

  let saved = false;
  try {
    // 🔥 Yahan se aapka adhura code pura kiya gaya hai
    await db.insert(birthDetails).values({
      userId: user.id, 
      name, 
      gender, 
      dob: dateOfBirth, 
      birthTime: timeOfBirth, 
      isBirthTimeUnknown: isTimeUnknown, 
      birthPlace: placeOfBirth, 
      lat: place.lat, 
      lng: place.lng, 
      timeZone: place.timeZone, 
      consent: true,
    }).onConflictDoUpdate({
      target: birthDetails.userId,
      set: { 
        name, 
        gender, 
        dob: dateOfBirth, 
        birthTime: timeOfBirth, 
        isBirthTimeUnknown: isTimeUnknown, 
        birthPlace: placeOfBirth, 
        lat: place.lat, 
        lng: place.lng, 
        timeZone: place.timeZone, 
        consent: true, 
        updatedAt: new Date() 
      },
    });
    await db.insert(charts).values({ userId: user.id, data: chart });
    await db.update(users).set({ name }).where(eq(users.id, user.id));
    saved = true;
  } catch (error) { 
    console.error("Birth details save failed:", error); 
  }

  const written = await writeInterpretation({ name, dateOfBirth, timeOfBirth, placeOfBirth, chart, language });
  const facts = calculatedReport(name, chart);
  
  // 🔥 Generate the exact prompt to be sent to the chat
  const suggestedChatPrompt = getSuggestedChatPrompt(language, name, chart);

  return NextResponse.json({
    ok: true, 
    saved, 
    chart: publicChart(chart), 
    calculatedReport: facts,
    interpretation: written.text, 
    interpretationStatus: written.status,
    kundliReport: written.text ? facts + "\n\n" + written.text : facts,
    suggestedChatPrompt: suggestedChatPrompt, // 🔥 Ye naya field frontend me use hoga
  }, { headers: { "Cache-Control": "no-store" } });
}