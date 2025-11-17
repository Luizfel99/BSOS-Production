"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/** why: keep roles visible + quick demo logins; defaults to EN */
type Lang = "en" | "pt" | "es";

const i18n: Record<Lang, {
  brandTag: string; title: string; subtitle: string;
  email: string; password: string; login: string; forgot: string; or: string;
  demoTitle: string; demoCTA: string; google: string; invalid: string; footer: string;
}> = {
  en: {
    brandTag: "Smart operations platform",
    title: "Welcome back",
    subtitle: "Sign in to your dashboard",
    email: "Email",
    password: "Password",
    login: "Sign In",
    forgot: "Forgot password?",
    or: "or",
    demoTitle: "Demo profiles",
    demoCTA: "Log in as demo",
    google: "Continue with Google",
    invalid: "Invalid credentials",
    footer: "All rights reserved.",
  },
  pt: {
    brandTag: "Plataforma inteligente de operações",
    title: "Bem-vindo de volta",
    subtitle: "Acesse seu painel",
    email: "E-mail",
    password: "Senha",
    login: "Entrar",
    forgot: "Esqueci a senha",
    or: "ou",
    demoTitle: "Perfis de demonstração",
    demoCTA: "Entrar como demo",
    google: "Continuar com Google",
    invalid: "Credenciais inválidas",
    footer: "Todos os direitos reservados.",
  },
  es: {
    brandTag: "Plataforma inteligente de operaciones",
    title: "Bienvenido de nuevo",
    subtitle: "Accede a tu panel",
    email: "Correo",
    password: "Contraseña",
    login: "Iniciar sesión",
    forgot: "¿Olvidaste la contraseña?",
    or: "o",
    demoTitle: "Perfiles de demostración",
    demoCTA: "Entrar como demo",
    google: "Continuar con Google",
    invalid: "Credenciales inválidas",
    footer: "Todos los derechos reservados.",
  },
};

type DemoProfile = {
  key: "admin" | "manager" | "supervisor" | "cleaner" | "client";
  label: string;
  email: string;
  password: string;
};

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "BSOS";
const SHOW_DEMO = (process.env.NEXT_PUBLIC_SHOW_DEMO ?? "true").toLowerCase() !== "false";
const DEMO_PWD = process.env.NEXT_PUBLIC_DEMO_PWD ?? "demo123";

const DEMOS: DemoProfile[] = [
  { key: "admin",      label: "Admin",      email: "admin@demo.local",      password: DEMO_PWD },
  { key: "manager",    label: "Manager",    email: "manager@demo.local",    password: DEMO_PWD },
  { key: "supervisor", label: "Supervisor", email: "supervisor@demo.local", password: DEMO_PWD },
  { key: "cleaner",    label: "Cleaner",    email: "cleaner@demo.local",    password: DEMO_PWD },
  { key: "client",     label: "Client",     email: "client@demo.local",     password: DEMO_PWD },
];

export default function LoginScreen(): JSX.Element {
  const router = useRouter();
  const { login } = useAuth();

  const [lang, setLang] = useState<Lang>("en");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("bsos_lang") as Lang | null) : null;
    if (stored && ["en","pt","es"].includes(stored)) setLang(stored as Lang);
  }, []);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("bsos_lang", lang); }, [lang]);

  const t = useMemo(() => i18n[lang], [lang]);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true); setErr(null);
    try {
      await login(email.trim(), password);
      router.replace("/dashboard");
    } catch {
      setErr(t.invalid);
    } finally {
      setBusy(false);
    }
  }

  async function onDemo(p: DemoProfile) {
    setEmail(p.email); setPassword(p.password);
    setBusy(true); setErr(null);
    try {
      await login(p.email, p.password);
      router.replace("/dashboard");
    } catch {
      setErr(t.invalid);
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    // why: placeholder sem dependências externas; se houver rota real, redireciona
    const url = "/api/auth/google";
    try {
      // tenta GET de cortesia para detectar rota
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        window.location.href = url;
      } else {
        alert("Google Sign-In not configured yet.");
      }
    } catch {
      alert("Google Sign-In not configured yet.");
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
            {lang === "en" && "Run tasks, teams, finances and properties in one place."}
            {lang === "pt" && "Gerencie tarefas, equipes, finanças e propriedades em um só lugar."}
            {lang === "es" && "Gestiona tareas, equipos, finanzas y propiedades en un solo lugar."}
          </p>
          <ul className="space-y-2 text-white/90 text-sm">
            <li>• Role-based dashboards</li>
            <li>• Notifications & reports</li>
            <li>• Payments integrations</li>
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
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="pt">PT</option>
              <option value="es">ES</option>
            </select>
          </div>

          {/* Card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-2">{t.title}</h2>

            {/* Google placeholder */}
            <button
              type="button"
              onClick={onGoogle}
              disabled={busy}
              className="w-full rounded-lg border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              {t.google}
            </button>

            <div className="my-4 flex items-center gap-3 text-sm text-gray-500">
              <div className="h-px flex-1 bg-gray-200" />
              <span>{t.or}</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-700">{t.email}</span>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                  placeholder="you@example.com"
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

            {/* Demo Profiles */}
            {SHOW_DEMO && (
              <>
                <div className="my-6 flex items-center gap-3 text-sm text-gray-500">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span>{t.or}</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="mb-2 text-sm font-medium text-gray-700">
                  {t.demoTitle}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMOS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => onDemo(p)}
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

          <div className="mt-4 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} {APP_NAME}. {t.footer}
          </div>
        </div>
      </main>
    </div>
  );
}
