'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useBSOSActions, CleaningTask } from '@/contexts/BSOSContext';
import { useMediaQuery, useMobileFirst } from '@/hooks/useMediaQuery';
import ResponsiveNavigation from '@/components/ResponsiveNavigation';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Eye, 
  Play, 
  CheckCircle, 
  Upload, 
  Calendar, 
  Settings, 
  Camera, 
  FileText, 
  X, 
  Plus,
  Pencil,
  Trash2,
  Save,
  Clock,
  Loader2,
  Menu
} from 'lucide-react';

// ===== INTERFACES TYPESCRIPT =====

// Respostas da API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Integração
interface IntegrationData {
  id: string;
  platform: 'airbnb' | 'hostaway' | 'turno' | 'taskbird';
  apiKey?: string;
  webhookUrl?: string;
  syncFrequency: number;
  autoCreateTasks: boolean;
}

interface IntegrationResponse {
  id: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  lastSync?: string;
  properties: number;
  tasksCreated: number;
}

// Tarefas de limpeza
interface TaskCreationData {
  propertyId: string;
  type: 'normal' | 'deep' | 'move-out' | 'inspection';
  assignedTo: string;
  scheduledDate: string;
  priority: 'low' | 'medium' | 'high';
  checklistType: string;
  estimatedDuration: number;
  notes?: string;
  integrationSource?: string;
}

interface TaskResponse {
  id: string;
  property: string;
  status: 'assigned' | 'in-progress' | 'review' | 'completed';
  assignedTo: string;
  createdAt: string;
  checklistCompleted: number;
  checklistTotal: number;
}

// Checklist
interface ChecklistTemplateData {
  type: string;
  name: string;
  items: Array<{
    task: string;
    category: string;
    photoRequired: boolean;
    timeEstimate: number;
  }>;
}

interface ChecklistCompletionData {
  taskId: string;
  completedItems: Array<{
    itemId: string;
    completed: boolean;
    notes?: string;
    photoUrls?: string[];
    timeSpent: number;
  }>;
  notes: string;
  finalPhotos: string[];
}

// Upload de fotos
interface PhotoUploadData {
  id: string;
  url: string;
  taskId: string;
  itemId?: string;
  type: 'before' | 'after' | 'detail' | 'final';
  category: string;
  notes?: string;
  uploadedAt: string;
  metadata?: {
    size: number;
    dimensions: { width: number; height: number };
  };
}

interface PhotoUploadResponse {
  id: string;
  url: string;
  thumbnailUrl: string;
  uploadedAt: string;
}

// Estados de loading
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

// Estados de erro
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

// Interface para checklist items
interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  completed: boolean;
  photoRequired: boolean;
  notes?: string;
  timeCompleted?: string;
}

// Interface para upload de fotos
interface PhotoUpload {
  id: string;
  taskId: string;
  type: 'before' | 'after' | 'detail';
  category: string;
  url: string;
  timestamp: string;
  notes?: string;
}

// Mock data para demonstração
const mockTasks: CleaningTask[] = [
  {
    id: '001',
    property: 'Apartamento Centro - A12, Rua das Flores, 123 - Apt 12',
    type: 'normal',
    status: 'assigned',
    assignedTo: 'Maria Silva',
    scheduledDate: '2025-01-08T14:00:00',
    estimatedDuration: 120,
    priority: 'high',
    checklistCompleted: 0,
    checklistTotal: 25,
    notes: '',
    integrationSource: 'airbnb',
  },
  {
    id: '002',
    property: 'Casa Praia - Villa Sunset, Av. Beira Mar, 456',
    type: 'deep',
    status: 'in-progress',
    assignedTo: 'João Santos',
    scheduledDate: '2025-01-08T09:00:00',
    estimatedDuration: 240,
    priority: 'medium',
    checklistCompleted: 15,
    checklistTotal: 40,
    notes: 'Geladeira precisa desgelo, Chave reserva no cofre',
    integrationSource: 'hostaway',
  },
  {
    id: '003',
    property: 'Apartamento Copacabana - B7, Av. Atlântica, 789 - Apt 7B',
    type: 'move-out',
    status: 'review',
    assignedTo: 'Ana Costa',
    scheduledDate: '2025-01-08T08:00:00',
    estimatedDuration: 300,
    priority: 'high',
    checklistCompleted: 35,
    checklistTotal: 35,
    notes: 'Limpeza completa realizada, Todas as fotos enviadas',
    integrationSource: 'turno'
  }
];

const checklistTemplates = {
  normal: [
    { id: '1', task: 'Aspirar todos os cômodos', category: 'Limpeza Geral', completed: false, photoRequired: true },
    { id: '2', task: 'Limpar banheiros (pia, vaso, box)', category: 'Banheiro', completed: false, photoRequired: true },
    { id: '3', task: 'Fazer camas com roupa limpa', category: 'Quartos', completed: false, photoRequired: true },
    { id: '4', task: 'Limpar cozinha (pia, fogão, geladeira)', category: 'Cozinha', completed: false, photoRequired: true },
    { id: '5', task: 'Organizar sala de estar', category: 'Sala', completed: false, photoRequired: true },
    { id: '6', task: 'Varrer e passar pano nas áreas', category: 'Limpeza Geral', completed: false, photoRequired: false },
    { id: '7', task: 'Limpar vidros e espelhos', category: 'Acabamento', completed: false, photoRequired: true },
    { id: '8', task: 'Reposição de amenities', category: 'Amenities', completed: false, photoRequired: false },
    { id: '9', task: 'Verificar funcionamento AC', category: 'Equipamentos', completed: false, photoRequired: false },
    { id: '10', task: 'Inspeção final geral', category: 'Inspeção', completed: false, photoRequired: true }
  ],
  deep: [
    { id: '1', task: 'Limpeza completa de azulejos', category: 'Banheiro', completed: false, photoRequired: true },
    { id: '2', task: 'Desincrustação de box e metais', category: 'Banheiro', completed: false, photoRequired: true },
    { id: '3', task: 'Limpeza interna de eletrodomésticos', category: 'Cozinha', completed: false, photoRequired: true },
    { id: '4', task: 'Limpeza de forno e micro-ondas', category: 'Cozinha', completed: false, photoRequired: true },
    { id: '5', task: 'Limpeza de vidros (interno/externo)', category: 'Geral', completed: false, photoRequired: true },
    { id: '6', task: 'Aspirar e limpar embaixo dos móveis', category: 'Geral', completed: false, photoRequired: false },
    { id: '7', task: 'Limpeza de lustres e luminárias', category: 'Geral', completed: false, photoRequired: true },
    { id: '8', task: 'Limpeza de rodapés e cantos', category: 'Detalhes', completed: false, photoRequired: false },
    { id: '9', task: 'Higienização de colchões', category: 'Quartos', completed: false, photoRequired: true },
    { id: '10', task: 'Organização completa de armários', category: 'Organização', completed: false, photoRequired: true }
  ],
  'move-out': [
    { id: '1', task: 'Limpeza completa de todas as superfícies', category: 'Geral', completed: false, photoRequired: true },
    { id: '2', task: 'Limpeza interna de todos os armários', category: 'Armários', completed: false, photoRequired: true },
    { id: '3', task: 'Limpeza completa de eletrodomésticos', category: 'Eletrodomésticos', completed: false, photoRequired: true },
    { id: '4', task: 'Limpeza de paredes e tetos', category: 'Estrutural', completed: false, photoRequired: true },
    { id: '5', task: 'Desincrustação completa de banheiros', category: 'Banheiro', completed: false, photoRequired: true },
    { id: '6', task: 'Limpeza de pisos e rejuntes', category: 'Pisos', completed: false, photoRequired: true },
    { id: '7', task: 'Limpeza de luminárias e ventiladores', category: 'Iluminação', completed: false, photoRequired: true },
    { id: '8', task: 'Verificação e limpeza de ralos', category: 'Hidráulica', completed: false, photoRequired: false },
    { id: '9', task: 'Inspeção de danos estruturais', category: 'Inspeção', completed: false, photoRequired: true },
    { id: '10', task: 'Documentação fotográfica completa', category: 'Documentação', completed: false, photoRequired: true }
  ],
  inspection: [
    { id: '1', task: 'Verificar limpeza geral', category: 'Qualidade', completed: false, photoRequired: true },
    { id: '2', task: 'Testar equipamentos eletrônicos', category: 'Equipamentos', completed: false, photoRequired: false },
    { id: '3', task: 'Verificar amenities completos', category: 'Amenities', completed: false, photoRequired: true },
    { id: '4', task: 'Inspeção de segurança', category: 'Segurança', completed: false, photoRequired: false },
    { id: '5', task: 'Verificar organização geral', category: 'Organização', completed: false, photoRequired: true },
    { id: '6', task: 'Aprovar ou reprovar limpeza', category: 'Aprovação', completed: false, photoRequired: false }
  ]
};

export default function BSOSCore() {
  const { t } = useTranslation();
  const { success, error, warning, info } = useNotifications();
  const { 
    user, 
    hasPermission, 
    canAccessFeature, 
    getDashboardConfig,
    filterMenuByPermissions,
    shouldShowAdvancedFeatures 
  } = useAuth();
  
  // Early return if no user is authenticated
  if (!user) {
    return null;
  }
  
  // Get all BSOS actions and state from context
  const {
    // State
    tasks,
    loadingStates,
    errorStates,
    selectedTask,
    updatingTaskId,
    
    // State setters
    setSelectedTask,
    setLoadingStates,
    setErrorStates,
    setUpdatingTaskId,
    setTasks,
    
    // Functions that are NOT locally defined
    isAnyApiCallInProgress,
  } = useBSOSActions();

  // Local UI state (not shared globally)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChecklist, setShowChecklist] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [integrationsModalOpen, setIntegrationsModalOpen] = useState(false);
  const [checklistTypeModalOpen, setChecklistTypeModalOpen] = useState(false);
  const [selectedChecklistType, setSelectedChecklistType] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // RBAC-related state
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

  // Responsive behavior using custom hooks
  const { isMobile, isTablet, isDesktop, screenWidth } = useMediaQuery();
  const { isMobileOrTablet, isDesktopOrLarger } = useMobileFirst();

  // Handle escape key and resize events for mobile nav
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };

    const handleResize = () => {
      // Close mobile nav when screen becomes large
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileNavOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-close mobile nav when becoming desktop
  useEffect(() => {
    if (isDesktopOrLarger) {
      setIsMobileNavOpen(false);
    }
  }, [isDesktopOrLarger]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileNavOpen]);

  // Filtrar tarefas baseado no tipo de usuário
  const userTasks = user?.role === 'cleaner' 
    ? tasks.filter(task => task.assignedTo === user.name)
    : tasks;

  // Spinner Component
  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 font-medium">Processing...</p>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'review': return 'Under Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'normal': return '';
      case 'deep': return '';
      case 'move-out': return '';
      case 'inspection': return '';
      default: return '';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'normal': return 'Standard Cleaning';
      case 'deep': return 'Deep Cleaning';
      case 'move-out': return 'Move-out Cleaning';
      case 'inspection': return 'Quality Inspection';
      default: return type;
    }
  };

  const getIntegrationLogo = (source?: string) => {
    switch (source) {
      case 'airbnb': return 'ABB';
      case 'hostaway': return 'HST';
      case 'turno': return 'TRN';
      case 'taskbird': return 'TSK';
      default: return 'SYS';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: CleaningTask['status']) => {
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

      // For demo purposes, simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // MOCK API CALL - In production, replace with actual API
      console.log(`📝 MOCK: Would call PUT /api/tasks?id=${taskId} with status: ${newStatus}`);
      
      // Simulate successful update
      const mockSuccess = true;
      
      if (mockSuccess) {
        // Clear any previous errors on success
        setErrorStates(prev => ({ ...prev, taskUpdate: null }));
        
        // Show success notification
        success(`Task status updated to ${newStatus.replace('-', ' ')} successfully!`);
        
        console.log(`✅ SUCCESS: Task ${taskId} status updated to ${newStatus} successfully`);
      } else {
        throw new Error('Failed to update task status');
      }
      
    } catch (err) {
      console.error('❌ ERROR: Failed to update task status:', err);
      
      // Revert optimistic update
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task } // This would need to restore original status - you might want to store original state
            : task
        )
      );
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task status';
      setErrorStates(prev => ({ ...prev, taskUpdate: errorMessage }));
      
      // Show error notification
      error(`Failed to update task status: ${errorMessage}`);
      
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingTaskStatus: false }));
      setUpdatingTaskId(null);
      console.log(`🏁 FINISHED: Update process completed for task ${taskId}`);
    }
  };

  const handleChecklistTypeSelection = async (type: string) => {
    info(`Checklist type ${type} selected!`);
    setSelectedChecklistType(type);
    setChecklistTypeModalOpen(true);
  };

  const handlePhotoUpload = async (type: 'before' | 'after') => {
    try {
      setLoadingStates(prev => ({ ...prev, uploadingPhoto: true }));
      setErrorStates(prev => ({ ...prev, photo: null }));
      setUploadingPhoto(true);
      
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = false;
      
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          // Create FormData for file upload
          const formData = new FormData();
          formData.append('photo', file);
          formData.append('type', type);
          formData.append('taskId', selectedTask?.id || '');
          
          // MOCK API CALL - For demo purposes
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          console.log(`📝 MOCK: Would upload ${type} photo for task ${selectedTask?.id}`);
          
          // Simulate successful upload
          const mockResult = {
            success: true,
            data: {
              url: `https://mock-storage.com/photos/${Date.now()}-${type}.jpg`,
              timestamp: new Date().toISOString(),
              notes: ''
            }
          };

          if (mockResult.success && mockResult.data) {
            console.log(`✅ Photo uploaded successfully:`, mockResult.data);
            
            // Show success notification
            success(`${type === 'before' ? 'Before' : 'After'} photo uploaded successfully!`);
            
            // TODO: You can update task state with photo URLs here when photos property is added to CleaningTask
            // if (selectedTask) {
            //   setTasks(prevTasks => 
            //     prevTasks.map(task => 
            //       task.id === selectedTask.id 
            //         ? { 
            //             ...task, 
            //             photos: {
            //               ...task.photos,
            //               [type]: mockResult.data!.url
            //             }
            //           }
            //         : task
            //     )
            //   );
            // }
          } else {
            throw new Error('Failed to upload photo - mock error');
          }
        } catch (err) {
          console.error('❌ ERROR: Photo upload failed:', err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to upload photo';
          setErrorStates(prev => ({ ...prev, photo: errorMessage }));
          
          // Show error notification
          error(`Failed to upload photo: ${errorMessage}`);
        }
      };
      
      // Trigger file selection
      input.click();
      
    } catch (err) {
      console.error('❌ ERROR: Failed to initialize photo upload:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize photo upload';
      setErrorStates(prev => ({ ...prev, photo: errorMessage }));
      
      // Show error notification
      error(`Failed to initialize photo upload: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, uploadingPhoto: false }));
      setUploadingPhoto(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedTask) {
      setErrorStates(prev => ({ ...prev, note: 'Nenhuma tarefa selecionada para salvar nota' }));
      error('No task selected to save note');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, savingNote: true }));
      setErrorStates(prev => ({ ...prev, note: null }));

      // Get note content from form - you'll need to add a ref or state for the note input
      const noteContent = ''; // This should come from your note input field

      const response = await fetch(`/api/tasks/${selectedTask.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: noteContent,
          type: 'field_note',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save note: ${response.statusText}`);
      }

      const result: ApiResponse<{ note: any }> = await response.json();

      if (result.success && result.data) {
        console.log('✅ Note saved successfully:', result.data);
        
        // Show success toast
        success('Field note saved successfully!');
        
        // Clear note input or update UI as needed
      } else {
        throw new Error(result.error || 'Failed to save note');
      }
    } catch (err) {
      console.error('❌ ERROR: Failed to save note:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save note';
      setErrorStates(prev => ({ ...prev, note: errorMessage }));
      
      // Show error notification
      error(`Failed to save note: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, savingNote: false }));
    }
  };

  const handleFinalizeChecklist = async () => {
    if (!selectedTask) {
      setErrorStates(prev => ({ ...prev, checklist: 'Nenhuma tarefa selecionada para finalizar checklist' }));
      error('No task selected to finalize checklist');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, finalizingChecklist: true }));
      setErrorStates(prev => ({ ...prev, checklist: null }));

      // Collect checklist completion data
      const checklistData = {
        taskId: selectedTask.id,
        completedItems: [], // This should come from your checklist form state
        qualityScore: 95, // This should be calculated based on checklist completion
        notes: 'Checklist finalizado através do sistema BSOS',
        completedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/checklists/${selectedTask.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checklistData),
      });

      if (!response.ok) {
        throw new Error(`Failed to finalize checklist: ${response.statusText}`);
      }

      const result: ApiResponse<{ checklist: any; updatedTask: CleaningTask }> = await response.json();

      if (result.success && result.data) {
        console.log('✅ Checklist finalized successfully:', result.data);
        
        // Show success toast
        success('Checklist finalized successfully!');
        
        // Update task status and close checklist modal
        if (result.data.updatedTask) {
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === selectedTask.id 
                ? result.data!.updatedTask
                : task
            )
          );
        }
        
        setShowChecklist(false);
        setSelectedTask(null);
      } else {
        throw new Error(result.error || 'Failed to finalize checklist');
      }
    } catch (err) {
      console.error('❌ ERROR: Failed to finalize checklist:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to finalize checklist';
      setErrorStates(prev => ({ ...prev, checklist: errorMessage }));
      
      // Show error notification
      error(`Failed to finalize checklist: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, finalizingChecklist: false }));
    }
  };

  const handleEditTemplate = async (type: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, editingTemplate: true }));
      setErrorStates(prev => ({ ...prev, template: null }));

      const response = await fetch(`/api/checklists/templates/${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }

      const result: ApiResponse<ChecklistTemplateData> = await response.json();

      if (result.success && result.data) {
        console.log(`✅ Template ${type} loaded for editing:`, result.data);
        
        // Show success toast
        success(`Template ${type} loaded successfully for editing!`);
        
        // Here you would open a template editor modal/component
        // For now, we'll just show a success message
        console.log(`Template ${type} editor would open here`);
      } else {
        throw new Error(result.error || 'Failed to load template');
      }
    } catch (err) {
      console.error('❌ ERROR: Failed to load template for editing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load template';
      setErrorStates(prev => ({ ...prev, template: errorMessage }));
      
      // Show error notification
      error(`Failed to load template: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, editingTemplate: false }));
    }
  };

  const handleViewStatistics = async (type: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, loadingStats: true }));
      setErrorStates(prev => ({ ...prev, stats: null }));

      const response = await fetch(`/api/statistics/checklist-templates/${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load statistics: ${response.statusText}`);
      }

      const result: ApiResponse<{
        averageTime: number;
        approvalRate: number;
        completionRate: number;
        totalCompleted: number;
        lastWeekComparision: number;
      }> = await response.json();

      if (result.success && result.data) {
        const stats = result.data;
        console.log(`✅ Statistics for ${type} loaded:`, stats);
        
        // Show success notification with statistics summary
        success(
          `📊 Statistics for ${type} loaded!\n` +
          `⏱️ Avg time: ${stats.averageTime}min | ✅ Approval: ${stats.approvalRate}%`,
          { duration: 4000 }
        );
        
        // Display statistics - you might want to show this in a modal or update UI
        console.log(
          `📊 Estatísticas de ${type}:\n` +
          `⏱️ Tempo médio: ${stats.averageTime}min\n` +
          `✅ Taxa de aprovação: ${stats.approvalRate}%\n` +
          `📋 Taxa de conclusão: ${stats.completionRate}%\n` +
          `📈 Total completados: ${stats.totalCompleted}\n` +
          `📊 Comparação semana passada: ${stats.lastWeekComparision > 0 ? '+' : ''}${stats.lastWeekComparision}%`
        );
      } else {
        throw new Error(result.error || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('❌ ERROR: Failed to load statistics:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics';
      setErrorStates(prev => ({ ...prev, stats: errorMessage }));
      
      // Show error notification
      error(`Failed to load statistics: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingStats: false }));
    }
  };

  const handlePhotoSection = async () => {
    info('📸 Photo gallery feature will be implemented soon!');
    // Here you can implement a modal or navigation
  };

  const handleReportsSection = async () => {
    info('📋 Reports system will be implemented soon!');
    // Here you can implement a modal or navigation
  };

  const Dashboard = () => {
    return (
      <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border-l-4 border-yellow-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 sm:w-4 sm:h-4 bg-yellow-500 rounded"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Assigned</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {userTasks.filter(t => t.status === 'assigned').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border-l-4 border-blue-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 sm:w-4 sm:h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">In Progress</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {userTasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border-l-4 border-orange-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 sm:w-4 sm:h-4 bg-orange-500 rounded"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Review</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {userTasks.filter(t => t.status === 'review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
              </div>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-sm sm:text-sm font-medium text-gray-600 truncate">Completed</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {userTasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-lg font-medium text-gray-900">
            {user?.role === 'client' ? "Your Scheduled Services" : 
             user?.role === 'cleaner' ? "Your Today's Tasks" :
             `Today's Schedule`} - {new Date().toLocaleDateString('en-US')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* AI Assistant - Available to supervisors, managers, and owners */}
            {hasPermission('ai', 'use') && (
              <button
                onClick={() => setAiAssistantOpen(true)}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-3 sm:px-3 sm:py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 touch-target"
              >
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">AI</span>
                </div>
                <span>AI Assistant</span>
              </button>
            )}
            
            {/* Create Task - Only for supervisors, managers, and owners */}
            {hasPermission('tasks', 'create') && (
              <button
                onClick={() => setShowCreateTask(true)}
                className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 sm:px-3 sm:py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 touch-target"
              >
                <Plus size={14} />
                <span>Create Task</span>
              </button>
            )}
            
            {/* Advanced Features - Only for managers and owners */}
            {shouldShowAdvancedFeatures() && (
              <button
                onClick={() => setShowAdvancedPanel(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 sm:px-3 sm:py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 touch-target"
              >
                <Settings size={14} />
                <span>Advanced</span>
              </button>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {/* Task Update Error Display */}
          {errorStates.taskUpdate && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700 text-sm">{errorStates.taskUpdate}</span>
              </div>
            </div>
          )}
          <div className="space-y-3 sm:space-y-4">
            {userTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <span className="text-lg sm:text-2xl">{getTypeIcon(task.type)}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 truncate">{task.property}</h4>
                        <p className="text-sm text-gray-600 truncate">{task.property}</p>
                      </div>
                      <span className="text-sm sm:text-lg bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {getIntegrationLogo(task.integrationSource)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                      <span className="text-gray-600 text-xs">{getTypeText(task.type)}</span>
                      <span className={`font-medium text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low'}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600">
                      <span>⏰ {new Date(task.scheduledDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>⏱️ {task.estimatedDuration}min</span>
                      <span>{task.checklistCompleted}/{task.checklistTotal}</span>
                      <span>{task.checklistCompleted}/{task.checklistTotal}</span>
                    </div>

                    {task.notes && task.notes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notas:</span> {task.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {/* Open Checklist - All authenticated users can view */}
                    {hasPermission('core', 'view') && (
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowChecklist(true);
                        }}
                        disabled={loadingStates.globalLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                          loadingStates.globalLoading 
                            ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <Eye size={16} />
                        <span>{user?.role === 'client' ? 'View Details' : 'Open Checklist'}</span>
                      </button>
                    )}
                    
                    {/* Start Task - Only cleaners, supervisors, managers and owners */}
                    {task.status === 'assigned' && hasPermission('tasks', 'update') && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        disabled={updatingTaskId === task.id || loadingStates.globalLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors touch-target flex items-center space-x-2 ${
                          (updatingTaskId === task.id || loadingStates.globalLoading)
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {updatingTaskId === task.id ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Starting...</span>
                          </>
                        ) : (
                          <>
                            <Play size={16} />
                            <span>Start Task</span>
                          </>
                        )}
                      </button>
                    )}
                    
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'review')}
                        disabled={updatingTaskId === task.id || loadingStates.globalLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors touch-target flex items-center space-x-2 ${
                          (updatingTaskId === task.id || loadingStates.globalLoading)
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {updatingTaskId === task.id ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            <span>Submit for Review</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do Checklist</span>
                    <span>{Math.round((task.checklistCompleted / task.checklistTotal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(task.checklistCompleted / task.checklistTotal) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Checklist Progress</span>
                    <span>{Math.round((task.checklistCompleted / task.checklistTotal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(task.checklistCompleted / task.checklistTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  };

  const ChecklistModal = () => {
    if (!selectedTask || !showChecklist) return null;

    const checklist = checklistTemplates[selectedTask.type] || [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {getTypeIcon(selectedTask.type)} Checklist - {selectedTask.property}
              </h3>
              <p className="text-sm text-gray-600">{getTypeText(selectedTask.type)}</p>
            </div>
            <button
              onClick={() => setShowChecklist(false)}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
            <div className="space-y-3 sm:space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="mt-1 h-4 w-4 text-blue-600 flex-shrink-0"
                      onChange={() => {
                        // Lógica para marcar/desmarcar item
                        console.log(`Toggle item ${item.id}`);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{item.task}</h4>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      {item.photoRequired && (
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          <span className="text-sm text-blue-600">📸 Foto obrigatória</span>
                          <button
                            onClick={() => setUploadingPhoto(true)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs font-medium flex items-center space-x-1 self-start"
                          >
                            <Camera size={12} />
                            <span>Upload Foto</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Upload Section */}
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">📸 Upload de Fotos Before/After</h4>
              
              {/* Photo Upload Error Display */}
              {errorStates.photo && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="text-red-700 text-sm">{errorStates.photo}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-gray-400 mb-2 text-2xl sm:text-3xl">📷</div>
                  <p className="text-sm text-gray-600 mb-3">Fotos ANTES da limpeza</p>
                  <button 
                    onClick={() => handlePhotoUpload('before')}
                    disabled={loadingStates.uploadingPhoto}
                    className={`w-full px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2 ${
                      loadingStates.uploadingPhoto
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {loadingStates.uploadingPhoto ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        <span>Fazer Upload</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  <div className="text-gray-400 mb-2 text-2xl sm:text-3xl">📸</div>
                  <p className="text-sm text-gray-600 mb-3">Fotos DEPOIS da limpeza</p>
                  <button 
                    onClick={() => handlePhotoUpload('after')}
                    disabled={loadingStates.uploadingPhoto}
                    className={`w-full px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-2 ${
                      loadingStates.uploadingPhoto
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    {loadingStates.uploadingPhoto ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={16} />
                        <span>Fazer Upload</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">📝 Notas de Campo</h4>
              
              {/* Note Error Display */}
              {errorStates.note && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">⚠️</span>
                    <span className="text-red-700 text-sm">{errorStates.note}</span>
                  </div>
                </div>
              )}
              
              <textarea
                placeholder="Adicione observações, itens esquecidos, danos reportados..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                rows={4}
              />
              <button 
                onClick={handleSaveNote}
                disabled={loadingStates.savingNote}
                className={`mt-3 w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  loadingStates.savingNote
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loadingStates.savingNote ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Salvar Nota</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            {/* Error Display */}
            {errorStates.checklist && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-700 text-sm">{errorStates.checklist}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowChecklist(false)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 sm:px-4 sm:py-2 rounded-lg font-medium flex items-center justify-center space-x-2 touch-target"
              >
                <X size={16} />
                <span>Fechar</span>
              </button>
              <button 
                onClick={handleFinalizeChecklist}
                disabled={loadingStates.finalizingChecklist}
                className={`w-full sm:w-auto px-6 py-4 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 touch-target ${
                  loadingStates.finalizingChecklist
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loadingStates.finalizingChecklist ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Finalizando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span>Finalizar Checklist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AIAssistant = () => {
    if (!aiAssistantOpen) return null;

    const aiSuggestions = [
      {
        type: 'alert',
        icon: '🚨',
        title: 'Tarefa Atrasada',
        message: 'Casa Praia - Villa Sunset está 30min atrasada. Check-in em 2h.',
        action: 'Notificar Supervisor'
      },
      {
        type: 'suggestion',
        icon: '💡',
        title: 'Otimização de Rota',
        message: 'Reorganizar tarefas pode economizar 45min de deslocamento hoje.',
        action: 'Ver Sugestão'
      },
      {
        type: 'preventive',
        icon: '🔧',
        title: 'Manutenção Preventiva',
        message: 'Apartamento A12 - AC precisa manutenção (últimas 3 reclamações).',
        action: 'Agendar Técnico'
      },
      {
        type: 'quality',
        icon: '⭐',
        title: 'Padrão de Qualidade',
        message: 'João Santos - 98% aprovação. Excelente desempenho!',
        action: 'Ver Relatório'
      }
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">🧠</span>
              <h3 className="text-lg font-semibold text-gray-900">AI Cleaning Assistant</h3>
            </div>
            <button
              onClick={() => setAiAssistantOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Analisando suas tarefas e detectando oportunidades de otimização...
            </p>

            <div className="space-y-3 sm:space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                  suggestion.type === 'alert' ? 'border-red-400 bg-red-50' :
                  suggestion.type === 'suggestion' ? 'border-blue-400 bg-blue-50' :
                  suggestion.type === 'preventive' ? 'border-yellow-400 bg-yellow-50' :
                  'border-green-400 bg-green-50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{suggestion.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{suggestion.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1">{suggestion.message}</p>
                      <button className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        suggestion.type === 'alert' ? 'bg-red-100 hover:bg-red-200 text-red-700' :
                        suggestion.type === 'suggestion' ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' :
                        suggestion.type === 'preventive' ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700' :
                        'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}>
                        {suggestion.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const IntegrationsModal = () => {
    if (!integrationsModalOpen) return null;

    const integrations = [
      {
        id: 'airbnb',
        name: 'Airbnb',
        logo: '🏡',
        description: 'Sincronizar reservas e check-ins/check-outs automaticamente',
        status: 'connected',
        lastSync: '2025-01-08 10:30',
        properties: 12
      },
      {
        id: 'hostaway',
        name: 'Hostaway',
        logo: '🏠',
        description: 'Gestão centralizada de múltiplas plataformas',
        status: 'connected',
        lastSync: '2025-01-08 10:15',
        properties: 8
      },
      {
        id: 'turno',
        name: 'Turno',
        logo: '📋',
        description: 'Sistema de gestão de propriedades premium',
        status: 'pending',
        lastSync: null,
        properties: 0
      },
      {
        id: 'taskbird',
        name: 'TaskBird',
        logo: '🐦',
        description: 'Automação de tarefas operacionais',
        status: 'disconnected',
        lastSync: '2025-01-07 16:45',
        properties: 3
      }
    ];

    const getStatusColor = (status: string) => {
      switch(status) {
        case 'connected': return 'bg-green-100 text-green-800 border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'disconnected': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getStatusText = (status: string) => {
      switch(status) {
        case 'connected': return 'Conectado';
        case 'pending': return 'Pendente';
        case 'disconnected': return 'Desconectado';
        default: return status;
      }
    };

    const handleConnectIntegration = async (integrationId: string) => {
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
            integrationId,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to connect integration: ${response.statusText}`);
        }

        const result: ApiResponse<IntegrationData> = await response.json();

        if (result.success && result.data) {
          console.log(`✅ Integration ${integrationId} connected successfully:`, result.data);
          
          // Show success notification
          success(`Integration ${integrationId} connected successfully!`);
          
          // Update integration status in UI or redirect to configuration
        } else {
          throw new Error(result.error || 'Failed to connect integration');
        }
      } catch (err) {
        console.error('❌ ERROR: Failed to connect integration:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to connect integration';
        setErrorStates(prev => ({ ...prev, integration: errorMessage }));
        
        // Show error notification
        error(`Failed to connect integration: ${errorMessage}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, connectingIntegration: false }));
      }
    };

    const handleConfigureIntegration = async (integrationId: string) => {
      try {
        setLoadingStates(prev => ({ ...prev, connectingIntegration: true }));
        setErrorStates(prev => ({ ...prev, integration: null }));

        console.log(`⚙️ Loading configuration for integration: ${integrationId}`);

        const response = await fetch(`/api/integrations/${integrationId}/config`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load integration config: ${response.statusText}`);
        }

        const result: ApiResponse<IntegrationData> = await response.json();

        if (result.success && result.data) {
          console.log(`✅ Integration config loaded for ${integrationId}:`, result.data);
          
          // Show success toast
          success(`Integration configuration loaded for ${integrationId}!`);
          
          // Open configuration modal/panel with the loaded data
        } else {
          throw new Error(result.error || 'Failed to load integration config');
        }
      } catch (err) {
        console.error('❌ ERROR: Failed to load integration config:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load integration config';
        setErrorStates(prev => ({ ...prev, integration: errorMessage }));
        
        // Show error notification
        error(`Failed to load integration config: ${errorMessage}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, connectingIntegration: false }));
      }
    };

    const handleSaveIntegrationSettings = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, connectingIntegration: true }));
        setErrorStates(prev => ({ ...prev, integration: null }));

        console.log(`💾 Saving integration settings`);

        // You would collect settings from form state here
        const settingsData = {
          // This should come from your form state
          apiKey: '',
          webhookUrl: '',
          syncFrequency: 'hourly',
          // ... other settings
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
          
          // Show success toast
          success('Integration settings saved successfully!');
          
          setIntegrationsModalOpen(false);
        } else {
          throw new Error(result.error || 'Failed to save integration settings');
        }
      } catch (err) {
        console.error('❌ ERROR: Failed to save integration settings:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to save integration settings';
        setErrorStates(prev => ({ ...prev, integration: errorMessage }));
        
        // Show error notification
        error(`Failed to save integration settings: ${errorMessage}`);
      } finally {
        setLoadingStates(prev => ({ ...prev, connectingIntegration: false }));
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">🔗</span>
              <h3 className="text-lg font-semibold text-gray-900">Configurar Integrações</h3>
            </div>
            <button
              onClick={() => setIntegrationsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Conecte suas plataformas de reservas para sincronização automática de tarefas de limpeza.
            </p>

            {/* Integration Error Display */}
            {errorStates.integration && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <span className="text-red-700 text-sm">{errorStates.integration}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {integrations.map((integration) => (
                <div key={integration.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{integration.logo}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(integration.status)}`}>
                      {getStatusText(integration.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Propriedades:</span>
                      <span className="font-medium">{integration.properties}</span>
                    </div>
                    {integration.lastSync && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Última sync:</span>
                        <span className="font-medium">{integration.lastSync}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {integration.status === 'connected' ? (
                      <>
                        <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          ✓ Conectado
                        </button>
                        <button 
                          onClick={() => handleConfigureIntegration(integration.id)}
                          disabled={loadingStates.connectingIntegration || loadingStates.globalLoading}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            (loadingStates.connectingIntegration || loadingStates.globalLoading)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {(loadingStates.connectingIntegration || loadingStates.globalLoading) ? 'Carregando...' : 'Configurar'}
                        </button>
                      </>
                    ) : integration.status === 'pending' ? (
                      <button 
                        onClick={() => handleConnectIntegration(integration.id)}
                        disabled={loadingStates.connectingIntegration || loadingStates.globalLoading}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                          (loadingStates.connectingIntegration || loadingStates.globalLoading)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                        }`}
                      >
                        {(loadingStates.connectingIntegration || loadingStates.globalLoading) ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Conectando...</span>
                          </>
                        ) : (
                          <>
                            <Clock size={16} />
                            <span>Finalizar Setup</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleConnectIntegration(integration.id)}
                        disabled={loadingStates.connectingIntegration || loadingStates.globalLoading}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                          (loadingStates.connectingIntegration || loadingStates.globalLoading)
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {(loadingStates.connectingIntegration || loadingStates.globalLoading) ? (
                          <>
                            <Loader2 className="animate-spin" size={16} />
                            <span>Conectando...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Conectar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">🛠️ Configurações Avançadas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Sincronização Automática</h5>
                  <p className="text-sm text-gray-600 mb-3">Frequência de atualização das reservas</p>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option>A cada 15 minutos</option>
                    <option>A cada 30 minutos</option>
                    <option>A cada hora</option>
                    <option>Manual</option>
                  </select>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Notificações</h5>
                  <p className="text-sm text-gray-600 mb-3">Alertas de novas reservas</p>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Email
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      WhatsApp
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      SMS
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setIntegrationsModalOpen(false)}
              disabled={loadingStates.globalLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                loadingStates.globalLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <X size={16} />
              <span>Fechar</span>
            </button>
            <button 
              onClick={handleSaveIntegrationSettings}
              disabled={loadingStates.globalLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                loadingStates.globalLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loadingStates.globalLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Aguarde...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ChecklistTypeModal = () => {
    if (!checklistTypeModalOpen || !selectedChecklistType) return null;

    const checklist = checklistTemplates[selectedChecklistType as keyof typeof checklistTemplates] || [];
    const typeInfo = {
      normal: { title: 'Limpeza Padrão', description: 'Limpeza básica para entre hóspedes', icon: '🧹' },
      deep: { title: 'Limpeza Profunda', description: 'Limpeza completa e detalhada', icon: '🧽' },
      'move-out': { title: 'Limpeza de Saída', description: 'Limpeza para mudança de inquilinos', icon: '📦' },
      inspection: { title: 'Inspeção de Qualidade', description: 'Verificação final de qualidade', icon: '🔍' }
    };

    const currentType = typeInfo[selectedChecklistType as keyof typeof typeInfo];

    const handleCreateTask = () => {
      console.log(`🎯 Criando nova tarefa de ${selectedChecklistType}`);
      alert(`Nova tarefa de ${currentType.title} será criada!`);
      setChecklistTypeModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{currentType.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentType.title}</h3>
                <p className="text-sm text-gray-600">{currentType.description}</p>
              </div>
            </div>
            <button
              onClick={() => setChecklistTypeModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">📋 Template do Checklist</h4>
                <span className="text-sm text-gray-600">{checklist.length} itens</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklist.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-sm">{item.task}</h5>
                        <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                        {item.photoRequired && (
                          <span className="inline-flex items-center mt-2 text-xs text-blue-600">
                            📸 Foto obrigatória
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">🎯 Ações Disponíveis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={handleCreateTask}
                  className="p-4 border border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="text-sm font-medium text-blue-700">Criar Nova Tarefa</div>
                  <div className="text-xs text-blue-600 mt-1">Baseada neste template</div>
                </button>
                
                <button 
                  onClick={() => handleEditTemplate(selectedChecklistType || '')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl mb-2">✏️</div>
                  <div className="text-sm font-medium text-gray-700">Editar Template</div>
                  <div className="text-xs text-gray-600 mt-1">Customizar itens</div>
                </button>
                
                <button 
                  onClick={() => handleViewStatistics(selectedChecklistType || '')}
                  className="p-6 sm:p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors touch-target"
                >
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium text-gray-700">Ver Estatísticas</div>
                  <div className="text-xs text-gray-600 mt-1">Tempo médio, eficiência</div>
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>📄 {checklist.length} itens</span>
              <span>📸 {checklist.filter(item => item.photoRequired).length} fotos</span>
              <span>⏱️ ~{checklist.length * 5}min estimados</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setChecklistTypeModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={handleCreateTask}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Define tabs with RBAC permissions
  const allTabs = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: '📊',
      requiredFeature: 'task-management',
      allowedRoles: ['cleaner', 'supervisor', 'manager', 'owner', 'client']
    },
    { 
      id: 'agenda', 
      name: 'Synchronized Agenda', 
      icon: '📅',
      requiredFeature: 'task-management',
      allowedRoles: ['cleaner', 'supervisor', 'manager', 'owner']
    },
    { 
      id: 'checklists', 
      name: 'Dynamic Checklists', 
      icon: '✅',
      requiredFeature: 'checklist',
      allowedRoles: ['cleaner', 'supervisor', 'manager', 'owner']
    },
    { 
      id: 'photos', 
      name: 'Before/After Photos', 
      icon: '📸',
      requiredFeature: 'photo-upload',
      allowedRoles: ['cleaner', 'supervisor', 'manager', 'owner']
    },
    { 
      id: 'reports', 
      name: 'Reports', 
      icon: '📊',
      requiredFeature: 'performance-reports',
      allowedRoles: ['supervisor', 'manager', 'owner', 'client']
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: '📈',
      requiredFeature: 'analytics-dashboard',
      allowedRoles: ['owner']
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      icon: '💰',
      requiredFeature: 'financial-reports',
      allowedRoles: ['manager', 'owner']
    },
    { 
      id: 'integrations', 
      name: 'Integrations', 
      icon: '🔗',
      requiredFeature: 'integration-management',
      allowedRoles: ['manager', 'owner']
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '⚙️',
      requiredFeature: 'settings-management',
      allowedRoles: ['supervisor', 'manager', 'owner']
    }
  ];

  // Filter tabs based on user permissions
  const tabs = filterMenuByPermissions(allTabs);
  
  // Get role-based dashboard configuration
  const dashboardConfig = getDashboardConfig();

  // Navigation items for responsive navigation
  const navigationItems = tabs.map(tab => ({
    id: tab.id,
    label: tab.name,
    icon: () => <span className="text-xl">{tab.icon}</span>,
    onClick: () => setActiveTab(tab.id)
  }));

  // Handle navigation click
  const handleNavigationClick = (itemId: string) => {
    setActiveTab(itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Navigation */}
      {isMobile && (
        <ResponsiveNavigation
          activeItem={activeTab}
          onItemClick={handleNavigationClick}
          items={navigationItems}
        />
      )}
      
      {/* Conditional Layout based on screen size */}
      {isDesktopOrLarger ? (
        // Desktop Layout with Sidebar
        <div className="flex h-screen">
          <ResponsiveNavigation
            activeItem={activeTab}
            onItemClick={handleNavigationClick}
            items={navigationItems}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Main Content Container */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6">
                  {activeTab === 'dashboard' && <Dashboard />}
                  
                  {activeTab === 'agenda' && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-4xl sm:text-6xl mb-4">📅</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Agenda Sincronizada</h3>
                      <p className="text-gray-600 mb-4 px-4">Integração com Airbnb, Hostaway, Turno, Taskbird</p>
                      <p className="text-gray-500 italic px-4">Feature coming soon</p>
                    </div>
                  )}

                  {activeTab === 'checklists' && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-4xl sm:text-6xl mb-4">✅</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Checklists Dinâmicos</h3>
                      <p className="text-gray-600 mb-4 px-4">Normal, Deep, Move-out, Inspection</p>
                      <p className="text-gray-500 italic px-4">Feature coming soon</p>
                    </div>
                  )}

                  {activeTab === 'photos' && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-4xl sm:text-6xl mb-4">📸</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Upload Obrigatório de Fotos</h3>
                      <p className="text-gray-600 mb-4 px-4">Before/After para todas as limpezas</p>
                      <p className="text-gray-500 italic px-4">Feature coming soon</p>
                    </div>
                  )}

                  {activeTab === 'reports' && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-4xl sm:text-6xl mb-4">📋</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Relatórios de Campo</h3>
                      <p className="text-gray-600 mb-4 px-4">Notas, observações e reportes de danos</p>
                      <p className="text-gray-500 italic px-4">Feature coming soon</p>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-4xl sm:text-6xl mb-4">⚙️</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                      <p className="text-gray-600 mb-4 px-4">Configure system settings, permissions, and integrations</p>
                      <div className="mt-6">
                        <a 
                          href="/settings" 
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Open Settings
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        // Mobile/Tablet Layout
        <div className="pb-safe">
          {/* Main Content Container */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mx-4">
            <div className="p-4 sm:p-6">
              {activeTab === 'dashboard' && <Dashboard />}
              
              {activeTab === 'agenda' && (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">📅</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Agenda Sincronizada</h3>
                  <p className="text-gray-600 mb-4 px-4">Integração com Airbnb, Hostaway, Turno, Taskbird</p>
                  <p className="text-gray-500 italic px-4">Feature coming soon</p>
                </div>
              )}

              {activeTab === 'checklists' && (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">✅</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Checklists Dinâmicos</h3>
                  <p className="text-gray-600 mb-4 px-4">Normal, Deep, Move-out, Inspection</p>
                  <p className="text-gray-500 italic px-4">Feature coming soon</p>
                </div>
              )}

              {activeTab === 'photos' && (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">📸</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Upload Obrigatório de Fotos</h3>
                  <p className="text-gray-600 mb-4 px-4">Before/After para todas as limpezas</p>
                  <p className="text-gray-500 italic px-4">Feature coming soon</p>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">📋</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Relatórios de Campo</h3>
                  <p className="text-gray-600 mb-4 px-4">Notas, observações e reportes de danos</p>
                  <p className="text-gray-500 italic px-4">Feature coming soon</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4">⚙️</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Settings</h3>
                  <p className="text-gray-600 mb-4 px-4">Configure system settings, permissions, and integrations</p>
                  <div className="mt-6">
                    <a 
                      href="/settings" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Open Settings
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
