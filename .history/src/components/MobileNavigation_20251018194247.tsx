/**
 * MobileNavigation Component
 * Mobile navigation drawer that opens from the left with Tailwind and React state
 * Features: Menu icon toggle, outside click to close, fixed sidebar on desktop
 */

'use client';

import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Users, Settings, BarChart3, Bell, DollarSign, LogOut } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/hooks/useNotifications';
import { getNavigationForRole, type NavigationItem } from '@/config/navigation';
import { useNavigation } from '@/hooks/useNavigation';
import toast from 'react-hot-toast';



interface MobileNavigationProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  items?: NavigationItem[];
  children?: React.ReactNode;
  user?: any;
}



export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeItem = 'dashboard',
  onItemClick,
  items,
  children,
  user,
}) => {
  const { isMobile, screenWidth } = useMediaQuery();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user: authUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { success, info } = useNotifications();
  const { navigate } = useNavigation();

  // Get navigation items based on user role
  const navigationItems = items || getNavigationForRole(authUser?.role || 'CLEANER');

  const handleItemClick = (itemId: string) => {
    navigate(itemId);
    onItemClick?.(itemId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/');
    info('Logout realizado com sucesso. Até logo! 👋');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <nav className="lg:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <h1 className="text-base font-semibold text-gray-900 truncate">B.S.O.S.</h1>
        </div>
        
        {/* Mobile User Avatar */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full">
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:text-red-700 rounded-full"
            title={t('auth.logout')}
          >
            <LogOut className="h-4 w-4" />
          </button>
          <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </nav>

      {/* Desktop Layout with Fixed Sidebar */}
      <div className="hidden lg:flex h-screen">
        {/* Desktop Sidebar - Fixed on left */}
        <nav className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">B.S.O.S.</h1>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item: NavigationItem) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Desktop User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Cleaning Professional'}</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t('auth.logout')}</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area - Desktop */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>

      {/* Mobile Slide-out Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop - Closes menu when tapped outside */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          />
          
          {/* Menu Panel - Opens from left */}
          <div className={`fixed inset-y-0 left-0 bg-white shadow-xl transform transition-transform ${
            screenWidth <= 360 ? 'w-full' : 'w-64'
          }`}>
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="px-3 py-4 space-y-1">
              {navigationItems.map((item: NavigationItem) => {
                const IconComponent = item.icon;
                const isActive = activeItem === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Mobile User Info */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
              <div className="p-3">
                <div className="flex items-center min-w-0 mb-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-gray-500 truncate capitalize">{user?.role || 'Cleaning Professional'}</p>
                  </div>
                </div>
                
                {/* Mobile Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Content */}
      <div className="lg:hidden">
        {children}
      </div>
    </div>
  );
};

export default MobileNavigation;