'use client';

import React, { useState } from 'react';
import BSOSCoreResponsive from '@/components/bsos/BSOSCoreResponsive';
import NotificationDemo from '@/components/NotificationDemo';
import { BSOSProvider } from '@/contexts/BSOSContext';
import I18nProvider from '@/components/I18nProvider';
import { Toaster } from 'react-hot-toast';

/**
 * Demo page showcasing responsive design capabilities and notifications
 * This page demonstrates:
 * - Screen width detection using useMediaQuery hook
 * - Responsive navigation (mobile drawer, tablet horizontal, desktop sidebar)
 * - Adaptive layouts based on screen size
 * - Mobile-first responsive components
 * - Toast notifications system
 */
export default function ResponsiveDemo() {
  const [activeDemo, setActiveDemo] = useState<'responsive' | 'notifications'>('responsive');

  return (
    <I18nProvider>
      <BSOSProvider>
        <div className="min-h-screen bg-gray-50">
            {/* Header with instructions */}
            <div className="bg-blue-600 text-white p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-xl lg:text-2xl font-bold mb-2">
                  🎯 B.S.O.S. Demo Center
                </h1>
                
                {/* Demo Selector */}
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setActiveDemo('responsive')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeDemo === 'responsive'
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                  >
                    📱 Responsive Design
                  </button>
                  <button
                    onClick={() => setActiveDemo('notifications')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeDemo === 'notifications'
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                  >
                    🔔 Toast Notifications
                  </button>
                </div>
                
                {activeDemo === 'responsive' ? (
                  <div>
                    <p className="text-blue-100 text-sm lg:text-base">
                      Resize your browser window to see responsive layout changes:
                    </p>
                    <ul className="text-blue-100 text-sm mt-2 space-y-1">
                      <li>📱 <strong>Mobile (&lt; 768px):</strong> Slide-out navigation drawer</li>
                      <li>📟 <strong>Tablet (768px - 1023px):</strong> Horizontal navigation bar</li>
                      <li>🖥️ <strong>Desktop (≥ 1024px):</strong> Fixed sidebar navigation</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="text-blue-100 text-sm lg:text-base">
                      Demonstração do sistema de notificações toast com diferentes tipos e estilos:
                    </p>
                    <ul className="text-blue-100 text-sm mt-2 space-y-1">
                      <li>✅ <strong>Success:</strong> Operações bem-sucedidas (verde)</li>
                      <li>❌ <strong>Error:</strong> Erros e falhas (vermelho)</li>
                      <li>⚠️ <strong>Warning:</strong> Avisos importantes (amarelo)</li>
                      <li>💡 <strong>Info:</strong> Informações gerais (azul)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Toast notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            {/* Main content */}
            {activeDemo === 'responsive' ? (
              <BSOSCoreResponsive />
            ) : (
              <div className="max-w-7xl mx-auto p-4 lg:p-6">
                <NotificationDemo />
              </div>
            )}
          </div>
        </BSOSProvider>
    </I18nProvider>
  );
}