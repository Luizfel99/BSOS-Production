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
      }, 1500); // Longer delay to ensure LoginScreen redirects take precedence
      
      // Cleanup redirect delay on unmount
      return () => clearTimeout(redirectDelay);
    } else if (authChecked && !isLoading && user && isAuthenticated && !shouldAutoRedirect) {
      console.log('👤 User authenticated but shouldAutoRedirect=false, showing login screen for fresh login');
    }
  }, [authChecked, user, isAuthenticated, isHydrated, isLoading, hasAttemptedRedirect, shouldAutoRedirect, router]);

  // Show different loading states based on the current phase
  if (!isHydrated) {
    return (
      <AuthLoadingScreen 
        message="Inicializando aplicação"
        subMessage="Preparando interface do usuário..."
        showProgress={true}
      />
    );
  }

  if (!authChecked || isLoading) {
    return (
      <AuthLoadingScreen 
        message="Verificando autenticação"
        subMessage="Validando dados de sessão armazenados..."
        showProgress={true}
      />
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
    );
  }

  // If not authenticated OR user is authenticated but shouldn't auto-redirect, show login screen
  console.log('🔓 Showing login screen - either not authenticated or fresh login intent');
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginScreen />
    </div>
  );
}