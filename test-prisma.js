const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  const prisma = new PrismaClient();

  try {
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
    if (users.length > 0) {
      console.log('First user:', users[0]);
    }
  } catch (error) {
    console.error('Prisma error:', error.message);
  }

  prisma.$disconnect();
}

testPrisma();