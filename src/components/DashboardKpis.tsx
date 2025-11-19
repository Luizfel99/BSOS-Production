// ============================================================================
// FILE: src/components/DashboardKpis.tsx
// PURPOSE: Small KPI strip with links to pages (plug into dashboard/page.tsx)
// ============================================================================
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Summary = { tasks: number; team: number; properties: number };

export default function DashboardKpis(): JSX.Element {
  const [data, setData] = useState<Summary>({ tasks: 0, team: 0, properties: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/metrics/summary", { credentials: "include" });
        const json = await res.json();
        if (alive) setData(json);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const cards = [
    { label: "Tasks", value: data.tasks, href: "/tasks", testId: "kpi-total-tasks" },
    { label: "Team", value: data.team, href: "/team", testId: "kpi-total-team" },
    { label: "Properties", value: data.properties, href: "/properties", testId: "kpi-total-properties" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <Link key={c.label} href={c.href} className="rounded-xl border p-4 hover:bg-gray-50 transition">
          <div className="text-xs uppercase tracking-wide text-gray-500">{c.label}</div>
          <div data-testid={c.testId} className="text-2xl font-semibold">{loading ? "…" : c.value}</div>
          <div className="text-sm text-blue-600 mt-1">Open {c.label.toLowerCase()} →</div>
        </Link>
      ))}
    </section>
  );
}
