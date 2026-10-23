
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate, type Lang } from "@/lib/i18n";
import type { Entitlement } from "@/lib/entitlement";

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gita_lang");
      if (
        saved === "en" ||
        saved === "hi" ||
        saved === "hinglish"
      ) {
        setLocalLang(saved);
      }
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    try {
      let res = await fetch("/api/me", {
        cache: "no-store",
      });
      let data = await res.json();

      if (!data.user) {
        await fetch("/api/auth/guest", {
          method: "POST",
        });
        res = await fetch("/api/me", {
          cache: "no-store",
        });
        data = await res.json();
      }

      setMe({
        ...(data as Me),
        sessionError: !data.user,
      });
    } catch {
      setMe({
        user: null,
        entitlement: null,
        birth: null,
        hasChart: false,
        googleAuthConfigured: false,
        sessionError: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {});
    }
  }, [refresh]);

  const lang: Lang =
    (me?.user?.language as Lang) ?? localLang;

  const setLanguage = useCallback(async (l: Lang) => {
    setLocalLang(l);

    try {
      localStorage.setItem("gita_lang", l);
    } catch {}

    setMe((m) =>
      m?.user
        ? {
            ...m,
            user: { ...m.user, language: l },
          }
        : m
    );

    await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: l }),
    }).catch(() => {});
  }, []);

  const setEntitlement = useCallback((e: Entitlement) => {
    setMe((m) =>
      m ? { ...m, entitlement: e } : m
    );
  }, []);

  const t = useCallback(
    (key: string) => translate(lang, key),
    [lang]
  );

  const value = useMemo(
    () => ({
      me,
      loading,
      lang,
      t,
      setLanguage,
      refresh,
      setEntitlement,
    }),
    [
      me,
      loading,
      lang,
      t,
      setLanguage,
      refresh,
      setEntitlement,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return ctx;
}
