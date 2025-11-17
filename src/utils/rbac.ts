// VS AI: DO NOT MODIFY ROLE STRINGS (cleaner, supervisor, manager, owner, client, admin).
// IF YOU CHANGE TO PascalCase, the entire RBAC system breaks.

/**
 * Role-Based Access Control (RBAC) Utilities
 * Provides comprehensive permission management for the BSOS platform
 *
 * Uses simplified User type from AuthContext (without passwordHash, active, createdAt)
 */

import React from "react";
import {
  Shield,
  Users,
  Building,
  FileText,
  Settings,
  DollarSign,
  Clock,
  BarChart,
} from "lucide-react";
import { UserRole, User } from "@/contexts/AuthContext";
// Usando User do AuthContext (modelo simplificado sem passwordHash, active, createdAt)

// Define Permission type locally
export interface Permission {
  module: string;
  actions: string[];
}

// Define all possible actions in the system
export type Action =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "upload_photo"
  | "checklist"
  | "feedback"
  | "audit"
  | "message"
  | "evaluate"
  | "export"
  | "configure"
  | "approve_payment"
  | "manage_users"
  | "view_reports"
  | "access_analytics"
  | "manage_integrations"
  | "view_finance"
  | "edit_templates"
  | "access";

// Define system modules
export type Module =
  | "core"
  | "manager"
  | "client"
  | "finance"
  | "analytics"
  | "integrations"
  | "reports"
  | "users"
  | "settings"
  | "templates"
  | "dashboard"
  | "tasks"
  | "properties"
  | "employees"
  | "payments";

/* -----------------------------------------------
   ROLE PERMISSIONS (usando lowercase conforme AuthContext)
------------------------------------------------*/
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { module: "core", actions: ["view", "create", "update", "delete"] },
    { module: "manager", actions: ["view", "create", "update", "delete"] },
    { module: "client", actions: ["view"] },
    {
      module: "finance",
      actions: ["view", "create", "update", "delete", "view_finance"],
    },
    {
      module: "analytics",
      actions: ["view", "export", "configure", "access_analytics"],
    },
    {
      module: "tasks",
      actions: ["view", "create", "update", "delete", "approve"],
    },
    {
      module: "employees",
      actions: ["view", "create", "update", "delete", "manage_users"],
    },
    { module: "properties", actions: ["view", "create", "update", "delete"] },
    { module: "reports", actions: ["view", "export", "view_reports"] },
    {
      module: "integrations",
      actions: ["view", "create", "update", "delete", "manage_integrations"],
    },
    {
      module: "templates",
      actions: ["view", "create", "update", "delete", "edit_templates"],
    },
    {
      module: "settings",
      actions: ["view", "create", "update", "delete", "configure"],
    },
    {
      module: "users",
      actions: ["view", "create", "update", "delete", "manage_users"],
    },
    {
      module: "payments",
      actions: ["view", "create", "update", "delete", "approve_payment"],
    },
    { module: "dashboard", actions: ["view", "access"] },
  ],

  cleaner: [
    {
      module: "core",
      actions: ["view", "update", "upload_photo", "checklist"],
    },
    { module: "tasks", actions: ["view", "update"] },
    { module: "dashboard", actions: ["view", "access"] },
  ],

  supervisor: [
    {
      module: "core",
      actions: ["view", "create", "update", "approve", "feedback", "audit"],
    },
    { module: "tasks", actions: ["view", "create", "update", "approve"] },
    { module: "employees", actions: ["view", "feedback"] },
    { module: "reports", actions: ["view"] },
    { module: "analytics", actions: ["view", "access_analytics"] },
    { module: "dashboard", actions: ["view", "access"] },
    { module: "manager", actions: ["view"] },
  ],

  manager: [
    { module: "core", actions: ["view", "create", "update", "delete"] },
    {
      module: "manager",
      actions: ["view", "create", "update", "approve_payment"],
    },
    {
      module: "tasks",
      actions: ["view", "create", "update", "delete", "approve"],
    },
    {
      module: "employees",
      actions: ["view", "create", "update", "manage_users"],
    },
    { module: "properties", actions: ["view", "create", "update", "delete"] },
    { module: "reports", actions: ["view", "export"] },
    { module: "analytics", actions: ["view", "export", "access_analytics"] },
    { module: "integrations", actions: ["view", "configure"] },
    { module: "templates", actions: ["view", "edit_templates"] },
    { module: "dashboard", actions: ["view", "access"] },
    { module: "finance", actions: ["view"] },
  ],

  owner: [
    { module: "core", actions: ["view", "create", "update", "delete"] },
    { module: "manager", actions: ["view", "create", "update", "delete"] },
    { module: "client", actions: ["view"] },
    {
      module: "finance",
      actions: ["view", "create", "update", "delete", "view_finance"],
    },
    {
      module: "analytics",
      actions: ["view", "export", "configure", "access_analytics"],
    },
    {
      module: "tasks",
      actions: ["view", "create", "update", "delete", "approve"],
    },
    {
      module: "employees",
      actions: ["view", "create", "update", "delete", "manage_users"],
    },
    { module: "properties", actions: ["view", "create", "update", "delete"] },
    { module: "reports", actions: ["view", "export", "view_reports"] },
    {
      module: "integrations",
      actions: ["view", "create", "update", "delete", "manage_integrations"],
    },
    {
      module: "templates",
      actions: ["view", "create", "update", "delete", "edit_templates"],
    },
    {
      module: "settings",
      actions: ["view", "create", "update", "delete", "configure"],
    },
    {
      module: "users",
      actions: ["view", "create", "update", "delete", "manage_users"],
    },
    {
      module: "payments",
      actions: ["view", "create", "update", "delete", "approve_payment"],
    },
    { module: "dashboard", actions: ["view", "access"] },
  ],

  client: [
    { module: "client", actions: ["view", "evaluate", "message"] },
    { module: "properties", actions: ["view"] },
    { module: "tasks", actions: ["view"] },
    { module: "reports", actions: ["view"] },
    { module: "dashboard", actions: ["view", "access"] },
  ],
};

/* -----------------------------------------------
   FEATURE ACCESS (CORRIGIDO)
------------------------------------------------*/
export const FEATURE_ACCESS: Record<string, UserRole[]> = {
  "task-management": ["cleaner", "supervisor", "manager", "owner"],
  "photo-upload": ["cleaner", "supervisor", "manager", "owner"],
  checklist: ["cleaner", "supervisor", "manager", "owner"],
  "employee-management": ["supervisor", "manager", "owner"],
  "property-management": ["manager", "owner", "client"],
  "payment-approval": ["manager", "owner"],
  "template-editing": ["manager", "owner"],
  "analytics-dashboard": ["supervisor", "manager", "owner"],
  "financial-reports": ["manager", "owner"],
  "performance-reports": ["supervisor", "manager", "owner"],
  "export-data": ["manager", "owner"],
  "client-portal": ["client", "owner"],
  "service-evaluation": ["client"],
  "property-communication": ["client", "manager", "owner"],
  "user-management": ["owner"],
  "system-settings": ["owner"],
  "integration-management": ["manager", "owner"],
  "audit-logs": ["supervisor", "manager", "owner"],
};

/* -----------------------------------------------
   NAVIGATION ACCESS (CORRIGIDO)
------------------------------------------------*/
export const NAVIGATION_ACCESS: Record<UserRole, string[]> = {
  cleaner: ["dashboard", "tasks", "checklist", "profile"],
  supervisor: ["dashboard", "tasks", "team", "reports", "analytics", "profile"],
  manager: [
    "dashboard",
    "tasks",
    "team",
    "properties",
    "reports",
    "analytics",
    "integrations",
    "profile",
  ],
  owner: [
    "dashboard",
    "tasks",
    "team",
    "properties",
    "reports",
    "analytics",
    "finance",
    "settings",
    "integrations",
    "profile",
  ],
  client: ["dashboard", "properties", "services", "messages", "profile"],
  admin: [
    "dashboard",
    "tasks",
    "team",
    "properties",
    "finance",
    "reports",
    "analytics",
    "integrations",
    "settings",
    "profile",
  ],
};

/* -----------------------------------------------
   FUNCTIONS (NÃO PRECISAM DE AJUSTE)
------------------------------------------------*/
export function hasPermission(
  user: User | null,
  module: Module,
  action: Action,
): boolean {
  if (!user) return false;
  const perms = ROLE_PERMISSIONS[user.role] || [];
  const modulePerm = perms.find((p) => p.module === module);
  return modulePerm?.actions.includes(action) || false;
}

export function canAccessFeature(user: User | null, feature: string): boolean {
  if (!user) return false;
  const roles = FEATURE_ACCESS[feature];
  return roles ? roles.includes(user.role) : false;
}

export function getAccessibleNavigation(user: User | null): string[] {
  if (!user) return [];
  return NAVIGATION_ACCESS[user.role] || [];
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false;
  const ROUTES: Record<string, UserRole[]> = {
    "/dashboard": [
      "cleaner",
      "supervisor",
      "manager",
      "owner",
      "client",
      "admin",
    ],
    "/tasks": ["cleaner", "supervisor", "manager", "owner", "admin"],
    "/team": ["supervisor", "manager", "owner", "admin"],
    "/properties": ["manager", "owner", "client", "admin"],
    "/reports": ["supervisor", "manager", "owner", "client", "admin"],
    "/analytics": ["owner", "admin"],
    "/finance": ["manager", "owner", "admin"],
    "/settings": ["owner", "admin"],
    "/integrations": ["manager", "owner", "admin"],
    "/client": ["client", "owner", "admin"],
    "/admin": ["owner", "admin"],
  };

  const roles = ROUTES[route];
  return roles ? roles.includes(user.role) : true;
}

export function getRoleDashboardConfig(role: UserRole) {
  const CFG = {
    cleaner: {
      defaultView: "tasks",
      widgets: ["my-tasks", "recent-activity", "notifications"],
      actions: ["view-tasks", "upload-photos", "complete-checklist"],
    },
    supervisor: {
      defaultView: "overview",
      widgets: [
        "team-performance",
        "pending-approvals",
        "quality-metrics",
        "notifications",
      ],
      actions: ["review-tasks", "approve-work", "manage-team", "view-reports"],
    },
    manager: {
      defaultView: "management",
      widgets: [
        "property-overview",
        "team-stats",
        "financial-summary",
        "performance-metrics",
      ],
      actions: [
        "manage-properties",
        "approve-payments",
        "view-analytics",
        "manage-team",
      ],
    },
    owner: {
      defaultView: "analytics",
      widgets: [
        "business-metrics",
        "financial-overview",
        "performance-dashboard",
        "system-health",
      ],
      actions: [
        "full-analytics",
        "financial-management",
        "system-admin",
        "strategic-planning",
      ],
    },
    client: {
      defaultView: "services",
      widgets: [
        "my-properties",
        "service-history",
        "upcoming-cleanings",
        "messages",
      ],
      actions: [
        "view-properties",
        "schedule-services",
        "rate-services",
        "contact-support",
      ],
    },
    admin: {
      defaultView: "analytics",
      widgets: [
        "business-metrics",
        "financial-overview",
        "performance-dashboard",
        "system-health",
      ],
      actions: ["full-analytics", "system-admin", "manage-users"],
    },
  };

  return CFG[role];
}

export function filterMenuByPermissions(
  user: User | null,
  items: any[],
): any[] {
  if (!user) return [];
  return items.filter((item) => {
    if (item.requiredPermission) {
      const [module, action] = item.requiredPermission.split(":");
      return hasPermission(user, module as Module, action as Action);
    }
    if (item.requiredFeature)
      return canAccessFeature(user, item.requiredFeature);
    if (item.allowedRoles) return item.allowedRoles.includes(user.role);
    return true;
  });
}

export function getUserCapabilityLevel(
  user: User | null,
): "basic" | "intermediate" | "advanced" | "admin" {
  if (!user) return "basic";

  const CAP = {
    cleaner: "basic",
    client: "basic",
    supervisor: "intermediate",
    manager: "advanced",
    owner: "admin",
    admin: "admin",
  } as const;

  return CAP[user.role];
}

export function shouldShowAdvancedFeatures(user: User | null): boolean {
  const cap = getUserCapabilityLevel(user);
  return ["advanced", "admin"].includes(cap);
}

export function getRoleBasedHelp(user: User | null) {
  if (!user) return null;

  const HELP = {
    cleaner: {
      quickActions: [
        "Upload photos",
        "Complete checklist",
        "Update task status",
      ],
      helpTopics: [
        "How to use the mobile app",
        "Photo upload guidelines",
        "Checklist best practices",
      ],
      supportContact: "supervisor",
    },
    supervisor: {
      quickActions: ["Review completed work", "Approve tasks", "Give feedback"],
      helpTopics: [
        "Team management",
        "Quality control",
        "Performance tracking",
      ],
      supportContact: "manager",
    },
    manager: {
      quickActions: ["Manage properties", "Approve payments", "View reports"],
      helpTopics: [
        "Property management",
        "Team performance",
        "Financial overview",
      ],
      supportContact: "admin",
    },
    owner: {
      quickActions: ["View analytics", "System settings", "Strategic planning"],
      helpTopics: [
        "Business analytics",
        "System administration",
        "Growth strategies",
      ],
      supportContact: "technical_support",
    },
    client: {
      quickActions: ["Schedule cleaning", "Rate service", "Contact support"],
      helpTopics: [
        "Service booking",
        "Property management",
        "Billing questions",
      ],
      supportContact: "customer_service",
    },
    admin: {
      quickActions: ["System auditing", "User oversight", "Platform settings"],
      helpTopics: ["System architecture", "Security best practices"],
      supportContact: "technical_support",
    },
  };

  return HELP[user.role];
}
