'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Building, Zap, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSettings, updateSetting } from '@/services/settingsClient';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';

interface Setting {
  id: string;
  category: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'ENCRYPTED';
  encrypted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupedSettings {
  [category: string]: Setting[];
}

const ROLE_PERMISSIONS = {
  ADMIN: ['general', 'permissions', 'integrations'],
  MANAGER: ['general', 'integrations'],
  SUPERVISOR: ['general'],
  CLEANER: []
};

const PERMISSION_DESCRIPTIONS = {
  'manage_users': 'Create, edit, and delete user accounts',
  'manage_properties': 'Add, modify, and remove properties from the system',
  'manage_bookings': 'Create, update, and cancel cleaning bookings',
  'view_analytics': 'Access dashboard analytics and reports',
  'manage_settings': 'Modify system settings and configurations',
  'manage_integrations': 'Configure external platform connections'
};

export default function SettingsPage() {
  const { user, authChecked } = useAuth();
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [integrationStatus, setIntegrationStatus] = useState({
    stripe: false,
    airbnb: false,
    hostaway: false,
    google: false
  });

  useEffect(() => {
    if (authChecked && user) {
      loadSettings();
      checkIntegrationStatus();
    }
  }, [authChecked, user]);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data.settings || {});
    } catch (error) {
      toast.error('Failed to load settings');
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIntegrationStatus = () => {
    // Check if STRIPE_SECRET_KEY exists in environment
    const hasStripe = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? true : false;
    
    setIntegrationStatus({
      stripe: hasStripe,
      airbnb: false, // Placeholder - would check actual integration
      hostaway: false, // Placeholder - would check actual integration
      google: false // Placeholder - would check actual integration
    });
  };

  const handleSettingUpdate = async (category: string, key: string, value: string, type: string) => {
    const settingKey = `${category}_${key}`;
    setSaving(settingKey);
    
    try {
      await updateSetting(category, key, value, type as any);
      
      // Update local state
      setSettings(prev => ({
        ...prev,
        [category]: prev[category]?.map(setting => 
          setting.key === key ? { ...setting, value } : setting
        ) || []
      }));
      
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error('Failed to update setting');
      console.error('Error updating setting:', error);
    } finally {
      setSaving(null);
    }
  };

  const canAccessTab = (tab: string): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS]?.includes(tab) || false;
  };

  const renderSetting = (setting: Setting) => {
    const settingKey = `${setting.category}_${setting.key}`;
    const isLoading = saving === settingKey;

    if (setting.type === 'BOOLEAN') {
      return (
        <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
          <div>
            <label htmlFor={setting.key} className="text-sm font-medium text-gray-900">
              {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id={setting.key}
                checked={setting.value === 'true'}
                onChange={(e) => 
                  handleSettingUpdate(setting.category, setting.key, e.target.checked.toString(), setting.type)
                }
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      );
    }

    return (
      <div key={setting.id} className="py-3 border-b border-gray-200 last:border-b-0">
        <label htmlFor={setting.key} className="block text-sm font-medium text-gray-900 mb-2">
          {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </label>
        <div className="flex items-center space-x-2">
          <input
            id={setting.key}
            type={setting.type === 'NUMBER' ? 'number' : 'text'}
            value={setting.value}
            onChange={(e) => 
              handleSettingUpdate(setting.category, setting.key, e.target.value, setting.type)
            }
            disabled={isLoading}
            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </div>
      </div>
    );
  };

  const IntegrationCard = ({ 
    name, 
    description, 
    connected, 
    onConnect 
  }: { 
    name: string; 
    description: string; 
    connected: boolean; 
    onConnect: () => void; 
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          connected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {connected ? (
            <><Check className="h-3 w-3 mr-1" /> Connected</>
          ) : (
            <><X className="h-3 w-3 mr-1" /> Disconnected</>
          )}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        onClick={onConnect} 
        disabled={!connected && name !== 'Stripe'}
        variant={connected ? "secondary" : "primary"}
        size="sm"
      >
        {connected ? 'Manage' : 'Connect'}
      </Button>
    </div>
  );

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your cleaning management platform settings and integrations
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'general', name: 'General', icon: Settings },
                { id: 'permissions', name: 'Permissions', icon: Shield },
                { id: 'integrations', name: 'Integrations', icon: Building },
                { id: 'about', name: 'About', icon: Zap }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isDisabled = tab.id !== 'about' && !canAccessTab(tab.id);
                
                return (
                  <Button
                    key={tab.id}
                    onClick={() => !isDisabled && setActiveTab(tab.id)}
                    disabled={isDisabled}
                    variant={isActive ? "primary" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : isDisabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </Button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {settings.general?.map(renderSetting)}
                    {(!settings.general || settings.general.length === 0) && (
                      <p className="text-gray-500">No general settings configured yet.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {settings.business?.map(renderSetting)}
                    {(!settings.business || settings.business.length === 0) && (
                      <p className="text-gray-500">No business settings configured yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions Matrix</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cleaner</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(PERMISSION_DESCRIPTIONS).map(([permission, description]) => (
                          <tr key={permission}>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </div>
                                <div className="text-sm text-gray-500">{description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Check className="h-4 w-4 text-green-600 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center">
                              {['manage_users', 'manage_settings'].includes(permission) ? (
                                <X className="h-4 w-4 text-red-600 mx-auto" />
                              ) : (
                                <Check className="h-4 w-4 text-green-600 mx-auto" />
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {['manage_users', 'manage_settings', 'manage_integrations'].includes(permission) ? (
                                <X className="h-4 w-4 text-red-600 mx-auto" />
                              ) : (
                                <Check className="h-4 w-4 text-green-600 mx-auto" />
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {permission === 'view_analytics' ? (
                                <Check className="h-4 w-4 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-red-600 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Permission Settings</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {settings.permissions?.map(renderSetting)}
                    {(!settings.permissions || settings.permissions.length === 0) && (
                      <p className="text-gray-500">No permission settings configured yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">External Integrations</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <IntegrationCard
                      name="Stripe"
                      description="Payment processing and subscription management"
                      connected={integrationStatus.stripe}
                      onConnect={() => toast('Stripe integration configuration coming soon', { icon: '🚧' })}
                    />
                    
                    <IntegrationCard
                      name="Airbnb"
                      description="Sync bookings and property data from Airbnb"
                      connected={integrationStatus.airbnb}
                      onConnect={() => toast('Airbnb integration in development', { icon: '🚧' })}
                    />
                    
                    <IntegrationCard
                      name="Hostaway"
                      description="Property management system integration"
                      connected={integrationStatus.hostaway}
                      onConnect={() => toast('Hostaway integration in development', { icon: '🚧' })}
                    />
                    
                    <IntegrationCard
                      name="Google"
                      description="Calendar and workspace integration"
                      connected={integrationStatus.google}
                      onConnect={() => toast('Google integration in development', { icon: '🚧' })}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {settings.integrations?.map(renderSetting)}
                    {(!settings.integrations || settings.integrations.length === 0) && (
                      <p className="text-gray-500">No integration settings configured yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About This System</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid gap-4 md:grid-cols-2 mb-6">
                      <div>
                        <h3 className="font-medium text-gray-900">Current User</h3>
                        <p className="text-sm text-gray-600">
                          {user.email} ({user.role})
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">System Version</h3>
                        <p className="text-sm text-gray-600">v1.0.0 Phase 8</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Database</h3>
                        <p className="text-sm text-gray-600">PostgreSQL on Neon</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Framework</h3>
                        <p className="text-sm text-gray-600">Next.js 15.5.4</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-medium text-gray-900 mb-3">Available Features</h3>
                      <div className="grid gap-2 md:grid-cols-2">
                        {[
                          'User Management & RBAC',
                          'Property Management',
                          'Booking System',
                          'Analytics Dashboard',
                          'Notification System',
                          'Settings Management'
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
