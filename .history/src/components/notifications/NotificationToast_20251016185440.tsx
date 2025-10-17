'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationToastProps {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    className?: string;
  }>;
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'success':
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-500',
        titleColor: 'text-green-800',
        messageColor: 'text-green-700'
      };
    case 'warning':
      return {
        icon: AlertCircle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-500',
        titleColor: 'text-yellow-800',
        messageColor: 'text-yellow-700'
      };
    case 'error':
      return {
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-500',
        titleColor: 'text-red-800',
        messageColor: 'text-red-700'
      };
    case 'info':
    default:
      return {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800',
        messageColor: 'text-blue-700'
      };
  }
};

export function NotificationToast({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
  actions
}: NotificationToastProps) {
  const config = getTypeConfig(type);
  const IconComponent = config.icon;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`
        max-w-md w-full ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg pointer-events-auto
        ring-1 ring-black ring-opacity-5 overflow-hidden
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </p>
            <p className={`mt-1 text-sm ${config.messageColor}`}>
              {message}
            </p>
            
            {actions && actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`
                      text-sm font-medium px-3 py-2 rounded-md transition-colors
                      ${action.className || 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'}
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`
                rounded-md inline-flex ${config.messageColor} hover:${config.titleColor} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              `}
            >
              <span className="sr-only">Close</span>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Utility functions for creating toast notifications
export const showNotificationToast = {
  success: (title: string, message: string, actions?: NotificationToastProps['actions']) => {
    toast.custom((t) => (
      <NotificationToast
        id={t.id}
        title={title}
        message={message}
        type="success"
        onClose={() => toast.dismiss(t.id)}
        actions={actions}
      />
    ));
  },
  
  error: (title: string, message: string, actions?: NotificationToastProps['actions']) => {
    toast.custom((t) => (
      <NotificationToast
        id={t.id}
        title={title}
        message={message}
        type="error"
        onClose={() => toast.dismiss(t.id)}
        actions={actions}
      />
    ));
  },
  
  warning: (title: string, message: string, actions?: NotificationToastProps['actions']) => {
    toast.custom((t) => (
      <NotificationToast
        id={t.id}
        title={title}
        message={message}
        type="warning"
        onClose={() => toast.dismiss(t.id)}
        actions={actions}
      />
    ));
  },
  
  info: (title: string, message: string, actions?: NotificationToastProps['actions']) => {
    toast.custom((t) => (
      <NotificationToast
        id={t.id}
        title={title}
        message={message}
        type="info"
        onClose={() => toast.dismiss(t.id)}
        actions={actions}
      />
    ));
  }
};

export default NotificationToast;