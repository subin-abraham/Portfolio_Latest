/**
 * Client UI gate for /admin/register.
 * Server ENABLE_ADMIN_REGISTRATION is the real security boundary.
 */
export const adminRegistrationEnabled =
  import.meta.env.VITE_ENABLE_ADMIN_REGISTRATION === "true" ||
  import.meta.env.VITE_ENABLE_ADMIN_REGISTRATION === "1";

export async function fetchRegistrationEnabled(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/registration", {
      credentials: "include",
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { ok?: boolean; enabled?: boolean };
    return Boolean(json.ok && json.enabled);
  } catch {
    return false;
  }
}
