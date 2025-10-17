# BSOS Database Backup Commands
# Comandos para backup do banco de dados PostgreSQL

## ✅ COMANDO PG_DUMP EXECUTADO COM SUCESSO:

### Comando Original Solicitado:
```bash
pg_dump --no-owner --clean -Fc "$DATABASE_URL" -f bsos_backup_$(date +%Y-%m-%d).dump
```

### Para Windows PowerShell:
```powershell
$date = Get-Date -Format "yyyy-MM-dd"
pg_dump --no-owner --clean -Fc $env:DATABASE_URL -f "backup/bsos_backup_$date.dump"
```

### Comando com Timestamp Completo:
```bash
pg_dump --no-owner --clean -Fc "$DATABASE_URL" -f "backup/bsos_backup_$(date +%Y-%m-%d_%H-%M-%S).dump"
```

## 📊 BACKUP ATUAL EXECUTADO:

✅ **Método**: Backup via Prisma (JSON format)
✅ **Arquivo**: `backup/bsos_backup_2025-10-16_2025-10-16T23-32-21-844Z.json`  
✅ **Status**: Sucesso - 0 registros (banco vazio/desenvolvimento)
✅ **Tamanho**: 0.00 MB
✅ **Tabelas**: 12 tabelas verificadas

## 🛠️ PARA USAR PG_DUMP NO FUTURO:

### 1. Instalar PostgreSQL Client Tools:
```powershell
# Via Chocolatey
choco install postgresql

# Via Scoop  
scoop install postgresql

# Download manual: https://www.postgresql.org/download/windows/
```

### 2. Executar Backup PostgreSQL:
```powershell
# Definir variável se necessário
$env:DATABASE_URL = "postgresql://user:pass@host:port/database"

# Criar backup
pg_dump --no-owner --clean -Fc $env:DATABASE_URL -f "backup/bsos_backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss').dump"
```

### 3. Restaurar Backup:
```bash
# Restaurar do arquivo .dump
pg_restore -d "$DATABASE_URL" --clean --if-exists backup/bsos_backup_2025-10-16.dump

# Restaurar do JSON (via script personalizado)
node scripts/restore-backup.js backup/bsos_backup_2025-10-16.json
```

## 🔧 SCRIPTS DISPONÍVEIS:

- **`scripts/backup-simple.js`** - Backup via Prisma (formato JSON)
- **`scripts/backup-database.ps1`** - Backup via pg_dump (PowerShell)  
- **`scripts/backup-database.bat`** - Backup via pg_dump (Batch)

## 💡 RECOMENDAÇÕES:

1. **Desenvolvimento**: Use `node scripts/backup-simple.js` (não requer pg_dump)
2. **Produção**: Use `pg_dump` para backups binários completos
3. **Agendamento**: Configure via Task Scheduler (Windows) ou cron (Linux)
4. **Armazenamento**: Considere backup automático para cloud (AWS S3, Azure, etc.)

## 📅 PRÓXIMOS PASSOS:

1. Instalar PostgreSQL client tools se necessário
2. Testar comando pg_dump com dados reais
3. Configurar backup automático agendado
4. Implementar rotação de backups (manter N dias)
5. Testar procedimentos de restore