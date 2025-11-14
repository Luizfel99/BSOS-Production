"use client";

import { useAuth } from "./AuthContext";

export function useAuthAdapter() {
  const { user, loading, login, logout } = useAuth();

  return {
    user,
    login,
    logout,

    // Para compatibilidade com componentes antigos:
    isLoading: loading,
    authChecked: !loading,
    isHydrated: !loading && !!user,
  };
}
