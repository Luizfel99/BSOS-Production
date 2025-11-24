"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type Role = "admin" | "manager" | "supervisor" | "cleaner" | "client";

const copy = {
  en: {
    title: "Bright & Shine Operating System",
    subtitle: "Operate your business with clarity.",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    demos: "Try a demo profile",
    or: "or",
    signupQ: "Don't have an account?",
    signup: "Sign up",
  },
  pt: {
    title: "Bright & Shine Operating System",
    subtitle: "Gerencie seu negócio com clareza.",
    email: "E-mail",
    password: "Senha",
    signIn: "Entrar",
    demos: "Experimentar um perfil demo",
    or: "ou",
    signupQ: "Não tem uma conta?",
    signup: "Criar conta",
  },
  es: {
    title: "Bright & Shine Operating System",
    subtitle: "Gestiona tu negocio con claridad.",
    email: "Correo",
    password: "Contraseña",
    signIn: "Iniciar sesión",
    demos: "Probar un perfil demo",
    or: "o",
    signupQ: "¿No tienes cuenta?",
    signup: "Regístrate",
  },
};

export default function LoginScreen(): JSX.Element {
  const { login, loginDemo } = useAuth();
  const [lang, setLang] = useState<"en" | "pt" | "es">("en");
  const t = copy[lang];
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
    } catch {
      alert("Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function demo(role: Role) {
    setBusy(true);
    try {
      await loginDemo(role);
    } catch {
      alert("Demo login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-10">
        <div className="max-w-md text-white space-y-4">
          <h1 className="text-3xl font-semibold leading-tight">{t.title}</h1>
          <p className="opacity-90">{t.subtitle}</p>
        </div>
      </div>

      <main className="flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow p-6 space-y-5" data-testid="login-card">
            <header className="space-y-1 text-center">
              <div className="text-2xl font-semibold tracking-tight" data-testid="app-title">
                BSOS
              </div>
              <div className="text-xs text-gray-500">Sign in to continue</div>
            </header>

            <form className="space-y-3" onSubmit={onSubmit}>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                data-testid="login-email"
              />
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder={t.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-testid="login-password"
              />
              <button
                disabled={busy}
                className="w-full rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                data-testid="login-submit"
              >
                {t.signIn}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-500">{t.or}</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="space-y-2" data-testid="demo-buttons">
              <div className="text-xs text-gray-600">{t.demos}</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => demo("admin")}
                  className="border rounded-lg px-3 py-2 hover:bg-gray-50"
                  disabled={busy}
                  data-testid="demo-admin"
                >
                  Admin
                </button>
                <button
                  onClick={() => demo("manager")}
                  className="border rounded-lg px-3 py-2 hover:bg-gray-50"
                  disabled={busy}
                  data-testid="demo-manager"
                >
                  Manager
                </button>
                <button
                  onClick={() => demo("supervisor")}
                  className="border rounded-lg px-3 py-2 hover:bg-gray-50"
                  disabled={busy}
                  data-testid="demo-supervisor"
                >
                  Supervisor
                </button>
                <button
                  onClick={() => demo("cleaner")}
                  className="border rounded-lg px-3 py-2 hover:bg-gray-50"
                  disabled={busy}
                  data-testid="demo-cleaner"
                >
                  Cleaner
                </button>
                <button
                  onClick={() => demo("client")}
                  className="col-span-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
                  disabled={busy}
                  data-testid="demo-client"
                >
                  Client
                </button>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs mb-1">Language</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                data-testid="lang-select"
              >
                <option value="en">English (EN)</option>
                <option value="pt">Português (PT)</option>
                <option value="es">Español (ES)</option>
              </select>
            </div>

            <div className="pt-1 text-center text-sm">
              {t.signupQ}{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                {t.signup}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
