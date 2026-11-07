// app/components/HistorySidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { X, MessageSquare, Plus, Loader2 } from "lucide-react";
import { useApp } from "../Providers"; // Path apne project ke hisaab se check karein

type HistoryItem = {
  id: string;
  title: string;
  persona: string;
  updatedAt: string;
};

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentConversationId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

export default function HistorySidebar({ isOpen, onClose, currentConversationId, onSelectChat, onNewChat }: HistorySidebarProps) {
  const { theme } = useApp();
  const isDark = theme === "dark";
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/chat/history");
        const data = await res.json();
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [isOpen]);

  // Format Date (Aaj, Kal ya Date)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return "Today";
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Overlay (Background Dark) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-[110] w-72 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? "bg-[#0B0F19] border-r border-slate-800 text-slate-100" : "bg-white border-r border-orange-100 text-slate-900"}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDark ? "border-slate-800" : "border-gray-200"}`}>
          <h2 className="text-sm font-black text-orange-500 uppercase tracking-wider">Chat History</h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}>
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button 
            onClick={onNewChat}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm ${
              isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700 border border-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200"
            }`}
          >
            <Plus size={16} /> New Chat
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-20 text-orange-500">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <p className={`text-center text-xs mt-10 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              No previous chats found.
            </p>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectChat(item.id);
                  onClose();
                }}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all ${
                  currentConversationId === item.id 
                    ? (isDark ? "bg-orange-950/30 border border-orange-900/50" : "bg-orange-50 border border-orange-200") 
                    : (isDark ? "hover:bg-slate-800/50 border border-transparent" : "hover:bg-gray-50 border border-transparent")
                }`}
              >
                <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${currentConversationId === item.id ? "bg-orange-500 text-white" : isDark ? "bg-slate-800 text-slate-400" : "bg-gray-200 text-gray-500"}`}>
                  <MessageSquare size={12} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-sm font-bold truncate ${currentConversationId === item.id ? "text-orange-500" : ""}`}>
                    {item.title || "New Chat"}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                    {item.persona} • {formatDate(item.updatedAt)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}