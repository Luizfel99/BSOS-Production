/**
 * Mobile Optimization Test Component
 * Specifically tests 360px width responsiveness and fixes overflow issues
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Menu, X, Home, Calendar, CheckCircle, Settings, Bell, Camera } from 'lucide-react';

const MobileTest = () => {
  const { screenWidth, isMobile } = useMediaQuery();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Very small mobile detection (360px and below)
  const isVerySmall = screenWidth <= 360;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Optimized for 360px */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-3">
          {/* Left section */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 touch-target"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className={`font-semibold text-gray-900 truncate ${isVerySmall ? 'text-sm' : 'text-base'}`}>
              B.S.O.S.
            </h1>
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full touch-target">
              <Bell className="h-4 w-4" />
            </button>
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 bg-white shadow-xl transform transition-transform w-full max-w-xs">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              {[
                { icon: Home, label: 'Dashboard' },
                { icon: Calendar, label: 'Schedule' },
                { icon: CheckCircle, label: 'Tasks' },
                { icon: Camera, label: 'Photos' },
                { icon: Settings, label: 'Settings' },
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center p-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg touch-target"
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-3 space-y-4">
        {/* Screen Width Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className={`font-semibold text-blue-900 mb-2 ${isVerySmall ? 'text-sm' : 'text-base'}`}>
            📱 Mobile Test ({screenWidth}px)
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Width:</strong> {screenWidth}px</p>
            <p><strong>Very Small:</strong> {isVerySmall ? 'Yes (≤360px)' : 'No'}</p>
            <p><strong>Status:</strong> {screenWidth < 360 ? '⚠️ Optimize needed' : '✅ Good'}</p>
          </div>
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg shadow border-l-4 border-blue-400">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Tasks</p>
                <p className={`font-semibold text-gray-900 ${isVerySmall ? 'text-lg' : 'text-xl'}`}>24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow border-l-4 border-green-400">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
                <Calendar className="h-4 w-4 text-green-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-600 truncate">Done</p>
                <p className={`font-semibold text-gray-900 ${isVerySmall ? 'text-lg' : 'text-xl'}`}>12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Recent Activities</h4>
          
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow border p-3">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-900 text-sm pr-2 flex-1 min-w-0">
                  <span className="truncate block">Property {item} cleaning completed</span>
                </h5>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex-shrink-0 whitespace-nowrap">
                  Done
                </span>
              </div>
              <p className="text-xs text-gray-500">{item * 2} hours ago</p>
            </div>
          ))}
        </div>

        {/* Touch-Optimized Action Buttons */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Quick Actions</h4>
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg font-medium touch-target hover:bg-blue-700 transition-colors">
              📷 Take Photo
            </button>
            <button className="w-full bg-green-600 text-white py-4 px-4 rounded-lg font-medium touch-target hover:bg-green-700 transition-colors">
              ✅ Complete Task
            </button>
            <button className="w-full bg-orange-600 text-white py-4 px-4 rounded-lg font-medium touch-target hover:bg-orange-700 transition-colors">
              📋 View Checklist
            </button>
          </div>
        </div>

        {/* Test for Text Overflow */}
        <div className="bg-white rounded-lg shadow p-3">
          <h4 className="font-semibold text-gray-900 mb-2">Text Overflow Test</h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 break-words">
              This is a very long text that should wrap properly on small screens and not cause horizontal scrolling or overflow issues in the mobile layout at 360px width.
            </p>
            <div className="bg-gray-100 p-2 rounded">
              <code className="text-xs break-all">
                https://very-long-url-that-should-break-properly.com/api/v1/endpoint
              </code>
            </div>
          </div>
        </div>

        {/* Spacing Test for Very Small Screens */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h5 className="font-medium text-yellow-800 mb-1">360px Width Test</h5>
          <p className="text-xs text-yellow-700">
            {isVerySmall 
              ? '⚠️ Very small screen detected - using compact layout' 
              : '✅ Standard mobile layout'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileTest;