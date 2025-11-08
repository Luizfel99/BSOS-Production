'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  hasPermission as checkPermission, 
  canAccessFeature, 
  canAccessRoute,
  getAccessibleNavigation,
  getRoleDashboardConfig,
  filterMenuByPermissions,
  getUserCapabilityLevel,
  shouldShowAdvancedFeatures,
  getRoleBasedHelp,
  ROLE_PERMISSIONS,
  Module,
  Action
} from '@/utils/rbac';

export type UserRole = 'cleaner' | 'supervisor' | 'manager' | 'owner' | 'client' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
  company?: string;
  phone?: string;
}

export interface Permission {
  module: string;
  actions: string[];
}

interface AuthContextType {
  // Core authentication state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authChecked: boolean;
  isHydrated: boolean; // Prevents hydration mismatches
  shouldAutoRedirect: boolean; // Prevents unwanted redirects on login page
  
  // Authentication actions
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void; // For demo purposes
  
  // Permission utilities
  hasPermission: (module: string, action: string) => boolean;
  canAccessFeature: (feature: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  getAccessibleNavigation: () => string[];
  getDashboardConfig: () => any;
  filterMenuByPermissions: (menuItems: any[]) => any[];
  getUserCapabilityLevel: () => 'basic' | 'intermediate' | 'advanced' | 'admin';
  shouldShowAdvancedFeatures: () => boolean;
  getRoleBasedHelp: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration with RBAC permissions
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@cleaner.com',
    role: 'cleaner',
    avatar: '🧹',
    permissions: ROLE_PERMISSIONS.cleaner
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@supervisor.com',
    role: 'supervisor',
    avatar: '👩‍💼',
    permissions: ROLE_PERMISSIONS.supervisor
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@manager.com',
    role: 'manager',
    avatar: '🧑‍💻',
    permissions: ROLE_PERMISSIONS.manager
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    email: 'pedro@owner.com',
    role: 'owner',
    avatar: '🧑‍🎓',
    permissions: ROLE_PERMISSIONS.owner
  },
  {
    id: '5',
    name: 'Carlos Mendes',
    email: 'carlos@client.com',
    role: 'client',
    avatar: '🏠',
    permissions: ROLE_PERMISSIONS.client
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial session check
  const [authChecked, setAuthChecked] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldAutoRedirect, setShouldAutoRedirect] = useState(false);
  
  // Derived state
  const isAuthenticated = !!user;

  // Session configuration
  const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const STORAGE_KEYS = {
    USER: 'bsos-user',
    TIMESTAMP: 'bsos-session-timestamp',
    ROLE: 'bsos-selected-role'
  };

  // Hydration effect - runs first to prevent mismatches
  useEffect(() => {
    setIsHydrated(true);
    console.log('[BSOS-Auth] Client hydrated');
  }, []);

  // Simplified session restoration - no loading screen
  useEffect(() => {
    if (!isHydrated) return;

    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedTimestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);

    console.log('[BSOS-Auth] Checking session:', { hasUser: !!savedUser, hasTimestamp: !!savedTimestamp });

    if (savedUser && savedTimestamp) {
      try {
        // Check session expiry
        const sessionAge = Date.now() - parseInt(savedTimestamp);
        const isExpired = sessionAge > SESSION_TIMEOUT;

        if (isExpired) {
          console.log('[BSOS-Auth] Session expired, clearing');
          clearSession();
        } else {
          // Restore session
          const parsed = JSON.parse(savedUser);
          
          // Normalize role
          const normalizedRole = String(parsed.role || '').toLowerCase();
          parsed.role = normalizedRole;
          
          // Ensure permissions
          if (!Array.isArray(parsed.permissions) || parsed.permissions.length === 0) {
            parsed.permissions = ROLE_PERMISSIONS[normalizedRole as keyof typeof ROLE_PERMISSIONS] || [];
          }

          console.log('[BSOS-Auth] Session restored:', { email: parsed.email, role: parsed.role });
          setUser(parsed);
        }
      } catch (err) {
        console.error('[BSOS-Auth] Session restore failed:', err);
        clearSession();
      }
    }

    setAuthChecked(true);
    setIsLoading(false);
  }, [isHydrated]);

  // Helper function to set cookies for middleware
  const setCookies = (userData: User) => {
    if (typeof document === 'undefined') return;
    
    const maxAge = 604800; // 7 days
    const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
    const timestamp = Date.now().toString();
    
    // Set all required cookies for middleware
    document.cookie = `bsos-selected-role=${userData.role}; path=/; max-age=${maxAge}; SameSite=Lax; ${secureFlag}`;
    document.cookie = `bsos-user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${maxAge}; SameSite=Lax; ${secureFlag}`;
    document.cookie = `auth-token=${userData.id}-${timestamp}; path=/; max-age=${maxAge}; SameSite=Lax; ${secureFlag}`;
  };

  // Helper function to clear cookies
  const clearCookies = () => {
    if (typeof document === 'undefined') return;
    
    const expireDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `bsos-selected-role=; path=/; expires=${expireDate}`;
    document.cookie = `bsos-user=; path=/; expires=${expireDate}`;
    document.cookie = `auth-token=; path=/; expires=${expireDate}`;
  };

  // Helper function to save session to localStorage
  const saveSession = (userData: User) => {
    try {
      const timestamp = Date.now().toString();
      console.log('[BSOS-Auth] Saving session', { email: userData.email, role: userData.role, timestamp });
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.TIMESTAMP, timestamp);
      localStorage.setItem(STORAGE_KEYS.ROLE, userData.role);
      setCookies(userData);
    } catch (error) {
      console.error('[BSOS-Auth] Failed to save session:', error);
    }
  };

  // Helper function to clear session
  const clearSession = () => {
    try {
      console.log('[BSOS-Auth] Clearing session');
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TIMESTAMP);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem('auth-token');
      clearCookies();
    } catch (error) {
      console.warn('[BSOS-Auth] Failed to clear session:', error);
    }
  };

  // Login function with demo fallback
  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    console.info('[BSOS-Auth] Login attempt:', { email, role: role || 'auto-detect' });

    try {
      setIsLoading(true);

      // Try real API first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        console.info('[BSOS-Auth] API login successful:', { email: data.user.email, role: data.user.role });

        // Save token to localStorage
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
        }

        // Normalize role to lowercase
        const roleLower = String(data.user.role || '').toLowerCase();

        // Create user object from API response
        const apiUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: roleLower as UserRole,
          phone: data.user.phone,
          avatar: data.user.avatar,
          permissions: ROLE_PERMISSIONS[roleLower as keyof typeof ROLE_PERMISSIONS] || []
        };

        setUser(apiUser);
        saveSession(apiUser);
        setAuthChecked(true);

        console.info('[BSOS-Auth] Login completed for', apiUser.email, 'role:', apiUser.role);
        
        // Auto-redirect to dashboard after successful login
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            const dashboardPaths: Record<string, string> = {
              admin: '/dashboard/admin',
              manager: '/dashboard/manager',
              supervisor: '/dashboard/supervisor',
              cleaner: '/dashboard/cleaner',
              owner: '/dashboard/owner',
              client: '/dashboard/client',
            };
            const redirectPath = dashboardPaths[apiUser.role] || '/dashboard';
            console.info('[BSOS-Auth] Redirecting to:', redirectPath);
            window.location.href = redirectPath;
          }, 100);
        }
        
        return true;
      } else {
        console.error('[BSOS-Auth] API login failed:', data.error || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('[BSOS-Auth] Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function with redirect
  const logout = () => {
    console.info('[BSOS-Auth] Logout initiated');
    
    try {
      console.info('[BSOS-Auth] Clearing user state and session data');
      
      // Clear user state
      setUser(null);
      setAuthChecked(false);
      
      // Clear all stored data
      clearSession();
      
      console.info('[BSOS-Auth] User logged out successfully');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.warn('[BSOS-Auth] Logout error:', error);
    }
  };

  // Switch user function (for demo) - with state stability delay
  const switchUser = async (userId: string) => {
    console.log('🔄 Switch user initiated for ID:', userId);
    
    try {
      setIsLoading(true);
      
      const foundUser = mockUsers.find(user => user.id === userId);
      
      if (foundUser) {
        console.log('👤 Switching to user:', {
          id: foundUser.id,
          email: foundUser.email,
          role: foundUser.role
        });
        
        setUser(foundUser);
        saveSession(foundUser);
        setAuthChecked(true);
        
        // Add a small delay to ensure state has propagated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('✅ User switch completed successfully');
      } else {
        console.error('❌ User not found for switch:', userId);
      }
    } catch (error) {
      console.error('💥 Switch user error:', error);
    } finally {
      setIsLoading(false);
      console.log('🏁 Switch user process complete');
    }
  };

  // Permission utility functions (hydration-safe)
  const hasPermission = (module: string, action: string): boolean => {
    if (!isHydrated || !user) return false;
    return checkPermission(user, module as Module, action as Action);
  };

  const canUserAccessFeature = (feature: string): boolean => {
    if (!isHydrated || !user) return false;
    return canAccessFeature(user, feature);
  };

  const canUserAccessRoute = (route: string): boolean => {
    if (!isHydrated || !user) return false;
    return canAccessRoute(user, route);
  };

  const getUserAccessibleNavigation = (): string[] => {
    return getAccessibleNavigation(user);
  };

  const getUserDashboardConfig = () => {
    return user ? getRoleDashboardConfig(user.role) : null;
  };

  const filterUserMenuByPermissions = (menuItems: any[]): any[] => {
    return filterMenuByPermissions(user, menuItems);
  };

  const getUserUserCapabilityLevel = (): 'basic' | 'intermediate' | 'advanced' | 'admin' => {
    return getUserCapabilityLevel(user);
  };

  const shouldUserShowAdvancedFeatures = (): boolean => {
    return shouldShowAdvancedFeatures(user);
  };

  const getUserRoleBasedHelp = () => {
    return getRoleBasedHelp(user);
  };

  const contextValue: AuthContextType = {
    // Core state
    user,
    isAuthenticated,
    isLoading,
    authChecked,
    isHydrated,
    shouldAutoRedirect,
    
    // Actions
    login,
    logout,
    switchUser,
    
    // Permission utilities
    hasPermission,
    canAccessFeature: canUserAccessFeature,
    canAccessRoute: canUserAccessRoute,
    getAccessibleNavigation: getUserAccessibleNavigation,
    getDashboardConfig: getUserDashboardConfig,
    filterMenuByPermissions: filterUserMenuByPermissions,
    getUserCapabilityLevel: getUserUserCapabilityLevel,
    shouldShowAdvancedFeatures: shouldUserShowAdvancedFeatures,
    getRoleBasedHelp: getUserRoleBasedHelp,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Backward compatibility alias
export const useUser = useAuth;