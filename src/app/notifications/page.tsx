'use client';

import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { RouteGuard } from '@/components/RouteGuard';
import { MobileNavigation } from '@/components/MobileNavigation';

export default function NotificationsPage() {
  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Tarefa Concluída',
      message: 'Limpeza no Apt 101 foi finalizada com sucesso',
      time: '5 min atrás',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Agendamento Pendente',
      message: 'Nova solicitação de limpeza aguarda aprovação',
      time: '1 hora atrás',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Relatório Disponível',
      message: 'Relatório mensal de performance está pronto',
      time: '2 horas atrás',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <RouteGuard>
      <MobileNavigation activeItem="notifications">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Notificações
                  </h1>
                  <p className="text-gray-600">Central de avisos e atualizações</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Marcar todas como lidas
                </button>
              </div>

              <div className="space-y-4">
                {mockNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: notification.id * 0.1 }}
                    className={`bg-white rounded-lg shadow-sm border p-4 ${
                      !notification.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {mockNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma notificação
                  </h3>
                  <p className="text-gray-600">
                    Você está em dia! Não há notificações pendentes.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </MobileNavigation>
    </RouteGuard>
  );
}