/**
 * BSOSCoreResponsive - Simplified version using ResponsiveLayout
 * A working implementation showing responsive design with screen width detection
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useBSOSActions, CleaningTask } from '@/contexts/BSOSContext';
import { useMediaQuery, useMobileFirst } from '@/hooks/useMediaQuery';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import toast from 'react-hot-toast';
import { 
  Home, 
  Calendar, 
  CheckCircle, 
  Upload, 
  Settings, 
  Camera, 
  FileText, 
  BarChart3,
  Users,
  DollarSign
} from 'lucide-react';

// Sample Dashboard Component
const Dashboard = () => {
  const { isMobile, isTablet, isDesktop, screenWidth } = useMediaQuery();
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
          🎯 Responsive Layout Demo
        </h2>
        <div className="text-xs sm:text-sm text-blue-700 space-y-1">
          <p><strong>Screen Width:</strong> {screenWidth}px</p>
          <p><strong>Device Type:</strong> {
            isMobile ? 'Mobile (< 768px)' :
            isTablet ? 'Tablet (768px - 1023px)' :
            isDesktop ? 'Desktop (1024px - 1279px)' :
            'Large Desktop (≥ 1280px)'
          }</p>
          <p><strong>Layout:</strong> {
            screenWidth >= 1024 ? 'Desktop Sidebar Layout' : 'Mobile/Tablet Layout'
          }</p>
          {screenWidth <= 360 && (
            <p className="text-orange-600 font-medium">⚠️ Very small screen detected</p>
          )}
        </div>
      </div>

      {/* Stats Cards - Responsive Grid with 360px optimization */}
      <div className={`grid gap-3 sm:gap-4 ${
        screenWidth <= 360 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }`}>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border-l-4 border-blue-400">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Tasks</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Scheduled</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border-l-4 border-purple-400">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Team</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow border-l-4 border-yellow-400">
          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Revenue</p>
              <p className="text-lg sm:text-xl font-semibold text-gray-900">$2.4k</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Table/Card Example with 360px optimization */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activities</h3>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Property A cleaning completed</td>
                  <td className="px-6 py-4 text-sm text-gray-500">2 hours ago</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">New booking received</td>
                  <td className="px-6 py-4 text-sm text-gray-500">4 hours ago</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">New</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Optimized for 360px */}
          <div className="lg:hidden space-y-3">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm pr-2 flex-1 min-w-0">
                  <span className="break-words">Property A cleaning completed</span>
                </h4>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex-shrink-0 whitespace-nowrap">
                  Completed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm pr-2 flex-1 min-w-0">
                  <span className="break-words">New booking received</span>
                </h4>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0 whitespace-nowrap">
                  New
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BSOSCoreResponsive() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isMobile, isTablet, isDesktop, screenWidth } = useMediaQuery();

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigationClick = (itemId: string) => {
    setActiveTab(itemId);
    toast.success(`Switched to ${itemId.charAt(0).toUpperCase() + itemId.slice(1)}`);
  };

  // Header content for mobile/tablet
  const headerContent = (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold">B.S.O.S. Core</h1>
        <p className="text-blue-100">Welcome back, {user?.name || 'User'}</p>
      </div>
      <div className="text-sm text-blue-100 space-y-1">
        <p>Screen: {screenWidth}px ({isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'})</p>
        <p>Active Tab: {activeTab}</p>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Management</h3>
            <p className="text-gray-600">Manage your cleaning schedules and appointments</p>
          </div>
        );
      case 'tasks':
        return (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">Track and manage your cleaning tasks</p>
          </div>
        );
      case 'photos':
        return (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Photo Gallery</h3>
            <p className="text-gray-600">Before/after photos and documentation</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-600">Generate and view cleaning reports</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Performance metrics and insights</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Configure your application preferences</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ResponsiveLayout
      navigationItems={navigationItems}
      activeItem={activeTab}
      onNavigationClick={handleNavigationClick}
      showHeader={isMobile || isTablet}
      headerContent={headerContent}
    >
      {renderContent()}
    </ResponsiveLayout>
  );
}
