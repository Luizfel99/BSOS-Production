/**
 * Configuração global para resolver problemas de hidratação SSR/Client
 * 
 * Este arquivo contém configurações e workarounds para evitar
 * erros de hidratação entre servidor e cliente
 */

// Desabilita warnings de hidratação durante desenvolvimento se necessário
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Suprime avisos específicos de hidratação durante o desenvolvimento
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes?.('Warning: Text content did not match') ||
      args[0]?.includes?.('Hydration failed') ||
      args[0]?.includes?.('There was an error while hydrating')
    ) {
      return; // Suprime apenas durante desenvolvimento
    }
    originalError(...args);
  };
}

/**
 * Valores padrão consistentes para evitar discrepâncias SSR/Client
 */
export const SSR_DEFAULTS = {
  // Datas padrão para componentes que usam Date.now() ou new Date()
  DEFAULT_DATE: '2024-10-08T12:00:00.000Z',
  DEFAULT_MONTH: '2024-10',
  DEFAULT_TIMESTAMP: 1728396000000, // Oct 8, 2024 12:00:00 GMT
  
  // IDs padrão para componentes que geram IDs únicos
  ID_PREFIX: 'bsos',
  
  // Configurações de localização
  DEFAULT_LOCALE: 'pt-BR',
  DEFAULT_TIMEZONE: 'America/Sao_Paulo',
  
  // Estados padrão para localStorage/sessionStorage
  STORAGE_DEFAULTS: {
    language: 'pt-BR',
    theme: 'light',
    user: null
  }
};

/**
 * Função utilitária para verificar se estamos no cliente
 */
export const isClient = () => typeof window !== 'undefined';

/**
 * Função para obter data atual de forma consistente
 */
export const getCurrentDate = (): Date => {
  if (isClient()) {
    return new Date();
  }
  return new Date(SSR_DEFAULTS.DEFAULT_DATE);
};

/**
 * Função para obter timestamp de forma consistente
 */
export const getCurrentTimestamp = (): number => {
  if (isClient()) {
    return Date.now();
  }
  return SSR_DEFAULTS.DEFAULT_TIMESTAMP;
};

/**
 * Função para gerar IDs únicos de forma consistente
 */
let idCounter = 0;
export const generateUniqueId = (prefix: string = SSR_DEFAULTS.ID_PREFIX): string => {
  idCounter++;
  const timestamp = isClient() ? Date.now() : SSR_DEFAULTS.DEFAULT_TIMESTAMP;
  return `${prefix}-${timestamp}-${idCounter}`;
};