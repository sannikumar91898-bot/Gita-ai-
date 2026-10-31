// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  LogOut,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  X,
  Phone,
} from "lucide-react";
import { useApp } from "../Providers";

const NAME_KEY = "gita_customer_profile_name";
const AVATAR_KEY = "gita_customer_profile_avatar";
const OLD_PHOTO_KEY = "gita_customer_profile_photo";

type AvatarOption = {
  id: string;
  sign: string;
  symbol: string;
  face: string;
  color: string;
};

const AVATARS: AvatarOption[] = [
  { id: "aries-f", sign: "Aries", symbol: "♈", face: "👩🏻‍🦰", color: "from-rose-500 to-orange-300" },
  { id: "aries-m", sign: "Aries", symbol: "♈", face: "🧑🏻‍🦱", color: "from-amber-300 to-yellow-500" },
  { id: "taurus-f", sign: "Taurus", symbol: "♉", face: "👩🏽", color: "from-emerald-500 to-lime-300" },
  { id: "taurus-m", sign: "Taurus", symbol: "♉", face: "👨🏻‍🦱", color: "from-yellow-300 to-amber-500" },
  { id: "gemini-f", sign: "Gemini", symbol: "♊", face: "👭🏻", color: "from-fuchsia-500 to-pink-300" },
  { id: "gemini-m", sign: "Gemini", symbol: "♊", face: "👬🏻", color: "from-sky-400 to-cyan-200" },
  { id: "cancer-f", sign: "Cancer", symbol: "♋", face: "👩🏻‍🦱", color: "from-indigo-500 to-violet-300" },
  { id: "cancer-m", sign: "Cancer", symbol: "♋", face: "🧑🏽", color: "from-blue-500 to-cyan-300" },
  { id: "leo-f", sign: "Leo", symbol: "♌", face: "👩🏼‍🦰", color: "from-orange-500 to-yellow-300" },
  { id: "leo-m", sign: "Leo", symbol: "♌", face: "👨🏼‍🦱", color: "from-amber-400 to-orange-500" },
  { id: "virgo-f", sign: "Virgo", symbol: "♍", face: "👩🏻", color: "from-teal-400 to-emerald-600" },
  { id: "virgo-m", sign: "Virgo", symbol: "♍", face: "🧑🏻‍🦳", color: "from-violet-400 to-fuchsia-400" },
  { id: "libra-f", sign: "Libra", symbol: "♎", face: "👩🏽‍🦱", color: "from-pink-400 to-rose-300" },
  { id: "libra-m", sign: "Libra", symbol: "♎", face: "👨🏽", color: "from-sky-400 to-indigo-400" },
  { id: "scorpio-f", sign: "Scorpio", symbol: "♏", face: "👩🏾", color: "from-red-600 to-fuchsia-500" },
  { id: "scorpio-m", sign: "Scorpio", symbol: "♏", face: "👨🏽‍🦱", color: "from-purple-600 to-pink-400" },
  { id: "sagittarius-f", sign: "Sagittarius", symbol: "♐", face: "👩🏻‍🦰", color: "from-violet-500 to-blue-400" },
  { id: "sagittarius-m", sign: "Sagittarius", symbol: "♐", face: "🏹", color: "from-indigo-500 to-sky-300" },
  { id: "capricorn-f", sign: "Capricorn", symbol: "♑", face: "👩🏼", color: "from-emerald-600 to-teal-300" },
  { id: "capricorn-m", sign: "Capricorn", symbol: "♑", face: "🧑🏻", color: "from-stone-400 to-amber-200" },
  { id: "aquarius-f", sign: "Aquarius", symbol: "♒", face: "👩🏽‍🦳", color: "from-cyan-400 to-blue-500" },
  { id: "aquarius-m", sign: "Aquarius", symbol: "♒", face: "👨🏻", color: "from-blue-500 to-violet-400" },
  { id: "pisces-f", sign: "Pisces", symbol: "♓", face: "👩🏻‍🦱", color: "from-violet-400 to-pink-300" },
  { id: "pisces-m", sign: "Pisces", symbol: "♓", face: "🧑🏼‍🦱", color: "from-cyan-400 to-teal-300" },
];

function AvatarArt({ avatarId, large = false }: { avatarId: string; large?: boolean }) {
  const avatar = AVATARS.find((item) => item.id === avatarId) ?? AVATARS[0];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-orange-200/80 bg-gradient-to-br ${avatar.color} ${
        large ? "h-28 w-28 text-5xl" : "mx-auto h-[68px] w-[68px] text-3xl"
      }`}
    >
      <span aria-hidden="true" className="drop-shadow-sm">
        {avatar.face}
      </span>
      <span
        className={`absolute bottom-0 right-0 flex items-center justify-center rounded-full border border-orange-100/50 bg-slate-900 font-semibold text-orange-200 ${
          large ? "h-7 w-7 text-sm" : "h-5 w-5 text-[10px]"
        }`}
      >
        {avatar.symbol}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { me, loading, lang, theme } = useApp();
  
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-xl";
  const mutedClass = isDark ? "text-slate-400" : "text-gray-500";

  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState("aries-f");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) || me?.user?.name || "");
      const savedAvatar = localStorage.getItem(AVATAR_KEY);
      if (savedAvatar && AVATARS.some((item) => item.id === savedAvatar)) {
        setAvatarId(savedAvatar);
      }
      localStorage.removeItem(OLD_PHOTO_KEY);
    } catch {
      setName(me?.user?.name || "");
    }
  }, [me?.user?.name]);

  function chooseAvatar(id: string) {
    setAvatarId(id);
    setPickerOpen(false);
    setMessage("");
    try {
      localStorage.setItem(AVATAR_KEY, id);
      localStorage.removeItem(OLD_PHOTO_KEY);
      setMessage(t("अवतार सेव हो गया।", "Avatar save ho gaya.", "Avatar saved."));
    } catch {
      setMessage(t("अवतार सेशन के लिए सेलेक्ट हुआ।", "Avatar session ke liye select hua.", "Avatar selected for session."));
    }
  }

  function saveProfile() {
    setSaving(true);
    setMessage("");
    try {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setMessage(t("कृपया अपना नाम लिखें।", "Kripya apna naam likhein.", "Please enter your name."));
        return;
      }
      localStorage.setItem(NAME_KEY, trimmedName);
      setName(trimmedName);
      setMessage(t("प्रोफाइल सेव हो गई।", "Profile save ho gayi.", "Profile saved."));
    } catch {
      setMessage(t("प्रोफाइल सेव नहीं हो पाई।", "Profile save nahi ho payi.", "Could not save profile."));
    } finally {
      setSaving(false);
    }
  }

  const displayName = name.trim() || t("आपकी प्रोफाइल", "Aapki Profile", "Your Profile");
  const selectedAvatar = AVATARS.find((item) => item.id === avatarId) ?? AVATARS[0];

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("मेरी प्रोफाइल", "My Profile", "My Profile")}
            </h1>
            <p className={`text-[11px] font-bold ${mutedClass}`}>
              {t("अपनी जानकारी मैनेज करें", "Apni jankari manage karein", "Manage your details")}
            </p>
          </div>
        </header>

        {/* PROFILE CARD */}
        <section className={`relative overflow-hidden rounded-2xl border p-6 text-center ${cardClass}`}>
          <div className="relative flex flex-col items-center">
            <div className="relative mb-4">
              <AvatarArt avatarId={avatarId} large />
              <button
                onClick={() => setPickerOpen(true)}
                className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-red-500 p-2 text-white shadow-lg transition hover:scale-105"
              >
                <Camera size={17} />
              </button>
            </div>

            <h2 className="text-xl font-bold">{displayName}</h2>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              {loading ? "Loading..." : me?.user?.email || "GitaTalk Member"}
            </p>

            <button
              onClick={() => setPickerOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 dark:bg-slate-800 dark:border-slate-700 dark:text-orange-400"
            >
              <Sparkles size={16} />
              {t("अवतार चुनें", "Choose Avatar", "Choose Avatar")}
            </button>
          </div>
        </section>

        {/* PERSONAL INFO */}
        <section className={`rounded-2xl border p-5 ${cardClass}`}>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <UserRound size={18} />
            </span>
            <h2 className="text-lg font-bold">
              {t("व्यक्तिगत जानकारी", "Personal Information", "Personal Information")}
            </h2>
          </div>

          <label className={`mb-2 block text-sm font-bold ${mutedClass}`}>
            {t("आपका नाम", "Aapka Naam", "Your name")}
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("नाम लिखें", "Naam likhein", "Enter name")}
            maxLength={80}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 ${
              isDark ? "border-slate-700 bg-slate-800 text-white" : "border-orange-200 bg-orange-50 text-slate-900"
            }`}
          />

          <button
            onClick={saveProfile}
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 font-bold text-white shadow-md transition active:scale-95 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? t("सेव हो रहा है...", "Saving...", "Saving...") : t("प्रोफाइल सेव करें", "Save Profile", "Save Profile")}
          </button>

          {message && (
            <p className="mt-3 text-center text-sm font-semibold text-orange-500">
              {message}
            </p>
          )}
        </section>

        {/* LINKS */}
        <section className={`overflow-hidden rounded-2xl border ${cardClass}`}>
          <Link href="/wallet" className={`flex items-center gap-3 border-b px-4 py-4 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-100 hover:bg-gray-50"}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <Wallet size={20} />
            </span>
            <div className="flex-1">
              <p className="font-bold">{t("मेरा वॉलेट", "My Wallet", "My Wallet")}</p>
              <p className={`text-xs ${mutedClass}`}>{t("बैलेंस और ट्रांजैक्शन", "Balance aur transactions", "Balance and transactions")}</p>
            </div>
            <ChevronRight size={19} className={mutedClass} />
          </Link>

          <Link href="/settings" className={`flex items-center gap-3 border-b px-4 py-4 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-100 hover:bg-gray-50"}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <Settings size={20} />
            </span>
            <div className="flex-1">
              <p className="font-bold">{t("सेटिंग्स", "Settings", "Settings")}</p>
              <p className={`text-xs ${mutedClass}`}>{t("भाषा और थीम", "Language aur theme", "Language and appearance")}</p>
            </div>
            <ChevronRight size={19} className={mutedClass} />
          </Link>

          <div className="flex items-center gap-3 px-4 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <ShieldCheck size={20} />
            </span>
            <div className="flex-1">
              <p className="font-bold">{t("प्राइवेसी", "Privacy", "Privacy")}</p>
              <p className={`text-xs ${mutedClass}`}>{t("आपकी जानकारी सुरक्षित है", "Aapki jankari surakshit hai", "Your details are private")}</p>
            </div>
          </div>
        </section>

        <Link
          href="/"
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-orange-200 text-slate-600 hover:bg-orange-50"}`}
        >
          <LogOut size={17} />
          {t("होम पर वापस जाएं", "Back to Home", "Back to Home")}
        </Link>
      </div>

      {/* FIXED RED BAR (Linked to Chat) */}
      <Link
        href="/chat"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Phone size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
              {isHindi ? "ज्योतिषी • 24x7 उपलब्ध" : "Astrologer • 24x7 Available"}
            </p>
            <p className="text-sm font-black">
              {isHindi ? "अभी बात करें — पहली चैट FREE" : "Talk Now — First Chat FREE"}
            </p>
          </div>
        </div>
      </Link>

      {/* AVATAR PICKER MODAL */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setPickerOpen(false); }}
        >
          <section className={`flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-2xl ${isDark ? "border-slate-700 bg-slate-900" : "border-orange-200 bg-white"}`}>
            <header className={`flex items-center gap-3 border-b px-4 py-4 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <Sparkles size={21} />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg">{t("अवतार चुनें", "Choose Avatar", "Choose Avatar")}</h2>
              </div>
              <button onClick={() => setPickerOpen(false)} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800">
                <X size={20} />
              </button>
            </header>

            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {AVATARS.map((avatar) => {
                  const selected = avatar.id === avatarId;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => chooseAvatar(avatar.id)}
                      className={`relative rounded-2xl border p-2 text-center transition active:scale-95 ${
                        selected 
                          ? "border-orange-500 bg-orange-50 dark:bg-slate-800" 
                          : isDark ? "border-slate-700 bg-slate-800 hover:border-slate-500" : "border-gray-200 bg-gray-50 hover:border-orange-300"
                      }`}
                    >
                      {selected && (
                        <span className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                          <Check size={12} />
                        </span>
                      )}
                      <AvatarArt avatarId={avatar.id} />
                      <span className="mt-2 block truncate text-xs font-bold">{avatar.sign}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className={`border-t p-3 ${isDark ? "border-slate-700" : "border-gray-100"}`}>
              <button
                onClick={() => setPickerOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold text-white shadow"
              >
                <Check size={17} /> {t("हो गया", "Done", "Done")}
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}