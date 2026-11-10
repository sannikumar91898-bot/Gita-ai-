// components/WriteReview.tsx
"use client";

import { useState } from "react";
import { Star, X, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function WriteReview({ persona, isDark }: { persona: string, isDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) {
      setError("Kripya apna naam aur review dono likhein.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          reviewerName: name,
          stars,
          comment
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review submit nahi ho paya.");

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setComment("");
        setName("");
        setStars(5);
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`w-full mt-4 rounded-xl py-3 text-sm font-bold border transition-all ${
          isDark 
            ? "border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20" 
            : "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100"
        }`}
      >
        ✍️ Apna Review Likhein
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 ${
            isDark ? "bg-[#151E2E] border border-slate-800" : "bg-white"
          }`}>
            
            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={60} className="text-emerald-500 mb-4 animate-bounce" />
                <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Dhanyawad! 🙏</h2>
                <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  Aapka review successfully submit ho gaya hai. Admin verify karne ke baad ye live hoga.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>Apna Anubhav Share Karein</h2>
                  <button type="button" onClick={() => setIsOpen(false)} className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}>
                    <X size={18} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-300" : "text-gray-700"}`}>Aapka Naam</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-800 text-white" : "border-gray-200 bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                <div className="mb-4">
                  <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-300" : "text-gray-700"}`}>Rating (Stars)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStars(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          fill={star <= stars ? "#F59E0B" : "transparent"} 
                          className={star <= stars ? "text-amber-500" : isDark ? "text-slate-600" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-300" : "text-gray-700"}`}>Aapka Review</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Apna anubhav likhein..."
                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none resize-none ${
                      isDark ? "border-slate-700 bg-slate-800 text-white" : "border-gray-200 bg-gray-50 text-gray-900"
                    }`}
                  />
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : <><Send size={18} /> Submit Review</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}