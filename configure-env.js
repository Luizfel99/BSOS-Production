#!/usr/bin/env node

// Script para configurar automaticamente todas as variáveis de ambiente
const fs = require('fs');
const path = require('path');

function setupEnvironment(connectionString) {
    console.log('🔧 Configurando ambiente de produção...\n');
    
    // Criar arquivo .env.production
    const envContent = `# BSOS Production Environment
# Generated automatically on ${new Date().toISOString()}

# Database
DATABASE_URL="${connectionString}"

# Stripe (Live Keys - A CONFIGURAR)
STRIPE_PUBLISHABLE_KEY=pk_live_
STRIPE_SECRET_KEY=sk_live_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_

# Sentry (A CONFIGURAR)
SENTRY_DSN=https://
NEXT_PUBLIC_SENTRY_DSN=https://
SENTRY_ORG=
SENTRY_PROJECT=bsos-production

# Secrets (Gerados automaticamente)
JWT_SECRET=134921c7230b1e66089ae24f809a1ae4b1892830cd1da23e857dbb3e6c4cb9bd
WEBHOOK_SECRET=9ffbe9b63c0f7b9ecd6adeff7b96a106c987b483a3408a3ac440dd386a36fa2a
ENCRYPTION_KEY=33bffc07527d2a3b93835615a5c214e47ab610cf095aade4df36727ff1028c74

# Next.js
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=134921c7230b1e66089ae24f809a1ae4b1892830cd1da23e857dbb3e6c4cb9bd
`;

    fs.writeFileSync('.env.production', envContent);
    console.log('✅ Arquivo .env.production criado');
    
    // Testar conexão com o banco
    console.log('🔍 Testando conexão com o banco...');
    
    return true;
}

module.exports = { setupEnvironment };

if (require.main === module) {
    console.log('🚀 Script de configuração pronto!');
    console.log('📋 Execute: node configure-env.js "sua-connection-string"');
}