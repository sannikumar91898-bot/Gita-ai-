// app/login/page.tsx
"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Sparkles, ShieldCheck, Loader2, Star, Phone, ChevronLeft } from "lucide-react";
import { useApp } from "../Providers";
import { loginWithGoogle, setupRecaptcha, sendPhoneOTP, getFirebaseError, loginWithEmail, registerWithEmail } from "../../lib/firebase";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, refresh, lang } = useApp();
  const isDark = theme === "dark";

  const redirectUrl = searchParams.get("redirect") || "/settings";

  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<"email" | "phone">("email"); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  const getLoginText = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        login: "लॉगिन", createAccount: "अकाउंट बनाएं", welcomeBack: "वापसी पर स्वागत है", joinGita: "गीता AI से जुड़ें",
        loginDesc: "अपने वॉलेट और कुंडली को एक्सेस करने के लिए लॉगिन करें।", joinDesc: "अपनी चैट और कुंडली सेव करने के लिए अकाउंट बनाएं।",
        name: "आपका नाम", email: "ईमेल एड्रेस", password: "पासवर्ड",
        loginBtn: "लॉगिन करें", registerBtn: "रजिस्टर करें",
        noAccount: "अकाउंट नहीं है?", hasAccount: "पहले से अकाउंट है?",
        registerHere: "यहाँ रजिस्टर करें", loginHere: "यहाँ लॉगिन करें", pleaseWait: "कृपया रुकें...",
        secure: "100% सुरक्षित", trusted: "10,000+ यूजर्स का भरोसा",
        orText: "या फिर ईमेल/फोन से", googleBtn: "Google से जारी रखें", githubBtn: "GitHub", phoneBtn: "फोन नंबर",
        phoneLabel: "मोबाइल नंबर", sendOtp: "OTP भेजें", otpLabel: "OTP दर्ज करें", verify: "वेरिफाई करें", back: "वापस",
        initError: "फोन वेरिफिकेशन शुरू नहीं हो पाया। पेज रिफ्रेश करें।"
      },
      hinglish: {
        login: "Login", createAccount: "Create Account", welcomeBack: "Welcome Back", joinGita: "Join Gita AI",
        loginDesc: "Apne wallet aur kundli ko access karne ke liye login karein.", joinDesc: "Apni chats aur kundli save karne ke liye account banayein.",
        name: "Your Name", email: "Email Address", password: "Password",
        loginBtn: "Login", registerBtn: "Register",
        noAccount: "Account nahi hai?", hasAccount: "Pehle se account hai?",
        registerHere: "Yahan register karein", loginHere: "Yahan login karein", pleaseWait: "Kripya rukein...",
        secure: "100% Secure", trusted: "Trusted by 10,000+",
        orText: "YA EMAIL/PHONE SE", googleBtn: "Continue with Google", githubBtn: "GitHub", phoneBtn: "Phone",
        phoneLabel: "Mobile Number", sendOtp: "Send OTP", otpLabel: "Enter OTP", verify: "Verify", back: "Back",
        initError: "Phone verification init nahi hua. Page refresh karein."
      },
      en: {
        login: "Login", createAccount: "Create Account", welcomeBack: "Welcome Back", joinGita: "Join Gita AI",
        loginDesc: "Login to access your wallet and saved kundli.", joinDesc: "Create an account to save your chats and kundli.",
        name: "Your Name", email: "Email Address", password: "Password",
        loginBtn: "Login", registerBtn: "Register",
        noAccount: "Don't have an account?", hasAccount: "Already have an account?",
        registerHere: "Register here", loginHere: "Login here", pleaseWait: "Please wait...",
        secure: "100% Secure", trusted: "Trusted by 10,000+",
        orText: "OR CONTINUE WITH", googleBtn: "Continue with Google", githubBtn: "GitHub", phoneBtn: "Phone",
        phoneLabel: "Mobile Number", sendOtp: "Send OTP", otpLabel: "Enter OTP", verify: "Verify", back: "Back",
        initError: "Phone verification failed to init. Refresh page."
      }
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key] || dict["hi"][key];
  };

  const t = (key: string) => getLoginText(key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-2xl" : "border-orange-100 bg-white shadow-xl";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-[#0A0F19] p-3.5 pl-11 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-white transition-colors"
    : "w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 pl-11 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-gray-900 transition-colors";

  useEffect(() => {
    if (method !== "phone") return;
    const verifier = setupRecaptcha("recaptcha-container");
    setRecaptchaVerifier(verifier);
  }, [method]);

  const authenticateWithBackend = async (token: string, identifier: string) => {
    try {
      const res = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, identifier, language: lang }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Authentication failed (${res.status})`);

      await refresh();
      router.replace(redirectUrl); 
      router.refresh(); 
    } catch (err: any) {
      console.error("Backend authentication error:", err);
      setError(err.message || "Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isLogin) {
        result = await loginWithEmail(email, password);
      } else {
        result = await registerWithEmail(email, password);
      }

      if (result.error) {
        setError(getFirebaseError(lang, result.error));
        setLoading(false);
        return;
      }

      if (result.user) {
        const idToken = await result.user.getIdToken();
        await authenticateWithBackend(idToken, result.user.email || email);
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null); setLoading(true);
    try {
      const { user, error: fbError } = await loginWithGoogle();
      if (fbError) { setError(getFirebaseError(lang, fbError)); setLoading(false); }
      else if (user) {
        const idToken = await user.getIdToken();
        await authenticateWithBackend(idToken, user.email || "");
      }
    } catch (err) { setError("Google login failed."); setLoading(false); }
  };

  const handleSendOtp = async () => {
    setError(null); 
    if (phone.length !== 10) {
      setError(lang === "hi" ? "कृपया 10 अंकों का सही नंबर दर्ज करें।" : "Please enter a valid 10-digit number.");
      return;
    }
    if (!recaptchaVerifier) { setError(t("initError")); return; }

    setLoading(true);
    try {
      const { result, error: fbError } = await sendPhoneOTP(`+91${phone}`, recaptchaVerifier);
      if (fbError) { setError(getFirebaseError(lang, fbError)); }
      else if (result) { setConfirmationResult(result); setShowOtp(true); }
    } catch (err) { setError("Failed to send OTP. Try again."); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setError(null); 
    if (otp.length !== 6) { setError(lang === "hi" ? "कृपया 6 अंकों का सही OTP दर्ज करें।" : "Please enter the correct 6-digit OTP."); return; }
    if (!confirmationResult) return;

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      await authenticateWithBackend(idToken, result.user.phoneNumber || "");
    } catch (err: any) { setError(lang === "hi" ? "गलत OTP।" : "Invalid OTP."); }
    finally { setLoading(false); }
  };

  return (
    <main className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden ${pageClass}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] max-w-[700px] max-h-[700px] bg-gradient-to-b from-[#ff6b00]/30 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <header className={`flex items-center justify-between rounded-2xl border p-3 mb-6 backdrop-blur-md bg-opacity-80 ${cardClass}`}>
          <div className="flex items-center gap-3">
            <Link href={redirectUrl} className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:text-white" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-[15px] font-black uppercase tracking-wider text-[#ff6b00]">
              {isLogin ? t("login") : t("createAccount")}
            </h1>
          </div>
        </header>

        <div className={`rounded-[2rem] border p-6 sm:p-8 ${cardClass} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 blur-3xl rounded-full pointer-events-none"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="mx-auto w-20 h-20 relative flex items-center justify-center mb-5 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6b00] to-[#ff3d00] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <div className={`relative flex items-center justify-center w-full h-full rounded-full border-2 backdrop-blur-xl shadow-[inset_0_0_20px_rgba(255,107,0,0.2)] ${isDark ? "border-white/10 bg-white/5" : "border-white bg-white/60"}`}>
                <Sparkles className="text-white drop-shadow-[0_0_12px_rgba(255,107,0,1)]" size={36} strokeWidth={2.5} />
              </div>
            </div>
            <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {isLogin ? t("welcomeBack") : t("joinGita")}
            </h2>
            <p className={`text-[13px] font-medium leading-relaxed max-w-[280px] mx-auto ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {isLogin ? t("loginDesc") : t("joinDesc")}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[13px] font-bold text-rose-500 break-words animate-in fade-in slide-in-from-top-2 relative z-10">
              {error}
            </div>
          )}

          <div className="mb-6 relative z-10">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 font-bold text-[15px] transition-all active:scale-95 disabled:opacity-70 ${
                isDark ? "bg-white border-white text-gray-900 hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-md"
              }`}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t("googleBtn")}
            </button>
          </div>

          <div className="mb-6 flex items-center gap-4 relative z-10">
            <div className={`flex-1 h-px ${isDark ? "bg-slate-800" : "bg-gray-200"}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("orText")}</span>
            <div className={`flex-1 h-px ${isDark ? "bg-slate-800" : "bg-gray-200"}`}></div>
          </div>

          <div className={`flex p-1 rounded-xl mb-6 relative z-10 ${isDark ? "bg-[#0A0F19]" : "bg-gray-100"}`}>
            <button 
              onClick={() => { setMethod("email"); setShowOtp(false); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold rounded-lg transition-all ${method === "email" ? "bg-white dark:bg-[#1e293b] text-[#ff6b00] shadow-sm" : "text-gray-500"}`}
            >
              <Mail size={16} /> {t("email")}
            </button>
            <button 
              onClick={() => { setMethod("phone"); setShowOtp(false); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold rounded-lg transition-all ${method === "phone" ? "bg-white dark:bg-[#1e293b] text-[#ff6b00] shadow-sm" : "text-gray-500"}`}
            >
              <Phone size={16} /> {t("phoneBtn")}
            </button>
          </div>

          <div className="relative z-10">
            {method === "email" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder={t("name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff3d00] px-4 py-4 font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {loading ? t("pleaseWait") : isLogin ? t("loginBtn") : t("registerBtn")}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                {!showOtp ? (
                  <>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        placeholder={t("phoneLabel")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff3d00] px-4 py-4 font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                      {loading ? t("pleaseWait") : t("sendOtp")}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder={t("otpLabel")}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6b00] to-[#ff3d00] px-4 py-4 font-bold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                      {loading ? t("pleaseWait") : t("verify")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowOtp(false); setOtp(""); }}
                      className="w-full mt-2 flex justify-center items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-[#ff6b00] transition-colors"
                    >
                      <ChevronLeft size={16} /> {t("back")}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 text-center relative z-10">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className={`text-[13px] font-bold transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
            >
              {isLogin ? t("noAccount") : t("hasAccount")}
              <span className="ml-1 text-[#ff6b00] hover:underline">
                {isLogin ? t("registerHere") : t("loginHere")}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 relative z-10">
          <span className={`flex items-center gap-1.5 text-[11px] font-bold ${isDark ? "text-emerald-500/80" : "text-emerald-600"}`}>
            <ShieldCheck size={14} /> {t("secure")}
          </span>
          <span className={`flex items-center gap-1.5 text-[11px] font-bold ${isDark ? "text-amber-500/80" : "text-amber-600"}`}>
            <Star size={14} /> {t("trusted")}
          </span>
        </div>
      </div>

      <div id="recaptcha-container"></div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F19] text-white">
        <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
