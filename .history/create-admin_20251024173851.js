const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@bsos.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@bsos.com',
        password: hash,
        role: 'Owner'
      }
    });
    console.log('✅ Admin created or updated successfully');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
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