#!/usr/bin/env node

const { Client } = require('pg');

async function testConnection() {
    console.log('🔍 Testando conexão com Neon Database...\n');
    
    const connectionString = "postgresql://neondb_owner:npg_tBvjOF67HqrI@ep-shy-paper-aeaaxu7j-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    
    const client = new Client({
        connectionString: connectionString
    });

    try {
        await client.connect();
        console.log('✅ Conexão bem-sucedida!');
        
        // Testar uma query simples
        const result = await client.query('SELECT version();');
        console.log('🎯 PostgreSQL Version:', result.rows[0].version);
        
        // Verificar se há tabelas
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        console.log(`📊 Tabelas encontradas: ${tables.rows.length}`);
        
        await client.end();
        
        console.log('\n🎉 DATABASE CONFIGURADO COM SUCESSO!');
        console.log('✅ Neon Database está funcionando perfeitamente');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error.message);
        return false;
    }
}

testConnection();