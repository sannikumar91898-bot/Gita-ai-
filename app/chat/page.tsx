
"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { Send, Sparkles, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  reply?: string;
  error?: string;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "प्रणाम! मैं गीता एआई हूँ, आपकी व्यक्तिगत एआई ज्योतिषी। " +
    "आज आप अपने जीवन, करियर या भविष्य के बारे में क्या जानना चाहते हैं?",
};

const GENERIC_ERROR =
  "अभी उत्तर नहीं मिल पाया। कृपया थोड़ी देर बाद फिर कोशिश करें। 🙏";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    WELCOME_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const messageText = input.trim();

    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantText = GENERIC_ERROR;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: messageText,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(35_000),
      });

      let data: ChatApiResponse;

      try {
        data = (await response.json()) as ChatApiResponse;
      } catch {
        throw new Error(
          response.ok
            ? "Server returned an invalid response."
            : `Chat request failed (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        // Display the safe error returned by our own API route.
        throw new Error(
          data.error ||
            `Chat request failed (HTTP ${response.status}).`
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The AI returned an empty response.");
      }

      assistantText = data.reply.trim();
    } catch (error: unknown) {
      console.error("Chat request failed:", error);

      if (error instanceof Error) {
        if (error.name === "TimeoutError") {
          assistantText =
            "उत्तर आने में ज़्यादा समय लग रहा है। कृपया फिर कोशिश करें।";
        } else if (
          error.name === "TypeError" &&
          /fetch/i.test(error.message)
        ) {
          assistantText =
            "सर्वर से संपर्क नहीं हो पाया। इंटरनेट कनेक्शन और वेबसाइट की स्थिति जाँचकर फिर कोशिश करें।";
        } else {
          // API errors are safe messages produced by our server route.
          assistantText = error.message || GENERIC_ERROR;
        }
      }
    } finally {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantText,
        },
      ]);

      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-[400px] w-full flex-col bg-night-900 text-violet-50">
      {/* Chat header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-gold-400/10 px-4 py-3">
        <Link
          href="/"
          aria-label="Back to home"
          className="text-violet-300 transition-colors hover:text-gold-300"
        >
          <ArrowLeft size={20} />
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/30">
            <Bot size={18} />
          </div>

          <div>
            <h1 className="font-display text-sm font-bold sm:text-base">
              Gita AI Astrologer
            </h1>
            <p className="flex items-center gap-1 text-[10px] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI Assistant
            </p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 space-y-4 overflow-y-auto p-4"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-tr-none bg-violet-600 text-white"
                  : "card rounded-tl-none border border-gold-400/10 text-violet-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="card flex items-center gap-2 rounded-2xl rounded-tl-none border border-gold-400/10 px-4 py-3 text-xs text-violet-300">
              <Sparkles
                size={14}
                className="animate-spin text-gold-300"
              />
              <span>गीता AI आपके सवाल का जवाब तैयार कर रही है...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-gold-400/10 bg-night-950 p-3"
      >
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपना सवाल यहाँ लिखें..."
            aria-label="Your message"
            maxLength={10_000}
            className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 py-3 pl-4 pr-12 text-sm text-violet-100 placeholder-violet-400/60 focus:border-gold-300 focus:outline-none focus:ring-1 focus:ring-gold-300"
            disabled={isLoading}
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-black transition-colors hover:bg-gold-300 disabled:bg-violet-950/80 disabled:text-violet-500"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
