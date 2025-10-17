// Database Backup Script usando Prisma
// Este script cria um backup dos dados em formato JSON

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createBackup() {
  console.log('🚀 Iniciando backup do banco BSOS...');
  
  try {
    // Buscar todos os dados das tabelas principais
    console.log('📊 Coletando dados das tabelas...');
    
    const [
      users,
      properties, 
      tasks,
      taskNotes,
      photos,
      checklists,
      checklistTemplates,
      payments,
      subscriptions,
      webhookEvents,
      integrations,
      statistics
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.property.findMany(),
      prisma.task.findMany(),
      prisma.taskNote.findMany(),
      prisma.photo.findMany(),
      prisma.checklist.findMany(),
      prisma.checklistTemplate.findMany(),
      prisma.payment.findMany(),
      prisma.subscription.findMany(),
      prisma.webhookEvent.findMany(),
      prisma.integration.findMany(),
      prisma.statistic.findMany()
    ]);

    // Criar objeto de backup
    const backupData = {
      users,
      properties,
      tasks,
      taskNotes,
      photos,
      checklists,
      checklistTemplates,
      payments,
      subscriptions,
      webhookEvents,
      integrations,
      statistics,
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };

    // Criar nome do arquivo com data
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]; // YYYY-MM-DDTHH-MM-SS
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
    console.log(`   - Usuários: ${users.length}`);
    console.log(`   - Propriedades: ${properties.length}`);
    console.log(`   - Tarefas: ${tasks.length}`);
    console.log(`   - Notas: ${taskNotes.length}`);
    console.log(`   - Fotos: ${photos.length}`);
    console.log(`   - Checklists: ${checklists.length}`);
    console.log(`   - Templates: ${checklistTemplates.length}`);
    console.log(`   - Pagamentos: ${payments.length}`);

    return {
      success: true,
      filename,
      path: backupPath,
      size: fileSizeMB,
      records: {
        users: users.length,
        properties: properties.length,
        tasks: tasks.length,
        taskNotes: taskNotes.length,
        photos: photos.length,
        checklists: checklists.length,
        checklistTemplates: checklistTemplates.length,
        payments: payments.length
      }
    };

  } catch (error) {
    console.error('❌ Erro durante o backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar backup se chamado diretamente
if (require.main === module) {
  createBackup()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Falha no backup:', error);
      process.exit(1);
    });
}

export { createBackup };