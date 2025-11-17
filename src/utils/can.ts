export type Resource = "tasks" | "team" | "properties";
export type Action = "read" | "create" | "update" | "delete";

type Role = "cleaner" | "supervisor" | "manager" | "owner" | "client" | "admin";

export interface MinimalUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// Matriz simples de permissões; ajuste conforme o negócio
const MATRIX: Record<Role, Partial<Record<Resource, Action[]>>> = {
  admin: {
    tasks: ["read", "create", "update", "delete"],
    team: ["read", "create", "update", "delete"],
    properties: ["read", "create", "update", "delete"],
  },
  manager: {
    tasks: ["read", "create", "update", "delete"],
    team: ["read", "update"],
    properties: ["read", "update"],
  },
  supervisor: {
    tasks: ["read", "update"],
    team: ["read"],
    properties: ["read"],
  },
  cleaner: {
    tasks: ["read", "update"], // update limited (server valida dono/assignee)
    team: [] as any,
    properties: ["read"],
  },
  owner: {
    tasks: ["read"],
    team: ["read"],
    properties: ["read"],
  },
  client: {
    tasks: ["read"],
    team: [] as any,
    properties: ["read"],
  },
};

export function can(user: MinimalUser | null | undefined, resource: Resource, action: Action): boolean {
  if (!user) return false;
  const role = user.role;
  const allowed = MATRIX[role]?.[resource] ?? [];
  return allowed.includes(action);
}
