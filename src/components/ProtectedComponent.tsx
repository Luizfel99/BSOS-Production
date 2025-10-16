/**
 * Protected Component - RBAC wrapper for conditional rendering
 * Only renders children if user has required permissions
 */

'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, canAccessFeature, canAccessRoute, Module, Action } from '@/utils/rbac';
import { AlertTriangle, Lock, ShieldX } from 'lucide-react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  
  // Permission-based access
  module?: Module;
  action?: Action;
  
  // Feature-based access
  feature?: string;
  
  // Route-based access
  route?: string;
  
  // Role-based access
  allowedRoles?: string[];
  
  // Fallback content
  fallback?: React.ReactNode;
  showNoAccess?: boolean;
  noAccessMessage?: string;
  
  // Alternative: redirect instead of showing fallback
  redirectTo?: string;
  
  // Loading state
  loading?: boolean;
}

const NoAccessMessage: React.FC<{
  message?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}> = ({ 
  message = 'Você não tem permissão para acessar este recurso',
  variant = 'default'
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center text-gray-500 text-sm py-2">
        <Lock className="h-4 w-4 mr-2" />
        <span>Acesso restrito</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <ShieldX className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="text-sm text-gray-500">
          <p>Entre em contato com seu supervisor se você acredita que deveria ter acesso a este recurso.</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Acesso Restrito
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  module,
  action,
  feature,
  route,
  allowedRoles,
  fallback,
  showNoAccess = true,
  noAccessMessage,
  redirectTo,
  loading = false
}) => {
  const { user, authChecked, isAuthenticated, isHydrated } = useAuth();

  // Prevent hydration mismatches by not rendering until hydrated
  if (!isHydrated) {
    return null;
  }

  // Show loading state while authentication is being checked
  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Verificando permissões...</span>
      </div>
    );
  }

  // If user is not authenticated or session is invalid
  if (!user || !isAuthenticated) {
    if (showNoAccess) {
      return <NoAccessMessage message="É necessário estar logado para acessar este recurso" />;
    }
    return fallback || null;
  }

  // Check permissions based on provided criteria
  let hasAccess = true;

  // Module + Action permission check
  if (module && action) {
    hasAccess = hasPermission(user, module, action);
  }
  
  // Feature-based access check
  else if (feature) {
    hasAccess = canAccessFeature(user, feature);
  }
  
  // Route-based access check
  else if (route) {
    hasAccess = canAccessRoute(user, route);
  }
  
  // Role-based access check
  else if (allowedRoles) {
    hasAccess = user?.role ? allowedRoles.includes(user.role) : false;
  }

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no access and redirect is specified
  if (redirectTo && typeof window !== 'undefined') {
    window.location.href = redirectTo;
    return null;
  }

  // If no access, show fallback or no access message
  if (fallback) {
    // Handle special fallback values
    if (fallback === "none") {
      return null;
    }
    if (fallback === "minimal") {
      return <NoAccessMessage variant="minimal" />;
    }
    return <>{fallback}</>;
  }

  if (showNoAccess) {
    return <NoAccessMessage message={noAccessMessage} />;
  }

  // Don't render anything if no access and no fallback
  return null;
};

// Hook for checking permissions in components
export const usePermissions = () => {
  const { user, authChecked, isAuthenticated, isHydrated } = useAuth();

  const checkPermission = (module: Module, action: Action): boolean => {
    if (!isHydrated || !user || !isAuthenticated) return false;
    return hasPermission(user, module, action);
  };

  const checkFeature = (feature: string): boolean => {
    if (!isHydrated || !user || !isAuthenticated) return false;
    return canAccessFeature(user, feature);
  };

  const checkRoute = (route: string): boolean => {
    if (!isHydrated || !user || !isAuthenticated) return false;
    return canAccessRoute(user, route);
  };

  const checkRole = (allowedRoles: string[]): boolean => {
    if (!isHydrated || !user || !isAuthenticated) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    user,
    authChecked,
    isAuthenticated,
    isHydrated,
    hasPermission: checkPermission,
    canAccessFeature: checkFeature,
    canAccessRoute: checkRoute,
    hasRole: checkRole,
    userRole: user?.role || null
  };
};

// Higher-order component for protecting entire pages
export const withRoleProtection = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    allowedRoles?: string[];
    feature?: string;
    module?: Module;
    action?: Action;
    fallback?: React.ReactNode;
    redirectTo?: string;
  }
) => {
  return function ProtectedPage(props: P) {
    return (
      <ProtectedComponent
        allowedRoles={options.allowedRoles}
        feature={options.feature}
        module={options.module}
        action={options.action}
        fallback={options.fallback}
        redirectTo={options.redirectTo}
        showNoAccess={true}
      >
        <Component {...props} />
      </ProtectedComponent>
    );
  };
};

export default ProtectedComponent;