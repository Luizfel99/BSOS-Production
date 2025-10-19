'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Key,
  Shield
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  configured: boolean;
  icon: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  settings: {
    key: string;
    label: string;
    value: string;
    type: 'text' | 'password' | 'url';
    required: boolean;
  }[];
}

interface IntegrationsSettingsProps {
  integrations: Integration[];
  onToggle: (id: string, enabled: boolean) => void;
  onUpdateSettings: (id: string, settings: Record<string, string>) => void;
  onTestConnection: (id: string) => Promise<boolean>;
}

const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({
  integrations,
  onToggle,
  onUpdateSettings,
  onTestConnection
}) => {
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [settingsValues, setSettingsValues] = useState<Record<string, Record<string, string>>>({});

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'error':
        return 'Erro';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconectado';
    }
  };

  const handleSettingChange = (integrationId: string, key: string, value: string) => {
    setSettingsValues(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = (integrationId: string) => {
    const values = settingsValues[integrationId] || {};
    onUpdateSettings(integrationId, values);
  };

  const handleTestConnection = async (integrationId: string) => {
    setTestingConnection(integrationId);
    try {
      await onTestConnection(integrationId);
    } finally {
      setTestingConnection(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrações Externas</h3>
        <p className="text-gray-600 text-sm">
          Configure conexões com plataformas externas como Airbnb, Hostaway, Stripe e Google.
        </p>
      </div>

      {integrations.map((integration) => (
        <motion.div
          key={integration.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <span className="text-sm text-gray-600">
                    {getStatusText(integration.status)}
                  </span>
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={(e) => onToggle(integration.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Ativado</span>
                </label>

                <button
                  onClick={() => setExpandedIntegration(
                    expandedIntegration === integration.id ? null : integration.id
                  )}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {expandedIntegration === integration.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-gray-50 p-4"
            >
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>Configurações de Conexão</span>
                </h5>

                {integration.settings.map((setting) => (
                  <div key={setting.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {setting.label}
                      {setting.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={setting.type}
                        value={settingsValues[integration.id]?.[setting.key] || setting.value}
                        onChange={(e) => handleSettingChange(integration.id, setting.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={setting.type === 'password' ? '••••••••' : `Digite ${setting.label.toLowerCase()}`}
                      />
                      {setting.type === 'password' && (
                        <Shield className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={() => handleTestConnection(integration.id)}
                    disabled={testingConnection === integration.id}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>
                      {testingConnection === integration.id ? 'Testando...' : 'Testar Conexão'}
                    </span>
                  </button>

                  <div className="space-x-2">
                    <button
                      onClick={() => setExpandedIntegration(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveSettings(integration.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Salvar Configurações
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Segurança das Integrações</h4>
            <p className="text-sm text-blue-700 mt-1">
              Todas as chaves de API e dados sensíveis são criptografados antes de serem armazenados. 
              Mantenha suas credenciais seguras e atualize-as regularmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSettings;