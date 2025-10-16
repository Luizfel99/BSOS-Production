# 🏗️ BSOS - Arquitetura Multi-Tenant SaaS

## 🎯 **Visão Técnica**

Implementação de uma arquitetura multi-tenant robusta para suportar múltiplas empresas de limpeza em uma única plataforma, garantindo isolamento de dados, escalabilidade e performance.

---

## 🏢 **Estratégia Multi-Tenant**

### 📊 **Modelo Escolhido: Shared Database, Shared Schema**

```
┌─────────────────────────────────────────┐
│             BSOS Platform               │
├─────────────────────────────────────────┤
│  Tenant A   │  Tenant B   │  Tenant C   │
│  (Empresa1) │  (Empresa2) │  (Empresa3) │
├─────────────┼─────────────┼─────────────┤
│         Shared Application Layer        │
├─────────────────────────────────────────┤
│           Shared Database               │
│     (Row-Level Security - RLS)          │
└─────────────────────────────────────────┘
```

### ✅ **Vantagens:**
- **Custo-efetivo:** Uma instância de banco para todos
- **Manutenção simples:** Schema único
- **Escalabilidade:** Recursos compartilhados
- **Performance:** Cache compartilhado

### 🔒 **Segurança:** Row-Level Security (RLS) no PostgreSQL

---

## 🗄️ **Schema de Banco Multi-Tenant**

### 📋 **Schema Prisma Atualizado:**

```prisma
// prisma/schema.prisma

// Core tenant model
model Tenant {
  id          String   @id @default(cuid())
  slug        String   @unique // URL subdomain
  name        String
  domain      String?  @unique // Custom domain
  
  // Subscription info
  plan        PlanType @default(BASIC)
  status      TenantStatus @default(ACTIVE)
  
  // Plan limits
  maxProperties   Int    @default(5)
  maxEmployees    Int    @default(3)
  maxCleanings    Int    @default(50)
  maxAdmins      Int    @default(1)
  
  // Billing
  subscriptionId  String?
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  
  // Settings
  settings    Json     @default("{}")
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations (all with tenant isolation)
  users       User[]
  properties  Property[]
  cleanings   Cleaning[]
  payments    Payment[]
  usage       Usage[]
  
  @@map("tenants")
}

// Enhanced user model with tenant
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  
  // Multi-tenant fields
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Existing fields...
  role        Role     @default(EMPLOYEE)
  isActive    Boolean  @default(true)
  
  // Relations (automatically filtered by tenant)
  cleanings   Cleaning[]
  
  @@map("users")
  @@index([tenantId, email]) // Composite index for performance
}

// Enhanced property model
model Property {
  id          String   @id @default(cuid())
  
  // Multi-tenant fields
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Existing fields...
  name        String
  address     String
  
  // Relations
  cleanings   Cleaning[]
  
  @@map("properties")
  @@index([tenantId]) // Performance index
}

// Enhanced cleaning model
model Cleaning {
  id          String   @id @default(cuid())
  
  // Multi-tenant fields
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Existing fields...
  scheduledDate DateTime
  status      CleaningStatus
  
  // Relations
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  String
  employee    User     @relation(fields: [employeeId], references: [id])
  employeeId  String
  
  @@map("cleanings")
  @@index([tenantId, scheduledDate]) // Composite index
}

// Usage tracking for billing
model Usage {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  resource    String   // 'properties', 'employees', 'cleanings'
  quantity    Int
  month       Int
  year        Int
  
  createdAt   DateTime @default(now())
  
  @@unique([tenantId, resource, month, year])
  @@map("usage")
}

// Subscription management
model Subscription {
  id            String   @id @default(cuid())
  tenantId      String   @unique
  
  stripeId      String   @unique
  status        SubscriptionStatus
  plan          PlanType
  
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  
  cancelAt      DateTime?
  canceledAt    DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("subscriptions")
}

// Enums
enum PlanType {
  BASIC
  PROFESSIONAL
  ENTERPRISE
}

enum TenantStatus {
  ACTIVE
  SUSPENDED
  CANCELLED
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELLED
  UNPAID
}
```

---

## 🔐 **Row-Level Security (RLS)**

### 📝 **PostgreSQL Policies:**

```sql
-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleanings ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant isolation
CREATE POLICY tenant_isolation_users ON users
  USING (tenant_id = current_setting('app.current_tenant_id'));

CREATE POLICY tenant_isolation_properties ON properties
  USING (tenant_id = current_setting('app.current_tenant_id'));

CREATE POLICY tenant_isolation_cleanings ON cleanings
  USING (tenant_id = current_setting('app.current_tenant_id'));

-- Function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_id(tenant_id text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', tenant_id, true);
END;
$$ LANGUAGE plpgsql;
```

---

## 🛠️ **Implementação do Sistema**

### 🔧 **Tenant Context Service:**

```typescript
// src/lib/tenant-context.ts
import { AsyncLocalStorage } from 'async_hooks'

interface TenantContext {
  tenantId: string
  tenantSlug: string
  plan: PlanType
  limits: PlanLimits
}

class TenantContextService {
  private asyncLocalStorage = new AsyncLocalStorage<TenantContext>()

  setContext(context: TenantContext) {
    return this.asyncLocalStorage.run(context, () => {
      // Set PostgreSQL session variable
      return prisma.$executeRaw`SELECT set_tenant_id(${context.tenantId})`
    })
  }

  getContext(): TenantContext | undefined {
    return this.asyncLocalStorage.getStore()
  }

  getCurrentTenantId(): string {
    const context = this.getContext()
    if (!context) {
      throw new Error('Tenant context not set')
    }
    return context.tenantId
  }

  async withTenant<T>(tenantId: string, callback: () => Promise<T>): Promise<T> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) {
      throw new Error('Tenant not found')
    }

    const context: TenantContext = {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      plan: tenant.plan,
      limits: PLAN_LIMITS[tenant.plan]
    }

    return this.asyncLocalStorage.run(context, async () => {
      // Set database context
      await prisma.$executeRaw`SELECT set_tenant_id(${tenantId})`
      return callback()
    })
  }
}

export const tenantContext = new TenantContextService()
```

### 🔒 **Tenant Middleware:**

```typescript
// src/middleware/tenant.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { tenantContext } from '@/lib/tenant-context'

export async function tenantMiddleware(request: NextRequest) {
  const session = await getServerSession(authConfig)
  
  if (!session?.user?.tenantId) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Extract tenant from subdomain or custom domain
  const host = request.headers.get('host') || ''
  let tenantSlug: string | null = null

  // Check for subdomain (tenant.bsos.app)
  if (host.includes('.bsos.app')) {
    tenantSlug = host.split('.')[0]
  }
  
  // Check for custom domain
  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug: tenantSlug },
        { domain: host },
        { id: session.user.tenantId }
      ]
    }
  })

  if (!tenant) {
    return NextResponse.redirect(new URL('/tenant-not-found', request.url))
  }

  // Set tenant context for the request
  return tenantContext.withTenant(tenant.id, async () => {
    const response = NextResponse.next()
    
    // Add tenant info to headers for client
    response.headers.set('X-Tenant-ID', tenant.id)
    response.headers.set('X-Tenant-Slug', tenant.slug)
    response.headers.set('X-Tenant-Plan', tenant.plan)
    
    return response
  })
}
```

### 📊 **Usage Tracking Service:**

```typescript
// src/services/usage/usage.service.ts
export class UsageTrackingService {
  async trackUsage(resource: string, quantity: number = 1) {
    const tenantId = tenantContext.getCurrentTenantId()
    const now = new Date()
    
    await prisma.usage.upsert({
      where: {
        tenantId_resource_month_year: {
          tenantId,
          resource,
          month: now.getMonth() + 1,
          year: now.getFullYear()
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        tenantId,
        resource,
        quantity,
        month: now.getMonth() + 1,
        year: now.getFullYear()
      }
    })

    // Check if approaching limits
    await this.checkLimits(tenantId, resource)
  }

  async checkLimits(tenantId: string, resource: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) return

    const currentUsage = await this.getCurrentUsage(tenantId, resource)
    const limit = this.getPlanLimit(tenant.plan, resource)
    
    if (currentUsage >= limit * 0.8) { // 80% threshold
      await this.sendLimitWarning(tenant, resource, currentUsage, limit)
    }
    
    if (currentUsage >= limit) {
      throw new Error(`Plan limit exceeded for ${resource}. Upgrade required.`)
    }
  }

  private async getCurrentUsage(tenantId: string, resource: string): Promise<number> {
    switch (resource) {
      case 'properties':
        return await prisma.property.count({ where: { tenantId } })
      case 'employees':
        return await prisma.user.count({ 
          where: { tenantId, role: { in: ['EMPLOYEE', 'SUPERVISOR'] } }
        })
      case 'cleanings':
        const now = new Date()
        return await prisma.cleaning.count({
          where: {
            tenantId,
            scheduledDate: {
              gte: new Date(now.getFullYear(), now.getMonth(), 1),
              lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            }
          }
        })
      default:
        return 0
    }
  }

  private getPlanLimit(plan: PlanType, resource: string): number {
    const limits = PLAN_LIMITS[plan]
    return limits[resource] || 0
  }
}

// Plan limits configuration
export const PLAN_LIMITS = {
  BASIC: {
    properties: 5,
    employees: 3,
    cleanings: 50,
    admins: 1
  },
  PROFESSIONAL: {
    properties: 50,
    employees: 15,
    cleanings: 500,
    admins: 3
  },
  ENTERPRISE: {
    properties: 999999,
    employees: 999999,
    cleanings: 999999,
    admins: 999999
  }
}
```

---

## 💳 **Sistema de Billing**

### 🔄 **Stripe Integration:**

```typescript
// src/services/billing/billing.service.ts
export class BillingService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  async createSubscription(tenantId: string, plan: PlanType, paymentMethodId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) throw new Error('Tenant not found')

    // Create or get Stripe customer
    const customer = await this.getOrCreateCustomer(tenant)
    
    // Attach payment method
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id
    })

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: PLAN_PRICES[plan] }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        tenantId,
        plan
      }
    })

    // Save to database
    await prisma.subscription.create({
      data: {
        tenantId,
        stripeId: subscription.id,
        status: 'ACTIVE',
        plan,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })

    // Update tenant plan
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        plan,
        maxProperties: PLAN_LIMITS[plan].properties,
        maxEmployees: PLAN_LIMITS[plan].employees,
        maxCleanings: PLAN_LIMITS[plan].cleanings
      }
    })

    return subscription
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.updated':
        await this.updateSubscription(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await this.cancelSubscription(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  }

  private async updateSubscription(subscription: Stripe.Subscription) {
    const tenantId = subscription.metadata.tenantId
    
    await prisma.subscription.update({
      where: { stripeId: subscription.id },
      data: {
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    })
  }
}

const PLAN_PRICES = {
  BASIC: 'price_basic_monthly',
  PROFESSIONAL: 'price_professional_monthly',
  ENTERPRISE: 'price_enterprise_monthly'
}
```

---

## 🌐 **Multi-Domain Support**

### 🔧 **Domain Routing:**

```typescript
// src/lib/domain-router.ts
export class DomainRouter {
  async resolveTenant(request: NextRequest): Promise<Tenant | null> {
    const host = request.headers.get('host') || ''
    
    // Try custom domain first
    let tenant = await prisma.tenant.findUnique({
      where: { domain: host }
    })
    
    if (tenant) return tenant
    
    // Try subdomain
    if (host.includes('.bsos.app')) {
      const slug = host.split('.')[0]
      tenant = await prisma.tenant.findUnique({
        where: { slug }
      })
    }
    
    return tenant
  }

  generateTenantUrl(tenant: Tenant, path: string = ''): string {
    if (tenant.domain) {
      return `https://${tenant.domain}${path}`
    }
    
    return `https://${tenant.slug}.bsos.app${path}`
  }
}
```

### 🔀 **Next.js Rewrites:**

```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        // Custom domains
        {
          source: '/:path*',
          destination: '/api/proxy/:path*',
          has: [
            {
              type: 'host',
              value: '(?<tenant>.*)\\.(?!bsos\\.app).*'
            }
          ]
        }
      ]
    }
  }
}
```

---

## 📊 **Performance & Monitoring**

### ⚡ **Caching Strategy:**

```typescript
// src/lib/cache/tenant-cache.ts
export class TenantCacheService {
  private redis = new Redis(process.env.REDIS_URL!)
  
  async getTenant(identifier: string): Promise<Tenant | null> {
    // Try cache first
    const cached = await this.redis.get(`tenant:${identifier}`)
    if (cached) {
      return JSON.parse(cached)
    }
    
    // Fallback to database
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
          { domain: identifier }
        ]
      }
    })
    
    if (tenant) {
      // Cache for 5 minutes
      await this.redis.setex(`tenant:${identifier}`, 300, JSON.stringify(tenant))
    }
    
    return tenant
  }
  
  async invalidateTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
    if (tenant) {
      await Promise.all([
        this.redis.del(`tenant:${tenant.id}`),
        this.redis.del(`tenant:${tenant.slug}`),
        tenant.domain ? this.redis.del(`tenant:${tenant.domain}`) : Promise.resolve()
      ])
    }
  }
}
```

### 📈 **Monitoring:**

```typescript
// src/lib/monitoring/tenant-metrics.ts
export class TenantMetrics {
  async trackRequest(tenantId: string, endpoint: string, duration: number) {
    // Send metrics to monitoring service
    await fetch(`${process.env.METRICS_ENDPOINT}/metrics`, {
      method: 'POST',
      body: JSON.stringify({
        tenant_id: tenantId,
        endpoint,
        duration,
        timestamp: Date.now()
      })
    })
  }
  
  async getUsageMetrics(tenantId: string) {
    return {
      requests_per_minute: await this.getRequestsPerMinute(tenantId),
      active_users: await this.getActiveUsers(tenantId),
      storage_usage: await this.getStorageUsage(tenantId),
      api_calls: await this.getApiCalls(tenantId)
    }
  }
}
```

---

## ✅ **Checklist de Implementação**

### **🏗️ Fase 1: Core Architecture (2 semanas)**
- [ ] Implementar schema multi-tenant
- [ ] Configurar Row-Level Security
- [ ] Criar TenantContextService
- [ ] Implementar tenant middleware

### **💳 Fase 2: Billing System (2 semanas)**
- [ ] Integrar Stripe subscriptions
- [ ] Implementar usage tracking
- [ ] Criar webhooks de billing
- [ ] Sistema de limits por plano

### **🌐 Fase 3: Multi-Domain (1 semana)**
- [ ] Configurar domain routing
- [ ] Implementar custom domains
- [ ] Setup SSL automático
- [ ] Testes de subdomain

### **⚡ Fase 4: Performance (1 semana)**
- [ ] Implementar Redis caching
- [ ] Otimizar queries com indexes
- [ ] Setup monitoring
- [ ] Load testing

### **🔒 Fase 5: Security (1 semana)**
- [ ] Audit de segurança
- [ ] Penetration testing
- [ ] LGPD compliance
- [ ] Backup e recovery

**Total: 7 semanas para SaaS completo** 🚀

---

## 🎯 **Considerações Finais**

Esta arquitetura multi-tenant garante:

- ✅ **Isolamento completo** de dados entre tenants
- ✅ **Escalabilidade** para milhares de clientes
- ✅ **Performance otimizada** com caching
- ✅ **Billing automatizado** com Stripe
- ✅ **Custom domains** para branding
- ✅ **Monitoramento** em tempo real

**O BSOS está pronto para ser uma plataforma SaaS enterprise!** 💎