import { ApiResponse } from '@/lib/handlers';

// Tipos para checklists
export interface ChecklistData {
  name: string;
  description?: string;
  propertyId?: string;
  cleaningType: 'regular' | 'deep' | 'maintenance' | 'checkout';
  items: Array<{
    task: string;
    required: boolean;
    category?: string;
    estimatedTime?: number;
  }>;
  template?: boolean;
}

export interface ChecklistUpdate {
  name?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'reviewed';
  completedBy?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface ChecklistItemData {
  task: string;
  required: boolean;
  category?: string;
  estimatedTime?: number;
  order?: number;
}

/**
 * 📋 SERVIÇOS DE CHECKLISTS
 * Funções para gerenciar checklists e templates
 */

// Criar novo checklist
export const createChecklist = async (data: ChecklistData): Promise<ApiResponse> => {
  const res = await fetch('/api/checklists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create checklist: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar checklists
export const getChecklists = async (filters?: {
  propertyId?: string;
  cleaningType?: string;
  status?: string;
  template?: boolean;
  assignedTo?: string;
}): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
  }
  
  const res = await fetch(`/api/checklists?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch checklists: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar templates de checklist
export const getChecklistTemplates = async (cleaningType?: string): Promise<ApiResponse> => {
  const params = new URLSearchParams();
  params.append('template', 'true');
  
  if (cleaningType) {
    params.append('cleaningType', cleaningType);
  }
  
  const res = await fetch(`/api/checklists/templates?${params.toString()}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch checklist templates: ${res.statusText}`);
  }
  
  return res.json();
};

// Buscar detalhes de um checklist
export const getChecklistDetails = async (checklistId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}`);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch checklist details: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar checklist
export const updateChecklist = async (
  checklistId: string, 
  data: ChecklistUpdate
): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update checklist: ${res.statusText}`);
  }
  
  return res.json();
};

// Iniciar checklist
export const startChecklist = async (
  checklistId: string, 
  employeeId: string
): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to start checklist: ${res.statusText}`);
  }
  
  return res.json();
};

// Completar checklist
export const completeChecklist = async (
  checklistId: string,
  data: {
    completedItems: Array<{
      itemId: string;
      completed: boolean;
      notes?: string;
      photos?: string[];
    }>;
    notes?: string;
    quality?: number;
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to complete checklist: ${res.statusText}`);
  }
  
  return res.json();
};

// Adicionar item ao checklist
export const addChecklistItem = async (
  checklistId: string,
  itemData: ChecklistItemData
): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to add checklist item: ${res.statusText}`);
  }
  
  return res.json();
};

// Atualizar item do checklist
export const updateChecklistItem = async (
  checklistId: string,
  itemId: string,
  itemData: Partial<ChecklistItemData>
): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update checklist item: ${res.statusText}`);
  }
  
  return res.json();
};

// Enviar checklist para revisão
export const submitChecklistForReview = async (checklistId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}/submit`, {
    method: 'POST',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to submit checklist for review: ${res.statusText}`);
  }
  
  return res.json();
};

// Deletar checklist
export const deleteChecklist = async (checklistId: string): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${checklistId}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to delete checklist: ${res.statusText}`);
  }
  
  return res.json();
};

// Clonar template para novo checklist
export const cloneChecklistTemplate = async (
  templateId: string,
  data: {
    propertyId: string;
    assignedTo?: string;
    scheduledDate?: string;
  }
): Promise<ApiResponse> => {
  const res = await fetch(`/api/checklists/${templateId}/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to clone checklist template: ${res.statusText}`);
  }
  
  return res.json();
};