'use client';

import React from 'react';
import { useIsClient } from '@/hooks/useSSRHooks';
import { useDateFormatter } from '@/hooks/useUtils';

interface DateDisplayProps {
  date: string | Date;
  format?: 'date' | 'datetime' | 'time';
  locale?: string;
  fallback?: string;
  className?: string;
}

/**
 * Componente para exibir datas de forma SSR-safe
 * Evita problemas de hidratação com formatação de datas
 */
export default function DateDisplay({ 
  date, 
  format = 'date', 
  locale = 'pt-BR', 
  fallback = 'Carregando...',
  className = ''
}: DateDisplayProps) {
  const isClient = useIsClient();
  
  if (!isClient) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <DateDisplayInner 
      date={date} 
      format={format} 
      locale={locale} 
      className={className}
    />
  );
}

function DateDisplayInner({ date, format, locale, className }: Omit<DateDisplayProps, 'fallback'>) {
  const { formatDate, formatDateTime, formatTime } = useDateFormatter();

  const formatValue = () => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    switch (format) {
      case 'datetime':
        return formatDateTime(dateObj, locale);
      case 'time':
        return formatTime(dateObj, locale);
      default:
        return formatDate(dateObj, locale);
    }
  };

  return (
    <span className={className} title={formatDateTime(typeof date === 'string' ? new Date(date) : date, locale)}>
      {formatValue()}
    </span>
  );
}