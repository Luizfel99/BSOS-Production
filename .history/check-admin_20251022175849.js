import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'admin@bsos.com' }
    });

    if (user) {
      console.log('✅ Admin user found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });
    } else {
      console.log('❌ Admin user not found');
    }
  } catch (error) {
    console.error('❌ Error checking admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();