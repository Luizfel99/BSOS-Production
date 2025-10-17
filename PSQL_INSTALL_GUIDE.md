# 🗄️ PostgreSQL Client Installation Guide

## ❌ **PROBLEMA IDENTIFICADO:**
```
psql : The term 'psql' is not recognized...
```

## 🛠️ **SOLUÇÕES PARA INSTALAR PSQL:**

### **Opção 1: Via Chocolatey (Recomendado)**
```powershell
# 1. Instalar Chocolatey (se não tiver)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Instalar PostgreSQL Client
choco install postgresql --params '/Password:admin123'

# 3. Reiniciar terminal e testar
psql --version
```

### **Opção 2: Via Scoop**
```powershell
# 1. Instalar Scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# 2. Instalar PostgreSQL
scoop bucket add main
scoop install postgresql

# 3. Testar
psql --version
```

### **Opção 3: Download Manual**
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe "PostgreSQL 16 Windows Installer"
3. Execute o instalador
4. Marque apenas "Command Line Tools"
5. Adicione ao PATH: `C:\Program Files\PostgreSQL\16\bin`

### **Opção 4: Via Docker (Temporário)**
```powershell
# Se tiver Docker instalado
docker run -it --rm postgres:16 psql 'postgresql://neondb_owner:npg_HVOYn7PcxE1i@ep-autumn-shape-aep7i9x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

## ✅ **STATUS ATUAL DO BANCO:**

### **Nova Conexão Funcionando:**
```
DATABASE_URL="postgresql://neondb_owner:npg_HVOYn7PcxE1i@ep-autumn-shape-aep7i9x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### **Banco Atualizado:**
- ✅ **Conexão**: Funcionando
- ✅ **Schema**: 12 tabelas criadas
- ✅ **Prisma Client**: Gerado
- ✅ **Sincronização**: Completa

## 🚀 **COMANDOS FUNCIONAIS (Sem PSQL):**

```powershell
# Testar conexão
node scripts\test-db-connection.js

# Backup do banco
node scripts\backup-simple.js

# Aplicar mudanças no schema
npx prisma db push

# Abrir Prisma Studio (Interface gráfica)
npx prisma studio

# Gerar Prisma Client
npx prisma generate
```

## 📋 **APÓS INSTALAR PSQL:**

```sql
-- Conectar ao banco
psql 'postgresql://neondb_owner:npg_HVOYn7PcxE1i@ep-autumn-shape-aep7i9x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

-- Comandos úteis dentro do psql:
\dt                    -- Listar tabelas
\d+ properties         -- Descrever tabela properties
SELECT COUNT(*) FROM users; -- Contar usuários
\q                     -- Sair
```

## 💡 **RECOMENDAÇÃO IMEDIATA:**

1. **Continue sem psql** por enquanto - tudo está funcionando
2. **Use Prisma Studio** para interface gráfica: `npx prisma studio`
3. **Use nossos scripts** para backup e testes
4. **Instale psql depois** se precisar de acesso SQL direto

## 🎯 **O QUE FOI CORRIGIDO:**
- ✅ DATABASE_URL atualizada com nova conexão
- ✅ Schema aplicado com sucesso (12 tabelas)
- ✅ Prisma Client regenerado
- ✅ Banco sincronizado e funcionando