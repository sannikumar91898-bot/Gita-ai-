// app/matching/page.tsx
"use client";

import { useState } from "react";
import { MessageCircle, TriangleAlert } from "lucide-react";

export default function MatchingPage() {
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [isHindi, setIsHindi] = useState(false);
  const [isHinglish, setIsHinglish] = useState(true);
  const [result, setResult] = useState<{ score: number; verdict: string } | null>(null);

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const handleMatch = () => {
    if (!p1Name.trim() || !p2Name.trim()) return;

    const combinedLength = p1Name.trim().length + p2Name.trim().length;

    const scoresPool = [
      36, 48, 56, 64, 72, 78, 84, 88, 92, 96, 68, 74,
      82, 86, 90, 94, 52, 60, 66, 70, 76, 80, 98, 44,
      58, 62, 54, 42, 38, 34, 32, 28, 88, 96, 92, 84,
    ];
    const finalScore = scoresPool[combinedLength % scoresPool.length];

    let finalVerdict = "";
    if (finalScore >= 85) {
      finalVerdict = t(
        "बहुत सुंदर मिलान है — बस एक बार हमारी महिला ज्योतिषियों में से किसी एक से चैट कर लें, वो प्यार से आपके रिश्ते की छिपी बातें समझा देंगी।",
        "Bahut sundar milan hai — bas ek baar hamari Mahila Jyotishiyon mein se kisi ek se chat kar lein, wo pyaar se aapke rishte ki chhipi baatein samjha dengi.",
        "A beautiful match — just chat once with one of our Female Astrologers, she will lovingly explain the hidden aspects of your relationship."
      );
    } else if (finalScore >= 65) {
      finalVerdict = t(
        "अच्छा मिलान है — पर पूरा भरोसा तब होगा जब हमारी महिला ज्योतिषियों में से किसी एक से एक बार चैट कर लें। वो प्यार से सब समझा देंगी।",
        "Achha milan hai — par poora bharosa tab hoga jab hamari Mahila Jyotishiyon mein se kisi ek se chat kar lein. Wo pyaar se sab samjha dengi.",
        "A good match — but full clarity comes when you chat once with one of our Female Astrologers. She explains everything with love."
      );
    } else {
      finalVerdict = t(
        "थोड़ा ध्यान देने वाला मिलान है — घबराएं नहीं, बस हमारी महिला ज्योतिषियों में से किसी एक से प्यार से चैट कर लें, वो सही मार्गदर्शन देंगी।",
        "Thoda dhyan dene wala milan hai — ghabrayein nahi, bas hamari Mahila Jyotishiyon mein se kisi ek se pyaar se chat kar lein, wo sahi margdarshan dengi.",
        "A match that needs gentle attention — don't worry, just chat lovingly with one of our Female Astrologers, she will guide you right."
      );
    }

    setResult({ score: finalScore, verdict: finalVerdict });
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-rose-50 to-white px-5 pb-32 pt-6 text-violet-950">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">
          {t(
            "कुंडली मिलान — हमारी महिला ज्योतिषियों से प्यार भरा परामर्श",
            "Kundli Milan — Hamari Mahila Jyotishiyon se pyaar bhara paramarsh",
            "Kundli Matching — Loving Guidance from our Female Astrologers"
          )}
        </h1>
        <p className="flex items-start gap-2 rounded-lg bg-rose-100 p-3 text-sm font-medium text-rose-700">
          <TriangleAlert size={18} className="shrink-0 text-rose-600 mt-0.5" />
          {t(
            "🌸 रिश्ता जीवन का सबसे सुंदर हिस्सा है — इसे समझने के लिए एक बार हमारी महिला ज्योतिषियों से दिल से चैट करें। देरी संकट ला सकती है।",
            "🌸 Rishta jeevan ka sabse sundar hissa hai — ise samajhne ke liye ek baar hamari Mahila Jyotishiyon se dil se chat karein. Deri sankat la sakti hai.",
            "🌸 A relationship is life's most beautiful part — chat once from the heart with one of our Female Astrologers to understand it fully. Delay can bring crisis."
          )}
        </p>

        <input
          value={p1Name}
          onChange={(e) => setP1Name(e.target.value)}
          placeholder={t("वर का नाम", "Var ka naam", "Groom's name")}
          className="w-full rounded-lg border border-violet-300 px-4 py-2"
        />
        <input
          value={p2Name}
          onChange={(e) => setP2Name(e.target.value)}
          placeholder={t("वधू का नाम", "Vadhu ka naam", "Bride's name")}
          className="w-full rounded-lg border border-violet-300 px-4 py-2"
        />

        <div className="flex gap-2 text-sm">
          <button
            onClick={() => { setIsHindi(true); setIsHinglish(false); }}
            className={`rounded border px-3 py-1 ${isHindi ? "bg-violet-600 text-white" : "border-violet-300"}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => { setIsHindi(false); setIsHinglish(true); }}
            className={`rounded border px-3 py-1 ${isHinglish ? "bg-violet-600 text-white" : "border-violet-300"}`}
          >
            Hinglish
          </button>
          <button
            onClick={() => { setIsHindi(false); setIsHinglish(false); }}
            className={`rounded border px-3 py-1 ${!isHindi && !isHinglish ? "bg-violet-600 text-white" : "border-violet-300"}`}
          >
            English
          </button>
        </div>

        <button
          onClick={handleMatch}
          className="w-full rounded-lg bg-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-600/30"
        >
          {t("मिलान करें", "Milan karein", "Match Now")}
        </button>

        {result && (
          <div className="rounded-lg border border-rose-300 bg-white p-4 shadow">
            <p className="text-lg font-bold">
              {t("स्कोर", "Score", "Score")}: {result.score}%
            </p>
            <p className="mt-1 text-sm text-rose-700">{result.verdict}</p>
          </div>
        )}
      </div>

      <a
        href="sms:+919999999999"
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-rose-700 px-4 py-4 text-center font-bold text-white shadow-2xl"
      >
        <MessageCircle size={18} />
        {t(
          "हमारी महिला ज्योतिषियों में से किसी एक से दिल से चैट करें — वो प्यार से सब समझा देंगी",
          "Hamari Mahila Jyotishiyon mein se kisi ek se dil se chat karein — wo pyaar se sab samjha dengi",
          "Chat with one of our Female Astrologers — she explains everything with love"
        )}
      </a>
    </main>
  );
}