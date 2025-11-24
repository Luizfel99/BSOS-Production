#!/usr/bin/env node
/**
 * Cria usuários demo se não existirem
 * Uso: node ensure-demo-users.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEMO_USERS = [
  { name: 'Alice Admin', email: 'admin@demo.bsos', role: 'admin' },
  { name: 'Manny Manager', email: 'manager@demo.bsos', role: 'manager' },
  { name: 'Sophie Supervisor', email: 'supervisor@demo.bsos', role: 'supervisor' },
  { name: 'Cleo Cleaner', email: 'cleaner@demo.bsos', role: 'cleaner' },
  { name: 'Carl Client', email: 'client@demo.bsos', role: 'client' },
  { name: 'Oscar Owner', email: 'owner@demo.bsos', role: 'owner' }
];

const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PWD || 'demo123';

async function ensureDemoUsers() {
  console.log('🔧 Verificando e criando usuários demo...\n');

  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados\n');

    let created = 0;
    let existing = 0;

    for (const userData of DEMO_USERS) {
      try {
        // Verificar se já existe
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          console.log(`⏭️  ${userData.role.padEnd(10)} - Já existe (${userData.email})`);
          existing++;
        } else {
          // Criar usuário
          const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
          
          await prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              role: userData.role,
              passwordHash: passwordHash,
              active: true
            }
          });

          console.log(`✅ ${userData.role.padEnd(10)} - Criado (${userData.email})`);
          created++;
        }
      } catch (error) {
        console.error(`❌ ${userData.role.padEnd(10)} - Erro: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Resumo:`);
    console.log(`   ✅ Criados: ${created}`);
    console.log(`   ⏭️  Já existiam: ${existing}`);
    console.log(`   📝 Total: ${DEMO_USERS.length}`);
    console.log('='.repeat(60));

    if (created > 0) {
      console.log('\n🎉 Usuários demo criados com sucesso!');
      console.log(`\n🔑 Credenciais:`);
      console.log(`   Email: [role]@demo.bsos`);
      console.log(`   Senha: ${DEMO_PASSWORD}`);
      console.log(`\n📋 Roles disponíveis:`);
      DEMO_USERS.forEach(u => console.log(`   - ${u.role}`));
    } else {
      console.log('\n✅ Todos os usuários demo já existem!');
    }

  } catch (error) {
    console.error('\n❌ Erro ao criar usuários demo:');
    console.error(error.message);
    
    if (error.code === 'P2002') {
      console.log('\n💡 Email já existe no banco de dados');
    } else if (error.code === 'P1001') {
      console.log('\n💡 Não foi possível conectar ao banco de dados');
      console.log('   Verifique DATABASE_URL em .env.local');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

ensureDemoUsers();
