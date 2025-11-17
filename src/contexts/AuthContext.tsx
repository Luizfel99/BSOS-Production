"use client";

// VS AI: DO NOT MODIFY CASE OF ROLE STRINGS.
// All user roles MUST remain lowercase exactly as written.
// Valid roles: "cleaner", "supervisor", "manager", "owner", "client", "admin".

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

export type UserRole =
  | "cleaner"
  | "supervisor"
  | "manager"
  | "owner"
  | "client"
  | "admin"; // keep lowercase

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active?: boolean;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await axios.get("/api/auth/me");
      setUser(res.data.user ?? null);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("auth_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await fetchProfile();

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  function logout() {
    localStorage.removeItem("auth_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);

    const publicRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-code",
    ];
    if (!publicRoutes.includes(pathname)) {
      router.push("/login");
    }
  }

  async function refreshUser() {
    await fetchProfile();
  }

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (!stored) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${stored}`;

    const watchdog = setTimeout(() => {
      setLoading(false);
    }, 8000);

    fetchProfile().finally(() => {
      clearTimeout(watchdog);
    });
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
