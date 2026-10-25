
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

import { translate, type Lang } from "../i18n";
import type { Entitlement } from "../entitlement";

const SUPPORTED_LANGUAGES: readonly Lang[] = [
  "en",
  "hi",
  "hinglish",
];

function isLang(value: unknown): value is Lang {
  return (
    value === "en" ||
    value === "hi" ||
    value === "hinglish"
  );
}

function readSavedLanguage(): Lang | null {
  try {
    const saved = localStorage.getItem("gita_lang");
    return isLang(saved) ? saved : null;
  } catch {
    return null;
  }
}

export type MeUser = {
  id: string;
  name: string | null;
  email: string | null;
  language: Lang;
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

  const mountedRef = useRef(false);
  const languageLoadedRef = useRef(false);
  const hasLocalLanguageRef = useRef(false);
  const refreshInProgressRef = useRef(false);

  // Load local preference before using the server language as a fallback.
  useEffect(() => {
    mountedRef.current = true;

    const saved = readSavedLanguage();

    if (saved) {
      hasLocalLanguageRef.current = true;
      setLocalLang(saved);
    }

    languageLoadedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (refreshInProgressRef.current) return;

    refreshInProgressRef.current = true;

    try {
      let response = await fetch("/api/me", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      // Do not create a guest session if the API itself failed.
      if (!response.ok) {
        throw new Error(`/api/me failed with status ${response.status}`);
      }

      let data = await response.json();

      // Create a guest only when the API successfully reports no user.
      if (!data?.user) {
        const guestResponse = await fetch("/api/auth/guest", {
          method: "POST",
          cache: "no-store",
        });

        if (!guestResponse.ok) {
          throw new Error(
            `Guest session creation failed: ${guestResponse.status}`
          );
        }

        response = await fetch("/api/me", {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Refreshing session failed: ${response.status}`
          );
        }

        data = await response.json();
      }

      if (!data?.user || typeof data.user.id !== "string") {
        throw new Error("The session response did not contain a valid user.");
      }

      const serverLanguage = isLang(data.user.language)
        ? data.user.language
        : "en";

      const user: MeUser = {
        id: data.user.id,
        name:
          typeof data.user.name === "string"
            ? data.user.name
            : null,
        email:
          typeof data.user.email === "string"
            ? data.user.email
            : null,
        language: serverLanguage,
        isGuest: data.user.isGuest === true,
      };

      if (!languageLoadedRef.current) {
        // Normally the initial language effect runs before this request finishes.
        await new Promise<void>((resolve) => {
          const check = () => {
            if (languageLoadedRef.current) {
              resolve();
            } else {
              queueMicrotask(check);
            }
          };
          check();
        });
      }

      if (!hasLocalLanguageRef.current) {
        setLocalLang(serverLanguage);

        try {
          localStorage.setItem("gita_lang", serverLanguage);
        } catch {
          // Server language still works for this session.
        }
      }

      if (!mountedRef.current) return;

      setMe({
        user,
        entitlement: data.entitlement ?? null,
        birth: data.birth ?? null,
        hasChart: data.hasChart === true,
        googleAuthConfigured: data.googleAuthConfigured === true,
        sessionError: false,
      });
    } catch (error) {
      console.error(
        "App session refresh failed:",
        error instanceof Error ? error.message : "Unknown error"
      );

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
    void refresh();

    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((error: unknown) => {
          console.warn(
            "Service worker registration failed:",
            error instanceof Error ? error.message : "Unknown error"
          );
        });
    }
  }, [refresh]);

  const setLanguage = useCallback(async (language: Lang) => {
    if (!isLang(language)) return;

    // Apply the preference immediately in the UI.
    hasLocalLanguageRef.current = true;
    setLocalLang(language);

    try {
      localStorage.setItem("gita_lang", language);
    } catch {
      // Continue with in-memory preference.
    }

    setMe((current) =>
      current?.user
        ? {
            ...current,
            user: {
              ...current.user,
              language,
            },
          }
        : current
    );

    // Persist on the server when the profile endpoint is available.
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ language }),
        cache: "no-store",
      });

      if (!response.ok) {
        console.warn(
          `Language preference was not saved to the server (${response.status}).`
        );
      }
    } catch (error) {
      console.warn(
        "Could not sync language preference:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }, []);

  const setEntitlement = useCallback((entitlement: Entitlement) => {
    setMe((current) =>
      current ? { ...current, entitlement } : current
    );
  }, []);

  const lang: Lang = isLang(localLang) ? localLang : "en";

  const t = useCallback(
    (key: string) => translate(lang, key),
    [lang]
  );

  const value = useMemo<Ctx>(
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
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
