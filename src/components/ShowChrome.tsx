"use client";

import { PropsWithChildren, useMemo } from "react";
import { usePathname } from "next/navigation";

/** why: esconde header/nav/shortcuts em rotas públicas sem tocar nas páginas */
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-code",
  "/auth/callback",
];

export default function ShowChrome({ children }: PropsWithChildren) {
  const pathname = usePathname() || "/";
  const isPublic = useMemo(
    () => PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`)),
    [pathname]
  );
  if (isPublic) return null;
  return <>{children}</>;
}
