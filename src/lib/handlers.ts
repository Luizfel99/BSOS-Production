/**
 * 🔧 SISTEMA DE HANDLERS UNIFICADO
 * Estrutura padrão para ações com lógica local e API calls
 */

import toast from 'react-hot-toast';

// Tipos para handlers padrão
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HandlerConfig {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

// Configurações padrão
const DEFAULT_CONFIG: HandlerConfig = {
  loadingMessage: 'Processando...',
  successMessage: 'Operação realizada com sucesso!',
  errorMessage: 'Erro ao processar operação',
  showToast: true,
};

/**
 * 🎯 Handler base para chamadas de API
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  config: HandlerConfig = {}
): Promise<ApiResponse<T>> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let toastId: string | undefined;

  try {
    // Mostrar loading toast
    if (finalConfig.showToast && finalConfig.loadingMessage) {
      toastId = toast.loading(finalConfig.loadingMessage);
    }

    // Fazer a requisição
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const result = await response.json();

    // Tratar resposta
    if (response.ok && result.success) {
      if (toastId && finalConfig.showToast) {
        toast.success(finalConfig.successMessage || result.message, { id: toastId });
      }
      return result;
    } else {
      throw new Error(result.message || result.error || 'Erro na API');
    }
  } catch (error) {
    console.error(`❌ API Error [${endpoint}]:`, error);
    
    if (toastId && finalConfig.showToast) {
      toast.error(finalConfig.errorMessage || (error as Error).message, { id: toastId });
    }
    
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * 🏠 HANDLERS PARA PROPRIEDADES
 */
export const propertyHandlers = {
  async viewDetails(propertyId: string) {
    console.log('🏠 Visualizando detalhes da propriedade:', propertyId);
    
    return await apiCall(`/api/properties/${propertyId}/details`, {}, {
      loadingMessage: 'Carregando detalhes da propriedade...',
      successMessage: 'Detalhes carregados com sucesso!',
    });
  },

  async scheduleCleaning(propertyId: string, data: any) {
    console.log('📅 Agendando limpeza para propriedade:', propertyId);
    
    return await apiCall(`/api/properties/${propertyId}/schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, {
      loadingMessage: 'Agendando limpeza...',
      successMessage: 'Limpeza agendada com sucesso!',
    });
  },

  async updateStatus(propertyId: string, status: string) {
    console.log('🔄 Atualizando status da propriedade:', propertyId, 'para:', status);
    
    return await apiCall(`/api/properties/${propertyId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }, {
      loadingMessage: 'Atualizando status...',
      successMessage: 'Status atualizado com sucesso!',
    });
  },
};

/**
 * 👥 HANDLERS PARA FUNCIONÁRIOS
 */
export const employeeHandlers = {
  async checkIn(employeeId: string, location?: { lat: number; lng: number }) {
    console.log('✅ Check-in do funcionário:', employeeId);
    
    return await apiCall(`/api/employees/${employeeId}/checkin`, {
      method: 'POST',
      body: JSON.stringify({ location, timestamp: new Date().toISOString() }),
    }, {
      loadingMessage: 'Registrando check-in...',
      successMessage: 'Check-in registrado com sucesso!',
    });
  },

  async checkOut(employeeId: string) {
    console.log('❌ Check-out do funcionário:', employeeId);
    
    return await apiCall(`/api/employees/${employeeId}/checkout`, {
      method: 'POST',
      body: JSON.stringify({ timestamp: new Date().toISOString() }),
    }, {
      loadingMessage: 'Registrando check-out...',
      successMessage: 'Check-out registrado com sucesso!',
    });
  },

  async updatePerformance(employeeId: string, performanceData: any) {
    console.log('📊 Atualizando performance do funcionário:', employeeId);
    
    return await apiCall(`/api/employees/${employeeId}/performance`, {
      method: 'PUT',
      body: JSON.stringify(performanceData),
    }, {
      loadingMessage: 'Atualizando performance...',
      successMessage: 'Performance atualizada com sucesso!',
    });
  },
};

/**
 * 💰 HANDLERS FINANCEIROS
 */
export const financeHandlers = {
  async createInvoice(invoiceData: any) {
    console.log('📄 Criando nova invoice');
    
    return await apiCall('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    }, {
      loadingMessage: 'Criando invoice...',
      successMessage: 'Invoice criada com sucesso!',
    });
  },

  async processPayment(paymentId: string, method: string) {
    console.log('💳 Processando pagamento:', paymentId);
    
    return await apiCall(`/api/payments/${paymentId}/process`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    }, {
      loadingMessage: 'Processando pagamento...',
      successMessage: 'Pagamento processado com sucesso!',
    });
  },

  async approvePayment(paymentId: string) {
    console.log('✅ Aprovando pagamento:', paymentId);
    
    return await apiCall(`/api/payments/approve`, {
      method: 'POST',
      body: JSON.stringify({ paymentId }),
    }, {
      loadingMessage: 'Aprovando pagamento...',
      successMessage: 'Pagamento aprovado com sucesso!',
    });
  },

  async refundPayment(paymentId: string, amount?: number) {
    console.log('💸 Processando reembolso:', paymentId);
    
    return await apiCall(`/api/payments/refund`, {
      method: 'POST',
      body: JSON.stringify({ paymentId, amount }),
    }, {
      loadingMessage: 'Processando reembolso...',
      successMessage: 'Reembolso processado com sucesso!',
    });
  },
};

/**
 * 📋 HANDLERS PARA CHECKLISTS
 */
export const checklistHandlers = {
  async create(checklistData: any) {
    console.log('📝 Criando novo checklist');
    
    return await apiCall('/api/checklists', {
      method: 'POST',
      body: JSON.stringify(checklistData),
    }, {
      loadingMessage: 'Criando checklist...',
      successMessage: 'Checklist criado com sucesso!',
    });
  },

  async complete(checklistId: string, data: any) {
    console.log('✅ Finalizando checklist:', checklistId);
    
    return await apiCall(`/api/checklists/${checklistId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }, {
      loadingMessage: 'Finalizando checklist...',
      successMessage: 'Checklist finalizado com sucesso!',
    });
  },

  async addItem(checklistId: string, itemData: any) {
    console.log('➕ Adicionando item ao checklist:', checklistId);
    
    return await apiCall(`/api/checklists/${checklistId}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    }, {
      loadingMessage: 'Adicionando item...',
      successMessage: 'Item adicionado com sucesso!',
    });
  },

  async uploadPhoto(checklistId: string, itemId: string, photoFile: File, type: string) {
    console.log('📸 Fazendo upload de foto para checklist:', checklistId);
    
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('type', type);
    formData.append('itemId', itemId);

    return await apiCall(`/checklists/${checklistId}/photos`, {
      method: 'POST',
      body: formData,
    }, {
      loadingMessage: 'Enviando foto...',
      successMessage: 'Foto enviada com sucesso!',
    });
  },

  async submitForReview(checklistId: string) {
    console.log('📤 Enviando checklist para revisão:', checklistId);
    
    return await apiCall(`/api/checklists/${checklistId}/submit`, {
      method: 'PATCH',
    }, {
      loadingMessage: 'Enviando para revisão...',
      successMessage: 'Checklist enviado para revisão!',
    });
  },
};

/**
 * 💬 HANDLERS DE COMUNICAÇÃO
 */
export const communicationHandlers = {
  async sendMessage(channelId: string, message: string, attachments?: File[]) {
    console.log('💬 Enviando mensagem para canal:', channelId);
    
    const formData = new FormData();
    formData.append('message', message);
    formData.append('channelId', channelId);
    
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    return await apiCall('/api/communication/send', {
      method: 'POST',
      body: formData,
    }, {
      loadingMessage: 'Enviando mensagem...',
      successMessage: 'Mensagem enviada!',
    });
  },

  async createNotification(notificationData: any) {
    console.log('🔔 Criando notificação');
    
    return await apiCall('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }, {
      loadingMessage: 'Criando notificação...',
      successMessage: 'Notificação criada!',
    });
  },

  async getChannels() {
    console.log('📋 Carregando canais de comunicação');
    
    return await apiCall('/api/communication/channels', {}, {
      loadingMessage: 'Carregando canais...',
      successMessage: 'Canais carregados!',
    });
  },
};

/**
 * 📊 HANDLERS PARA RELATÓRIOS
 */
export const reportHandlers = {
  async generate(reportType: string, filters: any) {
    console.log('📊 Gerando relatório:', reportType);
    
    return await apiCall('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type: reportType, filters }),
    }, {
      loadingMessage: 'Gerando relatório...',
      successMessage: 'Relatório gerado com sucesso!',
    });
  },

  async export(reportId: string, format: 'pdf' | 'excel') {
    console.log('📤 Exportando relatório:', reportId, 'formato:', format);
    
    return await apiCall(`/api/reports/export`, {
      method: 'POST',
      body: JSON.stringify({ reportId, format }),
    }, {
      loadingMessage: 'Exportando relatório...',
      successMessage: 'Relatório exportado com sucesso!',
    });
  },
};

/**
 * 🔧 HANDLERS UTILITÁRIOS
 */
export const utilHandlers = {
  // Handler genérico para ações locais (sem API)
  handleLocalAction(action: string, callback?: () => void) {
    console.log('🎯 Ação local:', action);
    toast.success(`${action} executado!`);
    
    if (callback) {
      callback();
    }
  },

  // Handler para ações assíncronas com feedback
  async handleAsyncAction(
    action: string, 
    asyncCallback: () => Promise<any>, 
    finalCallback?: () => void
  ) {
    console.log('⚡ Ação assíncrona:', action);
    toast.loading(action);
    
    try {
      const result = await asyncCallback();
      toast.dismiss();
      toast.success(`${action} - Concluído!`);
      
      if (finalCallback) {
        finalCallback();
      }
      
      return result;
    } catch (error) {
      toast.dismiss();
      toast.error(`Erro: ${action}`);
      console.error('Error in async action:', error);
      
      if (finalCallback) {
        finalCallback();
      }
      
      throw error;
    }
  },

  // Handler para abrir modais
  handleOpenModal(modalName: string, setModalState: (state: boolean) => void) {
    console.log('🗂️ Abrindo modal:', modalName);
    setModalState(true);
  },

  // Handler para navegação
  handleNavigation(path: string, router?: any) {
    console.log('🧭 Navegando para:', path);
    
    if (router) {
      router.push(path);
    } else {
      window.location.href = path;
    }
    
    toast.success('Redirecionando...');
  },
};

// Exportar toast para uso direto
export { toast };