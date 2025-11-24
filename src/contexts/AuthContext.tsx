"use client";

// VS AI: DO NOT MODIFY CASE OF ROLE STRINGS.
// Valid roles: "cleaner", "supervisor", "manager", "owner", "client", "admin".
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "cleaner" | "supervisor" | "manager" | "owner" | "client" | "admin";

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
}

// util: timeout curto para não travar navegação
async function raceTimeout<T>(ms: number, p: Promise<T>): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))
  ]);
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // retry exponencial (não bloqueante) para ambientes frios
  const fetchProfile = useCallback(async () => {
    const tries = [500, 1000, 2000, 4000]; // ~7.5s total (com 2.5s do primeiro race)
    const attempt = async () => {
      try {
        const res = await raceTimeout(2500, axios.get("/api/auth/me"));
        if (res?.data?.user) setUser(res.data.user as User);
        return true;
      } catch {
        return false;
      }
    };
    if (await attempt()) return;
    for (const backoff of tries) {
      await new Promise((r) => setTimeout(r, backoff));
      if (await attempt()) return;
    }
  }, []);

  // monta com token local → tenta perfil rápido
  useEffect(() => {
    const stored = localStorage.getItem("auth_token");
    if (stored) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    const w = setTimeout(() => setLoading(false), 8000); // watchdog
    return () => clearTimeout(w);
  }, [fetchProfile]);

  async function login(email: string, password: string) {
    // chamada rápida: já retorna user + seta cookie httpOnly
    const res = await axios.post("/api/auth/login", { email, password });
    const token: string = res.data.token;
    const u: User = res.data.user;

    // otimista: já seta tudo e navega
    localStorage.setItem("auth_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(u);

    // navega já
    router.replace("/dashboard");

    // atualiza perfil em background, sem bloquear
    fetchProfile().catch(() => {});
  }

  async function loginDemo(role: UserRole) {
    const res = await axios.post("/api/auth/login", { demo: true, role });
    const token: string = res.data.token;
    const u: User = res.data.user;

    localStorage.setItem("auth_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(u);

    router.replace("/dashboard");
    fetchProfile().catch(() => {});
  }

  async function logout() {
    try {
      await axios.post("/api/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("auth_token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-code"];
      if (!publicRoutes.includes(pathname)) router.replace("/login");
    }
  }

  async function refreshUser() {
    await fetchProfile();
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginDemo,
    logout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
