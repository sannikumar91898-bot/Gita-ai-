
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type AstrologerId = "gita" | "kriti" | "devaki" | "gargi";

const ASTROLOGER_TOPICS: Record<AstrologerId, string> = {
  gita: "love",
  kriti: "career",
  devaki: "general",
  gargi: "remedies",
};

const INTENT_CHIPS = [
  "मेरी शादी कब होगी?",
  "करियर में सफलता कैसे मिलेगी?",
  "मुझे कौन सा रत्न पहनना चाहिए?",
  "क्या मेरा पार्टनर सच्चा है?",
];

function createMessageId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AstrologerChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";

  const astrologer = getAstrologerById(id);
  const validId =
    id === "gita" ||
    id === "kriti" ||
    id === "devaki" ||
    id === "gargi";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);

  useEffect(() => {
    if (!validId || !astrologer) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      setHistoryLoading(true);

      try {
        // API GET contract: accepts conversationId, not topic.
        const response = await fetch("/api/chat", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Chat history load nahi hui.");
        }

        if (cancelled) return;

        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        if (Array.isArray(data.messages)) {
          const history: Message[] = data.messages
            .filter(
              (message: unknown): message is {
                id: string;
                role: "user" | "assistant";
                content: string;
              } => {
                if (!message || typeof message !== "object") return false;

                const item = message as Record<string, unknown>;

                return (
                  typeof item.id === "string" &&
                  (item.role === "user" || item.role === "assistant") &&
                  typeof item.content === "string"
                );
              },
            )
            .map((message) => ({
              id: message.id,
              role: message.role,
              content: message.content,
            }));

          setMessages(history);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Chat history error:", error);
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [id, validId, astrologer, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const cleanText = text.trim();

      if (
        !cleanText ||
        requestInProgress.current ||
        !astrologer ||
        !validId
      ) {
        return;
      }

      requestInProgress.current = true;
      setLoading(true);
      setInput("");

      const userMessage: Message = {
        id: createMessageId(),
        role: "user",
        content: cleanText,
      };

      setMessages((previous) => [...previous, userMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: cleanText,
            topic: ASTROLOGER_TOPICS[id as AstrologerId],
            conversationId: conversationId || undefined,
            persona: id,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            typeof data.error === "string"
              ? data.error
              : "अभी उत्तर नहीं मिल पाया। कृपया दोबारा कोशिश करें।",
          );
        }

        if (typeof data.conversationId === "string") {
          setConversationId(data.conversationId);
        }

        const reply =
          typeof data.reply === "string"
            ? data.reply
            : typeof data.message === "string"
              ? data.message
              : typeof data.content === "string"
                ? data.content
                : null;

        if (!reply) {
          throw new Error(
            "उत्तर खाली मिला। कृपया अपना सवाल दोबारा भेजें।",
          );
        }

        setMessages((previous) => [
          ...previous,
          {
            id:
              typeof data.message?.id === "string"
                ? data.message.id
                : createMessageId(),
            role: "assistant",
            content: reply,
          },
        ]);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "नेटवर्क की समस्या है। कृपया फिर से कोशिश करें।";

        setMessages((previous) => [
          ...previous,
          {
            id: createMessageId(),
            role: "assistant",
            content: errorMessage,
          },
        ]);
      } finally {
        requestInProgress.current = false;
        setLoading(false);
      }
    },
    [astrologer, validId, id, conversationId],
  );

  if (!astrologer || !validId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9E6]">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-[#FFF9E6]">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-orange-100 bg-white px-3 py-3">
        <Link href="/" className="text-2xl leading-none" aria-label="Home">
          ←
        </Link>

        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-orange-200">
          <Image
            src={astrologer.photo}
            alt={astrologer.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-gray-900">
            {astrologer.name}
          </h1>
          <p className="text-[11px] text-green-600">AI Astrology Guide</p>
        </div>
      </header>

      <main
        className="flex-1 space-y-3 overflow-y-auto px-3 py-4"
        aria-live="polite"
      >
        {historyLoading && messages.length === 0 && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Chat load ho rahi hai...
          </p>
        )}

        {!historyLoading && messages.length === 0 && (
          <div className="mt-10 px-4 text-center text-sm text-gray-500">
            <p className="text-base font-medium text-gray-800">
              {astrologer.name}
            </p>
            <p className="mt-2">{astrologer.shortBio}</p>
            <p className="mt-6 text-xs text-gray-400">
              नीचे से सवाल चुनें या अपना सवाल लिखें।
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === "user"
                  ? "rounded-br-md bg-orange-500 text-white"
                  : "rounded-bl-md border border-orange-100 bg-white text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-orange-100 bg-white px-4 py-3 text-sm text-gray-500">
              जवाब तैयार हो रहा है...
            </div>
          </div>
        )}

        <div ref={endRef} />
      </main>

      {messages.length === 0 && !historyLoading && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-2">
          {INTENT_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void sendMessage(chip)}
              disabled={loading}
              className="flex-shrink-0 whitespace-nowrap rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs text-orange-700 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex items-center gap-2 border-t border-orange-100 bg-white px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="अपना सवाल लिखें..."
          aria-label="अपना सवाल लिखें"
          className="flex-1 rounded-full border border-orange-100 bg-[#FFF9E6] px-4 py-2.5 text-sm outline-none focus:border-orange-400"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition active:scale-95 disabled:opacity-50"
        >
          →
        </button>
      </form>
    </div>
  );
}
