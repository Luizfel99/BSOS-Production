"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function SignOutButton() {
  const { logout } = useAuth();
  return (
    <button
      className="border rounded px-3 py-2 hover:bg-gray-50"
      onClick={() => logout()}
      data-testid="btn-signout"
    >
      Sign out
    </button>
  );
}