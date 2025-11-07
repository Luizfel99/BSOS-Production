import bcrypt from 'bcryptjs';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hash = await bcrypt.hash('admin123', 10);

    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@bsos.com',
        password: hash,
        role: 'OWNER'
      }
    });

    console.log('✅ Admin user created successfully:', {
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();