// Helpers server-side para usar dentro de rotas /api ou server components
import { NextResponse } from "next/server";
import { can, type ModuleKey, type ActionKey, type RBACUser } from "@/utils/rbac";

export function ensureHasPermission(user: RBACUser | null, module: ModuleKey, action: ActionKey) {
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (user.role === "admin") return null; // admin bypass total
  if (!can(user, module, action)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}
