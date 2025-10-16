#!/usr/bin/env node

console.log('🎯 BSOS - Configuração Neon Database');
console.log('=====================================\n');

console.log('✅ Projeto detectado: broad-lake-93265094');
console.log('📍 URL: https://console.neon.tech/app/projects/broad-lake-93265094\n');

console.log('🔍 Para obter a connection string:');
console.log('1. No seu dashboard Neon (já aberto)');
console.log('2. Procure por "Connection Details" ou "Connect"');
console.log('3. Copie a string que começa com: postgresql://');
console.log('4. Cole aqui a connection string completa\n');

console.log('📋 Exemplo do formato:');
console.log('postgresql://username:password@ep-broad-lake-93265094.us-east-1.aws.neon.tech/bsos?sslmode=require\n');

// Auto-configurar com dados conhecidos
const projectInfo = {
    id: 'broad-lake-93265094',
    region: 'us-east-1',
    host: `ep-broad-lake-93265094.us-east-1.aws.neon.tech`
};

console.log('🚀 Quando você tiver a connection string, execute:');
console.log('node configure-env.js "SUA_CONNECTION_STRING_AQUI"');
console.log('\n⚡ Ou simplesmente cole a connection string aqui no chat!');