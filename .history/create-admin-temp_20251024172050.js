const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
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
    console.log('✅ Admin created/updated: admin@bsos.com / admin123');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
})();