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
      setLanguageMessage("Language preference updated.");
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
      // Preference still works for this page session.
    }
  }

  const selectedLanguage =
    lang === "hi" ? "हिंदी" : lang === "hinglish" ? "Hinglish" : "English";

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-dvh px-4 pb-12 pt-4 transition-colors ${
        isDark
          ? "bg-celestial text-violet-50"
          : "bg-gradient-to-b from-violet-50 to-white text-violet-950"
      }`}
    >
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/profile"
            aria-label="Back to profile"
            className={`rounded-full border p-2.5 transition ${
              isDark
                ? "border-white/10 hover:bg-white/10"
                : "border-violet-200 bg-white hover:bg-violet-50 shadow-sm"
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
                isDark ? "text-violet-300" : "text-violet-600"
              }`}
            >
              Personalize your Gita AI experience
            </p>
          </div>

          <div
            className={`rounded-full p-2.5 ${
              isDark ? "text-gold-300" : "text-violet-600"
            }`}
          >
            <SettingsIcon size={22} />
          </div>
        </header>

        {/* Language Section */}
        <section
          className={`mb-5 overflow-hidden rounded-2xl border p-5 ${
            isDark
              ? "border-gold-400/15 bg-white/[0.04]"
              : "border-violet-200 bg-white shadow-sm"
          }`}
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? "bg-gold-400/10 text-gold-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              <Languages size={20} />
            </div>
            <div>
              <h2 className="font-semibold">Language</h2>
              <p
                className={`text-xs ${
                  isDark ? "text-violet-300" : "text-violet-500"
                }`}
              >
                Choose your preferred chat language
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = lang === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={savingLanguage}
                  onClick={() => void chooseLanguage(option.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                    selected
                      ? isDark
                        ? "border-gold-300/60 bg-gold-400/10 shadow-sm"
                        : "border-violet-500 bg-violet-50 shadow-sm"
                      : isDark
                        ? "border-white/10 bg-black/10 hover:bg-white/5"
                        : "border-violet-100 bg-violet-50/50 hover:bg-violet-50"
                  } disabled:cursor-wait disabled:opacity-60`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{option.label}</span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        isDark ? "text-violet-300" : "text-violet-500"
                      }`}
                    >
                      {option.description}
                    </span>
                  </span>

                  {selected ? (
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        isDark ? "bg-gold-400/20 text-gold-300" : "bg-violet-500 text-white"
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <ChevronRight
                      size={18}
                      className={isDark ? "text-violet-400" : "text-violet-400"}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {savingLanguage && (
            <p
              className={`mt-3 text-xs ${
                isDark ? "text-violet-300" : "text-violet-500"
              }`}
            >
              Saving language preference...
            </p>
          )}

          {languageMessage && (
            <p role="status" className="mt-3 text-xs font-medium text-emerald-500">
              {languageMessage}
            </p>
          )}
        </section>

        {/* Appearance / Theme */}
        <section
          className={`mb-5 overflow-hidden rounded-2xl border p-5 ${
            isDark
              ? "border-gold-400/15 bg-white/[0.04]"
              : "border-violet-200 bg-white shadow-sm"
          }`}
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? "bg-gold-400/10 text-gold-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p
                className={`text-xs ${
                  isDark ? "text-violet-300" : "text-violet-500"
                }`}
              >
                Change the theme across the app
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              aria-pressed={isDark}
              onClick={() => changeTheme("dark")}
              className={`flex items-center justify-center gap-2.5 rounded-xl border p-4 transition-all ${
                isDark
                  ? "border-gold-300 bg-violet-950 text-gold-200 shadow-md"
                  : "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
              }`}
            >
              <Moon size={18} />
              <span className="font-medium">Dark</span>
              {isDark && <Check size={16} className="ml-1" />}
            </button>

            <button
              type="button"
              aria-pressed={!isDark}
              onClick={() => changeTheme("light")}
              className={`flex items-center justify-center gap-2.5 rounded-xl border p-4 transition-all ${
                !isDark
                  ? "border-violet-500 bg-violet-600 text-white shadow-md"
                  : "border-white/10 bg-black/10 text-violet-200 hover:bg-white/5"
              }`}
            >
              <Sun size={18} />
              <span className="font-medium">Light</span>
              {!isDark && <Check size={16} className="ml-1" />}
            </button>
          </div>

          <p
            className={`mt-4 text-xs ${
              isDark ? "text-violet-400" : "text-violet-500"
            }`}
          >
            {mounted
              ? `Current theme: ${isDark ? "Dark Purple & Gold" : "Clean Light"}`
              : "Loading theme preference..."}
          </p>
        </section>

        {/* Reminder Preference */}
        <section
          className={`mb-5 overflow-hidden rounded-2xl border p-5 ${
            isDark
              ? "border-gold-400/15 bg-white/[0.04]"
              : "border-violet-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? "bg-gold-400/10 text-gold-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              <Bell size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">Reminder Preference</h2>
              <p
                className={`mt-0.5 text-xs leading-5 ${
                  isDark ? "text-violet-300" : "text-violet-500"
                }`}
              >
                Save your reminder preference on this device
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={remindersEnabled}
              aria-label="Toggle reminder preference"
              onClick={toggleReminders}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                remindersEnabled
                  ? "bg-gold-500"
                  : isDark
                    ? "bg-violet-900"
                    : "bg-violet-200"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  remindersEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <p
            className={`mt-4 text-xs ${
              isDark ? "text-violet-400" : "text-violet-500"
            }`}
          >
            {remindersEnabled ? "Reminders preference is on." : "Reminders preference is off."}
          </p>
        </section>

        {/* Account Info */}
        <section
          className={`mb-5 overflow-hidden rounded-2xl border p-5 ${
            isDark
              ? "border-gold-400/15 bg-white/[0.04]"
              : "border-violet-200 bg-white shadow-sm"
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? "bg-gold-400/10 text-gold-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              <UserRound size={20} />
            </div>
            <h2 className="font-semibold">Account</h2>
          </div>

          <div
            className={`rounded-xl border p-4 ${
              isDark ? "border-white/10 bg-black/20" : "border-violet-100 bg-violet-50/50"
            }`}
          >
            <div className="space-y-3">
              <div>
                <p
                  className={`text-xs ${
                    isDark ? "text-violet-400" : "text-violet-500"
                  }`}
                >
                  Account name
                </p>
                <p className="mt-0.5 break-words text-sm font-medium">
                  {me?.user?.name || "Guest User"}
                </p>
              </div>

              <div>
                <p
                  className={`text-xs ${
                    isDark ? "text-violet-400" : "text-violet-500"
                  }`}
                >
                  Email
                </p>
                <p className="mt-0.5 break-all text-sm font-medium">
                  {me?.user?.email || "Not added"}
                </p>
              </div>

              <div>
                <p
                  className={`text-xs ${
                    isDark ? "text-violet-400" : "text-violet-500"
                  }`}
                >
                  Account type
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {me?.user?.isGuest ? "Guest session" : "Registered account"}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/profile"
            className={`mt-4 flex items-center gap-3 rounded-xl border px-4 py-3.5 transition ${
              isDark
                ? "border-white/10 hover:bg-white/5"
                : "border-violet-100 hover:bg-violet-50"
            }`}
          >
            <UserRound
              size={18}
              className={isDark ? "text-gold-300" : "text-violet-600"}
            />
            <span className="flex-1 text-sm font-medium">View Profile</span>
            <ChevronRight
              size={18}
              className={isDark ? "text-violet-400" : "text-violet-400"}
            />
          </Link>
        </section>

        {/* Privacy */}
        <section
          className={`mb-5 overflow-hidden rounded-2xl border p-5 ${
            isDark
              ? "border-gold-400/15 bg-white/[0.04]"
              : "border-violet-200 bg-white shadow-sm"
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? "bg-gold-400/10 text-gold-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-semibold">Privacy & Security</h2>
          </div>

          <div className="flex items-start gap-3">
            <LockKeyhole
              size={18}
              className={`mt-0.5 shrink-0 ${
                isDark ? "text-gold-300" : "text-violet-600"
              }`}
            />
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-violet-300" : "text-violet-600"
              }`}
            >
              Never share your password, bank PIN, OTP or payment credentials
              in a chat.
            </p>
          </div>
        </section>

        {/* Help & About */}
        <section
          className={`mb-5 overflow-hidden rounded-2xl border p-5 ${
            isDark
              ? "border-gold-400/15 bg-white/[0.04]"
              : "border-violet-200 bg-white shadow-sm"
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isDark ? "bg-gold-400/10 text-gold-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              <Info size={20} />
            </div>
            <h2 className="font-semibold">About Gita AI</h2>
          </div>

          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-violet-300" : "text-violet-600"
            }`}
          >
            Your personal AI companion for astrology, reflection and practical
            guidance.
          </p>

          <p
            className={`mt-3 text-xs ${
              isDark ? "text-violet-400" : "text-violet-500"
            }`}
          >
            Current language: {selectedLanguage}
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/"
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "border-white/10 hover:bg-white/5"
                  : "border-violet-200 hover:bg-violet-50"
              }`}
            >
              <CircleHelp size={16} />
              Go to Home
            </Link>

            <a
              href="https://github.com/sannikumar91898-bot/Gita-ai-"
              target="_blank"
              rel="noreferrer"
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                isDark
                  ? "border-gold-400/30 text-gold-200 hover:bg-gold-400/10"
                  : "border-violet-300 text-violet-700 hover:bg-violet-50"
              }`}
            >
              Project Repository
              <ExternalLink size={14} />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-6 pt-6 text-center">
          <p
            className={`text-xs font-medium ${
              isDark ? "text-violet-400" : "text-violet-500"
            }`}
          >
            Gita AI · Settings
          </p>
        </footer>
      </div>
    </main>
  );
}