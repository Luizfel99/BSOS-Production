/**
 * Route Protection and Access Control System
 * Provides comprehensive route-level RBAC implementation
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessRoute, hasPermission, Module, Action } from '@/utils/rbac';
import { Shield, Lock, AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface RouteProtectionConfig {
  path: string;
  allowedRoles?: string[];
  requiredPermission?: {
    module: Module;
    action: Action;
  };
  feature?: string;
  redirectTo?: string;
  showNoAccess?: boolean;
}

// Define protected routes and their access requirements
export const PROTECTED_ROUTES: RouteProtectionConfig[] = [
  // Dashboard routes
  {
    path: '/dashboard',
    allowedRoles: ['cleaner', 'supervisor', 'manager', 'owner', 'client']
  },
  
  // Task management routes
  {
    path: '/tasks',
    allowedRoles: ['cleaner', 'supervisor', 'manager', 'owner'],
    requiredPermission: { module: 'tasks', action: 'view' }
  },
  {
    path: '/tasks/create',
    allowedRoles: ['supervisor', 'manager', 'owner'],
    requiredPermission: { module: 'tasks', action: 'create' }
  },
  {
    path: '/tasks/manage',
    allowedRoles: ['supervisor', 'manager', 'owner'],
    requiredPermission: { module: 'tasks', action: 'update' }
  },
  
  // Team management routes
  {
    path: '/team',
    allowedRoles: ['supervisor', 'manager', 'owner'],
    requiredPermission: { module: 'employees', action: 'view' }
  },
  {
    path: '/team/manage',
    allowedRoles: ['manager', 'owner'],
    requiredPermission: { module: 'employees', action: 'manage_users' }
  },
  
  // Property management routes
  {
    path: '/properties',
    allowedRoles: ['manager', 'owner', 'client'],
    requiredPermission: { module: 'properties', action: 'view' }
  },
  {
    path: '/properties/create',
    allowedRoles: ['manager', 'owner'],
    requiredPermission: { module: 'properties', action: 'create' }
  },
  
  // Reporting routes
  {
    path: '/reports',
    allowedRoles: ['supervisor', 'manager', 'owner', 'client'],
    requiredPermission: { module: 'reports', action: 'view' }
  },
  {
    path: '/reports/export',
    allowedRoles: ['manager', 'owner'],
    requiredPermission: { module: 'reports', action: 'export' }
  },
  
  // Analytics routes
  {
    path: '/analytics',
    allowedRoles: ['supervisor', 'manager', 'owner'],
    requiredPermission: { module: 'analytics', action: 'access_analytics' }
  },
  
  // Finance routes
  {
    path: '/finance',
    allowedRoles: ['manager', 'owner'],
    requiredPermission: { module: 'finance', action: 'view_finance' }
  },
  {
    path: '/finance/payments',
    allowedRoles: ['manager', 'owner'],
    requiredPermission: { module: 'payments', action: 'approve_payment' }
  },
  
  // Settings and administration
  {
    path: '/settings',
    allowedRoles: ['owner'],
    requiredPermission: { module: 'settings', action: 'configure' }
  },
  {
    path: '/admin',
    allowedRoles: ['owner'],
    requiredPermission: { module: 'users', action: 'manage_users' }
  },
  
  // Integration routes
  {
    path: '/integrations',
    allowedRoles: ['manager', 'owner'],
    requiredPermission: { module: 'integrations', action: 'view' }
  },
  
  // Client portal routes
  {
    path: '/client',
    allowedRoles: ['client', 'owner'],
    feature: 'client-portal'
  }
];

interface AccessDeniedPageProps {
  userRole?: string;
  requiredRoles?: string[];
  currentPath?: string;
  reason?: string;
}

const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  userRole,
  requiredRoles,
  currentPath,
  reason = 'Você não tem permissão para acessar esta página'
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            {reason}
          </p>
          
          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
            <div className="space-y-2">
              {userRole && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Seu perfil:</span>
                  <span className="font-medium text-gray-900 capitalize">{userRole}</span>
                </div>
              )}
              {requiredRoles && requiredRoles.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Perfis permitidos:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {requiredRoles.join(', ')}
                  </span>
                </div>
              )}
              {currentPath && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Página solicitada:</span>
                  <span className="font-medium text-gray-900">{currentPath}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Ir para Dashboard
            </button>
            
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
          </div>
          
          {/* Help */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5 mr-2" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Precisa de acesso?</p>
                <p>Entre em contato com seu supervisor ou administrador do sistema para solicitar as permissões necessárias.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Route Guard Hook
export const useRouteGuard = () => {
  const { user, authChecked, isAuthenticated, isLoading, isHydrated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessDeniedInfo, setAccessDeniedInfo] = useState<{
    reason: string;
    requiredRoles?: string[];
  } | null>(null);

  useEffect(() => {
    const checkRouteAccess = () => {
      // Wait for hydration first
      if (!isHydrated) {
        setIsChecking(true);
        return;
      }
      
      // Wait for authentication to be checked and not loading
      if (!authChecked || isLoading) {
        setIsChecking(true);
        return;
      }

      // If user is not authenticated, redirect to login with small delay
      if (!user || !isAuthenticated) {
        setTimeout(() => {
          router.push('/login');
        }, 100);
        return;
      }

      // Find route configuration
      const routeConfig = PROTECTED_ROUTES.find(route => {
        // Exact match or pattern match
        return pathname === route.path || 
               pathname.startsWith(route.path + '/') ||
               (route.path.includes('*') && new RegExp(route.path.replace('*', '.*')).test(pathname));
      });

      // If no specific route config, allow access (public route)
      if (!routeConfig) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      let access = true;
      let deniedReason = '';
      let requiredRoles: string[] = [];

      // Check role-based access
      if (routeConfig.allowedRoles) {
        if (!user?.role || !routeConfig.allowedRoles.includes(user.role)) {
          access = false;
          deniedReason = `Esta página requer um dos seguintes perfis: ${routeConfig.allowedRoles.join(', ')}`;
          requiredRoles = routeConfig.allowedRoles;
        }
      }

      // Check permission-based access
      if (access && routeConfig.requiredPermission) {
        const { module, action } = routeConfig.requiredPermission;
        if (!hasPermission(user, module, action)) {
          access = false;
          deniedReason = `Você não tem permissão para realizar a ação '${action}' no módulo '${module}'`;
        }
      }

      // Check feature-based access
      if (access && routeConfig.feature) {
        // This would integrate with the feature access system
        // For now, we'll assume feature access is handled by role
      }

      if (access) {
        setHasAccess(true);
        setAccessDeniedInfo(null);
      } else {
        setHasAccess(false);
        setAccessDeniedInfo({
          reason: deniedReason,
          requiredRoles
        });

        // If redirect is specified, redirect instead of showing access denied
        if (routeConfig.redirectTo) {
          router.push(routeConfig.redirectTo);
          return;
        }
      }

      setIsChecking(false);
    };

    checkRouteAccess();
  }, [pathname, user, authChecked, isAuthenticated, isLoading, isHydrated, router]);

  return {
    isChecking,
    hasAccess,
    accessDeniedInfo,
    userRole: user?.role
  };
};

// Route Guard Component
export const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isChecking, hasAccess, accessDeniedInfo, userRole } = useRouteGuard();
  const pathname = usePathname();

  // Show loading while checking access
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no access
  if (!hasAccess && accessDeniedInfo) {
    return (
      <AccessDeniedPage
        userRole={userRole}
        requiredRoles={accessDeniedInfo.requiredRoles}
        currentPath={pathname}
        reason={accessDeniedInfo.reason}
      />
    );
  }

  // Render children if access is granted
  return <>{children}</>;
};

export default RouteGuard;