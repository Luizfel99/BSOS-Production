"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const DEMO = {
  admin: process.env.NEXT_PUBLIC_DEMO_EMAIL_ADMIN || "admin@demo.local",
  manager: process.env.NEXT_PUBLIC_DEMO_EMAIL_MANAGER || "manager@demo.local",
  supervisor: process.env.NEXT_PUBLIC_DEMO_EMAIL_SUPERVISOR || "supervisor@demo.local",
  cleaner: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLEANER || "cleaner@demo.local",
  client: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLIENT || "client@demo.local",
  pwd: process.env.NEXT_PUBLIC_DEMO_PWD || "demo123",
};

const ALLOW_REGISTER =
  (process.env.NEXT_PUBLIC_ALLOW_SELF_REGISTER ?? "false").toLowerCase() === "true";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
    } catch (e) {
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
    } catch (e) {
      alert("Demo login failed. Did you run the seed?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-900 items-center justify-center p-10">
        <div className="text-white max-w-md space-y-4">
          <h1 className="text-4xl font-bold">Bright &amp; Shine OS</h1>
          <p className="opacity-90">
            Smart management for tasks, properties and teams.
          </p>
          <div className="space-y-2">
            <div className="text-sm opacity-80">Quick demo login:</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={demoLogin("admin")} className="bg-white/10 rounded px-3 py-2 hover:bg-white/20">Admin</button>
              <button onClick={demoLogin("manager")} className="bg-white/10 rounded px-3 py-2 hover:bg-white/20">Manager</button>
              <button onClick={demoLogin("supervisor")} className="bg-white/10 rounded px-3 py-2 hover:bg-white/20">Supervisor</button>
              <button onClick={demoLogin("cleaner")} className="bg-white/10 rounded px-3 py-2 hover:bg-white/20">Cleaner</button>
              <button onClick={demoLogin("client")} className="bg-white/10 rounded px-3 py-2 hover:bg-white/20">Client</button>
            </div>
            <div className="text-xs opacity-75">Password: <code>{DEMO.pwd}</code></div>
          </div>
        </div>
      </div>

      <div className="p-8 flex items-center justify-center">
        <form onSubmit={submit} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="text-sm text-gray-500">Use your email and password</p>
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => router.push("/forgot-password")} className="text-blue-600 hover:underline">
              Forgot password?
            </button>
            {ALLOW_REGISTER && (
              <button type="button" onClick={() => router.push("/register")} className="text-blue-600 hover:underline">
                Create account
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
