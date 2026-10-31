// app/chat/[id]/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";
import { useApp } from "../../Providers";

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

  const endRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);
  const activePersonaRef = useRef(id);

  const loadHistory = useCallback(
    async (signal?: AbortSignal) => {
      if (!VALID_PERSONAS.has(id)) return;

      setHistoryLoading(true);

      try {
        // 🔥 FIX: Guest Login call karo aur check karo ki successful hua ya nahi
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
          // Agar error aata hai, toh chat mein hi dikha do
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
      
      {/* HEADER */}
      <header className={`sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b px-3 py-3 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white"}`}>
        <Link href="/" aria-label="Back" className={`text-2xl leading-none ${isDark ? "text-white" : "text-black"}`}>
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
          <p className="text-[11px] font-semibold text-green-600">● Online</p>
        </div>
      </header>

      <main className="flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-live="polite">
        {historyLoading && (
          <div className={`py-10 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            ज्योतिषी जुड़ रही हैं...
          </div>
        )}

        {!historyLoading && messages.length === 0 && (
          <div className={`mt-10 px-4 text-center text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <p className={`text-base font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              {astrologer.name}
            </p>
            <p className="mt-2">{astrologer.shortBio}</p>
            <p className="mt-6 text-xs text-gray-400">
              नीचे से सवाल चुनें या अपना सवाल टाइप करें।
            </p>
          </div>
        )}

        {!historyLoading && messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              message.role === "user"
                ? "rounded-br-md bg-orange-500 text-white"
                : isDark 
                  ? "rounded-bl-md border border-slate-700 bg-slate-800 text-slate-200" 
                  : "rounded-bl-md border border-orange-100 bg-white text-gray-800"
            }`}>
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-bl-md border px-4 py-3 text-sm ${
              isDark ? "border-slate-700 bg-slate-800 text-slate-400" : "border-orange-100 bg-white text-gray-500"
            }`}>
              <span className="animate-pulse">जवाब तैयार हो रहा है...</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </main>

      {!historyLoading && messages.length === 0 && (
        <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto px-3 pb-2">
          {INTENT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void sendMessage(chip)}
              disabled={loading}
              className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs disabled:opacity-50 ${
                isDark ? "border-slate-700 bg-slate-800 text-orange-400" : "border-orange-200 bg-white text-orange-700"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <form 
        className={`flex shrink-0 items-center gap-2 border-t px-3 py-3 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white"}`} 
        onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="अपना सवाल लिखें..."
          className={`min-w-0 flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-orange-400 ${
            isDark ? "border-slate-700 bg-slate-800 text-white" : "border-orange-100 bg-[#FFF9E6] text-black"
          }`}
          disabled={loading || historyLoading}
          maxLength={8000}
        />

        <button
          type="submit"
          disabled={loading || historyLoading || !input.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition active:scale-95 disabled:opacity-50"
        >
          →
        </button>
      </form>
    </div>
  );
}