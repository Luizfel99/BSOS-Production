'use client';'use client';



import React, { useState, useEffect } from 'react';import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';import { motion } from 'framer-motion';

import { import { 

  Settings,   Settings, 

  Users,   User, 

  Plug,   Bell, 

  Palette,   Shield, 

  Shield,   Database, 

  Bell,  Wifi, 

  Download,  Palette, 

  Upload,  Globe,

  RefreshCw,  Save,

  Save  RefreshCw

} from 'lucide-react';} from 'lucide-react';

import SettingsSection from '@/components/settings/SettingsSection';import RouteGuard from '@/components/RouteGuard';

import IntegrationsSettings from '@/components/settings/IntegrationsSettings';import MobileNavigation from '@/components/MobileNavigation';

import { ProtectedComponent } from '@/components/ProtectedComponent';

// Mock data for demonstration - replace with API callsimport { useNotifications } from '@/hooks/useNotifications';

const mockIntegrations = [

  {const pageVariants = {

    id: 'airbnb',  hidden: { opacity: 0, y: 20 },

    name: 'Airbnb',  visible: { 

    description: 'Sincronização automática de reservas e calendário',    opacity: 1, 

    enabled: false,    y: 0,

    configured: false,    transition: { duration: 0.6 }

    icon: '🏠',  }

    status: 'disconnected' as const,};

    settings: [

      { key: 'api_key', label: 'API Key', value: '', type: 'password' as const, required: true },const cardVariants = {

      { key: 'webhook_url', label: 'Webhook URL', value: '', type: 'url' as const, required: true }  hidden: { opacity: 0, scale: 0.95 },

    ]  visible: { 

  },    opacity: 1, 

  {    scale: 1,

    id: 'hostaway',    transition: { duration: 0.3 }

    name: 'Hostaway',  }

    description: 'Gestão de propriedades e reservas',};

    enabled: false,

    configured: false,const buttonVariants = {

    icon: '🏢',  hover: { scale: 1.02, transition: { duration: 0.2 } },

    status: 'disconnected' as const,  tap: { scale: 0.98, transition: { duration: 0.1 } }

    settings: [};

      { key: 'username', label: 'Username', value: '', type: 'text' as const, required: true },

      { key: 'password', label: 'Password', value: '', type: 'password' as const, required: true },type SettingsTab = 'general' | 'notifications' | 'security' | 'integrations' | 'appearance';

      { key: 'account_id', label: 'Account ID', value: '', type: 'text' as const, required: true }

    ]export default function SettingsPage() {

  },  const { success, info, error } = useNotifications();

  {  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    id: 'stripe',  const [saving, setSaving] = useState(false);

    name: 'Stripe',

    description: 'Processamento de pagamentos',  const [settings, setSettings] = useState({

    enabled: true,    general: {

    configured: true,      companyName: 'B.S.O.S. Cleaning Services',

    icon: '💳',      contactEmail: 'contato@bsos.com',

    status: 'connected' as const,      contactPhone: '(11) 99999-0000',

    settings: [      defaultCurrency: 'BRL',

      { key: 'publishable_key', label: 'Publishable Key', value: 'pk_test_...', type: 'text' as const, required: true },      timezone: 'America/Sao_Paulo',

      { key: 'secret_key', label: 'Secret Key', value: '', type: 'password' as const, required: true },      language: 'pt-BR'

      { key: 'webhook_secret', label: 'Webhook Secret', value: '', type: 'password' as const, required: true }    },

    ]    notifications: {

  },      emailNotifications: true,

  {      smsNotifications: false,

    id: 'google',      pushNotifications: true,

    name: 'Google Calendar',      taskReminders: true,

    description: 'Sincronização de agenda e eventos',      paymentAlerts: true,

    enabled: false,      systemUpdates: false

    configured: false,    },

    icon: '📅',    security: {

    status: 'pending' as const,      twoFactorAuth: false,

    settings: [      sessionTimeout: 30,

      { key: 'client_id', label: 'Client ID', value: '', type: 'text' as const, required: true },      passwordPolicy: 'medium',

      { key: 'client_secret', label: 'Client Secret', value: '', type: 'password' as const, required: true }      auditLog: true

    ]    },

  }    integrations: {

];      stripeEnabled: true,

      airbnbEnabled: false,

const SettingsPage = () => {      whatsappEnabled: true,

  const [activeTab, setActiveTab] = useState('general');      emailProvider: 'sendgrid'

  const [settings, setSettings] = useState<Record<string, any>>({});    },

  const [loading, setLoading] = useState(false);    appearance: {

  const [saving, setSaving] = useState(false);      theme: 'light',

      primaryColor: 'blue',

  const tabs = [      sidebar: 'expanded',

    { id: 'general', label: 'Geral', icon: Settings },      density: 'comfortable'

    { id: 'appearance', label: 'Aparência', icon: Palette },    }

    { id: 'integrations', label: 'Integrações', icon: Plug },  });

    { id: 'notifications', label: 'Notificações', icon: Bell },

    { id: 'permissions', label: 'Permissões', icon: Users },  const tabs = [

    { id: 'security', label: 'Segurança', icon: Shield }    { 

  ];      id: 'general' as SettingsTab, 

      label: 'Geral', 

  // Mock settings data      icon: Settings,

  const mockSettings = {      description: 'Configurações básicas do sistema'

    general: [    },

      { id: '1', category: 'general', key: 'company_name', value: 'Bright Shine Operating System', type: 'STRING', encrypted: false },    { 

      { id: '2', category: 'general', key: 'timezone', value: 'America/Sao_Paulo', type: 'STRING', encrypted: false },      id: 'notifications' as SettingsTab, 

      { id: '3', category: 'general', key: 'language', value: 'pt-BR', type: 'STRING', encrypted: false },      label: 'Notificações', 

      { id: '4', category: 'general', key: 'currency', value: 'BRL', type: 'STRING', encrypted: false }      icon: Bell,

    ],      description: 'Alertas e comunicações'

    appearance: [    },

      { id: '5', category: 'appearance', key: 'theme', value: 'light', type: 'STRING', encrypted: false },    { 

      { id: '6', category: 'appearance', key: 'primary_color', value: '#3B82F6', type: 'STRING', encrypted: false },      id: 'security' as SettingsTab, 

      { id: '7', category: 'appearance', key: 'logo_url', value: '', type: 'STRING', encrypted: false }      label: 'Segurança', 

    ],      icon: Shield,

    notifications: [      description: 'Autenticação e privacidade'

      { id: '8', category: 'notifications', key: 'email_notifications', value: 'true', type: 'BOOLEAN', encrypted: false },    },

      { id: '9', category: 'notifications', key: 'push_notifications', value: 'true', type: 'BOOLEAN', encrypted: false },    { 

      { id: '10', category: 'notifications', key: 'notification_frequency', value: 'real-time', type: 'STRING', encrypted: false }      id: 'integrations' as SettingsTab, 

    ],      label: 'Integrações', 

    security: [      icon: Wifi,

      { id: '11', category: 'security', key: 'session_timeout', value: '24', type: 'NUMBER', encrypted: false },      description: 'APIs e serviços externos'

      { id: '12', category: 'security', key: 'password_policy_enabled', value: 'true', type: 'BOOLEAN', encrypted: false },    },

      { id: '13', category: 'security', key: 'two_factor_enabled', value: 'false', type: 'BOOLEAN', encrypted: false }    { 

    ]      id: 'appearance' as SettingsTab, 

  };      label: 'Aparência', 

      icon: Palette,

  useEffect(() => {      description: 'Tema e interface'

    loadSettings();    }

  }, [activeTab]);  ];



  const loadSettings = async () => {  const handleSaveSettings = async () => {

    setLoading(true);    setSaving(true);

    try {    try {

      // In real implementation, call API      // Simulate API call

      // const response = await fetch(`/api/settings?category=${activeTab}`);      await new Promise(resolve => setTimeout(resolve, 1000));

      // const data = await response.json();      success('Configurações salvas com sucesso!');

      setSettings(mockSettings);    } catch (err) {

    } catch (error) {      error('Erro ao salvar configurações');

      console.error('Failed to load settings:', error);    } finally {

    } finally {      setSaving(false);

      setLoading(false);    }

    }  };

  };

  const handleResetToDefaults = () => {

  const handleUpdateSetting = async (key: string, value: string) => {    info('Funcionalidade de reset para padrões em desenvolvimento');

    setSaving(true);  };

    try {

      // In real implementation, call API  const handleTestIntegration = (integration: string) => {

      // await fetch(`/api/settings/${activeTab}`, {    info(`Testando integração: ${integration}`);

      //   method: 'POST',  };

      //   headers: { 'Content-Type': 'application/json' },

      //   body: JSON.stringify({ key, value })  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {

      // });    setSettings(prev => ({

      console.log(`Updating ${key} to ${value}`);      ...prev,

    } catch (error) {      [category]: {

      console.error('Failed to update setting:', error);        ...prev[category],

    } finally {        [key]: value

      setSaving(false);      }

    }    }));

  };  };



  const handleIntegrationToggle = async (id: string, enabled: boolean) => {  const renderGeneralSettings = () => (

    console.log(`Toggle integration ${id}: ${enabled}`);    <motion.div

  };      variants={cardVariants}

      initial="hidden"

  const handleIntegrationSettings = async (id: string, settings: Record<string, string>) => {      animate="visible"

    console.log(`Update integration ${id} settings:`, settings);      className="space-y-6"

  };    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  const handleTestConnection = async (id: string): Promise<boolean> => {        <div>

    console.log(`Testing connection for ${id}`);          <label className="block text-sm font-medium text-gray-700 mb-2">

    return new Promise(resolve => setTimeout(() => resolve(true), 2000));            Nome da Empresa

  };          </label>

          <input

  const renderTabContent = () => {            type="text"

    const currentSettings = settings[activeTab] || [];            value={settings.general.companyName}

            onChange={(e) => updateSetting('general', 'companyName', e.target.value)}

    switch (activeTab) {            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

      case 'integrations':          />

        return (        </div>

          <IntegrationsSettings        

            integrations={mockIntegrations}        <div>

            onToggle={handleIntegrationToggle}          <label className="block text-sm font-medium text-gray-700 mb-2">

            onUpdateSettings={handleIntegrationSettings}            Email de Contato

            onTestConnection={handleTestConnection}          </label>

          />          <input

        );            type="email"

            value={settings.general.contactEmail}

      case 'permissions':            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}

        return (            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

          <div className="bg-white rounded-lg shadow-sm p-6">          />

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissões do Sistema</h3>        </div>

            <div className="space-y-4">

              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">        <div>

                <p className="text-yellow-800">          <label className="block text-sm font-medium text-gray-700 mb-2">

                  As configurações de permissões são gerenciadas através do sistema RBAC (Role-Based Access Control).             Telefone

                  Consulte a documentação do sistema para mais detalhes.          </label>

                </p>          <input

              </div>            type="tel"

            </div>            value={settings.general.contactPhone}

          </div>            onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}

        );            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

          />

      default:        </div>

        return (

          <SettingsSection        <div>

            title={tabs.find(t => t.id === activeTab)?.label || 'Configurações'}          <label className="block text-sm font-medium text-gray-700 mb-2">

            description={getTabDescription(activeTab)}            Moeda Padrão

            settings={currentSettings}          </label>

            onUpdate={handleUpdateSetting}          <select

            loading={saving}            value={settings.general.defaultCurrency}

          />            onChange={(e) => updateSetting('general', 'defaultCurrency', e.target.value)}

        );            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

    }          >

  };            <option value="BRL">Real (BRL)</option>

            <option value="USD">Dólar (USD)</option>

  const getTabDescription = (tabId: string): string => {            <option value="EUR">Euro (EUR)</option>

    switch (tabId) {          </select>

      case 'general':        </div>

        return 'Configurações básicas do sistema, como nome da empresa, fuso horário e idioma.';

      case 'appearance':        <div>

        return 'Personalize a aparência do sistema com temas, cores e logotipos.';          <label className="block text-sm font-medium text-gray-700 mb-2">

      case 'notifications':            Fuso Horário

        return 'Configure como e quando você recebe notificações do sistema.';          </label>

      case 'security':          <select

        return 'Gerencie configurações de segurança, senhas e autenticação.';            value={settings.general.timezone}

      default:            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}

        return 'Configurações do sistema.';            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

    }          >

  };            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>

            <option value="America/New_York">Nova York (GMT-5)</option>

  return (            <option value="Europe/London">Londres (GMT+0)</option>

    <div className="min-h-screen bg-gray-50 p-4 md:p-6">          </select>

      <div className="max-w-6xl mx-auto">        </div>

        {/* Header */}

        <motion.div        <div>

          initial={{ opacity: 0, y: -20 }}          <label className="block text-sm font-medium text-gray-700 mb-2">

          animate={{ opacity: 1, y: 0 }}            Idioma

          className="mb-8"          </label>

        >          <select

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>            value={settings.general.language}

          <p className="text-gray-600">            onChange={(e) => updateSetting('general', 'language', e.target.value)}

            Gerencie as configurações do sistema, integrações e preferências.            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"

          </p>          >

        </motion.div>            <option value="pt-BR">Português (Brasil)</option>

            <option value="en-US">English (US)</option>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">            <option value="es-ES">Español</option>

          {/* Sidebar */}          </select>

          <div className="lg:col-span-1">        </div>

            <motion.div      </div>

              initial={{ opacity: 0, x: -20 }}    </motion.div>

              animate={{ opacity: 1, x: 0 }}  );

              className="bg-white rounded-lg shadow-sm p-4"

            >  const renderNotificationSettings = () => (

              <nav className="space-y-2">    <motion.div

                {tabs.map((tab) => (      variants={cardVariants}

                  <button      initial="hidden"

                    key={tab.id}      animate="visible"

                    onClick={() => setActiveTab(tab.id)}      className="space-y-6"

                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${    >

                      activeTab === tab.id      <div className="space-y-4">

                        ? 'bg-blue-600 text-white'        {[

                        : 'text-gray-700 hover:bg-gray-100'          { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receber alertas e updates por email' },

                    }`}          { key: 'smsNotifications', label: 'Notificações por SMS', description: 'Receber alertas críticos por SMS' },

                  >          { key: 'pushNotifications', label: 'Notificações Push', description: 'Notificações do navegador' },

                    <tab.icon className="w-5 h-5" />          { key: 'taskReminders', label: 'Lembretes de Tarefas', description: 'Alertas sobre tarefas pendentes' },

                    <span>{tab.label}</span>          { key: 'paymentAlerts', label: 'Alertas de Pagamento', description: 'Notificações sobre transações' },

                  </button>          { key: 'systemUpdates', label: 'Atualizações do Sistema', description: 'Informações sobre novas funcionalidades' }

                ))}        ].map((item) => (

              </nav>          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">

            <div>

              <div className="mt-6 pt-6 border-t">              <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>

                <div className="space-y-2">              <p className="text-sm text-gray-500">{item.description}</p>

                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">            </div>

                    <Download className="w-4 h-4" />            <label className="relative inline-flex items-center cursor-pointer">

                    <span className="text-sm">Exportar</span>              <input

                  </button>                type="checkbox"

                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}

                    <Upload className="w-4 h-4" />                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}

                    <span className="text-sm">Importar</span>                className="sr-only peer"

                  </button>              />

                </div>              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>

              </div>            </label>

            </motion.div>          </div>

          </div>        ))}

      </div>

          {/* Main Content */}    </motion.div>

          <div className="lg:col-span-3">  );

            <AnimatePresence mode="wait">

              <motion.div  const renderSecuritySettings = () => (

                key={activeTab}    <motion.div

                initial={{ opacity: 0, x: 20 }}      variants={cardVariants}

                animate={{ opacity: 1, x: 0 }}      initial="hidden"

                exit={{ opacity: 0, x: -20 }}      animate="visible"

                transition={{ duration: 0.2 }}      className="space-y-6"

              >    >

                {loading ? (      <div className="space-y-4">

                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">

                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />          <div>

                    <p className="text-gray-600">Carregando configurações...</p>            <h4 className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</h4>

                  </div>            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>

                ) : (          </div>

                  renderTabContent()          <label className="relative inline-flex items-center cursor-pointer">

                )}            <input

              </motion.div>              type="checkbox"

            </AnimatePresence>              checked={settings.security.twoFactorAuth}

          </div>              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}

        </div>              className="sr-only peer"

      </div>            />

    </div>            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>

  );          </label>

};        </div>



export default SettingsPage;        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout da Sessão (minutos)
          </label>
          <select
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={60}>1 hora</option>
            <option value={120}>2 horas</option>
          </select>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Política de Senhas
          </label>
          <select
            value={settings.security.passwordPolicy}
            onChange={(e) => updateSetting('security', 'passwordPolicy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Básica (6+ caracteres)</option>
            <option value="medium">Média (8+ caracteres, números)</option>
            <option value="high">Alta (12+ caracteres, símbolos)</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderIntegrationsSettings = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'stripeEnabled', label: 'Stripe', description: 'Processamento de pagamentos', status: 'connected' },
          { key: 'airbnbEnabled', label: 'Airbnb', description: 'Sincronização de propriedades', status: 'disconnected' },
          { key: 'whatsappEnabled', label: 'WhatsApp', description: 'Comunicação com clientes', status: 'connected' },
        ].map((integration) => (
          <div key={integration.key} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{integration.label}</h4>
                <p className="text-sm text-gray-500">{integration.description}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                integration.status === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.integrations[integration.key as keyof typeof settings.integrations] as boolean}
                  onChange={(e) => updateSetting('integrations', integration.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <motion.button
                onClick={() => handleTestIntegration(integration.label)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Testar
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAppearanceSettings = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tema
          </label>
          <select
            value={settings.appearance.theme}
            onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="auto">Automático</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Principal
          </label>
          <select
            value={settings.appearance.primaryColor}
            onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="blue">Azul</option>
            <option value="green">Verde</option>
            <option value="purple">Roxo</option>
            <option value="orange">Laranja</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sidebar
          </label>
          <select
            value={settings.appearance.sidebar}
            onChange={(e) => updateSetting('appearance', 'sidebar', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="expanded">Expandido</option>
            <option value="collapsed">Recolhido</option>
            <option value="auto">Automático</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Densidade
          </label>
          <select
            value={settings.appearance.density}
            onChange={(e) => updateSetting('appearance', 'density', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="comfortable">Confortável</option>
            <option value="compact">Compacto</option>
            <option value="spacious">Espaçoso</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <RouteGuard>
      <MobileNavigation activeItem="settings">
        <motion.div 
          className="p-6"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600 mt-2">
                Gerencie preferências do sistema, integrações e configurações de segurança
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Settings Tabs */}
              <motion.div 
                className="lg:w-1/4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = activeTab === tab.id;
                      
                      return (
                        <motion.button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                          <div>
                            <div>{tab.label}</div>
                            <div className="text-xs text-gray-500">{tab.description}</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </motion.div>

              {/* Settings Content */}
              <motion.div 
                className="lg:w-3/4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <div className="flex items-center gap-3">
                      <ProtectedComponent module="settings" action="configure" fallback={null}>
                        <motion.button
                          onClick={handleResetToDefaults}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4 mr-2 inline" />
                          Restaurar Padrões
                        </motion.button>
                        
                        <motion.button
                          onClick={handleSaveSettings}
                          disabled={saving}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 inline animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2 inline" />
                              Salvar Alterações
                            </>
                          )}
                        </motion.button>
                      </ProtectedComponent>
                    </div>
                  </div>

                  {renderTabContent()}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </MobileNavigation>
    </RouteGuard>
  );
}