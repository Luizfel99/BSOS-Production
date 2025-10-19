import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuração de rotas protegidas - Edge Runtime compatible
const protectedRoutes = [
  '/dashboard',
  '/bsos',
  '/finance',
  '/analytics',
  '/api/finance',
  '/api/dashboard',
  '/api/analytics'
];

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/demo',
  '/mobile-test',
  '/api/auth',
  '/api/health',
  '/webhooks'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permitir arquivos estáticos e rotas da API Next.js
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') // arquivos estáticos
  ) {
    return NextResponse.next();
  }

  // Verificar se é uma rota pública - allow exact matches and subpaths
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'; // Only exact match for root
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar se é uma rota protegida (all routes not public are considered protected)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  ) || !isPublicRoute; // Default to protected if not explicitly public

  if (isProtectedRoute) {
    // Verificar token de autenticação - check for BSOS user cookies
    const userCookie = request.cookies.get('bsos-user')?.value;
    const roleCookie = request.cookies.get('bsos-selected-role')?.value;
    const authToken = request.cookies.get('auth-token')?.value;
    
    // If no user authentication cookies found, redirect to login
    if (!userCookie || !roleCookie || !authToken) {
      console.log('Missing authentication cookies, redirecting to login for:', pathname);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Validate user cookie contains valid JSON
    try {
      const userData = JSON.parse(userCookie);
      if (!userData || !userData.id || !userData.email || !userData.role) {
        console.log('Invalid user data in cookie, redirecting to login');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Validate role matches the role cookie
      if (userData.role !== roleCookie) {
        console.log('Role mismatch between cookies, redirecting to login');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Basic auth-token validation (userId-timestamp format)
      if (!authToken.includes('-') || !authToken.startsWith(userData.id)) {
        console.log('Invalid auth token format, redirecting to login');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      console.log('Authentication valid for user:', userData.email, 'accessing:', pathname);
      
    } catch (error) {
      console.log('Error parsing user cookie, redirecting to login');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};