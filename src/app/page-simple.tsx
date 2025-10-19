'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';

export default function HomePage() {
  const { user, authChecked, isAuthenticated } = useAuth();

  // Show loading while checking authentication
  if (!authChecked) {
    return <AuthLoadingScreen />;
  }

  // If user is authenticated, redirect to dashboard
  if (user && isAuthenticated) {
    // In a real app, you might want to use router.push('/dashboard')
    // For now, let's show a simple redirect message
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
          <script>
            {`window.location.href = '/dashboard';`}
          </script>
        </div>
      </div>
    );
  }

  // If not authenticated, show login screen
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginScreen />
    </div>
  );
}