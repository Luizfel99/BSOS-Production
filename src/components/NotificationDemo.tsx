'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Save, Edit, Trash2, Plus, Upload, FileText } from 'lucide-react';

interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

const mockTasks: TaskFormData[] = [
  {
    id: '1',
    title: 'Limpeza Apartamento 401',
    description: 'Limpeza completa com aspiração e produtos especiais',
    priority: 'high',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Manutenção Casa Verde',
    description: 'Limpeza semanal programada',
    priority: 'medium',
    status: 'in-progress'
  },
];

export default function NotificationDemo() {
  const {
    success,
    error,
    warning,
    info,
    loading,
    promise,
  } = useNotifications();

  const [tasks, setTasks] = useState<TaskFormData[]>(mockTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });

  // Simulate API calls with promises
  const simulateApiCall = (delay: number = 1500): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 90% success rate for demo
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Erro de conexão simulado'));
        }
      }, delay);
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      warning('Título é obrigatório');
      return;
    }

    try {
      const savePromise = simulateApiCall();
      
      await promise(savePromise, {
        loading: editingTask ? 'Atualizando tarefa...' : 'Salvando tarefa...',
        success: editingTask ? 'Tarefa atualizada com sucesso! ✨' : 'Tarefa criada com sucesso! 🎉',
        error: (err) => `Erro ao salvar: ${err.message}`
      });

      // Update state after successful save
      if (editingTask) {
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id 
            ? { ...formData, id: editingTask.id }
            : task
        ));
      } else {
        const newTask = { ...formData, id: Date.now().toString() };
        setTasks(prev => [...prev, newTask]);
      }

      // Reset form
      resetForm();
      
    } catch (err) {
      // Error is handled by the promise function
    }
  };

  const handleDelete = async (taskId: string, taskTitle: string) => {
    try {
      const deletePromise = simulateApiCall(1000);
      
      await promise(deletePromise, {
        loading: 'Removendo tarefa...',
        success: `"${taskTitle}" removida com sucesso! 🗑️`,
        error: 'Erro ao remover tarefa'
      });

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
    } catch (err) {
      // Error handled by promise
    }
  };

  const handleEdit = (task: TaskFormData) => {
    setEditingTask(task);
    setFormData(task);
    setIsFormOpen(true);
    info(`Editando "${task.title}"`);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending'
    });
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const handleUploadDemo = async () => {
    const files = ['documento.pdf', 'imagem.jpg', 'relatorio.xlsx'];
    const randomFile = files[Math.floor(Math.random() * files.length)];
    
    const uploadPromise = simulateApiCall(2000);
    
    try {
      await promise(uploadPromise, {
        loading: `Enviando ${randomFile}...`,
        success: `${randomFile} enviado com sucesso! 📁`,
        error: `Erro ao enviar ${randomFile}`
      });
    } catch (err) {
      // Error handled by promise
    }
  };

  const showValidationExample = () => {
    if (!formData.title) {
      warning('Título é obrigatório');
    } else if (formData.title.length < 3) {
      warning('Título deve ter pelo menos 3 caracteres');
    } else if (formData.title.length > 100) {
      warning('Título não pode ter mais de 100 caracteres');
    } else {
      success('Validação passou! 👍');
    }
  };

  const showDifferentTypes = () => {
    setTimeout(() => success('Operação realizada com sucesso! 🎉'), 0);
    setTimeout(() => error('Erro crítico encontrado! ❌'), 1000);
    setTimeout(() => warning('Atenção: Verifique os dados ⚠️'), 2000);
    setTimeout(() => info('Informação importante 💡'), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔔 Demo de Notificações BSOS
        </h1>
        <p className="text-gray-600 mb-6">
          Demonstração das notificações toast implementadas no sistema
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
          
          <button
            onClick={handleUploadDemo}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload className="w-4 h-4" />
            Upload Demo
          </button>
          
          <button
            onClick={showValidationExample}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <FileText className="w-4 h-4" />
            Validação
          </button>
          
          <button
            onClick={showDifferentTypes}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🎨 Todos os Tipos
          </button>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título da tarefa"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                <textarea
                  placeholder="Descrição"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
                
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in-progress">Em Progresso</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {editingTask ? 'Atualizar' : 'Salvar'}
                </button>
                
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Tarefas</h3>
          
          {tasks.map((task) => (
            <div key={task.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(task.id!, task.title)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}