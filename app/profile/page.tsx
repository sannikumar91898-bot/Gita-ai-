// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Camera, X, CheckCircle2, Home, MessageCircle, Sun, User } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// Zodiac Avatars List
const AVATARS = [
  { id: "aries-f", name: "Aries", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AriesFemale&backgroundColor=FFD700" },
  { id: "aries-m", name: "Aries", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AriesMale&backgroundColor=FFD700" },
  { id: "taurus-f", name: "Taurus", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=TaurusFemale&backgroundColor=FFD700" },
  { id: "taurus-m", name: "Taurus", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=TaurusMale&backgroundColor=FFD700" },
  { id: "gemini-f", name: "Gemini", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=GeminiFemale&backgroundColor=FFD700" },
  { id: "gemini-m", name: "Gemini", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=GeminiMale&backgroundColor=FFD700" },
  { id: "cancer-f", name: "Cancer", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CancerFemale&backgroundColor=FFD700" },
  { id: "cancer-m", name: "Cancer", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CancerMale&backgroundColor=FFD700" },
  { id: "leo-f", name: "Leo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeoFemale&backgroundColor=FFD700" },
  { id: "leo-m", name: "Leo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeoMale&backgroundColor=FFD700" },
  { id: "virgo-f", name: "Virgo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=VirgoFemale&backgroundColor=FFD700" },
  { id: "virgo-m", name: "Virgo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=VirgoMale&backgroundColor=FFD700" },
  { id: "libra-f", name: "Libra", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LibraFemale&backgroundColor=FFD700" },
  { id: "libra-m", name: "Libra", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LibraMale&backgroundColor=FFD700" },
  { id: "scorpio-f", name: "Scorpio", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=ScorpioFemale&backgroundColor=FFD700" },
  { id: "scorpio-m", name: "Scorpio", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=ScorpioMale&backgroundColor=FFD700" },
  { id: "sagittarius-f", name: "Sagittarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=SagittariusFemale&backgroundColor=FFD700" },
  { id: "sagittarius-m", name: "Sagittarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=SagittariusMale&backgroundColor=FFD700" },
  { id: "capricorn-f", name: "Capricorn", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CapricornFemale&backgroundColor=FFD700" },
  { id: "capricorn-m", name: "Capricorn", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CapricornMale&backgroundColor=FFD700" },
  { id: "aquarius-f", name: "Aquarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AquariusFemale&backgroundColor=FFD700" },
  { id: "aquarius-m", name: "Aquarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AquariusMale&backgroundColor=FFD700" },
  { id: "pisces-f", name: "Pisces", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=PiscesFemale&backgroundColor=FFD700" },
  { id: "pisces-m", name: "Pisces", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=PiscesMale&backgroundColor=FFD700" },
];

export default function ProfilePage() {
  const { me, loading, lang, theme } = useApp();
  
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].img);
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");

  // 🔥 10 Language Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { title: "प्रोफाइल एडिट करें", selectAvatar: "अपना अवतार चुनें", name: "नाम", gender: "लिंग", dob: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान", cityPlaceholder: "शहर का नाम", save: "प्रोफाइल सेव करें", male: "पुरुष", female: "महिला", other: "अन्य", home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल", successMsg: "प्रोफाइल सफलतापूर्वक सेव हो गई!", changePic: "प्रोफाइल पिक्चर बदलें", selectLib: "लाइब्रेरी से चुनें" },
      hinglish: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", successMsg: "Profile saved successfully!", changePic: "Change Profile Pic", selectLib: "Select from Library" },
      en: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", successMsg: "Profile saved successfully!", changePic: "Change Profile Pic", selectLib: "Select from Library" },
      te: { title: "ప్రొఫైల్ సవరించండి", selectAvatar: "మీ అవతార్ను ఎంచుకోండి", name: "పేరు", gender: "లింగం", dob: "పుట్టిన తేదీ", time: "పుట్టిన సమయం", place: "పుట్టిన స్థలం", cityPlaceholder: "నగరం పేరు", save: "ప్రొఫైల్ సేవ్ చేయండి", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", successMsg: "ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!", changePic: "ప్రొఫైల్ చిత్రాన్ని మార్చండి", selectLib: "లైబ్రరీ నుండి ఎంచుకోండి" },
      ta: { title: "சுயவிவரத்தைத் திருத்து", selectAvatar: "உங்கள் அவதாரைத் தேர்ந்தெடுக்கவும்", name: "பெயர்", gender: "பாலினம்", dob: "பிறந்த தேதி", time: "பிறந்த நேரம்", place: "பிறந்த இடம்", cityPlaceholder: "நகரத்தின் பெயர்", save: "சுயவிவரத்தைச் சேமி", male: "ஆண்", female: "பெண்", other: "மற்றவை", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", successMsg: "சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!", changePic: "சுயவிவரப் படத்தை மாற்று", selectLib: "நூலகத்திலிருந்து தேர்ந்தெடுக்கவும்" },
      kn: { title: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", selectAvatar: "ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ", name: "ಹೆಸರು", gender: "ಲಿಂಗ", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", time: "ಹುಟ್ಟಿದ ಸಮಯ", place: "ಹುಟ್ಟಿದ ಸ್ಥಳ", cityPlaceholder: "ನಗರದ ಹೆಸರು", save: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", successMsg: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!", changePic: "ಪ್ರೊಫೈಲ್ ಚಿತ್ರವನ್ನು ಬದಲಿಸಿ", selectLib: "ಲೈಬ್ರರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ" },
      bn: { title: "প্রোফাইল সম্পাদনা করুন", selectAvatar: "আপনার অবতার চয়ন করুন", name: "নাম", gender: "লিঙ্গ", dob: "জন্ম তারিখ", time: "জন্মের সময়", place: "জন্মস্থান", cityPlaceholder: "শহরের নাম", save: "প্রোফাইল সংরক্ষণ করুন", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", successMsg: "প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!", changePic: "প্রোফাইল ছবি পরিবর্তন করুন", selectLib: "লাইব্রেরি থেকে চয়ন করুন" },
      mr: { title: "प्रोफाइल संपादित करा", selectAvatar: "तुमचा अवतार निवडा", name: "नाव", gender: "लिंग", dob: "जन्म तारीख", time: "जन्म वेळ", place: "जन्म ठिकाण", cityPlaceholder: "शहराचे नाव", save: "प्रोफाइल जतन करा", male: "पुरुष", female: "स्त्री", other: "इतर", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", successMsg: "प्रोफाइल यशस्वीरित्या जतन केले!", changePic: "प्रोफाइल चित्र बदला", selectLib: "लायब्ररीमधून निवडा" },
      gu: { title: "પ્રોફાઇલ સંપાદિત કરો", selectAvatar: "તમારો અવતાર પસંદ કરો", name: "નામ", gender: "લિંગ", dob: "જન્મ તારીખ", time: "જન્મ સમય", place: "જન્મ સ્થળ", cityPlaceholder: "શહેરનું નામ", save: "પ્રોફાઇલ સાચવો", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", successMsg: "પ્રોફાઇલ સફળતાપૂર્વક સાચવવામાં આવી!", changePic: "પ્રોફાઇલ ચિત્ર બદલો", selectLib: "લાઇબ્રેરીમાંથી પસંદ કરો" },
      ml: { title: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", selectAvatar: "നിങ്ങളുടെ അവതാർ തിരഞ്ഞെടുക്കുക", name: "പേര്", gender: "ലിംഗഭേദം", dob: "ജനനത്തീയതി", time: "ജനനസമയം", place: "ജനനസ്ഥലം", cityPlaceholder: "നഗരത്തിന്റെ പേര്", save: "പ്രൊഫൈൽ സേവ് ചെയ്യുക", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവ", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", successMsg: "പ്രൊഫൈൽ വിജയകരമായി സേവ് ചെയ്തു!", changePic: "പ്രൊഫൈൽ ചിത്രം മാറ്റുക", selectLib: "ലൈബ്രറിയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക" }
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key];
  };

  // Load saved data
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("gita_profile_name");
      const savedAvatar = localStorage.getItem("gita_profile_avatar");
      const savedDob = localStorage.getItem("gita_profile_dob");
      const savedTob = localStorage.getItem("gita_profile_tob");
      const savedPlace = localStorage.getItem("gita_profile_place");
      const savedGender = localStorage.getItem("gita_profile_gender");

      if (savedName) setName(savedName);
      else if (me?.user?.name) setName(me.user.name); 
      
      if (savedAvatar) setSelectedAvatar(savedAvatar);
      if (savedDob) setDob(savedDob);
      if (savedTob) setTob(savedTob);
      if (savedPlace) setPlace(savedPlace);
      if (savedGender) setGender(savedGender);
    } catch (e) {}
  }, [me]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to local storage
    try {
      localStorage.setItem("gita_profile_name", name);
      localStorage.setItem("gita_profile_avatar", selectedAvatar);
      localStorage.setItem("gita_profile_dob", dob);
      localStorage.setItem("gita_profile_tob", tob);
      localStorage.setItem("gita_profile_place", place);
      localStorage.setItem("gita_profile_gender", gender);
    } catch (err) {}

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <main className="min-h-[100dvh] w-full bg-[#0A0F19] text-slate-100 font-sans pb-28">
      
      <div className="max-w-lg mx-auto w-full px-4 pt-6 space-y-6">
        
        {/* HEADER */}
        <header className="bg-[#151d2c] rounded-2xl flex items-center p-3 border border-slate-800 shadow-md">
          <Link href="/settings" className="p-2 rounded-full bg-[#0A0F19] text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[15px] font-bold text-[#ff6b00] ml-4 tracking-wider uppercase">
            {loading ? "Loading..." : (name ? t("title") : t("title"))}
          </h1>
        </header>

        {/* AVATAR SECTION */}
        <section className="flex flex-col items-center justify-center pt-2">
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#151d2c] bg-[#FBBF24] shadow-xl">
              <img src={selectedAvatar} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              className="absolute bottom-0 right-0 rounded-full bg-[#151d2c] border-2 border-[#0A0F19] p-2.5 text-slate-300 shadow-lg transition hover:bg-[#1f2937]"
            >
              <Camera size={18} />
            </button>
          </div>
          <p className="mt-4 text-[12px] font-bold text-slate-400 tracking-wide uppercase">
            {t("selectAvatar")}
          </p>
        </section>

        {/* BIRTH DETAILS FORM */}
        <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-5 bg-[#151d2c] border border-slate-800 shadow-lg">
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("name")}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[15px] font-medium text-white focus:outline-none focus:border-[#ff6b00] transition-colors" 
              placeholder={t("name")} 
              required 
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
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("time")}</label>
              <input 
                type="time" 
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full bg-[#0A0F19] border border-slate-700 rounded-xl px-4 py-3.5 text-[14px] font-medium text-white focus:outline-none focus:border-[#ff6b00] transition-colors" 
                required 
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

          <button type="submit" className="w-full mt-2 bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-bold py-4 rounded-xl text-[15px] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
            {t("save")}
          </button>

          {success && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 p-3 text-[13px] font-bold text-green-400 mt-4 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} />
              {t("successMsg")}
            </div>
          )}
        </form>
      </div>

      {/* 🔥 PREMIUM AVATAR PICKER MODAL (Dark Theme) */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-[#151d2c] border border-slate-800 shadow-2xl animate-in zoom-in-95">
            
            <div className="border-b border-slate-800 px-5 py-4 text-center flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-white flex-1 text-left">{t("changePic")}</h2>
              <button onClick={() => setPickerOpen(false)} className="p-2 rounded-full bg-[#0A0F19] text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p className="mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("selectLib")}</p>
              
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(avatar.img);
                      setPickerOpen(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 group p-1.5 rounded-2xl transition ${
                      selectedAvatar === avatar.img 
                        ? "bg-[#ff6b00]/20 border border-[#ff6b00]/50" 
                        : "border border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-transparent bg-[#FBBF24] transition group-hover:scale-105">
                      <img src={avatar.img} alt={avatar.name} className="h-full w-full object-cover" />
                    </div>
                    <span className={`text-[10px] font-semibold truncate w-full text-center ${
                      selectedAvatar === avatar.img ? "text-[#ff6b00]" : "text-slate-400"
                    }`}>
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 BOTTOM NAVIGATION BAR (WAPAS JODA GAYA HAI) 🔥 */}
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