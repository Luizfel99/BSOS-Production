#!/usr/bin/env node
/**
 * 🚀 BRIGHT & SHINE - CONFIGURAÇÃO PARA PRODUÇÃO
 * Script para configurar o ambiente de produção
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.blue}${question}${colors.reset}`, resolve);
  });
}

async function setupProduction() {
  log('\n🏠 BRIGHT & SHINE - CONFIGURAÇÃO PARA PRODUÇÃO', 'bold');
  log('═══════════════════════════════════════════════════\n', 'blue');

  log('Este script irá ajudá-lo a configurar o ambiente de produção.', 'green');
  log('Você pode pular qualquer seção pressionando Enter.\n');

  const config = {};

  // 1. Configurações básicas
  log('📝 1. CONFIGURAÇÕES BÁSICAS', 'yellow');
  log('─────────────────────────────');
  
  config.NEXT_PUBLIC_APP_URL = await askQuestion('URL da aplicação (ex: https://brightshine.vercel.app): ') || 'https://localhost:3000';
  config.NODE_ENV = 'production';

  // 2. Banco de dados
  log('\n🗄️  2. BANCO DE DADOS', 'yellow');
  log('──────────────────────');
  
  const dbChoice = await askQuestion('Escolha o banco (1-Supabase, 2-Railway, 3-Heroku, 4-Outro): ');
  
  switch(dbChoice) {
    case '1':
      config.DATABASE_URL = await askQuestion('URL do Supabase (postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres): ');
      break;
    case '2':
      config.DATABASE_URL = await askQuestion('URL do Railway: ');
      break;
    case '3':
      config.DATABASE_URL = await askQuestion('URL do Heroku Postgres: ');
      break;
    default:
      config.DATABASE_URL = await askQuestion('URL do banco de dados: ');
  }

  // 3. Airbnb
  log('\n🏠 3. INTEGRAÇÃO AIRBNB', 'yellow');
  log('────────────────────────');
  
  config.AIRBNB_CLIENT_ID = await askQuestion('Airbnb Client ID: ');
  config.AIRBNB_CLIENT_SECRET = await askQuestion('Airbnb Client Secret: ');
  config.AIRBNB_REDIRECT_URI = `${config.NEXT_PUBLIC_APP_URL}/api/integrations/airbnb/callback`;

  // 4. WhatsApp
  log('\n📱 4. WHATSAPP BUSINESS API', 'yellow');
  log('─────────────────────────────');
  
  config.WHATSAPP_API_TOKEN = await askQuestion('WhatsApp Business API Token: ');
  config.WHATSAPP_PHONE_NUMBER_ID = await askQuestion('WhatsApp Phone Number ID: ');
  config.WHATSAPP_WEBHOOK_VERIFY_TOKEN = await askQuestion('WhatsApp Webhook Verify Token: ');

  // 5. SendGrid
  log('\n📧 5. SENDGRID (EMAIL)', 'yellow');
  log('───────────────────────');
  
  config.SENDGRID_API_KEY = await askQuestion('SendGrid API Key: ');
  config.SENDGRID_FROM_EMAIL = await askQuestion('Email remetente (ex: noreply@brightshine.com): ');
  config.SENDGRID_FROM_NAME = await askQuestion('Nome remetente (ex: Bright & Shine): ') || 'Bright & Shine';

  // 6. Hostaway
  log('\n🏨 6. HOSTAWAY PMS (opcional)', 'yellow');
  log('─────────────────────────────');
  
  config.HOSTAWAY_API_KEY = await askQuestion('Hostaway API Key: ');
  config.HOSTAWAY_USERNAME = await askQuestion('Hostaway Username: ');
  config.HOSTAWAY_PASSWORD = await askQuestion('Hostaway Password: ');

  // 7. Segurança
  log('\n🔐 7. CONFIGURAÇÕES DE SEGURANÇA', 'yellow');
  log('─────────────────────────────────');
  
  config.JWT_SECRET = await askQuestion('JWT Secret (mínimo 32 caracteres): ') || generateRandomSecret();
  config.WEBHOOK_SECRET = await askQuestion('Webhook Secret: ') || generateRandomSecret();
  config.ENCRYPTION_KEY = await askQuestion('Encryption Key: ') || generateRandomSecret();

  // 8. Outros serviços opcionais
  log('\n⚙️  8. SERVIÇOS OPCIONAIS', 'yellow');
  log('─────────────────────────');
  
  const includeOptional = await askQuestion('Incluir serviços opcionais? (y/n): ');
  
  if (includeOptional.toLowerCase() === 'y') {
    config.TWILIO_ACCOUNT_SID = await askQuestion('Twilio Account SID (SMS): ');
    config.TWILIO_AUTH_TOKEN = await askQuestion('Twilio Auth Token: ');
    config.TWILIO_PHONE_NUMBER = await askQuestion('Twilio Phone Number: ');
    
    config.BOOKING_USERNAME = await askQuestion('Booking.com Username: ');
    config.BOOKING_PASSWORD = await askQuestion('Booking.com Password: ');
    
    config.SENTRY_DSN = await askQuestion('Sentry DSN (monitoramento): ');
  }

  rl.close();

  // Gerar arquivo .env.local
  await generateEnvFile(config);
  
  // Mostrar próximos passos
  showNextSteps();
}

function generateRandomSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateEnvFile(config) {
  log('\n📄 GERANDO ARQUIVO .env.local...', 'yellow');
  
  let envContent = `# 🏠 BRIGHT & SHINE - CONFIGURAÇÃO DE PRODUÇÃO
# Gerado automaticamente em ${new Date().toLocaleString()}
# 
# ⚠️ NUNCA COMMITE ESTE ARQUIVO!

# ================================
# 🌐 CONFIGURAÇÕES DA APLICAÇÃO
# ================================
NEXT_PUBLIC_APP_URL=${config.NEXT_PUBLIC_APP_URL}
NODE_ENV=${config.NODE_ENV}

# ================================
# 🗄️ BANCO DE DADOS
# ================================
DATABASE_URL=${config.DATABASE_URL}

# ================================
# 🏠 INTEGRAÇÃO AIRBNB
# ================================
AIRBNB_CLIENT_ID=${config.AIRBNB_CLIENT_ID}
AIRBNB_CLIENT_SECRET=${config.AIRBNB_CLIENT_SECRET}
AIRBNB_REDIRECT_URI=${config.AIRBNB_REDIRECT_URI}

# ================================
# 📱 WHATSAPP BUSINESS API
# ================================
WHATSAPP_API_TOKEN=${config.WHATSAPP_API_TOKEN}
WHATSAPP_PHONE_NUMBER_ID=${config.WHATSAPP_PHONE_NUMBER_ID}
WHATSAPP_WEBHOOK_VERIFY_TOKEN=${config.WHATSAPP_WEBHOOK_VERIFY_TOKEN}

# ================================
# 📧 SENDGRID (EMAIL)
# ================================
SENDGRID_API_KEY=${config.SENDGRID_API_KEY}
SENDGRID_FROM_EMAIL=${config.SENDGRID_FROM_EMAIL}
SENDGRID_FROM_NAME=${config.SENDGRID_FROM_NAME}

# ================================
# 🏨 HOSTAWAY PMS
# ================================
HOSTAWAY_API_KEY=${config.HOSTAWAY_API_KEY || ''}
HOSTAWAY_USERNAME=${config.HOSTAWAY_USERNAME || ''}
HOSTAWAY_PASSWORD=${config.HOSTAWAY_PASSWORD || ''}

# ================================
# 🔐 SEGURANÇA
# ================================
JWT_SECRET=${config.JWT_SECRET}
WEBHOOK_SECRET=${config.WEBHOOK_SECRET}
ENCRYPTION_KEY=${config.ENCRYPTION_KEY}

# ================================
# 📱 TWILIO (SMS)
# ================================
TWILIO_ACCOUNT_SID=${config.TWILIO_ACCOUNT_SID || ''}
TWILIO_AUTH_TOKEN=${config.TWILIO_AUTH_TOKEN || ''}
TWILIO_PHONE_NUMBER=${config.TWILIO_PHONE_NUMBER || ''}

# ================================
# 🏨 BOOKING.COM
# ================================
BOOKING_USERNAME=${config.BOOKING_USERNAME || ''}
BOOKING_PASSWORD=${config.BOOKING_PASSWORD || ''}

# ================================
# 📊 MONITORAMENTO
# ================================
SENTRY_DSN=${config.SENTRY_DSN || ''}

# ================================
# ⚙️ CONFIGURAÇÕES AVANÇADAS
# ================================
DEBUG=false
LOG_LEVEL=error
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
`;

  // Filtrar valores vazios
  envContent = envContent.replace(/=\s*$/gm, '=');

  try {
    fs.writeFileSync('.env.local', envContent);
    log('✅ Arquivo .env.local criado com sucesso!', 'green');
  } catch (error) {
    log('❌ Erro ao criar .env.local:', 'red');
    console.error(error);
  }
}

function showNextSteps() {
  log('\n🎯 PRÓXIMOS PASSOS', 'bold');
  log('═══════════════════', 'blue');
  
  log('\n1. 🗄️ CONFIGURAR BANCO DE DADOS:', 'yellow');
  log('   npm run db:migrate');
  
  log('\n2. 🧪 TESTAR LOCALMENTE:', 'yellow');
  log('   npm run dev');
  
  log('\n3. 🏗️ BUILD PARA PRODUÇÃO:', 'yellow');
  log('   npm run build');
  
  log('\n4. 🚀 DEPLOY:', 'yellow');
  log('   npm install -g vercel');
  log('   vercel --prod');
  
  log('\n5. 🔗 CONFIGURAR WEBHOOKS:', 'yellow');
  log('   - Airbnb: https://sua-app.vercel.app/api/webhooks?platform=airbnb');
  log('   - WhatsApp: https://sua-app.vercel.app/api/webhooks?platform=whatsapp');
  
  log('\n6. 📧 VERIFICAR EMAILS:', 'yellow');
  log('   - Configure o domínio no SendGrid');
  log('   - Adicione registros DNS necessários');
  
  log('\n📚 DOCUMENTAÇÃO COMPLETA:', 'blue');
  log('   - README.md - Guia do usuário');
  log('   - DEVELOPER_GUIDE.md - Guia técnico');
  
  log('\n✅ Configuração concluída! Sua plataforma está pronta para produção.', 'green');
  log('\n💡 Dica: Execute "npm run type-check" antes do deploy para verificar erros.', 'blue');
}

// Verificar se é execução direta
if (require.main === module) {
  setupProduction().catch(console.error);
}

module.exports = { setupProduction };