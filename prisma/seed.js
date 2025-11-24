// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with demo users...');
    
    const passwordHash = await bcrypt.hash('demo123', 10);
    
    const roles = ['admin', 'owner', 'manager', 'supervisor', 'cleaner', 'client'];
    
    for (const role of roles) {
        const user = await prisma.user.upsert({
            where: { email: `${role}@demo.local` },
            update: { passwordHash },
            create: {
                name: `${role.charAt(0).toUpperCase() + role.slice(1)} Demo`,
                email: `${role}@demo.local`,
                passwordHash,
                role: role,
            },
        });
        console.log(`  ✅ ${role}: ${user.email}`);
    }
    
    console.log('✅ Seed complete! Login with {role}@demo.local / demo123');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        prisma.$disconnect();
        process.exit(1);
    });
