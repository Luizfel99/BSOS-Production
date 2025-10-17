const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSettings() {
  console.log('🌱 Seeding settings data...');

  // General Settings
  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'general',
        key: 'company_name'
      }
    },
    update: {},
    create: {
      category: 'general',
      key: 'company_name',
      value: 'BSOS Cleaning Management',
      type: 'STRING',
      encrypted: false
    }
  });

  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'general',
        key: 'notifications_enabled'
      }
    },
    update: {},
    create: {
      category: 'general',
      key: 'notifications_enabled',
      value: 'true',
      type: 'BOOLEAN',
      encrypted: false
    }
  });

  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'general',
        key: 'default_task_duration'
      }
    },
    update: {},
    create: {
      category: 'general',
      key: 'default_task_duration',
      value: '120',
      type: 'NUMBER',
      encrypted: false
    }
  });

  // Business Settings
  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'business',
        key: 'contact_email'
      }
    },
    update: {},
    create: {
      category: 'business',
      key: 'contact_email',
      value: 'contact@bsos.com',
      type: 'STRING',
      encrypted: false
    }
  });

  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'business',
        key: 'phone_number'
      }
    },
    update: {},
    create: {
      category: 'business',
      key: 'phone_number',
      value: '+1 (555) 123-4567',
      type: 'STRING',
      encrypted: false
    }
  });

  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'business',
        key: 'auto_assign_tasks'
      }
    },
    update: {},
    create: {
      category: 'business',
      key: 'auto_assign_tasks',
      value: 'false',
      type: 'BOOLEAN',
      encrypted: false
    }
  });

  // Permission Settings
  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'permissions',
        key: 'require_photo_verification'
      }
    },
    update: {},
    create: {
      category: 'permissions',
      key: 'require_photo_verification',
      value: 'true',
      type: 'BOOLEAN',
      encrypted: false
    }
  });

  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'permissions',
        key: 'supervisor_approval_required'
      }
    },
    update: {},
    create: {
      category: 'permissions',
      key: 'supervisor_approval_required',
      value: 'false',
      type: 'BOOLEAN',
      encrypted: false
    }
  });

  // Integration Settings
  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'integrations',
        key: 'stripe_webhook_enabled'
      }
    },
    update: {},
    create: {
      category: 'integrations',
      key: 'stripe_webhook_enabled',
      value: 'true',
      type: 'BOOLEAN',
      encrypted: false
    }
  });

  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'integrations',
        key: 'airbnb_sync_frequency'
      }
    },
    update: {},
    create: {
      category: 'integrations',
      key: 'airbnb_sync_frequency',
      value: '60',
      type: 'NUMBER',
      encrypted: false
    }
  });

  // Encrypted example (API key)
  await prisma.setting.upsert({
    where: {
      category_key: {
        category: 'integrations',
        key: 'google_api_key'
      }
    },
    update: {},
    create: {
      category: 'integrations',
      key: 'google_api_key',
      value: 'encrypted:sk_test_example_key_1234567890',
      type: 'ENCRYPTED',
      encrypted: true
    }
  });

  console.log('✅ Settings seeded successfully!');
}

seedSettings()
  .catch((e) => {
    console.error('❌ Error seeding settings:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });