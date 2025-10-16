'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para evitar erros de hidratação SSR/Client
 * Retorna false no servidor e true no cliente após hidratação
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook para localStorage que funciona com SSR
 * Evita erros de hidratação
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const isClient = useIsClient();
  
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook para data atual que evita discrepâncias de hidratação
 * Renderiza uma data fixa no servidor e atualiza no cliente
 */
export function useCurrentDate() {
  const isClient = useIsClient();
  const [currentDate, setCurrentDate] = useState(() => new Date('2024-10-08T12:00:00'));

  useEffect(() => {
    if (!isClient) return;

    const updateDate = () => setCurrentDate(new Date());
    updateDate(); // Atualiza imediatamente no cliente

    const interval = setInterval(updateDate, 1000); // Atualiza a cada segundo

    return () => clearInterval(interval);
  }, [isClient]);

  return currentDate;
}

/**
 * Hook para IDs únicos que evitam conflitos SSR/Client
 */
export function useUniqueId(prefix: string = 'id'): string {
  const isClient = useIsClient();
  const [id] = useState(() => {
    // Usa um contador simples no servidor, timestamp no cliente
    return isClient 
      ? `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      : `${prefix}-server-${Math.random().toString(36).substr(2, 9)}`;
  });

  return id;
}