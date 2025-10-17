const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function queryProperties() {
  try {
    console.log('🔍 Executando: SELECT * FROM "properties"');
    console.log('==========================================\n');
    
    // Execute raw SQL query
    const properties = await prisma.$queryRaw`SELECT * FROM "properties"`;
    
    if (properties.length === 0) {
      console.log('📋 Nenhuma propriedade encontrada na tabela Property.');
    } else {
      console.log(`📊 Encontradas ${properties.length} propriedades:\n`);
      
      properties.forEach((property, index) => {
        console.log(`🏠 Propriedade ${index + 1}:`);
        console.log(`   ID: ${property.id}`);
        console.log(`   Nome: ${property.name}`);
        console.log(`   Endereço: ${property.address}`);
        console.log(`   Tipo: ${property.type}`);
        console.log(`   Cliente: ${property.clientName || 'N/A'}`);
        console.log(`   Email: ${property.contactEmail || 'N/A'}`);
        console.log(`   Tamanho: ${property.size || 'N/A'}`);
        console.log(`   Frequência: ${property.cleaningFrequency || 'N/A'}`);
        console.log(`   Ativo: ${property.active}`);
        console.log(`   Criado em: ${property.createdAt}`);
        console.log(`   Atualizado em: ${property.updatedAt}`);
        console.log('   ─────────────────────────────────────');
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar consulta:', error);
  } finally {
    await prisma.$disconnect();
  }
}

queryProperties();