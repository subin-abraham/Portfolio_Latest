/**
 * Admin auth BFF client — browser only calls /api/auth/*.
 * Neon Auth is never contacted from the frontend.
 */

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
};

type AuthOk = { ok: true };
type AuthErr = { ok: false; error: string; status: number };

async function postAuth<T extends Record<string, unknown>>(
  path: string,
  body?: Record<string, unknown>
): Promise<(AuthOk & T) | AuthErr> {
  try {
    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });

    const json = (await res.json().catch(() => ({}))) as T & {
      ok?: boolean;
      error?: string;
    };

    if (!res.ok || json.ok === false) {
      return {
        ok: false,
        error: json.error || "Request failed",
        status: res.status,
      };
    }

    return { ok: true, ...(json as T) };
  } catch {
    return {
      ok: false,
      error: "Cannot reach the admin API. Is the server running?",
      status: 0,
    };
  }
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
  website?: string;
}): Promise<
  | { ok: true; admin: { id: string; email: string; displayName: string } }
  | AuthErr
> {
  return postAuth<{
    admin: { id: string; email: string; displayName: string };
  }>("/api/auth/login", input);
}

export async function signOut(): Promise<void> {
  await postAuth("/api/auth/logout");
}

export async function fetchAdminSession(): Promise<AdminSessionUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      admin?: { id: string; email: string; displayName: string };
    };
    if (!res.ok || !json.ok || !json.admin) return null;
    return {
      id: json.admin.id,
      email: json.admin.email,
      name: json.admin.displayName || json.admin.email,
    };
  } catch {
    return null;
  }
}
