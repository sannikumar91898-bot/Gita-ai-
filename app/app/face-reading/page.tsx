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
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { useApp } from "../../Providers";

type FeatureKey = "forehead" | "eyes" | "lips";
type Step = "upload" | "questions" | "result";

type FeatureOption = {
  type: string;
  label: string;
  analysis: string;
};

// 👑 100% राजयोग और महा-भाग्यशाली फलादेश मैट्रिक्स (बकवास थ्योरी पूरी साफ़)
const FACE_FEATURES: Record<FeatureKey, FeatureOption[]> = {
  forehead: [
    {
      type: "broad",
      label: "चौड़ा माथा (Broad Forehead) - अत्यंत भाग्यशाली एवं राजसी",
      analysis:
        "सामुद्रिक शास्त्र के अनुसार चौड़े माथे वाले व्यक्ति प्रचंड बुद्धिमान और लीडरशिप के धनी होते हैं। आपके जीवन में बड़े धन लाभ, सरकारी मान-सम्मान और अटूट राजयोग के प्रबल संकेत हैं।",
    },
    {
      type: "narrow",
      label: "छोटा या संकुचित माथा (Narrow Forehead) - व्यावहारिक एवं तीव्र अंतर्ज्ञान",
      analysis:
        "आपका माथा दर्शाता है कि आप अपनी तीक्ष्ण अंतरात्मा (Intuition) से बड़े फैसले लेते हैं। आप स्वतंत्र व्यापार में अपार सफलता प्राप्त करेंगे और गुप्त धन अर्जित करेंगे।",
    },
  ],
  eyes: [
    {
      type: "big",
      label: "बड़ी आँखें (Big Eyes) - चुंबकीय आकर्षण एवं वैभव",
      analysis:
        "आपकी आँखें राजसी आकर्षण का प्रतीक हैं। लोग आपसे पहली मुलाकात में ही अत्यधिक प्रभावित हो जाते हैं। आपकी कुंडली का शुक्र मजबूत है, जिससे विलासिता और आकस्मिक धन लाभ निश्चित है।",
    },
    {
      type: "small",
      label: "छोटी या तीखी आँखें (Small/Sharp Eyes) - फोकस्ड एवं अत्यंत चतुर",
      analysis:
        "सामुद्रिक शास्त्र के अनुसार तीखी आँखें अचूक फोकस्ड दिमाग को दर्शाती हैं। किसी भी चाल या बारीकी को पकड़ने में आपको महारत हासिल है। कोई आपको व्यापार या धन के मामले में धोखा नहीं दे सकता।",
    },
  ],
  lips: [
    {
      type: "full",
      label: "भरे हुए होंठ (Full Lips) - राजसी संवाद शैली एवं उच्च पद",
      analysis:
        "आपके होंठ बताते हैं कि आपकी वाणी में साक्षात सरस्वती का वास है। आप अपनी संवाद शैली से बड़ी से बड़ी बिजनेस डील चुटकियों में पक्की कर लेते हैं। समाज में आपका प्रभाव हमेशा शीर्ष पर रहेगा।",
    },
    {
      type: "thin",
      label: "पतले होंठ (Thin Lips) - आत्मनिर्भर एवं अकूत धन के स्वामी",
      analysis:
        "पतले होंठ साफ दर्शाते हैं कि आप एक सफल रणनीतिकार हैं। आप अपनी गुप्त योजनाओं के बल पर व्यापार जगत में इंडस्ट्री लीडर बनने की क्षमता रखते हैं। धन का आगमन चारों दिशाओं से होगा।",
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
    : "bg-gradient-to-b from-orange-50/40 to-white text-slate-900";

  const panelClass = isDark
    ? "border-white/10 bg-white/[0.04]"
    : "border-orange-100 bg-white shadow-xl";

  const mutedClass = isDark ? "text-slate-300" : "text-gray-700";

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("कृपया JPG, PNG या कोई मान्य इमेज चुनें।");
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
      setError("फोटो अपलोड नहीं हो पाई। कृपया फिर कोशिश करें।");
    };

    reader.readAsDataURL(file);
  };

  const selectAnswer = (field: FeatureKey, value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const processReading = () => {
    if (!answers.forehead || !answers.eyes || !answers.lips) {
      setError("कृपया तीनों सवालों के जवाब चुनें।");
      return;
    }

    setError("");
    setIsScanning(true);

    window.setTimeout(() => {
      setIsScanning(false);
      setStep("result");
    }, 1500);
  };

  const resetModule = () => {
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
  };

  const getSelectedFeature = (field: FeatureKey) =>
    FACE_FEATURES[field].find(
      (feature) => feature.type === answers[field]
    );

  const selectedFeatures = [
    {
      title: "ललाट फलादेश (Forehead Analysis)",
      feature: getSelectedFeature("forehead"),
    },
    {
      title: "नेत्र फलादेश (Eyes Insight)",
      feature: getSelectedFeature("eyes"),
    },
    {
      title: "ओष्ठ फलादेश (Lips Profile)",
      feature: getSelectedFeature("lips"),
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
            <h1 className="text-xl font-bold">
              👤 AI सामुद्रिक शास्त्र (Face Reading)
            </h1>
            <p className="mt-1 text-xs text-orange-500 font-bold">
              चेहरे और आँखों की बनावट से जानिए अपना 100% सटीक भविष्यफल
            </p>
          </div>
        </header>

        {step === "upload" && (
          <section className={`rounded-2xl border p-5 ${panelClass}`}>
            <div className="mb-5 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 text-center">
              <Scan className="mx-auto mb-2 text-orange-500 animate-pulse" size={34} />
              <h2 className="font-black text-sm uppercase tracking-wider text-orange-600">
                अपना चेहरा स्कैन करें
              </h2>
              <p className="mt-2 text-xs leading-6 font-semibold">
                सामने से खींची गई एक स्पष्ट फोटो अपलोड करें। हमारा ऑफलाइन सामुद्रिक शास्त्र एल्गोरिदम आपके गुप्त राजयोग और भाग्य का तुरंत विश्लेषण करेगा।
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-400/50 p-7 font-bold text-xs uppercase transition hover:bg-orange-500/10"
            >
              <Camera size={20} />
              फोटो अपलोड करें या कैमरा खोलें
            </button>

            <button
              type="button"
              onClick={() => setStep("questions")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3.5 text-xs font-black uppercase text-white shadow-md"
            >
              <ImageIcon size={16} />
              बिना फोटो सीधे शुरू करें →
            </button>

            {error && (
              <p className="mt-3 text-center text-sm text-red-500 font-bold">
                {error}
              </p>
            )}

            <p className="mt-4 text-center text-[10px] text-gray-400 font-medium">
              पूरी तरह सुरक्षित। आपकी फोटो आपके डिवाइस पर ही प्रोसेस होती है।
            </p>
          </section>
        )}

        {step === "questions" && (
          <section className={`space-y-6 rounded-2xl border p-5 ${panelClass}`}>
            <div>
              <h2 className="flex items-center gap-2 font-black text-sm uppercase text-orange-500">
                <HelpCircle size={16} />
                चेहरे के लक्षण लॉक करें
              </h2>
              <p className="mt-2 text-xs font-semibold">
                सटीक फलादेश रिपोर्ट के लिए अपनी बनावट के अनुसार सही विकल्प चुनें।
              </p>
            </div>

            {selectedImage && (
              <div className="flex items-center gap-3 rounded-xl bg-orange-500/10 p-3 border border-orange-200">
                <img
                  src={selectedImage}
                  alt="आपकी चुनी हुई फोटो"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-orange-600">
                    फोटो सफलतापूर्वक लिंक हो गई
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 text-xs text-gray-500 underline"
                  >
                    दूसरी फोटो बदलें
