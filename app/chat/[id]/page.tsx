// app/chat/[id]/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";
import { useApp } from "../../Providers";
import { Wallet, Lock } from "lucide-react"; 

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
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
  
  // 🔥 Wallet aur Paywall ke liye states
  const [walletBalance, setWalletBalance] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);
  const activePersonaRef = useRef(id);

  // 🔥 Wallet Balance fetch karne ka function
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
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading || !astrologer || !validId || historyLoading || requestInProgress.current) return;

    const selectedPersona = id;
    const content = text.trim();

    const userMessage: Message = { id: createMessageId(), role: "user", content };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);
    requestInProgress.current = true;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(50_000),
        body: JSON.stringify({
          message: content,
          language: lang,
          topic: astrologer.topic || "general",
          conversationId: conversationId || undefined,
          persona: selectedPersona,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (activePersonaRef.current !== selectedPersona) return;

      // 🔥 FIX: Agar backend se 402 (Payment Required) aata hai, toh Paywall dikhao
      if (response.status === 402) {
        setShowPaywall(true);
        setLoading(false);
        requestInProgress.current = false;
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
        
        // 🔥 Message successful hone par wallet balance update karo
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
      
      {/* HEADER (REPLACED WITH NEW DESIGN & COMPATIBILITY) */}
      <header className={`sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white"}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/" aria-label="Back" className={`text-2xl leading-none transition-transform active:scale-95 ${isDark ? "text-white" : "text-black"}`}>
            ←
          </Link>

          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-orange-200">
            <img
              src={astrologer.photo}
              alt={astrologer.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className={`truncate text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {astrologer.name}
            </h1>
            <p className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online
            </p>
          </div>
        </div>

        <Link 
          href="/wallet" 
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition hover:scale-105 cursor-pointer ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}
        >
          <Wallet size={12} />
          ₹{walletBalance / 100}
        </Link>
      </header>

      <main className="flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-live="polite">
        {historyLoading && (
