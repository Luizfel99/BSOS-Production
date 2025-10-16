# 🚀 BSOS Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Copy `.env.example` to `.env.local` with production values
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure Stripe API keys (live keys for production)
- [ ] Set up Sentry project for error tracking
- [ ] Configure SendGrid for email services (optional)

### ✅ Code Quality
- [ ] Run `npm run type-check` (some integration errors can be ignored)
- [ ] Ensure all critical API routes are working
- [ ] Test payment processing locally
- [ ] Verify authentication flows

### ✅ Vercel Configuration
- [ ] Update `vercel.json` with production settings
- [ ] Configure environment variables in Vercel Dashboard
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics

## 🔧 Environment Variables Setup

### 1. Core Application Variables
```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
JWT_SECRET=your_32_char_jwt_secret
WEBHOOK_SECRET=your_webhook_secret
ENCRYPTION_KEY=your_encryption_key
```

### 2. Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### 3. Stripe Payment Processing
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

### 4. Monitoring & Analytics
```bash
SENTRY_DSN=https://your_dsn@sentry.io/project_id
NEXT_PUBLIC_SENTRY_DSN=https://your_dsn@sentry.io/project_id
SENTRY_ORG=your_organization
SENTRY_PROJECT=your_project
```

### 5. Optional Integrations
```bash
SENDGRID_API_KEY=SG.your_key
AIRBNB_CLIENT_ID=your_airbnb_id
WHATSAPP_API_TOKEN=your_whatsapp_token
```

## 🚀 Deployment Steps

### 1. Local Testing
```bash
# Type checking
npm run type-check

# Test API routes
npm run test:api

# Build verification
npm run build
```

### 2. Vercel Dashboard Setup
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Configure environment variables:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set appropriate values for production

### 3. Deploy to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to production
npm run deploy:vercel
```

### 4. Post-Deployment Verification
- [ ] Verify application loads correctly
- [ ] Test login/authentication
- [ ] Check finance module functionality
- [ ] Verify Stripe payments work
- [ ] Test webhook endpoints
- [ ] Monitor Sentry for errors
- [ ] Check Vercel Analytics

## 🔍 Monitoring Setup

### Sentry Error Tracking
1. Create account at [Sentry.io](https://sentry.io)
2. Create new project
3. Copy DSN and configure in environment variables
4. Errors will be automatically tracked

### Vercel Analytics
- Automatically enabled in production
- View analytics in Vercel Dashboard
- Real-time performance monitoring

## 🛠️ Database Setup

### Production Database (PostgreSQL)
```sql
-- Run database schema
psql $DATABASE_URL -f scripts/database-schema.sql

-- Or use migration script
npm run db:migrate
```

### Recommended Providers
- **Neon**: Serverless PostgreSQL
- **PlanetScale**: MySQL with branches
- **Supabase**: PostgreSQL with realtime features
- **Railway**: Simple PostgreSQL hosting

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different secrets for production
- Rotate secrets regularly
- Enable 2FA on all service accounts

### Headers & Security
The project includes security headers in `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Content Security Policy ready

### Rate Limiting
- Enabled in production (`RATE_LIMIT_ENABLED=true`)
- 60 requests per minute by default
- Can be configured with Redis for scaling

## 📊 Performance Optimization

### Build Optimization
- Next.js 15 with automatic optimizations
- Code splitting and tree shaking
- Static asset optimization
- Image optimization with Next.js Image

### Caching Strategy
- Static assets: 1 year cache
- API responses: Custom cache headers
- Database queries: Consider Redis caching

### CDN & Edge
- Vercel Edge Network automatically enabled
- Global distribution
- Edge functions for API routes

## 🧪 Testing in Production

### Health Checks
```bash
# Check application health
curl https://your-domain.vercel.app/api/health

# Check API status
curl https://your-domain.vercel.app/api/status
```

### API Testing
```bash
# Test authentication
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Test finance endpoints
curl https://your-domain.vercel.app/api/finance/balance \
  -H "Authorization: Bearer your_token"
```

## 🔄 Maintenance & Updates

### Regular Tasks
- Monitor error logs in Sentry
- Review performance metrics in Vercel
- Update dependencies monthly
- Backup database regularly
- Review and rotate secrets

### Scaling Considerations
- Monitor API response times
- Database connection pooling
- Redis for session storage
- CDN for static assets

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
- Check TypeScript errors
- Verify environment variables
- Review Vercel build logs

**Database Connection Issues**
- Verify DATABASE_URL format
- Check firewall settings
- Ensure connection pooling

**Stripe Integration Issues**
- Verify API keys are live keys
- Check webhook secret configuration
- Test in Stripe Dashboard

**Authentication Problems**
- Verify JWT_SECRET is set
- Check session configuration
- Review CORS settings

### Support Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Sentry Documentation](https://docs.sentry.io)

## 📞 Emergency Contacts
- **Technical Issues**: Check GitHub Issues
- **Stripe Issues**: Stripe Support Dashboard
- **Vercel Issues**: Vercel Support
- **Database Issues**: Provider support portal

---

## 🎯 Quick Start Commands

```bash
# Full deployment pipeline
npm run type-check && npm run build && npm run deploy:vercel

# Emergency rollback (if needed)
vercel rollback

# View logs
vercel logs

# Production health check
curl https://your-domain.vercel.app/api/health
```

---

**Last Updated**: October 2025  
**Version**: BSOS 2.0.0  
**Status**: Production Ready ✅