const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️ BSOS Neon Database Setup');
console.log('================================\n');

// Função para fazer requests HTTP
async function makeRequest(url, options = {}) {
  const https = require('https');
  const urlParsed = new URL(url);
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: urlParsed.hostname,
      port: 443,
      path: urlParsed.pathname + urlParsed.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BSOS-Setup/1.0',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: res.headers['content-type']?.includes('json') ? JSON.parse(data) : data
          });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function setupNeonDatabase() {
  console.log('📋 Instruções para configurar Neon Database:');
  console.log('');
  console.log('1️⃣ Abra seu navegador e vá para: https://neon.tech');
  console.log('2️⃣ Faça login com sua conta GitHub');
  console.log('3️⃣ Clique em "Create a project"');
  console.log('4️⃣ Configure o projeto:');
  console.log('   • Project name: bsos-production');
  console.log('   • Database name: bsos');
  console.log('   • Region: US East (Ohio)');
  console.log('   • Postgres version: 16');
  console.log('');
  console.log('5️⃣ Depois de criar, você verá uma CONNECTION STRING');
  console.log('   Formato: postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/bsos?sslmode=require');
  console.log('');
  
  // Aguardar input do usuário
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('🔗 Cole aqui sua CONNECTION STRING do Neon: ', (connectionString) => {
      rl.close();
      
      if (!connectionString || !connectionString.includes('postgresql://')) {
        console.log('❌ Connection string inválida!');
        process.exit(1);
      }
      
      console.log('✅ Connection string recebida!');
      resolve(connectionString.trim());
    });
  });
}

async function testConnection(connectionString) {
  console.log('\n🧪 Testando conexão com o banco...');
  
  try {
    // Criar arquivo temporário para teste
    const testScript = `
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: '${connectionString}',
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    // Testar uma query simples
    const result = await client.query('SELECT NOW() as current_time');
    console.log('🕐 Hora do servidor:', result.rows[0].current_time);
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    return false;
  }
}

testConnection().then(success => process.exit(success ? 0 : 1));
`;
    
    fs.writeFileSync('test-connection.js', testScript);
    execSync('node test-connection.js', { stdio: 'inherit' });
    fs.unlinkSync('test-connection.js');
    
    return true;
  } catch (error) {
    console.error('❌ Teste de conexão falhou:', error.message);
    return false;
  }
}

async function updateConfigFiles(connectionString) {
  console.log('\n📝 Atualizando arquivos de configuração...');
  
  // Atualizar PRODUCTION_CONFIG.md
  const configPath = path.join(__dirname, '..', 'PRODUCTION_CONFIG.md');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  configContent = configContent.replace(
    /DATABASE_URL=.*/,
    `DATABASE_URL=${connectionString}`
  );
  
  configContent = configContent.replace(
    /- Status: 🔄 Configurando.../,
    '- Status: ✅ Configurado e testado!'
  );
  
  fs.writeFileSync(configPath, configContent);
  
  // Criar/atualizar .env.local para desenvolvimento
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf8');
  }
  
  // Remover DATABASE_URL existente e adicionar novo
  const lines = envContent.split('\n').filter(line => !line.startsWith('DATABASE_URL='));
  lines.push(`DATABASE_URL=${connectionString}`);
  
  fs.writeFileSync(envLocalPath, lines.join('\n'));
  
  console.log('✅ Arquivos atualizados:');
  console.log('   • PRODUCTION_CONFIG.md');
  console.log('   • .env.local');
}

async function createDatabaseSchema(connectionString) {
  console.log('\n🏗️ Criando schema do banco...');
  
  try {
    const schemaScript = `
const { Client } = require('pg');

async function createSchema() {
  const client = new Client({
    connectionString: '${connectionString}',
    ssl: { rejectUnauthorized: false }
  });
  
  await client.connect();
  
  try {
    // Criar tabelas básicas
    await client.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    
    await client.query(\`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        stripe_payment_id VARCHAR(255),
        amount DECIMAL(10,2),
        currency VARCHAR(3) DEFAULT 'BRL',
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    
    await client.query(\`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50),
        amount DECIMAL(10,2),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    
    console.log('✅ Schema criado com sucesso!');
    
  } finally {
    await client.end();
  }
}

createSchema().catch(console.error);
`;
    
    fs.writeFileSync('create-schema.js', schemaScript);
    execSync('node create-schema.js', { stdio: 'inherit' });
    fs.unlinkSync('create-schema.js');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar schema:', error.message);
    return false;
  }
}

// Executar setup
async function main() {
  try {
    const connectionString = await setupNeonDatabase();
    
    const connected = await testConnection(connectionString);
    if (!connected) {
      console.log('❌ Não foi possível conectar ao banco.');
      process.exit(1);
    }
    
    await updateConfigFiles(connectionString);
    await createDatabaseSchema(connectionString);
    
    console.log('\n🎉 Setup do Neon Database concluído!');
    console.log('');
    console.log('📋 Próximos passos:');
    console.log('1️⃣ Configurar Stripe Live Keys');
    console.log('2️⃣ Configurar Sentry');
    console.log('3️⃣ Deploy no Vercel');
    console.log('');
    console.log('🔗 Sua connection string foi salva em:');
    console.log('   • PRODUCTION_CONFIG.md');
    console.log('   • .env.local');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error.message);
    process.exit(1);
  }
}

main();