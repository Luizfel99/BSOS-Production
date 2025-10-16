# 🔐 BSOS Production Configuration
# Preencha este arquivo conforme você configura cada serviço

## ✅ Vercel
- Status: ✅ Autenticado como luizfelipesantini99-1621

## 🗄️ Database (Neon)
- Status: 🔄 Configurando...
- URL para configurar: https://neon.tech
- ✅ Conectado! Agora criar projeto:
  1. ✅ Login com GitHub
  2. 🔄 Criar projeto "bsos-production" 
  3. 🔄 Escolher região US East (Ohio)
  4. 🔄 Copiar connection string

DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/bsos?sslmode=require

## 💳 Stripe (LIVE MODE)
- Status: ⏳ Pendente
- URL para configurar: https://dashboard.stripe.com
- ⚠️ IMPORTANTE: Mudar para LIVE MODE!
- Instruções:
  1. Login no Stripe
  2. Mudar toggle para "Live mode"
  3. Ir em Developers → API keys
  4. Copiar chaves live

STRIPE_PUBLISHABLE_KEY=pk_live_
STRIPE_SECRET_KEY=sk_live_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_

## 🔍 Sentry
- Status: ⏳ Pendente
- URL para configurar: https://sentry.io
- Instruções:
  1. Login com GitHub
  2. Criar projeto Next.js "bsos-production"
  3. Copiar DSN

SENTRY_DSN=https://
NEXT_PUBLIC_SENTRY_DSN=https://
SENTRY_ORG=
SENTRY_PROJECT=bsos-production

## 🔐 Secrets (Já Gerados)
JWT_SECRET=134921c7230b1e66089ae24f809a1ae4b1892830cd1da23e857dbb3e6c4cb9bd
WEBHOOK_SECRET=9ffbe9b63c0f7b9ecd6adeff7b96a106c987b483a3408a3ac440dd386a36fa2a
ENCRYPTION_KEY=33bffc07527d2a3b93835615a5c214e47ab610cf095aade4df36727ff1028c74

## 📝 Instruções:
1. Configure cada serviço usando os links acima
2. Cole as informações obtidas neste arquivo
3. Depois vamos transferir tudo para o Vercel Dashboard
4. E então fazer o deploy!

Tempo estimado: 10-15 minutos total