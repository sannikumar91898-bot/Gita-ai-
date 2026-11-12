// app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Sparkles, ShieldCheck, Loader2, CheckCircle2, Star } from "lucide-react";
import { useApp } from "../Providers";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, refresh, lang } = useApp();
  const isDark = theme === "dark";

  const redirectUrl = searchParams.get("redirect") || "/settings";

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 10 LANGUAGES DICTIONARY (Full Support)
  const getLoginText = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        login: "लॉगिन", createAccount: "अकाउंट बनाएं", welcomeBack: "वापसी पर स्वागत है", joinGita: "गीता AI से जुड़ें",
        loginDesc: "अपने वॉलेट, ऑर्डर्स और सेव की गई कुंडली को एक्सेस करने के लिए लॉगिन करें।",
        joinDesc: "अपनी चैट और कुंडली सेव करने के लिए अकाउंट बनाएं।",
        name: "आपका नाम", email: "ईमेल एड्रेस", password: "पासवर्ड",
        loginBtn: "लॉगिन करें", registerBtn: "रजिस्टर करें",
        noAccount: "अकाउंट नहीं है?", hasAccount: "पहले से अकाउंट है?",
        registerHere: "यहाँ रजिस्टर करें", loginHere: "यहाँ लॉगिन करें", pleaseWait: "कृपया रुकें...",
        secure: "100% सुरक्षित और गोपनीय", trusted: "10,000+ यूजर्स का भरोसा"
      },
      hinglish: {
        login: "Login", createAccount: "Create Account", welcomeBack: "Welcome Back", joinGita: "Join Gita AI",
        loginDesc: "Apne wallet, orders aur saved kundli ko access karne ke liye login karein.",
        joinDesc: "Apni chats aur kundli save karne ke liye account banayein.",
        name: "Your Name", email: "Email Address", password: "Password",
        loginBtn: "Login", registerBtn: "Register",
        noAccount: "Account nahi hai?", hasAccount: "Pehle se account hai?",
        registerHere: "Yahan register karein", loginHere: "Yahan login karein", pleaseWait: "Kripya rukein...",
        secure: "100% Secure & Private", trusted: "Trusted by 10,000+ users"
      },
      en: {
        login: "Login", createAccount: "Create Account", welcomeBack: "Welcome Back", joinGita: "Join Gita AI",
        loginDesc: "Login to access your wallet, orders, and saved kundli.",
        joinDesc: "Create an account to save your chats and kundli.",
        name: "Your Name", email: "Email Address", password: "Password",
        loginBtn: "Login", registerBtn: "Register",
        noAccount: "Don't have an account?", hasAccount: "Already have an account?",
        registerHere: "Register here", loginHere: "Login here", pleaseWait: "Please wait...",
        secure: "100% Secure & Private", trusted: "Trusted by 10,000+ users"
      },
      te: {
        login: "లాగిన్", createAccount: "ఖాతా సృష్టించండి", welcomeBack: "తిరిగి స్వాగతం", joinGita: "గీత AIలో చేరండి",
        loginDesc: "మీ వాలెట్, ఆర్డర్లు మరియు సేవ్ చేసిన కుండలిని యాక్సెస్ చేయడానికి లాగిన్ చేయండి.",
        joinDesc: "మీ చాట్లు మరియు కుండలిని సేవ్ చేయడానికి ఖాతా సృష్టించండి.",
        name: "మీ పేరు", email: "ఇమెయిల్ చిరునామా", password: "పాస్‌వర్డ్",
        loginBtn: "లాగిన్", registerBtn: "నమోదు చేయండి",
        noAccount: "ఖాతా లేదా?", hasAccount: "ఇప్పటికే ఖాతా ఉందా?",
        registerHere: "ఇక్కడ నమోదు చేయండి", loginHere: "ఇక్కడ లాగిన్ చేయండి", pleaseWait: "దయచేసి వేచి ఉండండి...",
        secure: "100% సురక్షితం & గోప్యత", trusted: "10,000+ వినియోగదారుల నమ్మకం"
      },
      ta: {
        login: "உள்நுழை", createAccount: "கணக்கை உருவாக்கு", welcomeBack: "மீண்டும் வருக", joinGita: "கீதா AI இல் சேரவும்",
        loginDesc: "உங்கள் பணப்பை, ஆர்டர்கள் மற்றும் சேமித்த ஜாதகத்தை அணுக உள்நுழையவும்.",
        joinDesc: "உங்கள் அரட்டைகள் மற்றும் ஜாதகத்தை சேமிக்க கணக்கை உருவாக்கவும்.",
        name: "உங்கள் பெயர்", email: "மின்னஞ்சல் முகவரி", password: "கடவுச்சொல்",
        loginBtn: "உள்நுழை", registerBtn: "பதிவு செய்",
        noAccount: "கணக்கு இல்லையா?", hasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        registerHere: "இங்கே பதிவு செய்யவும்", loginHere: "இங்கே உள்நுழையவும்", pleaseWait: "காத்திருங்கள்...",
        secure: "100% பாதுகாப்பானது & தனியுரிமை", trusted: "10,000+ பயனர்களின் நம்பிக்கை"
      },
      kn: {
        login: "ಲಾಗಿನ್", createAccount: "ಖಾತೆ ರಚಿಸಿ", welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ", joinGita: "ಗೀತಾ AI ಗೆ ಸೇರಿ",
        loginDesc: "ನಿಮ್ಮ ವಾಲೆಟ್, ಆರ್ಡರ್ಗಳು ಮತ್ತು ಉಳಿಸಿದ ಕುಂಡಲಿಯನ್ನು ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.",
        joinDesc: "ನಿಮ್ಮ ಚಾಟ್‌ಗಳು ಮತ್ತು ಕುಂಡಲಿಯನ್ನು ಉಳಿಸಲು ಖಾತೆ ರಚಿಸಿ.",
        name: "ನಿಮ್ಮ ಹೆಸರು", email: "ಇಮೇಲ್ ವಿಳಾಸ", password: "ಪಾಸ್‌ವರ್ಡ್",
        loginBtn: "ಲಾಗಿನ್", registerBtn: "ನೋಂದಾಯಿಸಿ",
        noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?", hasAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
        registerHere: "ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ", loginHere: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ", pleaseWait: "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...",
        secure: "100% ಸುರಕ್ಷಿತ & ಖಾಸಗಿ", trusted: "10,000+ ಬಳಕೆದಾರರ ನಂಬಿಕೆ"
      },
      bn: {
        login: "লগইন", createAccount: "অ্যাকাউন্ট তৈরি করুন", welcomeBack: "ফিরে আসার জন্য স্বাগতম", joinGita: "গীতা AI-তে যোগ দিন",
        loginDesc: "আপনার ওয়ালেট, অর্ডার এবং সংরক্ষিত কুণ্ডলী অ্যাক্সেস করতে লগইন করুন।",
        joinDesc: "আপনার চ্যাট এবং কুণ্ডলী সংরক্ষণ করতে একটি অ্যাকাউন্ট তৈরি করুন।",
        name: "আপনার নাম", email: "ইমেল ঠিকানা", password: "পাসওয়ার্ড",
        loginBtn: "লগইন", registerBtn: "নিবন্ধন করুন",
        noAccount: "অ্যাকাউন্ট নেই?", hasAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
        registerHere: "এখানে নিবন্ধন করুন", loginHere: "এখানে লগইন করুন", pleaseWait: "অপেক্ষা করুন...",
        secure: "100% সুরক্ষিত এবং গোপনীয়", trusted: "10,000+ ব্যবহারকারীর আস্থা"
      },
      mr: {
        login: "लॉग इन करा", createAccount: "खाते तयार करा", welcomeBack: "पुन्हा स्वागत आहे", joinGita: "गीता AI मध्ये सामील व्हा",
        loginDesc: "तुमचे वॉलेट, ऑर्डर आणि जतन केलेली कुंडली ॲक्सेस करण्यासाठी लॉग इन करा.",
        joinDesc: "तुमच्या चॅट आणि कुंडली जतन करण्यासाठी खाते तयार करा.",
        name: "तुमचे नाव", email: "ईमेल पत्ता", password: "पासवर्ड",
        loginBtn: "लॉग इन करा", registerBtn: "नोंदणी करा",
        noAccount: "खाते नाही?", hasAccount: "आधीच खाते आहे?",
        registerHere: "येथे नोंदणी करा", loginHere: "येथे लॉग इन करा", pleaseWait: "कृपया थांबा...",
        secure: "100% सुरक्षित आणि खाजगी", trusted: "10,000+ वापरकर्त्यांचा विश्वास"
      },
      gu: {
        login: "લોગિન", createAccount: "એકાઉન્ટ બનાવો", welcomeBack: "પાછા સ્વાગત છે", joinGita: "ગીતા AI માં જોડાઓ",
        loginDesc: "તમારા વોલેટ, ઓર્ડર્સ અને સાચવેલી કુંડળી ઍક્સેસ કરવા લોગિન કરો.",
        joinDesc: "તમારી ચેટ અને કુંડળી સાચવવા એકાઉન્ટ બનાવો.",
        name: "તમારું નામ", email: "ઇમેઇલ સરનામું", password: "પાસવર્ડ",
        loginBtn: "લોગિન", registerBtn: "નોંધણી કરો",
        noAccount: "એકાઉન્ટ નથી?", hasAccount: "પહેલેથી જ એકાઉન્ટ છે?",
        registerHere: "અહીં નોંધણી કરો", loginHere: "અહીં લોગિન કરો", pleaseWait: "કૃપા કરીને રાહ જુઓ...",
        secure: "100% સુરક્ષિત અને ખાનગી", trusted: "10,000+ વપરાશકર્તાઓનો વિશ્વાસ"
      },
      ml: {
        login: "ലോഗിൻ", createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക", welcomeBack: "വീണ്ടും സ്വാഗതം", joinGita: "ഗീത AI-യിൽ ചേരുക",
        loginDesc: "നിങ്ങളുടെ വാലറ്റ്, ഓർഡറുകൾ, സേവ് ചെയ്ത കുണ്ഡലി എന്നിവ ആക്സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക.",
        joinDesc: "നിങ്ങളുടെ ചാറ്റുകളും കുണ്ഡലിയും സേവ് ചെയ്യാൻ ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക.",
        name: "നിങ്ങളുടെ പേര്", email: "ഇമെയിൽ വിലാസം", password: "പാസ്‌വേഡ്",
        loginBtn: "ലോഗിൻ", registerBtn: "രജിസ്റ്റർ ചെയ്യുക",
        noAccount: "അക്കൗണ്ട് ഇല്ലേ?", hasAccount: "ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?",
        registerHere: "ഇവിടെ രജിസ്റ്റർ ചെയ്യുക", loginHere: "ഇവിടെ ലോഗിൻ ചെയ്യുക", pleaseWait: "കാത്തിരിക്കുക...",
        secure: "100% സുരക്ഷിതവും സ്വകാര്യവും", trusted: "10,000+ ഉപയോക്താക്കളുടെ വിശ്വാസം"
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

  return (
    <main className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden ${pageClass}`}>
      
      {/* 🔥 PREMIUM BACKGROUND GLOW (Psychology: Makes the app feel high-end) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-gradient-to-b from-[#ff6b00]/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* HEADER */}
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

        {/* MAIN CARD */}
        <div className={`rounded-3xl border p-6 sm:p-8 ${cardClass}`}>
          
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff6b00]/20 to-[#ff3d00]/20 mb-4 shadow-inner">
              <Sparkles className="text-[#ff6b00]" size={32} />
            </div>
            <h2 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {isLogin ? t("welcomeBack") : t("joinGita")}
            </h2>
            <p className={`text-[13px] font-medium leading-relaxed ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {isLogin ? t("loginDesc") : t("joinDesc")}
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[13px] font-bold text-rose-500 break-words animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div className="relative animate-in fade-in slide-in-from-top-2">
                <User size={18} className="absolute left-3.5 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("name")}
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-4 text-gray-400" />
              <input
                type="email"
                placeholder={t("email")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-4 text-gray-400" />
              <input
                type="password"
                placeholder={t("password")}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] px-4 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t("pleaseWait")}
                </>
              ) : (
                isLogin ? t("loginBtn") : t("registerBtn")
              )}
            </button>
          </form>

          {/* 🔥 TRUST BADGES (Psychology & Marketing) */}
          <div className={`mt-8 pt-6 border-t flex flex-col items-center gap-3 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <ShieldCheck size={14} /> {t("secure")}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Star size={14} className="fill-amber-500" /> {t("trusted")}
              </span>
            </div>
          </div>

          {/* TOGGLE LOGIN/REGISTER */}
          <div className="mt-6 text-center text-[13px] font-medium">
            <span className={isDark ? "text-slate-400" : "text-gray-500"}>
              {isLogin ? t("noAccount") + " " : t("hasAccount") + " "}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-bold text-[#ff6b00] hover:underline"
            >
              {isLogin ? t("registerHere") : t("loginHere")}
            </button>
          </div>

        </div>
      </div>
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