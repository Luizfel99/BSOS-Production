// ============================================================================
// FILE: src/components/LoginScreen.tsx
// DESC: Em inglês, com i18n e DEMO buttons abaixo do form (wired to /dashboard)
// ============================================================================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const DEMOS = [
  { role: "admin", emailEnv: "NEXT_PUBLIC_DEMO_EMAIL_ADMIN" },
  { role: "manager", emailEnv: "NEXT_PUBLIC_DEMO_EMAIL_MANAGER" },
  { role: "supervisor", emailEnv: "NEXT_PUBLIC_DEMO_EMAIL_SUPERVISOR" },
  { role: "cleaner", emailEnv: "NEXT_PUBLIC_DEMO_EMAIL_CLEANER" },
  { role: "client", emailEnv: "NEXT_PUBLIC_DEMO_EMAIL_CLIENT" }
] as const;

export default function LoginScreen(): JSX.Element {
  const t = useTranslations("login");
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  async function loginDemo(role: typeof DEMOS[number]["role"]) {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "dev-login failed");
      }
      router.replace("/dashboard");
      router.refresh(); // Force refresh to pick up auth state
    } catch (e: any) {
      alert(e.message || "Unable to login demo. Check server logs.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid md:grid-cols-2">
      {/* Left — Brand / Marketing */}
      <section className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-10">
        <div className="text-white space-y-4 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">Bright &amp; Shine OS</h1>
          <p className="opacity-90 text-lg">
            Operate properties, schedules, payments and teams in one place.
          </p>
        </div>
      </section>

      {/* Right — Login */}
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold">{t("title")}</h2>
            <p className="text-gray-500">{t("subtitle")}</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-3 p-3 border rounded-lg shadow-sm focus:ring-2"
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-3 p-3 border rounded-lg shadow-sm focus:ring-2"
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? "…" : t("signin")}
            </button>
          </form>

          {/* Demo buttons */}
          <div className="space-y-2">
            <div className="text-sm text-gray-500">{t("orDemo")}</div>
            <div className="grid grid-cols-2 gap-2">
              <button data-testid="demo-admin" onClick={() => loginDemo("admin")} className="border rounded p-2 hover:bg-gray-50">
                {t("demo.admin")}
              </button>
              <button data-testid="demo-manager" onClick={() => loginDemo("manager")} className="border rounded p-2 hover:bg-gray-50">
                {t("demo.manager")}
              </button>
              <button data-testid="demo-supervisor" onClick={() => loginDemo("supervisor")} className="border rounded p-2 hover:bg-gray-50">
                {t("demo.supervisor")}
              </button>
              <button data-testid="demo-cleaner" onClick={() => loginDemo("cleaner")} className="border rounded p-2 hover:bg-gray-50">
                {t("demo.cleaner")}
              </button>
              <button data-testid="demo-client" onClick={() => loginDemo("client")} className="border rounded p-2 hover:bg-gray-50 col-span-2">
                {t("demo.client")}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="text-xs text-gray-500">Language</label>
            <LocaleSwitcher />
          </div>
        </div>
      </section>
    </main>
  );
}
