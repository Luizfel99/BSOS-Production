'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Building2, BarChart3, Settings, Bell } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('[BSOS-Auth] Admin Dashboard: No user found, redirecting to login');
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-700 animate-pulse">Loading Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Welcome back, Admin">
      <div className="">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Manage Cleaners Card */}
          <div className="bg-white rounded-lg shadow-md border-2 border-blue-100 hover:border-blue-300 transition-all p-6 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">TEAM</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Cleaners</h2>
            <p className="text-gray-600 text-sm">
              View and assign tasks, monitor availability, and manage the cleaning team performance.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Active Team Members</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
            </div>
          </div>

          {/* Property Overview Card */}
          <div className="bg-white rounded-lg shadow-md border-2 border-green-100 hover:border-green-300 transition-all p-6 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">PROPERTIES</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Overview</h2>
            <p className="text-gray-600 text-sm">
              Access property analytics, maintenance logs, and Airbnb synchronization tools.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Properties</span>
                <span className="font-semibold text-gray-900">28</span>
              </div>
            </div>
          </div>

          {/* Reports & Insights Card */}
          <div className="bg-white rounded-lg shadow-md border-2 border-purple-100 hover:border-purple-300 transition-all p-6 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">ANALYTICS</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports & Insights</h2>
            <p className="text-gray-600 text-sm">
              Generate detailed reports about performance, revenue, and guest satisfaction metrics.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Monthly Revenue</span>
                <span className="font-semibold text-gray-900">$45.2K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Settings */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                <span className="text-gray-700">User Permissions</span>
                <span className="text-blue-600 font-medium">Configure →</span>
              </li>
              <li className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                <span className="text-gray-700">Integration Settings</span>
                <span className="text-blue-600 font-medium">Manage →</span>
              </li>
              <li className="flex items-center justify-between text-sm hover:bg-gray-50 p-2 rounded cursor-pointer">
                <span className="text-gray-700">Backup & Security</span>
                <span className="text-blue-600 font-medium">View →</span>
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-gray-700">New property added: "Sunset Villa"</p>
                  <p className="text-gray-500 text-xs mt-0.5">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-gray-700">Team member joined: Maria Santos</p>
                  <p className="text-gray-500 text-xs mt-0.5">5 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-gray-700">Monthly report generated</p>
                  <p className="text-gray-500 text-xs mt-0.5">1 day ago</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
