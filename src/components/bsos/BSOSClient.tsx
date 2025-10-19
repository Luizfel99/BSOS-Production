'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PortalCliente from '../PortalCliente';
import CanalComunicacao from '../CanalComunicacao';
import SistemaAvaliacao from '../SistemaAvaliacao';

// Component Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2H3a2 2 0 00-2 2v2z" />
  </svg>
);

const PhotoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
  </svg>
);

const StatusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const RatingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default function BSOSClient() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleViewDetails = (cleaningId: string) => {
    console.log('👀 Visualizando detalhes da limpeza ID:', cleaningId);
    alert(`Abrindo detalhes da limpeza ID: ${cleaningId}`);
  };

  const handleViewPhotos = () => {
    console.log('📸 Visualizando todas as fotos');
    alert('Abrindo galeria de fotos...');
  };

  const handleContactTeam = () => {
    console.log('📞 Contatando equipe');
    alert('Abrindo canal de comunicação com a equipe...');
  };

  const handleViewHistory = () => {
    console.log('📚 Visualizando histórico completo');
    alert('Abrindo histórico completo de serviços...');
  };

  const handleEvaluateServices = () => {
    console.log('⭐ Avaliando serviços');
    alert('Abrindo sistema de avaliações...');
  };

  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard Cliente',
      icon: DashboardIcon,
      component: null
    },
    {
      id: 'portal',
      name: 'Portal Completo',
      icon: PhotoIcon,
      component: PortalCliente
    },
    {
      id: 'communication',
      name: 'Comunicação',
      icon: ChatIcon,
      component: CanalComunicacao
    },
    {
      id: 'evaluation',
      name: 'Avaliações',
      icon: RatingIcon,
      component: SistemaAvaliacao
    }
  ];

  const ClientDashboard = () => (
    <div className="space-y-6">
      {/* Property Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Propriedades Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
            <DashboardIcon />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Limpezas Este Mês</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
            <StatusIcon />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfação Média</p>
              <p className="text-2xl font-semibold text-gray-900">4.9/5</p>
            </div>
            <RatingIcon />
          </div>
        </div>
      </div>

      {/* Recent Cleanings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Limpezas Recentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                property: 'Casa Copacabana #123',
                date: '2025-01-08',
                time: '09:00 - 11:00',
                status: 'Concluída',
                cleaner: 'Maria Silva',
                rating: 5,
                photos: 12
              },
              {
                property: 'Apartamento Ipanema #456',
                date: '2025-01-07',
                time: '14:00 - 16:00',
                status: 'Concluída',
                cleaner: 'João Santos',
                rating: 5,
                photos: 8
              },
              {
                property: 'Casa Barra #789',
                date: '2025-01-06',
                time: '10:00 - 12:00',
                status: 'Concluída',
                cleaner: 'Ana Costa',
                rating: 4,
                photos: 15
              }
            ].map((cleaning, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{cleaning.property}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>{cleaning.date}</span>
                      <span>🕐 {cleaning.time}</span>
                      <span>👤 {cleaning.cleaner}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center">
                        {cleaning.rating}/5
                      </div>
                      <span className="text-xs text-gray-500">Avaliação</span>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium">{cleaning.photos}</span>
                      <p className="text-xs text-gray-500">Fotos</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {cleaning.status}
                    </span>
                    <button 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                      onClick={() => handleViewDetails('cleaning-1')}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Próximas Limpezas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Casa Copacabana #123</p>
                  <p className="text-sm text-gray-600">Amanhã, 10:00 - 12:00</p>
                </div>
                <button 
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => handleViewDetails('cleaning-2')}
                >
                  Detalhes
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Apartamento Ipanema #456</p>
                  <p className="text-sm text-gray-600">10/01, 15:00 - 17:00</p>
                </div>
                <button 
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => handleViewDetails('cleaning-3')}
                >
                  Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="p-6 space-y-3">
            <button 
              className="w-full flex items-center justify-between p-4 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 touch-target"
              onClick={handleViewPhotos}
            >
              <div className="flex items-center space-x-3">
                <PhotoIcon />
                <span>Ver Todas as Fotos</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-4 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 touch-target"
              onClick={handleContactTeam}
            >
              <div className="flex items-center space-x-3">
                <ChatIcon />
                <span>Contatar Equipe</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={handleViewHistory}
            >
              <div className="flex items-center space-x-3">
                <HistoryIcon />
                <span>Histórico Completo</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button 
              className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={handleEvaluateServices}
            >
              <div className="flex items-center space-x-3">
                <RatingIcon />
                <span>Avaliar Serviços</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Status em Tempo Real</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Limpeza Casa #123 concluída</p>
                <p className="text-xs text-gray-500">15 minutos atrás</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Equipe chegou ao Apartamento #456</p>
                <p className="text-xs text-gray-500">2 horas atrás</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Limpeza Casa #789 agendada</p>
                <p className="text-xs text-gray-500">1 dia atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">BSOS Client - Portal de Transparência</h1>
            <p className="text-gray-600">Transparência, fotos, status e histórico para clientes e property managers</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Todas as propriedades atualizadas</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeSection === 'dashboard' && <ClientDashboard />}
          {sections.map((section) => {
            if (section.component && activeSection === section.id) {
              const Component = section.component;
              return <Component key={section.id} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
