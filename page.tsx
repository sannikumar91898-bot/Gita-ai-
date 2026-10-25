"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  MessageCircleHeart, MoonStar, Sun, Hand, Heart, Briefcase, Coins,
  Users, Activity, Leaf, ArrowRight, Sparkles, Palette, Hash,
} from "lucide-react";

import { useApp } from "@/Providers";
import { Avatar } from "@/Avatar";
import { Reveal } from "@/Reveal";

type DailyReading = {
  signName: string;
  focus: string;
  luckyColour: { name: string; hex: string };
  luckyNumber: number;
  affirmation: string;
};

export default function HomePage() {
  const { t, me, loading } = useApp();
  const [daily, setDaily] = useState<DailyReading | null>(null);

  useEffect(() => {
    if (!me?.hasChart) return;
    fetch("/api/daily")
      .then((r) => r.json())
      .then((d) => setDaily(d.reading ?? null))
      .catch(() => {});
  }, [me?.hasChart]);

  // यहाँ लिंक्स को सही कर दिया गया है
  const features = [
    { href: "/kundli", icon: MoonStar, title: t("kundli"), desc: t("kundliDesc"), big: true },
    { href: "/daily", icon: Sun, title: t("daily"), desc: t("dailyDesc"), big: true },
    { href: "/palm", icon: Hand, title: t("palm"), desc: t("palmDesc"), big: false },
    { href: "/love", icon: Heart, title: t("love"), desc: t("loveDesc"), big: false },
    { href: "/career", icon: Briefcase, title: t("career"), desc: t("careerDesc"), big: false },
    { href: "/money", icon: Coins, title: t("money"), desc: t("moneyDesc"), big: false },
    { href: "/family", icon: Users, title: t("family"), desc: t("familyDesc"), big: false },
    { href: "/health", icon: Activity, title: t("health"), desc: t("healthDesc"), big: false },
    { href: "/remedies", icon: Leaf, title: t("remedies"), desc: t("remediesDesc"), big: false },
  ];

  return (
    <div className="space-y-12">
      {/* Astrologer-first opening */}
      <section className="anim-fade-up grid items-center gap-8 pt-4 sm:grid-cols-[1.25fr_1fr]">
        <div className="order-2 sm:order-1">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold-300">
            <Sparkles size={14} /> {t("heroKicker")}
          </p>
          <h1 className="font-display text-4xl leading-[1.12] text-violet-50 sm:text-5xl lg:text-6xl">
            {t("heroTitle").split(" ").slice(0, -3).join(" ")}{" "}
            <span className="gold-text">{t("heroTitle").split(" ").slice(-3).join(" ")}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-violet-200/85 sm:text-lg">{t("heroSub")}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/chat" className="btn-gold flex items-center gap-2 px-7 py-3.5 text-base">
              <MessageCircleHeart size={20} /> {t("chatCta")}
            </Link>
            {!me?.hasChart && (
              <Link href="/onboarding" className="btn-ghost flex items-center gap-2 px-6 py-3.5 text-sm font-bold">
                {t("buildKundli")} <ArrowRight size={16} />
              </Link>
            )}
          </div>
          {!loading && me?.birth?.name && (
            <p className="mt-4 text-sm text-violet-300/80">
              {t("namaste")}, <span className="font-bold text-gold-300">{me.birth.name}</span> ✦
            </p>
          )}
        </div>
        <div className="order-1 flex justify-center sm:order-2">
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-full border border-gold-400/25"
              style={{ animation: "slowspin 40s linear infinite" }}
            >
              <span className="absolute -top-1.5 left-1/2 text-gold-300">✦</span>
              <span className="absolute -bottom-1.5 left-1/4 text-violet-300">✧</span>
            </div>
            {/* यहाँ फोटो का साइज मोबाइल के लिए सही कर दिया गया है */}
            <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] mx-auto flex items-center justify-center">
              <Avatar size={200} float />
            </div>
            <div className="card absolute -bottom-4 left-1/2 w-max -translate-x-1/2 px-4 py-2 text-center">
              <p className="font-display text-sm text-gold-300">Gita</p>
              <p className="text-[10px] uppercase tracking-widest text-violet-300/80">{t("tagline")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily teaser or onboarding nudge */}
      <Reveal>
        {daily ? (
          <Link href="/daily" className="card card-hover block p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{t("daily")} · {daily.signName}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-violet-100/90">{daily.focus}</p>
                <p className="mt-2 text-sm italic text-violet-300/80">“{daily.affirmation}”</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/20" style={{ background: daily.luckyColour.hex }}>
                    <Palette size={16} className="text-black/60" />
                  </span>
                  <p className="mt-1 text-[10px] text-violet-300/80">{daily.luckyColour.name}</p>
                </div>
                <div className="text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/25 font-display text-lg text-gold-300 ring-1 ring-gold-400/40">
                    {daily.luckyNumber}
                  </span>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-violet-300/80"><Hash size={10} />{t("luckyNumber")}</p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/onboarding" className="card card-hover flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="font-display text-xl text-violet-50">{t("onbTitle")} ✦</p>
              <p className="mt-1 text-sm text-violet-300/85">{t("kundliDesc")}</p>
            </div>
            <span className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm">{t("buildKundli")} <ArrowRight size={16} /></span>
          </Link>
        )}
      </Reveal>

      {/* Feature bento */}
      <section>
        <Reveal>
          <h2 className="mb-5 font-display text-2xl text-violet-50 sm:text-3xl">{t("explore")}</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.href} delay={i * 60} className={f.big ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}>
              <Link href={f.href} className="card card-hover group flex h-full flex-col gap-3 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-night-700 text-gold-300 ring-1 ring-gold-400/25 transition-transform group-hover:scale-110 group-hover:rotate-6">
                  <f.icon size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug text-violet-50">{f.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-violet-300/80">{f.desc}</p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-xs font-bold text-gold-300/0 transition-all group-hover:text-gold-300">
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <footer className="border-t border-gold-400/10 pt-6 text-center">
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-violet-300/60">{t("disclaimerShort")}</p>
          <div className="mt-3 flex justify-center gap-5 text-xs font-bold text-violet-300/80">
            <Link href="/privacy" className="hover:text-gold-300">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-gold-300">{t("terms")}</Link>
            <Link href="/download" className="hover:text-gold-300">{t("downloadApk")}</Link>
          </div>
        </footer>
      </Reveal>
    </div>
  );
}
