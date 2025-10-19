'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useBSOSActions } from '@/contexts/BSOSContext';

export default function BSOSCore() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Get all BSOS actions and state from context
  const {
    // State
    tasks,
    loadingStates,
    errorStates,
    selectedTask,
    updatingTaskId,
    
    // State setters
    setTasks,
    setLoadingStates,
    setErrorStates,
    setSelectedTask,
    setUpdatingTaskId,
    
    // Functions
    updateTaskStatus,
    isAnyApiCallInProgress,
    
    // Handlers
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
  } = useBSOSActions();

  // Local UI state (not shared globally)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChecklist, setShowChecklist] = useState(false);
  const [integrationsModalOpen, setIntegrationsModalOpen] = useState(false);

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

  // Helper functions
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '' },
    { id: 'agenda', name: 'Synchronized Agenda', icon: '' },
    { id: 'checklists', name: 'Dynamic Checklists', icon: '' },
    { id: 'photos', name: 'Before/After Photos', icon: '' },
    { id: 'reports', name: 'Reports', icon: '' }
  ];

  return (
    <div className="space-y-6">
      {/* Global Loading Overlay */}
      {loadingStates.globalLoading && <LoadingSpinner />}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">B.S.O.S. Core - Operations</h1>
            <p className="text-blue-100">
              Complete control of real-time cleaning operations
            </p>
            <div className="mt-4 flex items-center space-x-6 text-blue-100">
              <span>{userTasks.length} active tasks</span>
              <span>•</span>
              <span>System online</span>
              <span>•</span>
              <span>Synchronized with integrations</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{user?.name || 'System'}</div>
            <div className="text-blue-200 text-sm">{user?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Active Tasks Dashboard</h2>
              <button
                onClick={handleCreateTask}
                disabled={loadingStates.globalLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  loadingStates.globalLoading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loadingStates.globalLoading ? 'Aguarde...' : 'Create New Task'}
              </button>
            </div>
            
            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {userTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{task.property}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">{task.type}</span>
                        <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {getIntegrationLogo(task.integrationSource)}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assigned to:</span>
                      <span className="font-medium">{task.assignedTo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scheduled:</span>
                      <span className="font-medium">{task.scheduledDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{task.estimatedDuration} min</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{task.checklistCompleted}/{task.checklistTotal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(task.checklistCompleted / task.checklistTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowChecklist(true);
                      }}
                      disabled={loadingStates.globalLoading}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        loadingStates.globalLoading 
                          ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Open Checklist
                    </button>
                    
                    {task.status === 'assigned' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        disabled={updatingTaskId === task.id || loadingStates.globalLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          (updatingTaskId === task.id || loadingStates.globalLoading)
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {updatingTaskId === task.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Starting...
                          </div>
                        ) : (
                          'Start Task'
                        )}
                      </button>
                    )}
                    
                    {task.status === 'in-progress' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'review')}
                        disabled={updatingTaskId === task.id || loadingStates.globalLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          (updatingTaskId === task.id || loadingStates.globalLoading)
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {updatingTaskId === task.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          'Submit for Review'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'agenda' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Agenda Sincronizada</h3>
            <p className="text-gray-600 mb-4">Integração com Airbnb, Hostaway, Turno, Taskbird</p>
            <button 
              onClick={() => setIntegrationsModalOpen(true)}
              disabled={loadingStates.globalLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                loadingStates.globalLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loadingStates.globalLoading ? 'Aguarde...' : 'Configurar Integrações'}
            </button>
          </div>
        )}

        {activeTab === 'checklists' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Checklists Dinâmicos</h3>
            <p className="text-gray-600 mb-4">Normal, Deep, Move-out, Inspection</p>
            <button
              onClick={() => handleChecklistTypeSelection('normal')}
              disabled={loadingStates.globalLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                loadingStates.globalLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loadingStates.globalLoading ? 'Aguarde...' : 'Ver Checklists'}
            </button>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Obrigatório de Fotos</h3>
            <p className="text-gray-600 mb-4">Before/After para todas as limpezas</p>
            <button 
              onClick={handlePhotoSection}
              disabled={loadingStates.globalLoading}
              className={`px-6 py-3 rounded-lg font-medium ${
                loadingStates.globalLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loadingStates.globalLoading ? 'Aguarde...' : 'Fazer Upload'}
            </button>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Relatórios de Campo</h3>
            <p className="text-gray-600 mb-4">Notas, observações e reportes de danos</p>
            <button 
              onClick={handleReportsSection}
              disabled={loadingStates.globalLoading}
              className={`px-6 py-3 rounded-lg font-medium ${
                loadingStates.globalLoading
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {loadingStates.globalLoading ? 'Aguarde...' : 'Ver Relatórios'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
