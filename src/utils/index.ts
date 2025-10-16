/**
 * 🔧 ÍNDICE CENTRAL DOS UTILITÁRIOS
 * Exportações organizadas para facilitar importações
 */

// Utilitários de API
export * from './api';

// Utilitários de Data
export * from './date';

// Utilitários de Formatação
export * from './format';

// Re-exportações organizadas
export const ApiUtils = {
  request: require('./api').apiRequest,
  get: require('./api').apiGet,
  post: require('./api').apiPost,
  put: require('./api').apiPut,
  patch: require('./api').apiPatch,
  delete: require('./api').apiDelete,
  upload: require('./api').apiUpload,
  retry: require('./api').apiRetry,
  batch: require('./api').apiBatch,
  cache: require('./api').apiCache,
  getCached: require('./api').apiGetCached,
};

export const DateUtils = {
  format: require('./date').formatDate,
  formatTime: require('./date').formatTime,
  getDifference: require('./date').getDateDifference,
  formatDuration: require('./date').formatDuration,
  isToday: require('./date').isToday,
  isTomorrow: require('./date').isTomorrow,
  isYesterday: require('./date').isYesterday,
  formatRelative: require('./date').formatRelativeTime,
  addDays: require('./date').addDays,
  startOfDay: require('./date').startOfDay,
  endOfDay: require('./date').endOfDay,
  startOfWeek: require('./date').startOfWeek,
  endOfWeek: require('./date').endOfWeek,
  startOfMonth: require('./date').startOfMonth,
  endOfMonth: require('./date').endOfMonth,
};

export const FormatUtils = {
  currency: require('./format').formatCurrency,
  number: require('./format').formatNumber,
  percentage: require('./format').formatPercentage,
  phone: require('./format').formatPhone,
  cpf: require('./format').formatCPF,
  cnpj: require('./format').formatCNPJ,
  capitalize: require('./format').capitalize,
  titleCase: require('./format').titleCase,
  truncate: require('./format').truncate,
  removeAccents: require('./format').removeAccents,
  createSlug: require('./format').createSlug,
  fileSize: require('./format').formatFileSize,
  getStatusColor: require('./format').getStatusColor,
  getPriorityColor: require('./format').getPriorityColor,
  getInitials: require('./format').getInitials,
  maskSensitiveData: require('./format').maskSensitiveData,
  isValidEmail: require('./format').isValidEmail,
  isValidCPF: require('./format').isValidCPF,
  generateRandomColor: require('./format').generateRandomColor,
};