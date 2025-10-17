const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProperties() {
  console.log('🌱 Seeding Properties for Testing...');
  
  try {
    // Create test properties
    const properties = await Promise.all([
      prisma.property.create({
        data: {
          name: "Apartamento Centro",
          address: "Rua das Flores, 123 - Centro, São Paulo - SP",
          type: "APARTMENT", 
          clientName: "João Silva",
          contactEmail: "joao@email.com",
          cleaningFrequency: "WEEKLY"
        }
      }),
      prisma.property.create({
        data: {
          name: "Casa Jardins",
          address: "Av. Paulista, 1000 - Jardins, São Paulo - SP", 
          type: "HOUSE",
          clientName: "Maria Santos",
          contactEmail: "maria@email.com",
          cleaningFrequency: "BIWEEKLY"
        }
      }),
      prisma.property.create({
        data: {
          name: "Escritório Faria Lima",
          address: "Faria Lima, 2500 - Itaim Bibi, São Paulo - SP",
          type: "COMMERCIAL", 
          clientName: "Empresa ABC Ltda",
          contactEmail: "contato@empresaabc.com",
          cleaningFrequency: "DAILY"
        }
      }),
      prisma.property.create({
        data: {
          name: "Studio Vila Madalena", 
          address: "Rua Harmonia, 50 - Vila Madalena, São Paulo - SP",
          type: "STUDIO",
          clientName: "Ana Costa",
          contactEmail: "ana@email.com",
          cleaningFrequency: "MONTHLY"
        }
      })
    ]);

    console.log('✅ Properties created successfully!');
    console.log(`📊 Total properties: ${properties.length}`);
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.name} (${prop.type}) - ${prop.clientName}`);
    });
    
    return properties;
    
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  seedProperties()
    .then(() => {
      console.log('🎯 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedProperties };