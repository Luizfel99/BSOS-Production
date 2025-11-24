#!/usr/bin/env node
/**
 * Script para verificar se arquivos sensíveis foram commitados no Git
 * Uso: node check-git-security.js
 */

const { execSync } = require('child_process');
const fs = require('fs');

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

function checkGitStatus() {
  log('\n🔍 VERIFICAÇÃO DE SEGURANÇA GIT', 'bold');
  log('='.repeat(70), 'cyan');

  // 1. Verificar se .env.local está sendo trackeado
  log('\n1️⃣ Verificando arquivos .env no Git status...', 'cyan');
  
  try {
    const status = execSync('git status --short', { encoding: 'utf8' });
    const envFiles = status.split('\n').filter(line => 
      line.includes('.env') && !line.includes('.env.example')
    );

    if (envFiles.length > 0) {
      log('⚠️  ARQUIVOS .env DETECTADOS NO GIT STATUS:', 'yellow');
      envFiles.forEach(file => log(`   ${file}`, 'yellow'));
      log('\n💡 Remova com: git rm --cached [arquivo]', 'cyan');
    } else {
      log('✅ Nenhum arquivo .env no Git status', 'green');
    }
  } catch (error) {
    log('⚠️  Não foi possível verificar Git status', 'yellow');
  }

  // 2. Verificar se .env.local está no .gitignore
  log('\n2️⃣ Verificando .gitignore...', 'cyan');
  
  try {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    const hasEnv = gitignore.includes('.env');
    const hasEnvLocal = gitignore.includes('.env.local');
    
    if (hasEnv || hasEnvLocal) {
      log('✅ Arquivos .env protegidos no .gitignore', 'green');
      const lines = gitignore.split('\n').filter(line => line.includes('.env'));
      lines.forEach(line => log(`   ${line}`, 'green'));
    } else {
      log('❌ .gitignore NÃO protege arquivos .env!', 'red');
      log('💡 Adicione estas linhas ao .gitignore:', 'cyan');
      log('.env', 'yellow');
      log('.env.local', 'yellow');
      log('.env*.local', 'yellow');
    }
  } catch (error) {
    log('⚠️  Não foi possível ler .gitignore', 'yellow');
  }

  // 3. Verificar histórico do Git
  log('\n3️⃣ Verificando histórico do Git...', 'cyan');
  
  try {
    const history = execSync(
      'git log --all --full-history --source -- .env .env.local .env.production 2>/dev/null || echo ""',
      { encoding: 'utf8' }
    );

    if (history.trim() && !history.includes('fatal')) {
      log('🔴 CRÍTICO: Arquivos .env foram commitados no histórico!', 'red');
      log('⚠️  Credenciais podem estar expostas!', 'red');
      log('\n💡 AÇÃO IMEDIATA NECESSÁRIA:', 'yellow');
      log('   1. Rotacionar TODAS as credenciais', 'yellow');
      log('   2. Remover do histórico do Git', 'yellow');
      log('   3. Verificar acessos não autorizados', 'yellow');
      
      log('\n🔧 Para remover do histórico:', 'cyan');
      log('   git filter-branch --force --index-filter \\', 'cyan');
      log('     "git rm --cached --ignore-unmatch .env .env.local" \\', 'cyan');
      log('     --prune-empty --tag-name-filter cat -- --all', 'cyan');
    } else {
      log('✅ Nenhum arquivo .env no histórico do Git', 'green');
    }
  } catch (error) {
    log('⚠️  Não foi possível verificar histórico', 'yellow');
  }

  // 4. Verificar arquivos .env existentes
  log('\n4️⃣ Verificando arquivos .env existentes...', 'cyan');
  
  const envFiles = [
    { name: '.env', shouldHaveCredentials: false },
    { name: '.env.local', shouldHaveCredentials: true },
    { name: '.env.production', shouldHaveCredentials: false },
    { name: '.env.example', shouldHaveCredentials: false }
  ];

  envFiles.forEach(({ name, shouldHaveCredentials }) => {
    if (fs.existsSync(name)) {
      const content = fs.readFileSync(name, 'utf8');
      const hasRealDB = content.includes('postgresql://') && 
                       content.includes('@') && 
                       !content.includes('user:password');
      
      const hasRealJWT = content.match(/JWT_SECRET=(?!.*example|.*your_|.*xxx).{30,}/);

      if (shouldHaveCredentials) {
        if (hasRealDB || hasRealJWT) {
          log(`✅ ${name} - Contém credenciais (correto, está no .gitignore)`, 'green');
        } else {
          log(`⚠️  ${name} - Não contém credenciais configuradas`, 'yellow');
        }
      } else {
        if (hasRealDB || hasRealJWT) {
          log(`🔴 ${name} - CONTÉM CREDENCIAIS REAIS! (PERIGO!)`, 'red');
          log(`   Este arquivo pode ser commitado. Remova as credenciais!`, 'red');
        } else {
          log(`✅ ${name} - Apenas placeholders (seguro)`, 'green');
        }
      }
    } else {
      log(`⚠️  ${name} - Não existe`, 'yellow');
    }
  });

  // 5. Verificar variáveis de ambiente sensíveis
  log('\n5️⃣ Verificando padrões de credenciais sensíveis...', 'cyan');
  
  const patterns = [
    { name: 'DATABASE_URL com senha', pattern: /DATABASE_URL=postgresql:\/\/[^:]+:[^@]{8,}@/ },
    { name: 'JWT_SECRET forte', pattern: /JWT_SECRET=[A-Za-z0-9]{32,}/ },
    { name: 'API Keys', pattern: /[A-Z_]+_API_KEY=[A-Za-z0-9]{20,}/ },
    { name: 'Senhas', pattern: /PASSWORD=[^#\s]+/ }
  ];

  ['.env', '.env.production'].forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      patterns.forEach(({ name, pattern }) => {
        if (pattern.test(content)) {
          log(`🔴 ${file} contém: ${name}`, 'red');
        }
      });
    }
  });

  // Resumo final
  log('\n' + '='.repeat(70), 'cyan');
  log('📊 RESUMO DA VERIFICAÇÃO DE SEGURANÇA', 'bold');
  log('='.repeat(70), 'cyan');

  log('\n✅ Checklist:', 'cyan');
  log('   [ ] .env não contém credenciais reais', 'cyan');
  log('   [ ] .env.local contém credenciais reais', 'cyan');
  log('   [ ] .env.local está no .gitignore', 'cyan');
  log('   [ ] .env.local NÃO está no Git status', 'cyan');
  log('   [ ] .env.local NÃO está no histórico do Git', 'cyan');
  
  log('\n💡 Recomendações:', 'cyan');
  log('   1. Execute: git status (verifique que .env.local não aparece)', 'cyan');
  log('   2. Execute: git log -- .env.local (verifique que está vazio)', 'cyan');
  log('   3. Se .env.local foi commitado, ROTACIONE todas as credenciais', 'cyan');
  log('   4. Leia: RELATORIO_SEGURANCA_ENV.md', 'cyan');

  log('\n');
}

checkGitStatus();
