'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Building, Zap, Check, X, Loader2 } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { getSettings, updateSetting } from '@/services/settingsClient';
import { toast } from 'sonner';

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
  const { user, loading: sessionLoading } = useSession();
  const [settings, setSettings] = useState<GroupedSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState({
    stripe: false,
    airbnb: false,
    hostaway: false,
    google: false
  });

  useEffect(() => {
    if (!sessionLoading && user) {
      loadSettings();
      checkIntegrationStatus();
    }
  }, [sessionLoading, user]);

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
        <div key={setting.id} className="flex items-center justify-between py-2">
          <div>
            <Label htmlFor={setting.key} className="font-medium">
              {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              id={setting.key}
              checked={setting.value === 'true'}
              onCheckedChange={(checked) => 
                handleSettingUpdate(setting.category, setting.key, checked.toString(), setting.type)
              }
              disabled={isLoading}
            />
          </div>
        </div>
      );
    }

    return (
      <div key={setting.id} className="space-y-2">
        <Label htmlFor={setting.key} className="font-medium">
          {setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            id={setting.key}
            type={setting.type === 'NUMBER' ? 'number' : 'text'}
            value={setting.value}
            onChange={(e) => 
              handleSettingUpdate(setting.category, setting.key, e.target.value, setting.type)
            }
            disabled={isLoading}
            className="flex-1"
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant={connected ? "default" : "secondary"}>
            {connected ? (
              <><Check className="h-3 w-3 mr-1" /> Connected</>
            ) : (
              <><X className="h-3 w-3 mr-1" /> Disconnected</>
            )}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onConnect} 
          variant={connected ? "outline" : "default"}
          disabled={!connected && name !== 'Stripe'}
        >
          {connected ? 'Manage' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );

  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <p>Please log in to access settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your cleaning management platform settings and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="general" 
            disabled={!canAccessTab('general')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger 
            value="permissions" 
            disabled={!canAccessTab('permissions')}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger 
            value="integrations" 
            disabled={!canAccessTab('integrations')}
            className="flex items-center gap-2"
          >
            <Building className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.general?.map(renderSetting)}
              
              {(!settings.general || settings.general.length === 0) && (
                <p className="text-muted-foreground">No general settings configured yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>
                Company information and business-related configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.business?.map(renderSetting)}
              
              {(!settings.business || settings.business.length === 0) && (
                <p className="text-muted-foreground">No business settings configured yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions Matrix</CardTitle>
              <CardDescription>
                Overview of permissions by user role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Permission</th>
                      <th className="text-center p-2 font-medium">Admin</th>
                      <th className="text-center p-2 font-medium">Manager</th>
                      <th className="text-center p-2 font-medium">Supervisor</th>
                      <th className="text-center p-2 font-medium">Cleaner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(PERMISSION_DESCRIPTIONS).map(([permission, description]) => (
                      <tr key={permission} className="border-b">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            <div className="text-sm text-muted-foreground">{description}</div>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Check className="h-4 w-4 text-green-600 mx-auto" />
                        </td>
                        <td className="text-center p-2">
                          {['manage_users', 'manage_settings'].includes(permission) ? (
                            <X className="h-4 w-4 text-red-600 mx-auto" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-2">
                          {['manage_users', 'manage_settings', 'manage_integrations'].includes(permission) ? (
                            <X className="h-4 w-4 text-red-600 mx-auto" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          )}
                        </td>
                        <td className="text-center p-2">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Settings</CardTitle>
              <CardDescription>
                Configure role-based access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.permissions?.map(renderSetting)}
              
              {(!settings.permissions || settings.permissions.length === 0) && (
                <p className="text-muted-foreground">No permission settings configured yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>
                Connect with external platforms and services
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <IntegrationCard
                name="Stripe"
                description="Payment processing and subscription management"
                connected={integrationStatus.stripe}
                onConnect={() => toast.info('Stripe integration configuration coming soon')}
              />
              
              <IntegrationCard
                name="Airbnb"
                description="Sync bookings and property data from Airbnb"
                connected={integrationStatus.airbnb}
                onConnect={() => toast.info('Airbnb integration in development')}
              />
              
              <IntegrationCard
                name="Hostaway"
                description="Property management system integration"
                connected={integrationStatus.hostaway}
                onConnect={() => toast.info('Hostaway integration in development')}
              />
              
              <IntegrationCard
                name="Google"
                description="Calendar and workspace integration"
                connected={integrationStatus.google}
                onConnect={() => toast.info('Google integration in development')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure integration-specific settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.integrations?.map(renderSetting)}
              
              {(!settings.integrations || settings.integrations.length === 0) && (
                <p className="text-muted-foreground">No integration settings configured yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This System</CardTitle>
              <CardDescription>
                Information about your cleaning management platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-medium">Current User</Label>
                  <p className="text-sm text-muted-foreground">
                    {user.email} ({user.role})
                  </p>
                </div>
                <div>
                  <Label className="font-medium">System Version</Label>
                  <p className="text-sm text-muted-foreground">v1.0.0 Phase 8</p>
                </div>
                <div>
                  <Label className="font-medium">Database</Label>
                  <p className="text-sm text-muted-foreground">PostgreSQL on Neon</p>
                </div>
                <div>
                  <Label className="font-medium">Framework</Label>
                  <p className="text-sm text-muted-foreground">Next.js 15.5.4</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="font-medium">Available Features</Label>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">User Management & RBAC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Property Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Booking System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Notification System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Settings Management</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
