"use client";

import React, { useState } from "react";

interface ProfileForm {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

export default function CompatibilityPage() {
  const [bride, setBride] = useState<ProfileForm>({ name: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "" });
  const [groom, setGroom] = useState<ProfileForm>({ name: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "" });
  const [language, setLanguage] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const validateForm = (data: ProfileForm) => {
    return data.name.trim().length >= 2 && data.dateOfBirth && data.timeOfBirth && data.placeOfBirth.trim().length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // सख्त फ़ॉर्म वैलिडेशन चेक
    if (!validateForm(bride) || !validateForm(groom)) {
      setError("कृपया वधू और वर दोनों का पूरा विवरण (नाम, जन्म तारीख, समय और स्थान) सही से भरें।");
      return;
    }

    setLoading(true);
    try {
      // आपके न्यू API कॉन्ट्रैक्ट के मुताबिक व्यक्ति1 और व्यक्ति2 का डेटा भेजना
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1: bride,
          person2: groom,
          language
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "गणना पूरी नहीं हो सकी।");
      } else {
        setResult(data.report);
      }
    } catch (err) {
      console.error("Calculation drop error:", err);
      setError("सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">✨ अष्टकूट कुंडली मिलान (Guna Milan)</h1>
          <p className="text-xs sm:text-sm text-gray-500">वर और वधू के जन्म विवरण के आधार पर सटीक पारंपरिक मिलान गणना</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* वधू का विवरण (Bride Form Block) */}
            <div className="bg-pink-50/30 p-5 rounded-2xl border border-pink-100/50 space-y-4">
              <h3 className="text-sm font-black text-pink-700 flex items-center">🙋‍♀️ वधू का विवरण (Bride)</h3>
              <div className="space-y-3">
                <input type="text" placeholder="नाम लिखें" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={bride.name} onChange={(e) => setBride({ ...bride, name: e.target.value })} />
                <input type="date" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={bride.dateOfBirth} onChange={(e) => setBride({ ...bride, dateOfBirth: e.target.value })} />
                <input type="time" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={bride.timeOfBirth} onChange={(e) => setBride({ ...bride, timeOfBirth: e.target.value })} />
                <input type="text" placeholder="जन्म स्थान (शहर/राज्य)" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={bride.placeOfBirth} onChange={(e) => setBride({ ...bride, placeOfBirth: e.target.value })} />
              </div>
            </div>

            {/* वर का विवरण (Groom Form Block) */}
            <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50 space-y-4">
              <h3 className="text-sm font-black text-blue-700 flex items-center">🙋‍♂️ वर का विवरण (Groom)</h3>
              <div className="space-y-3">
                <input type="text" placeholder="नाम लिखें" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={groom.name} onChange={(e) => set開room => setGroom({ ...groom, name: e.target.value })} />
                <input type="date" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={groom.dateOfBirth} onChange={(e) => setGroom({ ...groom, dateOfBirth: e.target.value })} />
                <input type="time" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={groom.timeOfBirth} onChange={(e) => setGroom({ ...groom, timeOfBirth: e.target.value })} />
                <input type="text" placeholder="जन्म स्थान (शहर/राज्य)" className="w-full text-xs p-3 border border-gray-200 rounded-xl outline-none" value={groom.placeOfBirth} onChange={(e) => setGroom({ ...groom, placeOfBirth: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-gray-600">भाषा चुनें (Language):</label>
              <select className="text-xs p-2 bg-white border border-gray-200 rounded-xl outline-none" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="hinglish">Hinglish</option>
                <option value="en">English</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
              {loading ? "कुंडली मिलान की गणना जारी है..." : "🚀 महा मिलान गणना शुरू करें"}
            </button>
          </div>
        </form>

        {error && <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-4 rounded-xl text-center font-medium">{error}</div>}

        {/* परिणाम का ब्लॉक (Dynamic Result View Block) */}
        {result && (
          <div className="bg-white border border-orange-100 rounded-3xl p-5 sm:p-8 shadow-xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl border border-orange-100/50">
              <div>
                <h2 className="text-base sm:text-lg font-black text-gray-900">मिलान परिणाम: {result.verdict}</h2>
                <p className="text-[10px] text-gray-500 font-medium">विधि: पारंपरिक अष्टकूट गुण मिलान प्रणाली</p>
              </div>
              <div className="text-center bg-gradient-to-br from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl shadow-inner">
                <p className="text-[9px] uppercase font-bold tracking-wider opacity-80">कुल गुण</p>
                <p className="text-xl font-black">{result.score} <span className="text-xs font-normal">/ 36</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">🔮 गीता द्वारा कुंडली व्याख्या (Gita's Prediction)</h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-gray-50/50 border border-gray-100 p-4 rounded-2xl">
                {result.explanation}
              </p>
            </div>

            <div className="space-y-3 bg-amber-50/40 border border-amber-100/60 p-4 rounded-2xl">
              <h4 className="text-xs font-black text-amber-800 flex items-center">🛠️ अचूक वैदिक उपाय (Remedies)</h4>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{result.remedy}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
