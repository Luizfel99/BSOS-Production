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
    
    // Determine user intent based on current URL
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      // Auto-redirect should happen for:
      // 1. Protected routes (user came from middleware redirect)
      // 2. Direct dashboard access
      // 3. Any route that's not the login page or root
      const isLoginIntent = currentPath === '/' || currentPath === '/login';
      const hasRedirectParam = searchParams.has('redirect') || searchParams.has('from');
      
      // Only auto-redirect if user didn't intend to visit login page
      setShouldAutoRedirect(!isLoginIntent || hasRedirectParam);
      
      console.log('🎯 User intent determined:', {
        currentPath,
        isLoginIntent,
        hasRedirectParam,
        shouldAutoRedirect: !isLoginIntent || hasRedirectParam
      });
    }
  }, []);

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

  // Verify and restore session on mount
  useEffect(() => {
    // Only run session verification after hydration is complete
    if (!isHydrated) return;
    
    const verifySession = async () => {
  console.log('[BSOS-Auth] Starting session verification');
      
      try {
        // Check if we're in a browser environment (double check)
        if (typeof window === 'undefined') {
          console.log('⚠️ Not in browser environment, skipping session verification');
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }

        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedTimestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
        const storedRole = localStorage.getItem(STORAGE_KEYS.ROLE);

        // Debug session data
  console.log('[BSOS-Auth] Session data found:', {
          hasUser: !!storedUser,
          hasTimestamp: !!storedTimestamp,
          hasRole: !!storedRole,
          timestamp: storedTimestamp ? new Date(parseInt(storedTimestamp)) : null
        });

        if (!storedUser || !storedTimestamp) {
          console.log('[BSOS-Auth] No stored session found');
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }

        // Check session expiry
        const sessionAge = Date.now() - parseInt(storedTimestamp);
        const isExpired = sessionAge > SESSION_TIMEOUT;
        
  console.log('[BSOS-Auth] Session age check:', {
          ageInHours: Math.round(sessionAge / (1000 * 60 * 60)),
          maxAgeInHours: Math.round(SESSION_TIMEOUT / (1000 * 60 * 60)),
          isExpired
        });

        if (isExpired) {
          console.log('[BSOS-Auth] Session expired, clearing data');
          clearSession();
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }

        // Parse and validate user data
        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (parseError) {
          console.error('[BSOS-Auth] Failed to parse stored user data:', parseError);
          clearSession();
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }
        
        // Validate user structure
        if (!parsedUser?.id || !parsedUser?.role || !parsedUser?.email) {
          console.log('[BSOS-Auth] Invalid user data structure:', parsedUser);
          clearSession();
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }

        // Validate and normalize role
        const validRoles = ['cleaner', 'supervisor', 'manager', 'owner', 'client', 'admin'];
        const userRoleLower = parsedUser.role?.toLowerCase();
        if (!userRoleLower || !validRoles.includes(userRoleLower)) {
          console.log('[BSOS-Auth] Invalid user role:', parsedUser.role);
          clearSession();
          setAuthChecked(true);
          setIsLoading(false);
          return;
        }

        // Normalize stored user role and permissions (handles sessions created before normalization)
        parsedUser.role = userRoleLower;
        if (!Array.isArray(parsedUser.permissions) || parsedUser.permissions.length === 0) {
          parsedUser.permissions = ROLE_PERMISSIONS[userRoleLower as keyof typeof ROLE_PERMISSIONS] || [];
        }

        // Restore session successfully
  console.log('[BSOS-Auth] Valid session found, restoring user:', {
          email: parsedUser.email,
          role: parsedUser.role,
          id: parsedUser.id
        });
        
        setUser(parsedUser);
        
        // Refresh session timestamp to extend session
        saveSession(parsedUser);
        
      } catch (error) {
  console.error('[BSOS-Auth] Session verification failed:', error);
        clearSession();
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
  console.log('[BSOS-Auth] Session verification complete');
      }
    };

    verifySession();
  }, [isHydrated]);

  // Login function
  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
  console.log('[BSOS-Auth] Login attempt', { email, role: role || 'auto-detect' });

    try {
      setIsLoading(true);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
  console.log('[BSOS-Auth] Login successful:', {
          email: data.user.email,
          role: data.user.role
        });

        // Save token to localStorage
        localStorage.setItem('auth-token', data.token);

        // Normalize role to lowercase for consistent RBAC lookups
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

        // Important: Keep authChecked as true since user is now authenticated
        setAuthChecked(true);

        // Add a small delay to ensure state has propagated before resolving
        await new Promise(resolve => setTimeout(resolve, 100));

  console.log('[BSOS-Auth] Login completed for', apiUser.email, 'role:', apiUser.role);
        return true;
      } else {
  console.error('[BSOS-Auth] Login failed:', data.error || 'Invalid credentials');
        return false;
      }
    } catch (error) {
  console.error('[BSOS-Auth] Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
  console.log('[BSOS-Auth] Login process complete');
    }
  };

  // Logout function
  const logout = () => {
  console.log('[BSOS-Auth] Logout initiated');
    
    try {
  console.log('[BSOS-Auth] Clearing user state and session data');
      
      // Clear user state
      setUser(null);
      
      // Clear all stored data
      clearSession();
      
  console.log('[BSOS-Auth] User logged out successfully');
    } catch (error) {
  console.warn('[BSOS-Auth] Logout error:', error);
    } finally {
  console.log('[BSOS-Auth] Logout complete');
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