#!/usr/bin/env node
/**
 * Script completo para testar autenticação BSOS
 * Testa: login, JWT, cookies, todos os roles
 */

const http = require('http');
const https = require('https');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3020';
const isHttps = BASE_URL.startsWith('https');
const httpModule = isHttps ? https : http;

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// Roles para testar
const DEMO_USERS = [
  { role: 'admin', email: 'admin@demo.bsos', password: 'demo123' },
  { role: 'manager', email: 'manager@demo.bsos', password: 'demo123' },
  { role: 'supervisor', email: 'supervisor@demo.bsos', password: 'demo123' },
  { role: 'cleaner', email: 'cleaner@demo.bsos', password: 'demo123' },
  { role: 'client', email: 'client@demo.bsos', password: 'demo123' },
  { role: 'owner', email: 'owner@demo.bsos', password: 'demo123' }
];

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = httpModule.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testServerHealth() {
  log('\n1️⃣ Testando servidor...', 'cyan');
  
  try {
    const url = new URL(BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: '/api/status',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    };

    const response = await makeRequest(options);
    
    if (response.status === 200) {
      log('✅ Servidor está online', 'green');
      return true;
    } else {
      log(`⚠️  Servidor respondeu com status ${response.status}`, 'yellow');
      return true;
    }
  } catch (error) {
    log('❌ Servidor não está respondendo', 'red');
    log(`   Erro: ${error.message}`, 'red');
    log(`   URL: ${BASE_URL}`, 'yellow');
    log('\n💡 Inicie o servidor: npm run dev', 'cyan');
    return false;
  }
}

async function testLogin(email, password, role) {
  const url = new URL(BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000
  };

  try {
    const response = await makeRequest(options, { email, password });
    
    if (response.status === 200 && response.body.token) {
      log(`✅ ${role.toUpperCase().padEnd(10)} - Login OK`, 'green');
      
      // Verificar estrutura da resposta
      const { token, user } = response.body;
      
      if (!user || !user.id || !user.email || !user.role) {
        log(`   ⚠️  Resposta incompleta`, 'yellow');
        return { success: false, error: 'Incomplete response' };
      }
      
      if (user.role !== role) {
        log(`   ⚠️  Role incorreto: esperado ${role}, recebido ${user.role}`, 'yellow');
        return { success: false, error: 'Wrong role' };
      }
      
      // Verificar cookie
      const cookie = response.headers['set-cookie'];
      if (!cookie || !cookie.some(c => c.includes('auth_token'))) {
        log(`   ⚠️  Cookie auth_token não definido`, 'yellow');
      } else {
        log(`   ✅ Cookie auth_token definido`, 'green');
      }
      
      return { 
        success: true, 
        token, 
        user,
        cookie: cookie ? cookie.find(c => c.includes('auth_token')) : null
      };
    } else if (response.status === 401) {
      log(`❌ ${role.toUpperCase().padEnd(10)} - Credenciais inválidas`, 'red');
      return { success: false, error: 'Invalid credentials' };
    } else if (response.status === 400) {
      log(`❌ ${role.toUpperCase().padEnd(10)} - Dados faltando`, 'red');
      return { success: false, error: 'Missing data' };
    } else {
      log(`❌ ${role.toUpperCase().padEnd(10)} - Erro ${response.status}`, 'red');
      log(`   Resposta: ${JSON.stringify(response.body)}`, 'yellow');
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    log(`❌ ${role.toUpperCase().padEnd(10)} - Erro: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testProtectedRoute(token, cookie) {
  log('\n4️⃣ Testando rota protegida...', 'cyan');
  
  const url = new URL(BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Cookie': cookie || ''
    },
    timeout: 10000
  };

  try {
    const response = await makeRequest(options);
    
    if (response.status === 200) {
      log('✅ Rota protegida acessível com token', 'green');
      log(`   User: ${response.body.user?.name} (${response.body.user?.role})`, 'cyan');
      return true;
    } else {
      log(`❌ Falha ao acessar rota protegida: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Erro ao testar rota protegida: ${error.message}`, 'red');
    return false;
  }
}

async function testDemoLogin(role) {
  log('\n5️⃣ Testando login demo (sem senha)...', 'cyan');
  
  const url = new URL(BASE_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000
  };

  try {
    const response = await makeRequest(options, { demo: true, role });
    
    if (response.status === 200) {
      log(`✅ Login demo funcionando para role: ${role}`, 'green');
      return true;
    } else {
      log(`⚠️  Login demo retornou: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Erro no login demo: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  console.log('='.repeat(70));
  log('🔐 TESTE COMPLETO DE AUTENTICAÇÃO - BSOS', 'bold');
  console.log('='.repeat(70));
  log(`URL: ${BASE_URL}`, 'cyan');

  // 1. Testar servidor
  const serverOk = await testServerHealth();
  if (!serverOk) {
    process.exit(1);
  }

  // 2. Testar login de todos os roles
  log('\n2️⃣ Testando login de todos os roles...', 'cyan');
  
  const results = [];
  for (const user of DEMO_USERS) {
    const result = await testLogin(user.email, user.password, user.role);
    results.push({ ...user, ...result });
    await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay
  }

  // 3. Resumo
  log('\n3️⃣ Resumo dos testes:', 'cyan');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`✅ Sucessos: ${successful}/${DEMO_USERS.length}`, successful === DEMO_USERS.length ? 'green' : 'yellow');
  log(`❌ Falhas: ${failed}/${DEMO_USERS.length}`, failed === 0 ? 'green' : 'red');

  if (failed > 0) {
    log('\nUsuários com falha:', 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`   - ${r.role}: ${r.error}`, 'red');
    });
  }

  // 4. Testar rota protegida (se houver sucesso)
  const adminResult = results.find(r => r.role === 'admin' && r.success);
  if (adminResult) {
    await testProtectedRoute(adminResult.token, adminResult.cookie);
  }

  // 5. Testar login demo
  await testDemoLogin('admin');

  // 6. Resultado final
  console.log('\n' + '='.repeat(70));
  if (successful === DEMO_USERS.length) {
    log('🎉 TODOS OS TESTES PASSARAM!', 'green');
    log('\n💡 Próximos passos:', 'cyan');
    log('   1. Testar no navegador: http://localhost:3020/login', 'cyan');
    log('   2. Executar testes E2E: npm run test:e2e', 'cyan');
    process.exit(0);
  } else if (successful > 0) {
    log('⚠️  ALGUNS TESTES FALHARAM', 'yellow');
    log('\n💡 Possíveis causas:', 'cyan');
    log('   1. Usuários não existem no banco (execute: npm run prisma:seed)', 'cyan');
    log('   2. Senha incorreta', 'cyan');
    log('   3. JWT_SECRET não configurado', 'cyan');
    process.exit(1);
  } else {
    log('❌ TODOS OS TESTES FALHARAM', 'red');
    log('\n💡 Verifique:', 'cyan');
    log('   1. Servidor está rodando? (npm run dev)', 'cyan');
    log('   2. Banco de dados populado? (npm run prisma:seed)', 'cyan');
    log('   3. JWT_SECRET configurado em .env.local?', 'cyan');
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  process.exit(1);
});
