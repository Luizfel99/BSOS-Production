"use client";

import { useState } from "react";

const DEMO = {
  admin: process.env.NEXT_PUBLIC_DEMO_EMAIL_ADMIN || "admin@demo.local",
  manager: process.env.NEXT_PUBLIC_DEMO_EMAIL_MANAGER || "manager@demo.local",
  supervisor: process.env.NEXT_PUBLIC_DEMO_EMAIL_SUPERVISOR || "supervisor@demo.local",
  cleaner: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLEANER || "cleaner@demo.local",
  client: process.env.NEXT_PUBLIC_DEMO_EMAIL_CLIENT || "client@demo.local",
  pwd: process.env.NEXT_PUBLIC_DEMO_PWD || "demo123",
};

const shouldShow =
  process.env.NODE_ENV !== "production" ||
  (process.env.NEXT_PUBLIC_SHOW_DEMO_BAR || "false").toLowerCase() === "true";

/**
 * DemoBar - Dev-only top bar showing demo credentials + Re-Seed button
 * 
 * Why: Quick access to demo emails and ability to recreate demo users.
 * Only visible in development or if NEXT_PUBLIC_SHOW_DEMO_BAR=true.
 */
export default function DemoBar() {
  const [msg, setMsg] = useState<string | null>(null);
  if (!shouldShow) return null;

  async function reseed() {
    setMsg("Seeding…");
    try {
      const res = await fetch("/api/auth/seed-demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Seed failed");
      setMsg("Seed OK");
    } catch (e: any) {
      setMsg(`Seed failed: ${e.message ?? "error"}`);
    } finally {
      setTimeout(() => setMsg(null), 2500);
    }
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 py-2 text-sm flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-amber-900">Demo:</span>
          <span className="text-amber-900/90">admin: {DEMO.admin}</span>
          <span className="text-amber-900/90">manager: {DEMO.manager}</span>
          <span className="text-amber-900/90">supervisor: {DEMO.supervisor}</span>
          <span className="text-amber-900/90">cleaner: {DEMO.cleaner}</span>
          <span className="text-amber-900/90">client: {DEMO.client}</span>
          <span className="text-amber-900/90">pwd: {DEMO.pwd}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={reseed}
            className="rounded px-3 py-1.5 border border-amber-300 bg-amber-100 hover:bg-amber-200"
            title="Re-Seed demo users"
          >
            Re-Seed
          </button>
          {msg && <span className="text-amber-900">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
