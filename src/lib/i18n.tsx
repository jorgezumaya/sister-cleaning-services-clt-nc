"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "@/i18n/en.json";
import es from "@/i18n/es.json";

export type Lang = "en" | "es";

const DICTIONARIES: Record<Lang, unknown> = { en, es };
const STORAGE_KEY = "sisters-cleaning-lang";

type Params = Record<string, string | number>;

/** Resolves a dot path like "contactForm.errorMessageTooShort" against a nested JSON dictionary. */
function resolve(dict: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((node, key) => {
    if (node && typeof node === "object" && key in node) {
      return (node as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : undefined;
}

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in params ? String(params[key]) : match));
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Transloco-style translate function: t("nav.home"), t("contactForm.messageHint", { min: 30 }) */
  t: (key: string, params?: Params) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Starts as "en" on every render (server and first client render) to avoid
  // a hydration mismatch, then syncs from localStorage right after mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "es") setLangState(stored);
    } catch {
      // localStorage unavailable (private mode, etc.) — stay on the default.
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Non-fatal — the toggle still works for the current page view.
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Params) => {
      const value = resolve(DICTIONARIES[lang], key) ?? resolve(DICTIONARIES.en, key) ?? key;
      return interpolate(value, params);
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
