// app/chat/page.tsx
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Send, Sparkles, Plus, Wallet, X, Copy, Check, Menu, Heart, ImageIcon, Lock, ChevronLeft, Search, User, Calendar, Clock, MapPin, UserPlus } from "lucide-react";

import { useApp } from "../Providers";
import HistorySidebar from "../components/HistorySidebar";
import { LANGUAGES, type Lang } from "../../i18n"; 

type Message = { id: string; role: "user" | "assistant"; content: string; image?: string };
type Draft = { name: string; dob: string; time: string; place: string; gender: string };

const EMPTY_DRAFT: Draft = { name: "", dob: "", time: "", place: "", gender: "" };

const getPersonaDetails = (p: string) => {
  switch (p) {
    case "kriti": return { name: "Acharya Kriti", img: "/astrologers/kriti.jpg" };
    case "devaki": return { name: "Dr. Devaki Shastri", img: "/astrologers/devaki.jpg" };
    case "gargi": return { name: "Gargi Maa", img: "/astrologers/gargi.jpg" };
    default: return { name: "Gita", img: "/astrologers/riya.jpg" }; 
  }
};

function ChatPageContent() {
  const { lang, setLanguage, me, refresh, loading, sessionError, theme, t } = useApp();
  const searchParams = useSearchParams();

  const [persona, setPersona] = useState("gita");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  // Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardStep, setOnboardStep] = useState(0); 
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [notSureTime, setNotSureTime] = useState(false);
  const [hasConsent, setHasConsent] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  // 🔥 MODAL STATES
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false); // Agar wallet logic yahan hai

  const conversationId = useRef("");
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isDark = theme === "dark";
  const personaDetails = getPersonaDetails(persona);

  // 🔥 10 LANGUAGES FOR REGISTER MODAL
  const getModalText = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { title: "रजिस्टर करना ज़रूरी है", desc: "चैट शुरू करने के लिए कृपया अपना अकाउंट रजिस्टर या लॉगिन करें। आपकी बेसिक जानकारी पहले से सुरक्षित है।", btn: "रजिस्टर / लॉगिन करें", cancel: "रद्द करें" },
      hinglish: { title: "Registration Required", desc: "Chat shuru karne ke liye kripya apna account register ya login karein. Aapki basic details pehle se safe hain.", btn: "Register / Login Now", cancel: "Cancel" },
      en: { title: "Registration Required", desc: "Please register or login to start chatting. Your basic details are already saved.", btn: "Register / Login Now", cancel: "Cancel" },
      te: { title: "నమోదు అవసరం", desc: "చాట్ ప్రారంభించడానికి దయచేసి మీ ఖాతాను నమోదు చేయండి లేదా లాగిన్ చేయండి.", btn: "నమోదు చేయండి / లాగిన్", cancel: "రద్దు చేయండి" },
      ta: { title: "பதிவு தேவை", desc: "அரட்டையைத் தொடங்க உங்கள் கணக்கைப் பதிவு செய்யவும் அல்லது உள்நுழையவும்.", btn: "பதிவு / உள்நுழை", cancel: "ரத்து செய்" },
      kn: { title: "ನೋಂದಣಿ ಅಗತ್ಯವಿದೆ", desc: "ಚಾಟ್ ಪ್ರಾರಂಭಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ.", btn: "ನೋಂದಾಯಿಸಿ / ಲಾಗಿನ್", cancel: "ರದ್ದುಮಾಡಿ" },
      bn: { title: "নিবন্ধন প্রয়োজন", desc: "চ্যাট শুরু করতে অনুগ্রহ করে আপনার অ্যাকাউন্ট নিবন্ধন বা লগইন করুন।", btn: "নিবন্ধন / লগইন", cancel: "বাতিল করুন" },
      mr: { title: "नोंदणी आवश्यक आहे", desc: "चॅट सुरू करण्यासाठी कृपया तुमचे खाते नोंदवा किंवा लॉग इन करा.", btn: "नोंदणी / लॉग इन", cancel: "रद्द करा" },
      gu: { title: "નોંધણી જરૂરી છે", desc: "ચેટ શરૂ કરવા માટે કૃપા કરીને તમારું એકાઉન્ટ નોંધો અથવા લોગિન કરો.", btn: "નોંધણી / લોગિન", cancel: "રદ કરો" },
      ml: { title: "രജിസ്ട്രേഷൻ ആവശ്യമാണ്", desc: "ചാറ്റ് ആരംഭിക്കാൻ ദയവായി നിങ്ങളുടെ അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യുക അല്ലെങ്കിൽ ലോഗിൻ ചെയ്യുക.", btn: "രജിസ്റ്റർ / ലോഗിൻ", cancel: "റദ്ദാക്കുക" },
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key];
  };

  useEffect(() => {
    if (me?.birth?.name) {
      setShowOnboarding(false);
      setDraft({ 
        name: me.birth.name, 
        dob: me.birth.dob, 
        time: me.birth.birthTime, 
        place: me.birth.birthPlace,
        gender: me.birth.gender || "Not specified"
      });
      setHistoryLoading(false);
    } else {
      setShowOnboarding(true);
      setOnboardStep(0);
    }
  }, [me]);

  const handleNextStep = () => {
    if (onboardStep === 0) { setOnboardStep(1); } 
    else if (onboardStep === 1) { if(draft.name.length < 2) return; setOnboardStep(2); }
    else if (onboardStep === 2) { if(!draft.gender) return; setOnboardStep(3); }
    else if (onboardStep === 3) { if(!draft.dob) return; setOnboardStep(4); }
    else if (onboardStep === 4) { if(!draft.time && !notSureTime) return; setOnboardStep(5); }
  };

  const finishOnboarding = async (isRegistering: boolean) => {
    if (draft.place.length < 2 || !hasConsent) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/kundli", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          name: draft.name, 
          gender: draft.gender,
          dateOfBirth: draft.dob, 
          timeOfBirth: notSureTime ? "12:00" : draft.time, 
          isTimeUnknown: notSureTime, 
          placeOfBirth: draft.place,
          consent: hasConsent,
          isRegistering: isRegistering 
        }) 
      });
      
      if (!response.ok) throw new Error("Failed");
      await refresh(); 
      
      if (!isRegistering) {
        localStorage.setItem("is_guest_user", "true");
      } else {
        localStorage.removeItem("is_guest_user");
      }

      setShowOnboarding(false);
    } catch (error) {
      alert("Details save nahi ho payi. Kripya check karein.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showOnboarding || loading || !me?.user) return;
    setHistoryLoading(true); setMessages([]); conversationId.current = "";
    fetch(`/api/chat?persona=${persona}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.messages) && data.messages.length > 0) setMessages(data.messages);
        if (data.conversationId) conversationId.current = data.conversationId;
      }).catch(console.error).finally(() => setHistoryLoading(false));
  }, [persona, loading, me?.user, showOnboarding]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading, imagePreview]);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file); setImagePreview(URL.createObjectURL(file));
  };

  async function sendToAi(e?: FormEvent, text?: string) {
    e?.preventDefault();
    
    // 🔥 GUEST CHECK: Yahan alert hata kar Modal open kar rahe hain
    if (typeof window !== "undefined" && localStorage.getItem("is_guest_user") === "true") {
      setShowRegisterModal(true);
      return; 
    }

    const msg = text || input.trim();
    if ((!msg && !selectedImage) || isLoading) return;
    
    setInput(""); setIsLoading(true);
    const tempImage = imagePreview;
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "user", content: msg || "Photo", image: tempImage || undefined }]);
    const imgFile = selectedImage;
    setSelectedImage(null); setImagePreview(null);

    try {
      const formData = new FormData();
      formData.append("message", msg); formData.append("language", lang); formData.append("persona", persona);
      if (conversationId.current) formData.append("conversationId", conversationId.current);
      if (imgFile) formData.append("image", imgFile);

      const response = await fetch("/api/chat", { method: "POST", body: formData });
      const data = await response.json();

      if (response.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (!response.ok) {
        const errorMsg = data.error || data.message || "Server error. Please try again.";
        throw new Error(errorMsg);
      }
      
      if (data.message) {
        setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: data.message.content }]);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Network error. Please try again.";
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: errMsg }]);
    } finally { setIsLoading(false); }
  }

  if (loading) return <div className={`h-[100dvh] flex items-center justify-center ${isDark ? "bg-[#0B0F19]" : "bg-[#FEF8EF]"}`}><Sparkles className="animate-spin text-yellow-500" size={40} /></div>;

  // ==========================================
  // 🔥 PREMIUM ONBOARDING UI
  // ==========================================
  if (showOnboarding) {
    return (
      <div className={`min-h-[100dvh] w-full flex flex-col px-5 py-6 transition-colors duration-300 ${isDark ? "bg-[#0B0F19] text-white" : "bg-[#FEF8EF] text-gray-900"}`}>
        
        <div className="w-full max-w-md mx-auto flex items-center gap-4 mb-8">
          {onboardStep > 0 && (
            <button onClick={() => setOnboardStep(onboardStep - 1)} className={`p-2.5 rounded-full ${isDark ? "bg-slate-800" : "bg-white shadow-sm"}`}>
              <ChevronLeft size={22} />
            </button>
          )}
          <h1 className="text-2xl font-black">{t("enterDetails") || "Enter Your Details"}</h1>
        </div>

        <div className="w-full max-w-md mx-auto flex gap-2 mb-10">
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              onboardStep >= s 
                ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30 scale-105" 
                : isDark ? "bg-slate-800 text-slate-500" : "bg-white text-gray-400 shadow-sm"
            }`}>
               {s === 0 && <Sparkles size={18} />}
               {s === 1 && <User size={18} />}
               {s === 2 && <Heart size={18} />}
               {s === 3 && <Calendar size={18} />}
               {s === 4 && <Clock size={18} />}
               {s === 5 && <MapPin size={18} />}
            </div>
          ))}
        </div>

        <div className="w-full max-w-md mx-auto flex-1">
          
          {onboardStep === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black mb-6">{t("chooseLanguage") || "Choose your language"}</h2>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => setLanguage(l.code)} 
                    className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                      lang === l.code 
                        ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]" 
                        : isDark ? "border-slate-700 bg-slate-800 hover:border-slate-500" : "border-gray-200 bg-white shadow-sm hover:border-yellow-200"
                    }`}>
                    <span className="block font-bold text-[16px] mb-1">{l.native}</span>
                    <span className={`text-[12px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>{l.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleNextStep} disabled={!lang} className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[16px] disabled:opacity-50 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform">
                {t("next") || "Next"}
              </button>
            </div>
          )}

          {onboardStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-2">{t("heyThere") || "Hey there!"}</h2>
              <p className={`text-[15px] mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("yourName") || "What is your name?"}</p>
              <input autoFocus value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} placeholder="Enter your full name" 
                className={`w-full p-5 rounded-2xl border-2 outline-none text-lg mb-6 transition-colors ${
                  isDark ? "bg-slate-800 border-slate-700 text-white focus:border-yellow-400" : "bg-white border-gray-200 text-black focus:border-yellow-400 shadow-sm"
                }`} />
              <button onClick={handleNextStep} disabled={draft.name.length < 2} className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[16px] disabled:opacity-50 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform">{t("next") || "Next"}</button>
            </div>
          )}

          {onboardStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-6">{t("yourGender") || "What is your gender?"}</h2>
              <div className="flex justify-between gap-3 mb-8">
                {["Male", "Female", "Transgender"].map((g) => (
                  <button key={g} onClick={() => setDraft({...draft, gender: g})} 
                    className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-3xl border-2 transition-all duration-200 ${
                      draft.gender === g 
                        ? "border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]" 
                        : isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-white shadow-sm"
                    }`}>
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${draft.gender === g ? "bg-gradient-to-br from-yellow-400 to-amber-500" : isDark ? "bg-slate-700" : "bg-gray-100"}`}>
                      <User size={30} className={draft.gender === g ? "text-black" : (isDark ? "text-slate-400" : "text-gray-400")} />
                    </div>
                    <span className="font-bold text-[13px] text-center">{g}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleNextStep} disabled={!draft.gender} className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[16px] disabled:opacity-50 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform">{t("next") || "Next"}</button>
            </div>
          )}

          {onboardStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <h2 className="text-3xl font-black mb-10">{t("birthDate") || "Enter your birth date"}</h2>
              <input type="date" value={draft.dob} onChange={e => setDraft({...draft, dob: e.target.value})} 
                className={`w-full text-center text-3xl font-black bg-transparent outline-none mb-10 py-4 border-b-2 ${
                  isDark ? "text-white border-slate-700 focus:border-yellow-400" : "text-black border-gray-300 focus:border-yellow-400"
                }`} />
              <button onClick={handleNextStep} disabled={!draft.dob} className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[16px] disabled:opacity-50 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform">{t("next") || "Next"}</button>
            </div>
          )}

          {onboardStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <h2 className="text-3xl font-black mb-10">{t("birthTime") || "Enter your birth time"}</h2>
              <input type="time" value={draft.time} onChange={e => setDraft({...draft, time: e.target.value})} disabled={notSureTime}
                className={`w-full text-center text-3xl font-black bg-transparent outline-none mb-6 py-4 border-b-2 disabled:opacity-30 ${
                  isDark ? "text-white border-slate-700 focus:border-yellow-400" : "text-black border-gray-300 focus:border-yellow-400"
                }`} />
              
              <label className={`flex items-center justify-center gap-3 mb-10 cursor-pointer p-4 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-white"}`}>
                <input type="checkbox" checked={notSureTime} onChange={e => setNotSureTime(e.target.checked)} className="w-5 h-5 accent-yellow-500 rounded" />
                <span className={`text-[14px] font-medium ${isDark ? "text-slate-300" : "text-gray-600"}`}>{t("unknownTime") || "Don't know my exact time of birth"}</span>
              </label>
              <button onClick={handleNextStep} disabled={!draft.time && !notSureTime} className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[16px] disabled:opacity-50 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform">{t("next") || "Next"}</button>
            </div>
          )}

          {onboardStep === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-black mb-6">{t("birthPlace") || "Where were you born?"}</h2>
              <div className="relative mb-6">
                <input autoFocus value={draft.place} onChange={e => setDraft({...draft, place: e.target.value})} placeholder={t("searchPlace") || "Search city (e.g. Patna, Bihar)"} 
                  className={`w-full p-5 pl-12 rounded-2xl border-2 outline-none text-[16px] transition-colors ${
                    isDark ? "bg-slate-800 border-slate-700 text-white focus:border-yellow-400" : "bg-white border-gray-200 text-black focus:border-yellow-400 shadow-sm"
                  }`} />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              </div>
              
              <label className={`flex items-start gap-3 mb-8 cursor-pointer p-4 rounded-2xl border ${isDark ? "border-slate-700 bg-slate-800/50" : "border-gray-200 bg-white shadow-sm"}`}>
                <input type="checkbox" checked={hasConsent} onChange={e => setHasConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-yellow-500 rounded" />
                <span className={`text-[13px] font-medium text-left leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  {t("consent") || "I consent to storing my birth details securely to generate my personal kundli and readings."}
                </span>
              </label>

              <div className="flex flex-col gap-3">
                <button onClick={() => finishOnboarding(true)} disabled={draft.place.length < 2 || !hasConsent || isLoading} className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[16px] disabled:opacity-50 shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex justify-center items-center gap-2">
                  {isLoading ? <Sparkles className="animate-spin" size={22} /> : (
                    <><User size={20} /> Register & Start Chat</>
                  )}
                </button>
                
                <button onClick={() => finishOnboarding(false)} disabled={draft.place.length < 2 || !hasConsent || isLoading} className={`w-full py-3.5 rounded-xl font-bold text-[14px] border disabled:opacity-50 active:scale-95 transition-transform ${isDark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"}`}>
                  Save Details (Continue as Admin/Guest)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 💬 CHAT UI 
  // ==========================================
  return (
    <div className={`flex h-[100dvh] w-full flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0B0F19]" : "bg-[#FEF8EF]"}`}>
      
      <HistorySidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentConversationId={conversationId.current} 
        onSelectChat={(id) => { conversationId.current = id; setMessages([]); setSidebarOpen(false); }} 
        onNewChat={() => { conversationId.current = ""; setMessages([]); setSidebarOpen(false); }} 
      />

      {/* HEADER (Cut off part fixed here) */}
      <header className={`flex shrink-0 items-center justify-between border-b px-4 py-3 shadow-sm z-10 ${isDark ? "bg-[#151E2E]/95 backdrop-blur-md border-slate-800" : "bg-white/95 backdrop-blur-md border-orange-100"}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
            <Menu size={22} className={isDark ? "text-white" : "text-black"} />
          </button>
          <div className="relative">
            <div className={`h-11 w-11 rounded-full overflow-hidden border-2 shadow-sm ${isDark ? "border-yellow-500" : "border-yellow-400"}`}>
              <img src={personaDetails.img} alt="Astro" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Gita&background=ffd700&color=fff'; }} />
            </div>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </div>
          <div>
            <h1 className={`text-[16px] font-black ${isDark ? "text-white" : "text-black"}`}>{personaDetails.name}</h1>
            <p className="text-[11px] text-emerald-500 font-bold">● Online</p>
          </div>
        </div>
        
        <Link href="/wallet" className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-bold border transition-colors ${
          isDark ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
        }`}>
          <Wallet size={14} /> ₹{(me?.user?.walletBalancePaise ?? 0) / 100}
        </Link>
      </header>

      {/* CHAT MESSAGES */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-24 ${isDark ? "bg-[#0B0F19]" : "bg-[#FEF8EF]"}`}>
        {historyLoading ? (
           <div className={`text-center py-10 flex flex-col items-center gap-2 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            <Sparkles className="animate-spin text-yellow-500" size={28} /> 
            <span className="text-[14px] font-medium">Loading history...</span>
           </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-1 shadow-sm border border-slate-700">
                    <img src={personaDetails.img} alt="Astro" className="h-full w-full object-cover" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-[1.3rem] px-5 py-4 text-[15.5px] leading-relaxed shadow-md ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black rounded-tr-sm font-medium" 
                    : isDark ? "bg-[#151E2E] text-slate-200 border border-slate-800 rounded-tl-sm" : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                }`}>
                  {message.image && (
                    <div className="mb-3 overflow-hidden rounded-xl border border-black/10">
                      <img src={message.image} alt="User upload" className="max-w-[250px] max-h-[300px] object-cover w-full" />
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start w-full max-w-4xl mx-auto">
             <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-1 shadow-sm border border-slate-700">
                <img src={personaDetails.img} alt="Astro" className="h-full w-full object-cover" />
             </div>
            <div className={`rounded-[1.3rem] rounded-tl-sm px-5 py-4 shadow-md flex items-center gap-1.5 ${isDark ? "bg-[#151E2E] border border-slate-800" : "bg-white border border-gray-200"}`}>
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* INPUT AREA */}
      <div className={`shrink-0 p-4 border-t z-20 ${isDark ? "bg-[#0B0F19]/95 backdrop-blur-xl border-slate-800" : "bg-[#FEF8EF]/95 backdrop-blur-xl border-orange-100"}`}>
        <form onSubmit={sendToAi} className="flex flex-col gap-3 w-full max-w-4xl mx-auto">
          
          {imagePreview && (
            <div className="px-2">
              <div className="relative inline-block">
                <img src={imagePreview} alt="Selected" className="h-20 w-20 object-cover rounded-xl border-2 border-yellow-400 shadow-md" />
                <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600">
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          <div className={`flex items-end gap-2 rounded-3xl border p-2 transition-all shadow-lg ${
            isDark ? "bg-[#151E2E] border-slate-700 focus-within:border-yellow-500 focus-within:shadow-yellow-500/10" : "bg-white border-gray-300 focus-within:border-yellow-400 focus-within:shadow-yellow-500/10"
          }`}>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={`p-3.5 rounded-full transition-colors ${isDark ? "text-slate-400 hover:text-yellow-400 hover:bg-slate-800" : "text-gray-500 hover:text-yellow-500 hover:bg-gray-100"}`}>
              <ImageIcon size={22} />
            </button>
            <input type="file" hidden ref={fileInputRef} onChange={handleImageSelect} />
            
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder={t("chatPlaceholder") || "Ask your question..."} 
              className={`flex-1 bg-transparent outline-none text-[15.5px] py-3 px-2 max-h-32 custom-scrollbar ${isDark ? "text-white placeholder-slate-500" : "text-black placeholder-gray-400"}`} 
            />
            
            <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading} className="p-3.5 bg-gradient-to-br from-yellow-400 to-amber-500 text-black rounded-full disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95 transition-all shadow-md">
              <Send size={20} className="ml-0.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 🔥 REGISTRATION REQUIRED MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-[2rem] p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(234,88,12,0.2)] animate-in zoom-in-95 border ${isDark ? "bg-[#151E2E] border-orange-500/30" : "bg-white border-orange-200"}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-5">
              <UserPlus size={40} />
            </div>
            <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{getModalText("title")}</h2>
            <p className={`text-[14px] mb-6 leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              {getModalText("desc")}
            </p>
            <Link href="/login" className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-[15px] font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform mb-4">
              {getModalText("btn")}
            </Link>
            <button onClick={() => setShowRegisterModal(false)} className={`text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 w-full ${isDark ? "text-slate-500 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
              <X size={16} /> {getModalText("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* PAYWALL MODAL (Wallet Recharge) */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-[2rem] p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(234,88,12,0.2)] animate-in zoom-in-95 border ${isDark ? "bg-[#151E2E] border-orange-500/30" : "bg-white border-orange-200"}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-5">
              <Lock size={40} />
            </div>
            <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Balance Exhausted</h2>
            <p className={`text-[14px] mb-6 leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Aapka free message limit ya wallet balance khatam ho gaya hai. {personaDetails.name} se aur baatein karne ke liye recharge karein.
            </p>
            <div className={`rounded-xl p-4 mb-6 flex justify-between items-center border ${isDark ? "bg-[#0B0F19] border-slate-700" : "bg-gray-50 border-gray-200"}`}>
              <span className={`text-[13px] font-semibold ${isDark ? "text-slate-400" : "text-gray-500"}`}>Current Balance</span>
              <span className="text-xl font-black text-rose-400">₹{(me?.user?.walletBalancePaise ?? 0) / 100}</span>
            </div>
            <Link href="/wallet" className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-[15px] font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform mb-4">
              Add Cash Now
            </Link>
            <button onClick={() => setShowPaywall(false)} className={`text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 w-full ${isDark ? "text-slate-500 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>
              <X size={16} /> Maybe Later
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-[100dvh] items-center justify-center bg-[#FEF8EF]"><Sparkles className="animate-spin text-yellow-500" size={40} /></div>}>
      <ChatPageContent />
    </Suspense>
  );
}