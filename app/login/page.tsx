// app/login/page.tsx
"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Sparkles, ShieldCheck, Loader2, Star, Phone, ChevronLeft, Github } from "lucide-react";
import { useApp } from "../Providers";
import { loginWithGoogle, loginWithGithub, setupRecaptcha, sendPhoneOTP, getFirebaseError } from "../../lib/firebase";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, refresh, lang } = useApp();
  const isDark = theme === "dark";

  const redirectUrl = searchParams.get("redirect") || "/settings";

  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<"email" | "phone">("email"); 

  // Email State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); 

  // 10 Languages Dictionary
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
      },
      // Shortened for brevity, keeping other languages intact
      te: { login: "లాగిన్", createAccount: "ఖాతా సృష్టించండి", welcomeBack: "తిరిగి స్వాగతం", joinGita: "గీత AIలో చేరండి", loginDesc: "మీ వాలెట్ మరియు కుండలిని యాక్సెస్ చేయడానికి లాగిన్ చేయండి.", joinDesc: "మీ చాట్లు సేవ్ చేయడానికి ఖాతా సృష్టించండి.", name: "మీ పేరు", email: "ఇమెయిల్", password: "పాస్‌వర్డ్", loginBtn: "లాగిన్", registerBtn: "నమోదు చేయండి", noAccount: "ఖాతా లేదా?", hasAccount: "ఖాతా ఉందా?", registerHere: "నమోదు చేయండి", loginHere: "లాగిన్ చేయండి", pleaseWait: "వేచి ఉండండి...", secure: "100% సురక్షితం", trusted: "10,000+ నమ్మకం", orText: "లేదా ఈమెయిల్/ఫోన్ తో", googleBtn: "Google తో కొనసాగండి", githubBtn: "GitHub", phoneBtn: "ఫోన్", phoneLabel: "మొబైల్ నంబర్", sendOtp: "OTP పంపండి", otpLabel: "OTP నమోదు చేయండి", verify: "ధృవీకరించండి", back: "వెనుకకు", initError: "ఫోన్ వెరిఫికేషన్ ప్రారంభం కాలేదు." },
      ta: { login: "உள்நுழை", createAccount: "கணக்கை உருவாக்கு", welcomeBack: "மீண்டும் வருக", joinGita: "கீதா AI இல் சேரவும்", loginDesc: "உங்கள் பணப்பை மற்றும் ஜாதகத்தை அணுக உள்நுழையவும்.", joinDesc: "உங்கள் அரட்டைகளை சேமிக்க கணக்கை உருவாக்கவும்.", name: "உங்கள் பெயர்", email: "மின்னஞ்சல்", password: "கடவுச்சொல்", loginBtn: "உள்நுழை", registerBtn: "பதிவு செய்", noAccount: "கணக்கு இல்லையா?", hasAccount: "கணக்கு உள்ளதா?", registerHere: "பதிவு செய்யவும்", loginHere: "உள்நுழையவும்", pleaseWait: "காத்திருங்கள்...", secure: "100% பாதுகாப்பானது", trusted: "10,000+ நம்பிக்கை", orText: "அல்லது மின்னஞ்சல்/தொலைபேசி", googleBtn: "Google மூலம் தொடரவும்", githubBtn: "GitHub", phoneBtn: "தொலைபேசி", phoneLabel: "மொபைல் எண்", sendOtp: "OTP அனுப்பு", otpLabel: "OTP ஐ உள்ளிடவும்", verify: "சரிபார்க்கவும்", back: "பின்னால்", initError: "தொலைபேசி சரிபார்ப்பு தோல்வியடைந்தது." },
      kn: { login: "ಲಾಗಿನ್", createAccount: "ಖಾತೆ ರಚಿಸಿ", welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ", joinGita: "ಗೀತಾ AI ಗೆ ಸೇರಿ", loginDesc: "ನಿಮ್ಮ ವಾಲೆಟ್ ಮತ್ತು ಕುಂಡಲಿಯನ್ನು ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.", joinDesc: "ನಿಮ್ಮ ಚಾಟ್‌ಗಳನ್ನು ಉಳಿಸಲು ಖಾತೆ ರಚಿಸಿ.", name: "ನಿಮ್ಮ ಹೆಸರು", email: "ಇಮೇಲ್", password: "ಪಾಸ್‌ವರ್ಡ್", loginBtn: "ಲಾಗಿನ್", registerBtn: "ನೋಂದಾಯಿಸಿ", noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?", hasAccount: "ಖಾತೆ ಇದೆಯೇ?", registerHere: "ನೋಂದಾಯಿಸಿ", loginHere: "ಲಾಗಿನ್ ಮಾಡಿ", pleaseWait: "ನಿರೀಕ್ಷಿಸಿ...", secure: "100% ಸುರಕ್ಷಿತ", trusted: "10,000+ ನಂಬಿಕೆ", orText: "ಅಥವಾ ಇಮೇಲ್/ಫೋನ್", googleBtn: "Google ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ", githubBtn: "GitHub", phoneBtn: "ಫೋನ್", phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", sendOtp: "OTP ಕಳುಹಿಸಿ", otpLabel: "OTP ನಮೂದಿಸಿ", verify: "ಪರಿಶೀಲಿಸಿ", back: "ಹಿಂದೆ", initError: "ಫೋನ್ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ." },
      bn: { login: "লগইন", createAccount: "অ্যাকাউন্ট তৈরি করুন", welcomeBack: "স্বাগতম", joinGita: "গীতা AI-তে যোগ দিন", loginDesc: "আপনার ওয়ালেট এবং কুণ্ডলী অ্যাক্সেস করতে লগইন করুন।", joinDesc: "আপনার চ্যাট সংরক্ষণ করতে অ্যাকাউন্ট তৈরি করুন।", name: "আপনার নাম", email: "ইমেল", password: "পাসওয়ার্ড", loginBtn: "লগইন", registerBtn: "নিবন্ধন করুন", noAccount: "অ্যাকাউন্ট নেই?", hasAccount: "অ্যাকাউন্ট আছে?", registerHere: "নিবন্ধন করুন", loginHere: "লগইন করুন", pleaseWait: "অপেক্ষা করুন...", secure: "100% সুরক্ষিত", trusted: "10,000+ আস্থা", orText: "অথবা ইমেল/ফোন", googleBtn: "Google এর সাথে চালিয়ে যান", githubBtn: "GitHub", phoneBtn: "ফোন", phoneLabel: "মোবাইল নম্বর", sendOtp: "OTP পাঠান", otpLabel: "OTP লিখুন", verify: "যাচাই করুন", back: "ফিরে যান", initError: "ফোন যাচাইকরণ ব্যর্থ হয়েছে।" },
      mr: { login: "लॉग इन करा", createAccount: "खाते तयार करा", welcomeBack: "स्वागत आहे", joinGita: "गीता AI मध्ये सामील व्हा", loginDesc: "तुमचे वॉलेट आणि कुंडली ॲक्सेस करण्यासाठी लॉग इन करा.", joinDesc: "तुमच्या चॅट जतन करण्यासाठी खाते तयार करा.", name: "तुमचे नाव", email: "ईमेल", password: "पासवर्ड", loginBtn: "लॉग इन करा", registerBtn: "नोंदणी करा", noAccount: "खाते नाही?", hasAccount: "खाते आहे?", registerHere: "नोंदणी करा", loginHere: "लॉग इन करा", pleaseWait: "थांबा...", secure: "100% सुरक्षित", trusted: "10,000+ विश्वास", orText: "किंवा ईमेल/फोन", googleBtn: "Google सह सुरू ठेवा", githubBtn: "GitHub", phoneBtn: "फोन", phoneLabel: "मोबाइल नंबर", sendOtp: "OTP पाठवा", otpLabel: "OTP प्रविष्ट करा", verify: "सत्यापित करा", back: "मागे", initError: "फोन सत्यापन अयशस्वी." },
      gu: { login: "લોગિન", createAccount: "એકાઉન્ટ બનાવો", welcomeBack: "સ્વાગત છે", joinGita: "ગીતા AI માં જોડાઓ", loginDesc: "તમારા વોલેટ અને કુંડળી ઍક્સેસ કરવા લોગિન કરો.", joinDesc: "તમારી ચેટ સાચવવા એકાઉન્ટ બનાવો.", name: "તમારું નામ", email: "ઇમેઇલ", password: "પાસવર્ડ", loginBtn: "લોગિન", registerBtn: "નોંધણી કરો", noAccount: "એકાઉન્ટ નથી?", hasAccount: "એકાઉન્ટ છે?", registerHere: "નોંધણી કરો", loginHere: "લોગિન કરો", pleaseWait: "રાહ જુઓ...", secure: "100% સુરક્ષિત", trusted: "10,000+ વિશ્વાસ", orText: "અથવા ઇમેઇલ/ફોન", googleBtn: "Google સાથે ચાલુ રાખો", githubBtn: "GitHub", phoneBtn: "ફોન", phoneLabel: "મોબાઇલ નંબર", sendOtp: "OTP મોકલો", otpLabel: "OTP દાખલ કરો", verify: "ચકાસો", back: "પાછળ", initError: "ફોન ચકાસણી નિષ્ફળ." },
      ml: { login: "ലോഗിൻ", createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക", welcomeBack: "സ്വാഗതം", joinGita: "ഗീത AI-യിൽ ചേരുക", loginDesc: "നിങ്ങളുടെ വാലറ്റും കുണ്ഡലിയും ആക്സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക.", joinDesc: "നിങ്ങളുടെ ചാറ്റുകൾ സേവ് ചെയ്യാൻ അക്കൗണ്ട് സൃഷ്ടിക്കുക.", name: "നിങ്ങളുടെ പേര്", email: "ഇമെയിൽ", password: "പാസ്‌വേഡ്", loginBtn: "ലോഗിൻ", registerBtn: "രജിസ്റ്റർ ചെയ്യുക", noAccount: "അക്കൗണ്ട് ഇല്ലേ?", hasAccount: "അക്കൗണ്ട് ഉണ്ടോ?", registerHere: "രജിസ്റ്റർ ചെയ്യുക", loginHere: "ലോഗിൻ ചെയ്യുക", pleaseWait: "കാത്തിരിക്കുക...", secure: "100% സുരക്ഷിതം", trusted: "10,000+ വിശ്വാസം", orText: "അല്ലെങ്കിൽ ഇമെയിൽ/ഫോൺ", googleBtn: "Google ഉപയോഗിച്ച് തുടരുക", githubBtn: "GitHub", phoneBtn: "ഫോൺ", phoneLabel: "മൊബൈൽ നമ്പർ", sendOtp: "OTP അയയ്ക്കുക", otpLabel: "OTP നൽകുക", verify: "പരിശോധിക്കുക", back: "പിന്നോട്ട്", initError: "ഫോൺ വെരിഫിക്കേഷൻ പരാജയപ്പെട്ടു." }
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key] || dict["hi"][key];
  };

  const t = (key: string) => getLoginText(key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-2xl" : "border-orange-100 bg-white shadow-xl";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-[#0A0F19] p-3.5 pl-11 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-white transition-colors"
    : "w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 pl-11 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-gray-900 transition-colors";

  // 🔥 Proper reCAPTCHA setup
  useEffect(() => {
    if (method !== "phone") return;
    const verifier = setupRecaptcha("recaptcha-container");
    setRecaptchaVerifier(verifier);
  }, [method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, language: lang }), 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || "Something went wrong");
      await refresh();
      router.replace(redirectUrl); 
      router.refresh(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBackend = async (token: string, identifier: string) => {
    try {
      const res = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, identifier, language: lang }),
      });
      if (!res.ok) throw new Error("Backend auth failed");
      await refresh();
      router.replace(redirectUrl);
      router.refresh();
    } catch (err) {
      setError("Authentication failed at server. Please try again.");
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

  const handleGithubLogin = async () => {
    setError(null); setLoading(true);
    try {
      const { user, error: fbError } = await loginWithGithub();
      if (fbError) { setError(getFirebaseError(lang, fbError)); setLoading(false); }
      else if (user) {
        const idToken = await user.getIdToken();
        await authenticateWithBackend(idToken, user.email || "");
      }
    } catch (err) { setError("GitHub login failed."); setLoading(false); }
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
                <Sparkles className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff6b00] to-[#ff3d00] drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]" size={36} strokeWidth={2.5} />
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

          {/* 🔥 GOOGLE BUTTON (PRIMARY CTA) */}
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

          {/* DIVIDER */}
          <div className="mb-6 flex items-center gap-4 relative z-10">
            <div className={`flex-1 h-px ${isDark ? "bg-slate-800" : "bg-gray-200"}`}></div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("orText")}</span>
            <div className={`flex-1 h-px ${isDark ? "bg-slate-800" : "bg-gray-200"}`}></div>
          </div>

          {/* TABS (Email/Phone) */}
          <div className={`flex p-1 rounded-xl mb-6 relative z-10 ${isDark ? "bg-[#0A0F19]" : "bg-gray-100"}`}>
            <button 
              onClick={() => { setMethod("email"); setShowOtp(false); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold rounded-lg transition-all ${method === "email" ? "bg-white dark:bg-[#1e293b] text-[#ff6b00] shadow-sm" : "text-gray-500"}`}
            >
              <Mail size={16} /> {t("email")}
            </button>
            <button 
              onClick={() => { setMethod("phone"); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold rounded-lg transition-all ${method === "phone" ? "bg-white dark:bg-[#1e293b] text-[#ff6b00] shadow-sm" : "text-gray-500"}`}
            >
              <Phone size={16} /> {t("phoneBtn")}
            </button>
          </div>

          {/* EMAIL FORM */}
          {method === "email" && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 relative z-10">
              {!isLogin && (
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-4 text-gray-400" />
                  <input type="text" placeholder={t("name")} required={!isLogin} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
              )}
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-4 text-gray-400" />
                <input type="email" placeholder={t("email")} required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-4 text-gray-400" />
                <input type="password" placeholder={t("password")} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] px-4 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100">
                {loading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? t("loginBtn") : t("registerBtn"))}
              </button>
            </form>
          )}

          {/* PHONE FORM */}
          {method === "phone" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 relative z-10">
              {!showOtp ? (
                <>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-4 text-gray-400" />
                    <span className={`absolute left-11 top-4 text-[15px] font-bold ${isDark ? "text-slate-300" : "text-gray-600"}`}>+91</span>
                    <input type="tel" placeholder={t("phoneLabel")} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className={`${inputClass} pl-[5.5rem]`} />
                  </div>
                  
                  <div id="recaptcha-container"></div>
                  
                  <button onClick={handleSendOtp} disabled={loading || phone.length !== 10} className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] px-4 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : t("sendOtp")}
                  </button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-4 text-gray-400" />
                    <input type="text" placeholder={t("otpLabel")} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className={`${inputClass} text-center tracking-[0.5em] text-xl font-black pl-4`} />
                  </div>
                  <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] px-4 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : t("verify")}
                  </button>
                  <button onClick={() => setShowOtp(false)} className="w-full flex justify-center items-center gap-1 text-center text-[13px] font-bold text-[#ff6b00] mt-2 hover:underline">
                    <ChevronLeft size={16} /> {t("back")}
                  </button>
                </>
              )}
            </div>
          )}

          {/* GITHUB BUTTON */}
          <div className="mt-6 relative z-10">
            <button onClick={handleGithubLogin} disabled={loading} className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-bold text-[14px] transition-all active:scale-95 disabled:opacity-70 ${isDark ? "bg-[#0A0F19] border-slate-700 text-white hover:bg-slate-800" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"}`}>
              <Github size={20} className={isDark ? "text-white" : "text-gray-900"} /> {t("githubBtn")}
            </button>
          </div>

          {/* TRUST BADGES */}
          <div className={`mt-6 pt-6 border-t flex flex-col items-center gap-3 relative z-10 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <ShieldCheck size={12} /> {t("secure")}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Star size={12} className="fill-amber-500" /> {t("trusted")}
              </span>
            </div>
          </div>

          {/* TOGGLE LOGIN/REGISTER */}
          {method === "email" && (
            <div className="mt-6 text-center text-[13px] font-medium relative z-10">
              <span className={isDark ? "text-slate-400" : "text-gray-500"}>
                {isLogin ? t("noAccount") + " " : t("hasAccount") + " "}
              </span>
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-bold text-[#ff6b00] hover:underline">
                {isLogin ? t("registerHere") : t("loginHere")}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0A0F19] text-white"><Loader2 className="animate-spin text-[#ff6b00]" size={40} /></div>}>
      <LoginContent />
    </Suspense>
  );
}