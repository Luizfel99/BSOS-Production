// Componente para Gestão de Propriedades Airbnb
'use client';

import { useState } from 'react';
import { useUniqueId } from '@/hooks/useUtils';
import { safeArray, safeGet } from '@/utils/defensive';

interface Propriedade {
  id: string;
  nome: string;
  endereco: string;
  tipo: 'apartamento' | 'casa' | 'studio' | 'quarto';
  capacidade: number;
  chavesLocalizacao: string;
  instrucoes: string;
  tempoLimpeza: number; // em minutos
  valor: number;
  hostaway_id?: string;
  airbnb_id?: string;
  status: 'ativo' | 'inativo' | 'manutencao';
}

interface Reserva {
  id: string;
  propriedade_id: string;
  guest_name: string;
  checkin: string;
  checkout: string;
  guests: number;
  valor_limpeza: number;
  status: 'confirmado' | 'checkout_pendente' | 'limpeza_agendada' | 'pronto' | 'cancelado';
  cleaner_responsavel?: string;
  observacoes?: string;
  checkout_time?: string;
  checkin_time?: string;
}

export default function GestaoAirbnb() {
  const generateId = useUniqueId('prop');
  const [activeTab, setActiveTab] = useState<'propriedades' | 'reservas' | 'calendario'>('propriedades');
  
  const [propriedades, setPropriedades] = useState<Propriedade[]>([
    {
      id: '1',
      nome: 'Apto Centro - Vista Mar',
      endereco: 'Rua das Flores, 123 - Centro',
      tipo: 'apartamento',
      capacidade: 4,
      chavesLocalizacao: 'Portaria - Sr. João (24h)',
      instrucoes: 'Apartamento no 5º andar. Elevador funcionando. Chave na portaria com Sr. João.',
      tempoLimpeza: 120,
      valor: 80,
      airbnb_id: 'ABB123456',
      hostaway_id: 'HOST789',
      status: 'ativo'
    },
    {
      id: '2',
      nome: 'Casa Ipanema - 3 Quartos',
      endereco: 'Rua Visconde de Pirajá, 456',
      tipo: 'casa',
      capacidade: 6,
      chavesLocalizacao: 'Caixa de chaves - Código 1234',
      instrucoes: 'Casa térrea. Chaves na caixa ao lado do portão. Cuidado com o cachorro dos vizinhos.',
      tempoLimpeza: 180,
      valor: 120,
      airbnb_id: 'ABB789012',
      status: 'ativo'
    }
  ]);

  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: '1',
      propriedade_id: '1',
      guest_name: 'John Smith',
      checkin: '2024-10-08',
      checkout: '2024-10-10',
      guests: 2,
      valor_limpeza: 80,
      status: 'checkout_pendente',
      checkout_time: '11:00'
    },
    {
      id: '2',
      propriedade_id: '2',
      guest_name: 'Maria Santos',
      checkin: '2024-10-09',
      checkout: '2024-10-12',
      guests: 4,
      valor_limpeza: 120,
      status: 'confirmado',
      checkin_time: '15:00'
    },
    {
      id: '3',
      propriedade_id: '1',
      guest_name: 'Carlos Silva',
      checkin: '2024-10-10',
      checkout: '2024-10-13',
      guests: 3,
      valor_limpeza: 80,
      status: 'limpeza_agendada',
      cleaner_responsavel: 'Maria Silva',
      checkin_time: '16:00'
    }
  ]);

  const [novaPropriedade, setNovaPropriedade] = useState<Partial<Propriedade>>({
    nome: '',
    endereco: '',
    tipo: 'apartamento',
    capacidade: 1,
    chavesLocalizacao: '',
    instrucoes: '',
    tempoLimpeza: 120,
    valor: 80,
    status: 'ativo'
  });

  const cleaners = ['Maria Silva', 'Pedro Oliveira', 'Ana Costa', 'João Santos'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-blue-100 text-blue-700';
      case 'checkout_pendente': return 'bg-yellow-100 text-yellow-700';
      case 'limpeza_agendada': return 'bg-purple-100 text-purple-700';
      case 'pronto': return 'bg-green-100 text-green-700';
      case 'cancelado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'checkout_pendente': return 'Checkout Pendente';
      case 'limpeza_agendada': return 'Limpeza Agendada';
      case 'pronto': return 'Pronto';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const adicionarPropriedade = () => {
    if (novaPropriedade.nome && novaPropriedade.endereco) {
      const nova: Propriedade = {
        id: generateId(),
        nome: novaPropriedade.nome!,
        endereco: novaPropriedade.endereco!,
        tipo: novaPropriedade.tipo!,
        capacidade: novaPropriedade.capacidade!,
        chavesLocalizacao: novaPropriedade.chavesLocalizacao!,
        instrucoes: novaPropriedade.instrucoes!,
        tempoLimpeza: novaPropriedade.tempoLimpeza!,
        valor: novaPropriedade.valor!,
        status: novaPropriedade.status!
      };
      setPropriedades([...propriedades, nova]);
      setNovaPropriedade({
        nome: '',
        endereco: '',
        tipo: 'apartamento',
        capacidade: 1,
        chavesLocalizacao: '',
        instrucoes: '',
        tempoLimpeza: 120,
        valor: 80,
        status: 'ativo'
      });
    }
  };

  const atualizarStatusReserva = (reservaId: string, novoStatus: string, cleaner?: string) => {
    const updatedReservas = safeArray.map(reservas, (reserva) => 
      safeGet.string(reserva?.id) === reservaId 
        ? { ...reserva, status: novoStatus as any, cleaner_responsavel: cleaner }
        : reserva
    );
    setReservas(updatedReservas);
  };

  const getPropriedadeNome = (propriedadeId: string) => {
    const prop = safeArray.find(propriedades, p => 
      safeGet.string(p?.id) === propriedadeId
    );
    return prop ? safeGet.string(prop.nome, 'Propriedade') : 'Propriedade não encontrada';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão Airbnb & Hospedagem</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('propriedades')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'propriedades' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Propriedades
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'reservas' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Reservas
          </button>
          <button
            onClick={() => setActiveTab('calendario')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'calendario' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Calendário
          </button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Propriedades Ativas</h3>
          <p className="text-2xl font-bold text-green-600">
            {propriedades.filter(p => p.status === 'ativo').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Checkouts Hoje</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {reservas.filter(r => r.checkout === '2024-10-08').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Limpezas Agendadas</h3>
          <p className="text-2xl font-bold text-purple-600">
            {reservas.filter(r => r.status === 'limpeza_agendada').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Receita Mensal</h3>
          <p className="text-2xl font-bold text-blue-600">
            R$ {reservas.reduce((acc, r) => acc + r.valor_limpeza, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Conteúdo por Aba */}
      {activeTab === 'propriedades' && (
        <div className="space-y-6">
          {/* Nova Propriedade */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Propriedade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Propriedade</label>
                <input
                  type="text"
                  value={novaPropriedade.nome}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, nome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: Apto Centro - Vista Mar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  value={novaPropriedade.endereco}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, endereco: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Endereço completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={novaPropriedade.tipo}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, tipo: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="studio">Studio</option>
                  <option value="quarto">Quarto</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidade</label>
                <input
                  type="number"
                  value={novaPropriedade.capacidade}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, capacidade: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tempo de Limpeza (min)</label>
                <input
                  type="number"
                  value={novaPropriedade.tempoLimpeza}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, tempoLimpeza: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="30"
                  step="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Limpeza (R$)</label>
                <input
                  type="number"
                  value={novaPropriedade.valor}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, valor: parseFloat(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="0"
                  step="10"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização das Chaves</label>
                <input
                  type="text"
                  value={novaPropriedade.chavesLocalizacao}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, chavesLocalizacao: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ex: Portaria com Sr. João ou Caixa de chaves código 1234"
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruções Especiais</label>
                <textarea
                  value={novaPropriedade.instrucoes}
                  onChange={(e) => setNovaPropriedade({...novaPropriedade, instrucoes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={2}
                  placeholder="Instruções especiais para os cleaners"
                />
              </div>
            </div>
            
            <button
              onClick={adicionarPropriedade}
              className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Adicionar Propriedade
            </button>
          </div>

          {/* Lista de Propriedades */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriedades Cadastradas</h3>
              <div className="space-y-4">
                {propriedades.map((propriedade) => (
                  <div key={propriedade.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{propriedade.nome}</h4>
                        <p className="text-sm text-gray-600">{propriedade.endereco}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{propriedade.tipo.charAt(0).toUpperCase() + propriedade.tipo.slice(1)}</span>
                          <span>Até {propriedade.capacidade} pessoas</span>
                          <span>{propriedade.tempoLimpeza} min</span>
                          <span>R$ {propriedade.valor}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">
                            <strong>Chaves:</strong> {propriedade.chavesLocalizacao}
                          </p>
                          {propriedade.instrucoes && (
                            <p className="text-xs text-gray-600 mt-1">
                              <strong>Instruções:</strong> {propriedade.instrucoes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          propriedade.status === 'ativo' ? 'bg-green-100 text-green-700' :
                          propriedade.status === 'inativo' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {propriedade.status.charAt(0).toUpperCase() + propriedade.status.slice(1)}
                        </span>
                        {propriedade.airbnb_id && (
                          <span className="text-xs text-gray-500">Airbnb: {propriedade.airbnb_id}</span>
                        )}
                        {propriedade.hostaway_id && (
                          <span className="text-xs text-gray-500">Hostaway: {propriedade.hostaway_id}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reservas' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas e Limpezas</h3>
            <div className="space-y-4">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{reserva.guest_name}</h4>
                      <p className="text-sm text-gray-600">{getPropriedadeNome(reserva.propriedade_id)}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Check-in: {new Date(reserva.checkin).toLocaleDateString('pt-BR')} {reserva.checkin_time}</span>
                        <span>Check-out: {new Date(reserva.checkout).toLocaleDateString('pt-BR')} {reserva.checkout_time}</span>
                        <span>{reserva.guests} hóspedes</span>
                        <span>R$ {reserva.valor_limpeza}</span>
                      </div>
                      {reserva.cleaner_responsavel && (
                        <p className="text-sm text-blue-600 mt-1">
                          Cleaner: {reserva.cleaner_responsavel}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reserva.status)}`}>
                        {getStatusText(reserva.status)}
                      </span>
                      <div className="flex space-x-2">
                        {reserva.status === 'checkout_pendente' && (
                          <button
                            onClick={() => atualizarStatusReserva(reserva.id, 'limpeza_agendada')}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                          >
                            Agendar Limpeza
                          </button>
                        )}
                        {reserva.status === 'limpeza_agendada' && (
                          <button
                            onClick={() => atualizarStatusReserva(reserva.id, 'pronto')}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Marcar Pronto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendario' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário de Limpezas</h3>
          <div className="grid grid-cols-7 gap-2">
            {/* Header dias da semana */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} className="p-2 text-center font-medium text-gray-700 bg-gray-50">
                {dia}
              </div>
            ))}
            
            {/* Dias do mês */}
            {Array.from({length: 31}, (_, i) => i + 1).map(dia => {
              const reservasDoDia = reservas.filter(r => 
                new Date(r.checkout).getDate() === dia && r.status === 'limpeza_agendada'
              );
              
              return (
                <div key={dia} className="p-2 border border-gray-200 min-h-20">
                  <div className="font-medium text-gray-900">{dia}</div>
                  {reservasDoDia.map(reserva => (
                    <div key={reserva.id} className="text-xs bg-purple-100 text-purple-700 p-1 rounded mt-1">
                      {reserva.guest_name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}