// app/profile/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Camera, X, CheckCircle2, Home, MessageCircle, Sun, User, ChevronDown, Loader2, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../../Providers"; 

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

export default function ProfileEditPage() {
  const { me, loading, lang, theme } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].img);
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");

  // 🔥 10 Language Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { title: "प्रोफाइल एडिट करें", selectAvatar: "अपना अवतार चुनें", name: "नाम", gender: "लिंग", dob: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान", cityPlaceholder: "शहर का नाम", save: "प्रोफाइल सेव करें", male: "पुरुष", female: "महिला", other: "अन्य", home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल", successMsg: "प्रोफाइल सफलतापूर्वक सेव हो गई!", changePic: "प्रोफाइल पिक्चर बदलें", selectLib: "लाइब्रेरी से चुनें", saving: "सेव हो रहा है...", kundliNote: "सटीक ज्योतिषीय भविष्यवाणी के लिए सही जन्म विवरण भरें।", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अभी बात करें - पहली चैट FREE", chatBtn: "चैट" },
      hinglish: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", successMsg: "Profile saved successfully!", changePic: "Change Profile Pic", selectLib: "Select from Library", saving: "Saving...", kundliNote: "Enter accurate birth details for precise astrological predictions.", bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat" },
      en: { title: "Edit Profile", selectAvatar: "Select your avatar", name: "Name", gender: "Gender", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", cityPlaceholder: "City name", save: "Save Profile", male: "Male", female: "Female", other: "Other", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", successMsg: "Profile saved successfully!", changePic: "Change Profile Pic", selectLib: "Select from Library", saving: "Saving...", kundliNote: "Enter accurate birth details for precise astrological predictions.", bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat" },
      te: { title: "ప్రొఫైల్ సవరించండి", selectAvatar: "మీ అవతార్‌ను ఎంచుకోండి", name: "పేరు", gender: "లింగం", dob: "పుట్టిన తేదీ", time: "పుట్టిన సమయం", place: "పుట్టిన స్థలం", cityPlaceholder: "నగరం పేరు", save: "ప్రొఫైల్ సేవ్ చేయండి", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", successMsg: "ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!", changePic: "ప్రొఫైల్ చిత్రాన్ని మార్చండి", selectLib: "లైబ్రరీ నుండి ఎంచుకోండి", saving: "సేవ్ అవుతోంది...", kundliNote: "ఖచ్చితమైన జ్యోతిష్య అంచనాల కోసం సరైన పుట్టిన వివరాలను నమోదు చేయండి.", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి - మొదటి చాట్ ఉచితం", chatBtn: "చాట్" },
      ta: { title: "சுயவிவரத்தைத் திருத்து", selectAvatar: "உங்கள் அவதாரைத் தேர்ந்தெடுக்கவும்", name: "பெயர்", gender: "பாலினம்", dob: "பிறந்த தேதி", time: "பிறந்த நேரம்", place: "பிறந்த இடம்", cityPlaceholder: "நகரத்தின் பெயர்", save: "சுயவிவரத்தைச் சேமி", male: "ஆண்", female: "பெண்", other: "மற்றவை", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", successMsg: "சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!", changePic: "சுயவிவரப் படத்தை மாற்று", selectLib: "நூலகத்திலிருந்து தேர்ந்தெடுக்கவும்", saving: "சேமிக்கப்படுகிறது...", kundliNote: "துல்லியமான ஜோதிட கணிப்புகளுக்கு சரியான பிறப்பு விவரங்களை உள்ளிடவும்.", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் - முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை" },
      kn: { title: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", selectAvatar: "ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ", name: "ಹೆಸರು", gender: "ಲಿಂಗ", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", time: "ಹುಟ್ಟಿದ ಸಮಯ", place: "ಹುಟ್ಟಿದ ಸ್ಥಳ", cityPlaceholder: "ನಗರದ ಹೆಸರು", save: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", successMsg: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!", changePic: "ಪ್ರೊಫೈಲ್ ಚಿತ್ರವನ್ನು ಬದಲಾಯಿಸಿ", selectLib: "ಲೈಬ್ರರಿಯಿಂದ ಆಯ್ಕೆಮಾಡಿ", saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...", kundliNote: "ನಿಖರವಾದ ಜ್ಯೋತಿಷ್ಯ ಮುನ್ಸೂಚನೆಗಳಿಗಾಗಿ ಸರಿಯಾದ ಜನ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ - ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್" },
      bn: { title: "প্রোফাইল সম্পাদনা করুন", selectAvatar: "আপনার অবতার চয়ন করুন", name: "নাম", gender: "লিঙ্গ", dob: "জন্ম তারিখ", time: "জন্মের সময়", place: "জন্মস্থান", cityPlaceholder: "শহরের নাম", save: "প্রোফাইল সংরক্ষণ করুন", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", successMsg: "প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!", changePic: "প্রোফাইল ছবি পরিবর্তন করুন", selectLib: "লাইব্রেরি থেকে চয়ন করুন", saving: "সংরক্ষণ করা হচ্ছে...", kundliNote: "সঠিক জ্যোতিষশাস্ত্রীয় ভবিষ্যদ্বাণীর জন্য সঠিক জন্ম বিবরণ লিখুন।", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন - প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট" },
      mr: { title: "प्रोफाइल संपादित करा", selectAvatar: "तुमचा अवतार निवडा", name: "नाव", gender: "लिंग", dob: "जन्म तारीख", time: "जन्म वेळ", place: "जन्म ठिकाण", cityPlaceholder: "शहराचे नाव", save: "प्रोफाइल जतन करा", male: "पुरुष", female: "स्त्री", other: "इतर", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", successMsg: "प्रोफाइल यशस्वीरित्या जतन केले!", changePic: "प्रोफाइल चित्र बदला", selectLib: "लायब्ररीमधून निवडा", saving: "जतन करत आहे...", kundliNote: "अचूक ज्योतिष अंदाजासाठी अचूक जन्म तपशील प्रविष्ट करा.", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला - पहिली चॅट मोफत", chatBtn: "चॅट" },
      gu: { title: "પ્રોફાઇલ સંપાદિત કરો", selectAvatar: "તમારો અવતાર પસંદ કરો", name: "નામ", gender: "લિંગ", dob: "જન્મ તારીખ", time: "જન્મ સમય", place: "જન્મ સ્થળ", cityPlaceholder: "શહેરનું નામ", save: "પ્રોફાઇલ સાચવો", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", successMsg: "પ્રોફાઇલ સફળતાપૂર્વક સાચવવામાં આવી!", changePic: "પ્રોફાઇલ ચિત્ર બદલો", selectLib: "લાઇબ્રેરીમાંથી પસંદ કરો", saving: "સાચવી રહ્યું છે...", kundliNote: "સચોટ જ્યોતિષીય આગાહીઓ માટે સચોટ જન્મ વિગતો દાખલ કરો.", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો - પ્રથમ ચેટ મફત", chatBtn: "ચેટ" },
      ml: { title: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", selectAvatar: "നിങ്ങളുടെ അവതാർ തിരഞ്ഞെടുക്കുക", name: "പേര്", gender: "ലിംഗഭേദം", dob: "ജനനത്തീയതി", time: "ജനന സമയം", place: "ജനനസ്ഥലം", cityPlaceholder: "നഗരത്തിന്റെ പേര്", save: "പ്രൊഫൈൽ സേവ് ചെയ്യുക", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവ", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", successMsg: "പ്രൊഫൈൽ വിജയകരമായി സേവ് ചെയ്തു!", changePic: "പ്രൊഫൈൽ ചിത്രം മാറ്റുക", selectLib: "ലൈബ്രറിയിൽ നിന്ന് തിരഞ്ഞെടുക്കുക", saving: "സേവ് ചെയ്യുന്നു...", kundliNote: "കൃത്യമായ ജ്യോതിഷ ട്രെൻഡുകൾക്കായി ശരിയായ ജനന വിവരങ്ങൾ നൽകുക.", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക - ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്" },
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key] || dict["hi"][key];
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      localStorage.setItem("gita_profile_name", name);
      localStorage.setItem("gita_profile_avatar", selectedAvatar);
      localStorage.setItem("gita_profile_dob", dob);
      localStorage.setItem("gita_profile_tob", tob);
      localStorage.setItem("gita_profile_place", place);
      localStorage.setItem("gita_profile_gender", gender);

      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Error saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔥 Theme Variables
  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "bg-[#151d2c] border-slate-800" : "bg-white border-orange-100 shadow-sm";
  const inputClass = isDark ? "bg-[#0A0F19] border-slate-700 text-white focus:border-[#ff6b00]" : "bg-gray-50 border-gray-200 text-black focus:border-[#ff6b00]";
  const textMutedClass = isDark ? "text-slate-400" : "text-gray-500";
  const textHighlightClass = isDark ? "text-white" : "text-gray-900";

  return (
    <main className={`min-h-[100dvh] w-full font-sans pb-36 transition-colors duration-300 ${pageClass}`}>
      
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        
        {/* HEADER */}
        <header className={`rounded-2xl flex items-center p-4 border shadow-md ${cardClass}`}>
          <Link href="/profile" className={`p-2.5 rounded-full transition-colors ${isDark ? "bg-[#0A0F19] text-slate-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-black"}`}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[17px] font-bold text-[#ff6b00] ml-4 tracking-wide">
            {loading ? "Loading..." : t("title")}
          </h1>
        </header>

        {/* AVATAR SECTION */}
        <section className="flex flex-col items-center justify-center pt-2">
          <div className="relative">
            <div className={`h-36 w-36 overflow-hidden rounded-full border-4 shadow-xl ${isDark ? "border-[#151d2c]" : "border-white"} bg-[#FBBF24]`}>
              <img src={selectedAvatar} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              type="button"
              className={`absolute bottom-0 right-0 rounded-full border-2 p-3 shadow-lg transition hover:bg-[#1f2937] ${isDark ? "bg-[#151d2c] border-[#0A0F19] text-slate-300" : "bg-white border-gray-100 text-gray-600"}`}
            >
              <Camera size={20} />
            </button>
          </div>
          <p className={`mt-4 text-[13px] font-bold tracking-wide uppercase ${textMutedClass}`}>
            {t("selectAvatar")}
          </p>
        </section>

        {/* FORM SECTION */}
        <form onSubmit={handleSubmit} className={`rounded-3xl p-5 sm:p-7 space-y-5 border shadow-lg ${cardClass}`}>
          
          <div className="space-y-2.5">
            <label className={`text-[12px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t("name")}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded-xl px-5 py-4 text-[15px] font-medium focus:outline-none transition-colors ${inputClass}`} 
              placeholder={t("name")} 
              required 
            />
          </div>

          <div className="space-y-2.5">
            <label className={`text-[12px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t("gender")}</label>
            <div className="relative">
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full border rounded-xl px-5 py-4 text-[15px] font-medium appearance-none focus:outline-none transition-colors ${inputClass}`}
              >
                <option value="Male">{t("male")}</option>
                <option value="Female">{t("female")}</option>
                <option value="Other">{t("other")}</option>
              </select>
              <ChevronDown size={20} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${textMutedClass}`} />
            </div>
          </div>

          {/* 🔥 PSYCHOLOGY: Encouraging user to fill accurate data for better AI reading */}
          <div className={`p-3 rounded-xl flex items-start gap-2 ${isDark ? "bg-orange-500/10 text-orange-200" : "bg-orange-50 text-orange-700"}`}>
            <Sparkles size={16} className="shrink-0 mt-0.5 text-orange-500" />
            <p className="text-[11px] font-medium leading-relaxed">{t("kundliNote")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t("dob")}</label>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full border rounded-xl px-4 py-4 text-[14px] font-medium focus:outline-none transition-colors ${inputClass}`} 
                required 
              />
            </div>
            <div className="space-y-2.5">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t("time")}</label>
              <input 
                type="time" 
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className={`w-full border rounded-xl px-4 py-4 text-[14px] font-medium focus:outline-none transition-colors ${inputClass}`} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className={`text-[12px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t("place")}</label>
            <input 
              type="text" 
              placeholder={t("cityPlaceholder")} 
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className={`w-full border rounded-xl px-5 py-4 text-[15px] font-medium focus:outline-none transition-colors ${inputClass}`} 
            />
          </div>

          {/* 🔥 PREMIUM SAVE BUTTON WITH LOADING SPINNER */}
          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full mt-4 bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-bold py-4 rounded-xl text-[16px] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </button>

          {success && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 p-3.5 text-[13px] font-bold text-green-500 mt-4 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} />
              {t("successMsg")}
            </div>
          )}
        </form>
      </div>

      {/* AVATAR PICKER MODAL */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl animate-in zoom-in-95 ${cardClass}`}>
            
            <div className={`border-b px-5 py-4 text-center flex items-center justify-between ${isDark ? "border-slate-800" : "border-gray-200"}`}>
              <h2 className={`text-[16px] font-bold flex-1 text-left ${textHighlightClass}`}>{t("changePic")}</h2>
              <button type="button" onClick={() => setPickerOpen(false)} className={`p-2 rounded-full transition-colors ${isDark ? "bg-[#0A0F19] text-slate-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-black"}`}>
                <X size={18} />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p className={`mb-4 text-[11px] font-bold uppercase tracking-wider ${textMutedClass}`}>{t("selectLib")}</p>
              
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(avatar.img);
                      setPickerOpen(false);
                    }}
                    className={`relative rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${selectedAvatar === avatar.img ? "border-[#ff6b00] shadow-md shadow-orange-500/30" : "border-transparent opacity-80 hover:opacity-100"}`}
                  >
                    <img src={avatar.img} alt={avatar.name} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 STICKY BOTTOM BANNER & NAVIGATION (Wapas Joda Gaya Hai) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        
        {/* Pink Banner */}
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full border border-white/50 flex items-center justify-center shrink-0 bg-white/10">
               <Crown size={16} className="text-white" />
             </div>
             <div>
               <p className="text-[11px] font-bold text-white leading-tight">{t("bannerTitle")}</p>
               <p className="text-[13px] font-extrabold text-white leading-tight">{t("bannerSub")}</p>
             </div>
          </div>
          <Link href="/chat/gita" className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="currentColor" />
          </Link>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className={`flex justify-around border-t py-2.5 ${isDark ? "border-slate-800 bg-[#0A0F19]/95" : "border-amber-100 bg-white/95"} backdrop-blur`}>
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Home size={18} /><span className="text-[9.5px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <MessageCircle size={18} /><span className="text-[9.5px] font-bold">{t("chatBtn")}</span>
          </Link>
          <Link href="/daily" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Sun size={18} /><span className="text-[9.5px] font-bold">{t("daily")}</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-[#ff6b00]" : "text-[#ff6b00]"}`}>
            <User size={18} /><span className="text-[9.5px] font-bold">{t("profile")}</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}