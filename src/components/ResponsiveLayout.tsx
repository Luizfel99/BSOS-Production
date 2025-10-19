/**
 * ResponsiveLayout Component
 * Handles different layouts for mobile, tablet, and desktop
 */

'use client';

import React from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ResponsiveNavigation from '@/components/ResponsiveNavigation';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  navigationItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    onClick?: () => void;
  }>;
  activeItem: string;
  onNavigationClick: (itemId: string) => void;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  navigationItems,
  activeItem,
  onNavigationClick,
  showHeader = true,
  headerContent,
}) => {
  const { isMobile, isTablet, isDesktop, screenWidth } = useMediaQuery();
  const isDesktopOrLarger = screenWidth >= 1024;
  const isMobileOrTablet = screenWidth < 1024;

  // Desktop Layout with Sidebar
  if (isDesktopOrLarger) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ResponsiveNavigation
          activeItem={activeItem}
          onItemClick={onNavigationClick}
          items={navigationItems}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Mobile and Tablet Layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile/Tablet Navigation */}
      <ResponsiveNavigation
        activeItem={activeItem}
        onItemClick={onNavigationClick}
        items={navigationItems}
      />
      
      {/* Optional Header */}
      {showHeader && headerContent && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
            {headerContent}
          </div>
        </div>
      )}
      
      {/* Main Content - Optimized for very small screens */}
      <div className="px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 lg:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveLayout;