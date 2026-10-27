"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { Send, Sparkles, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";

import { useApp } from "../Providers";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  reply?: string;
  error?: string;
  code?: string;
};

const TOPICS = ["palm", "love", "money", "remedies", "health", "career", "family"] as const;

type Topic = (typeof TOPICS)[number];

function isTopic(value: string): value is Topic {
  return (TOPICS as readonly string[]).includes(value);
}

function welcomeText(lang: "en" | "hi" | "hinglish", topic: Topic | null): string {
  const topicName =
    topic === "love"
      ? lang === "hi"
        ? "प्रेम और रिश्ते"
        : lang === "hinglish"
          ? "love aur relationships"
          : "love and relationships"
      : topic === "career"
        ? lang === "hi"
          ? "करियर"
          : "career"
        : topic === "money"
          ? lang === "hi"
            ? "धन"
            : lang === "hinglish"
              ? "paisa"
              : "money"
          : topic === "family"
            ? lang === "hi"
              ? "परिवार"
              : lang === "hinglish"
                ? "family"
                : "family and home"
            : topic === "health"
              ? lang === "hi"
                ? "स्वास्थ्य"
                : lang === "hinglish"
                  ? "health"
                  : "health"
              : topic === "palm"
                ? lang === "hi"
                  ? "हस्तरेखा"
                  : "palm reading"
                : topic === "remedies"
                  ? lang === "hi"
                    ? "उपाय"
                    : "remedies"
                  : "";

  if (lang === "hi") {
    return topicName
      ? `प्रणाम! मैं गीता एआई हूँ। ${topicName} के बारे में आप क्या जानना चाहते हैं?`
      : "प्रणाम! मैं गीता एआई हूँ। पढ़ाई, करियर, रिश्ते, गीता या ज्योतिष — जो पूछना हो, सीधे पूछिए।";
  }

  if (lang === "hinglish") {
    return topicName
      ? `Pranam! Main Gita AI hoon. ${topicName} ke baare mein aap kya jaanna chahte hain?`
      : "Pranam! Main Gita AI hoon. Padhai, career, rishte, Gita ya astrology — seedha sawaal poochhiye.";
  }

  return topicName
    ? `Hello, I am Gita AI. What would you like to ask about ${topicName}?`
    : "Hello, I am Gita AI. Ask about study, career, relationships, the Gita, or astrology.";
}

function errorText(lang: "en" | "hi" | "hinglish", code: string | undefined, fallback: string): string {
  if (code === "timeout") {
    if (lang === "hi") return "उत्तर आने में ज़्यादा समय लग रहा है। कृपया फिर कोशिश करें।";
    if (lang === "hinglish") return "Jawab aane mein zyada time lag raha hai. Kripya phir try karein.";
    return "The reply took too long. Please try again.";
  }

  if (code === "quota" || code === "unavailable") {
    if (lang === "hi") return "एआई सेवा अभी व्यस्त है। थोड़ी देर बाद कोशिश करें।";
    if (lang === "hinglish") return "AI service abhi busy hai. Thodi der baad try karein.";
    return "The AI service is busy. Please try again shortly.";
  }

  if (code === "not_configured" || code === "invalid_model" || code === "invalid_credentials" || code === "model_not_found") {
    if (lang === "hi") return "एआई सेवा अभी तैयार नहीं है। कृपया बाद में कोशिश करें।";
    if (lang === "hinglish") return "AI service abhi configured nahi hai. Baad mein try karein.";
    return "The AI service is not available right now. Please try again later.";
  }

  if (lang === "hi" && fallback === "GENERIC") return "अभी उत्तर नहीं मिल पाया। कृपया थोड़ी देर बाद फिर कोशिश करें।";
  if (lang === "hinglish" && fallback === "GENERIC") return "Abhi jawab nahi mil paya. Thodi der baad phir try karein.";
  if (lang === "en" && fallback === "GENERIC") return "I could not get a reply. Please try again in a moment.";

  return fallback;
}

export default function ChatPage() {
  const { lang } = useApp();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeText("en", null),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("topic") || "";
    const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
    setTopic(isTopic(cleaned) ? cleaned : null);
  }, []);

  useEffect(() => {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === "welcome"
          ? { ...message, content: welcomeText(lang, topic) }
          : message
      )
    );
  }, [lang, topic]);

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

    const prior = messages
      .filter((message) => message.id !== "welcome")
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.content }));

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantText = errorText(lang, undefined, "GENERIC");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          language: lang,
          topic: topic ?? "general",
          history: prior,
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
        assistantText = errorText(lang, data.code, data.error || "GENERIC");
        throw new Error(assistantText);
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error(errorText(lang, "empty", "GENERIC"));
      }

      assistantText = data.reply.trim();
    } catch (error: unknown) {
      console.error("Chat request failed:", error);

      if (error instanceof Error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
          assistantText = errorText(lang, "timeout", "GENERIC");
        } else if (error.name === "TypeError" && /fetch|network/i.test(error.message)) {
          assistantText =
            lang === "hi"
              ? "सर्वर से संपर्क नहीं हो पाया। इंटरनेट जाँचकर फिर कोशिश करें।"
              : lang === "hinglish"
                ? "Server se contact nahi ho paya. Internet check karke phir try karein."
                : "Could not reach the server. Check your connection and try again.";
        } else if (error.message) {
          assistantText = error.message;
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

  const placeholder =
    lang === "hi"
      ? "अपना सवाल यहाँ लिखें..."
      : lang === "hinglish"
        ? "Apna sawaal yahan likhiye..."
        : "Type your question...";

  const loadingText =
    lang === "hi"
      ? "गीता आपके सवाल का जवाब तैयार कर रही है..."
      : lang === "hinglish"
        ? "Gita aapke sawaal ka jawab taiyar kar rahi hai..."
        : "Gita is preparing a reply...";

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-[400px] w-full flex-col bg-night-900 text-violet-50">
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
              Gita AI
            </h1>
            <p className="flex items-center gap-1 text-[10px] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {topic ? topic : "AI Assistant"}
            </p>
          </div>
        </div>
      </header>

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
              <Sparkles size={14} className="animate-spin text-gold-300" />
              <span>{loadingText}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
            placeholder={placeholder}
            aria-label="Your message"
            maxLength={8000}
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