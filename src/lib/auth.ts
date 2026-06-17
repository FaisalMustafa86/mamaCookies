// ---------------------------------------------------------------------------
// Admin auth (client side). Real authentication now lives on the server:
// POST /api/auth/login returns a signed token which we keep in sessionStorage
// and send as a Bearer header on admin requests (see lib/api.ts).
// ---------------------------------------------------------------------------

import { api, getToken, setToken, clearToken } from "./api";

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  try {
    const { token } = await api.login(username, password);
    setToken(token);
    return true;
  } catch {
    return false;
  }
}

export function logout(): void {
  clearToken();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
