"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Lang = "en" | "pt" | "es";

const DEMO = {
  admin: process.env.NEXT_PUBLIC_DEMO_EMAIL_ADMIN || "admin@demo.local",
  manager: process.env.NEXT_PUBLIC_DEMO_EMAIL_MANAGER || "manager@demo.local",
  supervisor: process.env.NEXT_PUBLIC_DEMO_EMAIL_SUPERVISOR || "supervisor@demo.local",
  cleaner: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLEANER || "cleaner@demo.local",
  client: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLIENT || "client@demo.local",
  pwd: process.env.NEXT_PUBLIC_DEMO_PWD || "demo123",
};

const texts: Record<Lang, any> = {
  en: {
    title: "Sign in",
    subtitle: "Use your email and password",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    forgot: "Forgot password?",
    or: "or",
    demoTitle: "Quick demo login",
    demoPwd: "Password",
    brand: "Bright & Shine OS",
    tagline: "Smart management for tasks, properties and teams.",
  },
  pt: {
    title: "Entrar",
    subtitle: "Use seu e-mail e senha",
    email: "E-mail",
    password: "Senha",
    signIn: "Entrar",
    forgot: "Esqueci a senha",
    or: "ou",
    demoTitle: "Login de demonstração",
    demoPwd: "Senha",
    brand: "Bright & Shine OS",
    tagline: "Gestão inteligente de tarefas, propriedades e equipes.",
  },
  es: {
    title: "Iniciar sesión",
    subtitle: "Usa tu correo y contraseña",
    email: "Correo",
    password: "Contraseña",
    signIn: "Ingresar",
    forgot: "¿Olvidaste tu contraseña?",
    or: "o",
    demoTitle: "Inicio de sesión de demo",
    demoPwd: "Contraseña",
    brand: "Bright & Shine OS",
    tagline: "Gestión inteligente de tareas, propiedades y equipos.",
  },
};

export default function LoginPage(): JSX.Element {
  const { login } = useAuth();
  const [lang, setLang] = useState<Lang>("en");
  const t = useMemo(() => texts[lang], [lang]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password); // redireciona no AuthContext
    } catch {
      alert("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  const demoLogin = (role: keyof typeof DEMO) => async () => {
    if (role === "pwd") return;
    setBusy(true);
    try {
      await login(DEMO[role] as string, DEMO.pwd);
    } catch {
      alert("Demo login failed. Did you run the seed?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      {/* Brand / Hero */}
      <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-900 items-center justify-center p-10">
        <div className="text-white space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t.brand}</h1>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="text-gray-800 bg-white/90 rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="es">Español</option>
            </select>
          </div>
          <p className="opacity-90">{t.tagline}</p>
        </div>
      </div>

      {/* Form + Demo buttons below */}
      <div className="p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="md:hidden flex items-center justify-between">
            <h1 className="text-xl font-semibold">{t.brand}</h1>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="border rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="pt">PT</option>
              <option value="es">ES</option>
            </select>
          </div>

          <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold">{t.title}</h2>
              <p className="text-sm text-gray-500">{t.subtitle}</p>
            </div>

            <input
              type="email"
              placeholder={t.email}
              className="w-full border rounded px-3 py-2"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder={t.password}
              className="w-full border rounded px-3 py-2"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? "…" : t.signIn}
            </button>

            <div className="flex items-center justify-end text-sm">
              <button type="button" className="text-blue-600 hover:underline">
                {t.forgot}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">{t.or}</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* DEMO buttons BELOW the form */}
          <div className="bg-white rounded-xl shadow p-6 space-y-2">
            <div className="text-sm text-gray-600">{t.demoTitle}</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button onClick={demoLogin("admin")} className="border rounded px-3 py-2 hover:bg-gray-50">Admin</button>
              <button onClick={demoLogin("manager")} className="border rounded px-3 py-2 hover:bg-gray-50">Manager</button>
              <button onClick={demoLogin("supervisor")} className="border rounded px-3 py-2 hover:bg-gray-50">Supervisor</button>
              <button onClick={demoLogin("cleaner")} className="border rounded px-3 py-2 hover:bg-gray-50">Cleaner</button>
              <button onClick={demoLogin("client")} className="border rounded px-3 py-2 hover:bg-gray-50">Client</button>
            </div>
            <div className="text-xs text-gray-500">
              {t.demoPwd}: <code>{DEMO.pwd}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
