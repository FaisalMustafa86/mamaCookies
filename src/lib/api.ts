// ---------------------------------------------------------------------------
// API client — THE single boundary between the React app and the backend.
// Everything the app reads/writes goes through here. Same-origin in production;
// proxied to the Express server in dev (see vite.config.ts).
// ---------------------------------------------------------------------------

import type {
  Category,
  Order,
  OrderStatus,
  Product,
  CartItem,
  Fulfilment,
  PaymentMethod,
} from "../data/types";

// Auth is now carried by an HttpOnly session cookie set by the server — JS can't
// read it (XSS-resistant). A readable CSRF cookie is echoed back in a header on
// every state-changing request (double-submit CSRF defense).
const CSRF_COOKIE = "mc_csrf";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** True if a (non-expired-by-cookie) admin session marker is present. */
export function hasSession(): boolean {
  return readCookie(CSRF_COOKIE) !== null;
}

type Opts = { method?: string; body?: unknown; auth?: boolean };

async function request<T>(path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  const method = opts.method ?? "GET";
  // Attach the CSRF header on state-changing requests.
  if (method !== "GET" && method !== "HEAD") {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers["x-csrf-token"] = csrf;
  }
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    credentials: "same-origin", // send/receive the session + CSRF cookies
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ---- Public ----------------------------------------------------------------

export const api = {
  categories: () => request<Category[]>("/categories"),
  products: () => request<Product[]>("/products"),
  product: (id: string) => request<Product>(`/products/${id}`),
  order: (id: string) => request<Order>(`/orders/${id}`),

  checkout: (input: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address?: string;
    fulfilment: Fulfilment;
    paymentMethod: PaymentMethod;
    items: CartItem[];
  }) =>
    request<{ orderId: string; redirectUrl: string; total: number }>(
      "/checkout",
      { method: "POST", body: input },
    ),

  // ---- Admin auth ----
  login: (username: string, password: string) =>
    request<{ ok: true; csrf: string }>("/auth/login", {
      method: "POST",
      body: { username, password },
    }),
  logout: () => request<{ ok: true }>("/auth/logout", { method: "POST" }),

  // ---- Admin ----
  adminOrders: () => request<Order[]>("/admin/orders", { auth: true }),
  setOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/admin/orders/${id}`, {
      method: "PATCH",
      body: { status },
      auth: true,
    }),

  addProduct: (input: Omit<Product, "id">) =>
    request<Product>("/admin/products", {
      method: "POST",
      body: input,
      auth: true,
    }),
  updateProduct: (id: string, patch: Partial<Product>) =>
    request<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: patch,
      auth: true,
    }),
  deleteProduct: (id: string) =>
    request<{ ok: true }>(`/admin/products/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  addCategory: (input: Omit<Category, "id">) =>
    request<Category>("/admin/categories", {
      method: "POST",
      body: input,
      auth: true,
    }),
  updateCategory: (id: string, patch: Partial<Category>) =>
    request<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: patch,
      auth: true,
    }),
  deleteCategory: (id: string) =>
    request<{ ok: true }>(`/admin/categories/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};
