// Test Database Connection Script
const { PrismaClient } = require('@prisma/client');

async function testConnection(databaseUrl, label) {
  console.log(`\n🔌 Testando conexão: ${label}`);
  console.log(`🔗 URL: ${databaseUrl.replace(/:\/\/.*@/, '://***:***@')}`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });

  try {
    // Tentar conectar ao banco
    await prisma.$connect();
    console.log(`✅ Conexão bem-sucedida!`);
    
    // Tentar executar uma query simples
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log(`📊 Versão PostgreSQL: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
    
    // Verificar tabelas existentes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log(`📋 Tabelas encontradas: ${tables.length}`);
    tables.forEach(table => console.log(`   • ${table.table_name}`));
    
    return { success: true, tables: tables.length };
    
  } catch (error) {
    console.log(`❌ Erro na conexão: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log('🗄️ BSOS Database Connection Tester');
  console.log('==================================');
  
  // URLs para testar
  const mainDb = process.env.DATABASE_URL;
  const devDb = mainDb.replace('/neondb?', '/bsos-dev-branch?');
  
  // Testar banco principal
  const mainResult = await testConnection(mainDb, 'Banco Principal (neondb)');
  
  // Testar banco de desenvolvimento 
  const devResult = await testConnection(devDb, 'Banco Dev (bsos-dev-branch)');
  
  console.log('\n📊 RESUMO DOS TESTES:');
  console.log('=====================');
  console.log(`🔷 Banco Principal: ${mainResult.success ? '✅ OK' : '❌ FALHOU'}`);
  console.log(`🔷 Banco Dev: ${devResult.success ? '✅ OK' : '❌ FALHOU'}`);
  
  if (mainResult.success) {
    console.log(`📋 Tabelas no principal: ${mainResult.tables}`);
  }
  
  if (devResult.success) {
    console.log(`📋 Tabelas no dev: ${devResult.tables}`);
  }
  
  // Recomendação
  console.log('\n💡 RECOMENDAÇÃO:');
  if (devResult.success) {
    console.log('✅ Use o banco bsos-dev-branch para desenvolvimento');
    console.log('🔧 Para ativar: descomente a linha DATABASE_URL no .env');
  } else {
    console.log('⚠️ Banco dev não disponível, continue usando o principal');
    console.log('🏗️ Para criar banco dev, acesse o painel Neon e crie nova database');
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('💥 Erro durante teste:', error);
      process.exit(1);
    });
}

module.exports = { testConnection };