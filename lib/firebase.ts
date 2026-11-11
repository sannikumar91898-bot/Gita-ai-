// app/login/page.tsx
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, Github, Chrome, UserPlus } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Login ya Register mode
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/"); // Login hone ke baad home page par bhejega
    } catch (err: any) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GitHub Login
  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "GitHub login failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Email/Password Login & Register
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#0A0F19] px-4 py-10 text-white font-sans">
      
      <div className="w-full max-w-md space-y-6 rounded-[2rem] bg-[#151d2c] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800">
        
        {/* HEADER */}
        <div className="text-center">
          <Link href="/" className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A00] to-[#FF3D00] mb-4 shadow-lg shadow-orange-500/20 hover:scale-105 transition-transform">
            <Sparkles className="text-white" size={36} />
          </Link>
          <h2 className="text-2xl font-black">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-[13px] text-slate-400 mt-1">Login to continue with Gita AI</p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[12px] p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-[#0A0F19] py-4 pl-12 pr-4 text-[15px] outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 transition-all text-white"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-[#0A0F19] py-4 pl-12 pr-4 text-[15px] outline-none focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 transition-all text-white"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff8a00] py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? "Please wait..." : (isLogin ? "Login" : "Register Now")}
          </button>
        </form>

        {/* TOGGLE LOGIN/REGISTER */}
        <p className="text-center text-[13px] text-slate-400 font-medium">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#ff6b00] font-bold hover:underline">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-800 after:h-px after:flex-1 after:bg-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Or continue with
        </div>

        {/* SOCIAL LOGINS */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading} 
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0A0F19] border border-slate-700 py-3.5 text-[13px] font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-all active:scale-95"
          >
            <Chrome size={18} className="text-blue-500" /> Google
          </button>
          <button 
            onClick={handleGithubLogin} 
            disabled={loading} 
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0A0F19] border border-slate-700 py-3.5 text-[13px] font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-all active:scale-95"
          >
            <Github size={18} className="text-white" /> GitHub
          </button>
        </div>

      </div>
    </div>
  );
}