const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('👥 Verificando usuários no banco...');
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log(`📊 Total usuários: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });
    
    if (users.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado. Criando usuário de teste...');
      
      const testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@bsos.com',
          role: 'OWNER',
          phone: '(11) 99999-9999'
        }
      });
      
      console.log('✅ Usuário de teste criado:', testUser.name, testUser.email);
      return testUser;
    }
    
    return users[0]; // Return first user for testing
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute if run directly
if (require.main === module) {
  checkUsers()
    .then((user) => {
      console.log('🎯 User check completed!');
      if (user) {
        console.log('🍪 Para testar, você pode usar estes cookies:');
        console.log(`bsos-user: ${JSON.stringify({id: user.id, email: user.email, name: user.name, role: user.role})}`);
        console.log(`bsos-selected-role: ${user.role}`);
        console.log(`auth-token: ${user.id}-${Date.now()}`);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 User check failed:', error);
      process.exit(1);
    });
}

module.exports = { checkUsers };