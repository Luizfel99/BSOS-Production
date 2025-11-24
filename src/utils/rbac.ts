// VS AI: DO NOT MODIFY ROLE STRINGS (cleaner, supervisor, manager, owner, client, admin).
// RBAC centralizado — admin tem acesso total.

export type UserRole =
  | "cleaner"
  | "supervisor"
  | "manager"
  | "owner"
  | "client"
  | "admin";

export type ModuleKey =
  | "dashboard"
  | "tasks"
  | "team"
  | "properties"
  | "finance"
  | "analytics"
  | "notifications"
  | "settings"
  | "training";

export type ActionKey = "read" | "create" | "update" | "delete" | "export" | "approve";

export interface Permission {
  module: ModuleKey | "*";
  action: ActionKey | "*";
}

export interface RBACUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: Permission[];
}

const MODULES: Record<ModuleKey, readonly ActionKey[]> = {
  dashboard: ["read"],
  tasks: ["read", "create", "update", "delete", "export", "approve"],
  team: ["read", "create", "update", "delete"],
  properties: ["read", "create", "update", "delete", "export"],
  finance: ["read", "export"],
  analytics: ["read", "export"],
  notifications: ["read", "create", "delete"],
  settings: ["read", "update"],
  training: ["read", "create", "update"],
} as const;

const ROLE_PERMISSIONS: Record<Exclude<UserRole, "admin">, Permission[]> = {
  cleaner: [{ module: "tasks", action: "read" }],
  supervisor: [
    { module: "tasks", action: "*" },
    { module: "team", action: "read" },
  ],
  manager: [
    { module: "tasks", action: "*" },
    { module: "team", action: "*" },
    { module: "properties", action: "*" },
    { module: "analytics", action: "read" },
  ],
  owner: [
    { module: "*", action: "read" },
    { module: "finance", action: "export" },
  ],
  client: [{ module: "properties", action: "read" }],
};

function hasMatch(perms: Permission[], module: ModuleKey, action: ActionKey): boolean {
  return perms.some((p) => {
    const mOk = p.module === "*" || p.module === module;
    const aOk = p.action === "*" || p.action === action;
    return mOk && aOk;
  });
}

export function can(user: RBACUser | null | undefined, module: ModuleKey, action: ActionKey): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;

  const base =
    user.permissions && user.permissions.length > 0
      ? user.permissions
      : ROLE_PERMISSIONS[user.role as Exclude<UserRole, "admin">] ?? [];

  const actionSafe = (MODULES[module]?.includes(action) ? action : "read") as ActionKey;

  return hasMatch(base, module, actionSafe);
}

export const canRead = (u: RBACUser | null | undefined, m: ModuleKey) => can(u, m, "read");
export const canCreate = (u: RBACUser | null | undefined, m: ModuleKey) => can(u, m, "create");
export const canUpdate = (u: RBACUser | null | undefined, m: ModuleKey) => can(u, m, "update");
export const canDelete = (u: RBACUser | null | undefined, m: ModuleKey) => can(u, m, "delete");
export const canExport = (u: RBACUser | null | undefined, m: ModuleKey) => can(u, m, "export");
export const canApprove = (u: RBACUser | null | undefined, m: ModuleKey) => can(u, m, "approve");
