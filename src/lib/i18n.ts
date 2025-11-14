/**
 * Internationalization (i18n) Configuration
 * English as default, Portuguese (BR) and Spanish support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    // Common
    common: {
      search: "Search",
      filter: "Filter",
      export: "Export",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      add: "Add",
      new: "New",
      loading: "Loading",
      noResults: "No results found",
      total: "Total",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      completed: "Completed",
      approved: "Approved",
      rejected: "Rejected",
      yes: "Yes",
      no: "No",
      back: "Back",
      next: "Next",
      previous: "Previous",
      refresh: "Refresh",
      sync: "Sync",
      configure: "Configure"
    },

    // Authentication
    auth: {
      email: "Email",
      password: "Password",
      login: "Login",
      logout: "Logout",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      selectRole: "Select Role",
      roleHelpText: "Choose your role to access the appropriate dashboard",
      invalidCredentials: "Invalid credentials",
      loginError: "Error logging in",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me",
      signUp: "Sign up",
      signIn: "Sign in",
      welcome: "Welcome",
      welcomeBack: "Welcome back",
      loginToContinue: "Login to continue",
      demo: "Demo",
      newSession: "New Session",
      clearPreviousSession: "Clear previous session",
      tagline: "Where Cleaning Meets Intelligence",
      subtitle: "Intelligent Operating System for Cleaning Management",
      showDemoProfiles: "Show Demo Profiles",
      hideDemoProfiles: "Hide Demo Profiles"
    },

    // Roles
    roles: {
      employee: "Employee",
      supervisor: "Supervisor",
      manager: "Manager",
      owner: "Owner",
      client: "Client",
      cleaner: "Cleaner"
    },

    // Language
    language: {
      changeLanguage: "Change Language",
      selectLanguage: "Select Language"
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      adminPanel: "Administrative Panel",
      clientPortal: "Client Portal",
      supervisorPanel: "Supervisor Panel",
      automaticReports: "Automatic Reports",
      smartSchedule: "Smart Schedule",
      digitalChecklist: "Digital Checklist",
      individualProfiles: "Individual Profiles",
      scoringSystem: "Scoring System",
      communicationChannel: "Communication Channel",
      paymentControl: "Payment Control",
      integratedTraining: "Integrated Training",
      tasks: "Tasks",
      airbnbManagement: "Airbnb Management",
      apiIntegrations: "API Integrations",
      notifications: "Notifications",
      inventory: "Inventory & Supplies",
      appointments: "Appointments",
      clients: "Clients",
      employees: "Employees",
      services: "Services",
      financial: "Financial",
      evaluation: "Evaluation & Bonus",
      communication: "Professional Communication",
      supervision: "Supervision Report",
      reports: "Reports",
      settings: "Settings"
    },

    // Dashboard
    dashboard: {
      title: "Bright & Shine Management Platform",
      subtitle: "Complete cleaning management system",
      todayCleanings: "Today's Cleanings",
      pendingApprovals: "Pending Approvals",
      totalRevenue: "Total Revenue",
      clientSatisfaction: "Client Satisfaction",
      completionRate: "Completion Rate",
      activeEmployees: "Active Employees",
      quickActions: "Quick Actions",
      recentActivity: "Recent Activity",
      upcomingCleanings: "Upcoming Cleanings",
      performanceMetrics: "Performance Metrics"
    },

    // Administrative Panel
    admin: {
      title: "Administrative Panel",
      subtitle: "Complete management of Bright & Shine",
      overview: "Overview",
      properties: "Properties",
      employees: "Employees",
      financial: "Financial",
      reports: "Reports",
      integrations: "Integrations",
      permissions: "Permissions",
      
      // BSOS Module Structure
      bsos: {
        title: "BRIGHT & SHINE OPERATING SYSTEM",
        subtitle: "The intelligent cleaning & property management platform",
        core: {
          title: "BSOS Core - Operations",
          subtitle: "Schedule, tasks, checklists for employees and supervisors"
        },
        manager: {
          title: "BSOS Manager - Team Management", 
          subtitle: "Team control, payments, performance for operations managers"
        },
        client: {
          title: "BSOS Client - Transparency Portal",
          subtitle: "Transparency, photos, status, history for clients and property managers"
        },
        finance: {
          title: "BSOS Finance - Financial Control",
          subtitle: "Payments, invoices, reports for administration"
        },
        analytics: {
          title: "BSOS Analytics - AI Insights",
          subtitle: "Indicators, alerts and predictions for directors and company owners"
        }
      },
      
      stats: {
        totalProperties: "Total Properties",
        totalClients: "Total Clients",
        totalEmployees: "Total Employees",
        totalCleanings: "Cleanings/Month",
        activeBookings: "Active Bookings",
        pendingApprovals: "Pending Approvals",
        totalRevenue: "Total Revenue",
        netProfit: "Net Profit",
        totalExpenses: "Total Expenses",
        unpaidInvoices: "Unpaid Invoices",
        monthlyGrowth: "vs previous month",
        averagePerformance: "average performance",
        completionRate: "completion rate"
      },

      performance: {
        title: "Performance Indicators",
        avgCleaningTime: "Average Cleaning Time",
        clientSatisfaction: "Client Satisfaction",
        complaintRate: "Complaint Rate",
        revisitRate: "Revisit Rate"
      },

      financialSummary: {
        title: "Financial Summary",
        totalRevenue: "Total Revenue",
        totalExpenses: "Total Expenses",
        netProfit: "Net Profit",
        pendingInvoices: "Pending Invoices"
      },

      quickActions: {
        title: "Quick Actions",
        newProperty: "New Property",
        newEmployee: "New Employee",
        financialReport: "Financial Report",
        newIntegration: "New Integration"
      },

      adminProperties: {
        searchPlaceholder: "Search properties...",
        allTypes: "All Types",
        airbnb: "Airbnb",
        residential: "Residential",
        commercial: "Commercial",
        allStatus: "All Status",
        maintenance: "Maintenance",
        revenueMonth: "Month revenue",
        cleanings: "Cleanings",
        rating: "Rating",
        team: "Team",
        last: "Last",
        next: "Next",
        details: "Details",
        schedule: "Schedule"
      },

      adminIntegrations: {
        connected: "Connected",
        error: "Error",
        disconnected: "Disconnected",
        lastSync: "Last Sync:",
        frequency: "Frequency:",
        recordsProcessed: "Records processed",
        errors: "errors",
        synchronize: "Synchronize",
        requiresAttention: "Requires attention",
        addNewIntegration: "Add New Integration"
      },

      adminPermissions: {
        title: "Permission Control by Role",
        team: "Team",
        supervisor: "Supervisor",
        manager: "Manager",
        administrator: "Administrator",
        basic: "basic",
        intermediate: "intermediate",
        advanced: "advanced",
        full: "full",
        configurePermissions: "Configure Permissions",
        viewOwnSchedule: "View own schedule",
        sendPhotos: "Send photos",
        markCompletion: "Mark completion",
        manageTeam: "Manage team",
        reviewCleanings: "Review cleanings",
        approveEvaluations: "Approve evaluations",
        accessReports: "Access reports",
        manageProperties: "Manage properties",
        financialControl: "Financial control",
        completeReports: "Complete reports",
        configureIntegrations: "Configure integrations",
        fullAccess: "Full access",
        manageUsers: "Manage users",
        systemSettings: "System settings",
        completeAudit: "Complete audit"
      }
    },

    // Client Portal
    client: {
      title: "Client Portal",
      subtitle: "Access your cleanings and services",
      cleanings: "Cleanings",
      chat: "Chat",
      inventory: "Inventory",
      payments: "Payments",
      evaluations: "Evaluations",
      
      clientCleanings: {
        upcoming: "Upcoming Cleanings",
        history: "Cleaning History",
        scheduled: "Scheduled",
        inProgress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled",
        team: "Team",
        duration: "Duration",
        beforeAfter: "Before/After",
        reschedule: "Reschedule",
        viewDetails: "View Details"
      },

      clientChat: {
        title: "Direct Chat with Bright & Shine",
        sendMessage: "Send message...",
        send: "Send",
        online: "Online",
        offline: "Offline",
        typing: "typing...",
        support: "Support",
        general: "General"
      },

      clientInventory: {
        title: "Item Inventory",
        category: "Category",
        stock: "Stock",
        status: "Status",
        requestRestock: "Request Restock",
        lowStock: "Low Stock",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        bedding: "Bedding",
        towels: "Towels",
        amenities: "Amenities",
        supplies: "Supplies"
      },

      clientPayments: {
        title: "Payments and Invoices",
        invoiceHistory: "Invoice History",
        pendingPayments: "Pending Payments",
        paymentMethods: "Payment Methods",
        amount: "Amount",
        dueDate: "Due Date",
        paid: "Paid",
        overdue: "Overdue",
        downloadReceipt: "Download Receipt",
        payNow: "Pay Now"
      },

      clientEvaluations: {
        title: "Evaluate Cleaning",
        rating: "Rating",
        comments: "Comments",
        overall: "Overall",
        punctuality: "Punctuality",
        quality: "Quality",
        communication: "Communication",
        submitEvaluation: "Submit Evaluation",
        thankYou: "Thank you for your feedback!"
      }
    },

    // Notifications
    notifications: {
      success: "Success!",
      error: "Error!",
      warning: "Warning!",
      info: "Information",
      saved: "Successfully saved",
      deleted: "Successfully deleted",
      updated: "Successfully updated",
      created: "Successfully created",
      synchronized: "Successfully synchronized",
      emailSent: "Email sent successfully",
      paymentProcessed: "Payment processed successfully"
    },

    // Time and Date
    time: {
      today: "Today",
      yesterday: "Yesterday",
      tomorrow: "Tomorrow",
      thisWeek: "This Week",
      thisMonth: "This Month",
      lastWeek: "Last Week",
      lastMonth: "Last Month",
      minutes: "minutes",
      hours: "hours",
      days: "days",
      weeks: "weeks",
      months: "months",
      years: "years",
      ago: "ago",
      in: "in"
    }
  }
};

// Portuguese (BR) translations
const ptBR = {
  translation: {
    // Common
    common: {
      search: "Buscar",
      filter: "Filtrar",
      export: "Exportar",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Excluir",
      edit: "Editar",
      view: "Visualizar",
      add: "Adicionar",
      new: "Novo",
      loading: "Carregando",
      noResults: "Nenhum resultado encontrado",
      total: "Total",
      status: "Status",
      active: "Ativo",
      inactive: "Inativo",
      pending: "Pendente",
      completed: "Concluído",
      approved: "Aprovado",
      rejected: "Rejeitado",
      yes: "Sim",
      no: "Não",
      back: "Voltar",
      next: "Próximo",
      previous: "Anterior",
      refresh: "Atualizar",
      sync: "Sincronizar",
      configure: "Configurar"
    },

    // Authentication
    auth: {
      email: "Email",
      password: "Senha",
      login: "Entrar",
      logout: "Sair",
      emailPlaceholder: "Digite seu email",
      passwordPlaceholder: "Digite sua senha",
      selectRole: "Selecione o Papel",
      roleHelpText: "Escolha seu papel para acessar o painel apropriado",
      invalidCredentials: "Credenciais inválidas",
      loginError: "Erro ao fazer login",
      forgotPassword: "Esqueceu a senha?",
      rememberMe: "Lembrar de mim",
      signUp: "Cadastrar",
      signIn: "Entrar",
      welcome: "Bem-vindo",
      welcomeBack: "Bem-vindo de volta",
      loginToContinue: "Faça login para continuar",
      demo: "Demo",
      newSession: "Nova Sessão",
      clearPreviousSession: "Limpar sessão anterior",
      tagline: "Onde Limpeza Encontra Inteligência",
      subtitle: "Sistema Operacional Inteligente para Gestão de Limpeza",
      showDemoProfiles: "Mostrar Perfis Demo",
      hideDemoProfiles: "Ocultar Perfis Demo"
    },

    // Roles
    roles: {
      employee: "Funcionário",
      supervisor: "Supervisor",
      manager: "Gerente",
      owner: "Proprietário",
      client: "Cliente",
      cleaner: "Funcionário"
    },

    // Navigation
    nav: {
      dashboard: "Dashboard",
      adminPanel: "Painel Administrativo",
      clientPortal: "Portal do Cliente",
      supervisorPanel: "Painel do Supervisor",
      automaticReports: "Relatórios Automáticos",
      smartSchedule: "Agenda Inteligente",
      digitalChecklist: "Checklist Digital",
      individualProfiles: "Perfis Individuais",
      scoringSystem: "Sistema de Pontuação",
      communicationChannel: "Canal de Comunicação",
      paymentControl: "Controle de Pagamentos",
      integratedTraining: "Treinamento Integrado",
      tasks: "Tarefas",
      airbnbManagement: "Gestão Airbnb",
      apiIntegrations: "Integrações API",
      notifications: "Notificações",
      inventory: "Estoque e Suprimentos",
      appointments: "Agendamentos",
      clients: "Clientes",
      employees: "Funcionários",
      services: "Serviços",
      financial: "Financeiro",
      evaluation: "Avaliação e Bonificação",
      communication: "Comunicação Profissional",
      supervision: "Relatório de Supervisão",
      reports: "Relatórios",
      settings: "Configurações"
    },

    // Dashboard
    dashboard: {
      title: "Plataforma de Gestão Bright & Shine",
      subtitle: "Sistema completo de gestão de limpeza",
      todayCleanings: "Limpezas de Hoje",
      pendingApprovals: "Aprovações Pendentes",
      totalRevenue: "Receita Total",
      clientSatisfaction: "Satisfação do Cliente",
      completionRate: "Taxa de Conclusão",
      activeEmployees: "Funcionários Ativos",
      quickActions: "Ações Rápidas",
      recentActivity: "Atividade Recente",
      upcomingCleanings: "Próximas Limpezas",
      performanceMetrics: "Métricas de Performance"
    },

    // Administrative Panel
    admin: {
      title: "Painel Administrativo",
      subtitle: "Gestão completa da Bright & Shine",
      overview: "Visão Geral",
      properties: "Propriedades",
      employees: "Funcionários",
      financial: "Financeiro",
      reports: "Relatórios",
      integrations: "Integrações",
      permissions: "Permissões",
      
      // Estrutura Modular BSOS
      bsos: {
        title: "BRIGHT & SHINE OPERATING SYSTEM",
        subtitle: "A plataforma inteligente de gestão de limpeza e propriedades",
        core: {
          title: "BSOS Core - Operações",
          subtitle: "Agenda, tarefas, checklists para funcionários e supervisores"
        },
        manager: {
          title: "BSOS Manager - Gestão de Equipe", 
          subtitle: "Controle de equipe, pagamentos, desempenho para gerentes de operações"
        },
        client: {
          title: "BSOS Client - Portal de Transparência",
          subtitle: "Transparência, fotos, status, histórico para clientes e property managers"
        },
        finance: {
          title: "BSOS Finance - Controle Financeiro",
          subtitle: "Pagamentos, faturas, relatórios para administração"
        },
        analytics: {
          title: "BSOS Analytics - Insights de IA",
          subtitle: "Indicadores, alertas e previsões para diretores e donos da empresa"
        }
      },
      
      stats: {
        totalProperties: "Total de Propriedades",
        totalClients: "Total de Clientes",
        totalEmployees: "Total de Funcionários",
        totalCleanings: "Limpezas/Mês",
        activeBookings: "Reservas Ativas",
        pendingApprovals: "Aprovações Pendentes",
        totalRevenue: "Receita Total",
        netProfit: "Lucro Líquido",
        totalExpenses: "Despesas Totais",
        unpaidInvoices: "Faturas Pendentes",
        monthlyGrowth: "vs mês anterior",
        averagePerformance: "performance média",
        completionRate: "taxa de conclusão"
      },

      performance: {
        title: "Indicadores de Performance",
        avgCleaningTime: "Tempo Médio de Limpeza",
        clientSatisfaction: "Satisfação do Cliente",
        complaintRate: "Taxa de Reclamações",
        revisitRate: "Taxa de Revisitas"
      },

      financialSummary: {
        title: "Resumo Financeiro",
        totalRevenue: "Receita Total",
        totalExpenses: "Despesas Totais",
        netProfit: "Lucro Líquido",
        pendingInvoices: "Faturas Pendentes"
      },

      quickActions: {
        title: "Ações Rápidas",
        newProperty: "Nova Propriedade",
        newEmployee: "Novo Funcionário",
        financialReport: "Relatório Financeiro",
        newIntegration: "Nova Integração"
      },

      adminProperties: {
        searchPlaceholder: "Buscar propriedades...",
        allTypes: "Todos os Tipos",
        airbnb: "Airbnb",
        residential: "Residencial",
        commercial: "Comercial",
        allStatus: "Todos os Status",
        maintenance: "Manutenção",
        revenueMonth: "Receita do mês",
        cleanings: "Limpezas",
        rating: "Avaliação",
        team: "Equipe",
        last: "Última",
        next: "Próxima",
        details: "Detalhes",
        schedule: "Agendar"
      },

      adminIntegrations: {
        connected: "Conectado",
        error: "Erro",
        disconnected: "Desconectado",
        lastSync: "Última Sincronização:",
        frequency: "Frequência:",
        recordsProcessed: "Registros processados",
        errors: "erros",
        synchronize: "Sincronizar",
        requiresAttention: "Requer atenção",
        addNewIntegration: "Adicionar Nova Integração"
      },

      adminPermissions: {
        title: "Controle de Permissões por Função",
        team: "Equipe",
        supervisor: "Supervisor",
        manager: "Gerente",
        administrator: "Administrador",
        basic: "básico",
        intermediate: "intermediário",
        advanced: "avançado",
        full: "completo",
        configurePermissions: "Configurar Permissões",
        viewOwnSchedule: "Ver agendamentos próprios",
        sendPhotos: "Enviar fotos",
        markCompletion: "Marcar conclusão",
        manageTeam: "Gerenciar equipe",
        reviewCleanings: "Revisar limpezas",
        approveEvaluations: "Aprovar avaliações",
        accessReports: "Acessar relatórios",
        manageProperties: "Gerenciar propriedades",
        financialControl: "Controle financeiro",
        completeReports: "Relatórios completos",
        configureIntegrations: "Configurar integrações",
        fullAccess: "Acesso total",
        manageUsers: "Gerenciar usuários",
        systemSettings: "Configurações do sistema",
        completeAudit: "Auditoria completa"
      }
    },

    // Client Portal
    client: {
      title: "Portal do Cliente",
      subtitle: "Acesse suas limpezas e serviços",
      cleanings: "Limpezas",
      chat: "Chat",
      inventory: "Inventário",
      payments: "Pagamentos",
      evaluations: "Avaliações",
      
      clientCleanings: {
        upcoming: "Próximas Limpezas",
        history: "Histórico de Limpezas",
        scheduled: "Agendada",
        inProgress: "Em Andamento",
        completed: "Concluída",
        cancelled: "Cancelada",
        team: "Equipe",
        duration: "Duração",
        beforeAfter: "Antes/Depois",
        reschedule: "Reagendar",
        viewDetails: "Ver Detalhes"
      },

      clientChat: {
        title: "Chat Direto com a Bright & Shine",
        sendMessage: "Enviar mensagem...",
        send: "Enviar",
        online: "Online",
        offline: "Offline",
        typing: "digitando...",
        support: "Suporte",
        general: "Geral"
      },

      clientInventory: {
        title: "Inventário de Itens",
        category: "Categoria",
        stock: "Estoque",
        status: "Status",
        requestRestock: "Solicitar Reposição",
        lowStock: "Estoque Baixo",
        inStock: "Em Estoque",
        outOfStock: "Sem Estoque",
        bedding: "Roupas de Cama",
        towels: "Toalhas",
        amenities: "Amenities",
        supplies: "Suprimentos"
      },

      clientPayments: {
        title: "Pagamentos e Faturas",
        invoiceHistory: "Histórico de Faturas",
        pendingPayments: "Pagamentos Pendentes",
        paymentMethods: "Métodos de Pagamento",
        amount: "Valor",
        dueDate: "Data de Vencimento",
        paid: "Pago",
        overdue: "Vencido",
        downloadReceipt: "Baixar Recibo",
        payNow: "Pagar Agora"
      },

      clientEvaluations: {
        title: "Avaliar Limpeza",
        rating: "Avaliação",
        comments: "Comentários",
        overall: "Geral",
        punctuality: "Pontualidade",
        quality: "Qualidade",
        communication: "Comunicação",
        submitEvaluation: "Enviar Avaliação",
        thankYou: "Obrigado pelo seu feedback!"
      }
    },

    // Language Selector
    language: {
      title: "Idioma",
      english: "Inglês",
      portuguese: "Português (BR)",
      spanish: "Espanhol",
      changeLanguage: "Alterar Idioma"
    },

    // Notifications
    notifications: {
      success: "Sucesso!",
      error: "Erro!",
      warning: "Atenção!",
      info: "Informação",
      saved: "Salvo com sucesso",
      deleted: "Excluído com sucesso",
      updated: "Atualizado com sucesso",
      created: "Criado com sucesso",
      synchronized: "Sincronizado com sucesso",
      emailSent: "Email enviado com sucesso",
      paymentProcessed: "Pagamento processado com sucesso"
    },

    // Time and Date
    time: {
      today: "Hoje",
      yesterday: "Ontem",
      tomorrow: "Amanhã",
      thisWeek: "Esta Semana",
      thisMonth: "Este Mês",
      lastWeek: "Semana Passada",
      lastMonth: "Mês Passado",
      minutes: "minutos",
      hours: "horas",
      days: "dias",
      weeks: "semanas",
      months: "meses",
      years: "anos",
      ago: "atrás",
      in: "em"
    }
  }
};

// Spanish translations
const es = {
  translation: {
    // Common
    common: {
      search: "Buscar",
      filter: "Filtrar",
      export: "Exportar",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      view: "Ver",
      add: "Añadir",
      new: "Nuevo",
      loading: "Cargando",
      noResults: "No se encontraron resultados",
      total: "Total",
      status: "Estado",
      active: "Activo",
      inactive: "Inactivo",
      pending: "Pendiente",
      completed: "Completado",
      approved: "Aprobado",
      rejected: "Rechazado",
      yes: "Sí",
      no: "No",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      refresh: "Actualizar",
      sync: "Sincronizar",
      configure: "Configurar"
    },

    // Authentication
    auth: {
      email: "Email",
      password: "Contraseña",
      login: "Iniciar Sesión",
      logout: "Cerrar Sesión",
      emailPlaceholder: "Ingrese su email",
      passwordPlaceholder: "Ingrese su contraseña",
      invalidCredentials: "Credenciales inválidas",
      loginError: "Error al iniciar sesión",
      forgotPassword: "¿Olvidó la contraseña?",
      rememberMe: "Recordarme",
      signUp: "Registrarse",
      signIn: "Iniciar Sesión",
      welcome: "Bienvenido",
      welcomeBack: "Bienvenido de vuelta",
      loginToContinue: "Inicie sesión para continuar",
      demo: "Demo",
      newSession: "Nueva Sesión",
      clearPreviousSession: "Limpiar sesión anterior",
      tagline: "Donde la Limpieza Encuentra la Inteligencia",
      subtitle: "Sistema Operativo Inteligente para Gestión de Limpieza",
      showDemoProfiles: "Mostrar Perfiles Demo",
      hideDemoProfiles: "Ocultar Perfiles Demo"
    },

    // Roles
    roles: {
      employee: "Empleado",
      supervisor: "Supervisor",
      manager: "Gerente",
      owner: "Propietario",
      client: "Cliente",
      cleaner: "Empleado"
    },

    // Navigation
    nav: {
      dashboard: "Panel de Control",
      adminPanel: "Panel Administrativo",
      clientPortal: "Portal del Cliente",
      supervisorPanel: "Panel del Supervisor",
      automaticReports: "Informes Automáticos",
      smartSchedule: "Agenda Inteligente",
      digitalChecklist: "Lista de Verificación Digital",
      individualProfiles: "Perfiles Individuales",
      scoringSystem: "Sistema de Puntuación",
      communicationChannel: "Canal de Comunicación",
      paymentControl: "Control de Pagos",
      integratedTraining: "Entrenamiento Integrado",
      tasks: "Tareas",
      airbnbManagement: "Gestión Airbnb",
      apiIntegrations: "Integraciones API",
      notifications: "Notificaciones",
      inventory: "Inventario y Suministros",
      appointments: "Citas",
      clients: "Clientes",
      employees: "Empleados",
      services: "Servicios",
      financial: "Financiero",
      evaluation: "Evaluación y Bonificación",
      communication: "Comunicación Profesional",
      supervision: "Informe de Supervisión",
      reports: "Informes",
      settings: "Configuraciones"
    },

    // Dashboard
    dashboard: {
      title: "Plataforma de Gestión Bright & Shine",
      subtitle: "Sistema completo de gestión de limpieza",
      todayCleanings: "Limpiezas de Hoy",
      pendingApprovals: "Aprobaciones Pendientes",
      totalRevenue: "Ingresos Totales",
      clientSatisfaction: "Satisfacción del Cliente",
      completionRate: "Tasa de Finalización",
      activeEmployees: "Empleados Activos",
      quickActions: "Acciones Rápidas",
      recentActivity: "Actividad Reciente",
      upcomingCleanings: "Próximas Limpiezas",
      performanceMetrics: "Métricas de Rendimiento"
    },

    // Administrative Panel
    admin: {
      title: "Panel Administrativo",
      subtitle: "Gestión completa de Bright & Shine",
      overview: "Resumen",
      properties: "Propiedades",
      employees: "Empleados",
      financial: "Financiero",
      reports: "Informes",
      integrations: "Integraciones",
      permissions: "Permisos",
      
      // Estructura Modular BSOS
      bsos: {
        title: "BRIGHT & SHINE OPERATING SYSTEM",
        subtitle: "La plataforma inteligente de gestión de limpieza y propiedades",
        core: {
          title: "BSOS Core - Operaciones",
          subtitle: "Agenda, tareas, checklists para empleados y supervisores"
        },
        manager: {
          title: "BSOS Manager - Gestión de Equipo", 
          subtitle: "Control de equipo, pagos, rendimiento para gerentes de operaciones"
        },
        client: {
          title: "BSOS Client - Portal de Transparencia",
          subtitle: "Transparencia, fotos, estado, historial para clientes y property managers"
        },
        finance: {
          title: "BSOS Finance - Control Financiero",
          subtitle: "Pagos, facturas, informes para administración"
        },
        analytics: {
          title: "BSOS Analytics - Insights de IA",
          subtitle: "Indicadores, alertas y predicciones para directores y dueños de la empresa"
        }
      },
      
      stats: {
        totalProperties: "Total de Propiedades",
        totalClients: "Total de Clientes",
        totalEmployees: "Total de Empleados",
        totalCleanings: "Limpiezas/Mes",
        activeBookings: "Reservas Activas",
        pendingApprovals: "Aprobaciones Pendientes",
        totalRevenue: "Ingresos Totales",
        netProfit: "Beneficio Neto",
        totalExpenses: "Gastos Totales",
        unpaidInvoices: "Facturas Pendientes",
        monthlyGrowth: "vs mes anterior",
        averagePerformance: "rendimiento promedio",
        completionRate: "tasa de finalización"
      },

      performance: {
        title: "Indicadores de Rendimiento",
        avgCleaningTime: "Tiempo Promedio de Limpieza",
        clientSatisfaction: "Satisfacción del Cliente",
        complaintRate: "Tasa de Quejas",
        revisitRate: "Tasa de Revisitas"
      },

      financialSummary: {
        title: "Resumen Financiero",
        totalRevenue: "Ingresos Totales",
        totalExpenses: "Gastos Totales",
        netProfit: "Beneficio Neto",
        pendingInvoices: "Facturas Pendientes"
      },

      quickActions: {
        title: "Acciones Rápidas",
        newProperty: "Nueva Propiedad",
        newEmployee: "Nuevo Empleado",
        financialReport: "Informe Financiero",
        newIntegration: "Nueva Integración"
      },

      adminProperties: {
        searchPlaceholder: "Buscar propiedades...",
        allTypes: "Todos los Tipos",
        airbnb: "Airbnb",
        residential: "Residencial",
        commercial: "Comercial",
        allStatus: "Todos los Estados",
        maintenance: "Mantenimiento",
        revenueMonth: "Ingresos del mes",
        cleanings: "Limpiezas",
        rating: "Calificación",
        team: "Equipo",
        last: "Última",
        next: "Próxima",
        details: "Detalles",
        schedule: "Programar"
      },

      adminIntegrations: {
        connected: "Conectado",
        error: "Error",
        disconnected: "Desconectado",
        lastSync: "Última Sincronización:",
        frequency: "Frecuencia:",
        recordsProcessed: "Registros procesados",
        errors: "errores",
        synchronize: "Sincronizar",
        requiresAttention: "Requiere atención",
        addNewIntegration: "Añadir Nueva Integración"
      },

      adminPermissions: {
        title: "Control de Permisos por Función",
        team: "Equipo",
        supervisor: "Supervisor",
        manager: "Gerente",
        administrator: "Administrador",
        basic: "básico",
        intermediate: "intermedio",
        advanced: "avanzado",
        full: "completo",
        configurePermissions: "Configurar Permisos",
        viewOwnSchedule: "Ver horario propio",
        sendPhotos: "Enviar fotos",
        markCompletion: "Marcar finalización",
        manageTeam: "Gestionar equipo",
        reviewCleanings: "Revisar limpiezas",
        approveEvaluations: "Aprobar evaluaciones",
        accessReports: "Acceder a informes",
        manageProperties: "Gestionar propiedades",
        financialControl: "Control financiero",
        completeReports: "Informes completos",
        configureIntegrations: "Configurar integraciones",
        fullAccess: "Acceso completo",
        manageUsers: "Gestionar usuarios",
        systemSettings: "Configuraciones del sistema",
        completeAudit: "Auditoría completa"
      }
    },

    // Client Portal
    client: {
      title: "Portal del Cliente",
      subtitle: "Accede a tus limpiezas y servicios",
      cleanings: "Limpiezas",
      chat: "Chat",
      inventory: "Inventario",
      payments: "Pagos",
      evaluations: "Evaluaciones",
      
      clientCleanings: {
        upcoming: "Próximas Limpiezas",
        history: "Historial de Limpiezas",
        scheduled: "Programada",
        inProgress: "En Progreso",
        completed: "Completada",
        cancelled: "Cancelada",
        team: "Equipo",
        duration: "Duración",
        beforeAfter: "Antes/Después",
        reschedule: "Reprogramar",
        viewDetails: "Ver Detalles"
      },

      clientChat: {
        title: "Chat Directo con Bright & Shine",
        sendMessage: "Enviar mensaje...",
        send: "Enviar",
        online: "En línea",
        offline: "Desconectado",
        typing: "escribiendo...",
        support: "Soporte",
        general: "General"
      },

      clientInventory: {
        title: "Inventario de Artículos",
        category: "Categoría",
        stock: "Stock",
        status: "Estado",
        requestRestock: "Solicitar Reposición",
        lowStock: "Stock Bajo",
        inStock: "En Stock",
        outOfStock: "Sin Stock",
        bedding: "Ropa de Cama",
        towels: "Toallas",
        amenities: "Amenidades",
        supplies: "Suministros"
      },

      clientPayments: {
        title: "Pagos y Facturas",
        invoiceHistory: "Historial de Facturas",
        pendingPayments: "Pagos Pendientes",
        paymentMethods: "Métodos de Pago",
        amount: "Monto",
        dueDate: "Fecha de Vencimiento",
        paid: "Pagado",
        overdue: "Vencido",
        downloadReceipt: "Descargar Recibo",
        payNow: "Pagar Ahora"
      },

      clientEvaluations: {
        title: "Evaluar Limpieza",
        rating: "Calificación",
        comments: "Comentarios",
        overall: "General",
        punctuality: "Puntualidad",
        quality: "Calidad",
        communication: "Comunicación",
        submitEvaluation: "Enviar Evaluación",
        thankYou: "¡Gracias por tu retroalimentación!"
      }
    },

    // Language Selector
    language: {
      title: "Idioma",
      english: "Inglés",
      portuguese: "Portugués (BR)",
      spanish: "Español",
      changeLanguage: "Cambiar Idioma"
    },

    // Notifications
    notifications: {
      success: "¡Éxito!",
      error: "¡Error!",
      warning: "¡Advertencia!",
      info: "Información",
      saved: "Guardado exitosamente",
      deleted: "Eliminado exitosamente",
      updated: "Actualizado exitosamente",
      created: "Creado exitosamente",
      synchronized: "Sincronizado exitosamente",
      emailSent: "Email enviado exitosamente",
      paymentProcessed: "Pago procesado exitosamente"
    },

    // Time and Date
    time: {
      today: "Hoy",
      yesterday: "Ayer",
      tomorrow: "Mañana",
      thisWeek: "Esta Semana",
      thisMonth: "Este Mes",
      lastWeek: "Semana Pasada",
      lastMonth: "Mes Pasado",
      minutes: "minutos",
      hours: "horas",
      days: "días",
      weeks: "semanas",
      months: "meses",
      years: "años",
      ago: "hace",
      in: "en"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      pt: ptBR,
      es
    },
    fallbackLng: 'en',
    lng: 'en', // Always start with English to prevent hydration mismatch
    defaultNS: 'translation',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false
    },

    // Prevent hydration mismatch
    react: {
      useSuspense: false
    }
  });

export default i18n;