# Vercel Deployment Guide - Environment Variables

## Overview
This guide provides step-by-step instructions for deploying the Cleaning Management Platform to Vercel with proper environment variable configuration.

## Prerequisites

1. **Vercel CLI installed**: `npm i -g vercel`
2. **Vercel account**: https://vercel.com
3. **Project repository**: Connected to GitHub
4. **Environment values ready**: Database URLs, API keys, secrets

## Critical Environment Variables Summary

### 🔴 **REQUIRED for Production**

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | NextAuth.js base URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth.js encryption secret | `32+ character random string` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `STRIPE_SECRET_KEY` | Stripe secret key (live) | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (live) | `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public Stripe key | `pk_live_...` |

### 🟡 **OPTIONAL (Feature-dependent)**

| Variable | Description | Required For |
|----------|-------------|--------------|
| `AIRBNB_CLIENT_ID` | Airbnb integration | Airbnb bookings |
| `WHATSAPP_API_TOKEN` | WhatsApp Business API | WhatsApp notifications |
| `SENDGRID_API_KEY` | Email service | Email notifications |
| `TWILIO_ACCOUNT_SID` | SMS service | SMS notifications |
| `HOSTAWAY_API_KEY` | Hostaway integration | Hostaway bookings |

## Deployment Methods

### Method 1: Vercel CLI (Recommended)

#### 1. Login to Vercel
```bash
vercel login
```

#### 2. Link Project
```bash
# In your project directory
vercel link
```

#### 3. Set Environment Variables
```bash
# Required variables
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

# Optional variables (as needed)
vercel env add AIRBNB_CLIENT_ID production
vercel env add WHATSAPP_API_TOKEN production
vercel env add SENDGRID_API_KEY production
```

#### 4. Deploy
```bash
vercel --prod
```

### Method 2: Vercel Dashboard

#### 1. Project Settings
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Settings** → **Environment Variables**

#### 2. Add Variables One by One
For each required variable:

1. **Name**: Enter variable name (e.g., `NEXTAUTH_URL`)
2. **Value**: Enter the actual value
3. **Environment**: Select **Production** (and Preview if needed)
4. Click **Save**

#### 3. Redeploy
After adding all variables, trigger a new deployment:
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment

### Method 3: Environment File Upload

#### 1. Prepare .env.production
Create a `.env.production` file with production values:

```bash
# .env.production
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_production_nextauth_secret_here
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host/prod_db
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

#### 2. Import to Vercel
```bash
# Import all variables from file
vercel env pull .env.vercel
vercel env add < .env.production
```

## Environment Variable Values

### 1. NEXTAUTH_URL
```bash
# For production deployment
NEXTAUTH_URL=https://your-app-name.vercel.app

# For custom domain
NEXTAUTH_URL=https://yourdomain.com
```

### 2. NEXTAUTH_SECRET
Generate a secure secret:
```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 3: Online generator
# https://generate-secret.vercel.app/32
```

### 3. DATABASE_URL
**Neon PostgreSQL (Recommended)**:
```bash
# Format
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/database_name

# With SSL and pooling
DATABASE_URL=postgresql://user:pass@ep-xxx.pooler.region.aws.neon.tech/db?sslmode=require
```

**Other PostgreSQL providers**:
```bash
# Heroku Postgres
DATABASE_URL=postgres://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/db

# PlanetScale (MySQL)
DATABASE_URL=mysql://user:pass@aws.connect.psdb.cloud/db?sslaccept=strict

# Supabase
DATABASE_URL=postgresql://user:pass@db.xxx.supabase.co:5432/postgres
```

### 4. Stripe Keys
**Get from Stripe Dashboard**:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
3. Reveal and copy **Secret key** → `STRIPE_SECRET_KEY`
4. Go to **Webhooks** → Select webhook → Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

**⚠️ Important**: Use **live keys** for production, **test keys** for development.

## Verification Steps

### 1. Check Environment Variables
```bash
# List all environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

### 2. Test Deployment
```bash
# Deploy to preview first
vercel

# Check preview deployment logs
vercel logs https://your-app-xxx.vercel.app
```

### 3. Health Check
After deployment, test the health endpoint:
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z",
  "services": {
    "database": "connected",
    "stripe": "configured"
  }
}
```

## Troubleshooting

### Issue: "NEXTAUTH_URL is missing"
**Solution**: Ensure `NEXTAUTH_URL` is set and matches your deployment URL:
```bash
vercel env add NEXTAUTH_URL production
# Enter: https://your-app.vercel.app
```

### Issue: "Database connection failed"
**Solutions**:
1. Verify `DATABASE_URL` format
2. Check database server is accessible
3. Test connection locally first
4. Ensure SSL settings match database requirements

### Issue: "Stripe keys invalid"
**Solutions**:
1. Verify keys are live keys (start with `pk_live_` and `sk_live_`)
2. Check keys aren't revoked in Stripe Dashboard
3. Ensure webhook secret matches webhook configuration

### Issue: Build failures
**Solutions**:
1. Check build logs: `vercel logs --follow`
2. Verify all required environment variables are set
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

## Security Best Practices

### 1. Environment Variable Security
- ✅ Never commit `.env.production` to version control
- ✅ Use different secrets for different environments
- ✅ Rotate secrets periodically
- ✅ Use strong, randomly generated secrets

### 2. Access Control
- ✅ Limit Vercel team access to production
- ✅ Use preview environments for testing
- ✅ Monitor deployment logs for security issues

### 3. Secret Management
```bash
# Good: Environment-specific secrets
NEXTAUTH_SECRET_DEV=dev_secret_here
NEXTAUTH_SECRET_PROD=prod_secret_here

# Bad: Shared secrets across environments
NEXTAUTH_SECRET=same_secret_everywhere
```

## Monitoring and Maintenance

### 1. Environment Variable Audit
Regular checklist:
- [ ] All required variables are set
- [ ] No expired API keys
- [ ] Secrets are properly rotated
- [ ] Test and live environments are separate

### 2. Deployment Monitoring
```bash
# Monitor deployment status
vercel ls

# Check recent deployments
vercel deployments

# View deployment logs
vercel logs [deployment-url]
```

### 3. Performance Monitoring
- Monitor response times via Vercel Analytics
- Check database connection pool usage
- Monitor Stripe webhook delivery success rate

## Next Steps

After successful deployment:

1. **Configure Custom Domain** (if applicable)
2. **Set up Monitoring** (error tracking, performance)
3. **Configure Stripe Webhooks** with production URL
4. **Test End-to-End Functionality**
5. **Set up Backup and Recovery Procedures**

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Environment Variables Guide**: https://vercel.com/docs/concepts/projects/environment-variables
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Troubleshooting**: https://vercel.com/docs/concepts/troubleshooting

---

For local development setup, see: [.env.example](./.env.example)