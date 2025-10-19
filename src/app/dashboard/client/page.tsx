'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RouteGuard from '@/components/RouteGuard';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to main dashboard with role context
    console.log('📍 ClientDashboard: Redirecting to main dashboard for client');
    router.replace('/dashboard');
  }, [router]);

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard do cliente...</p>
          <p className="text-sm text-gray-500">Bem-vindo, {user?.name}!</p>
        </div>
      </div>
    </RouteGuard>
  );
}