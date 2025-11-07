import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminRole() {
  try {
    const user = await prisma.user.update({
      where: { email: 'admin@bsos.com' },
      data: { role: UserRole.OWNER }
    });

    console.log('✅ Admin user role updated to OWNER:', {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    console.error('❌ Error updating admin role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminRole();