"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

const MODE = process.env.NEXT_PUBLIC_AUTH_REDIRECT_MODE ?? "auto"; // "auto" | "manual"

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Em "auto", redireciona ao dashboard quando autenticado (somente client-side)
  useEffect(() => {
    if (MODE === "auto" && !loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) return <AuthLoadingScreen />;

  // Em "manual": sempre mostra login (mesmo autenticado)
  if (MODE === "manual") return <LoginScreen />;

  // Em "auto": se não autenticado → login; se autenticado, o effect dá replace
  return user ? <></> : <LoginScreen />;
}
