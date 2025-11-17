"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage(): JSX.Element {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed");
      setMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-gray-600">User details & security</p>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <h2 className="text-lg font-medium">Account</h2>
          <div className="text-sm text-gray-600">Name</div>
          <div className="rounded border p-2 bg-gray-50">{user.name || "-"}</div>

          <div className="text-sm text-gray-600 mt-3">Email</div>
          <div className="rounded border p-2 bg-gray-50">{user.email}</div>

          <div className="text-sm text-gray-600 mt-3">Role</div>
          <div className="rounded border p-2 bg-gray-50">{user.role}</div>

          {/* Placeholders for future: avatar, locale, notifications */}
          <div className="mt-4 text-xs text-gray-500">
            Placeholders: avatar upload, language preferences, notifications…
          </div>
        </div>

        <form onSubmit={changePassword} className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-lg font-medium">Change password</h2>

          <input
            type="password"
            placeholder="Current password"
            className="w-full border rounded px-3 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full border rounded px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={busy}
            className="rounded px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Updating…" : "Update password"}
          </button>

          {msg && <div className="text-sm text-green-600">{msg}</div>}
          {err && <div className="text-sm text-red-600">{err}</div>}
        </form>
      </section>
    </main>
  );
}
