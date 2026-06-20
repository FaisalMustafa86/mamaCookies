// ---------------------------------------------------------------------------
// Domain types for Mama's Cookies. These mirror the shapes the API returns
// (see server/db.ts) and consumes. The frontend talks to the backend only
// through src/lib/api.ts.
// ---------------------------------------------------------------------------

export type Category = {
  id: string;
  name: string; // "Specialty Cookies"
  slug: string; // "specialty"
  icon?: string; // emoji or lucide icon name
  description?: string;
  sort?: number;
};

export type Product = {
  id: string;
  name: string; // "Red Royale"
  categoryId: string;
  price: number; // in PKR (Rs)
  unit: string; // "1 cookie", "Box of 6"
  image: string; // path under /images, remote URL, or "" => branded placeholder
  description: string;
  inStock: boolean;
  featured: boolean; // surfaced on the homepage
  discountPercent?: number;
  tags?: string[]; // e.g. ["bestseller", "new"]
  sort?: number;
};

import type { BoxSize } from "../lib/format";

// A cart line is a specific cookie at a specific box size (1 / 4 / 8). The same
// flavour at two sizes is two distinct lines, keyed by productId + size.
export type CartItem = { productId: string; quantity: number; size: BoxSize };

export type OrderStatus =
  | "pending"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "easypaisa" | "card";
export type PaymentStatus = "unpaid" | "paid" | "failed";
export type Fulfilment = "delivery" | "pickup";

export type OrderLine = { name: string; quantity: number; price: number };

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  fulfilment: Fulfilment;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO timestamp
};
