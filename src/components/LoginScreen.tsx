"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "manager" | "supervisor" | "cleaner" | "owner" | "client";

export default function LoginScreen(): JSX.Element {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "pt" | "es">("en");

  async function loginDemo(role: Role) {
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demo: true, role }),
      });
      if (!r.ok) throw new Error("login failed");
      router.replace("/dashboard");
    } catch {
      // por que: evita teste quebrar silenciosamente
      alert("Demo login failed");
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-md space-y-6" data-testid="login-card">
        <header className="text-center">
          <h1 className="text-2xl font-semibold" data-testid="app-title">BSOS</h1>
          <p className="opacity-70 text-sm">Bright &amp; Shine Operating System</p>
        </header>

        {/* sua UI real de login (email/senha) pode ficar aqui se desejar */}
        <form
          data-testid="login-form"
          className="space-y-2 border rounded-xl p-4"
          onSubmit={(e) => {
            e.preventDefault();
            // noop: somente placeholder enquanto usa demo
          }}
        >
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            data-testid="login-email"
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            placeholder="Password"
            data-testid="login-password"
          />
          <button className="w-full border rounded px-3 py-2" data-testid="login-submit">
            Sign In
          </button>
        </form>

        {/* DEMO BUTTONS — estáveis para e2e */}
        <div className="space-y-2" data-testid="demo-buttons">
          <button data-testid="demo-admin" onClick={() => loginDemo("admin")} className="w-full border rounded px-3 py-2">
            Login as Admin (demo)
          </button>
          <button data-testid="demo-manager" onClick={() => loginDemo("manager")} className="w-full border rounded px-3 py-2">
            Login as Manager (demo)
          </button>
          <button data-testid="demo-supervisor" onClick={() => loginDemo("supervisor")} className="w-full border rounded px-3 py-2">
            Login as Supervisor (demo)
          </button>
          <button data-testid="demo-cleaner" onClick={() => loginDemo("cleaner")} className="w-full border rounded px-3 py-2">
            Login as Cleaner (demo)
          </button>
          <button data-testid="demo-client" onClick={() => loginDemo("client")} className="w-full border rounded px-3 py-2">
            Login as Client (demo)
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
