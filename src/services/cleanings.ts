import { ApiResponse } from '@/lib/handlers';

// Tipos para limpezas
export interface CleaningData {
  propertyId: string;
  employeeId?: string;
  scheduledDate?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedDuration?: number;
  checklist?: string[];
  notes?: string;
  type?: 'regular' | 'deep' | 'maintenance' | 'checkout';
}

export interface CleaningStatus {
  id: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  progress?: number;
  employeeId?: string;
  notes?: string;
}

/**
 * 🧹 SERVIÇOS DE LIMPEZA
 * Funções para gerenciar o ciclo completo de limpezas
 */

// Criar nova limpeza
export const createCleaning = async (data: CleaningData): Promise<ApiResponse> => {
  const res = await fetch('/api/cleanings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create cleaning: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar limpezas
export const getCleanings = async (filters?: {
  propertyId?: string;
  employeeId?: string;
  status?: string;
  date?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }
  
  const res = await fetch(`/api/cleanings?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch cleanings: ${res.statusText}`);
  }
  
  return res.json();
};

// Iniciar limpeza
export const startCleaning = async (cleaningId: string, employeeId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/cleanings/${cleaningId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to start cleaning: ${res.statusText}`);
  }
  
  return res.json();
};

// Finalizar limpeza
export const completeCleaning = async (
  cleaningId: string, 
  data: {
    notes?: string;
    photos?: string[];
    rating?: number;
    issues?: string[];
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/cleanings/${cleaningId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to complete cleaning: ${res.statusText}`);
  }
  
  return res.json();
};

// Cancelar limpeza
export const cancelCleaning = async (cleaningId: string, reason: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/cleanings/${cleaningId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to cancel cleaning: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar status da limpeza
export const updateCleaningStatus = async (
  cleaningId: string, 
  status: CleaningStatus['status'],
  notes?: string
): Promise<ApiResponse> => {
  const res = await fetch(`/api/cleanings/${cleaningId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update cleaning status: ${res.statusText}`);
  }
  
  return res.json();
};

// Avaliar limpeza (cliente)
export const evaluateCleaning = async (
  cleaningId: string,
  evaluation: {
    rating: number;
    feedback: string;
    photos?: string[];
    recommend?: boolean;
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/client/cleanings/${cleaningId}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evaluation),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to evaluate cleaning: ${res.statusText}`);
  }
  
  return res.json();
};