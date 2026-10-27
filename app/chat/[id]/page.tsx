// app/chat/[id]/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INTENT_CHIPS = [
  "मेरी शादी कब होगी?",
  "करियर में सफलता कब मिलेगी?",
  "मुझे कौन सा रत्न पहनना चाहिए?",
  "क्या मेरा पार्टनर सच्चा है?",
];

export default function AstrologerChatPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";
  const astrologer = getAstrologerById(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!astrologer) {
      router.replace("/");
      return;
    }

    // Load latest conversation (API uses conversationId, not topic for GET)
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => {
        if (data.conversationId) setConversationId(data.conversationId);
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            }))
          );
        }
      })
      .catch(() => {});
  }, [id, astrologer, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading || !astrologer) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          topic: astrologer.topic, // only valid topics
          conversationId: conversationId || undefined,
          persona: astrologer.id, // safe server-side mapping
        }),
      });

      const data = await res.json();

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message?.id || crypto.randomUUID(),
            role: "assistant",
            content: data.reply,
          },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.error,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "क्षमा करें, उत्तर नहीं मिल पाया। कृपया फिर कोशिश करें।",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "नेटवर्क की समस्या है। कृपया फिर से भेजें।",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9E6]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFF9E6]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-orange-100 px-3 py-3 flex items-center gap-3">
        <Link href="/" className="text-2xl leading-none">
          ←
        </Link>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-200 flex-shrink-0">
          <Image
            src={astrologer.photo}
            alt={astrologer.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 text-sm truncate">
            {astrologer.name}
          </h1>
          <p className="text-[11px] text-green-600">Online</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-500 mt-10 px-4">
            <p className="font-medium text-gray-800 text-base">{astrologer.name}</p>
            <p className="mt-2">{astrologer.shortBio}</p>
            <p className="mt-6 text-xs text-gray-400">
              नीचे से सवाल चुनें या अपना सवाल टाइप करें
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-orange-500 text-white rounded-br-md"
                  : "bg-white text-gray-800 border border-orange-100 rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-orange-100 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-500">
              Typing...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Intent Chips */}
      {messages.length === 0 && (
        <div className="px-3 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {INTENT_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="flex-shrink-0 bg-white border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-orange-100 bg-white px-3 py-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="अपना सवाल लिखें..."
          className="flex-1 bg-[#FFF9E6] border border-orange-100 rounded-full px-4 py-2.5 text-sm outline-none focus:border-orange-400"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition"
        >
          →
        </button>
      </div>
    </div>
  );
}
const PERSONA_PROMPTS: Record<string, string> = {
  gita: `You are Gita, a warm, modern, friendly Tarot & Relationship expert. Speak in natural Hinglish. Be supportive and practical. Focus on Love, Relationships and Career. Never scare the user.`,
  kriti: `You are Acharya Kriti, a precise Vedic astrologer specialising in Kundli, Career and Business. Speak mainly in clear Hindi. Be professional and solution-oriented.`,
  devaki: `You are Dr. Devaki Shastri, an experienced Vedic and KP System astrologer. Speak in refined Hindi mixed with Sanskrit terms when relevant. Be analytical and structured.`,
  gargi: `You are Gargi Maa, a spiritual guide and remedies expert. Speak only in pure, simple, motherly Hindi. Be warm, compassionate and calming. Focus on remedies, Vastu and positive mindset.`,
};
