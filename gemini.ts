

import type { KundliChart } from "./vedic";
import { chartSummary } from "./vedic";

export const GITA_SYSTEM_PROMPT = `You are Gita AI, a friendly, empathetic, personalised AI astrology companion. Speak naturally, respectfully, and clearly. Understand the user's concern before answering. Provide thoughtful astrology-based interpretations using the user's available birth details and reliable calculated chart data. Do not invent planetary positions, dashas, transits, or birth-chart calculations.

Personalise answers without repeatedly asking for information already available in the conversation. Explain uncertainty honestly. Never present astrological predictions as guaranteed facts. Do not create fear, encourage dependency, or pressure users to purchase remedies.

For health concerns, provide general supportive information, never a medical diagnosis or substitute for professional medical care. For financial and career matters, explain that astrology is not a guarantee and encourage practical decision-making.

Respond in the user's selected language: Hindi, Hinglish, or English. Avoid repetitive disclaimers, generic filler, and robotic responses. Keep answers warm, relevant, and easy to understand.`;

export type Lang = "en" | "hi" | "hinglish";

export type GeminiResult =
  | { ok: true; text: string }
  | {
      ok: false;
      code:
        | "not_configured"
        | "quota"
        | "network"
        | "invalid"
        | "invalid_credentials";
      message: string;
    };

const LANG_NAME: Record<Lang, string> = {
  en: "English",
  hi: "Hindi (Devanagari script)",
  hinglish: "Hinglish (Roman Hindi mixed with English)",
};

export function geminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function generateAstrologyReply(params: {
  history: { role: "user" | "assistant"; content: string }[];
  language: Lang;
  chartText?: string | null;
  userName?: string | null;
}): Promise<GeminiResult> {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return {
      ok: false,
      code: "not_configured",
      message: "AI is not configured yet.",
    };
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const system = [
    GITA_SYSTEM_PROMPT,
    `The user's preferred language for this conversation is ${LANG_NAME[params.language]}. Reply in that language only.`,
    params.userName ? `The user's name is ${params.userName}.` : "",
    params.chartText
      ? `Reliable calculated Vedic chart data (use this, never invent positions):\n${params.chartText}`
      : "No birth chart is available yet. If precise chart details are needed, gently suggest completing the birth-details onboarding. You may still offer general guidance.",
    "Keep replies concise (roughly 120–220 words), warm and conversational.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const contents = params.history.slice(-14).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: system }],
          },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (res.status === 429) {
      return {
        ok: false,
        code: "quota",
        message:
          "The stars are busy right now — AI quota reached. Please try again shortly.",
      };
    }

    if (res.status === 400 || res.status === 401 || res.status === 403) {
      const body = await res.text().catch(() => "");

      if (
        res.status !== 400 ||
        /API_KEY|api key|credential|UNAUTHENTICATED|PERMISSION_DENIED/i.test(
          body
        )
      ) {
        return {
          ok: false,
          code: "invalid_credentials",
          message:
            "The AI service is not available right now (configuration issue). Please try again later.",
        };
      }
    }

    if (res.status === 404) {
      return {
        ok: false,
        code: "not_configured",
        message:
          "The configured AI model is unavailable. Please try again later.",
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        code: "invalid",
        message: "The AI service returned an unexpected response.",
      };
    }

    const data = await res.json();

    const text: unknown = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("");

    if (typeof text !== "string" || !text.trim()) {
      return {
        ok: false,
        code: "invalid",
        message: "The AI response was empty. Please try again.",
      };
    }

    return { ok: true, text: text.trim() };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Could not reach the AI service. Check your connection and retry.",
    };
  }
}

export async function analyzePalmImage(params: {
  base64: string;
  mimeType: string;
  language: Lang;
}): Promise<GeminiResult> {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return {
      ok: false,
      code: "not_configured",
      message: "Palm analysis AI is not configured yet.",
    };
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const prompt = `You are Gita AI, a warm and empathetic palmistry guide. Analyse this palm photo in a traditional palmistry style: life line, head line, heart line, fate line and mounts where visible. Begin by briefly noting this is an interpretive, traditional reading — not scientifically validated and not medical or financial advice. Be encouraging, never fear-inducing. If the image is not a clear palm, politely say so and ask for a clearer photo. Reply in ${LANG_NAME[params.language]} in about 180–260 words.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: params.mimeType,
                    data: params.base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
        signal: AbortSignal.timeout(45000),
      }
    );

    if (res.status === 429) {
      return {
        ok: false,
        code: "quota",
        message: "AI quota reached. Please try again shortly.",
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        code: "invalid",
        message:
          "Palm analysis failed. Please try again with a clearer photo.",
      };
    }

    const data = await res.json();

    const text: unknown = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("");

    if (typeof text !== "string" || !text.trim()) {
      return {
        ok: false,
        code: "invalid",
        message: "No reading could be generated. Try another photo.",
      };
    }

    return { ok: true, text: text.trim() };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Could not reach the AI service. Please retry.",
    };
  }
}

/**
 * Honest offline fallback used ONLY when Gemini is unreachable/unconfigured.
 * It is grounded strictly in the calculated chart — and clearly labelled
 * "offline guidance" in the UI. It never pretends to be a live AI answer.
 */
export function offlineGuidance(params: {
  message: string;
  language: Lang;
  chart: KundliChart | null;
  userName?: string | null;
}): string {
  const { language, chart } = params;
  const name = params.userName?.split(" ")[0] || "";
  const msg = params.message.toLowerCase();

  const topic =
    /love|marriage|partner|relation|प्यार|प्रेम|शादी|विवाह|pyaar|shaadi|rishta/.test(
      msg
    )
      ? "love"
      : /career|job|business|नौकरी|करियर|व्यापार|naukri|kaam/.test(msg)
        ? "career"
        : /money|finance|invest|पैसा|धन|paisa|dhan/.test(msg)
          ? "money"
          : /health|सेहत|स्वास्थ्य|sehat|swasthya/.test(msg)
            ? "health"
            : /family|home|परिवार|घर|parivar|ghar/.test(msg)
              ? "family"
              : "general";

  const c = chart;
  const sign = c ? c.moonSign.rashiName : null;
  const dasha = c?.currentDasha?.maha.lord ?? null;

  const T: Record<Lang, Record<string, string>> = {
    en: {
      base: `${name ? name + ", " : ""}I'm currently in offline guidance mode, so this reflection comes from your calculated chart rather than a live AI conversation. `,
      chart: sign
        ? `Your Moon rests in ${sign}${dasha ? ` and you are walking through the ${dasha} Mahadasha` : ""}. `
        : "Share your birth details in onboarding so I can ground guidance in your own chart. ",
      love: "In matters of the heart, this period favours honest, patient communication over dramatic gestures. Let closeness grow through small consistent acts of care.",
      career: "For work, steady effort compounds now more than sudden leaps. Choose one priority and give it your full attention this week.",
      money: "With finances, favour clarity over speculation — review your commitments before making new ones. Astrology offers reflection, never a guarantee.",
      health: "For wellbeing, gentle routine — sleep, hydration, movement — supports you most. For any medical concern, please consult a qualified professional.",
      family: "At home, a calm conversation can untangle what silence has knotted. Listen first; warmth will do the rest.",
      general: "This is a moment to move gently and trust steady progress. One small, intentional step today is worth more than a perfect plan tomorrow.",
    },
    hi: {
      base: `${name ? name + " जी, " : ""}मैं अभी ऑफ़लाइन मार्गदर्शन मोड में हूँ, इसलिए यह विचार लाइव AI बातचीत के बजाय आपकी गणना की गई कुंडली पर आधारित है। `,
      chart: sign
        ? `आपका चंद्रमा ${sign} राशि में है${dasha ? ` और अभी ${dasha} महादशा चल रही है` : ""}। `
        : "अपनी कुंडली आधारित सलाह के लिए ऑनबोर्डिंग में जन्म विवरण भरें। ",
      love: "प्रेम के मामलों में यह समय दिखावे से अधिक ईमानदार, धैर्यपूर्ण संवाद का है। छोटे-छोटे स्नेहपूर्ण कर्म निकटता बढ़ाते हैं।",
      career: "कार्यक्षेत्र में अचानक छलांग से अधिक निरंतर प्रयास फल देगा। इस सप्ताह एक प्राथमिकता चुनकर उसे पूरा समर्पण दें।",
      money: "आर्थिक मामलों में अनुमान से अधिक स्पष्टता चुनें — नई प्रतिबद्धता से पहले पुरानी समीक्षा करें। ज्योतिष चिंतन देता है, गारंटी नहीं।",
      health: "स्वास्थ्य के लिए नींद, जल और हल्का व्यायाम सबसे उपयोगी हैं। किसी भी चिकित्सकीय चिंता हेतु योग्य डॉक्टर से अवश्य मिलें।",
      family: "घर में एक शांत संवाद उन गाँठों को खोल सकता है जिन्हें मौन ने बाँधा है। पहले सुनिए, बाकी स्नेह संभाल लेगा।",
      general: "यह समय धीरे चलने और स्थिर प्रगति पर भरोसा करने का है। आज का एक छोटा सचेत कदम, कल की परिपूर्ण योजना से बड़ा है।",
    },
    hinglish: {
      base: `${name ? name + ", " : ""}Main abhi offline guidance mode mein hoon, isliye yeh reflection live AI conversation ki jagah aapki calculated kundli par based hai. `,
      chart: sign
        ? `Aapka Chandrama ${sign} rashi mein hai${dasha ? ` aur abhi ${dasha} Mahadasha chal rahi hai` : ""}. `
        : "Apni kundli-based guidance ke liye onboarding mein birth details bhariye. ",
      love: "Dil ke maamlon mein abhi honest aur patient baat-cheet, bade gestures se zyada kaam karegi. Chhote caring acts se nazdeekiyaan badhti hain.",
      career: "Career mein sudden leaps se zyada steady effort compound hoga. Is week ek priority chuniye aur poora focus dijiye.",
      money: "Paison ke maamle mein speculation se pehle clarity — nayi commitments se pehle purani review kijiye. Astrology reflection deti hai, guarantee nahi.",
      health: "Sehat ke liye neend, hydration aur halka movement sabse zyada support karega. Kisi bhi medical concern ke liye qualified doctor se miliye.",
      family: "Ghar mein ek shaant conversation woh suljha sakti hai jo khamoshi ne uljhaya hai. Pehle suniye, baaki warmth sambhal legi.",
      general: "Yeh samay dheere chalne aur steady progress par bharosa karne ka hai. Aaj ka ek chhota intentional step, kal ke perfect plan se bada hai.",
    },
  };

  const t = T[language] ?? T.en;
  return t.base + t.chart + (t[topic] ?? t.general);
}
