// app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";
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

  // 🔥 10 LANGUAGES DICTIONARY
  const getLoginText = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        login: "लॉगिन", createAccount: "अकाउंट बनाएं", welcomeBack: "वापसी पर स्वागत है", joinGita: "गीता AI से जुड़ें",
        loginDesc: "अपने वॉलेट, ऑर्डर्स और सेव की गई कुंडली को एक्सेस करने के लिए लॉगिन करें।",
        joinDesc: "अपनी चैट और कुंडली सेव करने के लिए अकाउंट बनाएं।",
        name: "आपका नाम", email: "ईमेल एड्रेस", password: "पासवर्ड",
        loginBtn: "लॉगिन करें", registerBtn: "रजिस्टर करें",
        noAccount: "अकाउंट नहीं है?", hasAccount: "पहले से अकाउंट है?",
        registerHere: "यहाँ रजिस्टर करें", loginHere: "यहाँ लॉगिन करें", pleaseWait: "कृपया रुकें..."
      },
      hinglish: {
        login: "Login", createAccount: "Create Account", welcomeBack: "Welcome Back", joinGita: "Join Gita AI",
        loginDesc: "Login to access your wallet, orders, and saved kundli.",
        joinDesc: "Create an account to save your chats and kundli.",
        name: "Your Name", email: "Email Address", password: "Password",
        loginBtn: "Login", registerBtn: "Register",
        noAccount: "Don't have an account?", hasAccount: "Already have an account?",
        registerHere: "Register here", loginHere: "Login here", pleaseWait: "Please wait..."
      },
      en: {
        login: "Login", createAccount: "Create Account", welcomeBack: "Welcome Back", joinGita: "Join Gita AI",
        loginDesc: "Login to access your wallet, orders, and saved kundli.",
        joinDesc: "Create an account to save your chats and kundli.",
        name: "Your Name", email: "Email Address", password: "Password",
        loginBtn: "Login", registerBtn: "Register",
        noAccount: "Don't have an account?", hasAccount: "Already have an account?",
        registerHere: "Register here", loginHere: "Login here", pleaseWait: "Please wait..."
      },
      te: {
        login: "లాగిన్", createAccount: "ఖాతా సృష్టించండి", welcomeBack: "తిరిగి స్వాగతం", joinGita: "గీత AIలో చేరండి",
        loginDesc: "మీ వాలెట్, ఆర్డర్లు మరియు సేవ్ చేసిన కుండలిని యాక్సెస్ చేయడానికి లాగిన్ చేయండి.",
        joinDesc: "మీ చాట్లు మరియు కుండలిని సేవ్ చేయడానికి ఖాతా సృష్టించండి.",
        name: "మీ పేరు", email: "ఇమెయిల్ చిరునామా", password: "పాస్వర్డ్",
        loginBtn: "లాగిన్", registerBtn: "నమోదు చేయండి",
        noAccount: "ఖాతా లేదా?", hasAccount: "ఇప్పటికే ఖాతా ఉందా?",
        registerHere: "ఇక్కడ నమోదు చేయండి", loginHere: "ఇక్కడ లాగిన్ చేయండి", pleaseWait: "దయచేసి వేచి ఉండండి..."
      },
      ta: {
        login: "உள்நுழை", createAccount: "கணக்கை உருவாக்கு", welcomeBack: "மீண்டும் வருக", joinGita: "கீதா AI இல் சேரவும்",
        loginDesc: "உங்கள் பணப்பை, ஆர்டர்கள் மற்றும் சேமித்த ஜாதகத்தை அணுக உள்நுழையவும்.",
        joinDesc: "உங்கள் அரட்டைகள் மற்றும் ஜாதகத்தை சேமிக்க கணக்கை உருவாக்கவும்.",
        name: "உங்கள் பெயர்", email: "மின்னஞ்சல் முகவரி", password: "கடவுச்சொல்",
        loginBtn: "உள்நுழை", registerBtn: "பதிவு செய்",
        noAccount: "கணக்கு இல்லையா?", hasAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        registerHere: "இங்கே பதிவு செய்யவும்", loginHere: "இங்கே உள்நுழையவும்", pleaseWait: "காத்திருங்கள்..."
      },
      kn: {
        login: "ಲಾಗಿನ್", createAccount: "ಖಾತೆ ರಚಿಸಿ", welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ", joinGita: "ಗೀತಾ AI ಗೆ ಸೇರಿ",
        loginDesc: "ನಿಮ್ಮ ವಾಲೆಟ್, ಆರ್ಡರ್ಗಳು ಮತ್ತು ಉಳಿಸಿದ ಕುಂಡಲಿಯನ್ನು ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.",
        joinDesc: "ನಿಮ್ಮ ಚಾಟ್ಗಳು ಮತ್ತು ಕುಂಡಲಿಯನ್ನು ಉಳಿಸಲು ಖಾತೆ ರಚಿಸಿ.",
        name: "ನಿಮ್ಮ ಹೆಸರು", email: "ಇಮೇಲ್ ವಿಳಾಸ", password: "ಪಾಸ್ವರ್ಡ್",
        loginBtn: "ಲಾಗಿನ್", registerBtn: "ನೋಂದಾಯಿಸಿ",
        noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?", hasAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
        registerHere: "ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ", loginHere: "ಇಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ", pleaseWait: "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ..."
      },
      bn: {
        login: "লগইন", createAccount: "অ্যাকাউন্ট তৈরি করুন", welcomeBack: "ফিরে আসার জন্য স্বাগতম", joinGita: "গীতা AI-তে যোগ দিন",
        loginDesc: "আপনার ওয়ালেট, অর্ডার এবং সংরক্ষিত কুণ্ডলী অ্যাক্সেস করতে লগইন করুন।",
        joinDesc: "আপনার চ্যাট এবং কুণ্ডলী সংরক্ষণ করতে একটি অ্যাকাউন্ট তৈরি করুন।",
        name: "আপনার নাম", email: "ইমেল ঠিকানা", password: "পাসওয়ার্ড",
        loginBtn: "লগইন", registerBtn: "নিবন্ধন করুন",
        noAccount: "অ্যাকাউন্ট নেই?", hasAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
        registerHere: "এখানে নিবন্ধন করুন", loginHere: "এখানে লগইন করুন", pleaseWait: "অপেক্ষা করুন..."
      },
      mr: {
        login: "लॉग इन करा", createAccount: "खाते तयार करा", welcomeBack: "पुन्हा स्वागत आहे", joinGita: "गीता AI मध्ये सामील व्हा",
        loginDesc: "तुमचे वॉलेट, ऑर्डर आणि जतन केलेली कुंडली ॲक्सेस करण्यासाठी लॉग इन करा.",
        joinDesc: "तुमच्या चॅट आणि कुंडली जतन करण्यासाठी खाते तयार करा.",
        name: "तुमचे नाव", email: "ईमेल पत्ता", password: "पासवर्ड",
        loginBtn: "लॉग इन करा", registerBtn: "नोंदणी करा",
        noAccount: "खाते नाही?", hasAccount: "आधीच खाते आहे?",
        registerHere: "येथे नोंदणी करा", loginHere: "येथे लॉग इन करा", pleaseWait: "कृपया थांबा..."
      },
      gu: {
        login: "લોગિન", createAccount: "એકાઉન્ટ બનાવો", welcomeBack: "પાછા સ્વાગત છે", joinGita: "ગીતા AI માં જોડાઓ",
        loginDesc: "તમારા વોલેટ, ઓર્ડર્સ અને સાચવેલી કુંડળી ઍક્સેસ કરવા લોગિન કરો.",
        joinDesc: "તમારી ચેટ અને કુંડળી સાચવવા એકાઉન્ટ બનાવો.",
        name: "તમારું નામ", email: "ઇમેઇલ સરનામું", password: "પાસવર્ડ",
        loginBtn: "લોગિન", registerBtn: "નોંધણી કરો",
        noAccount: "એકાઉન્ટ નથી?", hasAccount: "પહેલેથી જ એકાઉન્ટ છે?",
        registerHere: "અહીં નોંધણી કરો", loginHere: "અહીં લોગિન કરો", pleaseWait: "કૃપા કરીને રાહ જુઓ..."
      },
      ml: {
        login: "ലോഗിൻ", createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക", welcomeBack: "വീണ്ടും സ്വാഗതം", joinGita: "ഗീത AI-യിൽ ചേരുക",
        loginDesc: "നിങ്ങളുടെ വാലറ്റ്, ഓർഡറുകൾ, സേവ് ചെയ്ത കുണ്ഡലി എന്നിവ ആക്സസ് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക.",
        joinDesc: "നിങ്ങളുടെ ചാറ്റുകളും കുണ്ഡലിയും സേവ് ചെയ്യാൻ ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക.",
        name: "നിങ്ങളുടെ പേര്", email: "ഇമെയിൽ വിലാസം", password: "പാസ്വേഡ്",
        loginBtn: "ലോഗിൻ", registerBtn: "രജിസ്റ്റർ ചെയ്യുക",
        noAccount: "അക്കൗണ്ട് ഇല്ലേ?", hasAccount: "ഇതിനകം ഒരു അക്കൗണ്ട് ഉണ്ടോ?",
        registerHere: "ഇവിടെ രജിസ്റ്റർ ചെയ്യുക", loginHere: "ഇവിടെ ലോഗിൻ ചെയ്യുക", pleaseWait: "കാത്തിരിക്കുക..."
      }
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key];
  };

  const t = (key: string) => getLoginText(key);

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
    <main className={`min-h-screen w-full px-4 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-md space-y-6">
        
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href={redirectUrl} className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
            {isLogin ? t("login") : t("createAccount")}
          </h1>
        </header>

        <div className={`rounded-3xl border p-6 sm:p-8 ${cardClass}`}>
          <div className="text-center mb-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 mb-4">
              <Sparkles className="text-orange-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{isLogin ? t("welcomeBack") : t("joinGita")}</h2>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {isLogin ? t("loginDesc") : t("joinDesc")}
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
                  placeholder={t("name")}
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
                placeholder={t("email")}
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
                placeholder={t("password")}
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
              {loading ? t("pleaseWait") : isLogin ? t("loginBtn") : t("registerBtn")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className={isDark ? "text-slate-400" : "text-gray-500"}>
              {isLogin ? t("noAccount") + " " : t("hasAccount") + " "}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-bold text-orange-500 hover:underline"
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}