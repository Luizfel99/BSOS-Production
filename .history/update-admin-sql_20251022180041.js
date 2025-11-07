import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminRoleSQL() {
  try {
    await prisma.$executeRaw`UPDATE users SET role = 'OWNER' WHERE email = 'admin@bsos.com'`;

    const user = await prisma.user.findUnique({
      where: { email: 'admin@bsos.com' }
    });

    console.log('✅ Admin user role updated via SQL:', {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    console.error('❌ Error updating admin role via SQL:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRoleSQL();