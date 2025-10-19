/**
 * BSOS SURGICAL MODE - SidebarButton Component
 * Functional navigation buttons with router.push() and toast fallbacks
 * 
 * Date: 2025-10-18
 * Purpose: Ensure all navigation is functional across BSOS modules
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { LucideIcon } from 'lucide-react';

interface SidebarButtonProps {
  label: string;
  route?: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  route,
  icon: Icon,
  isActive = false,
  onClick,
  className = '',
  disabled = false,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
      return;
    }

    if (route) {
      try {
        router.push(route);
      } catch (error) {
        console.error('Navigation error:', error);
        toast.error('Erro na navegação');
      }
    } else {
      toast('Função em desenvolvimento 🧩', {
        icon: '🚧',
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const baseClasses = `
    flex items-center gap-3 w-full text-left px-4 py-2 
    rounded-lg transition-all duration-200 
    hover:bg-blue-50 hover:text-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isActive ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700' : 'text-gray-700'}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={baseClasses.trim()}
      aria-label={`Navegar para ${label}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

// Navigation configuration with all BSOS routes
export const navigationConfig = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard' },
  { id: 'tasks', label: 'Tarefas', route: '/tasks' },
  { id: 'team', label: 'Equipe', route: '/team/manage' },
  { id: 'properties', label: 'Propriedades', route: '/properties' },
  { id: 'analytics', label: 'Analytics', route: '/analytics' },
  { id: 'finance', label: 'Financeiro', route: '/finance' },
  { id: 'notifications', label: 'Notificações', route: '/notifications' },
  { id: 'settings', label: 'Configurações', route: '/settings' },
];

export default SidebarButton;