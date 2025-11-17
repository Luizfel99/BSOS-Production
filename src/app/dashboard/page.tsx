// ============================================================================
// FILE: src/app/dashboard/page.tsx
// DESC: Cards por role + gráfico Recharts (tarefas por status)
// ============================================================================
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

type Card = { title: string; desc: string; href: string };
const baseCards: Card[] = [
  { title: "Tasks", desc: "Manage and track tasks", href: "/tasks" },
  { title: "Team", desc: "Team roster & roles", href: "/team" },
  { title: "Properties", desc: "Properties & units", href: "/properties" },
  { title: "Notifications", desc: "Activity & alerts", href: "/notifications" },
  { title: "Finance", desc: "Invoices & transactions", href: "/finance" },
];
const byRole: Record<string, Card[]> = {
  admin: baseCards,
  manager: baseCards,
  supervisor: baseCards.filter((c) => c.title !== "Finance"),
  cleaner: baseCards.filter((c) => c.title === "Tasks" || c.title === "Notifications"),
  client: baseCards.filter((c) => c.title === "Properties" || c.title === "Notifications"),
};

export default function DashboardPage(): JSX.Element {
  const { user } = useAuth();
  const t = useTranslations("dashboard");

  const cards = user ? byRole[user.role] ?? baseCards : baseCards;

  const [chartData, setChartData] = useState<{ status: string; count: number }[]>([
    { status: "todo", count: 0 },
    { status: "in_progress", count: 0 },
    { status: "done", count: 0 }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tasks/summary", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setChartData([
          { status: "todo", count: data?.todo ?? 0 },
          { status: "in_progress", count: data?.in_progress ?? 0 },
          { status: "done", count: data?.done ?? 0 }
        ]);
      } catch {
        // silent fallback
      }
    })();
  }, []);

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c) => (
              <Link key={c.href} href={c.href} className="block rounded-xl border bg-white p-5 hover:shadow-sm">
                <div className="text-lg font-medium">
                  {t(`cards.${c.title.toLowerCase()}` as any)}
                </div>
                <div className="text-gray-600 text-sm">{c.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-4">
          <div className="text-sm font-medium mb-2">{t("charts.tasksByStatus")}</div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-2">{t("shortcuts")}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/settings" className="rounded border px-3 py-1.5 hover:bg-gray-50">{t("open.settings")}</Link>
          <Link href="/profile" className="rounded border px-3 py-1.5 hover:bg-gray-50">{t("open.profile")}</Link>
          <Link href="/api/dev/seed?full=1" className="rounded border px-3 py-1.5 hover:bg-gray-50">{t("open.seed")}</Link>
          <Link href="/api/health" className="rounded border px-3 py-1.5 hover:bg-gray-50">{t("open.health")}</Link>
          <Link href="/api/health/neon" className="rounded border px-3 py-1.5 hover:bg-gray-50">{t("open.dbHealth")}</Link>
        </div>
      </section>
    </main>
  );
}
