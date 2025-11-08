// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');
    
    // Password for all demo accounts: 'demo'
    const demoPasswordHash = await bcrypt.hash('demo', 10);
    // Password for admin: 'admin123'
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bsos.com' },
        update: {},
        create: {
            name: 'System Administrator',
            email: 'admin@bsos.com',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            active: true,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create demo users matching LoginScreen demo accounts
    const demoUsers = [
        {
            email: 'maria@cleaner.com',
            name: 'Maria Silva',
            role: 'CLEANER',
        },
        {
            email: 'joao@supervisor.com',
            name: 'João Santos',
            role: 'SUPERVISOR',
        },
        {
            email: 'ana@manager.com',
            name: 'Ana Costa',
            role: 'MANAGER',
        },
        {
            email: 'pedro@owner.com',
            name: 'Pedro Oliveira',
            role: 'OWNER',
        },
        {
            email: 'carlos@client.com',
            name: 'Carlos Mendes',
            role: 'CLIENT',
        },
    ];

    for (const userData of demoUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                name: userData.name,
                email: userData.email,
                passwordHash: demoPasswordHash,
                role: userData.role,
                active: true,
            },
        });
        console.log('✅ Demo user created:', user.email, '-', user.role);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@bsos.com / admin123');
    console.log('   Demo users: <email> / demo');
    console.log('   Examples:');
    console.log('   - maria@cleaner.com / demo');
    console.log('   - joao@supervisor.com / demo');
    console.log('   - ana@manager.com / demo');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        prisma.$disconnect();
        process.exit(1);
    });
