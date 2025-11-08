'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function LoginScreen() {
  const router = useRouter();
  const { login, user, authChecked, isHydrated } = useAuth();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only redirect if auth is fully checked and hydrated
    if (isHydrated && authChecked && user && user.role) {
      const redirectPaths: Record<string, string> = {
        admin: '/dashboard/admin',
        manager: '/dashboard/manager',
        supervisor: '/dashboard/supervisor',
        cleaner: '/dashboard/cleaner',
        owner: '/dashboard/owner',
        client: '/dashboard/client',
      };
      const redirectPath = redirectPaths[user.role] || '/dashboard';
      console.log('[LoginScreen] Redirecting', user.role, 'to', redirectPath);
      router.push(redirectPath);
    }
  }, [user, authChecked, isHydrated, router]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading(t('auth.loading') || 'Authenticating...');

    try {
      const success = await login(email, password);
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success(t('notifications.saved') || 'Login successful!');
      } else {
        toast.error(t('auth.invalidCredentials') || 'Invalid credentials.');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: string) => {
    const demoAccounts: Record<string, { email: string; password: string }> = {
      manager: { email: 'manager@bsos.com', password: 'demo123' },
      supervisor: { email: 'supervisor@bsos.com', password: 'demo123' },
      cleaner: { email: 'cleaner@bsos.com', password: 'demo123' },
      owner: { email: 'owner@bsos.com', password: 'demo123' },
      admin: { email: 'admin@bsos.com', password: 'admin123' },
    };
    
    const creds = demoAccounts[role];
    if (!creds) return;

    setLoading(true);
    const loadingToast = toast.loading(`Logging in as ${role}...`);

    try {
      const success = await login(creds.email, creds.password);
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success(`Welcome ${role}!`);
      } else {
        toast.error('Demo login failed.');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Demo login error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#007AFF] to-[#00C6FF] flex-col justify-between text-white p-12">
        <div>
          <h1 className="text-3xl font-bold">Bright & Shine Pro Services</h1>
          <p className="mt-2 text-lg opacity-90">{t('auth.where_cleaning_meets_intelligence') || 'Where Cleaning Meets Intelligence'}</p>
        </div>
        <div className="text-lg italic space-y-1">
          <p>"Optimize your Airbnb operations."</p>
          <p>"Empower your cleaning team."</p>
          <p>"Monitor. Manage. Shine."</p>
        </div>
        <div className="text-sm opacity-75">© 2025 Bright & Shine Pro Services</div>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center p-10 bg-white">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {t('auth.welcome') || 'Welcome back to BSOS'}
          </h2>
          <p className="text-center text-gray-600">
            {t('auth.loginToContinue') || 'Log in to manage your operations and properties.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.email') || 'Email address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder') || 'Enter your email'}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#007AFF] focus:border-[#007AFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.password') || 'Password'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder') || 'Enter your password'}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-[#007AFF] focus:border-[#007AFF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007AFF] text-white py-2 rounded-md hover:bg-[#0066CC] transition disabled:opacity-70 font-medium"
            >
              {loading ? (t('auth.loading') || 'Authenticating...') : (t('auth.sign_in') || 'Sign In')}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500">
            {t('auth.demo_login') || 'or quick demo login'}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { role: 'manager', label: 'Manager Demo' },
              { role: 'supervisor', label: 'Supervisor Demo' },
              { role: 'cleaner', label: 'Cleaner Demo' },
              { role: 'owner', label: 'Owner Demo' },
              { role: 'admin', label: 'Admin Demo' }
            ].map(({ role, label }) => (
              <button
                key={role}
                onClick={() => handleDemo(role)}
                disabled={loading}
                className="border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-100 transition disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex justify-center space-x-3 text-xs text-gray-500 mt-4">
            <button 
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
            >
              EN
            </button>
            <span className="text-gray-300">•</span>
            <button 
              onClick={() => handleLanguageChange('pt')}
              className={`px-2 py-1 rounded ${i18n.language === 'pt' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
            >
              PT
            </button>
            <span className="text-gray-300">•</span>
            <button 
              onClick={() => handleLanguageChange('es')}
              className={`px-2 py-1 rounded ${i18n.language === 'es' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
