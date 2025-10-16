'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import I18nProvider from '@/components/I18nProvider';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';

// Dynamically import BSOS modules for better performance
const BSOSCoreResponsive = dynamic(() => import('@/components/bsos/BSOSCoreResponsive'), { ssr: false });
const BSOSManager = dynamic(() => import('@/components/bsos/BSOSManager'), { ssr: false });
const BSOSClient = dynamic(() => import('@/components/bsos/BSOSClient'), { ssr: false });
const BSOSFinance = dynamic(() => import('@/components/bsos/BSOSFinance'), { ssr: false });
const BSOSAnalytics = dynamic(() => import('@/components/bsos/BSOSAnalytics'), { ssr: false });
const BSOSLayout = dynamic(() => import('@/components/bsos/BSOSLayout'), { ssr: false });

function MainApp() {
  const { user, authChecked, isAuthenticated } = useAuth();
  const [currentModule, setCurrentModule] = useState<'core' | 'manager' | 'client' | 'finance' | 'analytics'>('core');

  // Auto-set module based on user role - only after authentication is complete
  React.useEffect(() => {
    if (authChecked && user && isAuthenticated && user.role) {
      const roleModuleMap: Record<string, 'core' | 'manager' | 'client' | 'finance' | 'analytics'> = {
        'cleaner': 'core',
        'supervisor': 'core',
        'manager': 'manager',
        'owner': 'analytics',
        'client': 'client'
      };
      
      // Validate that user role is in the map
      if (roleModuleMap[user.role]) {
        const defaultModule = roleModuleMap[user.role];
        setCurrentModule(defaultModule);
        console.log(`User authenticated: ${user.email} (${user.role}) - Loading ${defaultModule} module`);
      } else {
        console.error('Invalid user role detected:', user.role);
        // Could potentially logout user here if role is invalid
      }
    }
  }, [user, authChecked, isAuthenticated]);

  // Show loading screen while checking authentication
  if (!authChecked) {
    console.log('Authentication not checked yet, showing loading screen');
    return <AuthLoadingScreen message="Verificando autenticação..." subMessage="Aguarde enquanto verificamos sua sessão" />;
  }

  // Show login screen if user is not authenticated, session is invalid, or user lacks required role
  if (!user || !isAuthenticated || !user.role) {
    console.log('Authentication check completed - showing login screen', {
      hasUser: !!user,
      isAuthenticated,
      hasRole: !!(user?.role)
    });
    return <LoginScreen />;
  }

  // Additional validation: ensure user has required fields
  if (!user.email || !user.id) {
    console.log('User missing required fields, showing login screen');
    return <LoginScreen />;
  }

  console.log(`Rendering main app for authenticated user: ${user.email} (${user.role})`);

  const renderCurrentModule = () => {
    switch (currentModule) {
      case 'core':
        return <BSOSCoreResponsive />;
      case 'manager':
        return <BSOSManager />;
      case 'client':
        return <BSOSClient />;
      case 'finance':
        return <BSOSFinance />;
      case 'analytics':
        return <BSOSAnalytics />;
      default:
        return <BSOSCoreResponsive />;
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

export default function Home() {
  return (
    <I18nProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </I18nProvider>
  );
}