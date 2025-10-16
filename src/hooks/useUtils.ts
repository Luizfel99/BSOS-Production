'use client';

import { useState, useRef } from 'react';

/**
 * Hook para gerar IDs únicos que funcionam com SSR
 * Evita conflitos entre servidor e cliente
 */
export function useUniqueId(prefix: string = 'id'): () => string {
  const counterRef = useRef(0);
  
  return () => {
    counterRef.current += 1;
    return `${prefix}-${counterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
  };
}

/**
 * Hook para timestamps consistentes
 * Evita problemas de hidratação com datas
 */
export function useTimestamp(): () => string {
  return () => new Date().toISOString();
}

/**
 * Hook para formatação de datas SSR-safe
 */
export function useDateFormatter() {
  const formatDate = (date: string | Date, locale: string = 'pt-BR'): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString(locale);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Data inválida';
    }
  };

  const formatDateTime = (date: string | Date, locale: string = 'pt-BR'): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString(locale);
    } catch (error) {
      console.warn('Error formatting datetime:', error);
      return 'Data inválida';
    }
  };

  const formatTime = (date: string | Date, locale: string = 'pt-BR'): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleTimeString(locale);
    } catch (error) {
      console.warn('Error formatting time:', error);
      return 'Hora inválida';
    }
  };

  return { formatDate, formatDateTime, formatTime };
}