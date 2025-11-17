// ============================================================================
// FILE: src/app/dashboard/page.tsx
// DESC: Role-based cards + routes (all buttons wired)
// ============================================================================
"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

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

  const cards = user ? byRole[user.role] ?? baseCards : baseCards;
  return (
    <main className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Quick access by role</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block rounded-xl border bg-white p-5 hover:shadow-sm"
          >
            <div className="text-lg font-medium">{c.title}</div>
            <div className="text-gray-600 text-sm">{c.desc}</div>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-medium mb-2">Shortcuts</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/settings" className="rounded border px-3 py-1.5 hover:bg-gray-50">Settings</Link>
          <Link href="/profile" className="rounded border px-3 py-1.5 hover:bg-gray-50">Profile</Link>
          <Link href="/api/dev/seed?full=1" className="rounded border px-3 py-1.5 hover:bg-gray-50">Re-Seed</Link>
          <Link href="/api/health" className="rounded border px-3 py-1.5 hover:bg-gray-50">Health</Link>
          <Link href="/api/health/neon" className="rounded border px-3 py-1.5 hover:bg-gray-50">DB Health</Link>
        </div>
      </section>
    </main>
  );
}
