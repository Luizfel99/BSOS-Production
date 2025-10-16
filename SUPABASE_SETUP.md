# 🎯 Implementação Supabase + PostgreSQL

## 📋 Guia Prático - Fase 1

### 1. **Setup Supabase**

#### **A. Criar projeto Supabase:**
```bash
# 1. Acesse https://supabase.com
# 2. Crie uma conta/login
# 3. Novo projeto: "bsos-cleaning-platform"
# 4. Região: South America (São Paulo)
# 5. Copie as credenciais:
```

#### **B. Variáveis de ambiente:**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-nextauth
```

### 2. **Schema do Banco de Dados**

#### **A. Instalar dependências:**
```bash
npm install @supabase/supabase-js prisma @prisma/client
npm install -D prisma
```

#### **B. Schema Prisma:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Empresas
model Company {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  phone       String?
  address     String?
  plan        Plan     @default(BASIC)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  users       User[]
  properties  Property[]
  cleanings   Cleaning[]
  payments    Payment[]

  @@map("companies")
}

// Usuários
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  avatar      String?
  phone       String?
  role        Role     @default(EMPLOYEE)
  isActive    Boolean  @default(true)
  lastLogin   DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  company     Company  @relation(fields: [companyId], references: [id])
  companyId   String
  cleanings   Cleaning[]
  ratings     Rating[]
  payments    Payment[]

  @@map("users")
}

// Propriedades
model Property {
  id          String   @id @default(cuid())
  name        String
  address     String
  type        PropertyType @default(APARTMENT)
  rooms       Int      @default(1)
  bathrooms   Int      @default(1)
  area        Float?
  
  // Integrações
  airbnbId    String?  @unique
  hostAwayId  String?  @unique
  
  // Configurações
  checkInTime String   @default("15:00")
  checkOutTime String  @default("11:00")
  cleaningDuration Int @default(120) // minutos
  
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  company     Company  @relation(fields: [companyId], references: [id])
  companyId   String
  cleanings   Cleaning[]
  checklists  ChecklistTemplate[]

  @@map("properties")
}

// Limpezas
model Cleaning {
  id          String   @id @default(cuid())
  
  // Agendamento
  scheduledDate DateTime
  estimatedDuration Int @default(120) // minutos
  
  // Execução
  startTime   DateTime?
  endTime     DateTime?
  status      CleaningStatus @default(SCHEDULED)
  
  // Check-in/out
  checkInTime DateTime?
  checkInLocation String?
  checkOutTime DateTime?
  checkOutLocation String?
  
  // Qualidade
  rating      Int?     // 1-5
  notes       String?
  photos      String[] // URLs das fotos
  
  // Financeiro
  price       Float
  paid        Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  company     Company  @relation(fields: [companyId], references: [id])
  companyId   String
  property    Property @relation(fields: [propertyId], references: [id])
  propertyId  String
  employee    User     @relation(fields: [employeeId], references: [id])
  employeeId  String
  checklist   ChecklistResponse?
  ratings     Rating[]

  @@map("cleanings")
}

// Templates de Checklist
model ChecklistTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  items       ChecklistItem[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  property    Property? @relation(fields: [propertyId], references: [id])
  propertyId  String?
  responses   ChecklistResponse[]

  @@map("checklist_templates")
}

// Itens do Checklist
model ChecklistItem {
  id          String   @id @default(cuid())
  title       String
  description String?
  category    String   // "Quarto", "Banheiro", "Cozinha", etc.
  isRequired  Boolean  @default(true)
  order       Int      @default(0)
  
  template    ChecklistTemplate @relation(fields: [templateId], references: [id])
  templateId  String
  responses   ChecklistItemResponse[]

  @@map("checklist_items")
}

// Respostas do Checklist
model ChecklistResponse {
  id          String   @id @default(cuid())
  completedAt DateTime @default(now())
  notes       String?
  
  cleaning    Cleaning @relation(fields: [cleaningId], references: [id])
  cleaningId  String   @unique
  template    ChecklistTemplate @relation(fields: [templateId], references: [id])
  templateId  String
  items       ChecklistItemResponse[]

  @@map("checklist_responses")
}

// Respostas dos Itens
model ChecklistItemResponse {
  id          String   @id @default(cuid())
  completed   Boolean  @default(false)
  notes       String?
  photo       String?  // URL da foto
  
  response    ChecklistResponse @relation(fields: [responseId], references: [id])
  responseId  String
  item        ChecklistItem @relation(fields: [itemId], references: [id])
  itemId      String

  @@unique([responseId, itemId])
  @@map("checklist_item_responses")
}

// Avaliações
model Rating {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  comment     String?
  createdAt   DateTime @default(now())

  cleaning    Cleaning @relation(fields: [cleaningId], references: [id])
  cleaningId  String
  ratedBy     User     @relation(fields: [ratedById], references: [id])
  ratedById   String

  @@map("ratings")
}

// Pagamentos
model Payment {
  id          String   @id @default(cuid())
  amount      Float
  type        PaymentType
  status      PaymentStatus @default(PENDING)
  method      String?  // "PIX", "Cartão", "Dinheiro"
  reference   String?  // ID externo (Stripe, etc.)
  notes       String?
  paidAt      DateTime?
  createdAt   DateTime @default(now())

  company     Company  @relation(fields: [companyId], references: [id])
  companyId   String
  employee    User?    @relation(fields: [employeeId], references: [id])
  employeeId  String?

  @@map("payments")
}

// Enums
enum Role {
  ADMIN
  SUPERVISOR
  EMPLOYEE
  CLIENT
}

enum Plan {
  BASIC
  PROFESSIONAL
  ENTERPRISE
}

enum PropertyType {
  APARTMENT
  HOUSE
  COMMERCIAL
  OFFICE
}

enum CleaningStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum PaymentType {
  CLEANING_FEE
  EMPLOYEE_PAYMENT
  BONUS
  FINE
}

enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
}
```

### 3. **Cliente Supabase**

#### **A. Configuração:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações server-side
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

#### **B. Cliente Prisma:**
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4. **Migração dos Dados**

#### **A. Script de migração:**
```typescript
// scripts/migrate-to-supabase.ts
import { prisma } from '../src/lib/prisma'

async function migrateData() {
  console.log('🚀 Iniciando migração para Supabase...')

  // 1. Criar empresa exemplo
  const company = await prisma.company.create({
    data: {
      name: 'Bright & Shine Cleaning',
      email: 'admin@brightshine.com',
      phone: '+55 11 99999-9999',
      plan: 'PROFESSIONAL'
    }
  })

  console.log('✅ Empresa criada:', company.id)

  // 2. Criar usuários
  const admin = await prisma.user.create({
    data: {
      email: 'admin@brightshine.com',
      name: 'Administrador',
      role: 'ADMIN',
      companyId: company.id
    }
  })

  const supervisor = await prisma.user.create({
    data: {
      email: 'supervisor@brightshine.com',
      name: 'João Supervisor',
      role: 'SUPERVISOR',
      companyId: company.id
    }
  })

  const employee = await prisma.user.create({
    data: {
      email: 'maria@brightshine.com',
      name: 'Maria Silva',
      role: 'EMPLOYEE',
      companyId: company.id
    }
  })

  console.log('✅ Usuários criados')

  // 3. Criar propriedades
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        name: 'Apartamento Copacabana',
        address: 'Rua Barata Ribeiro, 123',
        type: 'APARTMENT',
        rooms: 2,
        bathrooms: 1,
        companyId: company.id,
        airbnbId: 'airbnb_123456'
      }
    }),
    prisma.property.create({
      data: {
        name: 'Casa Ipanema',
        address: 'Rua Visconde de Pirajá, 456',
        type: 'HOUSE',
        rooms: 3,
        bathrooms: 2,
        companyId: company.id
      }
    })
  ])

  console.log('✅ Propriedades criadas')

  // 4. Criar template de checklist
  const template = await prisma.checklistTemplate.create({
    data: {
      name: 'Checklist Padrão Apartamento',
      description: 'Lista padrão para limpeza de apartamentos',
      propertyId: properties[0].id,
      items: {
        create: [
          {
            title: 'Aspirar carpetes e tapetes',
            category: 'Sala',
            order: 1
          },
          {
            title: 'Limpar e desinfetar banheiro',
            category: 'Banheiro',
            order: 2
          },
          {
            title: 'Trocar roupa de cama',
            category: 'Quarto',
            order: 3
          }
        ]
      }
    }
  })

  console.log('✅ Template criado')

  // 5. Criar limpezas exemplo
  const cleanings = await Promise.all([
    prisma.cleaning.create({
      data: {
        scheduledDate: new Date(Date.now() + 86400000), // amanhã
        price: 150.00,
        status: 'SCHEDULED',
        companyId: company.id,
        propertyId: properties[0].id,
        employeeId: employee.id
      }
    }),
    prisma.cleaning.create({
      data: {
        scheduledDate: new Date(Date.now() - 86400000), // ontem
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() - 82800000), // 1h depois
        price: 200.00,
        status: 'COMPLETED',
        rating: 5,
        companyId: company.id,
        propertyId: properties[1].id,
        employeeId: employee.id
      }
    })
  ])

  console.log('✅ Limpezas criadas')

  console.log('🎉 Migração concluída com sucesso!')
  
  return {
    company,
    users: { admin, supervisor, employee },
    properties,
    template,
    cleanings
  }
}

// Executar migração
migrateData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 5. **APIs com Supabase**

#### **A. API de usuários:**
```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    
    const users = await prisma.user.findMany({
      where: companyId ? { companyId } : {},
      include: {
        company: true,
        cleanings: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 dias
            }
          }
        }
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const user = await prisma.user.create({
      data: {
        ...data,
        id: undefined // Deixa o Prisma gerar
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
```

#### **B. API de limpezas:**
```typescript
// src/app/api/cleanings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    
    if (employeeId) where.employeeId = employeeId
    if (status) where.status = status
    if (startDate && endDate) {
      where.scheduledDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const cleanings = await prisma.cleaning.findMany({
      where,
      include: {
        property: true,
        employee: true,
        checklist: {
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        },
        ratings: true
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    })

    return NextResponse.json(cleanings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar limpezas' },
      { status: 500 }
    )
  }
}
```

### 6. **Comandos de Setup**

```bash
# 1. Instalar dependências
npm install @supabase/supabase-js prisma @prisma/client next-auth

# 2. Inicializar Prisma
npx prisma init

# 3. Gerar cliente
npx prisma generate

# 4. Executar migração
npx prisma db push

# 5. Executar seed
npm run db:seed

# 6. Abrir Prisma Studio
npx prisma studio
```

---

## ✅ **Checklist de Implementação**

- [ ] Criar projeto Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Implementar schema Prisma
- [ ] Executar migração do banco
- [ ] Criar APIs RESTful
- [ ] Migrar dados mock
- [ ] Testar endpoints
- [ ] Deploy em produção

**Tempo estimado: 1-2 semanas** 🚀