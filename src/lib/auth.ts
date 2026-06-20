// ---------------------------------------------------------------------------
// Admin auth (client side). Authentication lives on the server: POST
// /api/auth/login sets an HttpOnly session cookie (unreadable by JS) plus a
// readable CSRF cookie. The SPA never holds the token; it only knows whether a
// session marker is present (see lib/api.ts).
// ---------------------------------------------------------------------------

import { api, hasSession } from "./api";

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    await api.login(username, password);
    return true;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.logout();
  } catch {
    /* clear-cookie best effort; ignore network/expired errors */
  }
}

export function isAuthenticated(): boolean {
  return hasSession();
}
