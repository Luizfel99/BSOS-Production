// ============================================================================
// FILE: src/components/LocaleSwitcher.tsx
// DESC: Dropdown to change app locale (API + localStorage)
// ============================================================================
"use client";

import { useState, useEffect } from "react";

export default function LocaleSwitcher(): JSX.Element {
  const [locale, setLocale] = useState<"en" | "pt" | "es">("en");

  useEffect(() => {
    const stored = localStorage.getItem("bsos_locale") as any;
    if (stored && ["en", "pt", "es"].includes(stored)) {
      setLocale(stored);
    }
  }, []);

  async function changeLocale(next: "en" | "pt" | "es") {
    setLocale(next);
    localStorage.setItem("bsos_locale", next);
    
    try {
      await fetch("/api/settings/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ locale: next }),
      });
    } catch {
      // no-op - locale still saved in localStorage
    }
    
    // Soft reload to rebind messages
    window.location.reload();
  }

  return (
    <select
      value={locale}
      onChange={(e) => changeLocale(e.target.value as any)}
      className="border rounded p-1 text-sm bg-white"
      aria-label="Change language"
      title="Change language"
    >
      <option value="en">English</option>
      <option value="pt">Português</option>
      <option value="es">Español</option>
    </select>
  );
}
