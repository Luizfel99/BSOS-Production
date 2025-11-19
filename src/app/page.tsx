"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard"); // por que: evita navegar no render
  }, [loading, user, router]);

  if (loading) return <AuthLoadingScreen />;
  if (!user) return <LoginScreen />;
  return <></>;
}
