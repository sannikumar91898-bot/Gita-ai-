"use client";

import { useState } from "react";
import { ArrowLeft, Camera, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function ProfilePage() {
  const { lang, me } = useApp();
  
  const [name, setName] = useState(me?.user?.name || "Sanni kumar");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("2026-11-10");
  const [time, setTime] = useState("14:25");
  const [place, setPlace] = useState("");

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { title: "प्रोफाइल एडिट करें", selectAvatar: "अपना अवतार चुनें", name: "नाम", gender: "लिंग", dob: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान", cityPlaceholder: "शहर का नाम", save: "प्रोफाइल सेव करें", male: "पुरुष", female: "महिला", other: "अन्य" },
      hinglish: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other" },
      en: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other" },
      te: { title: "ప్రొఫైల్ సవరించండి", selectAvatar: "మీ అవతార్ను ఎంచుకోండి", name: "పేరు", gender: "లింగం", dob: "పుట్టిన తేదీ", time: "పుట్టిన సమయం", place: "పుట్టిన స్థలం", cityPlaceholder: "నగరం పేరు", save: "ప్రొఫైల్ సేవ్ చేయండి", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర" },
      ta: { title: "சுயவிவரத்தைத் திருத்து", selectAvatar: "உங்கள் அவதாரைத் தேர்ந்தெடுக்கவும்", name: "பெயர்", gender: "பாலினம்", dob: "பிறந்த தேதி", time: "பிறந்த நேரம்", place: "பிறந்த இடம்", cityPlaceholder: "நகரத்தின் பெயர்", save: "சுயவிவரத்தைச் சேமி", male: "ஆண்", female: "பெண்", other: "மற்றவை" },
      kn: { title: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", selectAvatar: "ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ", name: "ಹೆಸರು", gender: "ಲಿಂಗ", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", time: "ಹುಟ್ಟಿದ ಸಮಯ", place: "ಹುಟ್ಟಿದ ಸ್ಥಳ", cityPlaceholder: "ನಗರದ ಹೆಸರು", save: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ" },
      bn: { title: "প্রোফাইল সম্পাদনা করুন", selectAvatar: "আপনার অবতার চয়ন করুন", name: "নাম", gender: "লিঙ্গ", dob: "জন্ম তারিখ", time: "জন্মের সময়", place: "জন্মস্থান", cityPlaceholder: "শহরের নাম", save: "প্রোফাইল সংরক্ষণ করুন", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য" },
      mr: { title: "प्रोफाइल संपादित करा", selectAvatar: "तुमचा अवतार निवडा", name: "नाव", gender: "लिंग", dob: "जन्म तारीख", time: "जन्म वेळ", place: "जन्म ठिकाण", cityPlaceholder: "शहराचे नाव", save: "प्रोफाइल जतन करा", male: "पुरुष", female: "स्त्री", other: "इतर" },
      gu: { title: "પ્રોફાઇલ સંપાદિત કરો", selectAvatar: "તમારો અવતાર પસંદ કરો", name: "નામ", gender: "લિંગ", dob: "જન્મ તારીખ", time: "જન્મ સમય", place: "જન્મ સ્થળ", cityPlaceholder: "શહેરનું નામ", save: "પ્રોફાઇલ સાચવો", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય" },
      ml: { title: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", selectAvatar: "നിങ്ങളുടെ അവതാർ തിരഞ്ഞെടുക്കുക", name: "പേര്", gender: "ലിംഗഭേദം", dob: "ജനനത്തീയതി", time: "ജനനസമയം", place: "ജനനസ്ഥലം", cityPlaceholder: "നഗരത്തിന്റെ പേര്", save: "പ്രൊഫൈൽ സേവ് ചെയ്യുക", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവ" },
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key];
  };

  const handleSave = () => {
    alert(t("save"));
  };

  return (
    // 🔥 px-2 kiya gaya hai taaki full width le
    <main className="min-h-screen w-full bg-[#070b14] text-slate-100 font-sans pb-10 px-2">
      
      <header className="flex items-center gap-4 px-2 py-4 w-full">
        <Link href="/settings" className="p-2 rounded-full bg-[#151d2c] text-slate-300 hover:bg-[#1f2937]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-[17px] font-bold">{t("title")}</h1>
      </header>

      <div className="w-full space-y-6">
        
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-[#FBBF24] flex items-center justify-center overflow-hidden border-4 border-[#070b14] shadow-lg">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sanni&backgroundColor=FBBF24" alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#151d2c] border-2 border-[#070b14] flex items-center justify-center cursor-pointer">
              <Camera size={16} className="text-slate-300" />
            </div>
          </div>
          <p className="text-[12px] text-slate-400 mt-3 font-medium">{t("selectAvatar")}</p>
        </div>

        <div className="bg-[#0c111b] rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 w-full">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">{t("name")}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#151d2c] border border-slate-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#ff6b00]" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">{t("gender")}</label>
            <div className="relative">
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-[#151d2c] border border-slate-700 rounded-xl px-4 py-3 text-[14px] text-white appearance-none focus:outline-none focus:border-[#ff6b00]">
                <option value="Male">{t("male")}</option>
                <option value="Female">{t("female")}</option>
                <option value="Other">{t("other")}</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">{t("dob")}</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-[#151d2c] border border-slate-700 rounded-xl px-3 py-3 text-[13px] text-white focus:outline-none focus:border-[#ff6b00]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">{t("time")}</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#151d2c] border border-slate-700 rounded-xl px-3 py-3 text-[13px] text-white focus:outline-none focus:border-[#ff6b00]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">{t("place")}</label>
            <input type="text" placeholder={t("cityPlaceholder")} value={place} onChange={(e) => setPlace(e.target.value)} className="w-full bg-[#151d2c] border border-slate-700 rounded-xl px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#ff6b00]" />
          </div>

          <button onClick={handleSave} className="w-full mt-2 bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-bold py-3.5 rounded-xl text-[14px] shadow-lg active:scale-95 transition-transform">
            {t("save")}
          </button>
        </div>
      </div>
    </main>
  );
}