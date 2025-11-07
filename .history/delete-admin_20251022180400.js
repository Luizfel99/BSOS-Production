import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAdminUser() {
  try {
    await prisma.user.deleteMany({
      where: { email: 'admin@bsos.com' }
    });

    console.log('✅ Deleted existing admin user');
  } catch (error) {
    console.error('❌ Error deleting admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAdminUser();