// BSOS Database Backup Script - Versão Simplificada
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createBackup() {
  console.log('🚀 Iniciando backup do banco BSOS...');
  
  try {
    // Verificar quais tabelas existem e fazer backup das disponíveis
    console.log('📊 Coletando dados das tabelas...');
    
    const backupData = {
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };

    // Tentar fazer backup de cada tabela individualmente
    const tables = ['user', 'property', 'task', 'taskNote', 'photo'];
    
    for (const table of tables) {
      try {
        console.log(`📄 Coletando dados da tabela: ${table}`);
        const data = await prisma[table].findMany();
        backupData[table + 's'] = data;
        console.log(`✅ ${table}: ${data.length} registros`);
      } catch (error) {
        console.log(`⚠️ Tabela ${table} não encontrada ou erro: ${error.message}`);
        backupData[table + 's'] = [];
      }
    }

    // Tentar tabelas adicionais
    const additionalTables = ['checklist', 'checklistTemplate', 'payment', 'subscription', 'webhookEvent', 'integration', 'statistic'];
    
    for (const table of additionalTables) {
      try {
        const data = await prisma[table].findMany();
        backupData[table + 's'] = data;
        console.log(`✅ ${table}: ${data.length} registros`);
      } catch (error) {
        console.log(`⚠️ Tabela ${table} não encontrada`);
        backupData[table + 's'] = [];
      }
    }

    // Criar nome do arquivo com data
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0]; // YYYY-MM-DDTHH-MM-SS
    const filename = `bsos_backup_${date}_${timestamp}.json`;
    const backupPath = path.join(process.cwd(), 'backup', filename);

    // Garantir que o diretório backup existe
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Escrever backup
    console.log('💾 Salvando backup...');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    // Estatísticas do backup
    const stats = fs.statSync(backupPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('✅ Backup concluído com sucesso!');
    console.log(`📁 Arquivo: ${filename}`);
    console.log(`📏 Tamanho: ${fileSizeMB} MB`);
    console.log(`📊 Estatísticas:`);
    
    // Contar registros
    let totalRecords = 0;
    Object.keys(backupData).forEach(key => {
      if (Array.isArray(backupData[key])) {
        const count = backupData[key].length;
        console.log(`   - ${key}: ${count} registros`);
        totalRecords += count;
      }
    });
    
    console.log(`📈 Total: ${totalRecords} registros`);

    return {
      success: true,
      filename,
      path: backupPath,
      size: fileSizeMB,
      totalRecords
    };

  } catch (error) {
    console.error('❌ Erro durante o backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar backup
if (require.main === module) {
  createBackup()
    .then((result) => {
      console.log('🎉 Backup finalizado com sucesso!');
      console.log(`📍 Local: ${result.path}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha no backup:', error);
      process.exit(1);
    });
}

module.exports = { createBackup };