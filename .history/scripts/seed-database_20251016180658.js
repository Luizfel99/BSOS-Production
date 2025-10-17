const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Povoando banco de dados...');
    console.log('==============================\n');
    
    // Create test user
    console.log('👤 Criando usuário de teste...');
    const user = await prisma.user.create({
      data: {
        name: 'Pedro Manager',
        email: 'pedro@owner.com',
        role: 'MANAGER',
        phone: '+55 11 99999-9999',
        active: true
      }
    });
    console.log(`✅ Usuário criado: ${user.name} (${user.email})`);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin BSOS',
        email: 'admin@bsos.com',
        role: 'ADMIN',
        phone: '+55 11 88888-8888',
        active: true
      }
    });
    console.log(`✅ Admin criado: ${admin.name} (${admin.email})`);
    
    // Create test properties
    console.log('\n🏠 Criando propriedades de teste...');
    
    const properties = [
      {
        name: 'Apartamento Centro',
        address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
        type: 'APARTMENT',
        clientName: 'João Silva',
        contactEmail: 'joao@email.com',
        cleaningFrequency: 'WEEKLY',
        bedrooms: 2,
        bathrooms: 1,
        active: true
      },
      {
        name: 'Casa Jardins',
        address: 'Av. Paulista, 1000 - Jardins, São Paulo - SP',
        type: 'HOUSE',
        clientName: 'Maria Santos',
        contactEmail: 'maria@email.com',
        cleaningFrequency: 'BIWEEKLY',
        bedrooms: 3,
        bathrooms: 2,
        active: true
      },
      {
        name: 'Escritório Faria Lima',
        address: 'Faria Lima, 2500 - Itaim Bibi, São Paulo - SP',
        type: 'COMMERCIAL',
        clientName: 'Empresa ABC Ltda',
        contactEmail: 'contato@empresaabc.com',
        cleaningFrequency: 'DAILY',
        active: true
      },
      {
        name: 'Studio Vila Madalena',
        address: 'Rua Harmonia, 50 - Vila Madalena, São Paulo - SP',
        type: 'STUDIO',
        clientName: 'Ana Costa',
        contactEmail: 'ana@email.com',
        cleaningFrequency: 'MONTHLY',
        bedrooms: 1,
        bathrooms: 1,
        active: true
      }
    ];
    
    for (const propertyData of properties) {
      const property = await prisma.property.create({
        data: propertyData
      });
      console.log(`✅ Propriedade criada: ${property.name}`);
    }
    
    console.log('\n🎉 Banco populado com sucesso!');
    console.log(`👥 Usuários: 2`);
    console.log(`🏠 Propriedades: ${properties.length}`);
    
    console.log('\n🔐 Para fazer login use:');
    console.log(`📧 Owner: pedro@owner.com`);
    console.log(`📧 Admin: admin@bsos.com`);
    
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();