import "./env.js"; // must come first: loads .env before config/auth read it
import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { DELIVERY_FEE, FREE_DELIVERY_OVER, baseUrlFrom } from "./config.js";
import {
  initSchema,
  seedIfEmpty,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  type OrderStatus,
} from "./db.js";
import {
  checkCredentials,
  issueToken,
  issueCsrf,
  requireAdmin,
  requireCsrf,
  setAuthCookies,
  clearAuthCookies,
} from "./auth.js";
import { paymentsRouter, paymentRedirectUrl } from "./payments.js";
import { blockDotfiles, securityHeaders } from "./security.js";
import { asBoxSize, boxLabel, boxPrice } from "./pricing.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");

// One-time DB bootstrap. Created once per process (cold start on serverless);
// the gate middleware below makes every request wait for it before touching
// the database, so the very first request after a cold start is safe.
export const ready: Promise<void> = (async () => {
  await initSchema();
  await seedIfEmpty();
})();

export const app = express();

// ---- Security hardening (see server/security.ts) ---------------------------
// Behind Vercel's proxy so req.protocol/req.ip reflect the real client.
app.set("trust proxy", true);
// Don't advertise the framework (info leak), and use weak content-based ETags
// (size+mtime) so no filesystem inode information is ever exposed.
app.disable("x-powered-by");
app.set("etag", "weak");
app.use(securityHeaders);
app.use(blockDotfiles);

app.use(express.json());
// Gateway form posts are flat key=value — `extended: false` avoids the qs
// nested-object parser (prototype-pollution / over-posting surface).
app.use(express.urlencoded({ extended: false }));

// Make sure the schema + seed have finished before any handler runs.
app.use(async (_req, _res, next) => {
  try {
    await ready;
    next();
  } catch (err) {
    next(err);
  }
});

// ---- Public catalog --------------------------------------------------------

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/categories", async (_req, res) => res.json(await getCategories()));
app.get("/api/products", async (_req, res) => res.json(await getProducts()));
app.get("/api/products/:id", async (req, res) => {
  const p = await getProduct(String(req.params.id));
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// Single order — public, used by the order confirmation / tracking page.
app.get("/api/orders/:id", async (req, res) => {
  const o = await getOrder(String(req.params.id));
  if (!o) return res.status(404).json({ error: "Not found" });
  res.json(o);
});

// ---- Checkout + payments ---------------------------------------------------

function discounted(price: number, pct?: number): number {
  if (!pct) return price;
  // Clamp to a sane range so a bad/negative/over-100 discount can never produce
  // a negative or inflated line price.
  const clamped = Math.min(100, Math.max(0, pct));
  return Math.round(price * (1 - clamped / 100));
}

// ---- Admin write validation ------------------------------------------------

type ValidationError = { error: string };

async function validateProduct(b: unknown): Promise<ValidationError | null> {
  const o = (b ?? {}) as Record<string, unknown>;
  if (typeof o.name !== "string" || !o.name.trim())
    return { error: "name is required" };
  if (typeof o.categoryId !== "string" || !o.categoryId.trim())
    return { error: "categoryId is required" };
  if (!(await getCategories()).some((c) => c.id === o.categoryId))
    return { error: "categoryId does not exist" };
  if (typeof o.price !== "number" || !Number.isFinite(o.price) || o.price <= 0)
    return { error: "price must be greater than 0" };
  if (typeof o.unit !== "string" || !o.unit.trim())
    return { error: "unit is required" };
  if (
    o.discountPercent != null &&
    (typeof o.discountPercent !== "number" ||
      o.discountPercent < 0 ||
      o.discountPercent > 100)
  )
    return { error: "discountPercent must be between 0 and 100" };
  return null;
}

function validateCategory(b: unknown): ValidationError | null {
  const o = (b ?? {}) as Record<string, unknown>;
  if (typeof o.name !== "string" || !o.name.trim())
    return { error: "name is required" };
  if (typeof o.slug !== "string" || !o.slug.trim())
    return { error: "slug is required" };
  return null;
}

app.post("/api/checkout", async (req, res) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    address,
    fulfilment,
    paymentMethod,
    items,
  } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  if (!customerName || !customerPhone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }
  const fulfil = fulfilment === "pickup" ? "pickup" : "delivery";
  const method = paymentMethod === "card" ? "card" : "easypaisa";

  // Recompute the order server-side from trusted DB prices.
  const lines = [];
  let subtotal = 0;
  for (const it of items) {
    const p = await getProduct(String(it.productId));
    const qty = Math.max(1, Math.floor(Number(it.quantity) || 0));
    if (!p || !p.inStock) continue;
    // Box pricing is recomputed from trusted DB prices — never trust a
    // client-sent price. Size is validated to one of 1 / 4 / 8.
    const size = asBoxSize(it.size);
    const unit = discounted(p.price, p.discountPercent);
    const price = boxPrice(unit, size);
    const name = size === 1 ? p.name : `${p.name} — ${boxLabel(size)}`;
    subtotal += price * qty;
    lines.push({ name, quantity: qty, price });
  }
  if (lines.length === 0) {
    return res.status(400).json({ error: "No valid items in cart" });
  }

  const delivery =
    fulfil === "pickup" || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const order = await createOrder({
    customerName: String(customerName).trim(),
    customerPhone: String(customerPhone).trim(),
    customerEmail: String(customerEmail ?? "").trim(),
    address: String(address ?? "").trim(),
    fulfilment: fulfil,
    paymentMethod: method,
    items: lines,
    total,
  });

  const redirectUrl = paymentRedirectUrl(order, baseUrlFrom(req));
  res.json({ orderId: order.id, redirectUrl, total });
});

// Gateway pages + payment callbacks (/pay/*, /api/payments/*)
app.use(paymentsRouter);

// ---- Admin auth ------------------------------------------------------------

// Simple in-memory rate limiter (no external dep) to throttle login brute force.
// Note: on serverless this is per-instance (best-effort), still useful.
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 5;

function loginRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > LOGIN_MAX;
}

app.post("/api/auth/login", (req, res) => {
  const ip = req.ip ?? "unknown";
  if (loginRateLimited(ip)) {
    return res
      .status(429)
      .json({ error: "Too many attempts. Try again later." });
  }
  const { username, password } = req.body ?? {};
  if (!checkCredentials(String(username ?? ""), String(password ?? ""))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Set the HttpOnly session cookie + readable CSRF cookie. The token is no
  // longer returned in the body (so XSS can't read it from sessionStorage).
  const csrf = issueCsrf();
  setAuthCookies(res, issueToken(), csrf);
  res.json({ ok: true, csrf });
});

// Clear the admin session.
app.post("/api/auth/logout", requireAdmin, requireCsrf, (_req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true });
});

// Lightweight session probe for the SPA's ProtectedRoute.
app.get("/api/auth/me", requireAdmin, (_req, res) => res.json({ ok: true }));

// ---- Admin: orders ---------------------------------------------------------

app.get("/api/admin/orders", requireAdmin, async (_req, res) =>
  res.json(await getOrders()),
);

const STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
app.patch(
  "/api/admin/orders/:id",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    const status = req.body?.status as OrderStatus;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    if (!(await getOrder(String(req.params.id)))) {
      return res.status(404).json({ error: "Not found" });
    }
    await updateOrderStatus(String(req.params.id), status);
    res.json(await getOrder(String(req.params.id)));
  },
);

// ---- Admin: products -------------------------------------------------------

app.post(
  "/api/admin/products",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    const invalid = await validateProduct(req.body);
    if (invalid) return res.status(400).json(invalid);
    res.status(201).json(await addProduct(req.body));
  },
);
app.put(
  "/api/admin/products/:id",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    const current = await getProduct(String(req.params.id));
    if (!current) return res.status(404).json({ error: "Not found" });
    const invalid = await validateProduct({ ...current, ...req.body });
    if (invalid) return res.status(400).json(invalid);
    await updateProduct(String(req.params.id), req.body);
    res.json(await getProduct(String(req.params.id)));
  },
);
app.delete(
  "/api/admin/products/:id",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    await deleteProduct(String(req.params.id));
    res.json({ ok: true });
  },
);

// ---- Admin: categories -----------------------------------------------------

app.post(
  "/api/admin/categories",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    const invalid = validateCategory(req.body);
    if (invalid) return res.status(400).json(invalid);
    res.status(201).json(await addCategory(req.body));
  },
);
app.put(
  "/api/admin/categories/:id",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    await updateCategory(String(req.params.id), req.body);
    const cats = await getCategories();
    res.json(cats.find((c) => c.id === req.params.id));
  },
);
app.delete(
  "/api/admin/categories/:id",
  requireAdmin,
  requireCsrf,
  async (req, res) => {
    const ok = await deleteCategory(String(req.params.id));
    if (!ok)
      return res.status(409).json({ error: "Category still has products" });
    res.json({ ok: true });
  },
);

// ---- Static frontend + SPA fallback (single-server / local production) -----
// On Vercel the static site is served by the platform and only /api + /pay
// reach this function, so this block is a no-op there.

if (fs.existsSync(DIST)) {
  // `dotfiles: "deny"` → 404 for any .git/.env/etc. that ends up in the build.
  app.use(express.static(DIST, { dotfiles: "deny" }));
  // SPA fallback for any non-API GET (Express 5: use a catch-all middleware).
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(DIST, "index.html"));
  });
}

// ---- Error handler (last) --------------------------------------------------
// Catches thrown DB/validation errors so raw SQLite messages (which can leak
// table and column names) never reach the client.
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    if (res.headersSent) return;
    res.status(500).json({ error: "Internal server error" });
  },
);

export default app;
