/**
 * 🧹 EXEMPLO DE USO DOS SERVIÇOS ORGANIZADOS
 * Demonstração de como usar os novos serviços nos componentes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

// Importações dos serviços organizados
import { 
  createCleaning, 
  getCleanings, 
  startCleaning, 
  completeCleaning 
} from '@/services/cleanings';

import { 
  getProperties, 
  schedulePropertyCleaning,
  updatePropertyStatus 
} from '@/services/properties';

import { 
  getEmployees, 
  employeeCheckin, 
  employeeCheckout 
} from '@/services/employees';

import { 
  createTask, 
  getTasks, 
  completeTask 
} from '@/services/tasks';

// Importações dos utilitários
import { 
  formatCurrency, 
  getStatusColor 
} from '@/utils/format';

import { formatRelativeTime, formatDate, formatDuration } from '@/utils/date';

// Ou usando as versões organizadas:
// import { CleaningService, PropertyService, EmployeeService } from '@/services';
// import { FormatUtils, DateUtils } from '@/utils';

interface CleaningExampleProps {
  propertyId: string;
  employeeId: string;
}

export default function CleaningExample({ propertyId, employeeId }: CleaningExampleProps) {
  const [cleanings, setCleanings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotifications();

  // Carregar limpezas
  const loadCleanings = async () => {
    try {
      setLoading(true);
      const response = await getCleanings({
        propertyId,
        status: 'scheduled'
      });
      
      if (response.success) {
        setCleanings(response.data || []);
      }
    } catch (err) {
      error('Erro ao carregar limpezas');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova limpeza
  const handleCreateCleaning = async () => {
    try {
      const newCleaning = await createCleaning({
        propertyId,
        employeeId,
        type: 'regular',
        priority: 'medium',
        scheduledDate: new Date().toISOString(),
        estimatedDuration: 120, // 2 horas
      });

      if (newCleaning.success) {
        success('Limpeza agendada com sucesso!');
        loadCleanings(); // Recarregar lista
      }
    } catch (err) {
      error('Erro ao agendar limpeza');
    }
  };

  // Iniciar limpeza
  const handleStartCleaning = async (cleaningId: string) => {
    try {
      // Primeiro fazer check-in do funcionário
      await employeeCheckin(employeeId, {
        propertyId,
        notes: 'Iniciando limpeza'
      });

      // Depois iniciar a limpeza
      await startCleaning(cleaningId, employeeId);
      
      // Atualizar status da propriedade
      await updatePropertyStatus(propertyId, 'cleaning');

      success('Limpeza iniciada!');
      loadCleanings();
    } catch (err) {
      error('Erro ao iniciar limpeza');
    }
  };

  // Completar limpeza
  const handleCompleteCleaning = async (cleaningId: string) => {
    try {
      // Completar a limpeza
      await completeCleaning(cleaningId, {
        notes: 'Limpeza concluída com sucesso',
        rating: 5
      });

      // Fazer check-out do funcionário
      await employeeCheckout(employeeId, {
        completed_tasks: [cleaningId],
        notes: 'Limpeza finalizada',
        rating_request: true
      });

      // Atualizar status da propriedade
      await updatePropertyStatus(propertyId, 'available');

      success('Limpeza finalizada!');
      loadCleanings();
    } catch (err) {
      error('Erro ao finalizar limpeza');
    }
  };

  // Criar tarefa relacionada
  const handleCreateTask = async () => {
    try {
      await createTask({
        title: 'Verificar produtos de limpeza',
        description: 'Verificar se há produtos suficientes para próximas limpezas',
        type: 'administrative',
        priority: 'medium',
        assignedTo: employeeId,
        propertyId,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
      });

      success('Tarefa criada!');
    } catch (err) {
      error('Erro ao criar tarefa');
    }
  };

  useEffect(() => {
    loadCleanings();
  }, [propertyId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Limpezas</h2>
        <div className="space-x-3">
          <button
            onClick={handleCreateCleaning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Agendar Limpeza
          </button>
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Criar Tarefa
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {cleanings.map((cleaning: any) => (
            <div
              key={cleaning.id}
              className="bg-white rounded-lg shadow p-6 border-l-4"
              style={{ borderLeftColor: getStatusColor(cleaning.status) }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Limpeza {cleaning.type}
                  </h3>
                  <p className="text-gray-600">
                    Agendada para: {formatDate(cleaning.scheduledDate, 'datetime')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatRelativeTime(cleaning.scheduledDate)}
                  </p>
                  
                  {cleaning.estimatedDuration && (
                    <p className="text-sm text-gray-500">
                      Duração estimada: {Math.floor(cleaning.estimatedDuration / 60)}h {cleaning.estimatedDuration % 60}m
                    </p>
                  )}

                  {cleaning.cost && (
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(cleaning.cost)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white`}
                    style={{ backgroundColor: getStatusColor(cleaning.status) }}
                  >
                    {cleaning.status}
                  </span>

                  {cleaning.status === 'scheduled' && (
                    <button
                      onClick={() => handleStartCleaning(cleaning.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Iniciar
                    </button>
                  )}

                  {cleaning.status === 'in-progress' && (
                    <button
                      onClick={() => handleCompleteCleaning(cleaning.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </div>

              {cleaning.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{cleaning.notes}</p>
                </div>
              )}
            </div>
          ))}

          {cleanings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma limpeza agendada
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Exemplo de hook customizado usando os serviços
export function useCleanings(propertyId?: string) {
  const [cleanings, setCleanings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCleanings(
        propertyId ? { propertyId } : undefined
      );
      
      if (response.success) {
        setCleanings(response.data || []);
      } else {
        setError(response.error || 'Erro ao carregar limpezas');
      }
    } catch (err) {
      setError('Erro ao carregar limpezas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [propertyId]);

  return {
    cleanings,
    loading,
    error,
    refetch,
  };
}

// Exemplo de componente mais simples usando hook
export function CleaningList({ propertyId }: { propertyId: string }) {
  const { cleanings, loading, error, refetch } = useCleanings(propertyId);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {cleanings.map((cleaning: any) => (
        <div key={cleaning.id} className="p-4 border rounded">
          <h3>{cleaning.type}</h3>
          <p>{formatDate(cleaning.scheduledDate)}</p>
          <span className={`px-2 py-1 rounded text-sm bg-${getStatusColor(cleaning.status)}-100`}>
            {cleaning.status}
          </span>
        </div>
      ))}
    </div>
  );
}