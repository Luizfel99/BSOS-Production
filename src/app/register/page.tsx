"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await axios.post("/api/auth/register", form, { withCredentials: true });
      if (res.data?.user) setMsg("Account created. You can now sign in.");
      else setMsg("Created.");
    } catch (err: any) {
      setMsg(err?.response?.data?.error ?? "Failed to create account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="w-full border rounded px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="client">Client</option>
            <option value="cleaner">Cleaner</option>
            <option value="supervisor">Supervisor</option>
            <option value="manager">Manager</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button disabled={busy} className="w-full rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50">
            Create Account
          </button>
        </form>
        {msg && <div className="text-sm text-gray-700">{msg}</div>}
        <div className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
