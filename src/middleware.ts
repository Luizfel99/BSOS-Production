import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-code", "/logout"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignora estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // APIs públicas de auth sempre liberadas
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Rotas públicas sempre liberadas (inclusive /login mesmo autenticado)
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Precisa estar autenticado (via cookie httpOnly)
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
};
