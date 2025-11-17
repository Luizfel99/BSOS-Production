import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-code",
  "/api/health",
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignore static
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  // public paths
  if (PUBLIC.has(pathname)) return NextResponse.next();

  // auth check (cookie set by /api/auth/login)
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (token && (pathname === "/" || pathname === "/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
};
