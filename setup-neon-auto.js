#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

console.log('🚀 BSOS - Configuração Automática do Neon Database');
console.log('================================================\n');

console.log('📋 Vou te guiar passo a passo para configurar o Neon Database:\n');

console.log('1️⃣ Abra uma nova aba no navegador: https://neon.tech');
console.log('2️⃣ Faça login com sua conta GitHub');
console.log('3️⃣ Clique em "Create a project"');
console.log('4️⃣ Configure o projeto:');
console.log('   • Project name: bsos-production');
console.log('   • Database name: bsos (padrão)');
console.log('   • Region: US East (Ohio)');
console.log('   • Postgres version: 16\n');

console.log('5️⃣ Após criar o projeto, você verá uma CONNECTION STRING assim:');
console.log('   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/bsos?sslmode=require\n');

console.log('6️⃣ COPIE essa connection string completa');
console.log('7️⃣ COLE aqui quando estiver pronta!\n');

console.log('💡 Dica: A connection string contém username, password e host únicos para seu projeto.');
console.log('⏱️  Tempo estimado: 3-5 minutos\n');

console.log('✅ Quando tiver a connection string, me avise que vou configurar automaticamente!');