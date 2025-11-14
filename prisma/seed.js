// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@bsos.com' },
        update: {},
        create: {
            name: 'Admin Demo',
            email: 'admin@bsos.com',
            passwordHash,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin user created:', admin.email);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        prisma.$disconnect();
        process.exit(1);
    });
