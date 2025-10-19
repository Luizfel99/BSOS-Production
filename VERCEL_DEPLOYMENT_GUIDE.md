#  BSOS VERCEL DEPLOYMENT GUIDE

##  PRE-DEPLOYMENT CHECKLIST

###  1. Repository Ready
- [x] Code pushed to: https://github.com/Luizfel99/BSOS-Production.git
- [x] Branch: main
- [x] All dependencies in package.json
- [x] Build verified locally

###  2. Database Setup (Choose One)

#### Option A: Neon (Recommended - Free Tier)
```bash
# 1. Go to https://neon.tech
# 2. Create account and new project
# 3. Copy connection string
# Format: postgresql://username:password@ep-xxx.region.neon.tech/database_name?sslmode=require
```

#### Option B: Supabase
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Go to Settings > Database
# 4. Copy connection string
# Format: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

#### Option C: Railway
```bash
# 1. Go to https://railway.app
# 2. Create PostgreSQL service
# 3. Copy connection string
# Format: postgresql://postgres:password@containers-us-west-x.railway.app:5432/railway
```

##  VERCEL DEPLOYMENT STEPS

### Step 1: Import Repository
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub: `Luizfel99/BSOS-Production`
4. Configure project settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Step 2: Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:

```bash
# Database (Required)
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Authentication (Required)
NEXTAUTH_SECRET=your-generated-32-char-secret
NEXTAUTH_URL=https://your-app-name.vercel.app

# Stripe (Required)
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Environment
NODE_ENV=production
```

### Step 3: Generate NEXTAUTH_SECRET
```bash
# Run this command to generate a secure secret:
openssl rand -base64 32

# Or use online generator:
# https://generate-secret.vercel.app/32
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be available at: `https://your-app-name.vercel.app`

##  DATABASE INITIALIZATION

After deployment, initialize your database:

```bash
# Option 1: Use Vercel CLI (Recommended)
npx vercel env pull .env.local
npm install
npx prisma db push
npx prisma generate

# Option 2: Direct connection
# Use your DATABASE_URL to connect via psql or database GUI
# Run the schema.prisma migrations manually
```

##  POST-DEPLOYMENT CONFIGURATION

### 1. Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-app-name.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `invoice.payment_succeeded`
4. Copy webhook secret to STRIPE_WEBHOOK_SECRET

### 2. Custom Domain (Optional)
1. In Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Update NEXTAUTH_URL to your custom domain

### 3. Environment Variables Update
Update these after deployment:
```bash
NEXTAUTH_URL=https://your-custom-domain.com  # or vercel domain
VERCEL_URL=auto-populated-by-vercel
```

##  TESTING DEPLOYMENT

### Quick Tests:
1.  Homepage loads: `https://your-app.vercel.app`
2.  API health check: `https://your-app.vercel.app/api/health`
3.  Database connection: Check console for errors
4.  Authentication: Try login flow
5.  Navigation: Test SURGICAL MODE navigation

### Debugging:
- Check Vercel Function Logs for errors
- Use Vercel CLI: `vercel logs your-app-name`
- Monitor database connections in your provider dashboard

##  SECURITY CHECKLIST

- [x] All secrets in environment variables (not in code)
- [x] DATABASE_URL uses SSL (sslmode=require for Neon)
- [x] NEXTAUTH_SECRET is random and secure
- [x] Stripe keys are LIVE keys (not test) for production
- [x] CORS settings configured for your domain
- [x] Rate limiting enabled for API routes

##  MONITORING

### Optional: Add Sentry for Error Tracking
```bash
# Add to environment variables:
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Sentry will automatically capture errors in production
```

##  DEPLOYMENT COMMANDS

```bash
# Local development with production data:
cp .env.example .env.local
# Edit .env.local with your credentials
npm install
npx prisma generate
npm run dev

# Force redeploy on Vercel:
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

##  SUPPORT

If you encounter issues:
1. Check Vercel build logs
2. Verify all environment variables are set
3. Test database connection separately
4. Check Prisma schema compatibility

**Status:** Ready for Production Deployment 
**Expected Deploy Time:** 2-5 minutes
**Post-Deploy Setup:** 10-15 minutes

---
*Generated for BSOS Production - SURGICAL MODE Complete*
