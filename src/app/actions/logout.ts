"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Server Action for logout without JS
 * 
 * Why: Clears the HttpOnly auth_token cookie server-side and redirects to /login.
 * This provides a no-JS fallback for logout functionality.
 */
export async function logoutAction() {
  // Expire the auth_token cookie
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Invalidate pages that depend on auth state
  revalidatePath("/");
  revalidatePath("/dashboard");

  // Redirect to login page
  redirect("/login");
}
