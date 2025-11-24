"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage(): JSX.Element {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [locale, setLocale] = useState<"en" | "pt" | "es">("en");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!user) {
    return (
      <main className="min-h-screen grid place-items-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-gray-600">You must be signed in.</p>
        </div>
      </main>
    );
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "update_failed");
      setMsg("Profile updated.");
    } catch (e: any) {
      setErr(e.message || "error");
    } finally {
      setBusy(false);
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "upload_failed");
      setMsg("Avatar updated.");
    } catch (e: any) {
      setErr(e.message || "error");
    } finally {
      setBusy(false);
      (e.target as HTMLInputElement).value = "";
    }
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-gray-600">Account information & preferences</p>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <span className="text-sm">Change avatar</span>
          <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
          <span className="rounded px-3 py-2 border hover:bg-gray-50">Upload</span>
        </label>
      </div>

      <form onSubmit={saveProfile} className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Language</label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm text-gray-600">Email</label>
          <div className="rounded border p-2 bg-gray-50">{user.email}</div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm text-gray-600">Role</label>
          <div className="rounded border p-2 bg-gray-50">{user.role}</div>
        </div>

        <div className="md:col-span-2 flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          {msg && <span className="text-green-600 text-sm">{msg}</span>}
          {err && <span className="text-red-600 text-sm">{err}</span>}
        </div>
      </form>
    </main>
  );
}
