# 🔐 Implementação de Autenticação Avançada

## 🎯 Guia Prático - Fase 3

### 1. **NextAuth.js Setup**

#### **A. Instalação e configuração:**
```bash
npm install next-auth @next-auth/prisma-adapter
npm install @auth/prisma-adapter
```

#### **B. Configuração principal:**
```typescript
// src/lib/auth.config.ts
import { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Apple from 'next-auth/providers/apple'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar'
        }
      }
    }),
    
    // Apple OAuth
    Apple({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!
    }),
    
    // Credenciais tradicionais
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { company: true }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          company: user.company,
          avatar: user.avatar,
          twoFactorEnabled: user.twoFactorEnabled
        }
      }
    })
  ],
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
        token.twoFactorEnabled = user.twoFactorEnabled
        token.twoFactorVerified = false
      }
      
      // Store OAuth access token for calendar integration
      if (account?.provider === 'google') {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
        session.user.twoFactorVerified = token.twoFactorVerified as boolean
        session.accessToken = token.accessToken as string
      }
      
      return session
    },
    
    async signIn({ user, account, profile }) {
      // Verificar se o usuário está ativo
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (dbUser && !dbUser.isActive) {
          return false
        }
      }
      
      return true
    }
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  },
  
  secret: process.env.NEXTAUTH_SECRET
}
```

#### **C. Route handler:**
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
```

### 2. **Two-Factor Authentication (2FA)**

#### **A. Schema do banco (adicionar ao Prisma):**
```prisma
// Adicionar ao modelo User
model User {
  // ... campos existentes
  
  // 2FA
  twoFactorEnabled    Boolean   @default(false)
  twoFactorSecret     String?   // Encrypted
  twoFactorBackupCodes String[] // Encrypted backup codes
  lastTwoFactorAt     DateTime?
  
  // Session tracking
  sessions            Session[]
  loginAttempts       LoginAttempt[]
}

model Session {
  id          String   @id @default(cuid())
  sessionToken String   @unique
  userId      String
  expires     DateTime
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model LoginAttempt {
  id          String   @id @default(cuid())
  email       String
  ipAddress   String
  userAgent   String?
  successful  Boolean
  createdAt   DateTime @default(now())
  
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])

  @@map("login_attempts")
}
```

#### **B. Service de 2FA:**
```typescript
// src/services/auth/two-factor.service.ts
import * as speakeasy from 'speakeasy'
import * as qrcode from 'qrcode'
import { encrypt, decrypt } from '@/lib/crypto'

export class TwoFactorService {
  
  // Gerar secret para novo usuário
  async generateSecret(userId: string, email: string): Promise<{
    secret: string
    qrCodeUrl: string
    backupCodes: string[]
  }> {
    const secret = speakeasy.generateSecret({
      name: `BSOS (${email})`,
      issuer: 'Bright & Shine OS',
      length: 32
    })

    // Gerar códigos de backup
    const backupCodes = this.generateBackupCodes()

    // Salvar no banco (encrypted)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: encrypt(secret.base32),
        twoFactorBackupCodes: backupCodes.map(code => encrypt(code))
      }
    })

    // Gerar QR Code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!)

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    }
  }

  // Verificar token TOTP
  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.twoFactorSecret) {
      return false
    }

    const secret = decrypt(user.twoFactorSecret)

    const verified = speakeasy.totp.verify({
      secret,
      token,
      window: 2, // Aceita tokens de até 2 períodos (±60s)
      time: Math.floor(Date.now() / 1000)
    })

    if (verified) {
      // Atualizar último uso
      await prisma.user.update({
        where: { id: userId },
        data: { lastTwoFactorAt: new Date() }
      })
    }

    return verified
  }

  // Verificar código de backup
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.twoFactorBackupCodes) {
      return false
    }

    // Descriptografar e verificar códigos
    const backupCodes = user.twoFactorBackupCodes.map(encrypted => decrypt(encrypted))
    const codeIndex = backupCodes.indexOf(code)

    if (codeIndex === -1) {
      return false
    }

    // Remover código usado
    const updatedCodes = user.twoFactorBackupCodes.filter((_, index) => index !== codeIndex)
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: updatedCodes,
        lastTwoFactorAt: new Date()
      }
    })

    return true
  }

  // Ativar 2FA
  async enable2FA(userId: string, token: string): Promise<boolean> {
    const verified = await this.verifyToken(userId, token)
    
    if (verified) {
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      })
    }

    return verified
  }

  // Desativar 2FA
  async disable2FA(userId: string, token: string): Promise<boolean> {
    const verified = await this.verifyToken(userId, token)
    
    if (verified) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorBackupCodes: []
        }
      })
    }

    return verified
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
  }
}
```

### 3. **Middleware de Autenticação**

#### **A. Middleware personalizado:**
```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Rotas que requerem 2FA
    const requires2FA = [
      '/admin',
      '/supervisor',
      '/api/admin',
      '/api/payments'
    ]

    // Verificar se a rota requer 2FA
    if (requires2FA.some(route => pathname.startsWith(route))) {
      if (token?.twoFactorEnabled && !token?.twoFactorVerified) {
        return NextResponse.redirect(new URL('/auth/2fa', req.url))
      }
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    if (pathname.startsWith('/supervisor') && !['ADMIN', 'SUPERVISOR'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Permitir acesso a rotas públicas
        if (pathname.startsWith('/auth') || pathname === '/') {
          return true
        }

        // Requer autenticação para outras rotas
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)'
  ]
}
```

### 4. **Componentes de UI**

#### **A. Tela de login:**
```tsx
// src/components/auth/SignInForm.tsx
'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Email ou senha incorretos')
      } else {
        // Verificar se precisa de 2FA
        const session = await getSession()
        if (session?.user.twoFactorEnabled) {
          router.push('/auth/2fa')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Entrar no BSOS
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        <button
          onClick={() => signIn('google')}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
        >
          Entrar com Google
        </button>

        <button
          onClick={() => signIn('apple')}
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
        >
          Entrar com Apple
        </button>
      </div>
    </div>
  )
}
```

#### **B. Tela de 2FA:**
```tsx
// src/components/auth/TwoFactorForm.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function TwoFactorForm() {
  const [token, setToken] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { data: session, update } = useSession()
  const router = useRouter()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = useBackupCode ? '/api/auth/2fa/backup' : '/api/auth/2fa/verify'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })

      const data = await response.json()

      if (data.success) {
        // Atualizar session
        await update({ twoFactorVerified: true })
        router.push('/dashboard')
      } else {
        setError('Código inválido')
      }
    } catch (error) {
      setError('Erro na verificação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Verificação em Duas Etapas
      </h1>

      <p className="text-gray-600 text-center mb-6">
        {useBackupCode 
          ? 'Digite um dos seus códigos de backup'
          : 'Digite o código do seu app autenticador'
        }
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={useBackupCode ? 'Código de backup' : 'Código 2FA'}
            className="w-full text-center text-2xl border border-gray-300 rounded-md px-3 py-3 tracking-widest"
            maxLength={useBackupCode ? 8 : 6}
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => setUseBackupCode(!useBackupCode)}
          className="text-blue-600 hover:underline text-sm"
        >
          {useBackupCode 
            ? 'Usar código do app autenticador'
            : 'Usar código de backup'
          }
        </button>
      </div>
    </div>
  )
}
```

### 5. **APIs de Autenticação**

#### **A. Configurar 2FA:**
```typescript
// src/app/api/auth/2fa/setup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { TwoFactorService } from '@/services/auth/two-factor.service'
import { authConfig } from '@/lib/auth.config'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const twoFactorService = new TwoFactorService()
    const setup = await twoFactorService.generateSecret(
      session.user.id,
      session.user.email!
    )

    return NextResponse.json({
      qrCodeUrl: setup.qrCodeUrl,
      backupCodes: setup.backupCodes
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao configurar 2FA' },
      { status: 500 }
    )
  }
}
```

#### **B. Verificar 2FA:**
```typescript
// src/app/api/auth/2fa/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { TwoFactorService } from '@/services/auth/two-factor.service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    const { token } = await request.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const twoFactorService = new TwoFactorService()
    const verified = await twoFactorService.verifyToken(session.user.id, token)

    return NextResponse.json({ success: verified })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro na verificação' },
      { status: 500 }
    )
  }
}
```

### 6. **Security Enhancements**

#### **A. Rate limiting:**
```typescript
// src/lib/rate-limit.ts
import { NextRequest } from 'next/server'

const attempts = new Map<string, { count: number, lastAttempt: number }>()

export function rateLimit(identifier: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const userAttempts = attempts.get(identifier)

  if (!userAttempts) {
    attempts.set(identifier, { count: 1, lastAttempt: now })
    return { success: true, remaining: limit - 1 }
  }

  // Reset if window has passed
  if (now - userAttempts.lastAttempt > windowMs) {
    attempts.set(identifier, { count: 1, lastAttempt: now })
    return { success: true, remaining: limit - 1 }
  }

  // Check if limit exceeded
  if (userAttempts.count >= limit) {
    return { 
      success: false, 
      remaining: 0,
      resetTime: userAttempts.lastAttempt + windowMs
    }
  }

  // Increment count
  userAttempts.count++
  userAttempts.lastAttempt = now
  attempts.set(identifier, userAttempts)

  return { success: true, remaining: limit - userAttempts.count }
}
```

#### **B. Criptografia:**
```typescript
// src/lib/crypto.ts
import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const secretKey = process.env.ENCRYPTION_KEY! // 32 bytes key

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(algorithm, secretKey)
  cipher.setAAD(Buffer.from('BSOS-2FA', 'utf8'))
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
}

export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const authTag = Buffer.from(parts[1], 'hex')
  const encrypted = parts[2]
  
  const decipher = crypto.createDecipher(algorithm, secretKey)
  decipher.setAAD(Buffer.from('BSOS-2FA', 'utf8'))
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

---

## ✅ **Checklist de Implementação**

### **Setup Básico:**
- [ ] Instalar NextAuth.js e dependências
- [ ] Configurar providers (Google, Apple, Credentials)
- [ ] Implementar middleware de autenticação
- [ ] Configurar role-based access control

### **2FA Implementation:**
- [ ] Adicionar campos ao schema do banco
- [ ] Implementar TwoFactorService
- [ ] Criar APIs de configuração e verificação
- [ ] Implementar componentes de UI

### **Security Features:**
- [ ] Implementar rate limiting
- [ ] Configurar criptografia para secrets
- [ ] Log de tentativas de login
- [ ] Session tracking

### **OAuth Providers:**
- [ ] Configurar Google OAuth com Calendar scope
- [ ] Configurar Apple OAuth
- [ ] Testar fluxo de autenticação
- [ ] Implementar account linking

### **UI/UX:**
- [ ] Criar telas de login/registro
- [ ] Implementar setup de 2FA
- [ ] Criar dashboard de configurações
- [ ] Implementar logout em todos os dispositivos

**Tempo estimado: 1-2 semanas** 🔐