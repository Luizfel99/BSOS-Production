# 🔧 VERCEL ENVIRONMENT VARIABLES SETUP GUIDE

## Como adicionar variáveis de ambiente no Vercel:

### Passo 1: Acesse o projeto no Vercel
1. Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto BSOS

### Passo 2: Navegue até Settings
1. Clique na aba **"Settings"**
2. No menu lateral, clique em **"Environment Variables"**

### Passo 3: Adicione CADA variável INDIVIDUALMENTE
**⚠️ IMPORTANTE: Adicione UMA variável por vez, não cole tudo junto!**

#### Variável 1: DATABASE_URL
- **Key:** `DATABASE_URL`
- **Value:** `postgresql://neondb_owner:npg_HVOYn7PcxE1i@ep-autumn-shape-aep7i9x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Environment:** Production, Preview, Development
- Clique **"Save"**

#### Variável 2: NEXTAUTH_SECRET
- **Key:** `NEXTAUTH_SECRET`
- **Value:** `4b90a80e320d18e75665fb7c7837aacccb906560fa45d4089b4f1298c1cf1a4a`
- **Environment:** Production, Preview, Development
- Clique **"Save"**

#### Variável 3: NEXTAUTH_URL
- **Key:** `NEXTAUTH_URL`
- **Value:** `https://SEU-PROJETO.vercel.app` (substitua pelo seu domínio real)
- **Environment:** Production, Preview, Development
- Clique **"Save"**

#### Variável 4: NODE_ENV
- **Key:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production
- Clique **"Save"**

#### Variável 5: STRIPE_SECRET_KEY
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_placeholder_for_build` (substitua pela sua chave real)
- **Environment:** Production, Preview, Development
- Clique **"Save"**

#### Variável 6: STRIPE_PUBLISHABLE_KEY
- **Key:** `STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_placeholder_for_build` (substitua pela sua chave real)
- **Environment:** Production, Preview, Development
- Clique **"Save"**

#### Variável 7: STRIPE_WEBHOOK_SECRET
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_placeholder_for_build` (substitua pela sua chave real)
- **Environment:** Production, Preview, Development
- Clique **"Save"**

### Passo 4: Redeploy
1. Vá para a aba **"Deployments"**
2. Clique nos 3 pontos (...) do deployment mais recente
3. Clique em **"Redeploy"**
4. Aguarde o deploy completar

## ✅ Checklist:
- [ ] DATABASE_URL adicionada
- [ ] NEXTAUTH_SECRET adicionada
- [ ] NEXTAUTH_URL adicionada (com domínio correto)
- [ ] NODE_ENV adicionada
- [ ] STRIPE_SECRET_KEY adicionada
- [ ] STRIPE_PUBLISHABLE_KEY adicionada
- [ ] STRIPE_WEBHOOK_SECRET adicionada
- [ ] Redeploy executado

## 🔑 Valores já prontos para usar:

```
DATABASE_URL=postgresql://neondb_owner:npg_HVOYn7PcxE1i@ep-autumn-shape-aep7i9x9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_SECRET=4b90a80e320d18e75665fb7c7837aacccb906560fa45d4089b4f1298c1cf1a4a

NODE_ENV=production

STRIPE_SECRET_KEY=sk_test_placeholder_for_build
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_for_build
STRIPE_WEBHOOK_SECRET=whsec_placeholder_for_build
```

**Lembre-se de atualizar NEXTAUTH_URL com seu domínio real após o deploy!**