import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  const roles = ['admin', 'owner', 'manager', 'supervisor', 'cleaner'];
  const users = [];

  for (const role of roles) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    users.push({
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} Demo`,
      email: `${role}@bsos.com`,
      passwordHash,
      role,
      createdAt: new Date(),
    });
  }

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }

  console.log('✅ Demo users seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
