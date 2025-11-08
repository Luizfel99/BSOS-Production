'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';
import AuthLoadingScreen from '@/components/AuthLoadingScreen';

export default function HomePage() {
  const { user, authChecked, isHydrated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[HomePage] State:', { authChecked, isHydrated, hasUser: !!user, isLoading });
    
    // Only redirect if everything is ready and user exists
    if (isHydrated && authChecked && !isLoading && user && user.role) {
      const redirectPaths: Record<string, string> = {
        admin: '/dashboard/admin',
        manager: '/dashboard/manager',
        supervisor: '/dashboard/supervisor',
        cleaner: '/dashboard/cleaner',
        owner: '/dashboard/owner',
        client: '/dashboard/client',
      };
      const redirectPath = redirectPaths[user.role] || '/dashboard';
      console.log('[HomePage] Redirecting to', redirectPath);
      router.push(redirectPath);
    }
  }, [authChecked, isHydrated, isLoading, user, router]);

  // Show loading while checking auth
  if (!isHydrated || !authChecked || isLoading) {
    return (
      <AuthLoadingScreen 
        message="Carregando sistema de autenticação"
        subMessage="Inicializando componentes de segurança..."
        showProgress={true}
      />
    );
  }

  // Show login screen
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginScreen />
    </div>
  );
}