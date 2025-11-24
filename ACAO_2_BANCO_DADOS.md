# 🔍 AÇÃO #2 - VERIFICAÇÃO DO BANCO DE DADOS
**Status:** ✅ CONCLUÍDA  
**Data:** 24 de Novembro de 2025

---

## 📋 O QUE FOI FEITO

### ✅ 1. Análise das Migrações Existentes

**Migrações encontradas:**
```
✅ 20251109201419_init_user_autoincrement/
✅ init_entities_20251117_224611/
```

**Última migração (init_entities_20251117_224611) cria:**
- ✅ Enum `Role` (cleaner, supervisor, manager, owner, client, admin)
- ✅ Tabela `User` (com CUID, role enum, avatar, locale)
- ✅ Tabela `ResetToken`
- ✅ Tabela `VerificationCode`
- ✅ Indexes otimizados
- ✅ Foreign keys com CASCADE

### ✅ 2. Scripts de Verificação Criados

**`check-db-status.js`** - Diagnóstico completo do banco
- Testa conexão
- Lista tabelas existentes
- Verifica enums
- Conta registros em cada tabela
- Mostra histórico de migrações
- Identifica tabelas faltando

**`check-and-migrate.js`** - Aplica migrações automaticamente
- Verifica DATABASE_URL
- Gera Prisma Client
- Verifica status das migrações
- Aplica migrações pendentes
- Executa verificação final

### ✅ 3. Novos Scripts NPM Adicionados

```json
"db:check": "node check-db-status.js"
"db:migrate-check": "node check-and-migrate.js"
"db:status": "npx prisma migrate status"
```

---

## 🚀 COMO USAR

### Opção 1: Verificação Rápida
```bash
# Verificar status atual do banco (sem fazer alterações)
npm run db:check
```

**Saída esperada:**
```
🔍 VERIFICANDO STATUS DO BANCO DE DADOS
============================================================

1️⃣ Testando conexão com o banco...
✅ Conexão estabelecida com sucesso!

2️⃣ Verificando tabelas existentes...
✅ Encontradas 8 tabelas:
   - User
   - ResetToken
   - VerificationCode
   - Property
   - TeamMember
   - Task
   - UserPreference
   - _prisma_migrations

3️⃣ Verificando tipos enum...
✅ Encontrados 2 enums:
   - Role
   - TaskStatus

4️⃣ Contando registros...
✅ Users: X registros
✅ Properties: X registros
✅ Tasks: X registros
✅ TeamMembers: X registros

5️⃣ Verificando histórico de migrações...
✅ 2 migrações aplicadas

6️⃣ Verificando schema...
✅ Todas as tabelas esperadas existem!

============================================================
✅ DIAGNÓSTICO CONCLUÍDO!
🎉 Status: BANCO DE DADOS OK
```

### Opção 2: Verificar e Aplicar Migrações
```bash
# Verificar, gerar client e aplicar migrações pendentes
npm run db:migrate-check
```

**Este script faz tudo automaticamente:**
1. Verifica DATABASE_URL
2. Gera Prisma Client
3. Verifica status das migrações
4. Aplica migrações pendentes
5. Executa verificação final

### Opção 3: Apenas Status das Migrações
```bash
# Ver status sem aplicar nada
npm run db:status
```

### Opção 4: Comandos Prisma Diretos
```bash
# Gerar Prisma Client
npx prisma generate

# Ver status das migrações
npx prisma migrate status

# Aplicar migrações
npx prisma migrate deploy

# Criar nova migração (desenvolvimento)
npx prisma migrate dev --name nome_da_migracao

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Abrir Prisma Studio (GUI para ver dados)
npx prisma studio
```

---

## 🔄 PRÓXIMOS PASSOS RECOMENDADOS

### 1. Execute a verificação agora:
```bash
npm run db:check
```

### 2. Se houver tabelas faltando:
```bash
npm run db:migrate-check
```

### 3. Popular com dados demo:
```bash
npm run prisma:seed
```

**Ou seed completo (mais dados):**
```bash
npm run seed:full
```

### 4. Verificar dados no Prisma Studio:
```bash
npx prisma studio
# Abre em http://localhost:5555
```

---

## ⚠️ POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema 1: "Tabelas faltando"
**Causa:** Migrações não aplicadas  
**Solução:**
```bash
npx prisma migrate deploy
```

### Problema 2: "Erro de conexão"
**Causa:** DATABASE_URL incorreta ou banco inacessível  
**Solução:**
```bash
# Verificar DATABASE_URL
cat .env.local | grep DATABASE_URL

# Testar conexão
npx prisma db pull --force
```

### Problema 3: "Schema drift detected"
**Causa:** Schema.prisma diferente do banco  
**Solução:**
```bash
# Gerar nova migração
npx prisma migrate dev --name fix_schema_drift

# Ou resetar (CUIDADO: apaga dados!)
npx prisma migrate reset
```

### Problema 4: "Prisma Client not generated"
**Causa:** Prisma Client desatualizado  
**Solução:**
```bash
npx prisma generate
```

### Problema 5: Banco vazio mas migrações OK
**Causa:** Banco sem dados  
**Solução:**
```bash
npm run prisma:seed
```

---

## 📊 SCHEMA ESPERADO

### Tabelas que devem existir:
```
✅ User                 - Usuários do sistema
✅ ResetToken           - Tokens de reset de senha
✅ VerificationCode     - Códigos de verificação
✅ Property             - Propriedades/imóveis
✅ TeamMember           - Membros da equipe
✅ Task                 - Tarefas de limpeza
✅ UserPreference       - Preferências dos usuários
✅ _prisma_migrations   - Histórico de migrações
```

### Enums que devem existir:
```
✅ Role        - cleaner, supervisor, manager, owner, client, admin
✅ TaskStatus  - pending, in_progress, done, cancelled
```

---

## 🎯 CHECKLIST DE VERIFICAÇÃO

- [ ] Executar `npm run db:check`
- [ ] Verificar se todas as 8 tabelas existem
- [ ] Verificar se os 2 enums existem
- [ ] Aplicar migrações se necessário
- [ ] Popular com dados demo
- [ ] Testar login com usuário demo
- [ ] Verificar dados no Prisma Studio

---

## 📞 COMANDOS ÚTEIS

```bash
# Verificação completa
npm run db:check

# Aplicar migrações
npm run db:migrate-check

# Popular dados
npm run prisma:seed

# Ver dados
npx prisma studio

# Status
npm run db:status

# Gerar client
npx prisma generate

# Ver logs detalhados
DATABASE_URL="..." npx prisma migrate status --verbose
```

---

**✅ Ação #2 Concluída!**  
Scripts criados e prontos para uso. Execute `npm run db:check` para verificar o status atual do banco.
