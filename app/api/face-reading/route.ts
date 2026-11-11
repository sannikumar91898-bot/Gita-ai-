// app/api/face-reading/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔥 SIRF MODAL (No limits, No Gemini, No Groq)
const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;

if (!modalUrl || !modalApiKey) {
  console.error("[FATAL] MODAL_API_URL or MODAL_API_KEY is missing in Render!");
}

const modalClient = new OpenAI({
  baseURL: modalUrl || "http://localhost:8000/v1",
  apiKey: modalApiKey || "dummy-key",
  timeout: 60000, // 60 seconds timeout for image analysis
});

function getLanguageInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Reply strictly in pure Hindi (Devanagari script).",
    hinglish: "Reply strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Reply strictly in English.",
    te: "Reply strictly in Telugu (తెలుగు).", ta: "Reply strictly in Tamil (தமிழ்).",
    kn: "Reply strictly in Kannada (ಕನ್ನಡ).", bn: "Reply strictly in Bengali (বাংলা).",
    mr: "Reply strictly in Marathi (मराठी).", gu: "Reply strictly in Gujarati (ગુજરાતી).",
    ml: "Reply strictly in Malayalam (മലയാളം).",
  };
  return map[lang] || map["hinglish"];
}

// 🔥 10 Language Psychological Marketing Message (FOMO Trigger)
function getPsychologicalUnauthorizedMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "आपके चेहरे के राज अभी अनकहे हैं। सटीक फेस रीडिंग और अपने भविष्य की सच्चाई जानने के लिए कृपया लॉगिन या रजिस्टर करें।",
    hinglish: "Aapke chehre ke raaz abhi ankahe hain. Sahi face reading aur apne bhavishya ki sachai jaanne ke liye kripya login ya register karein.",
    en: "The secrets of your face are still untold. Please login or register for accurate face reading and to uncover the truth about your future.",
    te: "మీ ముఖ రహస్యాలు ఇంకా చెప్పబడలేదు. ఖచ్చితమైన ఫేస్ రీడింగ్ మరియు మీ భవిష్యత్తు నిజం తెలుసుకోవడానికి దయచేసి లాగిన్ లేదా రిజిస్టర్ చేయండి.",
    ta: "உங்கள் முகத்தின் ரகசியங்கள் இன்னும் சொல்லப்படவில்லை. துல்லியமான முக படிப்பு மற்றும் உங்கள் எதிர்கால உண்மையை அறிய தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
    kn: "ನಿಮ್ಮ ಮುಖದ ರಹಸ್ಯಗಳು ಇನ್ನೂ ಹೇಳಲ್ಪಟ್ಟಿಲ್ಲ. ನಿಖರವಾದ ಮುಖ ಓದುವಿಕೆ ಮತ್ತು ನಿಮ್ಮ ಭವಿಷ್ಯದ ಸತ್ಯವನ್ನು ತಿಳಿಯಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಾಯಿಸಿ.",
    bn: "আপনার মুখের রহস্য এখনও অকথিত। সঠিক মুখ পাঠ এবং আপনার ভবিষ্যতের সত্য জানতে অনুগ্রহ করে লগইন বা রেজিস্টার করুন।",
    mr: "तुमच्या चेहऱ्याची रहस्ये अजून सांगितलेली नाहीत. अचूक चेहरा वाचन आणि तुमच्या भविष्यातील सत्य जाणून घेण्यासाठी कृपया लॉगिन किंवा नोंदणी करा.",
    gu: "તમારા ચહેરાના રહસ્યો હજી કહેવાયા નથી. સચોટ ચહેરો વાંચન અને તમારા ભવિષ્યનું સત્ય જાણવા માટે કૃપા કરીને લોગિન અથવા નોંધણી કરો.",
    ml: "നിങ്ങളുടെ മുഖത്തിന്റെ രഹസ്യങ്ങൾ ഇപ്പോഴും പറഞ്ഞിട്ടില്ല. കൃത്യമായ മുഖ വായനയ്ക്കായി ദയവായി ലോഗിൻ ചെയ്യുകയോ രജിസ്റ്റർ ചെയ്യുകയോ ചെയ്യുക.",
  };
  return map[lang] || map["en"];
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    
    // 🔥 Guest Protection (Psychological Marketing Hook)
    if (!user || user.isGuest) {
      return NextResponse.json({ 
        code: "LOGIN_REQUIRED",
        error: "Unauthorized",
        message: getPsychologicalUnauthorizedMessage("hinglish") 
      }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const language = (formData.get("language") as string) || "hinglish";

    // Backend Validation
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Missing image." }, { status: 400 });
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Image must be under 10MB." }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Only JPG, PNG or WEBP are supported." }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    // Face Reading Prompt
    const prompt = `You are an expert Vedic Face Reader. Analyze this face image.
    If the image does not clearly contain a human face, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of a human face."}
    Otherwise, return JSON with keys: title (short title), insight (2 detailed paragraphs about nature, career, and relationships), hook (1 line engaging summary).
    LANGUAGE RULES: ${getLanguageInstruction(language)}`;

    let result: any = null;

    // 🔥 CALL MODAL DIRECTLY
    try {
      const completion = await modalClient.chat.completions.create({
        model: "Qwen/Qwen3.6-27B", // Aapke Modal ka exact model name
        messages: [
          { 
            role: "user", 
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
            ] 
          }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "{}";
      result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      
    } catch (err: any) {
      console.error("=== MODAL API FAILED (FACE READING) ===");
      console.error("Error Name:", err.name);
      console.error("Error Message:", err.message);
      
      if (err.message?.includes("404")) {
        return NextResponse.json({ 
          error: "AI_ERROR", 
          message: "Modal Endpoint nahi mila. Kripya check karein ki endpoint 'Running' state me hai ya nahi." 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: "AI_ERROR", 
        message: "AI server is busy. Please try again." 
      }, { status: 500 });
    }

    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Face Reading",
        insight: result.insight || "Analysis complete.",
        hook: result.hook || "A new change is coming."
      }
    });

  } catch (error: any) {
    console.error("Face Reading API Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}