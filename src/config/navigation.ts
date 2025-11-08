/**
 * BSOS SURGICAL MODE - Enhanced Navigation Configuration
 * Role-based navigation with functional routing and toast fallbacks
 * 
 * Date: 2025-10-18
 * Purpose: Complete navigation system with access control
 */

import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  Bell, 
  DollarSign 
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  roles: string[]; // Which roles can access this route
  priority: number; // Display order
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    roles: ['OWNER', 'MANAGER', 'SUPERVISOR', 'CLEANER', 'CLIENT', 'ADMIN'],
    priority: 1,
  },
  {
    id: 'tasks',
    label: 'Tarefas',
    icon: Calendar,
    href: '/tasks',
    roles: ['OWNER', 'MANAGER', 'SUPERVISOR', 'CLEANER', 'ADMIN'],
    priority: 2,
  },
  {
    id: 'properties',
    label: 'Propriedades',
    icon: Home,
    href: '/properties',
    roles: ['OWNER', 'MANAGER', 'SUPERVISOR', 'ADMIN'],
    priority: 3,
  },
  {
    id: 'team',
    label: 'Equipe',
    icon: Users,
    href: '/team/manage',
    roles: ['OWNER', 'MANAGER', 'ADMIN'],
    priority: 4,
  },
  {
    id: 'finance',
    label: 'Financeiro',
    icon: DollarSign,
    href: '/finance',
    roles: ['OWNER', 'MANAGER', 'ADMIN'],
    priority: 5,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    roles: ['OWNER', 'MANAGER', 'SUPERVISOR', 'ADMIN'],
    priority: 6,
  },
  {
    id: 'notifications',
    label: 'Notificações',
    icon: Bell,
    href: '/notifications',
    roles: ['OWNER', 'MANAGER', 'SUPERVISOR', 'CLEANER', 'CLIENT', 'ADMIN'],
    priority: 7,
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    href: '/settings',
    roles: ['OWNER', 'MANAGER', 'ADMIN'],
    priority: 8,
  },
];

/**
 * Get navigation items filtered by user role
 */
export function getNavigationForRole(userRole: string): NavigationItem[] {
  if (!userRole) return [];
  const roleUpper = userRole.toUpperCase();
  return navigationItems
    .filter(item => item.roles.map(r => r.toUpperCase()).includes(roleUpper))
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Check if user has access to a specific route
 */
export function hasRouteAccess(route: string, userRole: string): boolean {
  if (!userRole) return false;
  const roleUpper = userRole.toUpperCase();
  const item = navigationItems.find(item => item.href === route);
  if (!item) return true; // Allow access to routes not explicitly listed
  return item.roles.map(r => r.toUpperCase()).includes(roleUpper);
}

export default navigationItems;