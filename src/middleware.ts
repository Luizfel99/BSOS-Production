import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * why: redirects that avoid loops and ignore static/auth assets.
 * Cookie expected: "auth_token" (adjust if your API sets a different name).
 */
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-code",
];
const AUTH_PREFIXES = ["/api/auth", "/auth", "/signin", "/callback"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  // ignore static and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // ignore auth endpoints to avoid loops
  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    // allow nested public pages like /login/* if you ever split
    PUBLIC_PATHS.some((p) => p !== "/" && pathname.startsWith(`${p}/`));

  // already logged → keep away from /login (and root) to avoid blank screens
  if (token && (pathname === "/" || pathname === "/login")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // not logged → block private areas
  if (!token && !isPublic) {
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
