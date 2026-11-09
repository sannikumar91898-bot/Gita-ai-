// app/chat/page.tsx
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Send, Sparkles, Plus, Wallet, X, Copy, Check, Menu, Heart, Image as ImageIcon, Lock } from "lucide-react";

import { useApp } from "../Providers";
import HistorySidebar from "../components/HistorySidebar";

type Message = { id: string; role: "user" | "assistant"; content: string; image?: string };
type Step = "language" | "name" | "dob" | "time" | "place" | "done";
type Draft = { name: string; dob: string; time: string; place: string };
type PublicChart = { lagna: { rashiNameHi: string; degreeInSign: number }; moonSign: { rashiNameHi: string }; nakshatra: { name: string; pada: number }; currentDasha: { maha: string } | null; };

const EMPTY_DRAFT: Draft = { name: "", dob: "", time: "", place: "" };

const getPersonaDetails = (p: string) => {
  switch (p) {
    case "kriti": return { name: "Acharya Kriti", img: "/astrologers/kriti.jpg" };
    case "devaki": return { name: "Dr. Devaki Shastri", img: "/astrologers/devaki.jpg" };
    case "gargi": return { name: "Gargi Maa", img: "/astrologers/gargi.jpg" };
    default: return { name: "Gita", img: "/astrologers/gita.jpg" };
  }
};

function looksLikeQuestion(text: string): boolean {
  if (/[?？]/.test(text)) return true;
  if (text.trim().split(/\s+/).length > 8) return true;
  return /क्या|कैसे|क्यों|कब|कहाँ|कौन|what|why|how|when|where|who|kaise|kya|kyun|kab|exam|career|नौकरी|शादी|भविष्य/i.test(text);
}

function parseDate(value: string): string | null {
  const text = value.trim();
  let match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) return text;
  match = text.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (!match) return null;
  const day = match[1].padStart(2, "0"); const month = match[2].padStart(2, "0");
  return match[3] + "-" + month + "-" + day;
}

function parseTime(value: string): string | null {
  const text = value.trim().toLowerCase();
  const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;
  let hour = Number(match[1]); const minute = Number(match[2] || "0"); const suffix = match[3];
  if (minute > 59 || hour > 23) return null;
  if (suffix === "pm" && hour < 12) hour += 12;
  if (suffix === "am" && hour === 12) hour = 0;
  if (!suffix && hour > 23) return null;
  return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
}

function questionFor(step: Step, lang: "en" | "hi" | "hinglish", name: string): string {
  const hi: Record<Step, string> = { language: `नमस्ते, मैं ${name} हूँ। आप हिंदी, Hinglish या English में बात करना चाहेंगे?`, name: "आपका नाम क्या है?", dob: "जन्म तिथि लिखें, जैसे 15/08/1990।", time: "जन्म का समय लिखें, जैसे 08:30 AM।", place: "जन्म स्थान लिखें: शहर और राज्य, जैसे Patna, Bihar।", done: "मैं यहीं हूँ। करियर, पढ़ाई, संबंध या कुंडली पर आगे पूछ सकते हैं।" };
  const en: Record<Step, string> = { language: `Hello, I am ${name}. Would you like Hindi, Hinglish, or English?`, name: "What is your name?", dob: "Please share your date of birth, for example 15/08/1990.", time: "What was your birth time? For example 08:30 AM.", place: "Where were you born? City and state, for example Patna, Bihar.", done: "I am here. You can ask about career, study, relationships, or your chart." };
  const hg: Record<Step, string> = { language: `Namaste, main ${name} hoon. Aap Hindi, Hinglish ya English mein baat karna chahenge?`, name: "Aapka naam kya hai?", dob: "Janm tithi likhiye, jaise 15/08/1990.", time: "Janm ka samay likhiye, jaise 08:30 AM.", place: "Janm sthan likhiye: sheher aur rajya, jaise Patna, Bihar.", done: "Main yahin hoon. Career, padhai, relationships ya kundli par aage poochhiye." };
  if (lang === "hi") return hi[step]; if (lang === "hinglish") return hg[step]; return en[step];
}

function ChatPageContent() {
  const { lang, me, setLanguage, refresh, loading, sessionError, theme } = useApp();
  const searchParams = useSearchParams();

  const [persona, setPersona] = useState("gita");
  const [step, setStep] = useState<Step>("language");
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [chart, setChart] = useState<PublicChart | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);
  const [doneQuestionsCount, setDoneQuestionsCount] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const conversationId = useRef("");
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === "dark";
  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const headerClass = isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-orange-100 shadow-sm";
  const inputWrapperClass = isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-orange-100 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]";
  const inputClass = isDark ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500" : "bg-gray-50 border-gray-200 text-slate-900 placeholder-gray-400 focus:border-orange-400";

  const walletBalanceRupees = (me?.user?.walletBalancePaise ?? 0) / 100;
  const freeMessagesUsed = me?.user?.freeMessagesUsed ?? 0;
  const hasFreeMessagesLeft = freeMessagesUsed < 3;
  const isPremium = !!me?.user?.premiumUntil && new Date(me.user.premiumUntil) > new Date();
  const isLowBalance = walletBalanceRupees < 2 && !hasFreeMessagesLeft && !isPremium;
  const shouldShowUpsell = !isPremium && !hasFreeMessagesLeft;
  const personaDetails = getPersonaDetails(persona);

  useEffect(() => {
    const p = searchParams.get("persona");
    if (p && ["gita", "kriti", "devaki", "gargi"].includes(p)) setPersona(p);
    const savedDraft = sessionStorage.getItem("gita_birth_draft");
    if (savedDraft) try { setDraft({ ...EMPTY_DRAFT, ...JSON.parse(savedDraft) }); } catch { setDraft(EMPTY_DRAFT); }
    if (sessionStorage.getItem("gita_lang_confirmed") === "1") setStep("name");
  }, [searchParams]);

  useEffect(() => {
    if (me?.birth?.name) { setStep("done"); setDraft({ name: me.birth.name, dob: me.birth.dob, time: me.birth.birthTime, place: me.birth.birthPlace }); }
  }, [me]);

  useEffect(() => {
    if (loading || !me?.user) return;
    let cancelled = false;
    setHistoryLoading(true); setMessages([]); conversationId.current = "";
    fetch(`/api/chat?persona=${persona}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        if (Array.isArray(data.messages) && data.messages.length > 0) setMessages(data.messages);
        if (data.conversationId) conversationId.current = data.conversationId;
      }).catch(console.error).finally(() => { if (!cancelled) setHistoryLoading(false); });
    return () => { cancelled = true; };
  }, [persona, loading, me?.user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, isLoading, chart, imagePreview]);

  const handleCopy = (id: string, text: string) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const handleNewChat = () => { conversationId.current = ""; setMessages([]); setChart(null); setSidebarOpen(false); setDoneQuestionsCount(0); setStep(me?.birth?.name ? "done" : "name"); };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image 5MB se choti honi chahiye.");
    setSelectedImage(file); setImagePreview(URL.createObjectURL(file));
  };
  const clearImage = () => { setSelectedImage(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  async function sendToAi(text: string, imageFile?: File | null) {
    setIsLoading(true);
    const tempImageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    if (text || tempImageUrl) setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "user", content: text || "Photo bheji hai", image: tempImageUrl }]);

    try {
      const formData = new FormData();
      formData.append("message", text); formData.append("language", lang); formData.append("persona", persona);
      if (conversationId.current) formData.append("conversationId", conversationId.current);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch("/api/chat", { method: "POST", cache: "no-store", signal: AbortSignal.timeout(90000), body: formData });
      const data = await response.json().catch(() => ({}));

      if (typeof data.conversationId === "string") conversationId.current = data.conversationId;
      if (!response.ok) {
        if (data.code === "INSUFFICIENT_BALANCE") return setShowInsufficientBalance(true);
        return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: typeof data.error === "string" ? data.error : "अभी उत्तर नहीं बन पाया।" }]);
      }
      
      setMessages(prev => [
        ...prev, 
        { id: crypto.randomUUID(), role: "assistant", content: data.message?.content && typeof data.message.content === "string" ? data.message.content : "अभी उत्तर खाली आया।" }
      ]);
      await refresh();
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: timedOut ? "उत्तर आने में ज़्यादा समय लग गया।" : "सर्वर से संपर्क नहीं हो पाया।" }]);
    } finally { setIsLoading(false); clearImage(); }
  }

  async function finishKundli(next: Draft) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/kundli", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: next.name, dateOfBirth: next.dob, timeOfBirth: next.time, placeOfBirth: next.place }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.chart) { setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "कुंडली गणना नहीं हो सकी।" }]); return setStep("place"); }
      setChart(data.chart as PublicChart); setStep("done"); sessionStorage.removeItem("gita_birth_draft");
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "आपकी कुंडली तैयार है। नीचे कार्ड देखें।" }]);
      await refresh();
    } finally { setIsLoading(false); }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if ((!text && !selectedImage) || isLoading) return;
    setInput("");

    if (step === "done" && !showUpsell && shouldShowUpsell && hasFreeMessagesLeft) {
      const newCount = doneQuestionsCount + 1; setDoneQuestionsCount(newCount);
      if (newCount >= 3) setShowUpsell(true);
    }

    if (step === "done" || (looksLikeQuestion(text) && step !== "language")) return await sendToAi(text, selectedImage);
    if (step === "language") {
      const value = /hindi|हिंदी/i.test(text) ? "hi" : /hinglish|हिंग्लिश/i.test(text) ? "hinglish" : /english|angrezi/i.test(text) ? "en" : null;
      if (!value) return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("language", lang, personaDetails.name) }]);
      await setLanguage(value); sessionStorage.setItem("gita_lang_confirmed", "1"); setStep(me?.birth?.name ? "done" : "name");
      return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor(me?.birth?.name ? "done" : "name", value, personaDetails.name) }]);
    }
    if (step === "name") {
      if (text.length < 2) return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("name", lang, personaDetails.name) }]);
      const next = { ...draft, name: text }; setDraft(next); setStep("dob"); sessionStorage.setItem("gita_birth_draft", JSON.stringify(next));
      return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "धन्यवाद " + text + "। " + questionFor("dob", lang, personaDetails.name) }]);
    }
    if (step === "dob") {
      const dob = parseDate(text); if (!dob) return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("dob", lang, personaDetails.name) }]);
      const next = { ...draft, dob }; setDraft(next); setStep("time"); sessionStorage.setItem("gita_birth_draft", JSON.stringify(next));
      return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("time", lang, personaDetails.name) }]);
    }
    if (step === "time") {
      const time = parseTime(text); if (!time) return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("time", lang, personaDetails.name) }]);
      const next = { ...draft, time }; setDraft(next); setStep("place"); sessionStorage.setItem("gita_birth_draft", JSON.stringify(next));
      return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("place", lang, personaDetails.name) }]);
    }
    if (step === "place") {
      if (text.length < 2) return setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor("place", lang, personaDetails.name) }]);
      const next = { ...draft, place: text }; setDraft(next); sessionStorage.setItem("gita_birth_draft", JSON.stringify(next));
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: "स्थान नोट कर लिया। कुंडली गणना कर रही हूँ।" }]);
      return await finishKundli(next);
    }
    await sendToAi(text, selectedImage);
  }  

  if (loading || historyLoading) return <div className={`flex h-[100dvh] w-full flex-col items-center justify-center ${pageClass}`}><Sparkles size={32} className="animate-spin text-orange-500 mb-4" /><p className="text-sm font-semibold text-orange-500">Connecting to {personaDetails.name}...</p></div>;
  if (sessionError || !me?.user) return <div className={`flex h-[100dvh] w-full flex-col items-center justify-center px-4 text-center ${pageClass}`}><p className="text-3xl mb-4">⚠️</p><h2 className="text-lg font-bold text-red-500">Connection Failed</h2><button onClick={() => refresh()} className="mt-6 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white">Try Again</button></div>;

  const shownMessages = messages.length > 0 ? messages : [{ id: "welcome", role: "assistant" as const, content: questionFor(step, lang, personaDetails.name) }];

  return (
    <div className={`flex h-[100dvh] w-full flex-col overflow-hidden transition-colors duration-300 ${pageClass}`}>
      <HistorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentConversationId={conversationId.current} onSelectChat={(id) => { conversationId.current = id; setMessages([]); setStep("done"); setSidebarOpen(false); }} onNewChat={handleNewChat} />

      <header className={`flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 z-10 ${headerClass}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className={`rounded-xl p-2 ${isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-orange-50"}`}><Menu size={20} /></button>
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-orange-200"><img src={personaDetails.img} alt={personaDetails.name} className="h-full w-full object-cover" /></div>
          <div>
            <h1 className="text-sm font-bold text-orange-500">{personaDetails.name}</h1>
            <p className={`text-[10px] font-medium flex items-center gap-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online</p>
          </div>
        </div>
        <Link href="/wallet" className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border shadow-sm transition active:scale-95 ${isDark ? "bg-slate-800 border-slate-700 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-600"}`}>
          <Wallet size={12} /> ₹{walletBalanceRupees} <span className="h-3 w-px bg-current opacity-30 mx-0.5"></span> <Plus size={12} className="font-black" />
        </Link>
      </header>

      {isLowBalance && step === "done" && (
        <Link href="/wallet" className={`flex items-center justify-between gap-2 px-4 py-2 text-xs font-bold border-b animate-in slide-in-from-top-2 shrink-0 ${isDark ? "bg-amber-950/40 border-amber-900/50 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div className="flex items-center gap-2"><Heart size={14} className="text-red-500 animate-pulse" /><span>Hamari baat adhuri reh gayi... Recharge to hear the truth.</span></div><span className="underline">Add Cash</span>
        </Link>
      )}

      {step !== "done" && (
        <div className={`text-center py-1.5 text-[10px] font-black uppercase tracking-wider z-10 shrink-0 ${isDark ? "bg-orange-950/40 text-orange-400 border-b border-orange-900/30" : "bg-orange-100 text-orange-700 border-b border-orange-200"}`}>
          ✨ Pehli Chat 100% FREE ✨
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20" aria-live="polite">
        {step === "language" && messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {([["hi", "हिन्दी"], ["hinglish", "Hinglish"], ["en", "English"]] as const).map(([code, label]) => (
              <button key={code} type="button" className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-all active:scale-95 shadow-sm ${isDark ? "border-slate-700 text-orange-400 bg-slate-800 hover:bg-slate-700" : "border-orange-200 text-orange-600 bg-white hover:bg-orange-50"}`}
                onClick={() => {
                  void setLanguage(code); sessionStorage.setItem("gita_lang_confirmed", "1"); setStep(me?.birth?.name ? "done" : "name");
                  setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: questionFor(me?.birth?.name ? "done" : "name", code, personaDetails.name) }]);
                }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {shownMessages.map((message) => (
          <div key={message.id} className={"flex " + (message.role === "user" ? "justify-end" : "justify-start")}>
            <div className={`relative group max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[15px] leading-relaxed shadow-sm ${message.role === "user" ? "bg-orange-500 text-white rounded-br-sm" : isDark ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-sm" : "bg-white text-slate-800 border border-orange-100 rounded-bl-sm"}`}>
              
              {message.image && (
                <div className="mb-2 overflow-hidden rounded-xl border border-black/10">
                  <img src={message.image} alt="User upload" className="max-w-[250px] max-h-[300px] object-cover w-full" />
                </div>
              )}
              <div>{message.content}</div>
              
              {message.role === "assistant" && (
                <button onClick={() => handleCopy(message.id, message.content)} className={`absolute -right-2 -bottom-2 p-1.5 rounded-full shadow-md transition ${copiedId === message.id ? "bg-green-500 text-white" : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>
                  {copiedId === message.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-xs border shadow-sm ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-orange-100 text-gray-500"}`}>
            <Sparkles size={14} className="animate-spin text-orange-500" /><span>{personaDetails.name} सोच रही हैं...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {imagePreview && (
        <div className={`shrink-0 p-3 border-t ${isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-gray-200"}`}>
          <div className="relative inline-block">
            <img src={imagePreview} alt="Selected" className="h-16 w-16 object-cover rounded-lg border-2 border-orange-500" />
            <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><X size={12} /></button>
          </div>
        </div>
      )}

      <div className={`shrink-0 border-t p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] z-20 ${inputWrapperClass}`}>
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-xl mx-auto gap-2">
          <button type="button" onClick={() => fileInputRef.current?.click()} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}><ImageIcon size={20} /></button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
          <div className="relative flex-1">
            <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading || historyLoading} placeholder="अपना सवाल लिखें..." className={`w-full rounded-2xl border py-3.5 pl-4 pr-14 text-[15px] outline-none transition-colors ${inputClass}`} />
            <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading || historyLoading} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600 transition-all active:scale-95 shadow-md"><Send size={16} /></button>
          </div>
        </form>
      </div>

      {showInsufficientBalance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-[#151E2E] border border-orange-500/30 p-6 text-center shadow-[0_0_50px_rgba(234,88,12,0.2)] animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-4"><Lock size={32} /></div>
            <h2 className="text-xl font-black text-white mb-2">Balance Exhausted</h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">Aapka free message limit ya wallet balance khatam ho gaya hai. {personaDetails.name} se aur baatein karne ke liye recharge karein.</p>
            <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex justify-between items-center border border-slate-700"><span className="text-xs font-semibold text-slate-400">Current Balance</span><span className="text-lg font-black text-red-400">₹{walletBalanceRupees}</span></div>
            <Link href="/wallet" className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform mb-3">Add Cash Now</Link>
            <button onClick={() => setShowInsufficientBalance(false)} className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 w-full"><X size={14} /> Maybe Later</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-[100dvh] items-center justify-center bg-[#0B0F19] text-orange-500"><Sparkles className="animate-spin" size={32} /></div>}>
      <ChatPageContent />
    </Suspense>
  );
}
