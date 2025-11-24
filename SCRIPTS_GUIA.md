# 🛠️ SCRIPTS DE DIAGNÓSTICO E TESTE - BSOS

## 📋 Índice Rápido

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Diagnóstico Completo** | `npm run diagnostics` | Executa todos os diagnósticos |
| **Verificar Banco** | `npm run db:check` | Status do banco de dados |
| **Testar Autenticação** | `npm run test:auth` | Testa todos os logins |
| **Criar Usuários Demo** | `npm run seed:demo` | Cria 6 usuários demo |
| **Migrar Banco** | `npm run db:migrate-check` | Aplica migrações |

---

## 🚀 Uso Rápido

### 1️⃣ Primeiro Uso (Setup Inicial)

```bash
# Executar diagnóstico completo
npm run diagnostics
```

Este comando faz TUDO automaticamente:
- ✅ Verifica arquivos essenciais
- ✅ Verifica variáveis de ambiente
- ✅ Instala dependências (se necessário)
- ✅ Gera Prisma Client
- ✅ Verifica banco de dados
- ✅ Cria usuários demo
- ✅ Testa autenticação (se servidor estiver rodando)

### 2️⃣ Desenvolvimento Diário

```bash
# Terminal 1: Iniciar servidor
npm run dev

# Terminal 2: Testar autenticação
npm run test:auth
```

---

## 🔍 Scripts Detalhados

### Diagnóstico

#### `npm run diagnostics`
**Diagnóstico completo do sistema**

Executa em sequência:
1. Verifica arquivos essenciais (.env.local, schema.prisma, etc)
2. Verifica variáveis de ambiente
3. Instala dependências se necessário
4. Gera Prisma Client
5. Verifica status do banco
6. Cria usuários demo
7. Testa autenticação (se servidor estiver rodando)

**Saída esperada:**
```
🔍 DIAGNÓSTICO COMPLETO DO SISTEMA BSOS
====================================================================

📋 1. Verificando arquivos essenciais...
✅ .env.local existe
✅ Schema Prisma existe
✅ package.json existe
✅ API de login existe

🔐 2. Verificando variáveis de ambiente...
✅ Database URL configurado
✅ JWT Secret configurado

📦 3. Verificando dependências...
✅ node_modules existe

4. Gerando Prisma Client
✅ Gerando Prisma Client - CONCLUÍDO

5. Verificando banco de dados
✅ Verificando banco de dados - CONCLUÍDO

📝 6. Criando usuários demo...
✅ Criando usuários demo - CONCLUÍDO

====================================================================
✅ DIAGNÓSTICO COMPLETO!
====================================================================

🚀 Próximos Passos:
   1. Iniciar servidor: npm run dev
   2. Testar autenticação: npm run test:auth
   3. Acessar: http://localhost:3020/login
   4. Login: admin@demo.bsos / demo123
```

---

### Banco de Dados

#### `npm run db:check`
**Verifica status do banco sem fazer alterações**

Mostra:
- ✅ Status da conexão
- ✅ Tabelas existentes
- ✅ Enums (Role, TaskStatus)
- ✅ Contagem de registros
- ✅ Histórico de migrações
- ✅ Tabelas faltando (se houver)

**Exemplo:**
```bash
npm run db:check
```

#### `npm run db:migrate-check`
**Aplica migrações pendentes**

Faz:
1. Verifica DATABASE_URL
2. Gera Prisma Client
3. Verifica status das migrações
4. Aplica migrações pendentes
5. Verifica banco novamente

**Exemplo:**
```bash
npm run db:migrate-check
```

#### `npm run db:status`
**Ver apenas status das migrações (Prisma CLI)**

```bash
npm run db:status
```

---

### Autenticação

#### `npm run test:auth`
**Testa autenticação completa**

Testa:
- ✅ Servidor online
- ✅ Login de 6 roles (admin, manager, supervisor, cleaner, client, owner)
- ✅ Geração de JWT
- ✅ Cookies httpOnly
- ✅ Rotas protegidas (/api/auth/me)
- ✅ Login demo (desenvolvimento)

**Saída esperada:**
```
🔐 TESTE COMPLETO DE AUTENTICAÇÃO - BSOS
====================================================================

1️⃣ Testando servidor...
✅ Servidor está online

2️⃣ Testando login de todos os roles...
✅ ADMIN      - Login OK
   ✅ Cookie auth_token definido
✅ MANAGER    - Login OK
   ✅ Cookie auth_token definido
...

3️⃣ Resumo dos testes:
✅ Sucessos: 6/6
❌ Falhas: 0/6

4️⃣ Testando rota protegida...
✅ Rota protegida acessível com token

🎉 TODOS OS TESTES PASSARAM!
```

**Requisitos:**
- Servidor deve estar rodando (`npm run dev`)
- Usuários demo devem existir (`npm run seed:demo`)

---

### Dados Demo

#### `npm run seed:demo`
**Cria apenas os 6 usuários demo**

Cria:
- admin@demo.bsos (Admin)
- manager@demo.bsos (Manager)
- supervisor@demo.bsos (Supervisor)
- cleaner@demo.bsos (Cleaner)
- client@demo.bsos (Client)
- owner@demo.bsos (Owner)

Senha: `demo123`

**Exemplo:**
```bash
npm run seed:demo
```

**Saída:**
```
🔧 Verificando e criando usuários demo...

✅ admin      - Criado (admin@demo.bsos)
✅ manager    - Criado (manager@demo.bsos)
✅ supervisor - Criado (supervisor@demo.bsos)
✅ cleaner    - Criado (cleaner@demo.bsos)
✅ client     - Criado (client@demo.bsos)
✅ owner      - Criado (owner@demo.bsos)

============================================================
📊 Resumo:
   ✅ Criados: 6
   ⏭️  Já existiam: 0
   📝 Total: 6
============================================================
```

#### `npm run prisma:seed`
**Seed completo do banco (users + properties + tasks + team)**

```bash
npm run prisma:seed
```

#### `npm run seed:full`
**Seed com mais dados (maior quantidade)**

```bash
npm run seed:full
```

---

## 🔧 Scripts de Desenvolvimento

### Servidor

```bash
# Desenvolvimento normal
npm run dev

# Com Turbopack (mais rápido)
npm run dev:fast

# Com mais memória
npm run dev:turbo

# Reiniciar servidor
npm run restart

# Matar processo na porta 3020
npm run port:kill
```

### Build e Testes

```bash
# Build de produção
npm run build

# Typecheck
npm run typecheck

# Lint
npm run lint

# Testes E2E
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

---

## 📊 Fluxo de Trabalho Recomendado

### Setup Inicial (Primeira Vez)

```bash
# 1. Clonar repositório
git clone [repo]
cd BSOS-Production

# 2. Copiar .env
cp .env.example .env.local
# Editar .env.local com suas credenciais

# 3. Executar diagnóstico completo
npm run diagnostics

# 4. Iniciar servidor
npm run dev

# 5. Testar autenticação
npm run test:auth

# 6. Acessar http://localhost:3020/login
```

### Desenvolvimento Diário

```bash
# Terminal 1: Servidor
npm run dev

# Terminal 2: Testes (quando necessário)
npm run test:auth
npm run db:check
```

### Antes de Commit

```bash
# Verificar erros
npm run typecheck
npm run lint

# Executar testes
npm run test:auth
npm run test:e2e:nobanner
```

### Antes de Deploy

```bash
# 1. Build local
npm run build

# 2. Testar build
npm start

# 3. Verificar banco de produção
DATABASE_URL="[prod_url]" npm run db:check

# 4. Aplicar migrações
DATABASE_URL="[prod_url]" npx prisma migrate deploy

# 5. Seed (se necessário)
DATABASE_URL="[prod_url]" npm run seed:demo
```

---

## 🐛 Troubleshooting

### Problema: "Servidor não está respondendo"

```bash
# Verificar se porta está em uso
npm run who-owns-port

# Matar processo
npm run port:kill

# Iniciar novamente
npm run dev
```

### Problema: "Banco de dados não conecta"

```bash
# Verificar DATABASE_URL
cat .env.local | grep DATABASE_URL

# Testar conexão
npm run db:check

# Aplicar migrações
npm run db:migrate-check
```

### Problema: "Usuários demo não existem"

```bash
npm run seed:demo
```

### Problema: "Testes de autenticação falham"

```bash
# 1. Verificar servidor
curl http://localhost:3020/api/status

# 2. Criar usuários
npm run seed:demo

# 3. Testar novamente
npm run test:auth
```

### Problema: "Prisma Client desatualizado"

```bash
npx prisma generate
```

---

## 📚 Documentação Relacionada

- `DIAGNOSTICO_COMPLETO.md` - Diagnóstico detalhado do sistema
- `GUIA_TESTES_AUTH.md` - Guia completo de testes de autenticação
- `ACAO_2_BANCO_DADOS.md` - Verificação detalhada do banco
- `DEPLOYMENT_CHECKLIST.md` - Checklist de deploy
- `TROUBLESHOOTING.md` - Soluções de problemas

---

## 🎯 Comandos Mais Usados

```bash
# 🔍 Diagnóstico
npm run diagnostics        # Tudo de uma vez

# 🗄️ Banco de Dados
npm run db:check           # Status rápido
npm run seed:demo          # Criar usuários

# 🔐 Autenticação
npm run test:auth          # Testar login

# 🚀 Desenvolvimento
npm run dev                # Iniciar servidor
npm run build              # Build produção
```

---

**Atualizado:** 24/11/2025  
**Versão:** 2.0.0 com scripts de diagnóstico automatizados
