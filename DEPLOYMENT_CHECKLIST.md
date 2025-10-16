# 🚀 Production Deployment Checklist

## Pre-Deployment Verification

### ✅ Environment Variables Audit

#### **Required Environment Variables**
- [ ] `NEXTAUTH_URL` → Production domain URL
- [ ] `NEXTAUTH_SECRET` → 32+ character random secret
- [ ] `DATABASE_URL` → Production PostgreSQL connection
- [ ] `STRIPE_SECRET_KEY` → Live Stripe secret key (sk_live_...)
- [ ] `STRIPE_PUBLISHABLE_KEY` → Live Stripe publishable key (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` → Production webhook secret (whsec_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Public Stripe key (pk_live_...)
- [ ] `JWT_SECRET` → JWT signing secret
- [ ] `WEBHOOK_SECRET` → General webhook verification secret
- [ ] `ENCRYPTION_KEY` → Data encryption key

#### **Optional Environment Variables** (Enable as needed)
- [ ] `AIRBNB_CLIENT_ID` → Airbnb integration credentials
- [ ] `AIRBNB_CLIENT_SECRET` → Airbnb integration secret
- [ ] `AIRBNB_REDIRECT_URI` → Airbnb OAuth callback URL
- [ ] `WHATSAPP_API_TOKEN` → WhatsApp Business API token
- [ ] `WHATSAPP_PHONE_NUMBER_ID` → WhatsApp phone number ID
- [ ] `WHATSAPP_WEBHOOK_VERIFY_TOKEN` → WhatsApp webhook verification
- [ ] `SENDGRID_API_KEY` → Email service API key
- [ ] `SENDGRID_FROM_EMAIL` → Email sender address
- [ ] `SENDGRID_FROM_NAME` → Email sender name
- [ ] `TWILIO_ACCOUNT_SID` → SMS service account SID
- [ ] `TWILIO_AUTH_TOKEN` → SMS service auth token
- [ ] `TWILIO_PHONE_NUMBER` → SMS service phone number
- [ ] `HOSTAWAY_API_KEY` → Hostaway integration API key
- [ ] `HOSTAWAY_USERNAME` → Hostaway integration username
- [ ] `HOSTAWAY_PASSWORD` → Hostaway integration password

#### **Analytics & Monitoring** (Optional)
- [ ] `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` → Vercel Analytics ID
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` → Google Analytics ID
- [ ] `SENTRY_DSN` → Error tracking DSN
- [ ] `NEXT_PUBLIC_SENTRY_DSN` → Public Sentry DSN
- [ ] `SENTRY_ORG` → Sentry organization
- [ ] `SENTRY_PROJECT` → Sentry project name
- [ ] `SENTRY_AUTH_TOKEN` → Sentry authentication token

#### **Performance & Security**
- [ ] `RATE_LIMIT_ENABLED=true` → Enable rate limiting
- [ ] `RATE_LIMIT_REQUESTS_PER_MINUTE=60` → Rate limit threshold
- [ ] `DEBUG=false` → Disable debug mode
- [ ] `NODE_ENV=production` → Production environment

# Stripe (LIVE keys)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Sentry
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=your-org
SENTRY_PROJECT=bsos-production
```

#### 4. Deployment Commands

Once authenticated and services are configured:

```powershell
# Test build locally
npm run build

# Deploy to production
vercel --prod

# Or use our deployment script
npm run deploy:production
```

#### 5. Post-Deployment Verification

```powershell
# Test endpoints (replace YOUR_DOMAIN)
Invoke-WebRequest -Uri "https://YOUR_DOMAIN.vercel.app/api/health"
Invoke-WebRequest -Uri "https://YOUR_DOMAIN.vercel.app/api/status"
```

### 🎯 Priority Order

1. **Complete Vercel Authentication** (in progress)
2. **Setup Database** (5 minutes with Neon)
3. **Configure Stripe Live Keys** (3 minutes)
4. **Create Sentry Project** (2 minutes)
5. **Set Environment Variables in Vercel** (5 minutes)
6. **Deploy!** (2 minutes)

**Total Time Estimate**: 15-20 minutes

### 🆘 Need Help?

- **Vercel Authentication Issues**: Close terminal, run `vercel login` again
- **Database Setup**: Use Neon for simplest setup
- **Stripe Questions**: Ensure you're in LIVE mode, not test mode
- **Environment Variables**: Copy exactly from .env.production template

### 📞 Service Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Neon Database**: https://neon.tech
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Sentry Projects**: https://sentry.io

---

**🎉 You're almost there! BSOS is ready for production deployment!**