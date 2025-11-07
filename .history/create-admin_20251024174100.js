const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function createAdmin() {
  const prisma = new PrismaClient();

  try {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@bsos.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@bsos.com',
        password: hash,
        role: 'Owner'
      }
    });
    console.log('✅ Admin created or updated successfully');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }

  prisma.$disconnect();
}

createAdmin().catch(console.error);
    prisma.$disconnect();
  }
}

createAdminUser();