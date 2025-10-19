'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';

// Settings Categories Components
interface SettingItem {
  id: string;
  category: string;
  key: string;
  value: string;
  type: 'STRING' | 'BOOLEAN' | 'NUMBER' | 'JSON' | 'ENCRYPTED';
  encrypted: boolean;
}

interface SettingsSectionProps {
  title: string;
  description: string;
  settings: SettingItem[];
  onUpdate: (key: string, value: string) => void;
  loading?: boolean;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  settings,
  onUpdate,
  loading = false
}) => {
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const initial = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    setLocalValues(initial);
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    Object.entries(localValues).forEach(([key, value]) => {
      const original = settings.find(s => s.key === key)?.value;
      if (value !== original) {
        onUpdate(key, value);
      }
    });
    setHasChanges(false);
  };

  const renderSettingInput = (setting: SettingItem) => {
    const value = localValues[setting.key] || '';

    switch (setting.type) {
      case 'BOOLEAN':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.toLowerCase() === 'true'}
              onChange={(e) => handleChange(setting.key, e.target.checked.toString())}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Ativado</span>
          </label>
        );

      case 'NUMBER':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case 'JSON':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="{ \"key\": \"value\" }"
          />
        );

      case 'ENCRYPTED':
        return (
          <div className="relative">
            <input
              type="password"
              value={value}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            <div className="absolute right-3 top-2.5">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Encrypted field"></div>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {setting.encrypted && (
                <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  Encrypted
                </span>
              )}
            </label>
            {renderSettingInput(setting)}
          </div>
        ))}
      </div>

      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Você tem alterações não salvas</span>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Salvar</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingsSection;