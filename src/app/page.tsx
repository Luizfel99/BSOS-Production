'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginScreen from '@/components/LoginScreen';

export default function HomePage() {
  const { user, authChecked, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if everything is ready and user exists
    if (isHydrated && authChecked && user && user.role) {
      const redirectPaths: Record<string, string> = {
        admin: '/dashboard/admin',
        manager: '/dashboard/manager',
        supervisor: '/dashboard/supervisor',
        cleaner: '/dashboard/cleaner',
        owner: '/dashboard/owner',
        client: '/dashboard/client',
      };
      const redirectPath = redirectPaths[user.role] || '/dashboard';
      console.log('[HomePage] Auto-redirect authenticated user to', redirectPath);
      router.push(redirectPath);
    }
  }, [authChecked, isHydrated, user, router]);

  // Always show login screen immediately - no loading state
  return (
    <div className="min-h-screen bg-gray-50">
      <LoginScreen />
    </div>
  );
}