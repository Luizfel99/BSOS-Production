'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { useNotifications } from '@/hooks/useNotifications';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { login, logout, user, loading: authLoading } = useAuth();
  const { success, error: showError, loading, promise } = useNotifications();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('cleaner');
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState(false);

  // Handle redirect after successful regular login (not demo login)
  useEffect(() => {
    console.log('🔍 LoginScreen useEffect triggered:', { 
      pendingRedirect, 
      userExists: !!user,
      userRole: user?.role,
      userName: user?.name
    });
    
    // Only handle redirects for regular login (pendingRedirect will be set for non-demo logins)
    if (pendingRedirect && user) {
      console.log('🚀 LoginScreen: User state updated after regular login, initiating redirect:', {
        userId: user.id,
        email: user.email,
        role: user.role
      });
      
      // Determine redirect path based on user role
      let redirectPath = '/dashboard';
      switch (user.role) {
        case 'cleaner': redirectPath = '/dashboard/cleaner'; break;
        case 'supervisor': redirectPath = '/dashboard/supervisor'; break;
        case 'manager': redirectPath = '/dashboard/manager'; break;
        case 'owner': redirectPath = '/dashboard/owner'; break;
        case 'client': redirectPath = '/dashboard/client'; break;
        default: redirectPath = '/dashboard';
      }
      
      console.log('🎯 LoginScreen: Determined redirect path for role', user.role, ':', redirectPath);
      
      try {
        router.push(redirectPath);
        console.log('🎯 LoginScreen: Router push initiated successfully to', redirectPath);
        setPendingRedirect(false);
      } catch (error) {
        console.error('❌ LoginScreen: Router push failed, using window.location:', error);
        window.location.href = redirectPath;
        setPendingRedirect(false);
      }
    }
  }, [pendingRedirect, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔑 LoginScreen: Starting login process for:', email);
      setIsLoading(true);
      
      await login(email, password);
      
      success('Login realizado com sucesso! Bem-vindo ao B.S.O.S.');
      
      console.log('✅ LoginScreen: Login successful');
      
    } catch (err: any) {
      console.error('❌ LoginScreen: Login failed:', err);
      setError(t('auth.loginError'));
      showError(err?.message || 'Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (userId: string) => {
    setIsQuickLoading(true);
    setError('');
    
    try {
      console.log('🚀 LoginScreen: Starting demo login for user ID:', userId);
      
      // Find the demo user by ID
      const demoUser = demoUsers.find(user => user.id === userId);
      
      if (!demoUser) {
        console.error('❌ Demo user not found for ID:', userId);
        throw new Error('Demo user not found');
      }
      
      console.log('👤 LoginScreen: Demo user found:', {
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role
      });
      
      // Add a small delay to show loading state and prevent rapid clicks
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('🔐 LoginScreen: Calling AuthContext.login() with email:', demoUser.email);
      
      // Use AuthContext.login() with demo user data
      await login(demoUser.email, 'demo');
      
      console.log('✅ LoginScreen: Demo login successful');
        
      // Show success notification
      success(`Login demo realizado com sucesso! Bem-vindo, ${demoUser.name}!`);
      
    } catch (error: any) {
      console.error('❌ LoginScreen: Demo login failed:', error);
      setError(t('auth.loginError'));
      showError('Erro no login demo. Tente novamente.');
    } finally {
      setIsQuickLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoading(false);
    setIsQuickLoading(false);
    logout();
    setShowDemo(false);
    setEmail('');
    setPassword('');
    setSelectedRole('cleaner');
    setError('');
    success('Sessão anterior limpa. Faça um novo login.');
  };

  const roleOptions = [
    { value: 'cleaner', label: t('roles.employee'), icon: '🧹' },
    { value: 'supervisor', label: t('roles.supervisor'), icon: '👩‍💼' },
    { value: 'manager', label: t('roles.manager'), icon: '🧑‍💻' },
    { value: 'client', label: t('roles.client'), icon: '🏠' },
    { value: 'owner', label: t('roles.owner'), icon: '🧑‍🎓' }
  ];

  const demoUsers = [
    { 
      id: '1', 
      name: 'Maria Silva', 
      email: 'maria@cleaner.com',
      role: 'cleaner', 
      roleLabel: t('roles.employee'), 
      icon: 'EMP', 
      color: 'bg-blue-500' 
    },
    { 
      id: '2', 
      name: 'João Santos', 
      email: 'joao@supervisor.com',
      role: 'supervisor', 
      roleLabel: t('roles.supervisor'), 
      icon: 'SUP', 
      color: 'bg-green-500' 
    },
    { 
      id: '3', 
      name: 'Ana Costa', 
      email: 'ana@manager.com',
      role: 'manager', 
      roleLabel: t('roles.manager'), 
      icon: 'MGR', 
      color: 'bg-purple-500' 
    },
    { 
      id: '4', 
      name: 'Pedro Oliveira', 
      email: 'pedro@owner.com',
      role: 'owner', 
      roleLabel: t('roles.owner'), 
      icon: 'OWN', 
      color: 'bg-red-500' 
    },
    { 
      id: '5', 
      name: 'Carlos Mendes', 
      email: 'carlos@client.com',
      role: 'client', 
      roleLabel: t('roles.client'), 
      icon: 'CLI', 
      color: 'bg-yellow-500' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white font-bold">B.S.</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BRIGHT & SHINE O.S.</h1>
          <p className="text-lg font-medium text-blue-600 mb-1">{t('auth.tagline')}</p>
          <p className="text-sm text-gray-600">{t('auth.subtitle')}</p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <LanguageSelector />
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
              title={t('auth.clearPreviousSession')}
            >
              {t('auth.newSession')}
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.selectRole') || 'Select Role'}
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500">
                {t('auth.roleHelpText') || 'Choose your role to access the appropriate dashboard'}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? t('common.loading') + '...' : t('auth.login')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowDemo(!showDemo)}
              disabled={isLoading || isQuickLoading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showDemo ? '🔼 ' + t('auth.hideDemoProfiles') : '🎭 ' + t('auth.showDemoProfiles')}
            </button>
          </div>
        </div>

        {/* Demo Users - Só mostra se showDemo for true */}
        {showDemo && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              🎭 Demo - Acesso Rápido
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Clique em um perfil para testar o sistema
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user.id)}
                  disabled={isLoading || isQuickLoading}
                  className={`${user.color} text-white p-4 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  <div className="flex items-center space-x-3">
                    {isQuickLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                      <span className="text-2xl">{user.icon}</span>
                    )}
                    <div className="text-left">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm opacity-90">{user.roleLabel}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Cada perfil tem acesso a módulos específicos do BSOS</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2025 Bright & Shine Operating System</p>
          <p>Gestão profissional de limpeza e propriedades</p>
        </div>
      </div>
    </div>
  );
}