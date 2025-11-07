const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in database:', users.length);
    if (users.length > 0) {
      console.log('First user:', { email: users[0].email, role: users[0].role, name: users[0].name });
    } else {
      console.log('No users found in database');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();