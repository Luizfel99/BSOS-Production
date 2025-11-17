"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientOnly from "@/components/ClientOnly";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

interface AuthProviderWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for AuthProvider that prevents hydration mismatches
 * by only rendering on the client side with proper hydration handling
 */
export default function AuthProviderWrapper({
  children,
}: AuthProviderWrapperProps) {
  return (
    <ClientOnly fallback={<AuthLoadingScreen />}>
      <AuthProvider>{children}</AuthProvider>
    </ClientOnly>
  );
}
