#!/usr/bin/env node
/**
 * Script para verificar e aplicar migrações do Prisma
 * Uso: node check-and-migrate.js
 */

const { execSync } = require('child_process');
const path = require('path');

function runCommand(cmd, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    const output = execSync(cmd, { 
      stdio: 'inherit',
      cwd: path.join(__dirname)
    });
    console.log(`✅ ${description} - OK`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - FALHOU`);
    return false;
  }
}

async function main() {
  console.log('🚀 VERIFICAÇÃO E APLICAÇÃO DE MIGRAÇÕES PRISMA');
  console.log('=' .repeat(60));

  // 1. Verificar se DATABASE_URL está configurada
  console.log('\n1️⃣ Verificando DATABASE_URL...');
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL não está configurada!');
    console.log('💡 Configure em .env ou .env.local');
    process.exit(1);
  }
  console.log('✅ DATABASE_URL configurada');

  // 2. Gerar Prisma Client
  console.log('\n2️⃣ Gerando Prisma Client...');
  const generateOk = runCommand(
    'npx prisma generate',
    'Gerar Prisma Client'
  );
  
  if (!generateOk) {
    console.error('\n❌ Falha ao gerar Prisma Client');
    process.exit(1);
  }

  // 3. Verificar status das migrações
  console.log('\n3️⃣ Verificando status das migrações...');
  try {
    execSync('npx prisma migrate status', { stdio: 'inherit' });
  } catch (error) {
    console.log('\n⚠️  Há migrações pendentes ou problemas detectados');
  }

  // 4. Perguntar se deve aplicar migrações
  console.log('\n4️⃣ Aplicando migrações...');
  console.log('💡 Executando: npx prisma migrate deploy');
  
  const migrateOk = runCommand(
    'npx prisma migrate deploy',
    'Aplicar migrações'
  );

  if (!migrateOk) {
    console.error('\n❌ Falha ao aplicar migrações');
    console.log('\n💡 Possíveis soluções:');
    console.log('   1. Verificar se o banco de dados está acessível');
    console.log('   2. Verificar se DATABASE_URL está correta');
    console.log('   3. Executar manualmente: npx prisma migrate reset');
    process.exit(1);
  }

  // 5. Verificar banco de dados
  console.log('\n5️⃣ Verificando banco de dados...');
  const checkOk = runCommand(
    'node check-db-status.js',
    'Verificar status do banco'
  );

  console.log('\n' + '='.repeat(60));
  if (checkOk) {
    console.log('✅ MIGRAÇÕES APLICADAS COM SUCESSO!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Popular banco: npm run prisma:seed');
    console.log('   2. Iniciar servidor: npm run dev');
  } else {
    console.log('⚠️  MIGRAÇÕES APLICADAS, MAS COM AVISOS');
    console.log('\n💡 Verifique os logs acima para detalhes');
  }
}

main().catch(error => {
  console.error('\n❌ Erro durante execução:');
  console.error(error.message);
  process.exit(1);
});
