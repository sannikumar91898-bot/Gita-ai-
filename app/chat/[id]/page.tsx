// app/chat/[id]/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";
import { useApp } from "../../Providers";
import { Wallet, Lock, ArrowLeft, Send, Sparkles, X, Plus, Heart, Image as ImageIcon } from "lucide-react"; 

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

  // 🔥 NAYA: Image Upload State
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
          throw new Error(guestData.error || "Guest session could not be created. Database error.");
        }

        const query = new URLSearchParams({ persona: id });
        const response = await fetch(`/api/chat?${query.toString()}`, {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Chat history load nahi hui.");
        }

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
        console.error("Astrologer history load failed:", error);
        
        if (activePersonaRef.current === id) {
          setMessages([
            {
              id: createMessageId(),
              role: "assistant",
              content: error instanceof Error ? error.message : "Session not found. Please refresh the page."
            }
          ]);
          setConversationId(null);
        }
      } finally {
        if (!signal?.aborted && activePersonaRef.current === id) {
          setHistoryLoading(false);
        }
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

  // 🔥 Image Handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image 5MB se choti honi chahiye.");
      return;
    }

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

    // Add to UI
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
        body: formData, // Send as FormData
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
          { id: createMessageId(), role: "assistant", content: typeof data.error === "string" ? data.error : "क्षमा करें, अभी उत्तर नहीं मिल पाया। कृपया फिर कोशिश करें।" },
        ]);
        return;
      }

      if (typeof data.conversationId === "string") setConversationId(data.conversationId);

      if (typeof data.reply === "string" && data.reply.trim()) {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: data.reply },
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
          { id: createMessageId(), role: "assistant", content: timedOut ? "उत्तर आने में ज़्यादा समय लग गया। कृपया फिर कोशिश करें।" : "नेटवर्क की समस्या है। कृपया इंटरनेट जाँचकर फिर कोशिश करें।" },
        ]);
      }
    } finally {
      requestInProgress.current = false;
      if (activePersonaRef.current === selectedPersona) setLoading(false);
      clearImage();
    }
  }

  if (!astrologer || !validId) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isDark ? "bg-slate-950 text-white" : "bg-[#FFF9E6] text-gray-600"}`}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`flex h-[100dvh] flex-col overflow-hidden ${isDark ? "bg-slate-950" : "bg-[#FFF9E6]"}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white"}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/" aria-label="Back" className={`text-2xl leading-none transition-transform active:scale-95 ${isDark ? "text-white" : "text-black"}`}>
            <ArrowLeft size={20} />
          </Link>

          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-orange-200">
            <img src={astrologer.photo} alt={astrologer.name} className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className={`truncate text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{astrologer.name}</h1>
            <p className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online
            </p>
          </div>
        </div>

        {/* 🔥 WALLET BALANCE DISPLAY */}
        <Link href="/wallet" className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border shadow-sm transition active:scale-95 ${isDark ? "bg-slate-800 border-slate-700 text-orange-400" : "bg-orange-50 border-orange-200 text-orange-600"}`}>
          <Wallet size={12} />
          ₹{walletBalance / 100}
          <span className="h-3 w-px bg-current opacity-30 mx-0.5"></span>
          <Plus size={12} className="font-black" />
        </Link>
      </header>

      {/* LOW BALANCE BANNER */}
      {walletBalance < 200 && (
         <Link href="/wallet" className={`flex items-center justify-between gap-2 px-4 py-2 text-xs font-bold border-b animate-in slide-in-from-top-2 ${isDark ? "bg-amber-950/40 border-amber-900/50 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-red-500 animate-pulse" />
            <span>Hamari baat adhuri reh gayi... Recharge to hear the truth.</span>
          </div>
          <span className="underline">Add Cash</span>
        </Link>
      )}

      <main className="flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-live="polite">
        {historyLoading ? (
          <div className={`py-10 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            ज्योतिषी जुड़ रही हैं...
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {INTENT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(chip)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition active:scale-95 ${isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-orange-200 bg-white text-orange-600 hover:bg-orange-50"}`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : isDark ? "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-sm" : "bg-white text-slate-800 border border-orange-100 rounded-bl-sm"
                }`}>
                  {message.image && (
                    <img src={message.image} alt="User uploaded" className="mb-2 max-w-full rounded-lg h-40 object-cover" />
                  )}
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-xs border shadow-sm ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-orange-100 text-gray-500"}`}>
                <Sparkles size={14} className="animate-spin text-orange-500" />
                <span>{astrologer.name} सोच रही हैं...</span>
              </div>
            )}
          </>
        )}
        <div ref={endRef} />
      </main>

      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className={`shrink-0 p-3 border-t ${isDark ? "bg-slate-900 border-slate-800" : "bg-gray-50 border-gray-200"}`}>
          <div className="relative inline-block">
            <img src={imagePreview} alt="Selected" className="h-20 w-20 object-cover rounded-lg border-2 border-orange-500" />
            <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* INPUT AREA */}
      <div className={`shrink-0 border-t p-3 pb-6 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white"}`}>
        <form
          onSubmit={(e) => { e.preventDefault(); void sendMessage(input, selectedImage); }}
          className="relative flex items-center max-w-xl mx-auto gap-2"
        >
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
          >
            <ImageIcon size={20} />
          </button>
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />

          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || historyLoading}
              placeholder="अपना सवाल लिखें..."
              className={`w-full rounded-2xl border py-3.5 pl-4 pr-14 text-[15px] outline-none transition-colors ${
                isDark 
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-orange-500" 
                  : "bg-gray-50 border-gray-200 text-slate-900 placeholder-gray-400 focus:border-orange-400"
              }`}
            />
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || loading || historyLoading}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white disabled:opacity-50 hover:bg-orange-600 transition-all active:scale-95 shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-3xl bg-[#151E2E] border border-orange-500/30 p-6 text-center shadow-[0_0_50px_rgba(234,88,12,0.2)] animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Balance Exhausted</h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Aapka free message limit ya wallet balance khatam ho gaya hai. {astrologer.name} se aur baatein karne ke liye recharge karein.
            </p>
            <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex justify-between items-center border border-slate-700">
              <span className="text-xs font-semibold text-slate-400">Current Balance</span>
              <span className="text-lg font-black text-red-400">₹{walletBalance / 100}</span>
            </div>
            <Link href="/wallet" className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform mb-3">
              Add Cash Now
            </Link>
            <button onClick={() => setShowPaywall(false)} className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 w-full">
              <X size={14} /> Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}