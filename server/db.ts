import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  categories as seedCategories,
  products as seedProducts,
  orders as seedOrders,
} from "./seed.js";

// ---------------------------------------------------------------------------
// SQLite data layer. One file (data.sqlite by default) holds everything.
// This module is the single persistence boundary on the server side.
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH =
  process.env.DB_PATH ?? path.join(__dirname, "..", "data.sqlite");

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    slug        TEXT NOT NULL UNIQUE,
    icon        TEXT,
    description TEXT,
    sort        INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    categoryId      TEXT NOT NULL,
    price           INTEGER NOT NULL,
    unit            TEXT NOT NULL,
    image           TEXT NOT NULL DEFAULT '',
    description     TEXT NOT NULL DEFAULT '',
    inStock         INTEGER NOT NULL DEFAULT 1,
    featured        INTEGER NOT NULL DEFAULT 0,
    discountPercent INTEGER,
    tags            TEXT NOT NULL DEFAULT '[]',
    sort            INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id            TEXT PRIMARY KEY,
    customerName  TEXT NOT NULL,
    customerPhone TEXT NOT NULL DEFAULT '',
    customerEmail TEXT NOT NULL DEFAULT '',
    address       TEXT NOT NULL DEFAULT '',
    fulfilment    TEXT NOT NULL DEFAULT 'delivery',
    paymentMethod TEXT NOT NULL DEFAULT 'easypaisa',
    paymentStatus TEXT NOT NULL DEFAULT 'unpaid',
    status        TEXT NOT NULL DEFAULT 'pending',
    items         TEXT NOT NULL DEFAULT '[]',
    total         INTEGER NOT NULL DEFAULT 0,
    createdAt     TEXT NOT NULL
  );
`);

// ---- Types as the API exposes them (booleans, parsed tags/items) ----------

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  sort: number;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  discountPercent?: number;
  tags: string[];
  sort: number;
};

export type OrderLine = { name: string; quantity: number; price: number };
export type OrderStatus =
  | "pending"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  fulfilment: "delivery" | "pickup";
  paymentMethod: "easypaisa" | "card";
  paymentStatus: "unpaid" | "paid" | "failed";
  status: OrderStatus;
  items: OrderLine[];
  total: number;
  createdAt: string;
};

// ---- Row <-> domain mappers -----------------------------------------------

type ProductRow = Omit<Product, "inStock" | "featured" | "tags"> & {
  inStock: number;
  featured: number;
  tags: string;
};
type OrderRow = Omit<Order, "items"> & { items: string };

function mapProduct(r: ProductRow): Product {
  return {
    ...r,
    inStock: !!r.inStock,
    featured: !!r.featured,
    discountPercent: r.discountPercent ?? undefined,
    tags: JSON.parse(r.tags || "[]"),
  };
}

function mapOrder(r: OrderRow): Order {
  return { ...r, items: JSON.parse(r.items || "[]") };
}

// ---- Seeding ---------------------------------------------------------------

export function seedIfEmpty(): void {
  const count = (db.prepare("SELECT COUNT(*) AS n FROM products").get() as {
    n: number;
  }).n;
  if (count > 0) return;

  const insertCat = db.prepare(
    `INSERT INTO categories (id, name, slug, icon, description, sort)
     VALUES (@id, @name, @slug, @icon, @description, @sort)`,
  );
  const insertProd = db.prepare(
    `INSERT INTO products
       (id, name, categoryId, price, unit, image, description, inStock, featured, discountPercent, tags, sort)
     VALUES
       (@id, @name, @categoryId, @price, @unit, @image, @description, @inStock, @featured, @discountPercent, @tags, @sort)`,
  );
  const insertOrder = db.prepare(
    `INSERT INTO orders
       (id, customerName, customerPhone, customerEmail, address, fulfilment, paymentMethod, paymentStatus, status, items, total, createdAt)
     VALUES
       (@id, @customerName, @customerPhone, @customerEmail, @address, @fulfilment, @paymentMethod, @paymentStatus, @status, @items, @total, @createdAt)`,
  );

  const tx = db.transaction(() => {
    seedCategories.forEach((c) => insertCat.run(c));
    seedProducts.forEach((p, i) =>
      insertProd.run({
        ...p,
        image: p.image ?? "",
        inStock: p.inStock ? 1 : 0,
        featured: p.featured ? 1 : 0,
        discountPercent: p.discountPercent ?? null,
        tags: JSON.stringify(p.tags ?? []),
        sort: i,
      }),
    );
    seedOrders.forEach((o) =>
      insertOrder.run({ ...o, items: JSON.stringify(o.items) }),
    );
  });
  tx();
}

// ---- Categories ------------------------------------------------------------

export function getCategories(): Category[] {
  return db
    .prepare("SELECT * FROM categories ORDER BY sort, name")
    .all() as Category[];
}

export function addCategory(
  input: Omit<Category, "id" | "sort"> & { sort?: number },
): Category {
  const id = `cat-${Date.now().toString(36)}`;
  const sort =
    input.sort ??
    ((db.prepare("SELECT COALESCE(MAX(sort),0)+1 AS n FROM categories").get() as {
      n: number;
    }).n);
  db.prepare(
    `INSERT INTO categories (id, name, slug, icon, description, sort)
     VALUES (@id, @name, @slug, @icon, @description, @sort)`,
  ).run({ id, sort, icon: "", description: "", ...input });
  return db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as Category;
}

export function updateCategory(id: string, patch: Partial<Category>): void {
  const cur = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | Category
    | undefined;
  if (!cur) return;
  const next = { ...cur, ...patch, id };
  db.prepare(
    `UPDATE categories SET name=@name, slug=@slug, icon=@icon,
       description=@description, sort=@sort WHERE id=@id`,
  ).run(next);
}

export function deleteCategory(id: string): boolean {
  const has = db
    .prepare("SELECT COUNT(*) AS n FROM products WHERE categoryId = ?")
    .get(id) as { n: number };
  if (has.n > 0) return false;
  db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  return true;
}

// ---- Products --------------------------------------------------------------

export function getProducts(): Product[] {
  return (
    db.prepare("SELECT * FROM products ORDER BY sort, name").all() as ProductRow[]
  ).map(mapProduct);
}

export function getProduct(id: string): Product | undefined {
  const r = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return r ? mapProduct(r) : undefined;
}

export function addProduct(input: Omit<Product, "id" | "sort">): Product {
  const id = `p-${Date.now().toString(36)}`;
  const sort = (db
    .prepare("SELECT COALESCE(MAX(sort),0)+1 AS n FROM products")
    .get() as { n: number }).n;
  db.prepare(
    `INSERT INTO products
       (id, name, categoryId, price, unit, image, description, inStock, featured, discountPercent, tags, sort)
     VALUES
       (@id, @name, @categoryId, @price, @unit, @image, @description, @inStock, @featured, @discountPercent, @tags, @sort)`,
  ).run({
    id,
    sort,
    ...input,
    image: input.image ?? "",
    inStock: input.inStock ? 1 : 0,
    featured: input.featured ? 1 : 0,
    discountPercent: input.discountPercent ?? null,
    tags: JSON.stringify(input.tags ?? []),
  });
  return getProduct(id)!;
}

export function updateProduct(id: string, patch: Partial<Product>): void {
  const cur = getProduct(id);
  if (!cur) return;
  const next = { ...cur, ...patch, id };
  db.prepare(
    `UPDATE products SET
       name=@name, categoryId=@categoryId, price=@price, unit=@unit, image=@image,
       description=@description, inStock=@inStock, featured=@featured,
       discountPercent=@discountPercent, tags=@tags, sort=@sort
     WHERE id=@id`,
  ).run({
    ...next,
    image: next.image ?? "",
    inStock: next.inStock ? 1 : 0,
    featured: next.featured ? 1 : 0,
    discountPercent: next.discountPercent ?? null,
    tags: JSON.stringify(next.tags ?? []),
  });
}

export function deleteProduct(id: string): void {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

// ---- Orders ----------------------------------------------------------------

export function getOrders(): Order[] {
  return (
    db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all() as OrderRow[]
  ).map(mapOrder);
}

export function getOrder(id: string): Order | undefined {
  const r = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | OrderRow
    | undefined;
  return r ? mapOrder(r) : undefined;
}

export function createOrder(
  input: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus"> & {
    status?: OrderStatus;
    paymentStatus?: Order["paymentStatus"];
  },
): Order {
  const n = (db.prepare("SELECT COUNT(*) AS n FROM orders").get() as { n: number })
    .n;
  const id = `MC-${1042 + n + 1}`;
  const order = {
    id,
    createdAt: new Date().toISOString(),
    status: input.status ?? ("pending" as OrderStatus),
    paymentStatus: input.paymentStatus ?? ("unpaid" as Order["paymentStatus"]),
    ...input,
  };
  db.prepare(
    `INSERT INTO orders
       (id, customerName, customerPhone, customerEmail, address, fulfilment, paymentMethod, paymentStatus, status, items, total, createdAt)
     VALUES
       (@id, @customerName, @customerPhone, @customerEmail, @address, @fulfilment, @paymentMethod, @paymentStatus, @status, @items, @total, @createdAt)`,
  ).run({ ...order, items: JSON.stringify(order.items) });
  return getOrder(id)!;
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
}

export function updatePaymentStatus(
  id: string,
  paymentStatus: Order["paymentStatus"],
): void {
  db.prepare("UPDATE orders SET paymentStatus = ? WHERE id = ?").run(
    paymentStatus,
    id,
  );
  // Once paid, advance a pending order into the kitchen queue.
  if (paymentStatus === "paid") {
    db.prepare(
      "UPDATE orders SET status = 'preparing' WHERE id = ? AND status = 'pending'",
    ).run(id);
  }
}
