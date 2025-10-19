'use client';

import { useEffect, useState } from 'react';
import { useIsClient } from '@/hooks/useSSRHooks';

interface ConnectionStatus {
  isOnline: boolean;
  serverConnected: boolean;
  lastCheck: Date;
}

export function useConnectionMonitor() {
  const isClient = useIsClient();
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: true, // Default to true for SSR
    serverConnected: true,
    lastCheck: new Date()
  });

  useEffect(() => {
    if (!isClient) return;

    // Initialize with browser state only on client
    setStatus(prev => ({
      ...prev,
      isOnline: navigator.onLine,
      lastCheck: new Date()
    }));

    // Monitor browser online status
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check server connection periodically
    const checkServerConnection = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        setStatus(prev => ({
          ...prev,
          serverConnected: response.ok,
          lastCheck: new Date()
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          serverConnected: false,
          lastCheck: new Date()
        }));
      }
    };

    // Check immediately and then every 30 seconds
    checkServerConnection();
    const interval = setInterval(checkServerConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [isClient]);

  return status;
}

export function ConnectionIndicator() {
  const isClient = useIsClient();
  const { isOnline, serverConnected } = useConnectionMonitor();

  // Não renderiza nada no servidor para evitar hidratação
  if (!isClient) {
    return null;
  }

  if (isOnline && serverConnected) {
    return null; // Don't show anything when everything is fine
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium ${
        !isOnline 
          ? 'bg-red-500 text-white' 
          : !serverConnected 
          ? 'bg-yellow-500 text-black'
          : 'bg-green-500 text-white'
      }`}>
        {!isOnline ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Sem conexão com a internet</span>
          </div>
        ) : !serverConnected ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Reconectando ao servidor...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Conectado</span>
          </div>
        )}
      </div>
    </div>
  );
}