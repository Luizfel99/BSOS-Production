"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface NavLinkProps {
  href: string;
  label: string;
}

function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded ${
        active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}

/**
 * AppHeader - Client-side header with navigation and logout
 * 
 * Why: Provides consistent navigation across all pages with user info and sign out.
 * Uses AuthContext for client-side logout with JS enabled.
 */
export default function AppHeader() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold text-lg">
            Bright&nbsp;&amp;&nbsp;Shine&nbsp;OS
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/dashboard" label="Dashboard" />
            <NavLink href="/tasks" label="Tasks" />
            <NavLink href="/team" label="Team" />
            <NavLink href="/properties" label="Properties" />
            <NavLink href="/notifications" label="Notifications" />
            <NavLink href="/profile" label="Profile" />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!loading && user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                {user.name} • {user.role}
              </span>
              <button
                onClick={() => void logout()}
                className="rounded px-3 py-2 border hover:bg-gray-50"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded px-3 py-2 border hover:bg-gray-50"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
