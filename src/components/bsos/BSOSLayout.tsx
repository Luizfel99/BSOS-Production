'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '../LanguageSelector';

// BSOS Module Icons
const BSOSIcons = {
  Core: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Manager: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Client: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Finance: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  Analytics: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
};

interface BSOSLayoutProps {
  children: React.ReactNode;
  currentModule: 'core' | 'manager' | 'client' | 'finance' | 'analytics';
  onModuleChange: (module: 'core' | 'manager' | 'client' | 'finance' | 'analytics') => void;
}

export default function BSOSLayout({ children, currentModule, onModuleChange }: BSOSLayoutProps) {
  const { t } = useTranslation();
  const { user, logout, hasPermission } = useAuth();

  // Define which modules each role can access
  const roleModuleAccess = {
    cleaner: ['core'],
    supervisor: ['core', 'manager'],
    manager: ['core', 'manager', 'finance'],
    owner: ['core', 'manager', 'client', 'finance', 'analytics'],
    client: ['client']
  };

  const modules = [
    {
      id: 'core' as const,
      name: 'BSOS Core',
      subtitle: 'Operations',
      description: 'Agenda, tarefas, checklists',
      icon: BSOSIcons.Core,
      color: 'bg-blue-500',
      users: 'Funcionários e supervisores'
    },
    {
      id: 'manager' as const,
      name: 'BSOS Manager',
      subtitle: 'Team Management',
      description: 'Controle de equipe, pagamentos, desempenho',
      icon: BSOSIcons.Manager,
      color: 'bg-green-500',
      users: 'Gerentes de operações'
    },
    {
      id: 'client' as const,
      name: 'BSOS Client',
      subtitle: 'Transparency',
      description: 'Transparência, fotos, status, histórico',
      icon: BSOSIcons.Client,
      color: 'bg-purple-500',
      users: 'Clientes e property managers'
    },
    {
      id: 'finance' as const,
      name: 'BSOS Finance',
      subtitle: 'Financial Control',
      description: 'Pagamentos, invoices, relatórios',
      icon: BSOSIcons.Finance,
      color: 'bg-yellow-500',
      users: 'Administração'
    },
    {
      id: 'analytics' as const,
      name: 'BSOS Analytics',
      subtitle: 'AI Insights',
      description: 'Indicadores, alertas e previsões',
      icon: BSOSIcons.Analytics,
      color: 'bg-red-500',
      users: 'Diretores e donos da empresa'
    }
  ];

  // Filter modules based on user role
  const availableModules = modules.filter(module => 
    user && roleModuleAccess[user.role]?.includes(module.id)
  );

  const getUserRoleInfo = (role: string) => {
    switch (role) {
      case 'cleaner': return { label: 'Employee', icon: 'EMP', color: 'bg-blue-100 text-blue-800' };
      case 'supervisor': return { label: 'Supervisor', icon: 'SUP', color: 'bg-green-100 text-green-800' };
      case 'manager': return { label: 'Manager', icon: 'MGR', color: 'bg-purple-100 text-purple-800' };
      case 'owner': return { label: 'Owner', icon: 'OWN', color: 'bg-red-100 text-red-800' };
      case 'client': return { label: 'Client', icon: 'CLI', color: 'bg-yellow-100 text-yellow-800' };
      default: return { label: 'User', icon: 'USR', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const roleInfo = user ? getUserRoleInfo(user.role) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mobile-container">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">BS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">B.S.O.S.</h1>
                <p className="text-xs text-gray-500">Where Cleaning Meets Intelligence</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">BSOS</h1>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSelector />
              
              {/* User Info */}
              {user && roleInfo && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                    <span className="hidden sm:inline">{roleInfo.icon} </span>
                    <span className="hidden md:inline">{roleInfo.label}</span>
                    <span className="sm:hidden">U</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-24 sm:max-w-none">{user.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-24 sm:max-w-none">{user.email}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-0 touch-target"
                    title="Exit"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Module Navigation */}
      <nav className="bg-white border-b">
        <div className="mobile-container">
          <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2 sm:py-4 scrollbar-hide">
            {availableModules.map((module) => {
              const isActive = currentModule === module.id;
              const IconComponent = module.icon;
              
              return (
                <button
                  key={module.id}
                  onClick={() => onModuleChange(module.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 min-w-fit touch-target ${
                    isActive
                      ? `${module.color} text-white shadow-lg`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={`${module.name} - ${module.description}`}
                >
                  <div className="flex-shrink-0">
                    <IconComponent />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {module.name}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {module.subtitle}
                    </div>
                  </div>
                  <div className="text-left sm:hidden">
                    <div className={`font-medium text-xs ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {module.name.split(' ')[1] || module.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="mobile-container py-4 sm:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="mobile-container py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © 2025 B.S.O.S. - Where Cleaning Meets Intelligence
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
              <span>v2.0.0</span>
              <span>•</span>
              <span>Status: Online</span>
              {user && roleInfo && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">User: {roleInfo.label}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
