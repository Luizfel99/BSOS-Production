# 🗄️ BSOS Database Configuration Guide

## 📊 **STATUS ATUAL:**
- **✅ Banco Principal**: `neondb` - 12 tabelas, funcionando
- **❌ Banco Dev**: `bsos-dev-branch` - não existe ainda

## 🔧 **CONFIGURAÇÃO DATABASE_URL:**

### **Opção 1: Banco Principal (Atual - Recomendado)**
```bash
DATABASE_URL="postgresql://neondb_owner:npg_tBvjOF67HqrI@ep-silent-rain-aegbxv5l-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
```

### **Opção 2: Banco Dev (Futuro - Quando criado)**
```bash
DATABASE_URL="postgresql://neondb_owner:npg_tBvjOF67HqrI@ep-silent-rain-aegbxv5l-pooler.c-2.us-east-2.aws.neon.tech/bsos-dev-branch?channel_binding=require&sslmode=require"
```

## 🏗️ **PARA CRIAR BANCO DE DESENVOLVIMENTO:**

### **1. Via Neon Console:**
1. Acesse: https://console.neon.tech
2. Selecione seu projeto BSOS
3. Vá em **Databases** → **Create Database**
4. Nome: `bsos-dev-branch`
5. Owner: `neondb_owner` (mesmo usuário)

### **2. Via SQL (Alternativo):**
```sql
-- Conectar ao banco principal e executar:
CREATE DATABASE "bsos-dev-branch" OWNER neondb_owner;
```

### **3. Após criar o banco dev:**
```bash
# 1. Atualizar .env para usar banco dev
DATABASE_URL="postgresql://...../bsos-dev-branch?....."

# 2. Aplicar schema no novo banco
npx prisma db push

# 3. Testar conexão
node scripts/test-db-connection.js
```

## 🔄 **MIGRAÇÃO DE DADOS (SE NECESSÁRIO):**

### **Backup do banco principal:**
```bash
node scripts/backup-simple.js
```

### **Restaurar no banco dev:**
```bash
# Após criar o banco dev e aplicar schema
node scripts/restore-backup.js backup/bsos_backup_2025-10-16.json
```

## 🎯 **CONFIGURAÇÃO RECOMENDADA:**

### **Arquivo .env atual (Seguro):**
```env
# BSOS Database (Production/Main)
DATABASE_URL="postgresql://neondb_owner:npg_tBvjOF67HqrI@ep-silent-rain-aegbxv5l-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# BSOS Development Branch (Uncomment after creating database)
# DATABASE_URL="postgresql://neondb_owner:npg_tBvjOF67HqrI@ep-silent-rain-aegbxv5l-pooler.c-2.us-east-2.aws.neon.tech/bsos-dev-branch?channel_binding=require&sslmode=require"
```

### **Para alternar entre bancos:**
```bash
# Testar ambas as conexões
node scripts/test-db-connection.js

# Para usar banco dev (quando disponível):
# 1. Comente linha do banco principal
# 2. Descomente linha do banco dev
# 3. Execute: npx prisma db push
```

## 🛡️ **BOAS PRÁTICAS:**

1. **Desenvolvimento**: Use banco `bsos-dev-branch` quando disponível
2. **Produção**: Mantenha banco `neondb` para produção
3. **Backup**: Sempre faça backup antes de mudanças
4. **Testes**: Use `test-db-connection.js` para verificar conexões
5. **Schema**: Use `prisma db push` para aplicar mudanças de schema

## ⚡ **COMANDOS ÚTEIS:**

```bash
# Testar conexão atual
node scripts/test-db-connection.js

# Backup do banco atual  
node scripts/backup-simple.js

# Aplicar schema no banco
npx prisma db push

# Ver status do banco
npx prisma studio

# Reset completo do banco (CUIDADO!)
npx prisma migrate reset
```

## 📋 **STATUS ATUAL DO PROJETO:**

✅ **Banco Principal**: 12 tabelas criadas e funcionando
- ✅ users, properties, tasks, task_notes, photos
- ✅ checklists, checklist_templates, payments 
- ✅ subscriptions, webhook_events, integrations, statistics

🔄 **Próximo Passo**: Criar banco `bsos-dev-branch` no Neon Console