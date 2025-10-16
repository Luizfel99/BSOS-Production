'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProtectedComponent, usePermissions } from './ProtectedComponent';
import { useNotifications } from '@/hooks/useNotifications';

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  status: string;
  priority: string;
  property?: {
    name: string;
    address: string;
    type: string;
  };
  cleaner?: {
    name: string;
    phone: string;
  };
  reservation?: {
    guestName: string;
    checkIn: string;
    checkOut: string;
  };
  checklist: any[];
  rating?: number;
  feedback?: string;
}

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

export default function GestaoTarefas() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    cleaner: 'all',
    date: '',
    priority: 'all'
  });

  const permissions = usePermissions();
  const { success, error } = useNotifications();
  
  const canViewTasks = permissions.hasPermission('tasks', 'view');
  const canCreateTasks = permissions.hasPermission('tasks', 'create');
  const canUpdateTasks = permissions.hasPermission('tasks', 'update');
  const canDeleteTasks = permissions.hasPermission('tasks', 'delete');

  useEffect(() => {
    if (canViewTasks) {
      fetchTasks();
    }
  }, [filters, canViewTasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.cleaner !== 'all') params.append('cleanerId', filters.cleaner);
      if (filters.date) params.append('date', filters.date);
      
      const response = await fetch(`/api/tasks?${params}`);
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchTasks(); // Recarregar tarefas
        success(`Tarefa ${newStatus === 'completed' ? 'concluída' : 'atualizada'} com sucesso!`);
      } else {
        error('Falha ao atualizar status da tarefa');
      }
    } catch (err) {
      error('Erro ao atualizar status da tarefa');
    }
  };

  const createNewTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        await fetchTasks();
        setShowTaskForm(false);
        success('Tarefa criada com sucesso!');
      } else {
        error('Falha ao criar tarefa');
      }
    } catch (err) {
      error('Erro ao criar tarefa');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-orange-600',
      'urgent': 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'checkout_cleaning': '',
      'checkin_preparation': '',
      'deep_cleaning': '',
      'maintenance': '',
      'inspection': ''
    };
    return icons[type as keyof typeof icons] || '';
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Return no access message if user can't view tasks
  if (!canViewTasks) {
    return (
      <ProtectedComponent
        module="tasks"
        action="view"
        fallback="minimal"
      >
        <div>Esta funcionalidade requer permissões de visualização de tarefas.</div>
      </ProtectedComponent>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Gestão de Tarefas
        </motion.h2>
        <ProtectedComponent
          module="tasks"
          action="create"
          fallback={null}
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Nova Tarefa
          </motion.button>
        </ProtectedComponent>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="assigned">Atribuída</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluída</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2"
          />

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={fetchTasks}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            🔄 Refresh
          </motion.button>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {filteredTasks.length === 0 ? (
          <motion.div 
            className="col-span-full text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-gray-500 mb-4">
              {tasks.length === 0 
                ? "Não há tarefas cadastradas no sistema."
                : "Nenhuma tarefa corresponde aos filtros aplicados."
              }
            </p>
            {permissions.hasPermission('tasks', 'create') && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Criar primeira tarefa
              </motion.button>
            )}
          </motion.div>
        ) : (
          filteredTasks.map((task, index) => (
          <motion.div 
            key={task.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(task.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.property?.name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority === 'urgent' ? 'URGENT' : 
                 task.priority === 'high' ? 'HIGH' :
                 task.priority === 'medium' ? 'MEDIUM' : 'LOW'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                {new Date(task.scheduledDate + 'T' + task.scheduledTime).toLocaleString('en-US')}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {task.estimatedDuration} minutes
              </p>
              {task.cleaner && (
                <p className="text-sm text-gray-600">
                  👤 {task.cleaner.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status === 'pending' ? 'Pendente' :
                 task.status === 'assigned' ? 'Atribuída' :
                 task.status === 'in_progress' ? 'Em Andamento' :
                 task.status === 'completed' ? 'Concluída' : 'Cancelada'}
              </span>
              {task.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{task.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Checklist Progress */}
            {task.checklist.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                  <span>Progresso</span>
                  <span>{task.checklist.filter(item => item.completed).length}/{task.checklist.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {setSelectedTask(task); setShowTaskDetails(true);}}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
              >
                Ver Detalhes
              </motion.button>
              
              {task.status === 'assigned' && (
                <ProtectedComponent
                  module="tasks"
                  action="update"
                  fallback={null}
                >
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => updateTaskStatus(task.id, 'in_progress')}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    Iniciar
                  </motion.button>
                </ProtectedComponent>
              )}
              
              {task.status === 'in_progress' && (
                <ProtectedComponent
                  module="tasks"
                  action="update"
                  fallback={null}
                >
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                  >
                    Concluir
                  </motion.button>
                </ProtectedComponent>
              )}
            </div>
          </motion.div>
        ))
        )}
      </motion.div>

      {/* Modal de Detalhes da Tarefa */}
      {showTaskDetails && selectedTask && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowTaskDetails(false)}
        >
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h3>
              <motion.button
                onClick={() => setShowTaskDetails(false)}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </div>

            <div className="space-y-6">
              {/* Informações da Tarefa */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informações</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <p><strong>Tipo:</strong> {selectedTask.type}</p>
                  <p><strong>Prioridade:</strong> {selectedTask.priority}</p>
                  <p><strong>Data/Hora:</strong> {new Date(selectedTask.scheduledDate + 'T' + selectedTask.scheduledTime).toLocaleString('pt-BR')}</p>
                  <p><strong>Duração Estimada:</strong> {selectedTask.estimatedDuration} minutos</p>
                  <p><strong>Status:</strong> {selectedTask.status}</p>
                </div>
              </div>

              {/* Propriedade */}
              {selectedTask.property && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Propriedade</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><strong>Nome:</strong> {selectedTask.property.name}</p>
                    <p><strong>Endereço:</strong> {selectedTask.property.address}</p>
                    <p><strong>Tipo:</strong> {selectedTask.property.type}</p>
                  </div>
                </div>
              )}

              {/* Cleaner */}
              {selectedTask.cleaner && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Responsável</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><strong>Nome:</strong> {selectedTask.cleaner.name}</p>
                    <p><strong>Telefone:</strong> {selectedTask.cleaner.phone}</p>
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Checklist</h4>
                <div className="space-y-2">
                  {selectedTask.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        readOnly
                        className="rounded"
                      />
                      <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                        {item.description}
                      </span>
                      {item.required && <span className="text-red-500">*</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Avaliação */}
              {selectedTask.rating && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Avaliação</h4>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{selectedTask.rating.toFixed(1)}</span>
                    </div>
                    {selectedTask.feedback && (
                      <p className="text-gray-700">{selectedTask.feedback}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Nova Tarefa */}
      {showTaskForm && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowTaskForm(false)}
        >
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Tarefa</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const taskData = {
                title: formData.get('title'),
                description: formData.get('description'),
                type: formData.get('type'),
                propertyId: 'prop-001', // Seria selecionado de uma lista
                scheduledDate: formData.get('scheduledDate'),
                scheduledTime: formData.get('scheduledTime'),
                estimatedDuration: parseInt(formData.get('estimatedDuration') as string),
                priority: formData.get('priority')
              };
              createNewTask(taskData);
            }}>
              <div className="space-y-4">
                <input
                  name="title"
                  type="text"
                  placeholder="Título da tarefa"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <textarea
                  name="description"
                  placeholder="Descrição"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                ></textarea>
                <select
                  name="type"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="checkout_cleaning">Limpeza Pós-Checkout</option>
                  <option value="checkin_preparation">Preparação Pré-Checkin</option>
                  <option value="deep_cleaning">Limpeza Profunda</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="inspection">Inspeção</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="scheduledDate"
                    type="date"
                    required
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                  <input
                    name="scheduledTime"
                    type="time"
                    required
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <input
                  name="estimatedDuration"
                  type="number"
                  placeholder="Duração (minutos)"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                  name="priority"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Selecione a prioridade</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Criar Tarefa
                </motion.button>
                <motion.button
                  type="button"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}