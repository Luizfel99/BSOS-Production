'use client';'use client';



import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';import { motion } from 'framer-motion';

import { toast } from 'react-hot-toast';import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';import { Button } from '@/components/ui/Button';

import { Card } from '@/components/ui/Card';import { Card } from '@/components/ui/Card';

import { Badge } from '@/components/ui/Badge';import { Badge } from '@/components/ui/Badge';

import { Input } from '@/components/ui/Input';import { Input } from '@/components/ui/Input';

import { import { 

  Calendar,   Calendar, 

  Plus,   Plus, 

  Search,   Search, 

  Filter,  Filter,

  Clock,  Clock,

  User,  User,

  Home,  Home,

  CheckCircle,  CheckCircle,

  AlertCircle,  AlertCircle,

  XCircle  XCircle

} from 'lucide-react';} from 'lucide-react';

import { ProtectedComponent } from '@/components/ProtectedComponent';import { ProtectedComponent } from '@/components/ProtectedComponent';



// Task interface// Task interface

interface Task {interface Task {

  id: string;  id: string;

  title: string;  title: string;

  description?: string;  description?: string;

  propertyId?: string;  propertyId?: string;

  assignedTo?: string;  assignedTo?: string;

  scheduledDate?: string;  scheduledDate?: string;

  dueDate?: string;  dueDate?: string;

  estimatedDuration?: number;  estimatedDuration?: number;

  type: 'cleaning' | 'maintenance' | 'inspection';  type: 'cleaning' | 'maintenance' | 'inspection';

  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';

  priority: 'low' | 'medium' | 'high';  priority: 'low' | 'medium' | 'high';

  materials?: string;  materials?: string;

  instructions?: string;  instructions?: string;

  checklistCompleted: number;  checklistCompleted: number;

  checklistTotal: number;  checklistTotal: number;

  photosUploaded: number;  photosUploaded: number;

  photosRequired: number;  photosRequired: number;

  integrationSource?: string;  integrationSource?: string;

  guestCheckIn?: string;  guestCheckIn?: string;

  guestCheckOut?: string;  guestCheckOut?: string;

  createdBy?: string;  createdBy?: string;

  createdAt: string;  createdAt: string;

  updatedAt: string;  updatedAt: string;

}}



export default function TasksPage() {export default function TasksPage() {

  const router = useRouter();  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');  const [statusFilter, setStatusFilter] = useState('all');



  useEffect(() => {  useEffect(() => {

    loadTasks();    loadTasks();

  }, []);  }, []);



  const loadTasks = async () => {  const loadTasks = async () => {

    try {    try {

      setLoading(true);      setLoading(true);

      const response = await fetch('/api/tasks');      const response = await fetch('/api/tasks');

            

      if (response.ok) {      if (response.ok) {

        const data = await response.json();        const data = await response.json();

        setTasks(data.data || []);        setTasks(data.data || []);

      } else {      } else {

        toast.error('Erro ao carregar tarefas');        toast.error('Erro ao carregar tarefas');

      }      }

    } catch (error) {    } catch (error) {

      console.error('Error loading tasks:', error);      console.error('Error loading tasks:', error);

      toast.error('Erro ao carregar tarefas');      toast.error('Erro ao carregar tarefas');

    } finally {    } finally {

      setLoading(false);      setLoading(false);

    }    }

  };  };



  const handleNewTask = () => {  const handleNewTask = () => {

    router.push('/tasks/new');    router.push('/tasks/new');

  };  };



  const getStatusIcon = (status: string) => {  const getStatusIcon = (status: string) => {

    switch (status) {    switch (status) {

      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;

      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;

      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;

      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />;

    }    }

  };  };



  const getStatusLabel = (status: string) => {  const getStatusLabel = (status: string) => {

    const labels = {    const labels = {

      'pending': 'Pendente',      'pending': 'Pendente',

      'in-progress': 'Em Andamento',      'in-progress': 'Em Andamento',

      'completed': 'Concluída',      'completed': 'Concluída',

      'cancelled': 'Cancelada'      'cancelled': 'Cancelada'

    };    };

    return labels[status as keyof typeof labels] || status;    return labels[status as keyof typeof labels] || status;

  };  };



  const getPriorityColor = (priority: string) => {  const getPriorityColor = (priority: string) => {

    switch (priority) {    switch (priority) {

      case 'high': return 'bg-red-100 text-red-800';      case 'high': return 'bg-red-100 text-red-800';

      case 'medium': return 'bg-yellow-100 text-yellow-800';      case 'medium': return 'bg-yellow-100 text-yellow-800';

      case 'low': return 'bg-green-100 text-green-800';      case 'low': return 'bg-green-100 text-green-800';

      default: return 'bg-gray-100 text-gray-800';      default: return 'bg-gray-100 text-gray-800';

    }    }

  };  };



  const filteredTasks = tasks.filter(task => {  const filteredTasks = tasks.filter(task => {

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    return matchesSearch && matchesStatus;    return matchesSearch && matchesStatus;

  });  });



  return (  return (

    <ProtectedComponent requiredRoles={['ADMIN', 'MANAGER', 'CLEANER']}>    <ProtectedComponent requiredRoles={['ADMIN', 'MANAGER', 'CLEANER']}>

      <div className="min-h-screen bg-gray-50 py-8">      <div className="min-h-screen bg-gray-50 py-8">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    

          {/* Header */}          {/* Header */}

          <motion.div          <motion.div

            initial={{ opacity: 0, y: -20 }}            initial={{ opacity: 0, y: -20 }}

            animate={{ opacity: 1, y: 0 }}            animate={{ opacity: 1, y: 0 }}

            className="mb-8"            className="mb-8"

          >          >

            <div className="bg-white rounded-lg shadow-sm border p-6">            <div className="bg-white rounded-lg shadow-sm border p-6">

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <div className="flex items-center">                <div className="flex items-center">

                  <Calendar className="h-8 w-8 mr-3 text-blue-600" />                  <Calendar className="h-8 w-8 mr-3 text-blue-600" />

                  <div>                  <div>

                    <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>                    <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>

                    <p className="text-gray-600">Gerencie todas as tarefas de limpeza</p>                    <p className="text-gray-600">Gerencie todas as tarefas de limpeza</p>

                  </div>                  </div>

                </div>                </div>

                                

                <Button                <Button

                  onClick={handleNewTask}                  onClick={handleNewTask}

                  variant="primary"                  variant="primary"

                  leftIcon={<Plus className="h-4 w-4" />}                  leftIcon={<Plus className="h-4 w-4" />}

                >                >

                  Nova Tarefa                  Nova Tarefa

                </Button>                </Button>

              </div>              </div>

            </div>            </div>

          </motion.div>          </motion.div>



          {/* Filters */}          {/* Filters */}

          <motion.div          <motion.div

            initial={{ opacity: 0, y: 20 }}            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 0.1 }}            transition={{ delay: 0.1 }}

            className="mb-6"            className="mb-6"

          >          >

            <div className="bg-white rounded-lg shadow-sm border p-4">            <div className="bg-white rounded-lg shadow-sm border p-4">

              <div className="flex flex-col sm:flex-row gap-4">              <div className="flex flex-col sm:flex-row gap-4">

                <div className="flex-1 relative">                <div className="flex-1 relative">

                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

                  <input                  <input

                    type="text"                    type="text"

                    placeholder="Buscar tarefas..."                    placeholder="Buscar tarefas..."

                    value={searchTerm}                    value={searchTerm}

                    onChange={(e) => setSearchTerm(e.target.value)}                    onChange={(e) => setSearchTerm(e.target.value)}

                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                  />                  />

                </div>                </div>

                                

                <select                <select

                  value={statusFilter}                  value={statusFilter}

                  onChange={(e) => setStatusFilter(e.target.value)}                  onChange={(e) => setStatusFilter(e.target.value)}

                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                >                >

                  <option value="all">Todos os Status</option>                  <option value="all">Todos os Status</option>

                  <option value="pending">Pendente</option>                  <option value="pending">Pendente</option>

                  <option value="in-progress">Em Andamento</option>                  <option value="in-progress">Em Andamento</option>

                  <option value="completed">Concluída</option>                  <option value="completed">Concluída</option>

                  <option value="cancelled">Cancelada</option>                  <option value="cancelled">Cancelada</option>

                </select>                </select>

              </div>              </div>

            </div>            </div>

          </motion.div>          </motion.div>



          {/* Loading State */}          {/* Loading State */}

          {loading && (          {loading && (

            <motion.div            <motion.div

              initial={{ opacity: 0 }}              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}              animate={{ opacity: 1 }}

              className="bg-white rounded-lg shadow-sm border p-8 text-center"              className="bg-white rounded-lg shadow-sm border p-8 text-center"

            >            >

              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>

              <p className="text-gray-600">Carregando tarefas...</p>              <p className="text-gray-600">Carregando tarefas...</p>

            </motion.div>            </motion.div>

          )}          )}



          {/* Empty State */}          {/* Empty State */}

          {!loading && tasks.length === 0 && (          {!loading && tasks.length === 0 && (

            <motion.div            <motion.div

              initial={{ opacity: 0, scale: 0.95 }}              initial={{ opacity: 0, scale: 0.95 }}

              animate={{ opacity: 1, scale: 1 }}              animate={{ opacity: 1, scale: 1 }}

              transition={{ delay: 0.2 }}              transition={{ delay: 0.2 }}

              className="bg-white rounded-lg shadow-sm border p-12 text-center"              className="bg-white rounded-lg shadow-sm border p-12 text-center"

            >            >

              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />

              <h3 className="text-xl font-semibold text-gray-900 mb-2">              <h3 className="text-xl font-semibold text-gray-900 mb-2">

                Nenhuma tarefa encontrada                Nenhuma tarefa encontrada

              </h3>              </h3>

              <p className="text-gray-600 mb-6">              <p className="text-gray-600 mb-6">

                Comece criando sua primeira tarefa de limpeza.                Comece criando sua primeira tarefa de limpeza.

              </p>              </p>

              <Button              <Button

                onClick={handleNewTask}                onClick={handleNewTask}

                variant="primary"                variant="primary"

                size="lg"                size="lg"

                leftIcon={<Plus className="h-5 w-5" />}                leftIcon={<Plus className="h-5 w-5" />}

              >              >

                Criar Primera Tarefa                Criar Primera Tarefa

              </Button>              </Button>

            </motion.div>            </motion.div>

          )}          )}



          {/* Tasks Grid */}          {/* Tasks Grid */}

          {!loading && filteredTasks.length > 0 && (          {!loading && filteredTasks.length > 0 && (

            <motion.div            <motion.div

              initial={{ opacity: 0 }}              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}              animate={{ opacity: 1 }}

              transition={{ delay: 0.3 }}              transition={{ delay: 0.3 }}

              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

            >            >

              {filteredTasks.map((task, index) => (              {filteredTasks.map((task, index) => (

                <motion.div                <motion.div

                  key={task.id}                  key={task.id}

                  initial={{ opacity: 0, y: 20 }}                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: index * 0.05 }}                  transition={{ delay: index * 0.05 }}

                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"

                  onClick={() => router.push(`/tasks/${task.id}`)}                  onClick={() => router.push(`/tasks/${task.id}`)}

                >                >

                  <div className="p-6">                  <div className="p-6">

                    <div className="flex items-start justify-between mb-4">                    <div className="flex items-start justify-between mb-4">

                      <div className="flex items-center">                      <div className="flex items-center">

                        {getStatusIcon(task.status)}                        {getStatusIcon(task.status)}

                        <div className="ml-3">                        <div className="ml-3">

                          <h3 className="text-lg font-semibold text-gray-900">                          <h3 className="text-lg font-semibold text-gray-900">

                            {task.title}                            {task.title}

                          </h3>                          </h3>

                          <p className="text-sm text-gray-600">                          <p className="text-sm text-gray-600">

                            {task.description}                            {task.description}

                          </p>                          </p>

                        </div>                        </div>

                      </div>                      </div>

                                            

                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>

                        {task.priority}                        {task.priority}

                      </span>                      </span>

                    </div>                    </div>



                    <div className="space-y-2 mb-4">                    <div className="space-y-2 mb-4">

                      {task.assignedTo && (                      {task.assignedTo && (

                        <div className="flex items-center text-sm text-gray-600">                        <div className="flex items-center text-sm text-gray-600">

                          <User className="h-4 w-4 mr-2" />                          <User className="h-4 w-4 mr-2" />

                          {task.assignedTo}                          {task.assignedTo}

                        </div>                        </div>

                      )}                      )}

                                            

                      {task.dueDate && (                      {task.dueDate && (

                        <div className="flex items-center text-sm text-gray-600">                        <div className="flex items-center text-sm text-gray-600">

                          <Clock className="h-4 w-4 mr-2" />                          <Clock className="h-4 w-4 mr-2" />

                          {new Date(task.dueDate).toLocaleDateString()}                          {new Date(task.dueDate).toLocaleDateString()}

                        </div>                        </div>

                      )}                      )}

                                            

                      {task.propertyId && (                      {task.propertyId && (

                        <div className="flex items-center text-sm text-gray-600">                        <div className="flex items-center text-sm text-gray-600">

                          <Home className="h-4 w-4 mr-2" />                          <Home className="h-4 w-4 mr-2" />

                          Propriedade: {task.propertyId}                          Propriedade: {task.propertyId}

                        </div>                        </div>

                      )}                      )}

                    </div>                    </div>



                    <div className="flex items-center justify-between">                    <div className="flex items-center justify-between">

                      <span className="text-sm text-gray-600">                      <span className="text-sm text-gray-600">

                        {getStatusLabel(task.status)}                        {getStatusLabel(task.status)}

                      </span>                      </span>

                                            

                      {task.checklistTotal > 0 && (                      {task.checklistTotal > 0 && (

                        <span className="text-sm text-gray-600">                        <span className="text-sm text-gray-600">

                          {task.checklistCompleted}/{task.checklistTotal} itens                          {task.checklistCompleted}/{task.checklistTotal} itens

                        </span>                        </span>

                      )}                      )}

                    </div>                    </div>

                  </div>                  </div>

                </motion.div>                </motion.div>

              ))}              ))}

            </motion.div>            </motion.div>

          )}          )}



          {/* No Search Results */}          {/* No Search Results */}

          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (

            <motion.div            <motion.div

              initial={{ opacity: 0 }}              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}              animate={{ opacity: 1 }}

              className="bg-white rounded-lg shadow-sm border p-8 text-center"              className="bg-white rounded-lg shadow-sm border p-8 text-center"

            >            >

              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />

              <h3 className="text-lg font-semibold text-gray-900 mb-2">              <h3 className="text-lg font-semibold text-gray-900 mb-2">

                Nenhuma tarefa encontrada                Nenhuma tarefa encontrada

              </h3>              </h3>

              <p className="text-gray-600">              <p className="text-gray-600">

                Tente ajustar os filtros de busca.                Tente ajustar os filtros de busca.

              </p>              </p>

            </motion.div>            </motion.div>

          )}          )}

        </div>        </div>

      </div>      </div>

    </ProtectedComponent>    </ProtectedComponent>

  );  );

}}

        propertyAddress: 'Av. Copacabana, 456 - Sala 203',    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        dueDate: '2025-10-17',    

        createdAt: '2025-10-14'    try {

      },      await deleteTask(id);

      {      toast.success('Tarefa excluída com sucesso');

        id: '3',      loadTasks();

        title: 'Inspeção Vistoria',    } catch (error) {

        description: 'Vistoria para entrada de novo inquilino',      toast.error('Erro ao excluir tarefa');

        status: 'completed',    }

        priority: 'medium',  };

        type: 'inspection',

        assignedTo: 'Ana Costa',  const getStatusColor = (status: string) => {

        propertyAddress: 'Rua Principal, 789',    switch (status) {

        dueDate: '2025-10-15',      case 'completed': return 'bg-green-100 text-green-800';

        createdAt: '2025-10-13'      case 'in_progress': return 'bg-blue-100 text-blue-800';

      }      case 'pending': return 'bg-yellow-100 text-yellow-800';

    ];      case 'cancelled': return 'bg-red-100 text-red-800';

          default: return 'bg-gray-100 text-gray-800';

    setTasks(mockTasks);    }

    setLoading(false);  };

  }, []);

  const getPriorityColor = (priority: string) => {

  const getStatusColor = (status: string) => {    switch (priority) {

    switch (status) {      case 'urgent': return 'bg-red-100 text-red-800';

      case 'pending': return 'bg-yellow-100 text-yellow-800';      case 'high': return 'bg-orange-100 text-orange-800';

      case 'in_progress': return 'bg-blue-100 text-blue-800';      case 'medium': return 'bg-yellow-100 text-yellow-800';

      case 'completed': return 'bg-green-100 text-green-800';      case 'low': return 'bg-green-100 text-green-800';

      case 'cancelled': return 'bg-red-100 text-red-800';      default: return 'bg-gray-100 text-gray-800';

      default: return 'bg-gray-100 text-gray-800';    }

    }  };

  };

  return (

  const getPriorityColor = (priority: string) => {    <RouteGuard>

    switch (priority) {      <MobileNavigation activeItem="tasks">

      case 'urgent': return 'bg-red-500';        <motion.div 

      case 'high': return 'bg-orange-500';          className="p-6"

      case 'medium': return 'bg-yellow-500';          variants={pageVariants}

      case 'low': return 'bg-green-500';          initial="hidden"

      default: return 'bg-gray-500';          animate="visible"

    }        >

  };          <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center mb-6">

  const getStatusText = (status: string) => {              <div>

    switch (status) {                <h1 className="text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>

      case 'pending': return 'Pendente';                <p className="text-gray-600 mt-2">

      case 'in_progress': return 'Em Andamento';                  Gerencie e acompanhe todas as tarefas de limpeza e manutenção

      case 'completed': return 'Concluída';                </p>

      case 'cancelled': return 'Cancelada';              </div>

      default: return status;              

    }              <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>

  };                <button

                  onClick={() => router.push('/tasks/new')}

  const handleCreateTask = () => {                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"

    console.log('Criar nova tarefa');                >

    alert('Funcionalidade de criar tarefa em desenvolvimento');                  <Plus className="h-4 w-4" />

  };                  Criar Nova Tarefa

                </button>

  const handleEditTask = (taskId: string) => {              </ProtectedComponent>

    console.log('Editar tarefa:', taskId);            </div>

    alert(`Editar tarefa ${taskId} - Em desenvolvimento`);

  };            <div className="bg-white rounded-lg shadow">

              <div className="p-4 border-b">

  const handleDeleteTask = async (taskId: string) => {                <div className="flex flex-col sm:flex-row gap-4">

    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {                  <div className="flex-1">

      console.log('Deletar tarefa:', taskId);                    <div className="relative">

      setTasks(tasks.filter(task => task.id !== taskId));                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />

      alert('Tarefa excluída com sucesso!');                      <input

    }                        type="text"

  };                        placeholder="Buscar tarefas..."

                        value={filters.search}

  const filteredTasks = tasks.filter(task => {                        onChange={(e) => setFilters({...filters, search: e.target.value})}

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"

                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());                      />

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;                    </div>

    return matchesSearch && matchesStatus;                  </div>

  });                  <select

                    value={filters.status}

  return (                    onChange={(e) => setFilters({...filters, status: e.target.value})}

    <RouteGuard>                    className="px-3 py-2 border border-gray-300 rounded-md"

      <MobileNavigation activeItem="tasks">                  >

        <div className="min-h-screen bg-gray-50">                    <option value="">Todos os Status</option>

          <div className="max-w-6xl mx-auto px-4 py-6">                    <option value="pending">Pendente</option>

            <motion.div                    <option value="in_progress">Em Andamento</option>

              initial={{ opacity: 0, y: 20 }}                    <option value="completed">Concluída</option>

              animate={{ opacity: 1, y: 0 }}                    <option value="cancelled">Cancelada</option>

              transition={{ duration: 0.5 }}                  </select>

            >                  <select

              {/* Header */}                    value={filters.priority}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">                    onChange={(e) => setFilters({...filters, priority: e.target.value})}

                <div>                    className="px-3 py-2 border border-gray-300 rounded-md"

                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">                  >

                    <Calendar className="h-6 w-6 text-blue-600" />                    <option value="">Todas as Prioridades</option>

                    Gestão de Tarefas                    <option value="urgent">Urgente</option>

                  </h1>                    <option value="high">Alta</option>

                  <p className="text-gray-600">Gerencie todas as tarefas e agendamentos</p>                    <option value="medium">Média</option>

                </div>                    <option value="low">Baixa</option>

                                  </select>

                <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>                </div>

                  <button              </div>

                    onClick={handleCreateTask}

                    className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"              <div className="overflow-x-auto">

                  >                <table className="w-full">

                    <Plus className="h-4 w-4" />                  <thead className="bg-gray-50">

                    Nova Tarefa                    <tr>

                  </button>                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                </ProtectedComponent>                        Tarefa

              </div>                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

              {/* Filters */}                        Status

              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">                      </th>

                <div className="flex flex-col sm:flex-row gap-4">                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  <div className="flex-1">                        Prioridade

                    <div className="relative">                      </th>

                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                      <input                        Responsável

                        type="text"                      </th>

                        placeholder="Buscar tarefas..."                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                        value={searchTerm}                        Vencimento

                        onChange={(e) => setSearchTerm(e.target.value)}                      </th>

                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                      />                        Ações

                    </div>                      </th>

                  </div>                    </tr>

                                    </thead>

                  <select                  <tbody className="bg-white divide-y divide-gray-200">

                    value={statusFilter}                    {loading ? (

                    onChange={(e) => setStatusFilter(e.target.value)}                      <tr>

                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"                        <td colSpan={6} className="px-6 py-4 text-center">

                  >                          Carregando...

                    <option value="all">Todos os Status</option>                        </td>

                    <option value="pending">Pendente</option>                      </tr>

                    <option value="in_progress">Em Andamento</option>                    ) : tasks.length === 0 ? (

                    <option value="completed">Concluída</option>                      <tr>

                    <option value="cancelled">Cancelada</option>                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">

                  </select>                          Nenhuma tarefa encontrada

                </div>                        </td>

              </div>                      </tr>

                    ) : (

              {/* Tasks List */}                      tasks.map((task) => (

              <div className="space-y-4">                        <tr key={task.id} className="hover:bg-gray-50">

                {loading ? (                          <td className="px-6 py-4">

                  <div className="text-center py-12">                            <div>

                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>                              <div className="font-medium text-gray-900">{task.title}</div>

                    <p className="mt-2 text-gray-600">Carregando tarefas...</p>                              {task.description && (

                  </div>                                <div className="text-sm text-gray-500">{task.description}</div>

                ) : filteredTasks.length === 0 ? (                              )}

                  <div className="text-center py-12">                            </div>

                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />                          </td>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">                          <td className="px-6 py-4">

                      Nenhuma tarefa encontrada                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>

                    </h3>                              {task.status}

                    <p className="text-gray-600 mb-4">                            </span>

                      {searchTerm || statusFilter !== 'all'                           </td>

                        ? 'Tente ajustar os filtros de busca'                          <td className="px-6 py-4">

                        : 'Comece criando sua primeira tarefa'                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>

                      }                              {task.priority}

                    </p>                            </span>

                    <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>                          </td>

                      <button                          <td className="px-6 py-4 text-sm text-gray-900">

                        onClick={handleCreateTask}                            {task.assignedToName || 'Não atribuído'}

                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"                          </td>

                      >                          <td className="px-6 py-4 text-sm text-gray-900">

                        Criar Primeira Tarefa                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : '-'}

                      </button>                          </td>

                    </ProtectedComponent>                          <td className="px-6 py-4 text-sm font-medium">

                  </div>                            <div className="flex space-x-2">

                ) : (                              <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>

                  filteredTasks.map((task, index) => (                                <button

                    <motion.div                                  onClick={() => router.push(`/tasks/${task.id}/edit`)}

                      key={task.id}                                  className="text-blue-600 hover:text-blue-900"

                      initial={{ opacity: 0, y: 20 }}                                >

                      animate={{ opacity: 1, y: 0 }}                                  Editar

                      transition={{ duration: 0.3, delay: index * 0.1 }}                                </button>

                      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"                                <button

                    >                                  onClick={() => handleDelete(task.id)}

                      <div className="flex items-start justify-between">                                  className="text-red-600 hover:text-red-900"

                        <div className="flex-1 min-w-0">                                >

                          <div className="flex items-center gap-3 mb-2">                                  Excluir

                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} title={task.priority}></div>                                </button>

                            <h3 className="text-lg font-medium text-gray-900 truncate">                              </ProtectedComponent>

                              {task.title}                            </div>

                            </h3>                          </td>

                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>                        </tr>

                              {getStatusText(task.status)}                      ))

                            </span>                    )}

                          </div>                  </tbody>

                                          </table>

                          {task.description && (              </div>

                            <p className="text-gray-600 mb-3">{task.description}</p>            </div>

                          )}          </div>

                                  </motion.div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">      </MobileNavigation>

                            {task.assignedTo && (    </RouteGuard>

                              <div className="flex items-center gap-1">  );

                                <User className="h-4 w-4" />}
                                {task.assignedTo}
                              </div>
                            )}
                            {task.propertyAddress && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {task.propertyAddress}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        
                        <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditTask(task.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar tarefa"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir tarefa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </ProtectedComponent>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pendentes</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-gray-600">Em Andamento</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Concluídas</div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-gray-900">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </MobileNavigation>
    </RouteGuard>
  );
}