/**
 * BSOS SURGICAL MODE - useNavigation Hook
 * Functional navigation with role validation and toast fallbacks
 * 
 * Date: 2025-10-18
 * Purpose: Centralized navigation logic with error handling
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { hasRouteAccess } from '@/config/navigation';

export const useNavigation = () => {
  const router = useRouter();
  const { user } = useAuth();

  const navigate = (route: string, options?: { fallbackMessage?: string; showToast?: boolean }) => {
    const { fallbackMessage, showToast = true } = options || {};

    try {
      // Check if user has access to the route
      if (user?.role && !hasRouteAccess(route, user.role)) {
        if (showToast) {
          toast.error('Acesso negado para este módulo', {
            icon: '🔒',
            duration: 3000,
          });
        }
        return false;
      }

      // Attempt navigation
      router.push(route);
      
      if (showToast) {
        toast.success(`Navegando para ${route}`, {
          icon: '🧭',
          duration: 2000,
        });
      }

      return true;
    } catch (error) {
      console.error('Navigation error:', error);
      
      if (showToast) {
        const message = fallbackMessage || 'Função em desenvolvimento';
        toast(message, {
          icon: '🚧',
          duration: 3000,
          position: 'top-right',
        });
      }

      return false;
    }
  };

  const navigateWithFallback = (route?: string, fallbackMessage?: string) => {
    if (route) {
      return navigate(route, { fallbackMessage });
    } else {
      const message = fallbackMessage || 'Função em desenvolvimento 🧩';
      toast(message, {
        icon: '🚧',
        duration: 3000,
        position: 'top-right',
      });
      return false;
    }
  };

  return {
    navigate,
    navigateWithFallback,
    hasAccess: (route: string) => user?.role ? hasRouteAccess(route, user.role) : false,
    userRole: user?.role || 'GUEST',
  };
};

export default useNavigation;