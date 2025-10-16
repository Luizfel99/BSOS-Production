/**
 * Action Button Helper - Defensive Utilities
 * Provides safe action button utilities with proper user state checks
 */

import { useAuth } from '@/contexts/AuthContext';
import { Module, Action } from '@/utils/rbac';

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  requiredPermission?: { module: Module; action: Action };
  allowedRoles?: string[];
  fallbackDisabled?: boolean; // If true, shows disabled button instead of hiding
  title?: string; // Tooltip text
}

/**
 * Safe Action Button Component
 * Automatically handles user authentication and permission checks
 */
export const SafeActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  requiredPermission,
  allowedRoles,
  fallbackDisabled = false,
  title,
}) => {
  const { user, isAuthenticated, hasPermission: checkPermission } = useAuth();

  // If no user is authenticated, hide or disable button
  if (!user || !isAuthenticated) {
    if (fallbackDisabled) {
      return (
        <button
          disabled={true}
          className={`${className} opacity-50 cursor-not-allowed`}
          title="Autenticação necessária"
        >
          {children}
        </button>
      );
    }
    return null;
  }

  // Check permission requirements
  if (requiredPermission) {
    const hasRequiredPermission = checkPermission(
      requiredPermission.module,
      requiredPermission.action
    );
    
    if (!hasRequiredPermission) {
      if (fallbackDisabled) {
        return (
          <button
            disabled={true}
            className={`${className} opacity-50 cursor-not-allowed`}
            title="Permissão insuficiente"
          >
            {children}
          </button>
        );
      }
      return null;
    }
  }

  // Check role requirements
  if (allowedRoles && user.role) {
    const hasAllowedRole = allowedRoles.includes(user.role);
    
    if (!hasAllowedRole) {
      if (fallbackDisabled) {
        return (
          <button
            disabled={true}
            className={`${className} opacity-50 cursor-not-allowed`}
            title="Perfil não autorizado"
          >
            {children}
          </button>
        );
      }
      return null;
    }
  }

  // Safe onClick handler with defensive checks
  const handleClick = () => {
    // Additional safety check before executing action
    if (!user || !isAuthenticated) {
      console.warn('Action blocked: User not authenticated');
      return;
    }
    
    // Execute the action
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
      title={title}
    >
      {children}
    </button>
  );
};

/**
 * Hook for safe action handling
 * Provides utilities for creating safe action handlers
 */
export const useSafeActions = () => {
  const { user, isAuthenticated, hasPermission } = useAuth();

  const createSafeAction = (
    action: () => void,
    requirements?: {
      requiredPermission?: { module: Module; action: Action };
      allowedRoles?: string[];
    }
  ) => {
    return () => {
      // Check authentication
      if (!user || !isAuthenticated) {
        console.warn('Action blocked: User not authenticated');
        return;
      }

      // Check permission requirements
      if (requirements?.requiredPermission) {
        const hasRequiredPermission = hasPermission(
          requirements.requiredPermission.module,
          requirements.requiredPermission.action
        );
        
        if (!hasRequiredPermission) {
          console.warn('Action blocked: Insufficient permissions');
          return;
        }
      }

      // Check role requirements
      if (requirements?.allowedRoles && user.role) {
        const hasAllowedRole = requirements.allowedRoles.includes(user.role);
        
        if (!hasAllowedRole) {
          console.warn('Action blocked: Role not authorized');
          return;
        }
      }

      // Execute the action safely
      try {
        action();
      } catch (error) {
        console.error('Action execution error:', error);
      }
    };
  };

  const isActionAllowed = (requirements?: {
    requiredPermission?: { module: Module; action: Action };
    allowedRoles?: string[];
  }): boolean => {
    // Check authentication
    if (!user || !isAuthenticated) {
      return false;
    }

    // Check permission requirements
    if (requirements?.requiredPermission) {
      const hasRequiredPermission = hasPermission(
        requirements.requiredPermission.module,
        requirements.requiredPermission.action
      );
      
      if (!hasRequiredPermission) {
        return false;
      }
    }

    // Check role requirements
    if (requirements?.allowedRoles && user.role) {
      const hasAllowedRole = requirements.allowedRoles.includes(user.role);
      
      if (!hasAllowedRole) {
        return false;
      }
    }

    return true;
  };

  return {
    createSafeAction,
    isActionAllowed,
    user: user || null,
    isAuthenticated,
    userRole: user?.role || null,
  };
};

/**
 * Safe wrapper for any action that requires user authentication
 */
export const withUserCheck = <T extends any[]>(
  action: (...args: T) => void
) => {
  return (...args: T) => {
    const { user, isAuthenticated } = useAuth();
    
    if (!user || !isAuthenticated) {
      console.warn('Action blocked: User not authenticated');
      return;
    }
    
    action(...args);
  };
};