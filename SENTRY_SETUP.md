🔍 SENTRY - Configuração Rápida (5 minutos)
==========================================

📋 PASSO A PASSO SENTRY:

1️⃣ ACESSE: https://sentry.io/signup/
   ✅ Clique em "TRY SENTRY FOR FREE"
   ✅ Login com GitHub (mesma conta do Vercel)

2️⃣ CRIAR PROJETO:
   🎯 Platform: "Next.js" 
   📝 Project Name: "bsos-production"
   🏢 Team: (pode deixar o padrão)

3️⃣ OBTER DSN:
   Após criar o projeto, você verá uma tela com:
   
   📋 DSN (Data Source Name):
   https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   
   👆 COPIE essa URL completa!

4️⃣ CONFIGURAÇÃO NO CÓDIGO (já aplicada):
   Estes arquivos já estão no repositório e habilitam o tracking:
   ✅ `sentry.client.config.ts` (browser + replays opcionais)
   ✅ `sentry.server.config.ts` (rotas e SSR)
   ✅ `sentry.edge.config.ts` (middleware/edge runtime)
   
   Observação: não habilitamos upload automático de source maps ainda. 
   Podemos ativar depois via `withSentryConfig` no `next.config.*` e token de auth.

5️⃣ VARIÁVEIS DE AMBIENTE:
   Adicione no `.env.local`:
   
   ```bash
   SENTRY_DSN=<seu_dsn_completo>
   NEXT_PUBLIC_SENTRY_DSN=<seu_dsn_completo>
   SENTRY_ENVIRONMENT=development
   SENTRY_TRACES_SAMPLE_RATE=0.2
   SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.0
   SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0
   ```

   Dica: em produção, ajuste `SENTRY_ENVIRONMENT=production`.

💡 ALTERNATIVA SUPER RÁPIDA:
   Se quiser pular o Sentry, posso usar um DSN fictício
   e configuramos depois!

🎯 PRÓXIMO PASSO:
   Assim que colarmos o DSN, subimos o ambiente e validamos eventos no Sentry.
   Upload de source maps já está preparado via `withSentryConfig` no `next.config.js`.

📦 Upload de Source Maps (Produção)

1. Configure variáveis no provedor (Vercel/CI):
   - `SENTRY_AUTH_TOKEN` (escopo: project:releases, org:read, project:read)
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`

2. Build e deploy normalmente. O plugin do Sentry fará o upload automático dos source maps.

3. Opcional: Habilite `productionBrowserSourceMaps=true` no `next.config.js` se quiser gerar source maps locais; não é necessário para upload.
 
## 🧪 Testes rápidos

Com o projeto rodando, gere eventos de teste:

- Client error (browser):
   - Abra: `/debug/sentry`
   - Clique em: "Throw Client Error" ou "Unhandled Rejection"

- API error (server):
   - Acesse: `/api/sentry-test` (GET)
   - Resultado: 500 esperado e evento no Sentry

Se os eventos não aparecerem:
- Verifique `SENTRY_DSN` e `NEXT_PUBLIC_SENTRY_DSN`
- Confirme que o projeto/ambiente correto está selecionado no Sentry