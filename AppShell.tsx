
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  MessageCircleHeart,
  Sun,
  Sparkles,
  Settings,
  Crown,
  Hand,
  MoonStar,
} from "lucide-react";

// Providers.tsx is inside the app folder
import { useApp } from "./app/Providers";
import { StarField } from "@/components/StarField";
import {
  ASTROLOGER_IMAGE,
  ASTROLOGER_ALT,
} from "@/lib/astrologer";

export function TrialChip() {
  const { me, t } = useApp();
  const ent = me?.entitlement;
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!ent) {
      setLeft(null);
      return;
    }

    if (ent.state === "premium" || ent.state === "trial") {
      setLeft(null);
      return;
    }

    const started = ent.trialStartedAt
      ? new Date(ent.trialStartedAt).getTime()
      : null;

    if (!started) {
      setLeft(null);
      return;
    }

    const tick = () => {
      setLeft(
        Math.max(
          0,
          Math.ceil((20000 - (Date.now() - started)) / 1000)
        )
      );
    };

    tick();

    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [ent]);

  if (!ent) return null;

  if (ent.state === "premium") {
    return (
      <Link
        href="/premium"
        className="flex items-center gap-1.5 rounded-full border border-gold-400/50 bg-gold-400/10 px-3 py-1.5 text-xs font-bold text-gold-300"
      >
        <Crown size={14} />
        {t("premiumActive")}
      </Link>
    );
  }

  if (ent.state === "trial") {
    return (
      <Link
        href="/premium"
        className="flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-500/15 px-3 py-1.5 text-xs font-bold text-violet-200"
      >
        <Sparkles size={14} />
        {t("trialBanner")} · 20s
      </Link>
    );
  }

  if (ent.state === "trial_active" && left !== null && left > 0) {
    return (
      <Link
        href="/premium"
        className="flex items-center gap-1.5 rounded-full border border-gold-400/50 bg-gold-400/10 px-3 py-1.5 text-xs font-bold tabular-nums text-gold-300"
      >
        <Sparkles size={14} />
        {left}s {t("trialLeft")}
      </Link>
    );
  }

  return (
    <Link
      href="/premium"
      className="btn-gold flex items-center gap-1.5 px-3 py-1.5 text-xs"
    >
      <Crown size={14} />
      ₹49/week
    </Link>
  );
}

const NAV = [
  { href: "/", key: "navHome", icon: Home },
  { href: "/chat", key: "navChat", icon: MessageCircleHeart },
  { href: "/kundli", key: "navKundli", icon: MoonStar },
  { href: "/daily", key: "navDaily", icon: Sun },
  { href: "/palm", key: "navPalm", icon: Hand },
  { href: "/settings", key: "navSettings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t, me, refresh } = useApp();

  return (
    <div className="relative min-h-dvh">
      <StarField />

      <header className="sticky top-0 z-40 border-b border-gold-400/10 bg-night-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/icons/icon-512.png"
              alt="Gita AI logo"
              width={36}
              height={36}
              className="rounded-xl ring-1 ring-gold-400/40 transition-transform group-hover:rotate-12"
            />

            <div className="leading-tight">
              <span className="font-display text-lg tracking-wide gold-text">
                {t("appName")}
              </span>
              <p className="hidden text-[10px] uppercase tracking-[0.2em] text-violet-300/70 sm:block">
                {t("tagline")}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <TrialChip />

            <Link href="/chat" aria-label={t("chatCta")} className="relative">
              <Image
                src={ASTROLOGER_IMAGE}
                alt={ASTROLOGER_ALT}
                width={38}
                height={38}
                className="rounded-full object-cover ring-2 ring-gold-400/60"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-night-950 bg-emerald-400" />
            </Link>
          </div>
        </div>
      </header>

      {me?.sessionError && (
        <div role="alert" className="relative z-30 mx-auto mt-4 max-w-5xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
            <span>{t("errSession")}</span>

            <span className="flex gap-2">
              <button
                onClick={() => void refresh()}
                className="btn-ghost px-3 py-1.5 text-xs font-bold"
              >
                {t("retry")}
              </button>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-3 py-1.5 text-xs"
              >
                {t("openNewTab")}
              </a>
            </span>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-28 pt-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-400/15 bg-night-950/90 backdrop-blur-lg">
        <div className="mx-auto grid max-w-5xl grid-cols-6">
          {NAV.map(({ href, key, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors sm:text-xs ${
                  active
                    ? "text-gold-300"
                    : "text-violet-200/60 hover:text-violet-100"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                {t(key)}
                <span
                  className={`h-0.5 w-6 rounded-full transition-all ${
                    active ? "bg-gold-400" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
