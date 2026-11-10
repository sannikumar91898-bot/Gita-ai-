// app/chat/[id]/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";
import { useApp } from "../../Providers";
import { Wallet, Lock, ArrowLeft, Send, Sparkles, X, Plus, Heart, ImageIcon, Menu } from "lucide-react"; 

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

const INTENT_CHIPS = [
  "मेरी शादी कब होगी?",
  "करियर में सफलता कैसे मिलेगी?",
  "मुझे कौन सा रत्न पहनना चाहिए?",
  "क्या मेरा पार्टनर सच्चा है?",
];

const VALID_PERSONAS = new Set(["gita", "kriti", "devaki", "gargi"]);

function createMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AstrologerChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, theme } = useApp();

  const isDark = theme === "dark";
  const id = typeof params?.id === "string" ? params.id : "";
  const astrologer = getAstrologerById(id);
  const validId = VALID_PERSONAS.has(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);
  const activePersonaRef = useRef(id);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      if (data.user) {
        setWalletBalance(data.user.walletBalancePaise || 0);
      }
    } catch (e) {
      console.error("Failed to fetch wallet balance", e);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const loadHistory = useCallback(
    async (signal?: AbortSignal) => {
      if (!VALID_PERSONAS.has(id)) return;
      setHistoryLoading(true);

      try {
        const guestRes = await fetch("/api/auth/guest", { method: "POST" });
        if (!guestRes.ok) {
          const guestData = await guestRes.json().catch(() => ({}));
          throw new Error(guestData.error || "Guest session could not be created.");
        }

        const query = new URLSearchParams({ persona: id });
        const response = await fetch(`/api/chat?${query.toString()}`, {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(data.error || "Chat history load nahi hui.");
        if (signal?.aborted || activePersonaRef.current !== id) return;

        const history: Message[] = [];
        if (Array.isArray(data.messages)) {
          for (const item of data.messages) {
            if (item && typeof item === "object" && typeof item.id === "string" && (item.role === "user" || item.role === "assistant") && typeof item.content === "string") {
              history.push({ id: item.id, role: item.role, content: item.content });
            }
          }
        }

        setConversationId(typeof data.conversationId === "string" ? data.conversationId : null);
        setMessages(history);
      } catch (error) {
        if (signal?.aborted) return;
        if (activePersonaRef.current === id) {
          setMessages([{ id: createMessageId(), role: "assistant", content: error instanceof Error ? error.message : "Session not found." }]);
          setConversationId(null);
        }
      } finally {
        if (!signal?.aborted && activePersonaRef.current === id) setHistoryLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    activePersonaRef.current = id;
    if (!validId || !astrologer) {
      router.replace("/");
      return;
    }
    const controller = new AbortController();
    setMessages([]);
    setConversationId(null);
    setInput("");
    void loadHistory(controller.signal);
    return () => { controller.abort(); };
  }, [id, validId, astrologer, router, loadHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, imagePreview]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image 5MB se choti honi chahiye.");
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function sendMessage(text: string, imageFile?: File | null) {
    if ((!text.trim() && !imageFile) || loading || !astrologer || !validId || historyLoading || requestInProgress.current) return;

    const selectedPersona = id;
    const content = text.trim();
    const tempImageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    
    const userMessage: Message = { id: createMessageId(), role: "user", content: content || "Photo bheji hai", image: tempImageUrl };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);
    requestInProgress.current = true;

    try {
      const formData = new FormData();
      formData.append("message", content);
      formData.append("language", lang);
      formData.append("topic", astrologer.topic || "general");
      formData.append("persona", selectedPersona);
      if (conversationId) formData.append("conversationId", conversationId);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch("/api/chat", {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(90_000),
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (activePersonaRef.current !== selectedPersona) return;

      if (response.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (!response.ok) {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: typeof data.error === "string" ? data.error : "क्षमा करें, अभी उत्तर नहीं मिल पाया।" },
        ]);
        return;
      }

      if (typeof data.conversationId === "string") setConversationId(data.conversationId);

      if (data.message && typeof data.message.content === "string" && data.message.content.trim()) {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: data.message.content },
        ]);
        void fetchProfile(); 
      } else {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: "अभी उत्तर खाली आया। कृपया फिर कोशिश करें।" },
        ]);
      }
    } catch (error) {
      if (activePersonaRef.current === selectedPersona) {
        const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: timedOut ? "उत्तर आने में ज़्यादा समय लग गया।" : "नेटवर्क की समस्या है।" },
        ]);
      }
    } finally {
      requestInProgress.current = false;
      if (activePersonaRef.current === selectedPersona) setLoading(false);
      clearImage();
    }
  }

  if (!astrologer || !validId) {
    return <div className={`flex h-[100dvh] items-center justify-center ${isDark ? "bg-[#0B0F19] text-white" : "bg-[#FFF9E6] text-gray-600"}`}><Sparkles className="animate-spin text-orange-500" size={32} /></div>;
  }

  return (
    <div className={`flex h-[100dvh] flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0B0F19]" : "bg-[#FFF9E6]"}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 shadow-sm ${isDark ? "border-slate-800 bg-[#151E2E]/95 backdrop-blur-md" : "border-orange-100 bg-white/95 backdrop-blur-md"}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/" aria-label="Back" className={`p-2 rounded-full transition-transform active:scale-95 ${isDark ? "text-white hover:bg-slate-800" : "text-black hover:bg-gray-100"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border-2 border-orange-500 shadow-sm">
            <img src={astrologer.photo} alt={astrologer.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className={`truncate text-[16px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{astrologer.name}</h1>
            <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Online</p>
          </div>
        </div>
        <Link href="/wallet" className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold border shadow-sm transition active:scale-95 ${isDark ? "bg-slate-800 border-slate-700 text-orange-400 hover:bg-slate-700" : "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"}`}>
          <Wallet size={14} /> ₹{walletBalance / 100} <span className="h-3.5 w-px bg-current opacity-30 mx-0.5"></span> <Plus size={14} className="font-black" />
        </Link>
      </header>

      {/* WARNING BANNER */}
      {walletBalance < 200 && (
         <Link href="/wallet" className={`flex items-center justify-between gap-2 px-4 py-2.5 text-[12px] font-bold border-b animate-in slide-in-from-top-2 ${isDark ? "bg-amber-950/40 border-amber-900/50 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-500 animate-pulse" />
            <span>Hamari baat adhuri reh gayi... Recharge to hear the truth.</span>
          </div>
          <span className="underline shrink-0">Add Cash</span>
        </Link>
      )}

      {/* CHAT MESSAGES */}
      <main className="flex-1 space-y-5 overflow-y-auto px-4 py-5 pb-24 custom-scrollbar" aria-live="polite">
        <div className="w-full max-w-4xl mx-auto space-y-5">
          {historyLoading ? (
            <div className={`py-10 text-center flex flex-col items-center gap-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              <Sparkles size={24} className="animate-spin text-orange-500" />
              <span className="text-sm font-medium">ज्योतिषी जुड़ रही हैं...</span>
            </div>
          ) : (
            <>
              {/* Intent Chips */}
              {messages.length === 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4">
                  {INTENT_CHIPS.map((chip, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => sendMessage(chip)} 
                      className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition active:scale-95 shadow-sm ${
                        isDark ? "border-slate-700 bg-[#151E2E] text-slate-300 hover:bg-slate-800 hover:text-white" : "border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {/* Astrologer Avatar */}
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-1 shadow-sm border border-slate-700">
                      <img src={astrologer.photo} alt="Astro" className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-[1.3rem] px-5 py-3.5 text-[15.5px] leading-relaxed shadow-md ${
                    message.role === "user" 
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-tr-sm font-medium" 
                      : isDark ? "bg-[#151E2E] text-slate-200 border border-slate-800 rounded-tl-sm" : "bg-white text-slate-800 border border-orange-100 rounded-tl-sm"
                  }`}>
                    {message.image && (
                      <div className="mb-2 overflow-hidden rounded-xl border border-black/10">
                        <img src={message.image} alt="User upload" className="max-w-[250px] max-h-[300px] object-cover w-full" />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-1 shadow-sm border border-slate-700">
                    <img src={astrologer.photo} alt="Astro" className="h-full w-full object-cover" />
                  </div>
                  <div className={`inline-flex items-center gap-1.5 rounded-[1.3rem] rounded-tl-sm px-5 py-4 border shadow-sm ${isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-orange-100"}`}>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div ref={endRef} />
      </main>

      {/* INPUT BOX */}
      <div className={`shrink-0 border-t p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] z-20 ${isDark ? "border-slate-800 bg-[#0B0F19]/95 backdrop-blur-xl" : "border-orange-100 bg-[#FFF9E6]/95 backdrop-blur-xl"}`}>
        <form onSubmit={(e) => { e.preventDefault(); void sendMessage(input, selectedImage); }} className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          
          {/* Image Preview Thumbnail */}
          {imagePreview && (
            <div className="px-2">
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Selected" 
                  className="h-20 w-20 object-cover rounded-xl border-2 border-orange-500 shadow-md" 
                />
                <button 
                  type="button"
                  onClick={clearImage} 
                  className="absolute -top-2.5 -right-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-lg transition"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          {/* Main Input Pill */}
          <div className={`flex items-end gap-2 rounded-3xl p-2 border transition-all shadow-lg ${
            isDark ? "bg-[#151E2E] border-slate-700 focus-within:border-orange-500 focus-within:shadow-orange-500/10" : "bg-white border-gray-300 focus-within:border-orange-400 focus-within:shadow-orange-500/10"
          }`}>
            
            {/* Photo Button */}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${
                isDark ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <ImageIcon size={22} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />

            {/* Text Input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || historyLoading}
              placeholder="अपना सवाल लिखें..."
              className={`flex-1 bg-transparent py-3 px-2 text-[15.5px] outline-none ${
                isDark ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-gray-400"
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || loading || historyLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white disabled:opacity-40 disabled:grayscale hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <Send size={20} className="ml-0.5" />
            </button>
          </div>
        </form>
      </div>

      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-[2rem] bg-[#151E2E] border border-orange-500/30 p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(234,88,12,0.2)] animate-in zoom-in-95">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-5">
              <Lock size={40} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Balance Exhausted</h2>
            <p className="text-[14px] text-slate-300 mb-6 leading-relaxed">
              Aapka free message limit ya wallet balance khatam ho gaya hai. {astrologer.name} se aur baatein karne ke liye recharge karein.
            </p>
            <div className="bg-[#0B0F19] rounded-xl p-4 mb-6 flex justify-between items-center border border-slate-700">
              <span className="text-[13px] font-semibold text-slate-400">Current Balance</span>
              <span className="text-xl font-black text-rose-400">₹{walletBalance / 100}</span>
            </div>
            <Link href="/wallet" className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-[15px] font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform mb-4">
              Add Cash Now
            </Link>
            <button onClick={() => setShowPaywall(false)} className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 w-full">
              <X size={16} /> Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}