/**
 * Role-Based Access Control (RBAC) Utilities
 * Provides comprehensive permission management for the BSOS platform
 */

import React from 'react';
import { Shield, Users, Building, FileText, Settings, DollarSign, Clock, BarChart } from 'lucide-react';

// Import types from AuthContext instead of UserContext
import { UserRole, User, Permission } from '@/contexts/AuthContext';

// Define all possible actions in the system
export type Action = 
  | 'view' | 'create' | 'update' | 'delete' | 'approve' | 'reject'
  | 'upload_photo' | 'checklist' | 'feedback' | 'audit' | 'message'
  | 'evaluate' | 'export' | 'configure' | 'approve_payment'
  | 'manage_users' | 'view_reports' | 'access_analytics'
  | 'manage_integrations' | 'view_finance' | 'edit_templates'
  | 'access'; // General access permission

// Define all modules in the system
export type Module = 
  | 'core' | 'manager' | 'client' | 'finance' | 'analytics' 
  | 'integrations' | 'reports' | 'users' | 'settings' | 'templates'
  | 'dashboard' | 'tasks' | 'properties' | 'employees' | 'payments';

// Role-based feature access matrix
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  cleaner: [
    { module: 'core', actions: ['view', 'update', 'upload_photo', 'checklist'] },
    { module: 'tasks', actions: ['view', 'update'] },
    { module: 'dashboard', actions: ['view', 'access'] }
  ],
  supervisor: [
    { module: 'core', actions: ['view', 'create', 'update', 'approve', 'feedback', 'audit'] },
    { module: 'tasks', actions: ['view', 'create', 'update', 'approve'] },
    { module: 'employees', actions: ['view', 'feedback'] },
    { module: 'reports', actions: ['view'] },
    { module: 'analytics', actions: ['view', 'access_analytics'] },
    { module: 'dashboard', actions: ['view', 'access'] },
    { module: 'manager', actions: ['view'] }
  ],
  manager: [
    { module: 'core', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'manager', actions: ['view', 'create', 'update', 'approve_payment'] },
    { module: 'tasks', actions: ['view', 'create', 'update', 'delete', 'approve'] },
    { module: 'employees', actions: ['view', 'create', 'update', 'manage_users'] },
    { module: 'properties', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'reports', actions: ['view', 'export'] },
    { module: 'analytics', actions: ['view', 'export', 'access_analytics'] },
    { module: 'integrations', actions: ['view', 'configure'] },
    { module: 'templates', actions: ['view', 'edit_templates'] },
    { module: 'dashboard', actions: ['view', 'access'] },
    { module: 'finance', actions: ['view'] }
  ],
  owner: [
    { module: 'core', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'manager', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'client', actions: ['view'] },
    { module: 'finance', actions: ['view', 'create', 'update', 'delete', 'view_finance'] },
    { module: 'analytics', actions: ['view', 'export', 'configure', 'access_analytics'] },
    { module: 'tasks', actions: ['view', 'create', 'update', 'delete', 'approve'] },
    { module: 'employees', actions: ['view', 'create', 'update', 'delete', 'manage_users'] },
    { module: 'properties', actions: ['view', 'create', 'update', 'delete'] },
    { module: 'reports', actions: ['view', 'export', 'view_reports'] },
    { module: 'integrations', actions: ['view', 'create', 'update', 'delete', 'manage_integrations'] },
    { module: 'templates', actions: ['view', 'create', 'update', 'delete', 'edit_templates'] },
    { module: 'settings', actions: ['view', 'create', 'update', 'delete', 'configure'] },
    { module: 'users', actions: ['view', 'create', 'update', 'delete', 'manage_users'] },
    { module: 'payments', actions: ['view', 'create', 'update', 'delete', 'approve_payment'] },
    { module: 'dashboard', actions: ['view', 'access'] }
  ],
  client: [
    { module: 'client', actions: ['view', 'evaluate', 'message'] },
    { module: 'properties', actions: ['view'] },
    { module: 'tasks', actions: ['view'] },
    { module: 'reports', actions: ['view'] },
    { module: 'dashboard', actions: ['view', 'access'] }
  ]
};

// Feature visibility matrix based on roles
export const FEATURE_ACCESS: Record<string, UserRole[]> = {
  // Core features
  'task-management': ['cleaner', 'supervisor', 'manager', 'owner'],
  'photo-upload': ['cleaner', 'supervisor', 'manager', 'owner'],
  'checklist': ['cleaner', 'supervisor', 'manager', 'owner'],
  
  // Management features
  'employee-management': ['supervisor', 'manager', 'owner'],
  'property-management': ['manager', 'owner', 'client'],
  'payment-approval': ['manager', 'owner'],
  'template-editing': ['manager', 'owner'],
  
  // Analytics and reporting
  'analytics-dashboard': ['supervisor', 'manager', 'owner'],
  'financial-reports': ['manager', 'owner'],
  'performance-reports': ['supervisor', 'manager', 'owner'],
  'export-data': ['manager', 'owner'],
  
  // Client features
  'client-portal': ['client', 'owner'],
  'service-evaluation': ['client'],
  'property-communication': ['client', 'manager', 'owner'],
  
  // System administration
  'user-management': ['owner'],
  'system-settings': ['owner'],
  'integration-management': ['manager', 'owner'],
  'audit-logs': ['supervisor', 'manager', 'owner']
};

// Navigation items based on roles
export const NAVIGATION_ACCESS: Record<UserRole, string[]> = {
  cleaner: ['dashboard', 'tasks', 'checklist', 'profile'],
  supervisor: ['dashboard', 'tasks', 'team', 'reports', 'analytics', 'profile'],
  manager: ['dashboard', 'tasks', 'team', 'properties', 'reports', 'analytics', 'integrations', 'profile'],
  owner: ['dashboard', 'tasks', 'team', 'properties', 'reports', 'analytics', 'finance', 'settings', 'integrations', 'profile'],
  client: ['dashboard', 'properties', 'services', 'messages', 'profile']
};

/**
 * Check if a user has permission for a specific action on a module
 */
export function hasPermission(user: User | null, module: Module, action: Action): boolean {
  if (!user) return false;
  
  const userPermissions = user.permissions || ROLE_PERMISSIONS[user.role] || [];
  const modulePermission = userPermissions.find(p => p.module === module);
  
  return modulePermission?.actions.includes(action) || false;
}

/**
 * Check if a user can access a specific feature
 */
export function canAccessFeature(user: User | null, feature: string): boolean {
  if (!user) return false;
  
  const allowedRoles = FEATURE_ACCESS[feature];
  return allowedRoles ? allowedRoles.includes(user.role) : false;
}

/**
 * Get navigation items accessible to a user
 */
export function getAccessibleNavigation(user: User | null): string[] {
  if (!user) return [];
  
  return NAVIGATION_ACCESS[user.role] || [];
}

/**
 * Check if user can access a route/page
 */
export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false;
  
  const routePermissions: Record<string, UserRole[]> = {
    '/dashboard': ['cleaner', 'supervisor', 'manager', 'owner', 'client'],
    '/tasks': ['cleaner', 'supervisor', 'manager', 'owner'],
    '/team': ['supervisor', 'manager', 'owner'],
    '/properties': ['manager', 'owner', 'client'],
    '/reports': ['supervisor', 'manager', 'owner', 'client'],
    '/analytics': ['owner'],
    '/finance': ['manager', 'owner'],
    '/settings': ['owner'],
    '/integrations': ['manager', 'owner'],
    '/client': ['client', 'owner'],
    '/admin': ['owner']
  };
  
  const allowedRoles = routePermissions[route];
  return allowedRoles ? allowedRoles.includes(user.role) : true;
}

/**
 * Get role-specific dashboard configuration
 */
export function getRoleDashboardConfig(role: UserRole) {
  const dashboardConfigs = {
    cleaner: {
      defaultView: 'tasks',
      widgets: ['my-tasks', 'recent-activity', 'notifications'],
      actions: ['view-tasks', 'upload-photos', 'complete-checklist']
    },
    supervisor: {
      defaultView: 'overview',
      widgets: ['team-performance', 'pending-approvals', 'quality-metrics', 'notifications'],
      actions: ['review-tasks', 'approve-work', 'manage-team', 'view-reports']
    },
    manager: {
      defaultView: 'management',
      widgets: ['property-overview', 'team-stats', 'financial-summary', 'performance-metrics'],
      actions: ['manage-properties', 'approve-payments', 'view-analytics', 'manage-team']
    },
    owner: {
      defaultView: 'analytics',
      widgets: ['business-metrics', 'financial-overview', 'performance-dashboard', 'system-health'],
      actions: ['full-analytics', 'financial-management', 'system-admin', 'strategic-planning']
    },
    client: {
      defaultView: 'services',
      widgets: ['my-properties', 'service-history', 'upcoming-cleanings', 'messages'],
      actions: ['view-properties', 'schedule-services', 'rate-services', 'contact-support']
    }
  };
  
  return dashboardConfigs[role];
}

/**
 * Filter menu items based on user permissions
 */
export function filterMenuByPermissions(user: User | null, menuItems: any[]): any[] {
  if (!user) return [];
  
  return menuItems.filter(item => {
    if (item.requiredPermission) {
      const [module, action] = item.requiredPermission.split(':');
      return hasPermission(user, module as Module, action as Action);
    }
    
    if (item.requiredFeature) {
      return canAccessFeature(user, item.requiredFeature);
    }
    
    if (item.allowedRoles) {
      return item.allowedRoles.includes(user.role);
    }
    
    return true; // Default allow if no restrictions specified
  });
}

/**
 * Get user's capability level for progressive UI
 */
export function getUserCapabilityLevel(user: User | null): 'basic' | 'intermediate' | 'advanced' | 'admin' {
  if (!user) return 'basic';
  
  const capabilityMap = {
    cleaner: 'basic',
    client: 'basic',
    supervisor: 'intermediate',
    manager: 'advanced',
    owner: 'admin'
  } as const;
  
  return capabilityMap[user.role];
}

/**
 * Check if user should see advanced features
 */
export function shouldShowAdvancedFeatures(user: User | null): boolean {
  const capability = getUserCapabilityLevel(user);
  return ['advanced', 'admin'].includes(capability);
}

/**
 * Get contextual help based on user role
 */
export function getRoleBasedHelp(user: User | null) {
  if (!user) return null;
  
  const helpContent = {
    cleaner: {
      quickActions: ['Upload photos', 'Complete checklist', 'Update task status'],
      helpTopics: ['How to use the mobile app', 'Photo upload guidelines', 'Checklist best practices'],
      supportContact: 'supervisor'
    },
    supervisor: {
      quickActions: ['Review completed work', 'Approve tasks', 'Give feedback'],
      helpTopics: ['Team management', 'Quality control', 'Performance tracking'],
      supportContact: 'manager'
    },
    manager: {
      quickActions: ['Manage properties', 'Approve payments', 'View reports'],
      helpTopics: ['Property management', 'Team performance', 'Financial overview'],
      supportContact: 'admin'
    },
    owner: {
      quickActions: ['View analytics', 'System settings', 'Strategic planning'],
      helpTopics: ['Business analytics', 'System administration', 'Growth strategies'],
      supportContact: 'technical_support'
    },
    client: {
      quickActions: ['Schedule cleaning', 'Rate service', 'Contact support'],
      helpTopics: ['Service booking', 'Property management', 'Billing questions'],
      supportContact: 'customer_service'
    }
  };
  
  return helpContent[user.role];
}