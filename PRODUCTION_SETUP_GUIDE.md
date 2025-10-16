# 🚀 BSOS Production Setup - Step-by-Step Guide

## 📋 Pre-Deployment Setup Instructions

### Step 1: Setup Production Database (PostgreSQL)

#### Option A: Neon (Recommended - Serverless PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub account
3. Create new project: "bsos-production"
4. Select region closest to your users
5. Copy the connection string format:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require
   ```

#### Option B: Supabase (PostgreSQL + Real-time features)
1. Go to [supabase.com](https://supabase.com)
2. Create new project: "bsos-production"
3. Wait for project initialization
4. Go to Settings → Database → Connection string
5. Copy connection string:
   ```
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   ```

#### Option C: Railway (Simple PostgreSQL)
1. Go to [railway.app](https://railway.app)
2. Sign up and create new project
3. Add PostgreSQL service
4. Copy DATABASE_URL from Variables tab

---

### Step 2: Setup Stripe Live Keys

#### ⚠️ IMPORTANT: Switch to Live Mode
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Toggle from "Test" to "Live" mode** (top-right switch)
3. Complete Stripe account verification if needed
4. Go to Developers → API keys
5. Copy the live keys:
   ```bash
   STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   ```

#### Setup Webhook Endpoint
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/finance/webhooks`
3. Select events: `invoice.*`, `payment_intent.*`, `charge.*`
4. Copy webhook secret:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

### Step 3: Setup Sentry Project

1. Go to [sentry.io](https://sentry.io)
2. Sign up/Login with GitHub
3. Create new project:
   - Platform: **Next.js**
   - Project name: **bsos-production**
4. Copy configuration:
   ```bash
   SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   SENTRY_ORG=your-org-name
   SENTRY_PROJECT=bsos-production
   ```
5. Generate Auth Token:
   - Go to Settings → Auth Tokens
   - Create new token with `project:write` scope
   ```bash
   SENTRY_AUTH_TOKEN=xxxxx
   ```

---

### Step 4: Generate Security Secrets

Run these commands to generate secure secrets:

```powershell
# Generate JWT Secret (32+ characters)
[System.Web.Security.Membership]::GeneratePassword(32, 8)

# Generate Webhook Secret
[System.Web.Security.Membership]::GeneratePassword(32, 8)

# Generate Encryption Key
[System.Web.Security.Membership]::GeneratePassword(32, 8)
```

---

## 🔧 Complete Environment Variables

Copy these to your `.env.local` for testing, then to Vercel Dashboard:

```bash
# ================================
# 🌐 APPLICATION SETTINGS
# ================================
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# ================================
# 🔐 SECURITY & AUTHENTICATION
# ================================
JWT_SECRET=your_generated_32_char_secret
WEBHOOK_SECRET=your_generated_webhook_secret
ENCRYPTION_KEY=your_generated_encryption_key

# ================================
# 🗄️ DATABASE CONFIGURATION
# ================================
DATABASE_URL=postgresql://[from_step_1]

# ================================
# 💳 STRIPE PAYMENT PROCESSING
# ================================
STRIPE_PUBLISHABLE_KEY=pk_live_[from_step_2]
STRIPE_SECRET_KEY=sk_live_[from_step_2]
STRIPE_WEBHOOK_SECRET=whsec_[from_step_2]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[from_step_2]

# ================================
# 🔍 ERROR TRACKING (SENTRY)
# ================================
SENTRY_DSN=https://[from_step_3]
NEXT_PUBLIC_SENTRY_DSN=https://[from_step_3]
SENTRY_ORG=your-org-name
SENTRY_PROJECT=bsos-production
SENTRY_AUTH_TOKEN=your_auth_token

# ================================
# ⚙️ PERFORMANCE & RATE LIMITING
# ================================
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
DEBUG=false

# ================================
# 📧 EMAIL SERVICE (OPTIONAL)
# ================================
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
SENDGRID_FROM_NAME=Bright & Shine
```

---

## 🚀 Deployment Commands

Once all services are configured:

```powershell
# 1. Final type check
npm run type-check

# 2. Test build locally
npm run build

# 3. Login to Vercel
vercel login

# 4. Deploy to production
vercel --prod

# Or use the configured script
npm run deploy:vercel
```

---

## ✅ Post-Deployment Verification

After deployment, test these endpoints:

```powershell
# Replace YOUR_DOMAIN with actual domain
$domain = "your-domain.vercel.app"

# Health check
Invoke-WebRequest -Uri "https://$domain/api/health"

# Status check
Invoke-WebRequest -Uri "https://$domain/api/status"

# Finance API (should return 401 without auth)
Invoke-WebRequest -Uri "https://$domain/api/finance/balance"
```

---

## 📊 Monitoring Setup

### Vercel Analytics
- Automatically enabled in production
- View at: [vercel.com/dashboard](https://vercel.com/dashboard)

### Sentry Error Tracking
- Monitor at: [sentry.io](https://sentry.io)
- Real-time error notifications
- Performance monitoring

### Custom Monitoring
```bash
# Check application health
curl https://your-domain.vercel.app/api/health

# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.vercel.app/
```

---

## 🛟 Troubleshooting

### Common Issues:

**Environment Variables Not Set:**
- Check Vercel Dashboard → Project → Settings → Environment Variables
- Ensure all variables are set for "Production" environment

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check database service status
- Ensure connection pooling is configured

**Stripe Webhook Issues:**
- Verify webhook URL matches deployed domain
- Check webhook secret matches
- Ensure endpoint is publicly accessible

**Build Failures:**
- Check Vercel Function Logs
- Verify all dependencies are in package.json
- Check for TypeScript errors

---

## 📞 Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Sentry Documentation**: [docs.sentry.io](https://docs.sentry.io)
- **Neon Documentation**: [neon.tech/docs](https://neon.tech/docs)

---

**Ready to deploy? Follow each step carefully and you'll have BSOS running in production! 🎯**