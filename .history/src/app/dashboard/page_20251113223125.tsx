"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await axios.get("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(res.data.stats);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-gray-100">
          <h2>Pendentes</h2>
          <p className="text-2xl">{stats?.pending}</p>
        </div>

        <div className="p-4 rounded-lg bg-gray-100">
          <h2>Em progresso</h2>
          <p className="text-2xl">{stats?.inProgress}</p>
        </div>

        <div className="p-4 rounded-lg bg-gray-100">
          <h2>Concluídas</h2>
          <p className="text-2xl">{stats?.completed}</p>
        </div>
      </div>
    </div>
  );
}
