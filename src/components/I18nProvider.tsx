/**
 * I18n Provider Component
 * Wraps the application to provide internationalization context
 */

'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    // Only run on client-side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      // Always initialize with English first to ensure consistency
      i18n.changeLanguage('en').then(() => {
        // Then check for saved preference
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && ['en', 'pt', 'es'].includes(savedLanguage) && savedLanguage !== 'en') {
          // Only change if it's not already English
          i18n.changeLanguage(savedLanguage);
        }
      });
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}