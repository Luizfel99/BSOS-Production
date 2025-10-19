'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import RouteGuard from '@/components/RouteGuard';
import MobileNavigation from '@/components/MobileNavigation';
import ProtectedComponent from '@/components/ProtectedComponent';
import { getTaskDetails, updateTask, deleteTask } from '@/services/tasks';

const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['cleaning', 'maintenance', 'inspection', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  assignedTo: z.string().optional(),
  propertyId: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedDuration: z.number().optional(),
  materials: z.string().optional(),
  instructions: z.string().optional()
});

type TaskFormData = z.infer<typeof taskSchema>;

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(true);
  const [users, setUsers] = useState<Array<{id: string, name: string}>>([]);
  const [properties, setProperties] = useState<Array<{id: string, name: string, address: string}>>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema)
  });

  useEffect(() => {
    loadTaskData();
    loadFormData();
  }, [params.id]);

  const loadTaskData = async () => {
    try {
      setTaskLoading(true);
      const response = await getTaskDetails(params.id);
      
      if (response.success) {
        const task = response.data;
        
        // Set form values
        setValue('title', task.title);
        setValue('description', task.description || '');
        setValue('type', task.type);
        setValue('priority', task.priority);
        setValue('status', task.status);
        setValue('assignedTo', task.assignedTo || '');
        setValue('propertyId', task.propertyId || '');
        setValue('dueDate', task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
        setValue('estimatedDuration', task.estimatedDuration || 0);
        setValue('materials', task.materials || '');
        setValue('instructions', task.instructions || '');
      } else {
        toast.error('Tarefa não encontrada');
        router.push('/tasks');
      }
    } catch (error) {
      toast.error('Erro ao carregar tarefa');
      router.push('/tasks');
    } finally {
      setTaskLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      // Load users and properties for dropdowns
      const [usersResponse, propertiesResponse] = await Promise.all([
        fetch('/api/users').then(res => res.json()),
        fetch('/api/properties').then(res => res.json())
      ]);

      if (usersResponse.success) setUsers(usersResponse.data);
      if (propertiesResponse.success) setProperties(propertiesResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados do formulário:', error);
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      setLoading(true);
      
      const taskData = {
        ...data,
        estimatedDuration: data.estimatedDuration ? Number(data.estimatedDuration) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      };

      const response = await updateTask(params.id, taskData);
      
      if (response.success) {
        toast.success('Tarefa atualizada com sucesso!');
        router.push('/tasks');
      } else {
        toast.error(response.message || 'Erro ao atualizar tarefa');
      }
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await deleteTask(params.id);
      toast.success('Tarefa excluída com sucesso!');
      router.push('/tasks');
    } catch (error) {
      toast.error('Erro ao excluir tarefa');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (taskLoading) {
    return (
      <RouteGuard>
        <MobileNavigation activeItem="tasks">
          <div className="p-6 flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando tarefa...</p>
            </div>
          </div>
        </MobileNavigation>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <MobileNavigation activeItem="tasks">
        <motion.div 
          className="p-6"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Editar Tarefa</h1>
                  <p className="text-gray-600 mt-2">
                    Atualize as informações da tarefa
                  </p>
                </div>
              </div>
              
              <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleteLoading ? 'Excluindo...' : 'Excluir'}
                </button>
              </ProtectedComponent>
            </div>

            <ProtectedComponent allowedRoles={['owner', 'manager', 'supervisor']}>
              <div className="bg-white rounded-lg shadow">
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        {...register('title')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite o título da tarefa"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select
                        {...register('type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cleaning">Limpeza</option>
                        <option value="maintenance">Manutenção</option>
                        <option value="inspection">Inspeção</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridade
                      </label>
                      <select
                        {...register('priority')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        {...register('status')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pendente</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="completed">Concluída</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Responsável
                      </label>
                      <select
                        {...register('assignedTo')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione um responsável</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Propriedade
                      </label>
                      <select
                        {...register('propertyId')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione uma propriedade</option>
                        {properties.map((property) => (
                          <option key={property.id} value={property.id}>
                            {property.name} - {property.address}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Vencimento
                      </label>
                      <input
                        type="datetime-local"
                        {...register('dueDate')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duração Estimada (minutos)
                      </label>
                      <input
                        type="number"
                        {...register('estimatedDuration', { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 120"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva os detalhes da tarefa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Materiais Necessários
                    </label>
                    <textarea
                      {...register('materials')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Liste os materiais necessários"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instruções Especiais
                    </label>
                    <textarea
                      {...register('instructions')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Instruções especiais para a execução da tarefa"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </div>
                </form>
              </div>
            </ProtectedComponent>
          </div>
        </motion.div>
      </MobileNavigation>
    </RouteGuard>
  );
}