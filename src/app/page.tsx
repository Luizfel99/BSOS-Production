"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

/**
 * Nunca chame router.push()/replace() durante o render.
 * Este componente só navega dentro de useEffect, após saber se há user.
 */
export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) return <AuthLoadingScreen />;
  if (!user) return <LoginScreen />;
  return null;
}
