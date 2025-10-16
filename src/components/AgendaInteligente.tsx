/**
 * 📅 AGENDA INTELIGENTE - Bright & Shine
 * Sistema completo de agendamento com sincronização e atribuição automática
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Settings, Filter, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

interface Appointment {
  id: string;
  propertyId: string;
  propertyName: string;
  address: string;
  type: 'checkout' | 'checkin' | 'deep' | 'maintenance' | 'move_out';
  status: 'agendada' | 'em_andamento' | 'concluida' | 'auditada' | 'paga';
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // minutos
  assignedTeam: {
    leaderId: string;
    leaderName: string;
    members: Array<{ id: string; name: string; }>;
  };
  platform: 'airbnb' | 'hostaway' | 'booking' | 'manual';
  guestInfo?: {
    name: string;
    checkIn?: string;
    checkOut?: string;
    guests: number;
  };
  specialInstructions: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  checklist?: {
    id: string;
    completed: boolean;
    totalItems: number;
    completedItems: number;
    photos: string[];
  };
  location: {
    lat: number;
    lng: number;
    zone: string;
  };
  materials: Array<{
    item: string;
    quantity: number;
    confirmed: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  skills: string[];
  zones: string[];
  maxDailyTasks: number;
  currentTasks: number;
  rating: number;
  isAvailable: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}

export default function AgendaInteligente() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'property'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [autoAssignMode, setAutoAssignMode] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchTeamMembers();
    setupRealTimeSync();
  }, [selectedDate, viewMode, selectedProperty]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        date: selectedDate,
        view: viewMode,
        property: selectedProperty
      });
      
      const response = await fetch(`/api/agenda?${params}`);
      const data = await response.json();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team/members');
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error('Erro ao buscar equipe:', error);
    }
  };

  const setupRealTimeSync = () => {
    // Sincronização automática a cada 5 minutos
    const interval = setInterval(async () => {
      await syncWithPlatforms();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  };

  const syncWithPlatforms = async () => {
    setSyncStatus('syncing');
    try {
      const response = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platforms: ['airbnb', 'hostaway', 'turno', 'taskbird'],
          autoAssign: autoAssignMode
        })
      });
      
      if (response.ok) {
        await fetchAppointments();
        setSyncStatus('idle');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      setSyncStatus('error');
      console.error('Erro na sincronização:', error);
    }
  };

  const autoAssignTeam = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/agenda/${appointmentId}/auto-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        await fetchAppointments();
      }
    } catch (error) {
      console.error('Erro na atribuição automática:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    try {
      const response = await fetch(`/api/agenda/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await fetchAppointments();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      agendada: 'bg-blue-100 text-blue-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      concluida: 'bg-green-100 text-green-800',
      auditada: 'bg-purple-100 text-purple-800',
      paga: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Appointment['priority']) => {
    const colors = {
      low: 'border-l-gray-300',
      medium: 'border-l-blue-400',
      high: 'border-l-orange-400',
      urgent: 'border-l-red-500'
    };
    return colors[priority];
  };

  const renderDayView = () => {
    const dayAppointments = appointments.filter(app => 
      app.scheduledDate === selectedDate
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    return (
      <div className="space-y-4">
        {dayAppointments.map(appointment => (
          <div 
            key={appointment.id}
            className={`bg-white rounded-lg border-l-4 ${getPriorityColor(appointment.priority)} shadow-sm p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{appointment.scheduledTime}</span>
                  <span className="text-sm text-gray-500">
                    ({appointment.estimatedDuration}min)
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{appointment.propertyName}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="h-3 w-3" />
                  {appointment.address}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {appointment.platform.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Equipe Atribuída */}
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-gray-500" />
              {appointment.assignedTeam ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{appointment.assignedTeam.leaderName}</span>
                  {appointment.assignedTeam.members.length > 0 && (
                    <span className="text-sm text-gray-500">
                      +{appointment.assignedTeam.members.length} membros
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => autoAssignTeam(appointment.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Atribuir automaticamente
                </button>
              )}
            </div>

            {/* Checklist Progress */}
            {appointment.checklist && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Checklist</span>
                  <span>{appointment.checklist.completedItems}/{appointment.checklist.totalItems}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(appointment.checklist.completedItems / appointment.checklist.totalItems) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Guest Info */}
            {appointment.guestInfo && (
              <div className="text-sm text-gray-600 mb-3">
                <strong>Hóspede:</strong> {appointment.guestInfo.name} ({appointment.guestInfo.guests} pessoas)
                {appointment.guestInfo.checkOut && (
                  <span> • Check-out: {appointment.guestInfo.checkOut}</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t">
              <select
                value={appointment.status}
                onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="agendada">Agendada</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
                <option value="auditada">Auditada</option>
                <option value="paga">Paga</option>
              </select>
              
              <button className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1">
                Ver Detalhes
              </button>
              
              <button className="text-sm text-green-600 hover:text-green-800 px-2 py-1">
                Iniciar Checklist
              </button>
            </div>
          </div>
        ))}

        {dayAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum agendamento para este dia</p>
            <button className="mt-2 text-blue-600 hover:text-blue-800">
              Adicionar agendamento
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const dayStr = day.toISOString().split('T')[0];
          const dayAppointments = appointments.filter(app => app.scheduledDate === dayStr);
          
          return (
            <div key={dayStr} className="border rounded-lg p-2">
              <div className="font-medium text-center mb-2">
                {day.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map(app => (
                  <div key={app.id} className="text-xs p-1 bg-blue-50 rounded">
                    <div className="font-medium">{app.scheduledTime}</div>
                    <div className="truncate">{app.propertyName}</div>
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAppointments.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Schedule</h1>
          <p className="text-gray-600">Gestão completa de agendamentos e equipe</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={syncWithPlatforms}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar'}
          </button>
          
          <button 
            onClick={() => setShowNewAppointmentModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Sync Status */}
      {syncStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-red-800">Erro na sincronização. Verificar configurações das integrações.</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Visualização:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="border rounded px-3 py-1"
          >
            <option value="day">Dia</option>
            <option value="week">Semana</option>
            <option value="property">Por Propriedade</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Data:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Propriedade:</label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="all">Todas</option>
            <option value="prop-1">Apto Centro - Copacabana</option>
            <option value="prop-2">Casa Ipanema</option>
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoAssignMode}
            onChange={(e) => setAutoAssignMode(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Atribuição Automática</span>
        </label>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {appointments?.filter(a => a.status === 'agendada').length || 0}
          </div>
          <div className="text-sm text-blue-800">Agendadas</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {appointments?.filter(a => a.status === 'em_andamento').length || 0}
          </div>
          <div className="text-sm text-yellow-800">Em Andamento</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {appointments?.filter(a => a.status === 'concluida').length || 0}
          </div>
          <div className="text-sm text-green-800">Concluídas</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {teamMembers?.filter(m => m.isAvailable).length || 0}
          </div>
          <div className="text-sm text-purple-800">Equipe Disponível</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Carregando agendamentos...</p>
            </div>
          ) : (
            <>
              {viewMode === 'day' && renderDayView()}
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'property' && renderDayView()}
            </>
          )}
        </div>
      </div>

      {/* Modal Novo Agendamento */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Novo Agendamento</h3>
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Add appointment creation logic here
              setShowNewAppointmentModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                  <input type="time" className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
                  <select className="w-full border border-gray-300 rounded px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm touch-target" required>
                    <option value="">Selecione...</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-4 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-50 touch-target"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-6 py-4 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 touch-target"
                >
                  Criar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}