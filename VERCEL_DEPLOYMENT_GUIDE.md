#  BSOS VERCEL DEPLOYMENT GUIDE - UPDATED

##  PRE-DEPLOYMENT CHECKLIST

###  1. Repository Ready
- [x] Code pushed to: https://github.com/Luizfel99/BSOS-Production.git
- [x] Branch: main
- [x] All dependencies in package.json
- [x] Build verified locally

###  2. Project Names Available
Since "bsos-production" is taken, use one of these alternatives:
- **bsos-platform-2025** (recommended - set in vercel.json)
- bsos-cleaning-management
- bsos-app-luizfel99
- cleaning-management-bsos
- bsos-surgical-mode

###  3. Database Setup (Choose One)

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

##  VERCEL DEPLOYMENT STEPS - UPDATED

### Step 1: Import Repository
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub: `Luizfel99/BSOS-Production`
4. **IMPORTANT:** When asked for project name, use:
   - `bsos-platform-2025` (recommended)
   - OR any other available name from the list above
5. Configure project settings:
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
NEXTAUTH_URL=https://bsos-platform-2025.vercel.app

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

# Example generated secret:
# 9lF/gr7g508D08RMN99VOBX4/Ayv7U+QUYGyXi/hHFE=
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your app will be available at: `https://bsos-platform-2025.vercel.app`
4. Or your chosen project name: `https://your-project-name.vercel.app`

##  DATABASE INITIALIZATION

After successful deployment, initialize your database:

```bash
# Option 1: Use Vercel CLI (Recommended)
npm install -g vercel
vercel link
vercel env pull .env.local
npm install
npx prisma generate
npx prisma db push

# Option 2: Direct connection
# Use your DATABASE_URL to connect via psql or database GUI
# Run the schema.prisma migrations manually
```

##  POST-DEPLOYMENT CONFIGURATION

### 1. Update NEXTAUTH_URL
After deployment, update the environment variable:
```bash
# In Vercel Dashboard > Settings > Environment Variables
NEXTAUTH_URL=https://your-actual-domain.vercel.app
```

### 2. Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-actual-domain.vercel.app/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `invoice.payment_succeeded`
4. Copy webhook secret to STRIPE_WEBHOOK_SECRET

### 3. Custom Domain (Optional)
1. In Vercel Dashboard > Settings > Domains
2. Add your custom domain
3. Update NEXTAUTH_URL to your custom domain

##  TESTING DEPLOYMENT

### Quick Tests:
1.  Homepage loads: `https://your-app.vercel.app`
2.  API health check: `https://your-app.vercel.app/api/health`
3.  Database connection: Check console for errors
4.  Authentication: Try login flow
5.  Navigation: Test SURGICAL MODE navigation

### Common Issues & Solutions:
```bash
# Issue: Project name already exists
# Solution: Use alternative names listed above

# Issue: Build fails
# Solution: Check build logs, verify all dependencies

# Issue: Database connection fails  
# Solution: Verify DATABASE_URL format and SSL settings

# Issue: Environment variables not loaded
# Solution: Redeploy after adding variables
```

##  SECURITY CHECKLIST

- [x] All secrets in environment variables (not in code)
- [x] DATABASE_URL uses SSL (sslmode=require for Neon)
- [x] NEXTAUTH_SECRET is random and secure
- [x] Stripe keys are LIVE keys (not test) for production
- [x] CORS settings configured for your domain
- [x] Rate limiting enabled for API routes

##  ALTERNATIVE PROJECT NAMES

If you encounter naming conflicts, try these:
- `bsos-platform-2025`  (recommended)
- `bsos-cleaning-management`
- `bsos-app-luizfel99`  
- `cleaning-management-bsos`
- `bsos-surgical-mode`
- `luizfel99-bsos`
- `bsos-production-v2`

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
5. Try alternative project names

**Status:** Ready for Production Deployment 
**Expected Deploy Time:** 2-5 minutes
**Post-Deploy Setup:** 10-15 minutes
**Project Name:** bsos-platform-2025 (recommended)

---
*Updated for BSOS Production - SURGICAL MODE Complete*
*Fixed: Project naming conflicts resolved*
