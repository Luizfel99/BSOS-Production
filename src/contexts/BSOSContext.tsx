'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

// ===== INTERFACES =====

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Task interface from BSOSCore
interface CleaningTask {
  id: string;
  property: string;
  type: 'normal' | 'deep' | 'move-out' | 'inspection';
  status: 'assigned' | 'in-progress' | 'review' | 'completed';
  assignedTo: string;
  scheduledDate: string;
  priority: 'low' | 'medium' | 'high';
  checklistCompleted: number;
  checklistTotal: number;
  estimatedDuration: number;
  notes?: string;
  integrationSource?: 'airbnb' | 'hostaway' | 'turno' | 'taskbird';
}

// Loading States
interface LoadingStates {
  globalLoading: boolean;
  connectingIntegration: boolean;
  creatingTask: boolean;
  uploadingPhoto: boolean;
  savingNote: boolean;
  finalizingChecklist: boolean;
  editingTemplate: boolean;
  loadingStats: boolean;
  updatingTaskStatus: boolean;
}

// Error States
interface ErrorStates {
  integration: string | null;
  task: string | null;
  photo: string | null;
  note: string | null;
  checklist: string | null;
  template: string | null;
  stats: string | null;
  taskUpdate: string | null;
}

// Context Value Interface
interface BSOSContextValue {
  // State
  tasks: CleaningTask[];
  loadingStates: LoadingStates;
  errorStates: ErrorStates;
  selectedTask: CleaningTask | null;
  updatingTaskId: string | null;

  // State Setters
  setTasks: React.Dispatch<React.SetStateAction<CleaningTask[]>>;
  setLoadingStates: React.Dispatch<React.SetStateAction<LoadingStates>>;
  setErrorStates: React.Dispatch<React.SetStateAction<ErrorStates>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<CleaningTask | null>>;
  setUpdatingTaskId: React.Dispatch<React.SetStateAction<string | null>>;

  // Core Functions
  updateTaskStatus: (taskId: string, newStatus: CleaningTask['status']) => Promise<void>;
  updateGlobalLoading: () => void;

  // Handler Functions
  handleChecklistTypeSelection: (type: string) => Promise<void>;
  handlePhotoUpload: (type: 'before' | 'after') => Promise<void>;
  handleSaveNote: () => Promise<void>;
  handleFinalizeChecklist: () => Promise<void>;
  handleEditTemplate: (type: string) => Promise<void>;
  handleViewStatistics: (type: string) => Promise<void>;
  handlePhotoSection: () => Promise<void>;
  handleReportsSection: () => Promise<void>;
  handleConnectIntegration: (integrationId: string) => Promise<void>;
  handleConfigureIntegration: (integrationId: string) => Promise<void>;
  handleSaveIntegrationSettings: () => Promise<void>;
  handleCreateTask: () => void;

  // Helper Functions
  isAnyApiCallInProgress: () => boolean;
}

// ===== CONTEXT CREATION =====

const BSOSContext = createContext<BSOSContextValue | undefined>(undefined);

// ===== MOCK DATA =====

const mockTasks: CleaningTask[] = [
  {
    id: '1',
    property: 'Apartamento Copacabana 301',
    type: 'normal',
    status: 'assigned',
    assignedTo: 'Maria Silva',
    scheduledDate: '2025-01-08 14:00',
    priority: 'high',
    checklistCompleted: 0,
    checklistTotal: 12,
    estimatedDuration: 120,
    notes: 'Check-out às 11h, check-in às 15h',
    integrationSource: 'airbnb',
  },
  {
    id: '2',
    property: 'Casa Barra da Tijuca',
    type: 'deep',
    status: 'in-progress',
    assignedTo: 'João Santos',
    scheduledDate: '2025-01-08 09:00',
    priority: 'medium',
    checklistCompleted: 8,
    checklistTotal: 18,
    estimatedDuration: 240,
    notes: 'Limpeza pós obra',
    integrationSource: 'hostaway',
  },
  {
    id: '3',
    property: 'Loft Ipanema Studio',
    type: 'move-out',
    status: 'review',
    assignedTo: 'Ana Costa',
    scheduledDate: '2025-01-08 16:00',
    priority: 'low',
    checklistCompleted: 15,
    checklistTotal: 15,
    estimatedDuration: 180,
    notes: 'Inquilino mudou ontem',
    integrationSource: 'turno',
  }
];

// ===== PROVIDER COMPONENT =====

export function BSOSProvider({ children }: { children: ReactNode }) {
  // ===== HOOKS =====
  const { success, error, info } = useNotifications();
  
  // ===== STATE =====
  const [tasks, setTasks] = useState<CleaningTask[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<CleaningTask | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    globalLoading: false,
    connectingIntegration: false,
    creatingTask: false,
    uploadingPhoto: false,
    savingNote: false,
    finalizingChecklist: false,
    editingTemplate: false,
    loadingStats: false,
    updatingTaskStatus: false,
  });

  const [errorStates, setErrorStates] = useState<ErrorStates>({
    integration: null,
    task: null,
    photo: null,
    note: null,
    checklist: null,
    template: null,
    stats: null,
    taskUpdate: null,
  });

  // ===== HELPER FUNCTIONS =====

  const isAnyApiCallInProgress = useCallback(() => {
    return Object.values(loadingStates).some(loading => loading === true);
  }, [loadingStates]);

  const updateGlobalLoading = useCallback(() => {
    const anyLoading = Object.entries(loadingStates)
      .filter(([key]) => key !== 'globalLoading')
      .some(([, value]) => value === true);
    
    if (loadingStates.globalLoading !== anyLoading) {
      setLoadingStates(prev => ({ ...prev, globalLoading: anyLoading }));
    }
  }, [loadingStates]);

  // Effect to update global loading state
  React.useEffect(() => {
    updateGlobalLoading();
  }, [updateGlobalLoading]);

  // ===== CORE FUNCTIONS =====

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: CleaningTask['status']) => {
    try {
      // Set loading state
      setLoadingStates(prev => ({ ...prev, updatingTaskStatus: true }));
      setErrorStates(prev => ({ ...prev, taskUpdate: null }));
      setUpdatingTaskId(taskId);

      console.log(`🔄 Starting update: Task ${taskId} -> ${newStatus}`);

      // Optimistic update for immediate UI feedback
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );

      // API call to update task status
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task status: ${response.statusText}`);
      }

      const result: ApiResponse<{ task: CleaningTask }> = await response.json();

      if (result.success && result.data) {
        console.log(`✅ Task ${taskId} status updated successfully:`, result.data);
        
        // Update with actual server response
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, ...result.data!.task }
              : task
          )
        );

        // Show success toast
        success(`Task status updated to ${newStatus}!`);
      } else {
        throw new Error(result.error || 'Failed to update task status');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to update task status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task status';
      setErrorStates(prev => ({ ...prev, taskUpdate: errorMessage }));
      
      // Revert optimistic update on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: task.status } // Keep original status
            : task
        )
      );

      // Show error toast
      error(`Failed to update task: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingTaskStatus: false }));
      setUpdatingTaskId(null);
    }
  }, []);

  // ===== HANDLER FUNCTIONS =====

  const handleChecklistTypeSelection = useCallback(async (type: string) => {
    success(`Checklist type ${type} selected!`);
    // Additional logic can be added here
  }, []);

  const handlePhotoUpload = useCallback(async (type: 'before' | 'after') => {
    try {
      setLoadingStates(prev => ({ ...prev, uploadingPhoto: true }));
      setErrorStates(prev => ({ ...prev, photo: null }));

      console.log(`🔄 Starting photo upload: ${type}`);

      // Simulate file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      return new Promise<void>((resolve, reject) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            reject(new Error('No file selected'));
            return;
          }

          try {
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('type', type);
            formData.append('taskId', selectedTask?.id || 'default');
            formData.append('userId', 'current-user');

            const response = await fetch('/api/photos/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Failed to upload photo: ${response.statusText}`);
            }

            const result: ApiResponse = await response.json();

            if (result.success) {
              console.log(`✅ Photo uploaded successfully:`, result.data);
              success(`${type} photo uploaded successfully!`);
              resolve();
            } else {
              throw new Error(result.error || 'Failed to upload photo');
            }
          } catch (error) {
            reject(error);
          }
        };

        input.click();
      });

    } catch (err) {
      console.error('❌ ERROR: Failed to upload photo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo';
      setErrorStates(prev => ({ ...prev, photo: errorMessage }));
      error(`Failed to upload photo: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, uploadingPhoto: false }));
    }
  }, [selectedTask]);

  const handleSaveNote = useCallback(async () => {
    if (!selectedTask) {
      error('No task selected');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, savingNote: true }));
      setErrorStates(prev => ({ ...prev, note: null }));

      console.log(`🔄 Saving note for task: ${selectedTask.id}`);

      const response = await fetch(`/api/tasks/${selectedTask.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: selectedTask.notes || '',
          userId: 'current-user',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save note: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log(`✅ Note saved successfully:`, result.data);
        success('Note saved successfully!');
      } else {
        throw new Error(result.error || 'Failed to save note');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to save note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save note';
      setErrorStates(prev => ({ ...prev, note: errorMessage }));
      error(`Failed to save note: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, savingNote: false }));
    }
  }, [selectedTask]);

  const handleFinalizeChecklist = useCallback(async () => {
    if (!selectedTask) {
      error('No task selected');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, finalizingChecklist: true }));
      setErrorStates(prev => ({ ...prev, checklist: null }));

      console.log(`🔄 Finalizing checklist for task: ${selectedTask.id}`);

      const response = await fetch(`/api/checklists/${selectedTask.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedItems: [],
          notes: selectedTask.notes || '',
          finalPhotos: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to finalize checklist: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log(`✅ Checklist finalized successfully:`, result.data);
        success('Checklist finalized successfully!');
        
        // Update task status to completed
        await updateTaskStatus(selectedTask.id, 'completed');
      } else {
        throw new Error(result.error || 'Failed to finalize checklist');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to finalize checklist:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to finalize checklist';
      setErrorStates(prev => ({ ...prev, checklist: errorMessage }));
      error(`Failed to finalize checklist: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, finalizingChecklist: false }));
    }
  }, [selectedTask, updateTaskStatus]);

  const handleEditTemplate = useCallback(async (type: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, editingTemplate: true }));
      setErrorStates(prev => ({ ...prev, template: null }));

      console.log(`🔄 Editing template: ${type}`);

      const response = await fetch(`/api/checklists/templates/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${type} Checklist Template`,
          items: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit template: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log(`✅ Template edited successfully:`, result.data);
        success(`${type} template updated successfully!`);
      } else {
        throw new Error(result.error || 'Failed to edit template');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to edit template:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit template';
      setErrorStates(prev => ({ ...prev, template: errorMessage }));
      error(`Failed to edit template: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, editingTemplate: false }));
    }
  }, []);

  const handleViewStatistics = useCallback(async (type: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, loadingStats: true }));
      setErrorStates(prev => ({ ...prev, stats: null }));

      console.log(`🔄 Loading statistics for: ${type}`);

      const response = await fetch(`/api/statistics/checklist-templates/${type}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to load statistics: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log(`✅ Statistics loaded successfully:`, result.data);
        success(`${type} statistics loaded!`);
      } else {
        throw new Error(result.error || 'Failed to load statistics');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to load statistics:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics';
      setErrorStates(prev => ({ ...prev, stats: errorMessage }));
      error(`Failed to load statistics: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingStats: false }));
    }
  }, []);

  const handlePhotoSection = useCallback(async () => {
    info('Opening photo upload section...');
    // Additional logic for photo section can be added here
  }, []);

  const handleReportsSection = useCallback(async () => {
    info('Opening reports section...');
    // Additional logic for reports section can be added here
  }, []);

  const handleConnectIntegration = useCallback(async (integrationId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, connectingIntegration: true }));
      setErrorStates(prev => ({ ...prev, integration: null }));

      console.log(`🔄 Connecting integration: ${integrationId}`);

      const response = await fetch(`/api/integrations/${integrationId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentials: {
            apiKey: 'test-api-key',
            apiSecret: 'test-api-secret',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to connect integration: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log(`✅ Integration ${integrationId} connected successfully:`, result.data);
        success(`Integration ${integrationId} connected successfully!`);
      } else {
        throw new Error(result.error || 'Failed to connect integration');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to connect integration:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect integration';
      setErrorStates(prev => ({ ...prev, integration: errorMessage }));
      error(`Failed to connect integration: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, connectingIntegration: false }));
    }
  }, []);

  const handleConfigureIntegration = useCallback(async (integrationId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, connectingIntegration: true }));
      setErrorStates(prev => ({ ...prev, integration: null }));

      console.log(`🔄 Configuring integration: ${integrationId}`);

      const response = await fetch(`/api/integrations/${integrationId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            syncInterval: 30,
            autoSync: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to configure integration: ${response.statusText}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        console.log(`✅ Integration ${integrationId} configured successfully:`, result.data);
        success(`Integration ${integrationId} configured successfully!`);
      } else {
        throw new Error(result.error || 'Failed to configure integration');
      }

    } catch (err) {
      console.error('❌ ERROR: Failed to configure integration:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to configure integration';
      setErrorStates(prev => ({ ...prev, integration: errorMessage }));
      error(`Failed to configure integration: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, connectingIntegration: false }));
    }
  }, []);

  const handleSaveIntegrationSettings = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, connectingIntegration: true }));
      setErrorStates(prev => ({ ...prev, integration: null }));

      console.log('🔄 Saving integration settings');

      const settingsData = {
        globalSettings: {
          maxConcurrentSyncs: 3,
          defaultSyncInterval: 60,
        },
        integrationSettings: [],
      };

      const response = await fetch('/api/integrations/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save integration settings: ${response.statusText}`);
      }

      const result: ApiResponse<{ saved: boolean }> = await response.json();

      if (result.success) {
        console.log('✅ Integration settings saved successfully');
        success('Integration settings saved successfully!');
      } else {
        throw new Error(result.error || 'Failed to save integration settings');
      }
    } catch (err) {
      console.error('❌ ERROR: Failed to save integration settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save integration settings';
      setErrorStates(prev => ({ ...prev, integration: errorMessage }));
      error(`Failed to save integration settings: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, connectingIntegration: false }));
    }
  }, []);

  const handleCreateTask = useCallback(() => {
    info('Opening task creation modal...');
    // Additional logic for creating tasks can be added here
  }, []);

  // ===== CONTEXT VALUE =====

  const value: BSOSContextValue = {
    // State
    tasks,
    loadingStates,
    errorStates,
    selectedTask,
    updatingTaskId,

    // State Setters
    setTasks,
    setLoadingStates,
    setErrorStates,
    setSelectedTask,
    setUpdatingTaskId,

    // Core Functions
    updateTaskStatus,
    updateGlobalLoading,

    // Handler Functions
    handleChecklistTypeSelection,
    handlePhotoUpload,
    handleSaveNote,
    handleFinalizeChecklist,
    handleEditTemplate,
    handleViewStatistics,
    handlePhotoSection,
    handleReportsSection,
    handleConnectIntegration,
    handleConfigureIntegration,
    handleSaveIntegrationSettings,
    handleCreateTask,

    // Helper Functions
    isAnyApiCallInProgress,
  };

  return (
    <BSOSContext.Provider value={value}>
      {children}
    </BSOSContext.Provider>
  );
}

// ===== CUSTOM HOOK =====

export function useBSOSActions() {
  const context = useContext(BSOSContext);
  if (context === undefined) {
    throw new Error('useBSOSActions must be used within a BSOSProvider');
  }
  return context;
}

// Export types for external use
export type { BSOSContextValue, CleaningTask, LoadingStates, ErrorStates };