
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MessageCircleHeart,
  MoonStar,
  Sun,
  Hand,
  Heart,
  Briefcase,
  Coins,
  Users,
  Activity,
  Leaf,
  ArrowRight,
  Sparkles,
  Palette,
  Hash,
} from "lucide-react";

import { useApp } from "./Providers";
import { Avatar } from "../Avatar";
import { Reveal } from "../Reveal";

type DailyReading = {
  signName: string;
  focus: string;
  luckyColour?: {
    name: string;
    hex: string;
  };
  luckyNumber?: number;
  affirmation?: string;
  source?: "calculated" | "gemini";
};

export default function HomePage() {
  const { t, me, loading, lang } = useApp();
  const [daily, setDaily] = useState<DailyReading | null>(null);

  // Load the daily reading using the selected language.
  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    const controller = new AbortController();

    async function loadDailyReading() {
      try {
        const response = await fetch(
          "/api/daily?lang=" + encodeURIComponent(lang),
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Daily reading failed: ${response.status}`);
        }

        const data: unknown = await response.json();

        if (
          typeof data !== "object" ||
          data === null ||
          !("reading" in data)
        ) {
          throw new Error("Invalid daily reading response");
        }

        const reading = data.reading as DailyReading | null;

        if (
          !reading ||
          typeof reading.signName !== "string" ||
          typeof reading.focus !== "string"
        ) {
          throw new Error("Invalid daily reading fields");
        }

        if (!cancelled) {
          setDaily(reading);
        }
      } catch (error) {
        if (!cancelled && !controller.signal.aborted) {
          console.error("Could not load daily reading:", error);
          setDaily(null);
        }
      }
    }

    void loadDailyReading();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [loading, lang]);

  // Use only routes that are reported to exist in this project.
  // Topic pages that are missing open chat instead of a 404 page.
  const features = [
    {
      href: "/kundli",
      icon: MoonStar,
      title: t("kundli"),
      desc: t("kundliDesc"),
      big: true,
    },
    {
      href: "/daily",
      icon: Sun,
      title: t("daily"),
      desc: t("dailyDesc"),
      big: true,
    },
    {
      href: "/chat?topic=palm",
      icon: Hand,
      title: t("palm"),
      desc: t("palmDesc"),
      big: false,
    },
    {
      href: "/chat?topic=love",
      icon: Heart,
      title: t("love"),
      desc: t("loveDesc"),
      big: false,
    },
    {
      href: "/career",
      icon: Briefcase,
      title: t("career"),
      desc: t("careerDesc"),
      big: false,
    },
    {
      href: "/chat?topic=money",
      icon: Coins,
      title: t("money"),
      desc: t("moneyDesc"),
      big: false,
    },
    {
      href: "/family",
      icon: Users,
      title: t("family"),
      desc: t("familyDesc"),
      big: false,
    },
    {
      href: "/health",
      icon: Activity,
      title: t("health"),
      desc: t("healthDesc"),
      big: false,
    },
    {
      href: "/chat?topic=remedies",
      icon: Leaf,
      title: t("remedies"),
      desc: t("remediesDesc"),
      big: false,
    },
  ];

  // Keep the hero title readable even when a translation has few words.
  const heroTitle = t("heroTitle") || "";
  const heroWords = heroTitle.trim().split(/\s+/).filter(Boolean);
  const heroMain =
    heroWords.length > 3 ? heroWords.slice(0, -3).join(" ") : "";
  const heroHighlight =
    heroWords.length > 3
      ? heroWords.slice(-3).join(" ")
      : heroTitle;

  return (
    <div className="w-full min-w-0 max-w-full space-y-12 overflow-x-clip">
      {/* Hero section */}
      <section className="anim-fade-up grid min-w-0 grid-cols-1 items-center gap-8 overflow-x-clip pt-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="order-2 min-w-0 sm:order-1">
          <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 sm:tracking-[0.25em]">
            <Sparkles size={14} className="shrink-0" />
            <span>{t("heroKicker")}</span>
          </p>

          <h1 className="break-words font-display text-4xl leading-[1.12] text-violet-50 sm:text-5xl lg:text-6xl">
            {heroMain ? `${heroMain} ` : ""}
            <span className="gold-text">{heroHighlight}</span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-violet-200/85 sm:text-lg">
            {t("heroSub")}
          </p>

          <div className="mt-7 flex min-w-0 flex-wrap items-center gap-3">
            <Link
              href="/chat"
              className="btn-gold inline-flex min-w-0 max-w-full items-center justify-center gap-2 px-5 py-3.5 text-sm sm:px-7 sm:text-base"
            >
              <MessageCircleHeart size={20} className="shrink-0" />
              <span>{t("chatCta")}</span>
            </Link>

            {!me?.hasChart && (
              <Link
                href="/kundli"
                className="btn-ghost inline-flex min-w-0 max-w-full items-center justify-center gap-2 px-5 py-3.5 text-sm font-bold"
              >
                <span>{t("buildKundli")}</span>
                <ArrowRight size={16} className="shrink-0" />
              </Link>
            )}
          </div>

          {!loading && me?.birth?.name && (
            <p className="mt-4 break-words text-sm text-violet-300/80">
              {t("namaste")},{" "}
              <span className="font-bold text-gold-300">
                {me.birth.name}
              </span>{" "}
              ✦
            </p>
          )}
        </div>

        <div className="order-1 flex min-w-0 justify-center px-4 py-3 sm:order-2">
          <div className="relative flex min-w-0 justify-center">
            <div
              className="pointer-events-none absolute -inset-3 rounded-full border border-gold-400/25 sm:-inset-6"
              style={{ animation: "slowspin 40s linear infinite" }}
            >
              <span className="absolute -top-1.5 left-1/2 text-gold-300">
                ✦
              </span>
              <span className="absolute -bottom-1.5 left-1/4 text-violet-300">
                ✧
              </span>
            </div>

            <Avatar size={220} float />

            <div className="card absolute -bottom-4 left-1/2 z-10 w-max max-w-[calc(100vw-48px)] -translate-x-1/2 px-4 py-2 text-center">
              <p className="font-display text-sm text-gold-300">Gita</p>
              <p className="break-words text-[10px] uppercase tracking-widest text-violet-300/80">
                {t("tagline")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily reading or Kundli setup */}
      <Reveal>
        {daily ? (
          <Link
            href="/daily"
            className="card card-hover block min-w-0 max-w-full p-4 sm:p-6"
          >
            <div className="flex min-w-0 flex-col justify-between gap-5 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-bold uppercase tracking-[0.15em] text-gold-300 sm:tracking-[0.2em]">
                  {t("daily")} · {daily.signName}
                </p>

                <p className="mt-2 break-words text-sm leading-relaxed text-violet-100/90">
                  {daily.focus}
                </p>

                {daily.affirmation ? (
                  <p className="mt-2 break-words text-sm italic text-violet-300/80">
                    “{daily.affirmation}”
                  </p>
                ) : null}
              </div>

              {daily.luckyColour?.hex ||
              typeof daily.luckyNumber === "number" ? (
                <div className="flex min-w-0 flex-wrap items-start gap-5">
                  {daily.luckyColour?.hex ? (
                    <div className="min-w-0 text-center">
                      <span
                        className="mx-auto flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/20"
                        style={{
                          backgroundColor: daily.luckyColour.hex,
                        }}
                      >
                        <Palette size={16} className="text-black/60" />
                      </span>

                      <p className="mt-1 max-w-24 break-words text-[10px] text-violet-300/80">
                        {daily.luckyColour.name}
                      </p>
                    </div>
                  ) : null}

                  {typeof daily.luckyNumber === "number" ? (
                    <div className="min-w-0 text-center">
                      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/25 font-display text-lg text-gold-300 ring-1 ring-gold-400/40">
                        {daily.luckyNumber}
                      </span>

                      <p className="mt-1 flex items-center gap-1 text-[10px] text-violet-300/80">
                        <Hash size={10} />
                        {t("luckyNumber")}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Link>
        ) : (
          <Link
            href="/kundli"
            className="card card-hover flex min-w-0 max-w-full flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-6"
          >
            <div className="min-w-0">
              <p className="break-words font-display text-xl text-violet-50">
                {t("onbTitle")} ✦
              </p>

              <p className="mt-1 break-words text-sm text-violet-300/85">
                {t("kundliDesc")}
              </p>
            </div>

            <span className="btn-gold inline-flex max-w-full items-center justify-center gap-2 px-5 py-2.5 text-sm">
              <span>{t("buildKundli")}</span>
              <ArrowRight size={16} className="shrink-0" />
            </span>
          </Link>
        )}
      </Reveal>

      {/* Feature cards */}
      <section className="min-w-0">
        <Reveal>
          <h2 className="mb-5 break-words font-display text-2xl text-violet-50 sm:text-3xl">
            {t("explore")}
          </h2>
        </Reveal>

        <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal
              key={feature.href}
              delay={index * 60}
              className={`min-w-0 ${
                feature.big
                  ? "col-span-2 sm:col-span-1 lg:col-span-2"
                  : ""
              }`}
            >
              <Link
                href={feature.href}
                className="card card-hover group flex h-full min-w-0 flex-col gap-3 p-3 sm:p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-night-700 text-gold-300 ring-1 ring-gold-400/25 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <feature.icon size={22} />
                </span>

                <div className="min-w-0">
                  <h3 className="break-words font-display text-base leading-snug text-violet-50 sm:text-lg">
                    {feature.title}
                  </h3>

                  <p className="mt-1 break-words text-xs leading-relaxed text-violet-300/80">
                    {feature.desc}
                  </p>
                </div>

                <span className="mt-auto flex items-center gap-1 text-xs font-bold text-gold-300 transition-colors sm:text-gold-300/0 sm:group-hover:text-gold-300">
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Reveal>
        <footer className="min-w-0 border-t border-gold-400/10 pt-6 text-center">
          <p className="mx-auto max-w-2xl break-words text-xs leading-relaxed text-violet-300/60">
            {t("disclaimerShort")}
          </p>

          <p className="mt-3 text-xs text-violet-300/60">
            Gita AI
          </p>
        </footer>
      </Reveal>
    </div>
  );
}
