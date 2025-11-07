import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRoleEnum() {
  try {
    // First, update existing users to have a valid role
    await prisma.$executeRaw`UPDATE users SET role = 'CLEANER' WHERE role NOT IN ('CLEANER', 'SUPERVISOR', 'MANAGER', 'OWNER', 'CLIENT')`;

    // Rename the old enum
    await prisma.$executeRaw`ALTER TYPE "UserRole" RENAME TO "UserRole_old"`;

    // Create the new enum with correct values
    await prisma.$executeRaw`CREATE TYPE "UserRole" AS ENUM ('CLEANER', 'SUPERVISOR', 'MANAGER', 'OWNER', 'CLIENT')`;

    // Update the column to use the new enum
    await prisma.$executeRaw`ALTER TABLE users ALTER COLUMN role TYPE "UserRole" USING role::text::"UserRole"`;

    // Drop the old enum
    await prisma.$executeRaw`DROP TYPE "UserRole_old"`;

    console.log('✅ UserRole enum updated successfully');
  } catch (error) {
    console.error('❌ Error updating UserRole enum:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoleEnum();