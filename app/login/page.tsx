// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useApp } from "../Providers";

export default function LoginPage() {
  const router = useRouter();
  const { theme, refresh } = useApp();
  const isDark = theme === "dark";

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#1e293b]" : "border-orange-100 bg-white shadow-sm";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-900 p-3 pl-10 text-sm focus:border-orange-500 focus:outline-none text-white"
    : "w-full rounded-xl border border-gray-300 bg-white p-3 pl-10 text-sm focus:border-orange-500 focus:outline-none text-gray-900";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      // 🔥 YAHAN FIX KIYA HAI: data.details ko pehle check karega 🔥
      if (!res.ok) throw new Error(data.details || data.error || "Something went wrong");

      // 🔥 Login/Register success! Ab Providers ko refresh karo taaki naya user load ho
      await refresh();
      router.push("/settings"); // Profile page par bhej do
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen w-full px-4 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-md space-y-6">
        
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/settings" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
            {isLogin ? "Login" : "Create Account"}
          </h1>
        </header>

        <div className={`rounded-3xl border p-6 sm:p-8 ${cardClass}`}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">{isLogin ? "Welcome Back" : "Join Gita AI"}</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {isLogin ? "Login to access your wallet, orders, and saved kundli." : "Create an account to save your chats and kundli."}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500 bg-red-500/10 p-3 text-sm text-red-500 break-words">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your Name"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-600 px-4 py-3 font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className={isDark ? "text-slate-400" : "text-gray-500"}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-bold text-orange-500 hover:underline"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}