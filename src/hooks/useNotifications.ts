import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

interface NotificationHook {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => Promise<T>;
  dismiss: (toastId?: string) => void;
}

export const useNotifications = (): NotificationHook => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, messages, {
      position: options?.position || 'top-right',
      style: {
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      success: {
        duration: options?.duration || 3000,
        style: {
          background: '#10b981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      },
      error: {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      },
      loading: {
        style: {
          background: '#3b82f6',
          color: '#fff',
        },
      },
    });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    success,
    error,
    loading,
    info,
    warning,
    promise,
    dismiss,
  };
};

// Utility functions for common operations
export const showAuthNotifications = {
  loginSuccess: (username: string) => {
    const { success } = useNotifications();
    success(`Bem-vindo, ${username}! Login realizado com sucesso.`);
  },
  
  loginError: (error: string) => {
    const { error: showError } = useNotifications();
    showError(`Erro no login: ${error}`);
  },
  
  logoutSuccess: () => {
    const { info } = useNotifications();
    info('Logout realizado com sucesso. Até logo!');
  },
  
  sessionExpired: () => {
    const { warning } = useNotifications();
    warning('Sua sessão expirou. Faça login novamente.');
  },
};

export const showDataNotifications = {
  saveSuccess: (item: string) => {
    const { success } = useNotifications();
    success(`${item} salvo com sucesso!`);
  },
  
  updateSuccess: (item: string) => {
    const { success } = useNotifications();
    success(`${item} atualizado com sucesso!`);
  },
  
  deleteSuccess: (item: string) => {
    const { success } = useNotifications();
    success(`${item} removido com sucesso!`);
  },
  
  saveError: (item: string, error: string) => {
    const { error: showError } = useNotifications();
    showError(`Erro ao salvar ${item}: ${error}`);
  },
  
  loadError: (item: string) => {
    const { error } = useNotifications();
    error(`Erro ao carregar ${item}. Tente novamente.`);
  },
  
  networkError: () => {
    const { error } = useNotifications();
    error('Erro de conexão. Verifique sua internet e tente novamente.');
  },
};

export const showTaskNotifications = {
  taskCompleted: (taskName: string) => {
    const { success } = useNotifications();
    success(`Tarefa "${taskName}" concluída com sucesso! 🎉`);
  },
  
  taskAssigned: (taskName: string, assignee: string) => {
    const { info } = useNotifications();
    info(`Tarefa "${taskName}" atribuída para ${assignee}`);
  },
  
  taskOverdue: (taskName: string) => {
    const { warning } = useNotifications();
    warning(`Atenção: Tarefa "${taskName}" está atrasada!`);
  },
  
  taskCancelled: (taskName: string) => {
    const { info } = useNotifications();
    info(`Tarefa "${taskName}" foi cancelada`);
  },
};

export const showUploadNotifications = {
  uploadProgress: (filename: string) => {
    const { loading } = useNotifications();
    return loading(`Enviando ${filename}...`);
  },
  
  uploadSuccess: (filename: string) => {
    const { success } = useNotifications();
    success(`${filename} enviado com sucesso! 📁`);
  },
  
  uploadError: (filename: string, error: string) => {
    const { error: showError } = useNotifications();
    showError(`Erro ao enviar ${filename}: ${error}`);
  },
  
  fileSizeError: (maxSize: string) => {
    const { warning } = useNotifications();
    warning(`Arquivo muito grande. Tamanho máximo: ${maxSize}`);
  },
  
  fileTypeError: (allowedTypes: string) => {
    const { warning } = useNotifications();
    warning(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes}`);
  },
};

export const showValidationNotifications = {
  required: (field: string) => {
    const { warning } = useNotifications();
    warning(`${field} é obrigatório`);
  },
  
  invalid: (field: string) => {
    const { warning } = useNotifications();
    warning(`${field} inválido`);
  },
  
  minLength: (field: string, min: number) => {
    const { warning } = useNotifications();
    warning(`${field} deve ter pelo menos ${min} caracteres`);
  },
  
  maxLength: (field: string, max: number) => {
    const { warning } = useNotifications();
    warning(`${field} não pode ter mais de ${max} caracteres`);
  },
  
  emailInvalid: () => {
    const { warning } = useNotifications();
    warning('E-mail inválido. Verifique o formato.');
  },
  
  passwordWeak: () => {
    const { warning } = useNotifications();
    warning('Senha muito fraca. Use pelo menos 8 caracteres com letras e números.');
  },
};

export default useNotifications;