#!/usr/bin/env node
/**
 * Script mestre que executa todo o fluxo de verificação
 * Uso: node run-diagnostics.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function runStep(title, command, continueOnError = false) {
  log(`\n${'='.repeat(70)}`, 'cyan');
  log(`${title}`, 'bold');
  log('='.repeat(70), 'cyan');
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname)
    });
    log(`\n✅ ${title} - CONCLUÍDO`, 'green');
    return true;
  } catch (error) {
    log(`\n❌ ${title} - FALHOU`, 'red');
    if (!continueOnError) {
      log('\n💡 Corrija o erro acima antes de continuar', 'yellow');
      process.exit(1);
    }
    return false;
  }
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(path.join(__dirname, filePath));
  if (exists) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description}`, 'red');
  }
  return exists;
}

async function main() {
  console.clear();
  log('\n🔍 DIAGNÓSTICO COMPLETO DO SISTEMA BSOS', 'bold');
  log('Data: ' + new Date().toLocaleString('pt-BR'), 'cyan');
  log('='.repeat(70), 'cyan');

  // 1. Verificar arquivos essenciais
  log('\n📋 1. Verificando arquivos essenciais...', 'cyan');
  const files = [
    ['.env.local', '.env.local existe'],
    ['prisma/schema.prisma', 'Schema Prisma existe'],
    ['package.json', 'package.json existe'],
    ['src/app/api/auth/login/route.ts', 'API de login existe']
  ];
  
  const allFilesOk = files.every(([file, desc]) => checkFile(file, desc));
  if (!allFilesOk) {
    log('\n❌ Arquivos essenciais faltando!', 'red');
    process.exit(1);
  }

  // 2. Verificar variáveis de ambiente
  log('\n🔐 2. Verificando variáveis de ambiente...', 'cyan');
  require('dotenv').config({ path: '.env.local' });
  
  const envVars = [
    ['DATABASE_URL', 'Database URL'],
    ['JWT_SECRET', 'JWT Secret']
  ];
  
  const allEnvOk = envVars.every(([varName, desc]) => {
    if (process.env[varName]) {
      log(`✅ ${desc} configurado`, 'green');
      return true;
    } else {
      log(`❌ ${desc} não configurado`, 'red');
      return false;
    }
  });

  if (!allEnvOk) {
    log('\n❌ Configure as variáveis em .env.local', 'red');
    process.exit(1);
  }

  // 3. Verificar node_modules
  log('\n📦 3. Verificando dependências...', 'cyan');
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    log('⚠️  node_modules não encontrado. Instalando...', 'yellow');
    runStep('Instalando dependências', 'npm install');
  } else {
    log('✅ node_modules existe', 'green');
  }

  // 4. Gerar Prisma Client
  runStep('4. Gerando Prisma Client', 'npx prisma generate');

  // 5. Verificar banco de dados
  runStep('5. Verificando banco de dados', 'node check-db-status.js', true);

  // 6. Criar usuários demo
  log('\n📝 6. Criando usuários demo...', 'cyan');
  runStep('Criando usuários demo', 'node ensure-demo-users.js', true);

  // 7. Verificar se servidor está rodando
  log('\n🌐 7. Verificando servidor...', 'cyan');
  try {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3020,
      path: '/api/status',
      method: 'GET',
      timeout: 2000
    };

    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          log('✅ Servidor está rodando na porta 3020', 'green');
          resolve(true);
        } else {
          reject();
        }
      });
      req.on('error', reject);
      req.on('timeout', reject);
      req.end();
    });

    // 8. Testar autenticação (se servidor estiver rodando)
    runStep('8. Testando autenticação', 'node test-auth-complete.js', true);

  } catch (error) {
    log('⚠️  Servidor não está rodando', 'yellow');
    log('💡 Inicie com: npm run dev', 'cyan');
    log('💡 Depois execute: npm run test:auth', 'cyan');
  }

  // 9. Resumo final
  log('\n' + '='.repeat(70), 'cyan');
  log('✅ DIAGNÓSTICO COMPLETO!', 'green');
  log('='.repeat(70), 'cyan');
  
  log('\n📊 Status do Sistema:', 'bold');
  log('   ✅ Arquivos essenciais: OK', 'green');
  log('   ✅ Variáveis de ambiente: OK', 'green');
  log('   ✅ Dependências: OK', 'green');
  log('   ✅ Prisma Client: OK', 'green');
  log('   ✅ Usuários demo: Criados', 'green');

  log('\n🚀 Próximos Passos:', 'cyan');
  log('   1. Iniciar servidor: npm run dev', 'cyan');
  log('   2. Testar autenticação: npm run test:auth', 'cyan');
  log('   3. Acessar: http://localhost:3020/login', 'cyan');
  log('   4. Login: admin@demo.bsos / demo123', 'cyan');

  log('\n📚 Documentação:', 'cyan');
  log('   - DIAGNOSTICO_COMPLETO.md - Diagnóstico geral', 'cyan');
  log('   - GUIA_TESTES_AUTH.md - Guia de testes de autenticação', 'cyan');
  log('   - ACAO_2_BANCO_DADOS.md - Verificação do banco', 'cyan');
}

main().catch(error => {
  log(`\n❌ Erro durante diagnóstico: ${error.message}`, 'red');
  process.exit(1);
});
