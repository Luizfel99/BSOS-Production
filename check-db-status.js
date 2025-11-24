#!/usr/bin/env node
/**
 * Script para verificar status do banco de dados
 * Verifica: conexão, tabelas existentes, e dados
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function checkDatabaseStatus() {
  console.log('🔍 VERIFICANDO STATUS DO BANCO DE DADOS\n');
  console.log('=' .repeat(60));

  try {
    // 1. Testar conexão
    console.log('\n1️⃣ Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    // 2. Verificar tabelas existentes via query raw
    console.log('\n2️⃣ Verificando tabelas existentes...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log(`✅ Encontradas ${tables.length} tabelas:`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    // 3. Verificar enums
    console.log('\n3️⃣ Verificando tipos enum...');
    const enums = await prisma.$queryRaw`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      ORDER BY typname;
    `;
    
    if (enums.length > 0) {
      console.log(`✅ Encontrados ${enums.length} enums:`);
      enums.forEach(e => console.log(`   - ${e.typname}`));
    } else {
      console.log('⚠️  Nenhum enum encontrado');
    }

    // 4. Contar registros em cada tabela
    console.log('\n4️⃣ Contando registros...');
    
    const userCount = await prisma.user.count().catch(() => null);
    if (userCount !== null) {
      console.log(`✅ Users: ${userCount} registros`);
    } else {
      console.log('⚠️  Tabela User não encontrada ou erro ao contar');
    }

    const propertyCount = await prisma.property.count().catch(() => null);
    if (propertyCount !== null) {
      console.log(`✅ Properties: ${propertyCount} registros`);
    } else {
      console.log('⚠️  Tabela Property não encontrada');
    }

    const taskCount = await prisma.task.count().catch(() => null);
    if (taskCount !== null) {
      console.log(`✅ Tasks: ${taskCount} registros`);
    } else {
      console.log('⚠️  Tabela Task não encontrada');
    }

    const teamCount = await prisma.teamMember.count().catch(() => null);
    if (teamCount !== null) {
      console.log(`✅ TeamMembers: ${teamCount} registros`);
    } else {
      console.log('⚠️  Tabela TeamMember não encontrada');
    }

    // 5. Verificar migrações aplicadas
    console.log('\n5️⃣ Verificando histórico de migrações...');
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, applied_steps_count
      FROM _prisma_migrations
      ORDER BY finished_at DESC;
    `.catch(() => []);

    if (migrations.length > 0) {
      console.log(`✅ ${migrations.length} migrações aplicadas:`);
      migrations.forEach(m => {
        const date = new Date(m.finished_at).toLocaleString('pt-BR');
        console.log(`   - ${m.migration_name} (${date})`);
      });
    } else {
      console.log('⚠️  Tabela _prisma_migrations não encontrada ou vazia');
    }

    // 6. Verificar schema atual vs esperado
    console.log('\n6️⃣ Verificando schema...');
    const expectedTables = [
      'User',
      'ResetToken', 
      'VerificationCode',
      'Property',
      'TeamMember',
      'Task',
      'UserPreference',
      '_prisma_migrations'
    ];

    const actualTableNames = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !actualTableNames.includes(t));
    
    if (missingTables.length === 0) {
      console.log('✅ Todas as tabelas esperadas existem!');
    } else {
      console.log('⚠️  Tabelas faltando:');
      missingTables.forEach(t => console.log(`   - ${t}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DIAGNÓSTICO CONCLUÍDO!\n');

    // Resultado final
    if (missingTables.length === 0 && userCount !== null) {
      console.log('🎉 Status: BANCO DE DADOS OK');
      console.log('💡 Próximo passo: Popular dados (npm run prisma:seed)');
      process.exit(0);
    } else if (missingTables.length > 0) {
      console.log('⚠️  Status: MIGRAÇÕES PENDENTES');
      console.log('💡 Execute: npx prisma migrate deploy');
      process.exit(1);
    } else {
      console.log('✅ Status: SCHEMA OK, DADOS VAZIOS');
      console.log('💡 Execute: npm run prisma:seed');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ ERRO ao verificar banco de dados:');
    console.error(error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Solução: Verificar DATABASE_URL no .env');
    } else if (error.code === 'P2021') {
      console.log('\n💡 Solução: Tabela não existe. Execute: npx prisma migrate deploy');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();
