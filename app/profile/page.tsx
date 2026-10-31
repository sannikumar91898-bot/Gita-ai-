// app/profile/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Camera, Check, X, Save, User, Calendar, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// Zodiac Avatars List (Using DiceBear API for realistic illustrations)
const AVATARS = [
  { id: "aries-f", name: "Aries", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AriesFemale&backgroundColor=FFD700" },
  { id: "aries-m", name: "Aries", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AriesMale&backgroundColor=FFD700" },
  { id: "taurus-f", name: "Taurus", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=TaurusFemale&backgroundColor=FFD700" },
  { id: "taurus-m", name: "Taurus", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=TaurusMale&backgroundColor=FFD700" },
  { id: "gemini-f", name: "Gemini", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=GeminiFemale&backgroundColor=FFD700" },
  { id: "gemini-m", name: "Gemini", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=GeminiMale&backgroundColor=FFD700" },
  { id: "cancer-f", name: "Cancer", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CancerFemale&backgroundColor=FFD700" },
  { id: "cancer-m", name: "Cancer", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CancerMale&backgroundColor=FFD700" },
  { id: "leo-f", name: "Leo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeoFemale&backgroundColor=FFD700" },
  { id: "leo-m", name: "Leo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeoMale&backgroundColor=FFD700" },
  { id: "virgo-f", name: "Virgo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=VirgoFemale&backgroundColor=FFD700" },
  { id: "virgo-m", name: "Virgo", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=VirgoMale&backgroundColor=FFD700" },
  { id: "libra-f", name: "Libra", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LibraFemale&backgroundColor=FFD700" },
  { id: "libra-m", name: "Libra", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=LibraMale&backgroundColor=FFD700" },
  { id: "scorpio-f", name: "Scorpio", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=ScorpioFemale&backgroundColor=FFD700" },
  { id: "scorpio-m", name: "Scorpio", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=ScorpioMale&backgroundColor=FFD700" },
  { id: "sagittarius-f", name: "Sagittarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=SagittariusFemale&backgroundColor=FFD700" },
  { id: "sagittarius-m", name: "Sagittarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=SagittariusMale&backgroundColor=FFD700" },
  { id: "capricorn-f", name: "Capricorn", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CapricornFemale&backgroundColor=FFD700" },
  { id: "capricorn-m", name: "Capricorn", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=CapricornMale&backgroundColor=FFD700" },
  { id: "aquarius-f", name: "Aquarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AquariusFemale&backgroundColor=FFD700" },
  { id: "aquarius-m", name: "Aquarius", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=AquariusMale&backgroundColor=FFD700" },
  { id: "pisces-f", name: "Pisces", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=PiscesFemale&backgroundColor=FFD700" },
  { id: "pisces-m", name: "Pisces", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=PiscesMale&backgroundColor=FFD700" },
];

export default function ProfilePage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].img);

  const t = (hi: string, hing: string, en: string) =>
    lang === "hi" ? hi : lang === "hinglish" ? hing : en;

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 ${
    isDark ? "border-slate-700 bg-slate-800 text-white" : "border-gray-200 bg-white text-gray-900 shadow-sm"
  }`;

  return (
    <main className={`min-h-screen w-full px-4 pb-10 pt-5 ${isDark ? "bg-slate-950 text-violet-50" : "bg-[#F8F9FA] text-slate-900"}`}>
      
      {/* HEADER */}
      <header className="mb-6 flex items-center gap-4 max-w-xl mx-auto">
        <Link href="/" className={`rounded-full p-2 ${isDark ? "bg-slate-800" : "bg-white shadow-sm"}`}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">{t("प्रोफाइल", "Profile", "Profile")}</h1>
      </header>

      <div className="mx-auto max-w-xl space-y-6">
        
        {/* AVATAR SECTION */}
        <section className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-yellow-400 bg-yellow-400">
              <img src={selectedAvatar} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              className="absolute bottom-0 right-0 rounded-full bg-slate-800 p-2.5 text-white shadow-lg transition hover:bg-slate-700"
            >
              <Camera size={18} />
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold text-gray-500">
            {t("प्रोफाइल फोटो बदलें", "Change Profile Pic", "Change Profile Pic")}
          </p>
        </section>

        {/* BIRTH DETAILS FORM (Exactly as in screenshot) */}
        <section className={`rounded-2xl p-5 space-y-4 ${isDark ? "bg-slate-900" : "bg-white shadow-sm"}`}>
          
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-500">{t("नाम", "Name", "Name")}</label>
            <input type="text" defaultValue="SANNI KUMAR" className={inputClass} placeholder="Enter Name" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-500">{t("लिंग", "Gender", "Gender")}</label>
            <select className={inputClass}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-500">{t("जन्म तिथि", "Date of Birth", "Date")}</label>
              <input type="date" defaultValue="2000-01-01" className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-500">{t("जन्म समय", "Time of Birth", "Time")}</label>
              <input type="time" defaultValue="12:00" className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-500">{t("जन्म स्थान", "Place of Birth", "Place")}</label>
            <input type="text" placeholder="Enter Place of Birth" className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-500">{t("शहर", "City", "City")}</label>
            <input type="text" placeholder="Enter City" className={inputClass} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-500">{t("पिनकोड", "Pincode", "Pincode")}</label>
            <input type="text" placeholder="Enter Pincode" className={inputClass} />
          </div>

          <button className="mt-4 w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-white transition hover:bg-slate-700">
            Submit
          </button>
        </section>
      </div>

      {/* AVATAR PICKER MODAL (Exactly like screenshot) */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            
            <div className="border-b border-gray-200 px-5 py-4 text-center">
              <h2 className="text-lg font-bold text-gray-800">Change Profile Pic</h2>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <p className="mb-4 text-sm font-semibold text-gray-500">Select from Library</p>
              
              <div className="grid grid-cols-4 gap-4">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => {
                      setSelectedAvatar(avatar.img);
                      setPickerOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-transparent bg-yellow-400 transition group-hover:border-orange-500">
                      <img src={avatar.img} alt={avatar.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 truncate w-full text-center">
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => setPickerOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                <X size={16} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}