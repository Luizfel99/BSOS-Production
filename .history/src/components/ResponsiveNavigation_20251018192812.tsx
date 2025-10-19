/**
 * ResponsiveNavigation Component
 * Renders different navigation layouts based on screen width detection
 * Now supports wrapping children content for desktop layout
 */

'use client';

import React, { useState } from 'react';
import { Menu, X, Home, Calendar, Users, Settings, BarChart3, Bell, DollarSign } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getNavigationForRole, type NavigationItem } from '@/config/navigation';
import { useNavigation } from '@/hooks/useNavigation';

// NavigationItem interface now imported from config

interface ResponsiveNavigationProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  items?: NavigationItem[];
  children?: React.ReactNode;
  user?: any;
}

// Navigation items now imported from centralized config

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  activeItem = 'dashboard',
  onItemClick,
  items,
  children,
  user,
}) => {
  const { isMobile, isTablet, isDesktop, screenWidth } = useMediaQuery();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { navigate, userRole } = useNavigation();
  
  // Get navigation items based on user role
  const navigationItems = items || getNavigationForRole(user?.role || userRole);

  const handleItemClick = (itemId: string) => {
    const item = navigationItems.find((i: NavigationItem) => i.id === itemId);
    
    if (item?.href) {
      navigate(item.href, { showToast: false });
    } else {
      // Fallback toast for unimplemented features
      toast('Função em desenvolvimento 🧩', {
        icon: '🚧',
        duration: 3000,
        position: 'top-right',
      });
    }
    
    onItemClick?.(itemId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile Navigation (< 768px)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Top Bar - Optimized for 360px */}
        <nav className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between lg:hidden">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-target"
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
          
          {/* Mobile Actions - Compact for small screens */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full touch-target">
              <Bell className="h-4 w-4" />
            </button>
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </nav>

        {/* Mobile Slide-out Menu - Full width on very small screens */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop - Closes menu when tapped outside */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
              onTouchEnd={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            
            {/* Menu Panel - Responsive width */}
            <div className={`fixed inset-y-0 left-0 bg-white shadow-xl transform transition-transform ${
              screenWidth <= 360 ? 'w-full' : 'w-64'
            }`}>
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 touch-target"
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
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors touch-target ${
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
              
              {/* Mobile User Info - Compact for small screens */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
                <div className="flex items-center min-w-0">
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
              </div>
            </div>
          </div>
        )}

        {/* Mobile Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  // Tablet Navigation (768px - 1023px)
  if (isTablet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 mr-8">B.S.O.S.</h1>
                
                {/* Tablet Horizontal Menu */}
                <div className="flex space-x-1">
                  {items.slice(0, 4).map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeItem === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`flex flex-col items-center px-4 py-2 text-xs font-medium rounded-lg transition-colors touch-target ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mb-1" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Tablet Actions */}
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full touch-target">
                  <Bell className="h-6 w-6" />
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Tablet Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  // Desktop Navigation (1024px+) - Now supports children content
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed on left */}
      <nav className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">B.S.O.S.</h1>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {items.map((item) => {
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
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Cleaning Professional'}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveNavigation;