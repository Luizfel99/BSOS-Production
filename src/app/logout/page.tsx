"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout(); // limpa cookie + localStorage e volta ao /login
  }, [logout]);

  return null;
}
