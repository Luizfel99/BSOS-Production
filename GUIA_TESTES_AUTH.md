# 🔐 GUIA RÁPIDO - TESTES DE AUTENTICAÇÃO

## 🚀 Comandos Disponíveis

### 1. Criar Usuários Demo
```bash
npm run seed:demo
```
**O que faz:**
- Cria 6 usuários demo (admin, manager, supervisor, cleaner, client, owner)
- Senha padrão: `demo123`
- Pula se já existirem

### 2. Testar Autenticação Completa
```bash
npm run test:auth
```
**O que testa:**
- ✅ Servidor online
- ✅ Login de todos os 6 roles
- ✅ Geração de JWT
- ✅ Cookies httpOnly
- ✅ Rotas protegidas
- ✅ Login demo (desenvolvimento)

---

## 📋 Fluxo Recomendado

### Passo 1: Verificar Banco
```bash
npm run db:check
```

### Passo 2: Criar Usuários Demo (se necessário)
```bash
npm run seed:demo
```

### Passo 3: Iniciar Servidor
```bash
npm run dev
```

### Passo 4: Testar Autenticação
```bash
# Em outro terminal:
npm run test:auth
```

---

## 🎯 Resultados Esperados

### ✅ Sucesso Total:
```
🔐 TESTE COMPLETO DE AUTENTICAÇÃO - BSOS
====================================================================
URL: http://localhost:3020

1️⃣ Testando servidor...
✅ Servidor está online

2️⃣ Testando login de todos os roles...
✅ ADMIN      - Login OK
   ✅ Cookie auth_token definido
✅ MANAGER    - Login OK
   ✅ Cookie auth_token definido
✅ SUPERVISOR - Login OK
   ✅ Cookie auth_token definido
✅ CLEANER    - Login OK
   ✅ Cookie auth_token definido
✅ CLIENT     - Login OK
   ✅ Cookie auth_token definido
✅ OWNER      - Login OK
   ✅ Cookie auth_token definido

3️⃣ Resumo dos testes:
✅ Sucessos: 6/6
❌ Falhas: 0/6

4️⃣ Testando rota protegida...
✅ Rota protegida acessível com token
   User: Alice Admin (admin)

5️⃣ Testando login demo (sem senha)...
✅ Login demo funcionando para role: admin

====================================================================
🎉 TODOS OS TESTES PASSARAM!

💡 Próximos passos:
   1. Testar no navegador: http://localhost:3020/login
   2. Executar testes E2E: npm run test:e2e
```

---

## 🔴 Problemas Comuns

### Problema 1: Servidor não responde
```
❌ Servidor não está respondendo
💡 Inicie o servidor: npm run dev
```
**Solução:**
```bash
npm run dev
```

### Problema 2: Usuários não existem
```
❌ ADMIN      - Credenciais inválidas
❌ MANAGER    - Credenciais inválidas
```
**Solução:**
```bash
npm run seed:demo
# Ou
npm run prisma:seed
```

### Problema 3: JWT_SECRET não configurado
```
❌ Erro ao gerar token
```
**Solução:**
Verificar `.env.local` tem:
```bash
JWT_SECRET=sua_chave_forte_aqui
```

### Problema 4: Banco não conecta
```
❌ Erro de conexão com banco
```
**Solução:**
```bash
# Verificar DATABASE_URL
cat .env.local | grep DATABASE_URL

# Testar conexão
npm run db:check
```

---

## 🧪 Testes Manuais no Navegador

### 1. Abrir Login
```
http://localhost:3020/login
```

### 2. Testar Cada Role

| Role | Email | Senha | Dashboard Esperado |
|------|-------|-------|-------------------|
| Admin | admin@demo.bsos | demo123 | Dashboard completo |
| Manager | manager@demo.bsos | demo123 | Gestão de equipe |
| Supervisor | supervisor@demo.bsos | demo123 | Tarefas e supervisão |
| Cleaner | cleaner@demo.bsos | demo123 | Suas tarefas |
| Client | client@demo.bsos | demo123 | Visualização cliente |
| Owner | owner@demo.bsos | demo123 | Propriedades |

### 3. Verificar:
- ✅ Login bem-sucedido
- ✅ Redirect para dashboard
- ✅ Nome do usuário no header
- ✅ Menu adequado ao role
- ✅ Logout funciona

---

## 🛠️ Scripts Adicionais

### Testar APIs Diretamente

**Login:**
```bash
curl -X POST http://localhost:3020/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.bsos","password":"demo123"}'
```

**Me (verificar token):**
```bash
curl http://localhost:3020/api/auth/me \
  -H "Authorization: Bearer [SEU_TOKEN]"
```

**Logout:**
```bash
curl -X POST http://localhost:3020/api/auth/logout \
  -H "Cookie: auth_token=[SEU_TOKEN]"
```

---

## 📊 Checklist de Verificação

- [ ] Servidor rodando (`npm run dev`)
- [ ] Banco de dados conectado (`npm run db:check`)
- [ ] Usuários demo criados (`npm run seed:demo`)
- [ ] Testes de autenticação passando (`npm run test:auth`)
- [ ] Login manual funciona no navegador
- [ ] Todos os 6 roles testados
- [ ] Logout funciona
- [ ] Rotas protegidas funcionam
- [ ] JWT_SECRET configurado corretamente

---

## 🎯 Próximos Passos

Após todos os testes passarem:

1. **Testar E2E:**
```bash
npm run test:e2e
```

2. **Testar no mobile:**
```bash
# Abrir http://localhost:3020 no celular
# Ou seguir MOBILE_TESTING_GUIDE.md
```

3. **Build de produção:**
```bash
npm run build
npm start
```

4. **Deploy:**
```bash
# Seguir DEPLOYMENT_CHECKLIST.md
```

---

**Criado em:** 24/11/2025  
**Atualizado:** Scripts de teste automatizados disponíveis
