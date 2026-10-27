"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles } from "lucide-react";

import { Avatar } from "../../Avatar";
import { useApp } from "../Providers";

type Message = { id: string; role: "user" | "assistant"; content: string };
type Step = "language" | "name" | "dob" | "time" | "place" | "done";
type Draft = { name: string; dob: string; time: string; place: string };
type PublicChart = {
  lagna: { rashiNameHi: string; degreeInSign: number };
  moonSign: { rashiNameHi: string };
  nakshatra: { name: string; pada: number };
  currentDasha: { maha: string } | null;
};

const EMPTY_DRAFT: Draft = { name: "", dob: "", time: "", place: "" };

function looksLikeQuestion(text: string): boolean {
  if (/[?？]/.test(text)) return true;
  if (text.trim().split(/\s+/).length > 8) return true;
  return /क्या|कैसे|क्यों|कब|कहाँ|कौन|what|why|how|when|where|who|kaise|kya|kyun|kab|exam|career|नौकरी|शादी|भविष्य/i.test(
    text
  );
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

function questionFor(step: Step, lang: "en" | "hi" | "hinglish"): string {
  const hi: Record<Step, string> = {
    language: "नमस्ते, मैं गीता हूँ। आप हिंदी, Hinglish या English में बात करना चाहेंगे?",
    name: "आपका नाम क्या है?",
    dob: "जन्म तिथि लिखें, जैसे 15/08/1990।",
    time: "जन्म का समय लिखें, जैसे 08:30 AM।",
    place: "जन्म स्थान लिखें: शहर और राज्य, जैसे Patna, Bihar।",
    done: "मैं यहीं हूँ। करियर, पढ़ाई, संबंध या कुंडली पर आगे पूछ सकते हैं।",
  };
  const en: Record<Step, string> = {
    language: "Hello, I am Gita. Would you like Hindi, Hinglish, or English?",
    name: "What is your name?",
    dob: "Please share your date of birth, for example 15/08/1990.",
    time: "What was your birth time? For example 08:30 AM.",
    place: "Where were you born? City and state, for example Patna, Bihar.",
    done: "I am here. You can ask about career, study, relationships, or your chart.",
  };
  const hg: Record<Step, string> = {
    language: "Namaste, main Gita hoon. Aap Hindi, Hinglish ya English mein baat karna chahenge?",
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

export default function ChatPage() {
  const { lang, me, setLanguage, refresh } = useApp();
  const [topic, setTopic] = useState("general");
  const [step, setStep] = useState<Step>("language");
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [chart, setChart] = useState<PublicChart | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const conversationId = useRef("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("topic") || "";
    const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
    if (["palm", "love", "money", "remedies", "health", "career", "family"].includes(cleaned)) {
      setTopic(cleaned);
    }
    const stored = sessionStorage.getItem("gita_conversation_id");
    conversationId.current =
      stored && /^[0-9a-f-]{36}$/i.test(stored) ? stored : crypto.randomUUID();
    sessionStorage.setItem("gita_conversation_id", conversationId.current);
    const savedDraft = sessionStorage.getItem("gita_birth_draft");
    if (savedDraft) {
      try {
        setDraft({ ...EMPTY_DRAFT, ...JSON.parse(savedDraft) });
      } catch {
        setDraft(EMPTY_DRAFT);
      }
    }
    if (sessionStorage.getItem("gita_lang_confirmed") === "1") setStep("name");
  }, []);

  useEffect(() => {
    if (me?.birth?.name && me.birth.dob && me.birth.birthTime && me.birth.birthPlace) {
      setStep("done");
      setDraft({
        name: me.birth.name,
        dob: me.birth.dob,
        time: me.birth.birthTime,
        place: me.birth.birthPlace,
      });
    }
  }, [me]);

  useEffect(() => {
    if (!conversationId.current) return;
    let cancelled = false;
    fetch("/api/chat?conversationId=" + encodeURIComponent(conversationId.current), {
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (typeof data.conversationId === "string") {
          conversationId.current = data.conversationId;
          sessionStorage.setItem("gita_conversation_id", data.conversationId);
        }
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(
            data.messages.filter(
              (item: Message) =>
                item &&
                (item.role === "user" || item.role === "assistant") &&
                typeof item.content === "string"
            )
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, chart]);

  function push(role: "user" | "assistant", content: string) {
    setMessages((previous) => [...previous, { id: crypto.randomUUID(), role, content }]);
  }

  function remember(next: Draft, nextStep: Step) {
    setDraft(next);
    setStep(nextStep);
    sessionStorage.setItem("gita_birth_draft", JSON.stringify(next));
  }

  async function sendToAi(text: string) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(35000),
        body: JSON.stringify({
          message: text,
          language: lang,
          topic,
          conversationId: conversationId.current,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (typeof data.conversationId === "string") {
        conversationId.current = data.conversationId;
        sessionStorage.setItem("gita_conversation_id", data.conversationId);
      }
      if (!response.ok) {
        push("assistant", typeof data.error === "string" ? data.error : "अभी उत्तर नहीं बन पाया।");
        return;
      }
      push("assistant", typeof data.reply === "string" ? data.reply : "अभी उत्तर खाली आया।");
    } catch (error) {
      const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
      push(
        "assistant",
        timedOut
          ? lang === "hi"
            ? "उत्तर आने में ज़्यादा समय लग गया। कृपया फिर कोशिश करें।"
            : "The reply took too long. Please try again."
          : lang === "hi"
            ? "सर्वर से संपर्क नहीं हो पाया।"
            : "Could not reach the server."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function finishKundli(next: Draft) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: next.name,
          dateOfBirth: next.dob,
          timeOfBirth: next.time,
          placeOfBirth: next.place,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.chart) {
        push("assistant", typeof data.error === "string" ? data.error : "कुंडली गणना नहीं हो सकी। स्थान फिर लिखें।");
        setStep("place");
        return;
      }
      setChart(data.chart as PublicChart);
      setStep("done");
      sessionStorage.removeItem("gita_birth_draft");
      push(
        "assistant",
        lang === "hi"
          ? "आपकी गणना की गई कुंडली तैयार है। नीचे कार्ड देखें।"
          : "Your calculated kundli is ready. The card is below."
      );
      await refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    push("user", text);

    if (looksLikeQuestion(text) && step !== "language") {
      await sendToAi(text);
      return;
    }

    if (step === "language") {
      const value = /hindi|हिंदी|हिन्दी/i.test(text)
        ? "hi"
        : /hinglish|हिंग्लिश/i.test(text)
          ? "hinglish"
          : /english|angrezi|अंग्रेजी/i.test(text)
            ? "en"
            : null;
      if (!value) {
        push("assistant", questionFor("language", lang));
        return;
      }
      await setLanguage(value);
      sessionStorage.setItem("gita_lang_confirmed", "1");
      setStep(me?.birth?.name ? "done" : "name");
      push("assistant", questionFor(me?.birth?.name ? "done" : "name", value));
      return;
    }

    if (step === "name") {
      if (text.length < 2 || text.length > 100) {
        push("assistant", questionFor("name", lang));
        return;
      }
      const next = { ...draft, name: text };
      remember(next, "dob");
      push("assistant", (lang === "hi" ? "धन्यवाद " + text + "। " : "Thank you, " + text + ". ") + questionFor("dob", lang));
      return;
    }

    if (step === "dob") {
      const dob = parseDate(text);
      if (!dob) {
        push("assistant", questionFor("dob", lang));
        return;
      }
      const next = { ...draft, dob };
      remember(next, "time");
      push("assistant", questionFor("time", lang));
      return;
    }

    if (step === "time") {
      const time = parseTime(text);
      if (!time) {
        push("assistant", questionFor("time", lang));
        return;
      }
      const next = { ...draft, time };
      remember(next, "place");
      push("assistant", questionFor("place", lang));
      return;
    }

    if (step === "place") {
      if (text.length < 2) {
        push("assistant", questionFor("place", lang));
        return;
      }
      const next = { ...draft, place: text };
      remember(next, "place");
      push("assistant", lang === "hi" ? "स्थान नोट कर लिया। कुंडली गणना कर रही हूँ।" : "Place noted. I am calculating the chart.");
      await finishKundli(next);
      return;
    }

    await sendToAi(text);
  }

  const shownMessages =
    messages.length > 0
      ? messages
      : [{ id: "welcome", role: "assistant" as const, content: questionFor(step, lang) }];

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-[400px] w-full flex-col bg-night-900 text-violet-50">
      <header className="flex shrink-0 items-center gap-3 border-b border-gold-400/10 px-4 py-3">
        <Link href="/" aria-label="Back" className="text-violet-300 hover:text-gold-300">
          <ArrowLeft size={20} />
        </Link>
        <Avatar size={42} glow={false} />
        <div>
          <h1 className="font-display text-sm font-bold">Gita AI</h1>
          <p className="text-[10px] text-violet-300">{topic === "general" ? "AI Assistant" : topic}</p>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {step === "language" && (
          <div className="flex flex-wrap gap-2">
            {([
              ["hi", "हिन्दी"],
              ["hinglish", "Hinglish"],
              ["en", "English"],
            ] as const).map(([code, label]) => (
              <button
                key={code}
                type="button"
                className="rounded-full border border-gold-400/30 px-3 py-1.5 text-xs font-bold text-gold-300"
                onClick={() => {
                  void setLanguage(code);
                  sessionStorage.setItem("gita_lang_confirmed", "1");
                  setStep(me?.birth?.name ? "done" : "name");
                  push("assistant", questionFor(me?.birth?.name ? "done" : "name", code));
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {shownMessages.map((message) => (
          <div key={message.id} className={"flex " + (message.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={
                "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm " +
                (message.role === "user"
                  ? "bg-violet-600 text-white"
                  : "card border border-gold-400/10 text-violet-100")
              }
            >
              {message.content}
            </div>
          </div>
        ))}

        {chart && (
          <div className="card max-w-[85%] space-y-2 border border-gold-400/20 p-4 text-sm">
            <p className="font-bold text-gold-300">कुंडली तैयार है</p>
            <p>लग्न: {chart.lagna.rashiNameHi} ({chart.lagna.degreeInSign}°)</p>
            <p>राशि: {chart.moonSign.rashiNameHi}</p>
            <p>नक्षत्र: {chart.nakshatra.name}, पद {chart.nakshatra.pada}</p>
            {chart.currentDasha && <p>महादशा: {chart.currentDasha.maha}</p>}
            <Link href="/kundli" className="btn-gold inline-flex px-4 py-2 text-xs">
              कुंडली देखें
            </Link>
          </div>
        )}

        {isLoading && (
          <div className="card inline-flex items-center gap-2 px-4 py-3 text-xs text-violet-300">
            <Sparkles size={14} className="animate-spin text-gold-300" />
            <span>{lang === "hi" ? "गीता लिख रही है..." : "Gita is writing..."}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 border-t border-gold-400/10 bg-night-950 p-3">
        <div className="relative">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={8000}
            disabled={isLoading}
            placeholder={lang === "hi" ? "अपना संदेश लिखें..." : "Type a message..."}
            className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 py-3 pl-4 pr-12 text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-black disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}