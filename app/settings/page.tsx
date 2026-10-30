"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Info,
  Languages,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
  LockKeyhole,
  Settings as SettingsIcon,
} from "lucide-react";

import { useApp, type Theme } from "../Providers";
import type { Lang } from "../../i18n";

const LANGUAGE_OPTIONS: {
  value: Lang;
  label: string;
  description: string;
}[] = [
  {
    value: "hi",
    label: "हिंदी",
    description: "पूरी बातचीत हिंदी में",
  },
  {
    value: "hinglish",
    label: "Hinglish",
    description: "Hindi + simple English",
  },
  {
    value: "en",
    label: "English",
    description: "Chat in English",
  },
];

export default function SettingsPage() {
  const { lang, setLanguage, me, theme, setTheme } = useApp();

  const [savingLanguage, setSavingLanguage] = useState(false);
  const [languageMessage, setLanguageMessage] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setRemindersEnabled(
        localStorage.getItem("gita_reminders_enabled") === "true"
      );
    } catch {
      setRemindersEnabled(false);
    }
  }, []);

  async function chooseLanguage(value: Lang) {
    if (value === lang || savingLanguage) return;

    setSavingLanguage(true);
    setLanguageMessage("");

    try {
      await setLanguage(value);
      setLanguageMessage("Language preference updated successfully.");
    } catch {
      setLanguageMessage(
        "Language changed for this session. Server save could not be confirmed."
      );
    } finally {
      setSavingLanguage(false);
    }
  }

  function changeTheme(value: Theme) {
    setTheme(value);
  }

  function toggleReminders() {
    const nextValue = !remindersEnabled;
    setRemindersEnabled(nextValue);
    try {
      localStorage.setItem("gita_reminders_enabled", String(nextValue));
    } catch {
      // Preference still works local to the state session
    }
  }

  const selectedLanguage =
    lang === "hi" ? "हिंदी" : lang === "hinglish" ? "Hinglish" : "English";

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-dvh px-5 pb-16 pt-6 transition-colors duration-300 ${
        isDark
          ? "bg-celestial text-violet-50"
          : "bg-gradient-to-b from-violet-50/70 to-white text-violet-950"
      }`}
    >
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <Link
            href="/profile"
            aria-label="Back to profile"
            className={`rounded-full border p-2.5 transition-all duration-200 ${
              isDark
                ? "border-white/10 bg-white/[0.02] hover:bg-white/10 hover:scale-105"
                : "border-violet-200 bg-white hover:bg-violet-100/60 hover:scale-105 shadow-sm"
            }`}
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Settings
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-violet-300/90" : "text-violet-600 font-medium"
              }`}
            >
              Personalize your Gita AI experience
            </p>
          </div>

          <div
            className={`rounded-full p-2.5 transition-transform duration-500 hover:rotate-45 ${
              isDark ? "text-gold-400" : "text-violet-600"
            }`}
          >
            <SettingsIcon size={22} />
          </div>
        </header>

        {/* Language Section */}
        <section
          className={`mb-6 overflow-hidden rounded-2xl border p-6 transition-all duration-200 ${
            isDark
              ? "border-gold-400/20 bg-white/[0.03] shadow-inner"
              : "border-violet-200/80 bg-white shadow-md shadow-violet-100/40"
          }`}
        >
          <div className="mb-6 flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isDark ? "bg-gold-400/10 text-gold-400" : "bg-violet-100 text-violet-700"
              }`}
            >
              <Languages size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">Language</h2>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-violet-300/80" : "text-violet-500 font-medium"
                }`}
              >
                Choose your preferred chat language
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = lang === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={savingLanguage}
                  onClick={() => void chooseLanguage(option.value)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
                    selected
                      ? isDark
                        ? "border-gold-400 bg-gold-400/15 shadow-md"
                        : "border-violet-600 bg-violet-50 text-violet-950 ring-2 ring-violet-500/20 shadow-sm"
                      : isDark
                        ? "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5"
                        : "border-violet-100 bg-violet-50/30 hover:border-violet-200 hover:bg-violet-50/80"
                  } disabled:cursor-wait disabled:opacity-60`}
                >
                  <span className="min-w-0 flex-1">
                    <span className={`block font-semibold text-[15px] ${selected && !isDark ? "text-violet-900" : ""}`}>
                      {option.label}
                    </span>
                    <span
                      className={`mt-1 block text-xs leading-normal ${
                        selected
                          ? isDark
                            ? "text-gold-200/90"
                            : "text-violet-700 font-medium"
                          : isDark
                            ? "text-violet-300/70"
                            : "text-violet-500"
                      }`}
                    >
                      {option.description}
                    </span>
                  </span>

                  {selected ? (
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        isDark ? "bg-gold-400 text-celestial font-bold" : "bg-violet-600 text-white"
                      }`}
                    >
                      <Check size={14} strokeWidth={3.5} />
                    </div>
                  ) : (
                    <ChevronRight
                      size={18}
                      className={`shrink-0 transition-transform ${isDark ? "text-violet-400/60" : "text-violet-400"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {savingLanguage && (
            <div className="mt-4 flex items-center gap-2 px-1">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-gold-400"></span>
              <p
                className={`text-xs font-medium ${
                  isDark ? "text-gold-300/90" : "text-violet-600"
                }`}
              >
                Saving language preference...
              </p>
            </div>
          )}

          {languageMessage && (
            <p role="status" className={`mt-4 px-1 text-xs font-semibold ${languageMessage.includes('could not') ? 'text-amber-500' : 'text-emerald-500'}`}>
              {languageMessage}
            </p>
          )}
        </section>

        {/* Appearance / Theme */}
        <section
          className={`mb-6 overflow-hidden rounded-2xl border p-6 transition-all duration-200 ${
            isDark
              ? "border-gold-400/20 bg-white/[0.03] shadow-inner"
              : "border-violet-200/80 bg-white shadow-md shadow-violet-100/40"
          }`}
        >
          <div className="mb-6 flex items-center gap-3.5">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isDark ? "bg-gold-400/10 text-gold-400" : "bg-violet-100 text-violet-700"
              }`}
            >
              {isDark ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">Appearance</h2>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-violet-300/80" : "text-violet-500 font-medium"
                }`}
              >
                Change the theme across the app
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              aria-pressed={isDark}
              onClick={() => changeTheme("dark")}
              className={`flex items-center justify-center gap-3 rounded-xl border p-4 font-semibold text-[15px] transition-all duration-200 ${
                isDark
                  ? "border-gold-400 bg-violet-950 text-gold-300 shadow-md ring-2 ring-gold-400/20"
                  : "border-violet-200 bg-violet-50/50 text-violet-400 hover:bg-violet-100 hover:text-violet-700"
              }`}
            >
              <Moon size={18} className={isDark ? "text-gold-400" : ""} />
              <span>Dark</span>
