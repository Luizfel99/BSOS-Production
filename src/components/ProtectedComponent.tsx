/**
 * Protected Component - RBAC wrapper for conditional rendering
 * Only renders children if user has required permissions
 *
 * Uses User type from AuthContext (simplified model without passwordHash, active, createdAt)
 */

"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { can, type ModuleKey, type ActionKey } from "@/utils/rbac";

type Props = {
  module?: ModuleKey;
  action?: ActionKey;
  allowedRoles?: Array<"cleaner" | "supervisor" | "manager" | "owner" | "client" | "admin">;
  children: ReactNode;
};

export default function ProtectedComponent({ module, action = "read", allowedRoles, children }: Props) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return null;

  if (user.role === "admin") return <>{children}</>;

  if (allowedRoles && !allowedRoles.includes(user.role as any)) return null;
  if (module && !can(user as any, module, action)) return null;

  return <>{children}</>;
}
