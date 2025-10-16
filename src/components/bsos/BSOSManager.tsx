'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentDate, useIsClient } from '@/hooks/useSSRHooks';
import { 
  propertyHandlers, 
  employeeHandlers, 
  financeHandlers, 
  communicationHandlers,
  utilHandlers
} from '@/lib/handlers';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  EditValuesModal, 
  BonusModal, 
  ScheduleModal 
} from '@/components/Modals';

// Interfaces para o sistema de gerenciamento
interface Employee {
  id: string;
  name: string;
  role: 'cleaner' | 'supervisor';
  avatar: string;
  phone: string;
  email: string;
  status: 'online' | 'offline' | 'working' | 'break';
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  shift: {
    start: string;
    end: string;
  };
  performance: {
    rating: number;
    completedTasks: number;
    onTimeRate: number;
    qualityScore: number;
  };
  salary: {
    hourly: number;
    bonus: number;
    total: number;
  };
}

interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'commercial';
  size: number;
  assignedTeam: string[];
  lastCleaning: string;
  nextCleaning: string;
  status: 'clean' | 'needs-cleaning' | 'in-progress' | 'review';
  priority: 'low' | 'medium' | 'high';
  client: string;
  notes: string[];
}

interface CleaningTask {
  id: string;
  propertyId: string;
  propertyName: string;
  assignedTo: string[];
  type: 'normal' | 'deep' | 'move-out' | 'inspection';
  status: 'assigned' | 'in-progress' | 'review' | 'completed';
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  checklist: {
    total: number;
    completed: number;
  };
  photos: {
    required: number;
    uploaded: number;
  };
  quality: {
    rating?: number;
    feedback?: string;
    approved?: boolean;
  };
  payment: {
    base: number;
    extras: number;
    bonus: number;
    total: number;
    status: 'pending' | 'approved' | 'paid';
  };
}

interface ChatMessage {
  id: string;
  taskId: string;
  sender: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'photo' | 'alert' | 'system';
  read: boolean;
}

// Mock data para demonstração
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Maria Silva',
    role: 'cleaner',
    avatar: '/avatars/maria.jpg',
    phone: '+55 11 99999-1111',
    email: 'maria@brightshine.com',
    status: 'working',
    currentLocation: {
      lat: -23.5505,
      lng: -46.6333,
      address: 'Rua das Flores, 123 - Centro'
    },
    shift: { start: '08:00', end: '17:00' },
    performance: {
      rating: 4.8,
      completedTasks: 156,
      onTimeRate: 95,
      qualityScore: 92
    },
    salary: {
      hourly: 25,
      bonus: 150,
      total: 4350
    }
  },
  {
    id: '2',
    name: 'João Santos',
    role: 'cleaner',
    avatar: '/avatars/joao.jpg',
    phone: '+55 11 99999-2222',
    email: 'joao@brightshine.com',
    status: 'online',
    shift: { start: '09:00', end: '18:00' },
    performance: {
      rating: 4.6,
      completedTasks: 142,
      onTimeRate: 88,
      qualityScore: 89
    },
    salary: {
      hourly: 25,
      bonus: 120,
      total: 4120
    }
  },
  {
    id: '3',
    name: 'Ana Costa',
    role: 'supervisor',
    avatar: '/avatars/ana.jpg',
    phone: '+55 11 99999-3333',
    email: 'ana@brightshine.com',
    status: 'online',
    shift: { start: '08:00', end: '18:00' },
    performance: {
      rating: 4.9,
      completedTasks: 89,
      onTimeRate: 97,
      qualityScore: 96
    },
    salary: {
      hourly: 35,
      bonus: 200,
      total: 5800
    }
  }
];

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Apartamento Centro A12',
    address: 'Rua das Flores, 123 - Apt 12',
    type: 'apartment',
    size: 75,
    assignedTeam: ['1', '2'],
    lastCleaning: '2025-01-06T10:00:00',
    nextCleaning: '2025-01-08T14:00:00',
    status: 'needs-cleaning',
    priority: 'high',
    client: 'Carlos Silva',
    notes: ['Check-in hoje às 16h', 'Cliente VIP']
  },
  {
    id: '2',
    name: 'Casa Praia Villa Sunset',
    address: 'Av. Beira Mar, 456',
    type: 'house',
    size: 200,
    assignedTeam: ['1'],
    lastCleaning: '2025-01-07T09:00:00',
    nextCleaning: '2025-01-10T09:00:00',
    status: 'clean',
    priority: 'medium',
    client: 'Marina Oliveira',
    notes: ['Piscina precisa atenção especial']
  }
];

const mockTasks: CleaningTask[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Apartamento Centro A12',
    assignedTo: ['1'],
    type: 'normal',
    status: 'in-progress',
    scheduledDate: '2025-01-08T14:00:00',
    estimatedDuration: 120,
    actualDuration: 95,
    checklist: { total: 25, completed: 18 },
    photos: { required: 6, uploaded: 4 },
    quality: { rating: 4.5 },
    payment: {
      base: 120,
      extras: 20,
      bonus: 15,
      total: 155,
      status: 'pending'
    }
  }
];

export default function BSOSManager() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { success, error, warning, info, loading } = useNotifications();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTask, setSelectedTask] = useState<CleaningTask | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Estados para modais
  const [editValuesModal, setEditValuesModal] = useState({ isOpen: false, taskId: '', currentValue: 0 });
  const [bonusModal, setBonusModal] = useState({ isOpen: false, employeeId: '', employeeName: '' });
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, propertyId: '', propertyName: '' });

  // Funções de ação para propriedades
  const handleViewPropertyDetails = async (propertyId: string) => {
    const result = await propertyHandlers.viewDetails(propertyId);
    if (result.success) {
      // Aqui você pode abrir um modal com os detalhes
      console.log('Dados da propriedade:', result.data);
    }
  };

  const handleScheduleCleaning = async (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    if (property) {
      setScheduleModal({
        isOpen: true,
        propertyId,
        propertyName: property.name,
      });
    } else {
      error('Propriedade não encontrada');
    }
  };

  // Função para lidar com o save do modal de agendamento
  const handleSaveSchedule = async (scheduleData: any) => {
    const result = await propertyHandlers.scheduleCleaning(scheduleModal.propertyId, scheduleData);
    if (result.success) {
      success('Limpeza agendada com sucesso! 📅');
      setScheduleModal({ isOpen: false, propertyId: '', propertyName: '' });
    }
  };

  // Funções de ação para funcionários
  const handleEmployeeCheckIn = async (employeeId: string) => {
    // Tentar obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          await employeeHandlers.checkIn(employeeId, location);
        },
        async () => {
          // Se não conseguir localização, fazer check-in sem ela
          await employeeHandlers.checkIn(employeeId);
        }
      );
    } else {
      await employeeHandlers.checkIn(employeeId);
    }
  };

  const handleEmployeeCheckOut = async (employeeId: string) => {
    const result = await employeeHandlers.checkOut(employeeId);
    if (result.success) {
      // Atualizar status do funcionário na UI
      console.log('Check-out realizado:', result.data);
    }
  };

  // Funções para relatórios e performance
  const handleViewFullReport = async (employeeId: string) => {
    utilHandlers.handleLocalAction('Abrindo relatório completo', () => {
      // Aqui você pode abrir um modal ou navegar para uma página de relatório
      setSelectedEmployee(mockEmployees.find(emp => emp.id === employeeId) || null);
    });
  };

  const handleSetBonus = async (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    if (employee) {
      setBonusModal({
        isOpen: true,
        employeeId,
        employeeName: employee.name,
      });
    } else {
      error('Funcionário não encontrado');
    }
  };

  // Função para lidar com o save do modal de bônus
  const handleSaveBonus = async (bonus: number, reason: string, month: number, year: number) => {
    const result = await employeeHandlers.updatePerformance(bonusModal.employeeId, {
      bonus,
      reason,
      month,
      year,
    });

    if (result.success) {
      success(`Bônus de R$ ${bonus.toFixed(2)} aprovado com sucesso! 💰`);
      setBonusModal({ isOpen: false, employeeId: '', employeeName: '' });
    }
  };

  // Funções de comunicação
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedTask) {
      const result = await communicationHandlers.sendMessage(
        `task-${selectedTask.id}`, // ID do canal baseado na tarefa
        newMessage
      );
      
      if (result.success) {
        setNewMessage('');
        // Atualizar lista de mensagens
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          taskId: selectedTask.id,
          sender: user?.id || 'current-user',
          senderName: user?.name || 'Você',
          message: newMessage,
          timestamp: new Date().toISOString(),
          type: 'text',
          read: false,
        };
        setChatMessages(prev => [...prev, newMsg]);
      }
    }
  };

  // Funções financeiras
  const handleEditValues = async (taskId: string) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      setEditValuesModal({
        isOpen: true,
        taskId,
        currentValue: task.payment.total,
      });
    } else {
      error('Tarefa não encontrada');
    }
  };

  // Função para lidar com o save do modal de valores
  const handleSaveValues = async (newValue: number, reason: string) => {
    // Aqui você pode implementar a API call para atualizar valores
    success(`Valor atualizado para R$ ${newValue.toFixed(2)}. Motivo: ${reason}`);
    setEditValuesModal({ isOpen: false, taskId: '', currentValue: 0 });
  };

  const handleApprovePayment = async (taskId: string) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      const result = await financeHandlers.approvePayment(taskId);
      if (result.success) {
        // Atualizar status do pagamento na UI
        console.log('Pagamento aprovado:', result.data);
        success(`Pagamento de R$ ${task.payment.total.toFixed(2)} aprovado! 💰`);
      }
    }
  };

  // Função para escala automática
  const handleGenerateAutoSchedule = async () => {
    utilHandlers.handleLocalAction('Gerando escala inteligente', async () => {
      // Simular geração de escala baseada em dados
      const scheduleData = {
        algorithm: 'intelligent',
        period: 'weekly',
        factors: ['performance', 'availability', 'location', 'workload'],
        employees: mockEmployees.map(emp => emp.id),
        properties: mockProperties.map(prop => prop.id),
      };
      
      loading('Analisando dados de performance e disponibilidade...', { duration: 2000 });
      
      setTimeout(() => {
        success('Escala inteligente gerada com sucesso! 📊');
        console.log('Escala gerada com base em:', scheduleData);
      }, 2000);
    });
  };

  // Dashboard de Controle Diário
  const DailyControlDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                PROP
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Propriedades Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">{mockProperties.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                TEAM
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Equipe Online</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mockEmployees.filter(e => e.status !== 'offline').length}/{mockEmployees.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                TASK
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tarefas Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">{mockTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                FIN
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturamento Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">R$ 1.250</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Properties - Daily Status</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockProperties.map((property) => (
              <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">
                        {property.type === 'apartment' ? 'APT' : property.type === 'house' ? 'HSE' : 'OTH'}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{property.name}</h4>
                        <p className="text-sm text-gray-600">{property.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'clean' ? 'bg-green-100 text-green-800' :
                        property.status === 'needs-cleaning' ? 'bg-yellow-100 text-yellow-800' :
                        property.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {property.status === 'clean' ? 'Limpo' :
                         property.status === 'needs-cleaning' ? 'Precisa Limpeza' :
                         property.status === 'in-progress' ? 'Em Andamento' : 'Revisão'}
                      </span>
                      <span className="text-gray-600">{property.size}m²</span>
                      <span className={`font-medium ${
                        property.priority === 'high' ? 'text-red-600' :
                        property.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {property.priority === 'high' ? 'High Priority' : 
                         property.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <span>👤 Cliente: {property.client}</span>
                      <span>🗓️ Próxima: {new Date(property.nextCleaning).toLocaleString('pt-BR')}</span>
                    </div>

                    {/* Assigned Team */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">Equipe:</span>
                      {property.assignedTeam.map((memberId) => {
                        const member = mockEmployees.find(e => e.id === memberId);
                        return member ? (
                          <div key={memberId} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === 'working' ? 'bg-blue-500' :
                              member.status === 'online' ? 'bg-green-500' :
                              member.status === 'break' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></div>
                            <span className="text-xs">{member.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>

                    {property.notes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notas:</span> {property.notes.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => handleViewPropertyDetails(property.id)}
                    >
                      Ver Detalhes
                    </button>
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => handleScheduleCleaning(property.id)}
                    >
                      Agendar Limpeza
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

  // Controle de Presença por GPS
  const AttendanceControl = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">📍 Controle de Presença - GPS</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Rastreamento Ativo</span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        employee.status === 'working' ? 'bg-blue-500' :
                        employee.status === 'online' ? 'bg-green-500' :
                        employee.status === 'break' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.role === 'cleaner' ? 'Funcionário' : 'Supervisor'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>📞 {employee.phone}</span>
                        <span>⏰ {employee.shift.start} - {employee.shift.end}</span>
                      </div>
                      {employee.currentLocation && (
                        <div className="mt-2">
                          <p className="text-sm text-blue-600">
                            📍 {employee.currentLocation.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            Atualizado há 2 min
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      employee.status === 'working' ? 'bg-blue-100 text-blue-800' :
                      employee.status === 'online' ? 'bg-green-100 text-green-800' :
                      employee.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.status === 'working' ? 'Trabalhando' :
                       employee.status === 'online' ? 'Online' :
                       employee.status === 'break' ? 'Pausa' : 'Offline'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                        onClick={() => handleEmployeeCheckIn(employee.id)}
                      >
                        Check-in
                      </button>
                      <button 
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                        onClick={() => handleEmployeeCheckOut(employee.id)}
                      >
                        Check-out
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedEmployee(employee)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Ver Localização
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

  // Avaliação de Desempenho
  const PerformanceEvaluation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Performance Evaluation</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockEmployees.map((employee) => (
              <div key={employee.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{employee.name}</h4>
                      <p className="text-gray-600">{employee.role === 'cleaner' ? 'Funcionário' : 'Supervisor'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{employee.performance.rating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Nota Geral</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{employee.performance.completedTasks}</div>
                    <div className="text-sm text-gray-600">Tarefas Concluídas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{employee.performance.onTimeRate}%</div>
                    <div className="text-sm text-gray-600">Pontualidade</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{employee.performance.qualityScore}%</div>
                    <div className="text-sm text-gray-600">Qualidade</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">R$ {employee.salary.total}</div>
                    <div className="text-sm text-gray-600">Salário Mensal</div>
                  </div>
                </div>

                {/* Performance Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pontualidade</span>
                      <span>{employee.performance.onTimeRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${employee.performance.onTimeRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Qualidade</span>
                      <span>{employee.performance.qualityScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${employee.performance.qualityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => handleViewFullReport(employee.id)}
                  >
                    Ver Relatório Completo
                  </button>
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => handleSetBonus(employee.id)}
                  >
                    Definir Bônus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Comunicação Interna
  const InternalCommunication = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Internal Communication - Task Chat</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task List */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-gray-900 mb-3">Tarefas Ativas</h4>
              <div className="space-y-2">
                {mockTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTask?.id === task.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{task.propertyName}</div>
                    <div className="text-xs text-gray-600">
                      {mockEmployees.find(e => e.id === task.assignedTo[0])?.name}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${
                        task.status === 'in-progress' ? 'bg-blue-500' :
                        task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                      <span className="text-xs text-gray-500">2 mensagens</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedTask ? (
                <div className="border rounded-lg h-96 flex flex-col">
                  <div className="px-4 py-3 border-b bg-gray-50 rounded-t-lg">
                    <h4 className="font-medium">{selectedTask.propertyName}</h4>
                    <p className="text-sm text-gray-600">
                      Chat com {mockEmployees.find(e => e.id === selectedTask.assignedTo[0])?.name}
                    </p>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-100 rounded-lg p-3">
                            <p className="text-sm">Iniciando limpeza do apartamento. Tudo ok com o checklist!</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Maria - 14:30</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 justify-end">
                        <div className="flex-1">
                          <div className="bg-blue-500 text-white rounded-lg p-3 ml-12">
                            <p className="text-sm">Perfeito! Lembre-se das fotos before/after.</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">Você - 14:32</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                        onClick={handleSendMessage}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p>Selecione uma tarefa para iniciar o chat</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Controle de Pagamentos
  const PaymentControl = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">💸 Controle de Pagamentos</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{task.propertyName}</h4>
                    <p className="text-sm text-gray-600">
                      {mockEmployees.find(e => e.id === task.assignedTo[0])?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(task.scheduledDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    task.payment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.payment.status === 'paid' ? 'Pago' :
                     task.payment.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">R$ {task.payment.base}</div>
                    <div className="text-xs text-gray-600">Valor Base</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">R$ {task.payment.extras}</div>
                    <div className="text-xs text-gray-600">Extras</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="font-semibold text-yellow-600">R$ {task.payment.bonus}</div>
                    <div className="text-xs text-gray-600">Bônus</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="font-semibold text-purple-600">R$ {task.payment.total}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => handleEditValues(task.id)}
                  >
                    Editar Valores
                  </button>
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    onClick={() => handleApprovePayment(task.id)}
                  >
                    Aprovar Pagamento
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Escala Inteligente
  const SmartScheduling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">🧩 Escala Inteligente</h3>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
            onClick={handleGenerateAutoSchedule}
          >
            Gerar Escala Automática
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocation Algorithm */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">🤖 Algoritmo de Alocação</h4>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>📍</span>
                    <span className="font-medium">Proximidade Geográfica</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Prioriza funcionários mais próximos para reduzir tempo de deslocamento
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>⏰</span>
                    <span className="font-medium">Disponibilidade</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Considera horários livres e preferências de cada funcionário
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>🎯</span>
                    <span className="font-medium">Especialização</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Aloca baseado no tipo de serviço e expertise do funcionário
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span>⚖️</span>
                    <span className="font-medium">Balanceamento</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Distribui carga de trabalho equilibradamente entre a equipe
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Suggested Schedule */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">📅 Escala Sugerida - Hoje</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium">08:00 - 10:00</h5>
                      <p className="text-sm text-gray-600">Apartamento Centro A12</p>
                    </div>
                    <span className="text-green-600 text-sm">✓ Otimizado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">Maria Silva</span>
                    <span className="text-xs text-gray-500">• 2.1km de casa</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium">10:30 - 13:30</h5>
                      <p className="text-sm text-gray-600">Casa Praia Villa Sunset</p>
                    </div>
                    <span className="text-green-600 text-sm">✓ Otimizado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">João Santos</span>
                    <span className="text-xs text-gray-500">• Especialista em casas</span>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium">14:00 - 16:00</h5>
                      <p className="text-sm text-gray-600">Inspeção Qualidade</p>
                    </div>
                    <span className="text-blue-600 text-sm">👁️ Supervisão</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <span className="text-sm">Ana Costa</span>
                    <span className="text-xs text-gray-500">• Supervisor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'Painel de Controle', icon: '🧾' },
    { id: 'attendance', name: 'Controle Presença', icon: '🧍‍♀️' },
    { id: 'performance', name: 'Avaliação Desempenho', icon: '📋' },
    { id: 'communication', name: 'Comunicação', icon: '💬' },
    { id: 'payments', name: 'Controle Pagamentos', icon: '💸' },
    { id: 'scheduling', name: 'Escala Inteligente', icon: '🧩' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">👩‍💼 BSOS Manager - Team Management</h1>
            <p className="text-green-100">
              Controle total para supervisores e gerentes operacionais
            </p>
            <div className="mt-4 flex items-center space-x-6 text-green-100">
              <span>👥 {mockEmployees.length} funcionários</span>
              <span>🏠 {mockProperties.length} propriedades</span>
              <span>📋 {mockTasks.length} tarefas ativas</span>
            </div>
          </div>
          <div className="text-right">
            <RealTimeClock />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && <DailyControlDashboard />}
          {activeTab === 'attendance' && <AttendanceControl />}
          {activeTab === 'performance' && <PerformanceEvaluation />}
          {activeTab === 'communication' && <InternalCommunication />}
          {activeTab === 'payments' && <PaymentControl />}
          {activeTab === 'scheduling' && <SmartScheduling />}
        </div>
      </div>

      {/* Modais */}
      <EditValuesModal
        isOpen={editValuesModal.isOpen}
        onClose={() => setEditValuesModal({ isOpen: false, taskId: '', currentValue: 0 })}
        currentValue={editValuesModal.currentValue}
        onSave={handleSaveValues}
      />

      <BonusModal
        isOpen={bonusModal.isOpen}
        onClose={() => setBonusModal({ isOpen: false, employeeId: '', employeeName: '' })}
        employeeName={bonusModal.employeeName}
        onSave={handleSaveBonus}
      />

      <ScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={() => setScheduleModal({ isOpen: false, propertyId: '', propertyName: '' })}
        propertyName={scheduleModal.propertyName}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}

// Componente para relógio em tempo real - evita problemas de hidratação
function RealTimeClock() {
  const isClient = useIsClient();
  const currentDate = useCurrentDate();

  if (!isClient) {
    return (
      <div>
        <div className="text-2xl font-bold">--:--</div>
        <div className="text-green-100">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-2xl font-bold">
        {currentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-green-100">
        {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  );
}
