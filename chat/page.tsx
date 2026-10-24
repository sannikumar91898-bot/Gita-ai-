"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const { t } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "प्रणाम! मैं गीता एआई हूँ, आपकी व्यक्तिगत एआई ज्योतिषी। आज आप अपने जीवन, करियर या भविष्य के बारे में क्या जानना चाहते हैं? मुझसे पूछें।",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ऑटोमैटिक नीचे स्क्रॉल करने के लिए
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // आपके API राउट से कनेक्ट करने के लिए
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "क्षमा करें, मैं अभी आपकी बात का उत्तर देने में असमर्थ हूँ। कृपया पुनः प्रयास करें।",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "नेटवर्क में कुछ समस्या आ रही है। कृपया थोड़ी देर बाद प्रयास करें। 🙏",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full flex-col bg-night-900 text-violet-50">
      {/* चैट हेडर */}
      <header className="flex items-center gap-3 border-b border-gold-400/10 px-4 py-3">
        <Link href="/" className="text-violet-300 hover:text-gold-300">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/30">
            <Bot size={18} />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold sm:text-base">Gita AI Astrologer</h1>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </header>

      {/* मैसेजेस एरिया */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-tr-none"
                  : "card border border-gold-400/10 text-violet-100 rounded-tl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="card border border-gold-400/10 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-violet-300 flex items-center gap-2">
              <Sparkles size={14} className="animate-spin text-gold-300" />
              <span>गीता जी आपकी कुंडली का अध्ययन कर रही हैं...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* इनपुट फॉर्म */}
      <form onSubmit={handleSubmit} className="border-t border-gold-400/10 p-3 bg-night-950">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="अपना सवाल यहाँ टाइप करें (जैसे: मेरा करियर कैसा रहेगा?)..."
            className="w-full rounded-xl bg-violet-950/40 border border-gold-400/20 py-3 pl-4 pr-12 text-sm text-violet-100 placeholder-violet-400/60 focus:border-gold-300 focus:outline-none focus:ring-1 focus:ring-gold-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-black transition-all hover:bg-gold-300 disabled:bg-violet-950/80 disabled:text-violet-500"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
    }
