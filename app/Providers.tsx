// app/Providers.tsx
"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";

import { translate, type Lang } from "../i18n"; 
import type { Entitlement } from "../entitlement";

export type Theme = "dark" | "light";

// 🔥 10 भाषाओं का सपोर्ट
export const SUPPORTED_LANGUAGES = ["en", "hi", "hinglish", "te", "ta", "kn", "bn", "mr", "gu", "ml"] as const;

function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

function readSavedLanguage(): Lang | null {
  try {
    const saved = localStorage.getItem("gita_lang");
    return isLang(saved) ? saved : null;
  } catch {
    return null;
  }
}

function readSavedTheme(): Theme {
  try {
    return localStorage.getItem("gita_theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export type MeUser = {
  id: string;
  name: string | null;
  email: string | null;
  language: Lang;
  isGuest: boolean;
  walletBalancePaise: number;
  freeMessagesUsed: number;
  premiumUntil?: string | null; 
};

export type MeBirth = {
  name: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  gender?: string | null;           // 🔥 FIXED
  isBirthTimeUnknown?: boolean;     // 🔥 FIXED
} | null;

export type Me = {
  user: MeUser | null;
  entitlement: Entitlement | null;
  birth: MeBirth;
  hasChart: boolean;
  googleAuthConfigured: boolean;
  sessionError?: boolean;
};

type Ctx = {
  me: Me | null;
  loading: boolean;
  lang: Lang;
  t: (key: string) => string;
  setLanguage: (language: Lang) => Promise<void>;
  refresh: () => Promise<void>;
  setEntitlement: (entitlement: Entitlement) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  sessionError: boolean; 
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [localLang, setLocalLang] = useState<Lang>("en");
  const [theme, setThemeState] = useState<Theme>("dark");

  const mountedRef = useRef(false);
  const languageLoadedRef = useRef(false);
  const hasLocalLanguageRef = useRef(false);
  const refreshInProgressRef = useRef(false);

  // 1. Initial Load
  useEffect(() => {
    mountedRef.current = true;
    const savedLanguage = readSavedLanguage();
    const savedTheme = readSavedTheme();

    if (savedLanguage) {
      hasLocalLanguageRef.current = true;
      setLocalLang(savedLanguage);
    }
    setThemeState(savedTheme);
    languageLoadedRef.current = true;

    return () => { mountedRef.current = false; };
  }, []);

  // 2. Update HTML Theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem("gita_theme", theme); } catch {}
  }, [theme]);

  const lang: Lang = isLang(localLang) ? localLang : "en";

  // 🔥 3. Update HTML Lang Attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setTheme = useCallback((nextTheme: Theme) => {
    if (nextTheme === "dark" || nextTheme === "light") setThemeState(nextTheme);
  }, []);

  const refresh = useCallback(async () => {
    if (refreshInProgressRef.current) return;
    refreshInProgressRef.current = true;

    try {
      const response = await fetch("/api/me", { method: "GET", cache: "no-store", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`/api/me failed: ${response.status}`);

      let data = await response.json();

      if (!data?.user) {
        const guestRes = await fetch("/api/auth/guest", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" } });
        if (!guestRes.ok) throw new Error("Failed to create guest session");

        const meRes = await fetch("/api/me", { method: "GET", cache: "no-store", headers: { Accept: "application/json" } });
        if (!meRes.ok) throw new Error("Failed to fetch user after guest creation");
        data = await meRes.json(); 
      }

      const serverLanguage = isLang(data?.user?.language) ? data.user.language : "en";

      const user: MeUser = {
        id: data.user.id,
        name: typeof data.user.name === "string" ? data.user.name : null,
        email: typeof data.user.email === "string" ? data.user.email : null,
        language: serverLanguage,
        isGuest: data.user.isGuest === true,
        walletBalancePaise: Number(data.user.walletBalancePaise ?? 0),
        freeMessagesUsed: Number(data.user.freeMessagesUsed ?? 0),
        premiumUntil: typeof data.user.premiumUntil === "string" ? data.user.premiumUntil : null,
      };

      if (!languageLoadedRef.current) {
        await new Promise<void>((resolve) => {
          const check = () => { if (languageLoadedRef.current) resolve(); else queueMicrotask(check); };
          check();
        });
      }

      if (!hasLocalLanguageRef.current) {
        setLocalLang(serverLanguage);
        try { localStorage.setItem("gita_lang", serverLanguage); } catch {}
      }

      if (!mountedRef.current) return;

      setMe({
        user,
        entitlement: data.entitlement ?? null,
        birth: data.birth ?? null, // Ye ab naye fields ke saath aayega
        hasChart: data.hasChart === true,
        googleAuthConfigured: data.googleAuthConfigured === true,
        sessionError: false,
      });
      
    } catch (error) {
      console.error("App session refresh failed:", error);
      if (mountedRef.current) {
        setMe({ user: null, entitlement: null, birth: null, hasChart: false, googleAuthConfigured: false, sessionError: true });
      }
    } finally {
      refreshInProgressRef.current = false;
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const setLanguage = useCallback(async (language: Lang) => {
    if (!isLang(language)) return;
    hasLocalLanguageRef.current = true;
    setLocalLang(language);
    try { localStorage.setItem("gita_lang", language); } catch {}

    setMe((current) => current?.user ? { ...current, user: { ...current.user, language } } : current);

    try {
      await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ language }), cache: "no-store" });
    } catch (error) { console.warn("Could not sync language preference:", error); }
  }, []);

  const setEntitlement = useCallback((entitlement: Entitlement) => {
    setMe((current) => (current ? { ...current, entitlement } : current));
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo<Ctx>(
    () => ({ me, loading, lang, t, setLanguage, refresh, setEntitlement, theme, setTheme, sessionError: me?.sessionError ?? false }),
    [me, loading, lang, t, setLanguage, refresh, setEntitlement, theme, setTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): Ctx {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}