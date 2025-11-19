"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "manager" | "supervisor" | "cleaner" | "owner" | "client";

export default function LoginScreen(): JSX.Element {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "pt" | "es">("en");
  const [busy, setBusy] = useState(false);

  async function loginDemo(role: Role) {
    setBusy(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demo: true, role }),
      });
      if (!r.ok) throw new Error("demo login failed");
      router.replace("/dashboard");
    } catch (e) {
      alert("Demo login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md space-y-6" data-testid="login-card">
        <header className="text-center">
          <h1 className="text-2xl font-semibold" data-testid="app-title">
            BSOS
          </h1>
          <p className="opacity-70 text-sm">Bright &amp; Shine Operating System</p>
        </header>

        <form
          className="space-y-3 border rounded-xl p-4 bg-white"
          onSubmit={(e) => {
            e.preventDefault();
            // placeholder para login real (mantido intocado)
          }}
        >
          <input
            className="w-full border rounded px-3 py-2"
            placeholder={lang === "pt" ? "E-mail" : lang === "es" ? "Correo" : "Email"}
            data-testid="login-email"
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            placeholder={lang === "pt" ? "Senha" : lang === "es" ? "Contraseña" : "Password"}
            data-testid="login-password"
          />
          <button
            className="w-full border rounded px-3 py-2"
            data-testid="login-submit"
            disabled={busy}
          >
            {lang === "pt" ? "Entrar" : lang === "es" ? "Iniciar sesión" : "Sign In"}
          </button>
        </form>

        {/* DEMO BUTTONS — abaixo do login */}
        <div className="space-y-2" data-testid="demo-buttons">
          <button
            data-testid="demo-admin"
            onClick={() => loginDemo("admin")}
            className="w-full border rounded px-3 py-2"
            disabled={busy}
          >
            {lang === "pt"
              ? "Entrar como Admin (demo)"
              : lang === "es"
              ? "Entrar como Admin (demo)"
              : "Login as Admin (demo)"}
          </button>
          <button
            data-testid="demo-manager"
            onClick={() => loginDemo("manager")}
            className="w-full border rounded px-3 py-2"
            disabled={busy}
          >
            {lang === "pt"
              ? "Entrar como Manager (demo)"
              : lang === "es"
              ? "Entrar como Manager (demo)"
              : "Login as Manager (demo)"}
          </button>
          <button
            data-testid="demo-supervisor"
            onClick={() => loginDemo("supervisor")}
            className="w-full border rounded px-3 py-2"
            disabled={busy}
          >
            {lang === "pt"
              ? "Entrar como Supervisor (demo)"
              : lang === "es"
              ? "Entrar como Supervisor (demo)"
              : "Login as Supervisor (demo)"}
          </button>
          <button
            data-testid="demo-cleaner"
            onClick={() => loginDemo("cleaner")}
            className="w-full border rounded px-3 py-2"
            disabled={busy}
          >
            {lang === "pt"
              ? "Entrar como Cleaner (demo)"
              : lang === "es"
              ? "Entrar como Cleaner (demo)"
              : "Login as Cleaner (demo)"}
          </button>
          <button
            data-testid="demo-client"
            onClick={() => loginDemo("client")}
            className="w-full border rounded px-3 py-2"
            disabled={busy}
          >
            {lang === "pt"
              ? "Entrar como Client (demo)"
              : lang === "es"
              ? "Entrar como Client (demo)"
              : "Login as Client (demo)"}
          </button>
        </div>

        {/* Idiomas */}
        <div className="pt-2">
          <label className="block text-xs mb-1">Language</label>
          <select
            data-testid="lang-select"
            className="w-full border rounded px-2 py-1"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            <option value="en">English (EN)</option>
            <option value="pt">Português (PT)</option>
            <option value="es">Español (ES)</option>
          </select>
        </div>
      </div>
    </main>
  );
}
