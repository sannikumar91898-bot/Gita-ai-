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
  const id = params.id as string;
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
    // Load existing conversation if any (reuses existing /api/chat GET)
    fetch(`/api/chat?topic=${id}`)
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
          topic: id, // reuse existing topic field for astrologer context
          conversationId,
          // The existing API already injects system context + kundli.
          // We prepend persona in the message for now so Gemini follows the correct voice.
          systemHint: astrologer.systemPrompt,
        }),
      });

      const data = await res.json();

      if (data.conversationId) setConversationId(data.conversationId);

      if (data.reply || data.message || data.content) {
        const reply = data.reply || data.message || data.content;
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: reply,
          },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.error || "क्षमा करें, कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।",
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFF9E6]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-orange-100 px-3 py-3 flex items-center gap-3">
        <Link href="/" className="text-2xl">
          ←
        </Link>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-200">
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
          <div className="text-center text-sm text-gray-500 mt-8">
            <p className="font-medium text-gray-700">{astrologer.name}</p>
            <p className="mt-1">{astrologer.shortBio}</p>
            <p className="mt-4 text-xs">नीचे से सवाल चुनें या टाइप करें</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
        <div className="px-3 pb-2 flex gap-2 overflow-x-auto">
          {INTENT_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="flex-shrink-0 bg-white border border-orange-200 text-orange-700 text-xs px-3 py-1.5 rounded-full"
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="अपना सवाल लिखें..."
          className="flex-1 bg-[#FFF9E6] border border-orange-100 rounded-full px-4 py-2.5 text-sm outline-none focus:border-orange-400"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
