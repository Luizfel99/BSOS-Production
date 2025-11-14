"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type User = {
  email?: string;
  role?: string;
  [k: string]: any;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ pending: 0, progress: 0, done: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    // Use a relative path so the request targets the same origin the app is served from.
    // This avoids hardcoding localhost:3020 and works on deployed environments.
    axios
      .get("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user ?? null);
        setStats(res.data.stats ?? { pending: 0, progress: 0, done: 0 });
      })
      .catch((err) => {
        // If token invalid or other error, clear and redirect to login
        console.error("Erro ao carregar dashboard:", err?.response ?? err);
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-700 animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-10 tracking-wide">BSOS</h1>
        <nav className="flex flex-col gap-3">
          <button className="text-left hover:bg-blue-800 p-2 rounded">Dashboard</button>
          <button className="text-left hover:bg-blue-800 p-2 rounded">Properties</button>
          <button className="text-left hover:bg-blue-800 p-2 rounded">Cleaners</button>
          <button className="text-left hover:bg-blue-800 p-2 rounded">Reports</button>
          <button
            onClick={logout}
            className="mt-auto text-left hover:bg-red-600 p-2 rounded transition-colors duration-200"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome, <span className="text-blue-700 font-bold">{user?.email ?? "Admin"}</span>
          </h2>
          <div className="text-sm text-gray-500">
            Role: <span className="font-medium">{user?.role ?? "Owner"}</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow text-center border-t-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-700">Pending</h3>
            <p className="text-4xl font-bold text-blue-600 mt-3">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center border-t-4 border-yellow-500">
            <h3 className="text-xl font-semibold text-gray-700">In Progress</h3>
            <p className="text-4xl font-bold text-yellow-500 mt-3">{stats.progress}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center border-t-4 border-green-500">
            <h3 className="text-xl font-semibold text-gray-700">Completed</h3>
            <p className="text-4xl font-bold text-green-600 mt-3">{stats.done}</p>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="bg-white p-6 rounded-2xl shadow text-gray-600">
            <p>No recent updates yet. 🚀</p>
          </div>
        </section>
      </main>
    </div>
  )