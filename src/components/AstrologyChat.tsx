"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, User, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface AstrologyChatProps {
  userId: string;
  conversationId: string;
  personaName?: string;
}

export default function AstrologyChat({ 
  userId, 
  conversationId, 
  personaName = "Pandit Ji" 
}: AstrologyChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // चैट स्क्रीन को हमेशा ऑटो-स्क्रॉल नीचे रखना
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // मैसेज भेजने का मुख्य फंक्शन
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    
    // 1. यूज़र का मैसेज स्क्रीन पर तुरंत दिखाएं
    const newHistory: Message[] = [...messages, { role: "user", content: userQuery }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // 2. बैकएंड API रूट को हिट करें
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          conversationId,
          message: userQuery,
        }),
      });

      const data = await response.json();

      if (data.response) {
        // 3. पंडित जी का कड़क जवाब स्क्रीन पर रेंडर करें
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "क्षमा करें, ग्रहों की स्थिति अनुकूल न होने के कारण संपर्क टूट गया। कृपया पुनः प्रयास करें।" }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-amber-50/30 border border-amber-200 rounded-2xl shadow-xl overflow-hidden">
      {/* प्रीमियम पंडित जी हेडर */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-full border border-white/30 animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-bold text-lg tracking-wide">{personaName}</h3>
            <p className="text-xs text-amber-100 flex items-center gap-1">🟢 100% सटीक गणना चालू है</p>
          </div>
        </div>
      </div>

      {/* मैसेजेस चैंबर एरिया */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-amber-50/20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <p className="text-amber-800 font-semibold text-lg">प्रणाम! आज आपकी किस समस्या का समाधान चाहिए?</p>
            <p className="text-xs text-amber-600/70 max-w-sm">विवाह, व्यापार, धन लाभ या नौकरी की सटीक समय-सीमा जानने के लिए अपना प्रश्न पूछें।</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="p-2 bg-amber-600 rounded-full text-white mt-1 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none font-medium"
                  : "bg-white border border-amber-100 text-amber-950 rounded-tl-none font-normal"
              }`}
            >
              {msg.content}
            </div>

            {msg.role === "user" && (
              <div className="p-2 bg-orange-100 rounded-full text-orange-600 mt-1 shadow-sm border border-orange-200">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* पंडित जी थिंकिंग इंडिकेटर */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start">
            <div className="p-2 bg-amber-600 rounded-full text-white mt-1">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-amber-100 text-amber-700/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 shadow-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              पंडित जी ग्रहों की गणना कर रहे हैं...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* इनपुट सेंड बार */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-amber-100 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="अपना सवाल यहाँ लिखें (उदा: मेरी शादी कब होगी?)..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-amber-50/50 border border-amber-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-amber-950 placeholder-amber-700/40 font-medium disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
