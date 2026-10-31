"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { translate, type Lang } from "./i18n";
import type { Entitlement } from "./entitlement";

export type Theme = "dark" | "light";

export type MeUser = {
  id: string;
  name: string | null;
  email: string | null;
  language: string;
  isGuest: boolean;
};

export type MeBirth = {
  name: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
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
  setLanguage: (l: Lang) => Promise<void>;
  refresh: () => Promise<void>;
  setEntitlement: (e: Entitlement) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [localLang, setLocalLang] = useState<Lang>("en");
  const [theme, setThemeState] = useState<Theme>("dark");

  const mountedRef = useRef(false);
  const refreshInProgressRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    // Load Language
    try {
      const savedLang = localStorage.getItem("gita_lang");
      if (savedLang === "en" || savedLang === "hi" || savedLang === "hinglish") {
        setLocalLang(savedLang);
      }
    } catch {}

    // Load Theme
    try {
      const savedTheme = localStorage.getItem("gita_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
      }
    } catch {}

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Apply Theme to HTML
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("gita_theme", theme);
    } catch {}
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    if (nextTheme === "dark" || nextTheme === "light") {
      setThemeState(nextTheme);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (refreshInProgressRef.current) return;
    refreshInProgressRef.current = true;

    try {
      // 🔥 SIRF /api/me CHECK KARO, GUEST CREATE MAT KARO 🔥
      const res = await fetch("/api/me", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch me");

      const data = await res.json();

      if (!mountedRef.current) return;

      setMe({
        user: data.user || null,
        entitlement: data.entitlement || null,
        birth: data.birth || null,
        hasChart: data.hasChart === true,
        googleAuthConfigured: data.googleAuthConfigured === true,
        sessionError: !data.user,
      });

      // Sync Language if user is logged in
      if (data.user?.language) {
        setLocalLang(data.user.language as Lang);
      }
    } catch {
      if (mountedRef.current) {
        setMe({
          user: null,
          entitlement: null,
          birth: null,
          hasChart: false,
          googleAuthConfigured: false,
          sessionError: true,
        });
      }
    } finally {
      refreshInProgressRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // 🔥 SIRF REFRESH CALL KARO, SERVICE WORKER YAHAN SE HATA DIYA HAI 🔥
    void refresh();
  }, [refresh]);

  const lang: Lang = (me?.user?.language as Lang) || localLang;

  const setLanguage = useCallback(async (l: Lang) => {
    setLocalLang(l);

    try {
      localStorage.setItem("gita_lang", l);
    } catch {}

    setMe((m) =>
      m?.user ? { ...m, user: { ...m.user, language: l } } : m
    );

    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: l }),
    }).catch(() => {});
  }, []);

  const setEntitlement = useCallback((e: Entitlement) => {
    setMe((m) => (m ? { ...m, entitlement: e } : m));
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo(
    () => ({
      me,
      loading,
      lang,
      t,
      setLanguage,
      refresh,
      setEntitlement,
      theme,
      setTheme,
    }),
    [me, loading, lang, t, setLanguage, refresh, setEntitlement, theme, setTheme]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return ctx;
}