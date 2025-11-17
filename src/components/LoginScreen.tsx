"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Lang = "pt" | "en" | "es";

const i18n: Record<Lang, {
  title: string; subtitle: string; email: string; password: string;
  login: string; forgot: string; or: string; demoTitle: string;
  demoCTA: string; errorCreds: string; brandTag: string;
}> = {
  pt: {
    title: "Bem-vindo de volta",
    subtitle: "Acesse seu painel administrativo",
    email: "E-mail",
    password: "Senha",
    login: "Entrar",
    forgot: "Esqueci a senha",
    or: "ou",
    demoTitle: "Perfis de demonstração",
    demoCTA: "Entrar como demo",
    errorCreds: "Credenciais inválidas",
    brandTag: "Sistema inteligente de gestão",
  },
  en: {
    title: "Welcome back",
    subtitle: "Access your admin dashboard",
    email: "Email",
    password: "Password",
    login: "Sign In",
    forgot: "Forgot password?",
    or: "or",
    demoTitle: "Demo profiles",
    demoCTA: "Log in as demo",
    errorCreds: "Invalid credentials",
    brandTag: "Smart management system",
  },
  es: {
    title: "Bienvenido de nuevo",
    subtitle: "Accede a tu panel administrativo",
    email: "Correo",
    password: "Contraseña",
    login: "Iniciar sesión",
    forgot: "¿Olvidaste la contraseña?",
    or: "o",
    demoTitle: "Perfiles de demostración",
    demoCTA: "Entrar como demo",
    errorCreds: "Credenciales inválidas",
    brandTag: "Sistema inteligente de gestión",
  },
};

type DemoProfile = {
  key: "admin" | "manager" | "supervisor" | "cleaner" | "client";
  label: string;
  email: string;
  password: string;
};

const DEFAULT_APP_NAME = "BSOS";
const SHOW_DEMO = (process.env.NEXT_PUBLIC_SHOW_DEMO ?? "true").toLowerCase() !== "false";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? DEFAULT_APP_NAME;

const demoProfiles: DemoProfile[] = [
  { key: "admin",      label: "Admin",      email: "admin@demo.local",      password: process.env.NEXT_PUBLIC_DEMO_PWD ?? "demo123" },
  { key: "manager",    label: "Manager",    email: "manager@demo.local",    password: process.env.NEXT_PUBLIC_DEMO_PWD ?? "demo123" },
  { key: "supervisor", label: "Supervisor", email: "supervisor@demo.local", password: process.env.NEXT_PUBLIC_DEMO_PWD ?? "demo123" },
  { key: "cleaner",    label: "Cleaner",    email: "cleaner@demo.local",    password: process.env.NEXT_PUBLIC_DEMO_PWD ?? "demo123" },
  { key: "client",     label: "Client",     email: "client@demo.local",     password: process.env.NEXT_PUBLIC_DEMO_PWD ?? "demo123" },
];

export default function LoginScreen(): JSX.Element {
  const router = useRouter();
  const { login } = useAuth();

  const [lang, setLang] = useState<Lang>("pt");
  const t = useMemo(() => i18n[lang], [lang]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true); setErr(null);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch {
      setErr(t.errorCreds);
    } finally {
      setBusy(false);
    }
  }

  async function handleDemoLogin(p: DemoProfile) {
    setEmail(p.email);
    setPassword(p.password);
    setBusy(true); setErr(null);
    try {
      await login(p.email, p.password);
      router.replace("/dashboard");
    } catch {
      setErr(t.errorCreds);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      {/* LEFT: Brand/Hero */}
      <aside className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-900 text-white p-10">
        <div className="m-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="text-sm opacity-90">{t.brandTag}</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            {APP_NAME}
          </h1>
          <p className="opacity-90 text-lg">
            {lang === "pt" && "Organize tarefas, equipes, finanças e propriedades em um só lugar."}
            {lang === "en" && "Organize tasks, teams, finances and properties in one place."}
            {lang === "es" && "Organiza tareas, equipos, finanzas y propiedades en un solo lugar."}
          </p>
          <ul className="space-y-2 text-white/90 text-sm">
            <li>• Dashboards por perfil</li>
            <li>• Notificações e relatórios</li>
            <li>• Integrações de pagamento</li>
          </ul>
        </div>
      </aside>

      {/* RIGHT: Form */}
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header + Language */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold">{APP_NAME}</div>
              <div className="text-sm text-gray-500">{t.subtitle}</div>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="border rounded-md px-2 py-1 text-sm"
              aria-label="Idioma"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>

          {/* Card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2">{t.title}</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <label className="block">
                <span className="text-sm text-gray-700">{t.email}</span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                  placeholder="voce@exemplo.com"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">{t.password}</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                  placeholder="••••••••"
                />
              </label>

              {err && (
                <div className="rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                  {err}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? "..." : t.login}
              </button>

              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  {t.forgot}
                </a>
              </div>
            </form>

            {/* Divider */}
            {SHOW_DEMO && (
              <>
                <div className="my-6 flex items-center gap-3 text-sm text-gray-500">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span>{t.or}</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Demo Profiles */}
                <div className="mb-2 text-sm font-medium text-gray-700">
                  {t.demoTitle}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {demoProfiles.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleDemoLogin(p)}
                      disabled={busy}
                      className="rounded-lg border px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-60"
                      title={`${t.demoCTA}: ${p.label}`}
                    >
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-xs text-gray-500">{p.email}</div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Foot note */}
          <div className="mt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} {APP_NAME}
          </div>
        </div>
      </main>
    </div>
  );
}
