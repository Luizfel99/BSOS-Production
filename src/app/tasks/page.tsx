'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Clock,
  User,
  Home,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { ProtectedComponent } from '@/components/ProtectedComponent';

// Task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  propertyId?: string;
  assignedTo?: string;
  scheduledDate?: string;
  dueDate?: string;
  estimatedDuration?: number;
  type: 'cleaning' | 'maintenance' | 'inspection';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  materials?: string;
  instructions?: string;
  checklistCompleted: number;
  checklistTotal: number;
  photosUploaded: number;
  photosRequired: number;
  integrationSource?: string;
  guestCheckIn?: string;
  guestCheckOut?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      } else {
        toast.error('Erro ao carregar tarefas');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    router.push('/tasks/new');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'completed': 'Concluída',
      'cancelled': 'Cancelada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedComponent requiredRoles={['ADMIN', 'MANAGER', 'CLEANER']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 mr-3 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
                    <p className="text-gray-600">Gerencie todas as tarefas de limpeza</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleNewTask}
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Nova Tarefa
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar tarefas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="in-progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando tarefas...</p>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border p-12 text-center"
            >
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando sua primeira tarefa de limpeza.
              </p>
              <Button
                onClick={handleNewTask}
                variant="primary"
                size="lg"
                leftIcon={<Plus className="h-5 w-5" />}
              >
                Criar Primera Tarefa
              </Button>
            </motion.div>
          )}

          {/* Tasks Grid */}
          {!loading && filteredTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <div className="ml-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {task.assignedTo && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {task.assignedTo}
                        </div>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {task.propertyId && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Home className="h-4 w-4 mr-2" />
                          Propriedade: {task.propertyId}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {getStatusLabel(task.status)}
                      </span>
                      
                      {task.checklistTotal > 0 && (
                        <span className="text-sm text-gray-600">
                          {task.checklistCompleted}/{task.checklistTotal} itens
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Search Results */}
          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-sm border p-8 text-center"
            >
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedComponent>
  );
}