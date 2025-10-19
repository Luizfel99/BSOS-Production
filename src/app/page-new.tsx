'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BSOSLayout from '@/components/bsos/BSOSLayout';
import BSOSCore from '@/components/bsos/BSOSCore';
import BSOSManager from '@/components/bsos/BSOSManager';
import BSOSClient from '@/components/bsos/BSOSClient';
import BSOSFinance from '@/components/bsos/BSOSFinance';
import BSOSAnalytics from '@/components/bsos/BSOSAnalytics';

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the error from being logged to console as unhandled
    event.preventDefault();
  });
}

export default function Home() {
  const { t } = useTranslation();
  const [currentModule, setCurrentModule] = useState<'core' | 'manager' | 'client' | 'finance' | 'analytics'>('core');

  const renderCurrentModule = () => {
    switch (currentModule) {
      case 'core':
        return <BSOSCore />;
      case 'manager':
        return <BSOSManager />;
      case 'client':
        return <BSOSClient />;
      case 'finance':
        return <BSOSFinance />;
      case 'analytics':
        return <BSOSAnalytics />;
      default:
        return <BSOSCore />;
    }
  };

  return (
    <BSOSLayout 
      currentModule={currentModule} 
      onModuleChange={setCurrentModule}
    >
      {renderCurrentModule()}
    </BSOSLayout>
  );
}