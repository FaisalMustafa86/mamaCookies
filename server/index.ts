import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import {
  PORT,
  DELIVERY_FEE,
  FREE_DELIVERY_OVER,
  PAYMENTS_MODE,
  baseUrlFrom,
} from "./config.js";
import {
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
import { checkCredentials, issueToken, requireAdmin } from "./auth.js";
import { paymentsRouter, paymentRedirectUrl } from "./payments.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");

seedIfEmpty();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // gateway form posts

// ---- Public catalog --------------------------------------------------------

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/categories", (_req, res) => res.json(getCategories()));
app.get("/api/products", (_req, res) => res.json(getProducts()));
app.get("/api/products/:id", (req, res) => {
  const p = getProduct(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// Single order — public, used by the order confirmation / tracking page.
app.get("/api/orders/:id", (req, res) => {
  const o = getOrder(req.params.id);
  if (!o) return res.status(404).json({ error: "Not found" });
  res.json(o);
});

// ---- Checkout + payments ---------------------------------------------------

function discounted(price: number, pct?: number): number {
  if (!pct) return price;
  return Math.round(price * (1 - pct / 100));
}

app.post("/api/checkout", (req, res) => {
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
    const p = getProduct(String(it.productId));
    const qty = Math.max(1, Math.floor(Number(it.quantity) || 0));
    if (!p || !p.inStock) continue;
    const price = discounted(p.price, p.discountPercent);
    subtotal += price * qty;
    lines.push({ name: p.name, quantity: qty, price });
  }
  if (lines.length === 0) {
    return res.status(400).json({ error: "No valid items in cart" });
  }

  const delivery =
    fulfil === "pickup" || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const order = createOrder({
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

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (!checkCredentials(String(username ?? ""), String(password ?? ""))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ token: issueToken() });
});

// ---- Admin: orders ---------------------------------------------------------

app.get("/api/admin/orders", requireAdmin, (_req, res) =>
  res.json(getOrders()),
);

const STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
app.patch("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const status = req.body?.status as OrderStatus;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  if (!getOrder(req.params.id)) {
    return res.status(404).json({ error: "Not found" });
  }
  updateOrderStatus(req.params.id, status);
  res.json(getOrder(req.params.id));
});

// ---- Admin: products -------------------------------------------------------

app.post("/api/admin/products", requireAdmin, (req, res) =>
  res.status(201).json(addProduct(req.body)),
);
app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  if (!getProduct(req.params.id))
    return res.status(404).json({ error: "Not found" });
  updateProduct(req.params.id, req.body);
  res.json(getProduct(req.params.id));
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  deleteProduct(req.params.id);
  res.json({ ok: true });
});

// ---- Admin: categories -----------------------------------------------------

app.post("/api/admin/categories", requireAdmin, (req, res) =>
  res.status(201).json(addCategory(req.body)),
);
app.put("/api/admin/categories/:id", requireAdmin, (req, res) => {
  updateCategory(req.params.id, req.body);
  res.json(getCategories().find((c) => c.id === req.params.id));
});
app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const ok = deleteCategory(req.params.id);
  if (!ok)
    return res
      .status(409)
      .json({ error: "Category still has products" });
  res.json({ ok: true });
});

// ---- Static frontend + SPA fallback (production) ---------------------------

if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  // SPA fallback for any non-API GET (Express 5: use a catch-all middleware).
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(DIST, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(
    `🍪 Mama's Cookies API on http://localhost:${PORT}  (payments: ${PAYMENTS_MODE})`,
  );
  if (!fs.existsSync(DIST)) {
    console.log("   dist/ not built yet — run `npm run build` for production.");
  }
});
