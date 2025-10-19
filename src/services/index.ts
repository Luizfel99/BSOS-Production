/**
 * 🔧 ÍNDICE CENTRAL DOS SERVIÇOS
 * Exportações organizadas por domínio para facilitar importações
 */

// Serviços de Limpeza
export * from './cleanings';

// Serviços de Propriedades
export * from './properties';

// Serviços de Tarefas
export * from './tasks';

// Serviços de Funcionários
export * from './employees';

// Serviços Financeiros
export * from './payments';

// Serviços de Comunicação
export * from './communication';

// Serviços de Checklists
export * from './checklists';

// Serviços de Relatórios
export * from './reports';

// Serviços existentes
export * from './apiIntegrations';
export * from './webhookHandlers';

// Re-exportações organizadas para facilitar uso
export const CleaningService = {
  create: require('./cleanings').createCleaning,
  get: require('./cleanings').getCleanings,
  start: require('./cleanings').startCleaning,
  complete: require('./cleanings').completeCleaning,
  cancel: require('./cleanings').cancelCleaning,
  updateStatus: require('./cleanings').updateCleaningStatus,
  evaluate: require('./cleanings').evaluateCleaning,
};

export const PropertyService = {
  create: require('./properties').createProperty,
  get: require('./properties').getProperties,
  getDetails: require('./properties').getPropertyDetails,
  update: require('./properties').updateProperty,
  schedule: require('./properties').schedulePropertyCleaning,
  updateStatus: require('./properties').updatePropertyStatus,
  getHistory: require('./properties').getPropertyCleaningHistory,
  delete: require('./properties').deleteProperty,
};

export const TaskService = {
  create: require('./tasks').createTask,
  get: require('./tasks').getTasks,
  getDetails: require('./tasks').getTaskDetails,
  update: require('./tasks').updateTask,
  start: require('./tasks').startTask,
  complete: require('./tasks').completeTask,
  cancel: require('./tasks').cancelTask,
  assign: require('./tasks').assignTask,
  getByEmployee: require('./tasks').getTasksByEmployee,
  delete: require('./tasks').deleteTask,
};

export const EmployeeService = {
  create: require('./employees').createEmployee,
  get: require('./employees').getEmployees,
  getProfiles: require('./employees').getEmployeeProfiles,
  getDetails: require('./employees').getEmployeeDetails,
  update: require('./employees').updateEmployee,
  checkin: require('./employees').employeeCheckin,
  checkout: require('./employees').employeeCheckout,
  getPerformance: require('./employees').getEmployeePerformance,
  updatePerformance: require('./employees').updateEmployeePerformance,
  getSchedule: require('./employees').getEmployeeSchedule,
  delete: require('./employees').deleteEmployee,
};

export const PaymentService = {
  create: require('./payments').createPayment,
  get: require('./payments').getPayments,
  approve: require('./payments').approvePayment,
  refund: require('./payments').processRefund,
  getEmployeePayments: require('./payments').getEmployeePayments,
  getBonusRules: require('./payments').getBonusRules,
  updateBonusRules: require('./payments').updateBonusRules,
  createInvoice: require('./payments').createInvoice,
  generateInvoice: require('./payments').generateInvoice,
  getInvoices: require('./payments').getInvoices,
};

export const CommunicationService = {
  sendMessage: require('./communication').sendMessage,
  getMessages: require('./communication').getMessages,
  createChannel: require('./communication').createChannel,
  getChannels: require('./communication').getChannels,
  markChannelAsRead: require('./communication').markChannelAsRead,
  createNotification: require('./communication').createNotification,
  getNotifications: require('./communication').getNotifications,
  markNotificationAsRead: require('./communication').markNotificationAsRead,
  markAllNotificationsAsRead: require('./communication').markAllNotificationsAsRead,
  deleteNotification: require('./communication').deleteNotification,
};

export const ChecklistService = {
  create: require('./checklists').createChecklist,
  get: require('./checklists').getChecklists,
  getTemplates: require('./checklists').getChecklistTemplates,
  getDetails: require('./checklists').getChecklistDetails,
  update: require('./checklists').updateChecklist,
  start: require('./checklists').startChecklist,
  complete: require('./checklists').completeChecklist,
  addItem: require('./checklists').addChecklistItem,
  updateItem: require('./checklists').updateChecklistItem,
  submitForReview: require('./checklists').submitChecklistForReview,
  delete: require('./checklists').deleteChecklist,
  cloneTemplate: require('./checklists').cloneChecklistTemplate,
};

export const ReportService = {
  generate: require('./reports').generateReport,
  export: require('./reports').exportReport,
  get: require('./reports').getReports,
  getDetails: require('./reports').getReportDetails,
  getEmployeePerformance: require('./reports').getEmployeePerformanceReport,
  getFinancial: require('./reports').getFinancialReport,
  getCleaning: require('./reports').getCleaningReport,
  getProperty: require('./reports').getPropertyReport,
  getClient: require('./reports').getClientReport,
  getDashboard: require('./reports').getDashboardAnalytics,
  getAdminStats: require('./reports').getAdminStats,
  getSupervisor: require('./reports').getSupervisorReports,
  exportCustom: require('./reports').exportCustomReport,
};