"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title = "Dashboard", subtitle }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.info("[BSOS-Auth] Logout button clicked");
    toast.success("Logged out successfully.");
    logout(); // This will clear session and redirect to /login
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
                  <p className="text-xs text-gray-500">Role: <span className="font-semibold text-gray-700 uppercase">{user.role}</span></p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
