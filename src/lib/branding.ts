/**
 * BSOS - Bright & Shine Operating System
 * Configurações de Branding e Identidade Visual
 */

export const BRANDING = {
  // Nome da Empresa
  companyName: 'Bright & Shine',
  
  // Nome do Sistema
  systemName: 'B.S.O.S.',
  fullSystemName: 'Bright & Shine Operating System',
  
  // Slogan Principal
  mainSlogan: 'Where Cleaning Meets Intelligence',
  
  // Descrições
  descriptions: {
    short: 'Intelligent Operating System for Professional Cleaning Management',
    medium: 'Complete operational platform for intelligent management of professional cleaning companies',
    long: 'Intelligent Operating System for Professional Cleaning Management specialized in Airbnb and other property types. A complete solution that integrates advanced technology with professional cleaning operations.',
    portuguese: 'Sistema Operacional Inteligente para Gestão de Limpeza',
    spanish: 'Sistema Operativo Inteligente para Gestión de Limpieza'
  },
  
  // Informações de Copyright
  copyright: {
    year: '2025',
    holder: 'Bright & Shine Operating System',
    tagline: 'Where Cleaning Meets Intelligence'
  },
  
  // Versioning
  version: {
    current: '2.0.0',
    codename: 'Intelligence Core',
    releaseDate: '2025-01-01'
  },
  
  // Cores da Marca
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed'
    },
    accent: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  
  // Ícones e Símbolos (Professional Design Elements)
  icons: {
    main: 'B.S.',
    brand: 'B.S.O.S.',
    cleaning: 'cleaning',
    intelligence: 'brain',
    system: 'system',
    shine: 'shine'
  },
  
  // Meta Tags
  meta: {
    title: 'B.S.O.S. - Bright & Shine Operating System',
    description: 'Where Cleaning Meets Intelligence - Intelligent Operating System for Professional Cleaning Management',
    keywords: [
      'cleaning management system',
      'property management',
      'airbnb cleaning',
      'professional cleaning',
      'cleaning technology',
      'bright and shine',
      'B.S.O.S.',
      'cleaning operations',
      'property management'
    ],
    author: 'Bright & Shine Team',
    robots: 'index, follow'
  },
  
  // Módulos do Sistema
  modules: {
    core: {
      name: 'B.S.O.S. Core',
      subtitle: 'Operations',
      description: 'Schedule, tasks, checklists',
      icon: 'cleaning',
      color: 'blue'
    },
    manager: {
      name: 'B.S.O.S. Manager',
      subtitle: 'Team Management',
      description: 'Team management and supervision',
      icon: 'users',
      color: 'green'
    },
    client: {
      name: 'B.S.O.S. Client',
      subtitle: 'Client Portal',
      description: 'Exclusive portal for clients',
      icon: 'home',
      color: 'purple'
    },
    finance: {
      name: 'B.S.O.S. Finance',
      subtitle: 'Financial Control',
      description: 'Financial control and payments',
      icon: 'money',
      color: 'yellow'
    },
    analytics: {
      name: 'B.S.O.S. Analytics',
      subtitle: 'AI Insights',
      description: 'Indicators, alerts and predictions',
      icon: 'chart',
      color: 'red'
    }
  },
  
  // Contatos e Links
  contact: {
    website: 'https://brightshine.com',
    email: 'contact@brightshine.com',
    support: 'support@brightshine.com',
    phone: '+55 (11) 9999-9999'
  },
  
  // Social Media
  social: {
    linkedin: 'https://linkedin.com/company/bright-shine-os',
    instagram: 'https://instagram.com/brightshine_os',
    twitter: 'https://twitter.com/brightshine_os'
  }
} as const;

// Helper functions para acessar informações de branding
export const getBrandingInfo = () => BRANDING;

export const getFullTitle = () => 
  `${BRANDING.systemName} - ${BRANDING.fullSystemName}`;

export const getSlogan = () => BRANDING.mainSlogan;

export const getDescription = (type: keyof typeof BRANDING.descriptions = 'short') => 
  BRANDING.descriptions[type];

export const getCopyright = () => 
  `© ${BRANDING.copyright.year} ${BRANDING.copyright.holder} - ${BRANDING.copyright.tagline}`;

export const getModuleInfo = (moduleId: keyof typeof BRANDING.modules) =>
  BRANDING.modules[moduleId];

export default BRANDING;