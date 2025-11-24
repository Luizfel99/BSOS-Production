import { logoutAction } from "@/app/actions/logout";

/**
 * Server-side logout button using Server Action
 * 
 * Why: Works without JavaScript enabled - provides progressive enhancement.
 */
export default function ServerLogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded px-3 py-2 border hover:bg-gray-50"
        aria-label="Sign out"
      >
        Sign out (server)
      </button>
    </form>
  );
}
