// app/chat/page.tsx
"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Send, Sparkles, Plus, Wallet, X, Copy, Check, Menu, Heart, Image as ImageIcon } from "lucide-react";

import { useApp } from "../Providers";
import HistorySidebar from "../components/HistorySidebar";

type Message = { id: string; role: "user" | "assistant"; content: string; image?: string };
type Step = "language" | "name" | "dob" | "time" | "place" | "done";
type Draft = { name: string; dob: string; time: string; place: string };
type PublicChart = {
  lagna: { rashiNameHi: string; degreeInSign: number };
  moonSign: { rashiNameHi: string };
  nakshatra: { name: string; pada: number };
  currentDasha: { maha: string } | null;
};

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
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  return match[3] + "-" + month + "-" + day;
}

function parseTime(value: string): string | null {
  const text = value.trim().toLowerCase();
  const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2] || "0");
  const suffix = match[3];
  if (minute > 59 || hour > 23) return null;
  if (suffix === "pm" && hour < 12) hour += 12;
  if (suffix === "am" && hour === 12) hour = 0;
  if (!suffix && hour > 23) return null;
  return String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
}

function questionFor(step: Step, lang: "en" | "hi" | "hinglish", name: string): string {
  const hi: Record<Step, string> = {
    language: `नमस्ते, मैं ${name} हूँ। आप हिंदी, Hinglish या English में बात करना चाहेंगे?`,
    name: "आपका नाम क्या है?",
    dob: "जन्म तिथि लिखें, जैसे 15/08/1990।",
    time: "जन्म का समय लिखें, जैसे 08:30 AM।",
    place: "जन्म स्थान लिखें: शहर और राज्य, जैसे Patna, Bihar।",
    done: "मैं यहीं हूँ। करियर, पढ़ाई, संबंध या कुंडली पर आगे पूछ सकते हैं।",
  };
  const en: Record<Step, string> = {
    language: `Hello, I am ${name}. Would you like Hindi, Hinglish, or English?`,
    name: "What is your name?",
    dob: "Please share your date of birth, for example 15/08/1990.",
    time: "What was your birth time? For example 08:30 AM.",
    place: "Where were you born? City and state, for example Patna, Bihar.",
    done: "I am here. You can ask about career, study, relationships, or your chart.",
  };
  const hg: Record<Step, string> = {
    language: `Namaste, main ${name} hoon. Aap Hindi, Hinglish ya English mein baat karna chahenge?`,
    name: "Aapka naam kya hai?",
    dob: "Janm tithi likhiye, jaise 15/08/1990.",
    time: "Janm ka samay likhiye, jaise 08:30 AM.",
    place: "Janm sthan likhiye: sheher aur rajya, jaise Patna, Bihar.",
    done: "Main yahin hoon. Career, padhai, relationships ya kundli par aage poochhiye.",
  };
  if (lang === "hi") return hi[step];
  if (lang === "hinglish") return hg[step];
  return en[step];
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
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: "assistant", content: typeof data.reply === "string" ? data.reply : "अभी उत्तर खाली आया।" }]);
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
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
            <div className={`relative group max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${message.role === "user" ? "bg-orange-500 text-white rounded-br-sm" : isDark ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-sm" : "bg-white text-slate-800 border border-orange-100 rounded-bl-sm"}`}>
              {message.image && <img src={message.image} alt="User uploaded" className="mb-2 max-w-full rounded-lg h-40 object-cover" />}
              {message.content}
              {message.role === "assistant" && (
                <button onClick={() => handleCopy(message.id, message.content)} className={`absolute -right-2 -bottom-2 p-1.5 rounded-full shadow-md transition ${copiedId === message.id ? "bg-green-500 text-white opacity-100" : isDark ? "bg-slate-700 text-slate-300 opacity-0 group-hover:opacity-100" : "bg-orange-100 text-orange-600 opacity-0 group-hover:opacity-100"}`}>
                  {copiedId === message.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {chart && (
          <div className={`rounded-2xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-orange-100 shadow-sm"}`}>
            <h3 className="text-xs font-bold text-orange-500 mb-2">✨ आपकी कुंडली</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="opacity-60">Lagna:</span> <span className="font-bold">{chart.lagna.rashiNameHi}</span></div>
              <div><span className="opacity-60">Rashi:</span> <span className="font-bold">{chart.moonSign.rashiNameHi}</span></div>
              <div><span className="opacity-60">Nakshatra:</span> <span className="font-bold">{chart.nakshatra.name} ({chart.nakshatra.pada})</span></div>
              <div><span className="opacity-60">Dasha:</span> <span className="font-bold">{chart.currentDasha?.maha ?? "—"}</span></div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-4 py-3 ${isDark ? "bg-slate-800" : "bg-white border border-orange-100"}`}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {showUpsell && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowUpsell(false)}>
          <div className={`w-full max-w-md rounded-t-3xl p-6 ${isDark ? "bg-[#151E2E]" : "bg-white"}`} onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <Sparkles className="mx-auto mb-3 text-orange-500" size={32} />
              <h2 className="text-lg font-bold mb-2">Aur jaane ke liye recharge karein</h2>
              <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Aapke free messages khatam ho gaye hain. Wallet recharge karke baat jaari rakhein.</p>
              <Link href="/wallet" className="block w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white">Recharge Wallet</Link>
              <button onClick={() => setShowUpsell(false)} className={`mt-2 w-full py-2 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Baad mein</button>
            </div>
          </div>
        </div>
      )}

      {showInsufficientBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 ${isDark ? "bg-[#151E2E]" : "bg-white"}`}>
            <div className="text-center">
              <Wallet className="mx-auto mb-3 text-orange-500" size={32} />
              <h2 className="text-lg font-bold mb-2">Balance kam hai</h2>
              <p className={`text-sm mb-4 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Wallet balance kam hai. Recharge karein aur baat jaari rakhein.</p>
              <Link href="/wallet" className="block w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white">Recharge</Link>
              <button onClick={() => setShowInsufficientBalance(false)} className={`mt-2 w-full py-2 text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>Band karein</button>
            </div>
          </div>
        </div>
      )}

      <footer className={`shrink-0 border-t px-3 py-3 ${inputWrapperClass}`}>
        {imagePreview && (
          <div className="mb-2 relative inline-block">
            <img src={imagePreview} alt="preview" className="h-16 w-16 rounded-lg object-cover border-2 border-orange-300" />
            <button onClick={clearImage} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className={`shrink-0 rounded-xl p-2.5 ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
            <ImageIcon size={18} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={step === "done" ? "Apna sawaal likhein..." : "Yahan likhein..."}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none ${inputClass}`}
          />
          <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading} className="shrink-0 rounded-xl bg-orange-500 p-2.5 text-white disabled:opacity-40 active:scale-95 transition">
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-[#FEF8EF]"><Sparkles className="animate-spin text-orange-500" size={32} /></div>}>
      <ChatPageContent />
    </Suspense>
  );
}