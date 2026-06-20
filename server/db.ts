import { createClient, type Client, type Row } from "@libsql/client";
import { DB_URL, DB_AUTH_TOKEN } from "./config.js";
import {
  categories as seedCategories,
  products as seedProducts,
  orders as seedOrders,
} from "./seed.js";

// ---------------------------------------------------------------------------
// Data layer (libSQL / Turso). One database holds everything; this module is
// the single persistence boundary on the server side.
//
//   • Local dev   -> DB_URL = file:./data.sqlite   (embedded libSQL)
//   • Production   -> DB_URL = libsql://<db>.turso.io + auth token (Turso cloud)
//   • Vercel w/o Turso configured -> :memory: (ephemeral, reseeds per cold start)
//
// Everything is async because libSQL is async (works the same against a local
// file or a remote Turso database over HTTPS — ideal for serverless hosting).
// ---------------------------------------------------------------------------

export const db: Client = createClient(
  DB_AUTH_TOKEN ? { url: DB_URL, authToken: DB_AUTH_TOKEN } : { url: DB_URL },
);

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

// ---- Row -> domain mappers (explicit; libSQL rows are column-keyed) --------

function mapCategory(r: Row): Category {
  return {
    id: String(r.id),
    name: String(r.name),
    slug: String(r.slug),
    icon: r.icon == null ? undefined : String(r.icon),
    description: r.description == null ? undefined : String(r.description),
    sort: Number(r.sort),
  };
}

function mapProduct(r: Row): Product {
  return {
    id: String(r.id),
    name: String(r.name),
    categoryId: String(r.categoryId),
    price: Number(r.price),
    unit: String(r.unit),
    image: r.image == null ? "" : String(r.image),
    description: r.description == null ? "" : String(r.description),
    inStock: !!Number(r.inStock),
    featured: !!Number(r.featured),
    discountPercent:
      r.discountPercent == null ? undefined : Number(r.discountPercent),
    tags: JSON.parse((r.tags as string) || "[]"),
    sort: Number(r.sort),
  };
}

function mapOrder(r: Row): Order {
  return {
    id: String(r.id),
    customerName: String(r.customerName),
    customerPhone: String(r.customerPhone),
    customerEmail: String(r.customerEmail),
    address: String(r.address),
    fulfilment: String(r.fulfilment) as Order["fulfilment"],
    paymentMethod: String(r.paymentMethod) as Order["paymentMethod"],
    paymentStatus: String(r.paymentStatus) as Order["paymentStatus"],
    status: String(r.status) as OrderStatus,
    items: JSON.parse((r.items as string) || "[]"),
    total: Number(r.total),
    createdAt: String(r.createdAt),
  };
}

// ---- Schema + seeding ------------------------------------------------------

export async function initSchema(): Promise<void> {
  await db.executeMultiple(`
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
}

export async function seedIfEmpty(): Promise<void> {
  const res = await db.execute("SELECT COUNT(*) AS n FROM products");
  if (Number(res.rows[0].n) > 0) return;

  await db.batch(
    [
      ...seedCategories.map((c) => ({
        sql: `INSERT INTO categories (id, name, slug, icon, description, sort)
              VALUES (:id, :name, :slug, :icon, :description, :sort)`,
        args: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon ?? "",
          description: c.description ?? "",
          sort: c.sort,
        },
      })),
      ...seedProducts.map((p, i) => ({
        sql: `INSERT INTO products
                (id, name, categoryId, price, unit, image, description, inStock, featured, discountPercent, tags, sort)
              VALUES
                (:id, :name, :categoryId, :price, :unit, :image, :description, :inStock, :featured, :discountPercent, :tags, :sort)`,
        args: {
          id: p.id,
          name: p.name,
          categoryId: p.categoryId,
          price: p.price,
          unit: p.unit,
          image: p.image ?? "",
          description: p.description ?? "",
          inStock: p.inStock ? 1 : 0,
          featured: p.featured ? 1 : 0,
          discountPercent: p.discountPercent ?? null,
          tags: JSON.stringify(p.tags ?? []),
          sort: i,
        },
      })),
      ...seedOrders.map((o) => ({
        sql: `INSERT INTO orders
                (id, customerName, customerPhone, customerEmail, address, fulfilment, paymentMethod, paymentStatus, status, items, total, createdAt)
              VALUES
                (:id, :customerName, :customerPhone, :customerEmail, :address, :fulfilment, :paymentMethod, :paymentStatus, :status, :items, :total, :createdAt)`,
        args: {
          id: o.id,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          customerEmail: o.customerEmail,
          address: o.address,
          fulfilment: o.fulfilment,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          status: o.status,
          items: JSON.stringify(o.items),
          total: o.total,
          createdAt: o.createdAt,
        },
      })),
    ],
    "write",
  );
}

// ---- Categories ------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const res = await db.execute("SELECT * FROM categories ORDER BY sort, name");
  return res.rows.map(mapCategory);
}

export async function addCategory(
  input: Omit<Category, "id" | "sort"> & { sort?: number },
): Promise<Category> {
  const id = `cat-${Date.now().toString(36)}`;
  const sort =
    input.sort ??
    Number(
      (await db.execute("SELECT COALESCE(MAX(sort),0)+1 AS n FROM categories"))
        .rows[0].n,
    );
  await db.execute({
    sql: `INSERT INTO categories (id, name, slug, icon, description, sort)
          VALUES (:id, :name, :slug, :icon, :description, :sort)`,
    args: {
      id,
      name: input.name,
      slug: input.slug,
      icon: input.icon ?? "",
      description: input.description ?? "",
      sort,
    },
  });
  return (await getCategory(id))!;
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const res = await db.execute({
    sql: "SELECT * FROM categories WHERE id = :id",
    args: { id },
  });
  return res.rows[0] ? mapCategory(res.rows[0]) : undefined;
}

export async function updateCategory(
  id: string,
  patch: Partial<Category>,
): Promise<void> {
  const cur = await getCategory(id);
  if (!cur) return;
  const next = { ...cur, ...patch, id };
  await db.execute({
    sql: `UPDATE categories SET name=:name, slug=:slug, icon=:icon,
            description=:description, sort=:sort WHERE id=:id`,
    args: {
      id: next.id,
      name: next.name,
      slug: next.slug,
      icon: next.icon ?? "",
      description: next.description ?? "",
      sort: next.sort,
    },
  });
}

export async function deleteCategory(id: string): Promise<boolean> {
  const has = await db.execute({
    sql: "SELECT COUNT(*) AS n FROM products WHERE categoryId = :id",
    args: { id },
  });
  if (Number(has.rows[0].n) > 0) return false;
  await db.execute({
    sql: "DELETE FROM categories WHERE id = :id",
    args: { id },
  });
  return true;
}

// ---- Products --------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  const res = await db.execute("SELECT * FROM products ORDER BY sort, name");
  return res.rows.map(mapProduct);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const res = await db.execute({
    sql: "SELECT * FROM products WHERE id = :id",
    args: { id },
  });
  return res.rows[0] ? mapProduct(res.rows[0]) : undefined;
}

export async function addProduct(
  input: Omit<Product, "id" | "sort">,
): Promise<Product> {
  const id = `p-${Date.now().toString(36)}`;
  const sort = Number(
    (await db.execute("SELECT COALESCE(MAX(sort),0)+1 AS n FROM products"))
      .rows[0].n,
  );
  await db.execute({
    sql: `INSERT INTO products
            (id, name, categoryId, price, unit, image, description, inStock, featured, discountPercent, tags, sort)
          VALUES
            (:id, :name, :categoryId, :price, :unit, :image, :description, :inStock, :featured, :discountPercent, :tags, :sort)`,
    args: {
      id,
      name: input.name,
      categoryId: input.categoryId,
      price: input.price,
      unit: input.unit,
      image: input.image ?? "",
      description: input.description ?? "",
      inStock: input.inStock ? 1 : 0,
      featured: input.featured ? 1 : 0,
      discountPercent: input.discountPercent ?? null,
      tags: JSON.stringify(input.tags ?? []),
      sort,
    },
  });
  return (await getProduct(id))!;
}

export async function updateProduct(
  id: string,
  patch: Partial<Product>,
): Promise<void> {
  const cur = await getProduct(id);
  if (!cur) return;
  const next = { ...cur, ...patch, id };
  await db.execute({
    sql: `UPDATE products SET
            name=:name, categoryId=:categoryId, price=:price, unit=:unit, image=:image,
            description=:description, inStock=:inStock, featured=:featured,
            discountPercent=:discountPercent, tags=:tags, sort=:sort
          WHERE id=:id`,
    args: {
      id: next.id,
      name: next.name,
      categoryId: next.categoryId,
      price: next.price,
      unit: next.unit,
      image: next.image ?? "",
      description: next.description ?? "",
      inStock: next.inStock ? 1 : 0,
      featured: next.featured ? 1 : 0,
      discountPercent: next.discountPercent ?? null,
      tags: JSON.stringify(next.tags ?? []),
      sort: next.sort,
    },
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await db.execute({
    sql: "DELETE FROM products WHERE id = :id",
    args: { id },
  });
}

// ---- Orders ----------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const res = await db.execute("SELECT * FROM orders ORDER BY createdAt DESC");
  return res.rows.map(mapOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const res = await db.execute({
    sql: "SELECT * FROM orders WHERE id = :id",
    args: { id },
  });
  return res.rows[0] ? mapOrder(res.rows[0]) : undefined;
}

export async function createOrder(
  input: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus"> & {
    status?: OrderStatus;
    paymentStatus?: Order["paymentStatus"];
  },
): Promise<Order> {
  const n = Number(
    (await db.execute("SELECT COUNT(*) AS n FROM orders")).rows[0].n,
  );
  const id = `MC-${1042 + n + 1}`;
  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    status: input.status ?? "pending",
    paymentStatus: input.paymentStatus ?? "unpaid",
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    address: input.address,
    fulfilment: input.fulfilment,
    paymentMethod: input.paymentMethod,
    items: input.items,
    total: input.total,
  };
  await db.execute({
    sql: `INSERT INTO orders
            (id, customerName, customerPhone, customerEmail, address, fulfilment, paymentMethod, paymentStatus, status, items, total, createdAt)
          VALUES
            (:id, :customerName, :customerPhone, :customerEmail, :address, :fulfilment, :paymentMethod, :paymentStatus, :status, :items, :total, :createdAt)`,
    args: {
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      address: order.address,
      fulfilment: order.fulfilment,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      items: JSON.stringify(order.items),
      total: order.total,
      createdAt: order.createdAt,
    },
  });
  return (await getOrder(id))!;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<void> {
  await db.execute({
    sql: "UPDATE orders SET status = :status WHERE id = :id",
    args: { id, status },
  });
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: Order["paymentStatus"],
): Promise<void> {
  await db.execute({
    sql: "UPDATE orders SET paymentStatus = :paymentStatus WHERE id = :id",
    args: { id, paymentStatus },
  });
  // Once paid, advance a pending order into the kitchen queue.
  if (paymentStatus === "paid") {
    await db.execute({
      sql: "UPDATE orders SET status = 'preparing' WHERE id = :id AND status = 'pending'",
      args: { id },
    });
  }
}
