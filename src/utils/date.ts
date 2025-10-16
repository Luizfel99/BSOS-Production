/**
 * 📅 UTILITÁRIOS DE DATA E HORA
 * Funções auxiliares para formatação e manipulação de datas
 */

// Formatação de datas
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'datetime' = 'short'): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Data inválida';
  }

  let options: Intl.DateTimeFormatOptions;

  switch (format) {
    case 'short':
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      break;
    case 'long':
      options = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      };
      break;
    case 'datetime':
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      break;
    default:
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
  }

  return d.toLocaleDateString('pt-BR', options);
};

// Formatação de tempo
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Hora inválida';
  }

  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calcular diferença entre datas
export const getDateDifference = (start: string | Date, end: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const diffMs = endDate.getTime() - startDate.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

// Calcular duração em formato legível
export const formatDuration = (start: string | Date, end: string | Date): string => {
  const diff = getDateDifference(start, end);
  
  if (diff.days > 0) {
    return `${diff.days}d ${diff.hours}h ${diff.minutes}m`;
  } else if (diff.hours > 0) {
    return `${diff.hours}h ${diff.minutes}m`;
  } else {
    return `${diff.minutes}m`;
  }
};

// Verificar se uma data é hoje
export const isToday = (date: string | Date): boolean => {
  const d = new Date(date);
  const today = new Date();
  
  return d.toDateString() === today.toDateString();
};

// Verificar se uma data é amanhã
export const isTomorrow = (date: string | Date): boolean => {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return d.toDateString() === tomorrow.toDateString();
};

// Verificar se uma data é ontem
export const isYesterday = (date: string | Date): boolean => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return d.toDateString() === yesterday.toDateString();
};

// Formatação relativa (ex: "há 2 horas")
export const formatRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `há ${days} dia${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return 'agora';
  }
};

// Adicionar dias a uma data
export const addDays = (date: string | Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Início do dia
export const startOfDay = (date: string | Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Fim do dia
export const endOfDay = (date: string | Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Início da semana
export const startOfWeek = (date: string | Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
  return new Date(d.setDate(diff));
};

// Fim da semana
export const endOfWeek = (date: string | Date): Date => {
  const start = startOfWeek(date);
  return addDays(start, 6);
};

// Início do mês
export const startOfMonth = (date: string | Date): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

// Fim do mês
export const endOfMonth = (date: string | Date): Date => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};