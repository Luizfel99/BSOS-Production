'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Wifi, 
  Palette, 
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';
import RouteGuard from '@/components/RouteGuard';
import MobileNavigation from '@/components/MobileNavigation';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { useNotifications } from '@/hooks/useNotifications';

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const buttonVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

type SettingsTab = 'general' | 'notifications' | 'security' | 'integrations' | 'appearance';

export default function SettingsPage() {
  const { success, info, error } = useNotifications();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    general: {
      companyName: 'B.S.O.S. Cleaning Services',
      contactEmail: 'contato@bsos.com',
      contactPhone: '(11) 99999-0000',
      defaultCurrency: 'BRL',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      taskReminders: true,
      paymentAlerts: true,
      systemUpdates: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'medium',
      auditLog: true
    },
    integrations: {
      stripeEnabled: true,
      airbnbEnabled: false,
      whatsappEnabled: true,
      emailProvider: 'sendgrid'
    },
    appearance: {
      theme: 'light',
      primaryColor: 'blue',
      sidebar: 'expanded',
      density: 'comfortable'
    }
  });

  const tabs = [
    { 
      id: 'general' as SettingsTab, 
      label: 'Geral', 
      icon: Settings,
      description: 'Configurações básicas do sistema'
    },
    { 
      id: 'notifications' as SettingsTab, 
      label: 'Notificações', 
      icon: Bell,
      description: 'Alertas e comunicações'
    },
    { 
      id: 'security' as SettingsTab, 
      label: 'Segurança', 
      icon: Shield,
      description: 'Autenticação e privacidade'
    },
    { 
      id: 'integrations' as SettingsTab, 
      label: 'Integrações', 
      icon: Wifi,
      description: 'APIs e serviços externos'
    },
    { 
      id: 'appearance' as SettingsTab, 
      label: 'Aparência', 
      icon: Palette,
      description: 'Tema e interface'
    }
  ];

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      success('Configurações salvas com sucesso!');
    } catch (err) {
      error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    info('Funcionalidade de reset para padrões em desenvolvimento');
  };

  const handleTestIntegration = (integration: string) => {
    info(`Testando integração: ${integration}`);
  };

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Empresa
          </label>
          <input
            type="text"
            value={settings.general.companyName}
            onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de Contato
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moeda Padrão
          </label>
          <select
            value={settings.general.defaultCurrency}
            onChange={(e) => updateSetting('general', 'defaultCurrency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuso Horário
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
            <option value="America/New_York">Nova York (GMT-5)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idioma
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receber alertas e updates por email' },
          { key: 'smsNotifications', label: 'Notificações por SMS', description: 'Receber alertas críticos por SMS' },
          { key: 'pushNotifications', label: 'Notificações Push', description: 'Notificações do navegador' },
          { key: 'taskReminders', label: 'Lembretes de Tarefas', description: 'Alertas sobre tarefas pendentes' },
          { key: 'paymentAlerts', label: 'Alertas de Pagamento', description: 'Notificações sobre transações' },
          { key: 'systemUpdates', label: 'Atualizações do Sistema', description: 'Informações sobre novas funcionalidades' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSecuritySettings = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</h4>
            <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
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