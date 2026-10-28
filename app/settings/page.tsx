
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
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

import { useApp } from "../Providers";
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
  const { lang, setLanguage, me } = useApp();

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

  function toggleReminders() {
    const nextValue = !remindersEnabled;

    setRemindersEnabled(nextValue);

    try {
      localStorage.setItem(
        "gita_reminders_enabled",
        String(nextValue)
      );
    } catch {
      // Keep the selection for this page session.
    }
  }

  const selectedLanguage =
    lang === "hi"
      ? "हिंदी"
      : lang === "hinglish"
        ? "Hinglish"
        : "English";

  return (
    <main className="bg-celestial min-h-dvh px-4 pb-12 pt-4 text-violet-50">
      <div className="mx-auto max-w-xl">
        {/* Page header */}
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/profile"
            aria-label="Back to profile"
            className="rounded-full border border-white/10 p-2 transition hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold">
              Settings
            </h1>

            <p className="text-sm text-violet-300">
              Personalize your Gita AI experience
            </p>
          </div>

          <SettingsIcon size={24} className="text-gold-300" />
        </header>

        {/* Language */}
        <section className="mb-5 rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center gap-3">
            <Languages size={23} className="text-gold-300" />

            <div>
              <h2 className="font-semibold">
                Language
              </h2>

              <p className="text-xs text-violet-300">
                Choose your preferred chat language
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {LANGUAGE_OPTIONS.map((option) => {
              const selected = lang === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={savingLanguage}
                  onClick={() => void chooseLanguage(option.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                    selected
                      ? "border-gold-300/60 bg-gold-400/10"
                      : "border-white/10 bg-black/10 hover:bg-white/5"
                  } disabled:cursor-wait disabled:opacity-60`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">
                      {option.label}
                    </span>

                    <span className="mt-1 block text-xs text-violet-300">
                      {option.description}
                    </span>
                  </span>

                  {selected ? (
                    <Check
                      size={20}
                      className="text-gold-300"
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-violet-400"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {savingLanguage ? (
            <p className="mt-3 text-xs text-violet-300">
              Saving language preference...
            </p>
          ) : null}

          {languageMessage ? (
            <p
              role="status"
              className="mt-3 text-xs text-gold-200"
            >
              {languageMessage}
            </p>
          ) : null}
        </section>

        {/* Reminder preference */}
        <section className="mb-5 rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <Bell size={23} className="text-gold-300" />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                Reminder Preference
              </h2>

              <p className="mt-1 text-xs leading-5 text-violet-300">
                Save whether you want reminders on this device.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={remindersEnabled}
              aria-label="Toggle reminder preference"
              onClick={toggleReminders}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                remindersEnabled
                  ? "bg-gold-500"
                  : "bg-violet-900"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  remindersEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <p className="mt-3 text-xs text-violet-400">
            {remindersEnabled
              ? "Reminder preference is on."
              : "Reminder preference is off."}
          </p>

          <p className="mt-2 text-xs leading-5 text-violet-400">
            This setting does not activate push notifications or
            scheduled reminders by itself.
          </p>
        </section>

        {/* Appearance */}
        <section className="mb-5 rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-3">
            <Moon size={23} className="text-gold-300" />

            <div>
              <h2 className="font-semibold">
                Appearance
              </h2>

              <p className="text-xs text-violet-300">
                Current app theme
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gold-300/20 bg-violet-950/50 p-3">
            <div className="flex items-center gap-3">
              <Moon size={19} className="text-gold-300" />

              <div>
                <p className="text-sm font-medium">
                  Dark Purple & Gold
                </p>

                <p className="mt-1 text-xs text-violet-300">
                  Current theme
                </p>
              </div>
            </div>

            <Check size={20} className="text-gold-300" />
          </div>

          <div className="mt-3 flex items-start gap-2">
            <Sun
              size={17}
              className="mt-0.5 shrink-0 text-violet-400"
            />

            <p className="text-xs leading-5 text-violet-400">
              Light mode is not enabled yet. A working theme switch
              needs to be implemented across the whole application.
            </p>
          </div>
        </section>

        {/* Account */}
        <section className="mb-5 rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-3">
            <UserRound size={23} className="text-gold-300" />

            <h2 className="font-semibold">
              Account
            </h2>
          </div>

          <div className="rounded-xl border border-white/10 p-3">
            <p className="text-xs text-violet-400">
              Account name
            </p>

            <p className="mt-1 break-words text-sm font-medium">
              {me?.user?.name || "Guest User"}
            </p>

            <p className="mt-3 text-xs text-violet-400">
              Email
            </p>

            <p className="mt-1 break-all text-sm font-medium">
              {me?.user?.email || "Not added"}
            </p>

            <p className="mt-3 text-xs text-violet-400">
              Account type
            </p>

            <p className="mt-1 text-sm font-medium">
              {me?.user?.isGuest
                ? "Guest session"
                : "Registered account"}
            </p>
          </div>

          <Link
            href="/profile"
            className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 px-3 py-3 transition hover:bg-white/5"
          >
            <UserRound
              size={19}
              className="text-gold-300"
            />

            <span className="flex-1 text-sm font-medium">
              View Profile
            </span>

            <ChevronRight
              size={18}
              className="text-violet-400"
            />
          </Link>

          <p className="mt-3 text-xs leading-5 text-violet-400">
            {me?.user?.isGuest
              ? "You are using a guest session. Registration and account linking must be configured separately."
              : "Your account details are read from your current session."}
          </p>
        </section>

        {/* Privacy and security */}
        <section className="mb-5 rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck size={23} className="text-gold-300" />

            <h2 className="font-semibold">
              Privacy & Security
            </h2>
          </div>

          <div className="flex items-start gap-3">
            <LockKeyhole
              size={19}
              className="mt-0.5 shrink-0 text-gold-300"
            />

            <p className="text-sm leading-6 text-violet-300">
              Never share your password, bank PIN, OTP or payment
              credentials in a chat.
            </p>
          </div>

          <p className="mt-3 text-xs leading-5 text-violet-400">
            Password changes, account deletion and privacy export
            controls are not available until their secure backend
            features are implemented.
          </p>
        </section>

        {/* Help */}
        <section className="mb-5 rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-3">
            <CircleHelp size={23} className="text-gold-300" />

            <h2 className="font-semibold">
              Help & Support
            </h2>
          </div>

          <p className="text-sm leading-6 text-violet-300">
            Need help using Gita AI? You can return to the main
            application and continue using the available features.
          </p>

          <Link
            href="/"
            className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 px-3 py-3 transition hover:bg-white/5"
          >
            <CircleHelp
              size={19}
              className="text-gold-300"
            />

            <span className="flex-1 text-sm font-medium">
              Go to Home
            </span>

            <ChevronRight
              size={18}
              className="text-violet-400"
            />
          </Link>
        </section>

        {/* About */}
        <section className="rounded-2xl border border-gold-400/15 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-3">
            <Info size={23} className="text-gold-300" />

            <h2 className="font-semibold">
              About Gita AI
            </h2>
          </div>

          <p className="text-sm leading-6 text-violet-300">
            Your personal AI companion for astrology, reflection
            and practical guidance.
          </p>

          <p className="mt-2 text-xs text-violet-400">
            Language: {selectedLanguage}
          </p>

          <p className="mt-1 text-xs text-violet-400">
            {mounted ? "Settings page loaded" : "Loading settings..."}
          </p>

          <a
            href="https://github.com/sannikumar91898-bot/Gita-ai-"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-gold-200 hover:text-gold-100"
          >
            Project Repository
            <ExternalLink size={15} />
          </a>
        </section>

        <footer className="pb-4 pt-7 text-center">
          <p className="text-xs text-violet-400">
            Gita AI · Settings
          </p>
        </footer>
      </div>
    </main>
  );
}
