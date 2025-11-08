import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const demoPassword = await bcrypt.hash('demo123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bsos.com' },
    update: {},
    create: {
      email: 'admin@bsos.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Manager User
  const manager = await prisma.user.upsert({
    where: { email: 'manager@bsos.com' },
    update: {},
    create: {
      email: 'manager@bsos.com',
      name: 'Manager Demo',
      passwordHash: demoPassword,
      role: 'MANAGER',
    },
  });
  console.log('✅ Manager user created:', manager.email);

  // Create Supervisor User
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@bsos.com' },
    update: {},
    create: {
      email: 'supervisor@bsos.com',
      name: 'Supervisor Demo',
      passwordHash: demoPassword,
      role: 'SUPERVISOR',
    },
  });
  console.log('✅ Supervisor user created:', supervisor.email);

  // Create Cleaner User
  const cleaner = await prisma.user.upsert({
    where: { email: 'cleaner@bsos.com' },
    update: {},
    create: {
      email: 'cleaner@bsos.com',
      name: 'Cleaner Demo',
      passwordHash: demoPassword,
      role: 'CLEANER',
    },
  });
  console.log('✅ Cleaner user created:', cleaner.email);

  // Create Owner User
  const owner = await prisma.user.upsert({
    where: { email: 'owner@bsos.com' },
    update: {},
    create: {
      email: 'owner@bsos.com',
      name: 'Owner Demo',
      passwordHash: demoPassword,
      role: 'OWNER',
    },
  });
  console.log('✅ Owner user created:', owner.email);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('   Admin:      admin@bsos.com / admin123');
  console.log('   Manager:    manager@bsos.com / demo123');
  console.log('   Supervisor: supervisor@bsos.com / demo123');
  console.log('   Cleaner:    cleaner@bsos.com / demo123');
  console.log('   Owner:      owner@bsos.com / demo123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
