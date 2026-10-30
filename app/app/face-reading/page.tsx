"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Sparkles,
  Scan,
  Image as ImageIcon,
  Eye,
  Brain,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Heart,
  Zap,
} from "lucide-react";
import { useApp } from "../../Providers";

type FeatureKey = "forehead" | "eyes" | "lips";
type Step = "upload" | "questions" | "result";

type FeatureOption = {
  type: string;
  label: string;
  analysis: string;
  guidance: string;
};

const FACE_FEATURES: Record<FeatureKey, FeatureOption[]> = {
  forehead: [
    {
      type: "broad",
      label: "शाही चौड़ा माथा (Royal Broad Forehead)",
      analysis:
        "सामुद्रिक शास्त्र के अनुसार चौड़ा माथा साक्षात राजयोग की निशानी है। ऐसे जातक असाधारण बुद्धिमत्ता, तीव्र निर्णय क्षमता और नेतृत्व के गुण लेकर पैदा होते हैं। समाज में आपका मान-सम्मान और उच्च पद मिलना निश्चित है।",
      guidance:
        "आप बड़े बिजनेस या प्रशासनिक क्षेत्र में सफल होंगे। अपनी ऊर्जा को सही दिशा देने के लिए सूर्य देव की आराधना करें।",
    },
    {
      type: "narrow",
      label: "तेजस्वी संकुचित माथा (Sharp Forehead)",
      analysis:
        "ऐसा माथा अत्यधिक व्यावहारिक, फोकस्ड और जमीन से जुड़े व्यक्तित्व को दर्शाता है। आप अपनी मेहनत के दम पर शून्य से शिखर तक का सफर तय करते हैं और धन संचय करने में माहिर होते हैं।",
      guidance:
        "शनिवार के दिन पीपुल के वृक्ष के पास दीपक जलाएं, इससे भाग्य के बंद दरवाजे तुरंत खुलेंगे।",
    },
  ],
  eyes: [
    {
      type: "big",
      label: "गज लक्ष्मी आँखें (Magnetic Big Eyes)",
      analysis:
        "बड़ी और चमकदार आँखें सीधे तौर पर मजबूत शुक्र और गुरु ग्रह को दर्शाती हैं। आपके भीतर गजब का आकर्षण है। लोग आपकी तरफ खिंचे चले आते हैं और आप कला, मीडिया या बिजनेस में अपार धन कमाएंगे।",
      guidance:
        "शुक्रवार को मां लक्ष्मी को सफेद मिष्ठान का भोग लगाएं, आकर्षण और ऐश्वर्य में १० गुना वृद्धि होगी।",
    },
    {
      type: "small",
      label: "गंभीर तीक्ष्ण आँखें (Deep Analytical Eyes)",
      analysis:
        "सामुद्रिक विद्या कहती है कि छोटी और तीखी दृष्टि वाले लोग किसी के भी मन की बात भांप लेते हैं। आपका इंट्यूशन (पूर्वाभास) बहुत मजबूत है। आप गुप्त धन, शेयर मार्केट और जटिल व्यापार से भारी मुनाफा कमाते हैं।",
      guidance:
        "बुधवार के दिन गणेश जी को दूर्वा चढ़ाएं, जिससे आपकी बुद्धिमत्ता सही समय पर सटीक लाभ दिलाए।",
    },
  ],
  lips: [
    {
      type: "full",
      label: "अमृत होंठ (Full Dynamic Lips)",
      analysis:
        "भरे हुए सुडौल होंठ जातक की वाकसिद्धि (सरस्वती योग) को दर्शाते हैं। आपकी बोली में जादू है। आप अपनी बातों से बड़ी से बड़ी डील फाइनल कर लेते हैं। विलासितापूर्ण जीवन और भरपूर दांपत्य सुख आपका भाग्य है।",
      guidance:
        "अपने हाथ में एक शुद्ध स्फटिक या चांदी का छल्ला धारण करें ताकि आर्थिक समृद्धि हमेशा बनी रहे।",
    },
    {
      type: "thin",
      label: "संयमी धनुष होंठ (Determined Thin Lips)",
      analysis:
        "पतले और स्पष्ट होंठ उच्च स्तरीय कूटनीतिज्ञ और सफल बिजनेसमैन की पहचान हैं। आप बिना वजह पैसा बर्बाद नहीं करते और जीवन में बहुत कम उम्र में ही बड़ा आर्थिक साम्राज्य खड़ा कर लेते हैं।",
      guidance:
        "प्रतिदिन सुबह गायत्री मंत्र का जाप करें, रुका हुआ सारा धन तेजी से वापस आएगा।",
    },
  ],
};

const QUESTIONS: {
  key: FeatureKey;
  title: string;
  description: string;
  icon: typeof Brain;
}[] = [
  {
    key: "forehead",
    title: "आपके माथे (Forehead) की बनावट कैसी है?",
    description: "मिरर में देखकर सबसे सटीक विकल्प चुनें।",
    icon: Brain,
  },
  {
    key: "eyes",
    title: "आपकी आँखों (Eyes) का आकार कैसा है?",
    description: "अपने चेहरे के अनुसार सही आकार चुनें।",
    icon: Eye,
  },
  {
    key: "lips",
    title: "आपके होंठों (Lips) की बनावट कैसी है?",
    description: "अपनी प्राकृतिक बनावट का चयन करें।",
    icon: MessageCircle,
  },
];

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
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageClass = isDark
    ? "bg-slate-950 text-white"
    : "bg-gradient-to-b from-orange-50 to-white text-slate-900";

  const panelClass = isDark
    ? "border-white/10 bg-white/[0.04]"
    : "border-orange-100 bg-white shadow-sm";

  const mutedClass = isDark ? "text-slate-300" : "text-gray-600";

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("कृपया JPG, PNG या WEBP फोटो चुनें।");
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
      setError("फोटो लोड नहीं हो पाई। फिर कोशिश करें।");
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
      setError("आगे बढ़ने के लिए तीनों विकल्प चुनें।");
      return;
    }
    setError("");
    setIsScanning(true);

    window.setTimeout(() => {
      setIsScanning(false);
      setStep("result");
    }, 1200);
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
    return FACE_FEATURES[field].find((feature) => feature.type === answers[field]);
  }

  const selectedFeatures = [
    {
      title: "माथे से प्रकट राजयोग एवं बुद्धिमत्ता",
      feature: getSelectedFeature("forehead"),
      icon: Brain,
    },
    {
      title: "आँखों में छुपा आकर्षण एवं धनयोग",
      feature: getSelectedFeature("eyes"),
      icon: Eye,
    },
    {
      title: "होंठों से वाकसिद्धि एवं दांपत्य सुख",
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
              isDark ? "border-white/10 bg-slate-900" : "border-orange-200 bg-white shadow-sm"
            }`}
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-xl font-bold">👑 प्रीमियम एआई सामुद्रिक विश्लेषण</h1>
            <p className="mt-1 text-xs font-bold text-orange-500">
              Face Reading · Authentic Vedic Interpretation
            </p>
          </div>
        </header>

        {step === "upload" && (
          <section className={`rounded-2xl border p-5 ${panelClass}`}>
            <div className="mb-5 rounded-xl border border-orange-500/20 bg-orange-500/10 p-5 text-center">
              <Scan className="mx-auto mb-3 animate-pulse text-orange-500" size={38} />
              <h2 className="text-sm font-black uppercase tracking-wide text-orange-500">
                चेहरे की बनावट से जानें अपना छुपा हुआ भाग्य
              </h2>
              <p className={`mt-3 text-xs leading-6 ${mutedClass}`}>
                सामुद्रिक शास्त्र के गुप्त सूत्रों के अनुसार आपका चेहरा आपके भूत, भविष्य और वर्तमान का दर्पण है। अपनी फोटो अपलोड करें या सीधे आगे बढ़कर अपनी गुप्त शक्तियों को अनलॉक करें।
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
              चेहरे का लाइव स्कैन करें (कैमरा / गैलरी)
            </button>

            <button
              type="button"
              onClick={() => setStep("questions")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-xs font-black text-white shadow-md transition hover:bg-orange-700"
            >
              <ImageIcon size={16} />
              मैन्युअल लक्षण चुनकर आगे बढ़ें
            </button>

            {error && <p className="mt-3 text-center text-sm font-bold text-red-500">{error}</p>}
          </section>
        )}

        {step === "questions" && (
          <section className={`rounded-2xl border p-5 ${panelClass}`}>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-500">
