// app/profile/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Camera, ChevronDown, Home, MessageCircle, Sun, User } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function ProfilePage() {
  const { lang, me } = useApp();
  
  const [name, setName] = useState(me?.user?.name || "Sanni kumar");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("2026-11-10");
  const [time, setTime] = useState("14:25");
  const [place, setPlace] = useState("");

  // 🔥 10 Language Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { title: "प्रोफाइल एडिट करें", selectAvatar: "अपना अवतार चुनें", name: "नाम", gender: "लिंग", dob: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान", cityPlaceholder: "शहर का नाम", save: "प्रोफाइल सेव करें", male: "पुरुष", female: "महिला", other: "अन्य", home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल" },
      hinglish: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile" },
      en: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile" },
      te: { title: "ప్రొఫైల్ సవరించండి", selectAvatar: "మీ అవతార్ను ఎంచుకోండి", name: "పేరు", gender: "లింగం", dob: "పుట్టిన తేదీ", time: "పుట్టిన సమయం", place: "పుట్టిన స్థలం", cityPlaceholder: "నగరం పేరు", save: "ప్రొఫైల్ సేవ్ చేయండి", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్" },
      ta: { title: "சுயவிவரத்தைத் திருத்து", selectAvatar: "உங்கள் அவதாரைத் தேர்ந்தெடுக்கவும்", name: "பெயர்", gender: "பாலினம்", dob: "பிறந்த தேதி", time: "பிறந்த நேரம்", place: "பிறந்த இடம்", cityPlaceholder: "நகரத்தின் பெயர்", save: "சுயவிவரத்தைச் சேமி", male: "ஆண்", female: "பெண்", other: "மற்றவை", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்" },
      kn: { title: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", selectAvatar: "ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ", name: "ಹೆಸರು", gender: "ಲಿಂಗ", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", time: "ಹುಟ್ಟಿದ ಸಮಯ", place: "ಹುಟ್ಟಿದ ಸ್ಥಳ", cityPlaceholder: "ನಗರದ ಹೆಸರು", save: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್" },
      bn: { title: "প্রোফাইল সম্পাদনা করুন", selectAvatar: "আপনার অবতার চয়ন করুন", name: "নাম", gender: "লিঙ্গ", dob: "জন্ম তারিখ", time: "জন্মের সময়", place: "জন্মস্থান", cityPlaceholder: "শহরের নাম", save: "প্রোফাইল সংরক্ষণ করুন", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল" },
      mr: { title: "प्रोफाइल संपादित करा", selectAvatar: "तुमचा अवतार निवडा", name: "नाव", gender: "लिंग", dob: "जन्म तारीख", time: "जन्म वेळ", place: "जन्म ठिकाण", cityPlaceholder: "शहराचे नाव", save: "प्रोफाइल जतन करा", male: "पुरुष", female: "स्त्री", other: "इतर", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल" },
      gu: { title: "પ્રોફાઇલ સંપાદિત કરો", selectAvatar: "તમારો અવતાર પસંદ કરો", name: "નામ", gender: "લિંગ", dob: "જન્મ તારીખ", time: "જન્મ સમય", place: "જન્મ સ્થળ", cityPlaceholder: "શહેરનું નામ", save: "પ્રોફાઇલ સાચવો", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ" },
      ml: { title: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", selectAvatar: "നിങ്ങളുടെ അവതാർ തിരഞ്ഞെടുക്കുക", name: "പേര്", gender: "ലിംഗഭേദം", dob: "ജനനത്തീയതി", time: "ജനനസമയം", place: "ജനനസ്ഥലം", cityPlaceholder: "നഗരത്തിന്റെ പേര്", save: "പ്രൊഫൈൽ സേവ് ചെയ്യുക", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവ", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ" },
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key];
  };

  const handleSave = () => {
    alert(t("save"));
  };

  return (
    // 🔥 Premium Dark Theme Background
    <main className="min-h-[100dvh] w-full bg-[#0A0F19] text-slate-100 font-sans pb-28">
      
      <div className="max-w-lg mx-auto w-full px-4 pt-6 space-y-6">
        
        {/* HEADER (Matching Settings Page Premium Look) */}
        <header className="bg-[#151d2c] rounded-2xl flex items-center p-3 border border-slate-800 shadow-md">
          <Link href="/settings" className="p-2 rounded-full bg-[#0A0F19] text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[15px] font-bold text-[#ff6b00] ml-4 tracking-wider uppercase">{t("title")}</h1>
        </header>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-[#FBBF24] flex items-center justify-center overflow-hidden border-4 border-[#151d2c] shadow-xl">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sanni&backgroundColor=FBBF24" alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-[#151d2c] border-2 border-[#0A0F19] flex items-center justify-center cursor-pointer shadow-lg">
              <Camera size={18} className="text-slate-300" />
            </div>
          </div>
          <p className="text-[12px] font-bold text-slate-400 mt-4 tracking-wide">{t("selectAvatar")}</p>
        </div>

        {/* FORM SECTION (Premium Cards & Inputs) */}
        <div className="bg-[#151d2c] rounded-2xl p-5 border border-slate-800 space-y-5 w-full shadow-lg">
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("name")}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[15px] font-medium text-white focus:outline-none focus:border-[#ff6b00] transition-colors" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("gender")}</label>
            <div className="relative">
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[15px] font-medium text-white appearance-none focus:outline-none focus:border-[#ff6b00] transition-colors"
              >
                <option value="Male">{t("male")}</option>
                <option value="Female">{t("female")}</option>
                <option value="Other">{t("other")}</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("dob")}</label>
              <input 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[14px] font-medium text-white focus:outline-none focus:border-[#ff6b00] transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("time")}</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[14px] font-medium text-white focus:outline-none focus:border-[#ff6b00] transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("place")}</label>
            <input 
              type="text" 
              placeholder={t("cityPlaceholder")} 
              value={place} 
              onChange={(e) => setPlace(e.target.value)} 
              className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[15px] font-medium text-white focus:outline-none focus:border-[#ff6b00] transition-colors" 
            />
          </div>

          <button 
            onClick={handleSave} 
            className="w-full mt-2 bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-bold py-4 rounded-xl text-[15px] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
          >
            {t("save")}
          </button>
        </div>
      </div>

      {/* 🔥 BOTTOM NAVIGATION BAR (Fixed & Premium) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f19] border-t border-slate-800 flex justify-around items-center pt-2.5 pb-5 px-2 w-full">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
          <Home size={22} />
          <span className="text-[11px] font-medium">{t("home")}</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
          <MessageCircle size={22} />
          <span className="text-[11px] font-medium">{t("chat")}</span>
        </Link>
        <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
          <Sun size={22} />
          <span className="text-[11px] font-medium">{t("daily")}</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-[#ff6b00]">
          <User size={22} strokeWidth={2.5} />
          <span className="text-[11px] font-bold">{t("profile")}</span>
        </Link>
      </nav>

    </main>
  );
}