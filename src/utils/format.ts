/**
 * 💰 UTILITÁRIOS DE FORMATAÇÃO
 * Funções auxiliares para formatação de valores, textos e dados
 */

// Formatação de moeda
export const formatCurrency = (
  value: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Formatação de número
export const formatNumber = (
  value: number,
  decimals: number = 2,
  locale: string = 'pt-BR'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

// Formatação de porcentagem
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'pt-BR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Formatação de telefone brasileiro
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Formatação de CPF
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

// Formatação de CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return cnpj;
};

// Capitalizar primeira letra
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalizar primeira letra de cada palavra
export const titleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Truncar texto
export const truncate = (text: string, length: number = 50, suffix: string = '...'): string => {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
};

// Remover acentos
export const removeAccents = (text: string): string => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// Slug para URLs
export const createSlug = (text: string): string => {
  return removeAccents(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Formatação de tamanho de arquivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Formatação de status com cores
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Status gerais
    'active': 'green',
    'inactive': 'gray',
    'pending': 'yellow',
    'completed': 'green',
    'cancelled': 'red',
    
    // Status de limpeza
    'scheduled': 'blue',
    'in-progress': 'orange',
    'cleaning': 'orange',
    'available': 'green',
    'occupied': 'blue',
    'maintenance': 'yellow',
    'checkout': 'purple',
    
    // Status de pagamento
    'paid': 'green',
    'unpaid': 'red',
    'overdue': 'red',
    'approved': 'green',
    'rejected': 'red',
    
    // Status de funcionário
    'working': 'green',
    'break': 'yellow',
    'offline': 'gray',
    'vacation': 'blue',
    'sick': 'red',
  };
  
  return statusColors[status.toLowerCase()] || 'gray';
};

// Formatação de prioridade
export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    'low': 'green',
    'medium': 'yellow',
    'high': 'orange',
    'urgent': 'red',
  };
  
  return priorityColors[priority.toLowerCase()] || 'gray';
};

// Formatação de iniciais do nome
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Mascarar dados sensíveis
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) return data;
  
  const visible = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  
  return masked + visible;
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de CPF
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  
  let digit1 = 11 - (sum % 11);
  if (digit1 >= 10) digit1 = 0;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  
  let digit2 = 11 - (sum % 11);
  if (digit2 >= 10) digit2 = 0;
  
  return digit1 === parseInt(cleaned.charAt(9)) && digit2 === parseInt(cleaned.charAt(10));
};

// Gerar cor aleatória
export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};