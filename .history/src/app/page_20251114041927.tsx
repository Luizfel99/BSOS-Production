'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';

export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false);

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!loading && user && isAuthenticated && !hasAttemptedRedirect) {
      console.log('✅ User authenticated, redirecting to dashboard');
      setHasAttemptedRedirect(true);
      
      // Determine role-based redirect path
      let redirectPath = '/dashboard';
      switch (user.role) {
        case 'cleaner':
          redirectPath = '/dashboard/cleaner';
          break;
        case 'supervisor':
          redirectPath = '/dashboard/supervisor';
          break;
        case 'manager':
          redirectPath = '/dashboard/manager';
          break;
        case 'owner':
          redirectPath = '/dashboard/owner';
          break;
        case 'client':
          redirectPath = '/dashboard/client';
          break;
        default:
          redirectPath = '/dashboard';
      }
      
      // Longer delay for page-level redirects (existing session restoration)
      const redirectDelay = setTimeout(() => {
        console.log('🚀 HomePage: Executing redirect to', redirectPath, 'for existing session');
        
        try {
          router.push(redirectPath);
          console.log('✅ HomePage: Router push initiated successfully to', redirectPath);
        } catch (error) {
          console.error('❌ HomePage: Router push failed:', error);
          window.location.href = redirectPath;
        }
      }, 500);
      
      // Cleanup redirect delay on unmount
      return () => clearTimeout(redirectDelay);
    }
  }, [user, isAuthenticated, loading, hasAttemptedRedirect, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and shouldAutoRedirect is true, show redirecting message
  if (user && isAuthenticated && shouldAutoRedirect) {
    return (
      <AuthLoadingScreen 
        message="Redirecionando"
        subMessage={`Bem-vindo de volta, ${user.name}! Levando você ao dashboard...`}
        showProgress={false}
      />
  }

  // Show login screen if not authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginScreen />
    </div>
  );
}