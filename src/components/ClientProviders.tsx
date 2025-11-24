// ============================================================================
// FILE: src/components/ClientProviders.tsx
// WHY: unifica a ordem correta dos providers no lado do cliente
// ============================================================================
"use client";

import React from "react";
import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import I18nProvider from "@/components/I18nProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Ordem IMPORTA: I18n usa useAuth → AuthProviderWrapper precisa estar acima
  return (
    <AuthProviderWrapper>
      <I18nProvider>
        <ToastProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ToastProvider>
      </I18nProvider>
    </AuthProviderWrapper>
  );
}
