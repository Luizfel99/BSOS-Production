import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-gray-600">
        Welcome! You are authenticated. Replace this with your real dashboard
        components (cards, charts, tables).
      </p>

      {/* Quick Navigation placeholders */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link href="/tasks" className="rounded border p-4 hover:bg-gray-50">
          Tasks (placeholder)
        </Link>
        <Link href="/team" className="rounded border p-4 hover:bg-gray-50">
          Team (placeholder)
        </Link>
        <Link href="/properties" className="rounded border p-4 hover:bg-gray-50">
          Properties (placeholder)
        </Link>
      </div>
    </div>
  );
}
