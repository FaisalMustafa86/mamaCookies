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

const TOKEN_KEY = "mamas-cookies:token";

export function getToken(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

type Opts = { method?: string; body?: unknown; auth?: boolean };

async function request<T>(path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  if (opts.auth) {
    const token = getToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }
  const res = await fetch(`/api${path}`, {
    method: opts.method ?? "GET",
    headers,
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
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: { username, password },
    }),

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
