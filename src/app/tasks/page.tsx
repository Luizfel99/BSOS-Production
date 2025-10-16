'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Calendar, User, Building, AlertCircle, Edit2, Trash2, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import RouteGuard from '@/components/RouteGuard';
import MobileNavigation from '@/components/MobileNavigation';
import ProtectedComponent from '@/components/ProtectedComponent';
import { listTasks, deleteTask, type Task } from '@/services/tasks';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function TasksPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadTasks();
  }, [filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await listTasks(filters);
      if (response.success && response.data) {
        setTasks(response.data.tasks || []);
      }
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      toast.error('Erro ao carregar tarefas');
      // Use mock data as fallback
      setTasks(getMockTasks());
    } finally {
      setLoading(false);
    }
  };

  const getMockTasks = (): Task[] => [
    {
      id: '1',
      title: 'Limpeza Apartamento 101',
      description: 'Limpeza completa com foco em banheiros e cozinha',
      status: 'pending',
      priority: 'high',
      type: 'cleaning',
      assignedToName: 'Maria Silva',
      propertyName: 'Rua das Flores, 123 - Apt 101',
      dueDate: '2025-10-16',
      createdAt: '2025-10-15',
      updatedAt: '2025-10-15'
    },
    {
      id: '2',
      title: 'Manutenção Ar Condicionado',
      description: 'Verificar funcionamento e fazer limpeza dos filtros',
      status: 'in_progress',
      priority: 'medium',
      type: 'maintenance',
      assignedToName: 'Carlos Santos',
      propertyName: 'Av. Copacabana, 456 - Sala 203',
      dueDate: '2025-10-17',
      createdAt: '2025-10-14',
      updatedAt: '2025-10-15'
    },
    {
      id: '3',
      title: 'Inspeção Vistoria',
      description: 'Vistoria para entrada de novo inquilino',
      status: 'completed',
      priority: 'medium',
      type: 'inspection',
      assignedToName: 'Ana Costa',
      propertyName: 'Rua Principal, 789',
      dueDate: '2025-10-15',
      createdAt: '2025-10-13',
      updatedAt: '2025-10-15'
    }
  ];

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
      await deleteTask(id);
      toast.success('Tarefa excluída com sucesso');
      loadTasks();
    } catch (error) {
      toast.error('Erro ao excluir tarefa');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cleaning': return 'Limpeza';
      case 'maintenance': return 'Manutenção';
      case 'inspection': return 'Inspeção';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.assignedToName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.propertyName?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <RouteGuard>
      <MobileNavigation activeItem="tasks">
        <ProtectedComponent allowedRoles={['admin', 'supervisor', 'employee']}>
          <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Tarefas
                    </h1>
                    <p className="text-gray-600">
                      Gerencie todas as tarefas e atividades da equipe
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/tasks/new')}
                    className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Nova Tarefa
                  </motion.button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar tarefas..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os Status</option>
                    <option value="pending">Pendente</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>

                  {/* Priority Filter */}
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas as Prioridades</option>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>

                  {/* Clear Filters */}
                  <button
                    onClick={() => setFilters({ search: '', status: '', priority: '', assignedTo: '' })}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Limpar Filtros
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              {loading ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Carregando tarefas...</span>
                  </div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma tarefa encontrada
                  </h3>
                  <p className="text-gray-600">
                    Não há tarefas que correspondam aos filtros selecionados.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        {/* Task Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {task.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {getStatusLabel(task.status)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {getPriorityLabel(task.priority)}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-gray-600 mb-3 text-sm">
                              {task.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            {task.assignedToName && (
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{task.assignedToName}</span>
                              </div>
                            )}
                            
                            {task.propertyName && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{task.propertyName}</span>
                              </div>
                            )}

                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span>{getTypeLabel(task.type)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 lg:mt-0 lg:ml-6">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/tasks/${task.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir tarefa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </ProtectedComponent>
      </MobileNavigation>
    </RouteGuard>
  );
}