// Settings Service Layer - SURGICAL MODE Implementation
// Comprehensive settings management with RBAC and encryption support

import { PrismaClient, Setting, SettingType, UserRole } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption configuration for sensitive settings
const ENCRYPTION_KEY = process.env.SETTINGS_ENCRYPTION_KEY || 'bsos-settings-key-2025';
const ALGORITHM = 'aes-256-cbc';

// Setting categories and their access permissions
export const SETTING_CATEGORIES = {
  GENERAL: 'general',
  PERMISSIONS: 'permissions', 
  INTEGRATIONS: 'integrations',
  APPEARANCE: 'appearance',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications'
} as const;

export type SettingCategory = typeof SETTING_CATEGORIES[keyof typeof SETTING_CATEGORIES];

// RBAC permissions for settings access
const CATEGORY_PERMISSIONS: Record<SettingCategory, UserRole[]> = {
  general: ['ADMIN', 'MANAGER'],
  permissions: ['ADMIN'],
  integrations: ['ADMIN', 'MANAGER'],
  appearance: ['ADMIN', 'MANAGER'],
  security: ['ADMIN'],
  notifications: ['ADMIN', 'MANAGER']
};

// Default settings structure
export const DEFAULT_SETTINGS = {
  general: {
    'company_name': { value: 'Bright Shine Operating System', type: 'STRING' },
    'timezone': { value: 'America/Sao_Paulo', type: 'STRING' },
    'language': { value: 'pt-BR', type: 'STRING' },
    'currency': { value: 'BRL', type: 'STRING' }
  },
  appearance: {
    'theme': { value: 'light', type: 'STRING' },
    'primary_color': { value: '#3B82F6', type: 'STRING' },
    'logo_url': { value: '', type: 'STRING' }
  },
  integrations: {
    'airbnb_enabled': { value: 'false', type: 'BOOLEAN' },
    'hostaway_enabled': { value: 'false', type: 'BOOLEAN' },
    'stripe_enabled': { value: 'true', type: 'BOOLEAN' },
    'google_calendar_enabled': { value: 'false', type: 'BOOLEAN' }
  },
  notifications: {
    'email_notifications': { value: 'true', type: 'BOOLEAN' },
    'push_notifications': { value: 'true', type: 'BOOLEAN' },
    'notification_frequency': { value: 'real-time', type: 'STRING' }
  },
  security: {
    'session_timeout': { value: '24', type: 'NUMBER' },
    'password_policy_enabled': { value: 'true', type: 'BOOLEAN' },
    'two_factor_enabled': { value: 'false', type: 'BOOLEAN' }
  }
};

/**
 * Encrypt sensitive setting values
 */
function encryptValue(value: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive setting values
 */
function decryptValue(encryptedValue: string): string {
  try {
    const [ivHex, encrypted] = encryptedValue.split(':');
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * Check if user has permission to access setting category
 */
export function hasSettingAccess(userRole: UserRole, category: SettingCategory): boolean {
  return CATEGORY_PERMISSIONS[category]?.includes(userRole) || false;
}

/**
 * Get all settings by category with RBAC filtering
 */
export async function getSettingsByCategory(
  category: SettingCategory,
  userRole: UserRole
): Promise<Setting[]> {
  if (!hasSettingAccess(userRole, category)) {
    throw new Error(`Access denied to ${category} settings`);
  }

  const settings = await prisma.setting.findMany({
    where: { category },
    orderBy: { key: 'asc' }
  });

  // Decrypt encrypted values
  return settings.map(setting => ({
    ...setting,
    value: setting.encrypted && setting.value 
      ? decryptValue(setting.value) 
      : setting.value
  }));
}

/**
 * Get specific setting value
 */
export async function getSettingValue(
  category: SettingCategory,
  key: string,
  userRole: UserRole
): Promise<string | null> {
  if (!hasSettingAccess(userRole, category)) {
    throw new Error(`Access denied to ${category} settings`);
  }

  const setting = await prisma.setting.findUnique({
    where: { category_key: { category, key } }
  });

  if (!setting?.value) return null;

  return setting.encrypted ? decryptValue(setting.value) : setting.value;
}

/**
 * Update or create setting
 */
export async function updateSetting(
  category: SettingCategory,
  key: string,
  value: string,
  userRole: UserRole,
  options: {
    type?: SettingType;
    encrypted?: boolean;
  } = {}
): Promise<Setting> {
  if (!hasSettingAccess(userRole, category)) {
    throw new Error(`Access denied to ${category} settings`);
  }

  const { type = 'STRING', encrypted = false } = options;
  const finalValue = encrypted ? encryptValue(value) : value;

  const setting = await prisma.setting.upsert({
    where: { category_key: { category, key } },
    update: {
      value: finalValue,
      type,
      encrypted,
      updatedAt: new Date()
    },
    create: {
      category,
      key,
      value: finalValue,
      type,
      encrypted
    }
  });

  return {
    ...setting,
    value: encrypted ? value : setting.value // Return unencrypted value
  };
}

/**
 * Delete setting
 */
export async function deleteSetting(
  category: SettingCategory,
  key: string,
  userRole: UserRole
): Promise<void> {
  if (!hasSettingAccess(userRole, category)) {
    throw new Error(`Access denied to ${category} settings`);
  }

  await prisma.setting.delete({
    where: { category_key: { category, key } }
  });
}

/**
 * Get all categories accessible to user
 */
export function getAccessibleCategories(userRole: UserRole): SettingCategory[] {
  return Object.keys(CATEGORY_PERMISSIONS).filter(category => 
    hasSettingAccess(userRole, category as SettingCategory)
  ) as SettingCategory[];
}

/**
 * Initialize default settings
 */
export async function initializeDefaultSettings(): Promise<void> {
  console.log('🔧 Initializing default settings...');

  for (const [category, settings] of Object.entries(DEFAULT_SETTINGS)) {
    for (const [key, config] of Object.entries(settings)) {
      const existing = await prisma.setting.findUnique({
        where: { category_key: { category, key } }
      });

      if (!existing) {
        await prisma.setting.create({
          data: {
            category,
            key,
            value: config.value,
            type: config.type as SettingType,
            encrypted: false
          }
        });
        console.log(`✅ Created default setting: ${category}.${key}`);
      }
    }
  }

  console.log('🎉 Default settings initialization complete');
}

/**
 * Validate setting value based on type
 */
export function validateSettingValue(value: string, type: SettingType): boolean {
  switch (type) {
    case 'BOOLEAN':
      return ['true', 'false'].includes(value.toLowerCase());
    case 'NUMBER':
      return !isNaN(Number(value));
    case 'JSON':
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    case 'STRING':
    case 'ENCRYPTED':
    default:
      return true;
  }
}

/**
 * Get settings summary for dashboard
 */
export async function getSettingsSummary(userRole: UserRole): Promise<{
  totalSettings: number;
  categoryCounts: Record<string, number>;
  lastUpdated: Date | null;
}> {
  const accessibleCategories = getAccessibleCategories(userRole);
  
  const settings = await prisma.setting.findMany({
    where: {
      category: { in: accessibleCategories }
    },
    select: {
      category: true,
      updatedAt: true
    }
  });

  const categoryCounts = settings.reduce((acc, setting) => {
    acc[setting.category] = (acc[setting.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lastUpdated = settings.length > 0 
    ? new Date(Math.max(...settings.map(s => s.updatedAt.getTime())))
    : null;

  return {
    totalSettings: settings.length,
    categoryCounts,
    lastUpdated
  };
}

/**
 * Export settings for backup
 */
export async function exportSettings(userRole: UserRole): Promise<string> {
  if (userRole !== 'ADMIN') {
    throw new Error('Only administrators can export settings');
  }

  const settings = await prisma.setting.findMany({
    select: {
      category: true,
      key: true,
      value: true,
      type: true,
      encrypted: true
    }
  });

  // Decrypt encrypted values for export
  const exportData = settings.map(setting => ({
    ...setting,
    value: setting.encrypted && setting.value 
      ? decryptValue(setting.value)
      : setting.value
  }));

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import settings from backup
 */
export async function importSettings(
  settingsData: string,
  userRole: UserRole
): Promise<number> {
  if (userRole !== 'ADMIN') {
    throw new Error('Only administrators can import settings');
  }

  try {
    const settings = JSON.parse(settingsData);
    let importedCount = 0;

    for (const setting of settings) {
      await updateSetting(
        setting.category,
        setting.key,
        setting.value,
        userRole,
        {
          type: setting.type,
          encrypted: setting.encrypted
        }
      );
      importedCount++;
    }

    return importedCount;
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
}