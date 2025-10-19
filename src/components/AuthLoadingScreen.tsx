'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Shield, User } from 'lucide-react';

interface AuthLoadingScreenProps {
  message?: string;
  subMessage?: string;
  minDisplayTime?: number;
  showProgress?: boolean;
}

export default function AuthLoadingScreen({ 
  message = "Verificando autenticação...", 
  subMessage = "Aguarde enquanto verificamos sua sessão",
  minDisplayTime = 1000,
  showProgress = true
}: AuthLoadingScreenProps) {
  const [shouldShow, setShouldShow] = useState(true);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Ensure minimum display time to prevent flashing
    const timer = setTimeout(() => {
      setShouldShow(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  // Animated dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!shouldShow && minDisplayTime > 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Icon with animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Shield className="h-16 w-16 text-blue-600 animate-pulse" />
            <div className="absolute -top-1 -right-1">
              <User className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main loading message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {message}{dots}
        </h2>
        
        {/* Sub message */}
        <p className="text-gray-600 mb-6">
          {subMessage}
        </p>

        {/* Loading spinner */}
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>

        {/* Progress indicators */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Verificando sessão</span>
              <span>🔍</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Additional info */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            ⚡ Carregando dados de autenticação de forma segura...
          </p>
        </div>
      </div>
    </div>
  );
}