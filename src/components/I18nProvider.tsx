// ============================================================================
// FILE: src/components/I18nProvider.tsx
// DESC: Usa next-intl no cliente com fallback ao locale do Settings ou 'en'
// ============================================================================
"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "@/i18n/messages/en.json";
import pt from "@/i18n/messages/pt.json";
import es from "@/i18n/messages/es.json";
import { useAuth } from "@/contexts/AuthContext";

const MAP: Record<string, any> = { en, pt, es };

export default function I18nProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [locale, setLocale] = useState<"en" | "pt" | "es">("en");

  useEffect(() => {
    // why: se usuário tem idioma em /api/settings, use-o; fallback navegador/localStorage
    const stored = typeof window !== "undefined" ? localStorage.getItem("bsos_locale") : null;
    const nav = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
    const guessed = (user as any)?.locale || stored || (["en", "pt", "es"].includes(nav) ? nav : "en");
    setLocale(guessed as any);
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("bsos_locale", locale);
  }, [locale]);

  const messages = useMemo(() => MAP[locale] ?? en, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
