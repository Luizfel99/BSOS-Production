'use client';'use client';



import React, { useState, useEffect } from 'react';import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

import { motion } from 'framer-motion';import { motion } from 'framer-motion';

import { import { RouteGuard } from '@/components/RouteGuard';

  Bell, import { MobileNavigation } from '@/components/MobileNavigation';

  Check, 

  CheckCheck, export default function NotificationsPage() {

  Search,  const mockNotifications = [

  AlertCircle,    {

  Info,      id: 1,

  CheckCircle,      type: 'success',

  XCircle,      title: 'Tarefa Concluída',

  Trash2,      message: 'Limpeza no Apt 101 foi finalizada com sucesso',

  RefreshCw      time: '5 min atrás',

} from 'lucide-react';      read: false

import toast from 'react-hot-toast';    },

import ProtectedComponent from '@/components/auth/ProtectedComponent';    {

      id: 2,

interface Notification {      type: 'warning',

  id: string;      title: 'Agendamento Pendente',

  title: string;      message: 'Nova solicitação de limpeza aguarda aprovação',

  message: string;      time: '1 hora atrás',

  type: string;      read: false

  read: boolean;    },

  createdAt: string;    {

  updatedAt: string;      id: 3,

}      type: 'info',

      title: 'Relatório Disponível',

interface NotificationSummary {      message: 'Relatório mensal de performance está pronto',

  total: number;      time: '2 horas atrás',

  unread: number;      read: true

  byType: Record<string, number>;    }

  recent: Notification[];  ];

}

  const getNotificationIcon = (type: string) => {

export default function NotificationsPage() {    switch (type) {

  const [notifications, setNotifications] = useState<Notification[]>([]);      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;

  const [summary, setSummary] = useState<NotificationSummary | null>(null);      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;

  const [loading, setLoading] = useState(true);      case 'info': return <Info className="h-5 w-5 text-blue-500" />;

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');      default: return <Bell className="h-5 w-5 text-gray-500" />;

  const [typeFilter, setTypeFilter] = useState<string>('all');    }

  const [searchTerm, setSearchTerm] = useState('');  };



  useEffect(() => {  return (

    loadNotifications();    <RouteGuard>

    loadSummary();      <MobileNavigation activeItem="notifications">

  }, [filter, typeFilter]);        <div className="min-h-screen bg-gray-50">

          <div className="max-w-4xl mx-auto px-4 py-8">

  const loadNotifications = async () => {            <motion.div

    try {              initial={{ opacity: 0, y: 20 }}

      setLoading(true);              animate={{ opacity: 1, y: 0 }}

      const params = new URLSearchParams();              transition={{ duration: 0.5 }}

                  >

      if (filter !== 'all') {              <div className="flex items-center justify-between mb-6">

        params.append('read', filter === 'read' ? 'true' : 'false');                <div>

      }                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">

                          <Bell className="h-6 w-6" />

      if (typeFilter !== 'all') {                    Notificações

        params.append('type', typeFilter);                  </h1>

      }                  <p className="text-gray-600">Central de avisos e atualizações</p>

                </div>

      const response = await fetch(`/api/notifications?${params}`);                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">

      const result = await response.json();                  Marcar todas como lidas

                </button>

      if (result.success) {              </div>

        setNotifications(result.data || []);

      } else {              <div className="space-y-4">

        toast.error('Failed to load notifications');                {mockNotifications.map((notification) => (

      }                  <motion.div

    } catch (error) {                    key={notification.id}

      console.error('Error loading notifications:', error);                    initial={{ opacity: 0, x: -20 }}

      toast.error('Error loading notifications');                    animate={{ opacity: 1, x: 0 }}

    } finally {                    transition={{ duration: 0.3, delay: notification.id * 0.1 }}

      setLoading(false);                    className={`bg-white rounded-lg shadow-sm border p-4 ${

    }                      !notification.read ? 'border-l-4 border-l-blue-500' : ''

  };                    }`}

                  >

  const loadSummary = async () => {                    <div className="flex items-start justify-between">

    try {                      <div className="flex items-start space-x-3">

      const response = await fetch('/api/notifications?summary=true');                        {getNotificationIcon(notification.type)}

      const result = await response.json();                        <div className="flex-1">

                          <h3 className="font-medium text-gray-900">

      if (result.success) {                            {notification.title}

        setSummary(result.data);                          </h3>

      }                          <p className="text-gray-600 mt-1">

    } catch (error) {                            {notification.message}

      console.error('Error loading summary:', error);                          </p>

    }                          <p className="text-sm text-gray-500 mt-2">

  };                            {notification.time}

                          </p>

  const markAsRead = async (notificationId: string) => {                        </div>

    try {                      </div>

      const response = await fetch(`/api/notifications/${notificationId}`, {                      <button className="p-1 text-gray-400 hover:text-gray-600">

        method: 'PUT',                        <X className="h-4 w-4" />

        headers: { 'Content-Type': 'application/json' },                      </button>

        body: JSON.stringify({ action: 'mark_read' })                    </div>

      });                  </motion.div>

                ))}

      const result = await response.json();              </div>

      

      if (result.success) {              {mockNotifications.length === 0 && (

        setNotifications(prev =>                 <div className="text-center py-12">

          prev.map(n =>                   <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />

            n.id === notificationId ? { ...n, read: true } : n                  <h3 className="text-lg font-medium text-gray-900 mb-2">

          )                    Nenhuma notificação

        );                  </h3>

        loadSummary();                  <p className="text-gray-600">

        toast.success('Marked as read');                    Você está em dia! Não há notificações pendentes.

      } else {                  </p>

        toast.error('Failed to mark as read');                </div>

      }              )}

    } catch (error) {            </motion.div>

      console.error('Error marking as read:', error);          </div>

      toast.error('Error marking as read');        </div>

    }      </MobileNavigation>

  };    </RouteGuard>

  );

  const markAllAsRead = async () => {}
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read' })
      });

      const result = await response.json();
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true }))
        );
        loadSummary();
        toast.success('All notifications marked as read');
      } else {
        toast.error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Error marking all as read');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        setNotifications(prev => 
          prev.filter(n => n.id !== notificationId)
        );
        loadSummary();
        toast.success('Notification deleted');
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error deleting notification');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success':
      case 'task_completed':
      case 'payment_received':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      case 'system':
      case 'task_assigned':
      case 'property_updated':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success':
      case 'task_completed':
      case 'payment_received':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      case 'system':
      case 'task_assigned':
      case 'property_updated':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <ProtectedComponent allowedRoles={['ADMIN', 'OWNER', 'MANAGER', 'SUPERVISOR', 'CLEANER']}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              {summary && (
                <p className="text-gray-600">
                  {summary.unread} unread of {summary.total} total
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadNotifications}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button
              onClick={markAllAsRead}
              disabled={!summary?.unread}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                </div>
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.unread}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(summary.byType.SUCCESS || 0) + (summary.byType.TASK_COMPLETED || 0) + (summary.byType.PAYMENT_RECEIVED || 0)}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(summary.byType.ERROR || 0) + (summary.byType.WARNING || 0)}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Read Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'unread' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'read' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Read
              </button>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="INFO">Info</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="SYSTEM">System</option>
              <option value="TASK_ASSIGNED">Task Assigned</option>
              <option value="TASK_COMPLETED">Task Completed</option>
              <option value="PROPERTY_UPDATED">Property Updated</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
            </select>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                              {notification.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </ProtectedComponent>
  );
}