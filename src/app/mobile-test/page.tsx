'use client';

import React from 'react';
import MobileTest from '@/components/MobileTest';
import { BSOSProvider } from '@/contexts/BSOSContext';
import I18nProvider from '@/components/I18nProvider';
import { Toaster } from 'react-hot-toast';

export default function MobileTestPage() {
  return (
    <I18nProvider>
      <BSOSProvider>
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

          {/* Mobile test component */}
          <MobileTest />
        </BSOSProvider>
    </I18nProvider>
  );
}