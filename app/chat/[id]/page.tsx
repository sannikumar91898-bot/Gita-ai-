// app/chat/[id]/page.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getAstrologerById } from "@/lib/astrologers";
import { useApp } from "../../Providers";
import { Wallet, Lock, ArrowLeft, Send, Sparkles, X, Plus, Heart, ImageIcon, Loader2 } from "lucide-react"; 

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
};

const INTENT_CHIPS = [
  "मेरी शादी कब होगी?",
  "करियर में सफलता कैसे मिलेगी?",
  "मुझे कौन सा रत्न पहनना चाहिए?",
  "क्या मेरा पार्टनर सच्चा है?",
];

const VALID_PERSONAS = new Set(["gita", "kriti", "devaki", "gargi"]);

function createMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AstrologerChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, theme, me } = useApp(); // 🔥 Added 'me' for onboarding check

  const isDark = theme === "dark";
  const id = typeof params?.id === "string" ? params.id : "";
  const astrologer = getAstrologerById(id);
  const validId = VALID_PERSONAS.has(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const [walletBalance, setWalletBalance] = useState(0);
  
  const [showPaywall, setShowPaywall] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const requestInProgress = useRef(false);
  const activePersonaRef = useRef(id);

  // 🔥 10 LANGUAGES HELPER
  const getChatText = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        connecting: "ज्योतिषी जुड़ रही हैं...", placeholder: "अपना सवाल लिखें...",
        paywallTitle: "बैलेंस खत्म हो गया है", paywallDesc: "आपके फ्री मैसेज या वॉलेट बैलेंस खत्म हो गए हैं। भविष्य की सच्चाई जानने के लिए रिचार्ज करें।", 
        currentBalance: "वर्तमान बैलेंस", addCash: "अभी रिचार्ज करें", maybeLater: "बाद में", 
        chatEnded: "आपकी चैट अधूरी रह गई... सच्चाई जानने के लिए रिचार्ज करें।",
        missingDetails: "कृपया चैट शुरू करने से पहले अपनी जन्म कुंडली की जानकारी भरें।",
        fillDetails: "विवरण भरें"
      },
      hinglish: {
        connecting: "Jyotishi jud rahi hain...", placeholder: "Apna sawal likhein...",
        paywallTitle: "Balance Exhausted", paywallDesc: "Aapke free messages ya wallet balance khatam ho gaye hain. Future ki sachai jaanne ke liye recharge karein.", 
        currentBalance: "Current Balance", addCash: "Recharge Now", maybeLater: "Maybe Later",
        chatEnded: "Aapki chat adhuri reh gayi... sachai jaanne ke liye recharge karein.",
        missingDetails: "Kripya chat shuru karne se pehle apni janam kundli ki jankari bharein.",
        fillDetails: "Details Bharein"
      },
      en: {
        connecting: "Astrologer is connecting...", placeholder: "Ask your question...",
        paywallTitle: "Balance Exhausted", paywallDesc: "Your free messages or wallet balance is over. Recharge to uncover the truth about your future.", 
        currentBalance: "Current Balance", addCash: "Recharge Now", maybeLater: "Maybe Later",
        chatEnded: "Your chat was left incomplete... Recharge to hear the truth.",
        missingDetails: "Please fill your birth details before starting a chat.",
        fillDetails: "Fill Details"
      },
      te: {
        connecting: "జ్యోతిష్యుడు కనెక్ట్ అవుతున్నారు...", placeholder: "మీ ప్రశ్న అడగండి...",
        paywallTitle: "బ్యాలెన్స్ అయిపోయింది", paywallDesc: "మీ ఉచిత సందేశాలు లేదా వాలెట్ బ్యాలెన్స్ ముగిసింది. మీ భవిష్యత్తు నిజం తెలుసుకోవడానికి రీఛార్జ్ చేయండి.", 
        currentBalance: "ప్రస్తుత బ్యాలెన్స్", addCash: "ఇప్పుడే రీఛార్జ్ చేయండి", maybeLater: "తర్వాత",
        chatEnded: "మీ చాట్ అసంపూర్ణంగా మిగిలిపోయింది... నిజం తెలుసుకోవడానికి రీఛార్జ్ చేయండి.",
        missingDetails: "దయచేసి చాట్ ప్రారంభించే ముందు మీ పుట్టిన వివరాలను పూరించండి.",
        fillDetails: "వివరాలు పూరించండి"
      },
      ta: {
        connecting: "ஜோதிடர் இணைகிறார்...", placeholder: "உங்கள் கேள்வியைக் கேளுங்கள்...",
        paywallTitle: "இருப்பு தீர்ந்தது", paywallDesc: "உங்கள் இலவச செய்திகள் அல்லது பணப்பை இருப்பு தீர்ந்தது. உங்கள் எதிர்கால உண்மையை அறிய ரீசார்ஜ் செய்யுங்கள்.", 
        currentBalance: "தற்போதைய இருப்பு", addCash: "இப்போதே ரீசார்ஜ் செய்", maybeLater: "பின்னர்",
        chatEnded: "உங்கள் அரட்டை முழுமையடையவில்லை... உண்மையை அறிய ரீசார்ஜ் செய்யுங்கள்.",
        missingDetails: "அரட்டையைத் தொடங்குவதற்கு முன் உங்கள் பிறப்பு விவரங்களை நிரப்பவும்.",
        fillDetails: "விவரங்களை நிரப்பவும்"
      },
      kn: {
        connecting: "ಜ್ಯೋತಿಷಿ ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದಾರೆ...", placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
        paywallTitle: "ಬ್ಯಾಲೆನ್ಸ್ ಖಾಲಿಯಾಗಿದೆ", paywallDesc: "ನಿಮ್ಮ ಉಚಿತ ಸಂದೇಶಗಳು ಅಥವಾ ವಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್ ಮುಗಿದಿದೆ. ನಿಮ್ಮ ಭವಿಷ್ಯದ ಸತ್ಯ ತಿಳಿಯಲು ರೀಚಾರ್ಜ್ ಮಾಡಿ.", 
        currentBalance: "ಪ್ರಸ್ತುತ ಬ್ಯಾಲೆನ್ಸ್", addCash: "ಈಗಲೇ ರೀಚಾರ್ಜ್ ಮಾಡಿ", maybeLater: "ನಂತರ",
        chatEnded: "ನಿಮ್ಮ ಚಾಟ್ ಅಪೂರ್ಣವಾಗಿದೆ... ಸತ್ಯ ತಿಳಿಯಲು ರೀಚಾರ್ಜ್ ಮಾಡಿ.",
        missingDetails: "ದಯವಿಟ್ಟು ಚಾಟ್ ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
        fillDetails: "ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ"
      },
      bn: {
        connecting: "জ্যোতিষী সংযোগ করছেন...", placeholder: "আপনার প্রশ্ন জিজ্ঞাসা করুন...",
        paywallTitle: "ব্যালেন্স শেষ", paywallDesc: "আপনার ফ্রি মেসেজ বা ওয়ালেট ব্যালেন্স শেষ। ভবিষ্যতের সত্য জানতে রিচার্জ করুন।", 
        currentBalance: "বর্তমান ব্যালেন্স", addCash: "এখনই রিচার্জ করুন", maybeLater: "পরে",
        chatEnded: "আপনার চ্যাট অসম্পূর্ণ ছিল... সত্য জানতে রিচার্জ করুন।",
        missingDetails: "চ্যাট শুরু করার আগে আপনার জন্ম বিবরণ পূরণ করুন।",
        fillDetails: "বিবরণ পূরণ করুন"
      },
      mr: {
        connecting: "ज्योतिषी जोडत आहेत...", placeholder: "तुमचा प्रश्न विचारा...",
        paywallTitle: "बॅलन्स संपला आहे", paywallDesc: "तुमचे फ्री मेसेज किंवा वॉलेट बॅलन्स संपले आहे. भविष्यातील सत्य जाणून घेण्यासाठी रिचार्ज करा.", 
        currentBalance: "सध्याचा बॅलन्स", addCash: "आता रिचार्ज करा", maybeLater: "नंतर",
        chatEnded: "तुमची चॅट अपूर्ण राहिली... सत्य जाणून घेण्यासाठी रिचार्ज करा.",
        missingDetails: "कृपया चॅट सुरू करण्यापूर्वी तुमची जन्म तपशील भरा.",
        fillDetails: "तपशील भरा"
      },
      gu: {
        connecting: "જ્યોતિષી જોડાઈ રહ્યા છે...", placeholder: "તમારો પ્રશ્ન પૂછો...",
        paywallTitle: "બેલેન્સ ખતમ", paywallDesc: "તમારા ફ્રી મેસેજ અથવા વોલેટ બેલેન્સ ખતમ થઈ ગયા છે. ભવિષ્યનું સત્ય જાણવા રિચાર્જ કરો.", 
        currentBalance: "વર્તમાન બેલેન્સ", addCash: "હમણાં જ રિચાર્જ કરો", maybeLater: "પછી",
        chatEnded: "તમારી ચેટ અધૂરી રહી ગઈ... સત્ય જાણવા રિચાર્જ કરો.",
        missingDetails: "કૃપા કરીને ચેટ શરૂ કરતા પહેલા તમારી જન્મ વિગતો ભરો.",
        fillDetails: "વિગતો ભરો"
      },
      ml: {
        connecting: "ജ്യോതിഷി ബന്ധിപ്പിക്കുന്നു...", placeholder: "നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക...",
        paywallTitle: "ബാലൻസ് തീർന്നു", paywallDesc: "നിങ്ങളുടെ സൗജന്യ സന്ദേശങ്ങളോ വാലറ്റ് ബാലൻസോ തീർന്നു. ഭാവിയുടെ സത്യം അറിയാൻ റീചാർജ് ചെയ്യുക.", 
        currentBalance: "നിലവിലെ ബാലൻസ്", addCash: "ഇപ്പോൾ റീചാർജ് ചെയ്യുക", maybeLater: "പിന്നീട്",
        chatEnded: "നിങ്ങളുടെ ചാറ്റ് അപൂർണ്ണമായി... സത്യം അറിയാൻ റീചാർജ് ചെയ്യുക.",
        missingDetails: "ചാറ്റ് ആരംഭിക്കുന്നതിന് മുമ്പ് നിങ്ങളുടെ ജനന വിവരങ്ങൾ പൂരിപ്പിക്കുക.",
        fillDetails: "വിവരങ്ങൾ പൂരിപ്പിക്കുക"
      }
    };
    return dict[lang || "en"]?.[key] || dict["en"][key];
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      if (data.user) {
        setWalletBalance(data.user.walletBalancePaise || 0);
      }
    } catch (e) {
      console.error("Failed to fetch wallet balance", e);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  // 🔥 ONBOARDING CHECK: Agar user ke birth details nahi hain, toh profile edit par bhejo
  useEffect(() => {
    // Agar user logged in hai par birth details nahi hai
    if (me?.user && !me?.birth) {
      router.replace(`/profile/edit?redirect=/chat/${id}`);
    }
  }, [me, router, id]);

  const loadHistory = useCallback(
    async (signal?: AbortSignal) => {
      if (!VALID_PERSONAS.has(id)) return;
      setHistoryLoading(true);

      try {
        const guestRes = await fetch("/api/auth/guest", { method: "POST" });
        if (!guestRes.ok) {
          const guestData = await guestRes.json().catch(() => ({}));
          throw new Error(guestData.error || "Guest session could not be created.");
        }

        const query = new URLSearchParams({ persona: id });
        const response = await fetch(`/api/chat?${query.toString()}`, {
          method: "GET",
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal,
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.push(`/login?redirect=/chat/${id}`);
          return;
        }

        if (!response.ok) throw new Error(data.error || "Chat history load nahi hui.");
        if (signal?.aborted || activePersonaRef.current !== id) return;

        const history: Message[] = [];
        if (Array.isArray(data.messages)) {
          for (const item of data.messages) {
            if (item && typeof item === "object" && typeof item.id === "string" && (item.role === "user" || item.role === "assistant") && typeof item.content === "string") {
              history.push({ id: item.id, role: item.role, content: item.content });
            }
          }
        }

        setConversationId(typeof data.conversationId === "string" ? data.conversationId : null);
        setMessages(history);
      } catch (error) {
        if (signal?.aborted) return;
        if (activePersonaRef.current === id) {
          setMessages([{ id: createMessageId(), role: "assistant", content: error instanceof Error ? error.message : "Session not found." }]);
          setConversationId(null);
        }
      } finally {
        if (!signal?.aborted && activePersonaRef.current === id) setHistoryLoading(false);
      }
    },
    [id, router],
  );

  useEffect(() => {
    activePersonaRef.current = id;
    if (!validId || !astrologer) {
      router.replace("/");
      return;
    }
    const controller = new AbortController();
    setMessages([]);
    setConversationId(null);
    setInput("");
    void loadHistory(controller.signal);
    return () => { controller.abort(); };
  }, [id, validId, astrologer, router, loadHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, imagePreview]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image 5MB se choti honi chahiye.");
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function sendMessage(text: string, imageFile?: File | null) {
    if (typeof window !== "undefined" && localStorage.getItem("is_guest_user") === "true") {
      router.push(`/login?redirect=/chat/${id}`);
      return; 
    }

    if ((!text.trim() && !imageFile) || loading || !astrologer || !validId || historyLoading || requestInProgress.current) return;

    const selectedPersona = id;
    const content = text.trim();
    const tempImageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    
    const userMessage: Message = { id: createMessageId(), role: "user", content: content || "Photo bheji hai", image: tempImageUrl };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);
    requestInProgress.current = true;

    try {
      const formData = new FormData();
      formData.append("message", content);
      formData.append("language", lang);
      formData.append("topic", astrologer.topic || "general");
      formData.append("persona", selectedPersona);
      if (conversationId) formData.append("conversationId", conversationId);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch("/api/chat", {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(90_000),
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (activePersonaRef.current !== selectedPersona) return;

      if (response.status === 401) {
        router.push(`/login?redirect=/chat/${id}`);
        return;
      }

      if (response.status === 402) {
        setShowPaywall(true);
        return;
      }

      if (!response.ok) {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: typeof data.error === "string" ? data.error : "क्षमा करें, अभी उत्तर नहीं मिल पाया।" },
        ]);
        return;
      }

      if (typeof data.conversationId === "string") setConversationId(data.conversationId);

      if (data.message && typeof data.message.content === "string" && data.message.content.trim()) {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: data.message.content },
        ]);
        void fetchProfile(); 
      } else {
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: "अभी उत्तर खाली आया। कृपया फिर कोशिश करें।" },
        ]);
      }
    } catch (error) {
      if (activePersonaRef.current === selectedPersona) {
        const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
        setMessages((previous) => [
          ...previous,
          { id: createMessageId(), role: "assistant", content: timedOut ? "उत्तर आने में ज़्यादा समय लग गया।" : "नेटवर्क की समस्या है।" },
        ]);
      }
    } finally {
      requestInProgress.current = false;
      if (activePersonaRef.current === selectedPersona) setLoading(false);
      clearImage();
    }
  }

  if (!astrologer || !validId) {
    return <div className={`flex h-[100dvh] items-center justify-center ${isDark ? "bg-[#0B0F19] text-white" : "bg-[#FFF9E6] text-gray-600"}`}><Sparkles className="animate-spin text-orange-500" size={32} /></div>;
  }

  // 🔥 If user details are missing, show a blocking screen (Prevents chat without details)
  if (me?.user && !me?.birth) {
    return (
      <div className={`flex h-[100dvh] flex-col items-center justify-center p-4 ${isDark ? "bg-[#0B0F19] text-white" : "bg-[#FFF9E6] text-gray-900"}`}>
        <div className={`max-w-md w-full rounded-3xl border p-8 text-center ${isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-orange-100 shadow-xl"}`}>
          <div className="mx-auto w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
            <Lock className="text-orange-500" size={32} />
          </div>
          <h2 className="text-xl font-black mb-2">{getChatText("missingDetails")}</h2>
          <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            To get accurate astrological predictions, we need your exact birth details.
          </p>
          <Link href={`/profile/edit?redirect=/chat/${id}`} className="w-full inline-block rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 font-bold text-white shadow-lg active:scale-95 transition-all">
            {getChatText("fillDetails")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-[100dvh] flex-col overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#0B0F19]" : "bg-[#FFF9E6]"}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3 shadow-sm ${isDark ? "border-slate-800 bg-[#151E2E]/95 backdrop-blur-md" : "border-orange-100 bg-white/95 backdrop-blur-md"}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/" aria-label="Back" className={`p-2 rounded-full transition-transform active:scale-95 ${isDark ? "text-white hover:bg-slate-800" : "text-black hover:bg-gray-100"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border-2 border-orange-500 shadow-sm">
            <img src={astrologer.photo} alt={astrologer.name} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className={`truncate text-[16px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{astrologer.name}</h1>
            <p className="text-[11px] font-bold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Online</p>
          </div>
        </div>
        <Link href="/wallet" className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold border shadow-sm transition active:scale-95 ${isDark ? "bg-slate-800 border-slate-700 text-orange-400 hover:bg-slate-700" : "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"}`}>
          <Wallet size={14} /> ₹{walletBalance / 100} <span className="h-3.5 w-px bg-current opacity-30 mx-0.5"></span> <Plus size={14} className="font-black" />
        </Link>
      </header>

      {/* WARNING BANNER */}
      {walletBalance < 200 && (
         <Link href="/wallet" className={`flex items-center justify-between gap-2 px-4 py-2.5 text-[12px] font-bold border-b animate-in slide-in-from-top-2 ${isDark ? "bg-amber-950/40 border-amber-900/50 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-rose-500 animate-pulse" />
            <span>{getChatText("chatEnded")}</span>
          </div>
          <span className="underline shrink-0">{getChatText("addCash")}</span>
        </Link>
      )}

      {/* CHAT MESSAGES */}
      <main className="flex-1 space-y-5 overflow-y-auto px-4 py-5 pb-24 custom-scrollbar" aria-live="polite">
        <div className="w-full max-w-4xl mx-auto space-y-5">
          {historyLoading ? (
            <div className={`py-10 text-center flex flex-col items-center gap-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              <Sparkles size={24} className="animate-spin text-orange-500" />
              <span className="text-sm font-medium">{getChatText("connecting")}</span>
            </div>
          ) : (
            <>
              {/* Intent Chips */}
              {messages.length === 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4">
                  {INTENT_CHIPS.map((chip, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => sendMessage(chip)} 
                      className={`rounded-full border px-4 py-2.5 text-[13px] font-semibold transition active:scale-95 shadow-sm ${
                        isDark ? "border-slate-700 bg-[#151E2E] text-slate-300 hover:bg-slate-800 hover:text-white" : "border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-1 shadow-sm border border-slate-700">
                      <img src={astrologer.photo} alt="Astro" className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-[1.3rem] px-5 py-3.5 text-[15.5px] leading-relaxed shadow-md ${
                    message.role === "user" 
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-tr-sm font-medium" 
                      : isDark ? "bg-[#151E2E] text-slate-200 border border-slate-800 rounded-tl-sm" : "bg-white text-slate-800 border border-orange-100 rounded-tl-sm"
                  }`}>
                    {message.image && (
                      <div className="mb-2 overflow-hidden rounded-xl border border-black/10">
                        <img src={message.image} alt="User upload" className="max-w-[250px] max-h-[300px] object-cover w-full" />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-1 shadow-sm border border-slate-700">
                    <img src={astrologer.photo} alt="Astro" className="h-full w-full object-cover" />
                  </div>
                  <div className={`inline-flex items-center gap-1.5 rounded-[1.3rem] rounded-tl-sm px-5 py-4 border shadow-sm ${isDark ? "bg-[#151E2E] border-slate-800" : "bg-white border-orange-100"}`}>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={endRef} className="h-4" />
            </>
          )}
        </div>
      </main>

      {/* INPUT AREA */}
      <div className={`shrink-0 border-t p-3 sm:p-4 ${isDark ? "border-slate-800 bg-[#151E2E]" : "border-orange-100 bg-white"}`}>
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          
          {imagePreview && (
            <div className="relative inline-block w-max">
              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-orange-500" />
              <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md">
                <X size={12} />
              </button>
            </div>
          )}

          <div className={`flex items-end gap-2 rounded-2xl border-2 p-2 transition-all ${
            isDark ? "bg-[#0B0F19] border-slate-700 focus-within:border-orange-500" : "bg-gray-50 border-gray-200 focus-within:border-orange-400"
          }`}>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={`p-2 rounded-xl transition-colors ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-gray-500 hover:text-black hover:bg-gray-200"}`}
            >
              <ImageIcon size={22} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/jpeg, image/png, image/webp" className="hidden" />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getChatText("placeholder")}
              rows={1}
              className={`flex-1 max-h-32 min-h-[44px] resize-none bg-transparent px-2 py-3 text-[15px] outline-none custom-scrollbar ${isDark ? "text-white placeholder-slate-500" : "text-gray-900 placeholder-gray-400"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input, selectedImage);
                }
              }}
            />

            <button
              onClick={() => sendMessage(input, selectedImage)}
              disabled={(!input.trim() && !selectedImage) || loading}
              className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 PREMIUM PAYWALL MODAL */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl animate-in zoom-in-95 ${isDark ? "bg-[#151E2E] border-slate-700" : "bg-white border-orange-100"}`}>
            
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Lock className="text-red-500" size={32} />
            </div>

            <h2 className={`text-xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {getChatText("paywallTitle")}
            </h2>
            <p className={`text-[13px] mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {getChatText("paywallDesc")}
            </p>

            <div className={`rounded-xl p-3 mb-6 flex justify-between items-center border ${isDark ? "bg-[#0B0F19] border-slate-800" : "bg-gray-50 border-gray-200"}`}>
              <span className={`text-xs font-bold uppercase ${isDark ? "text-slate-400" : "text-gray-500"}`}>{getChatText("currentBalance")}</span>
              <span className="text-xl font-black text-red-500">₹{walletBalance / 100}</span>
            </div>

            <Link 
              href="/wallet" 
              className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-[15px] shadow-lg active:scale-95 transition-all mb-3"
            >
              {getChatText("addCash")}
            </Link>

            <button 
              onClick={() => setShowPaywall(false)} 
              className={`text-[13px] font-bold w-full py-2 ${isDark ? "text-slate-500 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
            >
              {getChatText("maybeLater")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}