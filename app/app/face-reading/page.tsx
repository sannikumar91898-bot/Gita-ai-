"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Scan,
  Image as ImageIcon,
  Eye,
  Brain,
  MessageCircle,
} from "lucide-react";
import { useApp } from "../../Providers";

type FeatureKey = "forehead" | "eyes" | "lips";
type Step = "upload" | "questions" | "result";

type FeatureOption = {
  type: string;
  label: string;
  analysis: string;
  timeline: string;
  remedy: string;
};

// 👑 100% अकाट्य दावे, पक्के टाइमलाइन और महा-उपाय के साथ सामुद्रिक डेटाबेस
const FACE_FEATURES: Record<FeatureKey, FeatureOption[]> = {
  forehead: [
    {
      type: "broad",
      label: "चौड़ा माथा (Absolute Ruler Intellect)",
      analysis: "सामुद्रिक शास्त्र के अनुसार ऐसा चौड़ा माथा साक्षात राजयोग का प्रतीक है। आपके भीतर गजब की लीडरशिप और बड़ा व्यापार साम्राज्य खड़ा करने की क्षमता जन्मजात है। आपके सितारे बुलंद हैं और समाज में आपका नाम और रुतबा सर्वोच्च स्तर पर पहुँचेगा।",
      timeline: "आगामी 11 महीनों के भीतर आपकी कुंडली में धन का महा-आगमन निश्चित है।",
      remedy: "रोज सुबह सूर्य देव को तांबे के लोटे से जल चढ़ाएं और सिंदूर का तिलक लगाएं।"
    },
    {
      type: "narrow",
      label: "छोटा या संकुचित माथा (Sharp Executioner)",
      analysis: "सामुद्रिक रहस्य के अनुसार छोटा माथा अत्यंत तीव्र बुद्धि और अचूक रणनीतिकार की निशानी है। आप जो ठान लेते हैं, उसे हासिल करके ही दम लेते हैं। आपके जीवन में अचानक और अप्रत्याशित रूप से छप्परफाड़ धन लाभ होगा।",
      timeline: "अगले 4 महीनों के अंदर आपके करियर में एक बहुत बड़ा और चमत्कारी मोड़ आने वाला है।",
      remedy: "बुधवार के दिन गाय को हरी घास खिलाएं और अपने पास एक चांदी का सिक्का रखें।"
    },
  ],
  eyes: [
    {
      type: "big",
      label: "बड़ी आँखें (Magnetic Attraction Eyes)",
      analysis: "बड़ी और सम्मोहक आँखें स्पष्ट करती हैं कि आपके भीतर सम्मोहन शक्ति (Magnetism) कूट-कूट कर भरी है। लोग आपकी तरफ खिंचे चले आते हैं। व्यापार और समाज में आपकी साख इतनी मजबूत होगी कि विरोधी स्वतः ही घुटने टेक देंगे।",
      timeline: "आगामी अक्टूबर 2027 से पहले आपके जीवन की सबसे बड़ी मनोकामना 100% पूरी होने जा रही है।",
      remedy: "प्रतिदिन हनुमान चालीसा का पाठ करें और आँखों में नियमित रूप से गुलाब जल डालें।"
    },
    {
      type: "small",
      label: "छोटी या तीखी आँखें (The Eagle Eye Mastermind)",
      analysis: "तीखी और बाज जैसी निगाहें ये साबित करती हैं कि आप गुप्त शत्रुओं की चालों को समय से पहले भांप लेते हैं। कोई आपको धोखा नहीं दे सकता। धन संचय के मामले में आपका दिमाग बहुत तेज चलता है और आप करोड़ों का साम्राज्य खड़ा करेंगे।",
      timeline: "आने वाले 45 दिनों के भीतर आपको एक बहुत बड़ी खुशखबरी या गुप्त धन की प्राप्ति होगी।",
      remedy: "शनिवार की शाम को पीपल के पेड़ के नीचे सरसों के तेल का दीपक प्रज्वलित करें।"
    },
  ],
  lips: [
    {
      type: "full",
      label: "भरे हुए होंठ (Royal Luxury Communicator)",
      analysis: "भरे हुए और स्पष्ट होंठ सामुद्रिक विज्ञान में ऐश्वर्य और उच्च विलासिता (Luxury Life) का साक्षात प्रमाण हैं। आपकी वाणी में मां सरस्वती का वास है। आप अपनी मीठी जुबान और तर्कों से हर बड़ी डील अपने नाम कर लेते हैं।",
      timeline: "अगले साल मार्च के महीने में भूमि, भवन या वाहन का सुख आपको निश्चित रूप से मिलने वाला है।",
      remedy: "शुक्रवार के दिन मां लक्ष्मी को मिश्री और मखाने का भोग लगाएं और गुलाबी वस्त्र धारण करें।"
    },
    {
      type: "thin",
      label: "पतले होंठ (Diplomatic Command Lips)",
      analysis: "पतले होंठ अत्यंत चतुर, कूटनीतिज्ञ और सटीक निर्णय लेने वाले शासक के होते हैं। आप भावनाओं में बहकर कभी अपना नुकसान नहीं करते। आपका यही गुण आपको बहुत जल्द अपने कुल का सबसे अमीर व्यक्ति बनाएगा।",
      timeline: "अगले 3 महीनों के भीतर आपकी आय के नए और परमानेंट स्रोत (Multiple Income Streams) चालू होंगे।",
      remedy: "गुरुवार को भगवान विष्णु के मंदिर में चने की दाल और पीले केले का दान करें।"
    },
  ],
};

export default function FaceReadingPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const [step, setStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<FeatureKey, string>>({
    forehead: "",
    eyes: "",
    lips: "",
  });
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageClass = isDark
    ? "bg-slate-950 text-white"
    : "bg-gradient-to-b from-orange-50 to-white text-slate-900";

  const panelClass = isDark
    ? "border-white/10 bg-white/[0.04]"
    : "border-orange-100 bg-white shadow-lg";

  const mutedClass = isDark ? "text-slate-300" : "text-gray-600";

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("कृपया JPG, PNG या मान्य इमेज चुनें।");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("फोटो का आकार 5 MB से कम होना चाहिए।");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result);
        setStep("questions");
      } else {
        setError("फोटो पढ़ी नहीं जा सकी। दोबारा कोशिश करें।");
      }
    };
    reader.onerror = () => {
      setError("फोटो अपलोड नहीं हो पाई। फिर कोशिश करें।");
    };
    reader.readAsDataURL(file);
  }

  function selectAnswer(field: FeatureKey, value: string) {
    setAnswers((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
  }

  function processReading() {
    if (!answers.forehead || !answers.eyes || !answers.lips) {
      setError("कृपया तीनों शारीरिक लक्षणों के सही विकल्पों को चुनें।");
      return;
    }

    setError("");
    setIsScanning(true);

    window.setTimeout(() => {
      setIsScanning(false);
      setStep("result");
    }, 1500);
  }

  function resetModule() {
    setStep("upload");
    setSelectedImage(null);
    setAnswers({
      forehead: "",
      eyes: "",
      lips: "",
    });
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function getSelectedFeature(field: FeatureKey) {
    return FACE_FEATURES[field].find(
      (feature) => feature.type === answers[field],
    );
  }

  const selectedFeatures = [
    {
      title: "ललाट (माथे) का दिव्य राजयोग फल",
      feature: getSelectedFeature("forehead"),
      icon: Brain,
    },
    {
      title: "नेत्र (आँखों) का सम्मोहन एवं भाग्य चक्र",
      feature: getSelectedFeature("eyes"),
      icon: Eye,
    },
    {
      title: "ओष्ठ (होंठों) का ऐश्वर्य और धन योग फल",
      feature: getSelectedFeature("lips"),
      icon: MessageCircle,
    },
  ];

  return (
    <main className={`min-h-dvh px-4 pb-16 pt-6 ${pageClass}`}>
      <div className="mx-auto max-w-xl">
        <header className="mb-7 flex items-center gap-4">
          <Link
            href="/"
            aria-label="वापस जाएँ"
            className={`rounded-xl border p-2.5 ${
              isDark
                ? "border-white/10 bg-slate-900"
                : "border-orange-200 bg-white shadow-sm"
            }`}
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-xl font-bold">👑 प्रीमियम एआई सामुद्रिक शास्त्र</h1>
            <p className="mt-1 text-xs font-bold text-orange-500">
              Face Reading · 100% Authoritative Prediction
            </p>
          </div>
        </header>

        {step === "upload" && (
          <section className={`rounded-2xl border p-5 ${panelClass}`}>
            <div className="mb-5 rounded-xl border border-orange-500/20 bg-orange-500/10 p-5 text-center">
              <Scan
                className="mx-auto mb-3 animate-pulse text-orange-500"
                size={38}
              />
              <h2 className="text-sm font-black uppercase tracking-wide text-orange-500">
                चेहरे की बनावट से जानें अपना संपूर्ण भाग्य
              </h2>
              <p className={`mt-3 text-xs leading-6 ${mutedClass}`}>
                सामुद्रिक विज्ञान के गुप्त सूत्रों के अनुसार आपकी आँखें, माथा और होंठ आपके आने वाले कल का पूरा सच बयां करते हैं। अपनी फोटो अपलोड करें और अचूक महा-भविष्यवाणी प्राप्त करें।
              </p>
            </div>

            {selectedImage && (
              <img
                src={selectedImage}
                alt="चुनी गई फोटो का प्रीव्यू"
                className="mx-auto mb-4 max-h-64 rounded-xl object-contain"
              />
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="user"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-400/50 p-7 text-xs font-bold transition hover:bg-orange-500/10"
            >
              <Camera size={20} />
              चेहरे का महा-स्कैन शुरू करें (कैमरा / गैलरी)
            </button>

            <button
              type="button"
              onClick={() => setStep("questions")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-orange-700"
            >
              <ImageIcon size={16} />
              मैन्युअली लक्षण चुनकर आगे बढ़ें
            </button>

            {error && (
              <p className="mt-3 text-center text-sm font-bold text-red-500">
                {error}
              </p>
            )}
          </section>
        )}

