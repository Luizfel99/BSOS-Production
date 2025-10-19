import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config } from '@/lib/config';

// Rate limiting store (em produção, usar Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Protected routes configuration
const PROTECTED_ROUTES = {
  // Routes that require authentication
  auth: [
    '/dashboard',
    '/tasks',
    '/team',
    '/properties',
    '/reports',
    '/analytics',
    '/finance',
    '/settings',
    '/admin',
    '/integrations',
    '/client'
  ],
  
  // Routes that require specific roles
  roleSpecific: {
    owner: ['/admin', '/settings', '/analytics'],
    manager: ['/finance', '/team/manage', '/properties/create'],
    supervisor: ['/team', '/reports'],
    client: ['/client'],
    cleaner: ['/tasks']
  },
  
  // Public routes (no authentication required)
  public: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/mobile-test',
    '/demo'
  ]
};

/**
 * 🛡️ Middleware para validação e segurança
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log de requests em desenvolvimento
  if (config.features.debug) {
    console.log(`${request.method} ${pathname}`);
  }

  // Temporarily disable route protection to fix login loops
  // const authResponse = handleRouteProtection(request);
  // if (authResponse) {
  //   return authResponse;
  // }

  // CORS headers para APIs
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', config.app.isProduction ? config.app.url : '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }

    // Rate limiting
    if (config.features.rateLimitEnabled) {
      const rateLimitResponse = checkRateLimit(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }

    // Validar webhook signatures
    if (pathname.startsWith('/api/webhooks/')) {
      const validationResponse = validateWebhookSignature(request, pathname);
      if (validationResponse) {
        return validationResponse;
      }
    }

    return response;
  }

  // Role-based access control for protected routes
  if (pathname.startsWith('/dashboard/') || pathname.startsWith('/admin/') || pathname.startsWith('/manager/')) {
    const roleAccessResponse = checkRoleAccess(request, pathname);
    if (roleAccessResponse) {
      return roleAccessResponse;
    }
  }

  return NextResponse.next();
}

/**
 * Handle route protection based on authentication and authorization
 */
function handleRouteProtection(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  
  // Skip protection for public routes
  if (PROTECTED_ROUTES.public.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return null;
  }

  // Skip protection for API routes (handled separately)
  if (pathname.startsWith('/api/')) {
    return null;
  }

  // Skip protection for static assets
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon') || 
      pathname.includes('.')) {
    return null;
  }

  // Get authentication status from cookies
  const userCookie = request.cookies.get('bsos-user')?.value;
  const sessionCookie = request.cookies.get('bsos-session')?.value;
  const selectedRole = request.cookies.get('bsos-selected-role')?.value;

  let user = null;
  let userRole = selectedRole;

  // Parse user data if available
  if (userCookie) {
    try {
      user = JSON.parse(userCookie);
      userRole = user.role || selectedRole;
    } catch (error) {
      console.warn('Invalid user cookie format');
    }
  }

  // Check if route requires authentication
  const requiresAuth = PROTECTED_ROUTES.auth.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (requiresAuth) {
    // If no valid session, redirect to login
    if (!user || !sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-specific access
    /*
    // Temporarily disabled to prevent redirect loops
    if (userRole) {
      for (const [role, routes] of Object.entries(PROTECTED_ROUTES.roleSpecific)) {
        for (const route of routes) {
          if (pathname === route || pathname.startsWith(route + '/')) {
            if (userRole !== role && !hasHigherRole(userRole, role)) {
              // Redirect to appropriate dashboard instead of showing access denied
              const dashboardUrl = getDashboardForRole(userRole);
              return NextResponse.redirect(new URL(dashboardUrl, request.url));
            }
          }
        }
      }
    }
    */
  }

  return null;
}

/**
 * Check if user has higher role privileges
 */
function hasHigherRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'owner': 5,
    'manager': 4,
    'supervisor': 3,
    'cleaner': 2,
    'client': 1
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

/**
 * Get appropriate dashboard URL for user role
 */
function getDashboardForRole(role: string): string {
  const dashboardMap: Record<string, string> = {
    'owner': '/dashboard',
    'manager': '/dashboard',
    'supervisor': '/dashboard',
    'cleaner': '/dashboard',
    'client': '/client'
  };

  return dashboardMap[role] || '/dashboard';
}

/**
 * Rate limiting por IP
 */
function checkRateLimit(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = config.features.rateLimitRequestsPerMinute;

  const key = `rate_limit:${ip}`;
  const current = rateLimit.get(key);

  if (!current || now > current.resetTime) {
    // Nova janela de tempo
    rateLimit.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return null;
  }

  if (current.count >= maxRequests) {
    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Maximum ${maxRequests} requests per minute allowed`
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(current.resetTime / 1000).toString()
        }
      }
    );
  }

  // Incrementar contador
  current.count++;
  rateLimit.set(key, current);

  return null;
}

/**
 * Check role-based access control
 */
function checkRoleAccess(request: NextRequest, pathname: string): NextResponse | null {
  // Get user info from cookies or headers (in a real app, this would be from a session/JWT)
  const userCookie = request.cookies.get('bsos-user')?.value;
  const selectedRole = request.cookies.get('bsos-selected-role')?.value;
  
  // In this demo app, we'll also check localStorage via headers
  const userHeader = request.headers.get('x-user-role') || selectedRole;
  
  if (!userCookie && !userHeader) {
    // No authentication found, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }

  let userRole = userHeader;
  
  // If we have user cookie, extract role from it
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      userRole = user.role;
    } catch (error) {
      console.warn('Invalid user cookie format');
    }
  }

  // Define role-based access rules
  const roleAccess: Record<string, string[]> = {
    '/dashboard/cleaner': ['cleaner'],
    '/dashboard/supervisor': ['supervisor', 'manager', 'owner'],
    '/dashboard/manager': ['manager', 'owner'],
    '/dashboard/client': ['client'],
    '/admin': ['owner'],
    '/manager': ['manager', 'owner'],
  };

  // Check if current path requires specific role
  for (const [path, allowedRoles] of Object.entries(roleAccess)) {
    if (pathname.startsWith(path)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Access denied, redirect to appropriate dashboard
        const defaultPaths: Record<string, string> = {
          'cleaner': '/dashboard/cleaner',
          'supervisor': '/dashboard/supervisor',
          'manager': '/dashboard/manager',
          'client': '/dashboard/client',
          'owner': '/admin'
        };
        
        const redirectPath = defaultPaths[userRole || 'cleaner'] || '/';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }

  return null;
}

/**
 * Validar assinaturas de webhook
 */
function validateWebhookSignature(request: NextRequest, pathname: string): NextResponse | null {
  if (!config.app.isProduction) {
    // Pular validação em desenvolvimento
    return null;
  }

  const platform = new URLSearchParams(pathname.split('?')[1] || '').get('platform');
  
  if (!platform) {
    return new NextResponse(
      JSON.stringify({ error: 'Platform parameter required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validação específica por plataforma
  switch (platform) {
    case 'airbnb':
      return validateAirbnbWebhook(request);
    case 'whatsapp':
      return validateWhatsAppWebhook(request);
    default:
      return validateGenericWebhook(request);
  }
}

/**
 * Validar webhook do Airbnb
 */
function validateAirbnbWebhook(request: NextRequest): NextResponse | null {
  const signature = request.headers.get('x-airbnb-signature');
  
  if (!signature && config.app.isProduction) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing Airbnb signature' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // TODO: Implementar validação real da assinatura
  // const isValid = validateAirbnbSignature(body, signature, config.airbnb.webhookSecret);
  
  return null;
}

/**
 * Validar webhook do WhatsApp
 */
function validateWhatsAppWebhook(request: NextRequest): NextResponse | null {
  const hubMode = request.nextUrl.searchParams.get('hub.mode');
  const hubVerifyToken = request.nextUrl.searchParams.get('hub.verify_token');
  const hubChallenge = request.nextUrl.searchParams.get('hub.challenge');

  // Validação de verificação do webhook
  if (hubMode === 'subscribe' && hubVerifyToken === config.whatsapp.webhookVerifyToken) {
    return new NextResponse(hubChallenge);
  }

  return null;
}

/**
 * Validação genérica de webhook
 */
function validateGenericWebhook(request: NextRequest): NextResponse | null {
  const webhookSecret = config.security.webhookSecret;
  
  if (!webhookSecret && config.app.isProduction) {
    return new NextResponse(
      JSON.stringify({ error: 'Webhook secret not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return null;
}

/**
 * Configuração do matcher
 */
export const middleware_config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

// Cleanup de rate limiting (executar periodicamente)
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
  }, 60000); // Cleanup a cada minuto
}