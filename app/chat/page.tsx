// app/chat/page.tsx
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Send, Sparkles, Plus, Wallet, X, Copy, Check, Menu, Heart, ImageIcon, Lock, ChevronLeft, Search, User, Calendar, Clock, MapPin } from "lucide-react";

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
    default: return { name: "Gita", img: "/gita-portrait.jpg" }; 
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

  const conversationId = useRef("");
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isDark = theme === "dark";
  const personaDetails = getPersonaDetails(persona);

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
    else if (onboardStep === 5) { if(draft.place.length < 2 || !hasConsent) return; finishOnboarding(); }
  };

  const finishOnboarding = async () => {
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
          consent: hasConsent 
        }) 
      });
      
      if (!response.ok) throw new Error("Kundli failed");
      await refresh(); 
      setShowOnboarding(false);
    } catch (error) {
      alert("Kundli generate nahi ho payi. Kripya details check karein.");
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

  // 🔥 FIXED: Proper Error Handling added here
  async function sendToAi(e?: FormEvent, text?: string) {
    e?.preventDefault();
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

      // 🔥 Agar backend se error aaya (500, 400, 404) toh yahan handle hoga
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

  if (loading) return <div className="h-[100dvh] flex items-center justify-center bg-[#FEF8EF]"><Sparkles className="animate-spin text-yellow-500" size={32} /></div>;

  // ==========================================
  // 🔥 PREMIUM ONBOARDING UI
  // ==========================================
  if (showOnboarding) {
    return (
      <div className={`min-h-[100dvh] flex flex-col px-6 py-8 ${isDark ? "bg-slate-900 text-white" : "bg-[#FEF8EF] text-gray-800"}`}>
        
        <div className="flex items-center gap-4 mb-8">
          {onboardStep > 0 && (
            <button onClick={() => setOnboardStep(onboardStep - 1)} className="p-2 bg-gray-200/50 rounded-full">
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-bold">{t("enterDetails") || "Enter Your Details"}</h1>
        </div>

        <div className="flex gap-2 mb-8">
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${onboardStep >= s ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-400"}`}>
               {s === 0 && <Sparkles size={14} />}
               {s === 1 && <User size={16} />}
               {s === 2 && <Heart size={16} />}
               {s === 3 && <Calendar size={16} />}
               {s === 4 && <Clock size={16} />}
               {s === 5 && <MapPin size={16} />}
            </div>
          ))}
        </div>

        {onboardStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold mb-6">{t("chooseLanguage") || "Choose your language"}</h2>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => { setLanguage(l.code); setOnboardStep(1); }} 
                  className={`p-4 rounded-xl border-2 text-left transition-all ${lang === l.code ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white hover:border-yellow-200"}`}>
                  <span className="block font-bold">{l.native}</span>
                  <span className="text-xs text-gray-500">{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {onboardStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-2">{t("heyThere") || "Hey there!"}</h2>
            <p className="text-gray-500 mb-6">{t("yourName") || "What is your name?"}</p>
            <input autoFocus value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} placeholder="Enter name" 
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white focus:border-yellow-400 outline-none text-lg mb-6 text-black" />
            <button onClick={handleNextStep} disabled={draft.name.length < 2} className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg disabled:opacity-50">{t("next") || "Next"}</button>
          </div>
        )}

        {onboardStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-6">{t("yourGender") || "What is your gender?"}</h2>
            <div className="flex justify-between gap-3 mb-8">
              {["Male", "Female", "Transgender"].map((g) => (
                <button key={g} onClick={() => setDraft({...draft, gender: g})} 
                  className={`flex-1 flex flex-col items-center gap-3 p-3 rounded-2xl border-2 transition-all ${draft.gender === g ? "border-yellow-400 bg-yellow-50" : "border-gray-200 bg-white"}`}>
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${draft.gender === g ? "bg-yellow-400" : "bg-gray-100"}`}>
                    <User size={32} className={draft.gender === g ? "text-black" : "text-gray-400"} />
                  </div>
                  <span className="font-semibold text-xs text-center">{g}</span>
                </button>
              ))}
            </div>
            <button onClick={handleNextStep} disabled={!draft.gender} className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg disabled:opacity-50">{t("next") || "Next"}</button>
          </div>
        )}

        {onboardStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 text-center">
            <h2 className="text-2xl font-bold mb-8">{t("birthDate") || "Enter your birth date"}</h2>
            <input type="date" value={draft.dob} onChange={e => setDraft({...draft, dob: e.target.value})} 
              className="w-full text-center text-3xl font-bold bg-transparent outline-none mb-8 text-black" />
            <button onClick={handleNextStep} disabled={!draft.dob} className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg disabled:opacity-50">{t("next") || "Next"}</button>
          </div>
        )}

        {onboardStep === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 text-center">
            <h2 className="text-2xl font-bold mb-8">{t("birthTime") || "Enter your birth time"}</h2>
            <input type="time" value={draft.time} onChange={e => setDraft({...draft, time: e.target.value})} disabled={notSureTime}
              className="w-full text-center text-3xl font-bold bg-transparent outline-none mb-4 disabled:opacity-30 text-black" />
            
            <label className="flex items-center justify-center gap-2 mb-8 cursor-pointer">
              <input type="checkbox" checked={notSureTime} onChange={e => setNotSureTime(e.target.checked)} className="w-5 h-5 accent-yellow-400" />
              <span className="text-sm text-gray-600">{t("unknownTime") || "Don't know my exact time of birth"}</span>
            </label>
            <button onClick={handleNextStep} disabled={!draft.time && !notSureTime} className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg disabled:opacity-50">{t("next") || "Next"}</button>
          </div>
        )}

        {onboardStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold mb-6">{t("birthPlace") || "Where were you born?"}</h2>
            <div className="relative mb-6">
              <input autoFocus value={draft.place} onChange={e => setDraft({...draft, place: e.target.value})} placeholder={t("searchPlace") || "Search city (e.g. Patna, Bihar)"} 
                className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 bg-white focus:border-yellow-400 outline-none text-lg text-black" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <label className="flex items-start gap-3 mb-8 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
              <input type="checkbox" checked={hasConsent} onChange={e => setHasConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-yellow-400" />
              <span className="text-sm text-gray-600 text-left">
                {t("consent") || "I consent to storing my birth details securely to generate my personal kundli and readings."}
              </span>
            </label>

            <button onClick={handleNextStep} disabled={draft.place.length < 2 || !hasConsent || isLoading} className="w-full py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg disabled:opacity-50 flex justify-center items-center">
              {isLoading ? <Sparkles className="animate-spin" /> : t("startChat") || "Start chat with Astrologer"}
            </button>
          </div>
        )}

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

      <header className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-orange-100"}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2"><Menu size={20} className={isDark ? "text-white" : "text-black"} /></button>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-yellow-400"><img src={personaDetails.img} alt="Astro" className="h-full w-full object-cover" /></div>
          <div>
            <h1 className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}>{personaDetails.name}</h1>
            <p className="text-[10px] text-green-500 font-bold">● Online</p>
          </div>
        </div>
        <Link href="/wallet" className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border ${isDark ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-yellow-50 border-yellow-200 text-yellow-600"}`}>
          <Wallet size={12} /> ₹{(me?.user?.walletBalancePaise ?? 0) / 100}
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {historyLoading ? (
           <div className="text-center py-10 text-gray-400"><Sparkles className="animate-spin mx-auto mb-2" /> Loading history...</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] shadow-sm ${
                message.role === "user" ? "bg-yellow-400 text-black rounded-br-sm" : isDark ? "bg-slate-800 text-white border border-slate-700" : "bg-white text-gray-800 border border-gray-100"
              }`}>
                {message.image && (
                  <div className="mb-2 overflow-hidden rounded-xl border border-black/10">
                    <img src={message.image} alt="User upload" className="max-w-[250px] max-h-[300px] object-cover w-full" />
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && <div className="text-sm text-gray-400 animate-pulse">Astrologer is typing...</div>}
        <div ref={endRef} />
      </div>

      <div className={`shrink-0 p-4 border-t ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
        <form onSubmit={sendToAi} className="flex flex-col gap-2 max-w-xl mx-auto">
          
          {imagePreview && (
            <div className="px-2">
              <div className="relative inline-block">
                <img src={imagePreview} alt="Selected" className="h-16 w-16 object-cover rounded-xl border-2 border-yellow-400 shadow-sm" />
                <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          <div className={`flex items-center gap-2 rounded-full border p-1.5 ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-500 hover:text-yellow-500 transition"><ImageIcon size={20} /></button>
            <input type="file" hidden ref={fileInputRef} onChange={handleImageSelect} />
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={t("chatPlaceholder") || "Ask your question..."} 
              className={`flex-1 bg-transparent outline-none text-[15px] ${isDark ? "text-white placeholder-gray-500" : "text-black placeholder-gray-400"}`} />
            <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading} className="p-3 bg-yellow-400 text-black rounded-full disabled:opacity-50 hover:bg-yellow-500 transition"><Send size={18} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-[100dvh] items-center justify-center bg-[#FEF8EF]"><Sparkles className="animate-spin text-yellow-500" size={32} /></div>}>
      <ChatPageContent />
    </Suspense>
  );
}