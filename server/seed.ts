// ---------------------------------------------------------------------------
// Seed catalog for Mama's Cookies — the source of truth for first-run data.
// Written into SQLite on first boot. Admin edits persist in the DB after that.
//
// Images: cookies with a real photo point at /images/*.jpeg. New flavours that
// don't have photography yet use an empty image string — the frontend renders a
// branded placeholder tile for those until real photos are dropped in.
// ---------------------------------------------------------------------------

export type SeedCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sort: number;
};

export type SeedProduct = {
  id: string;
  name: string;
  categoryId: string;
  price: number; // PKR
  unit: string;
  image: string; // "" => branded placeholder
  description: string;
  inStock: boolean;
  featured: boolean;
  discountPercent?: number;
  tags?: string[];
};

export const categories: SeedCategory[] = [
  {
    id: "cat-signature",
    name: "Signature Cookies",
    slug: "signature",
    icon: "🍪",
    description: "The legends our regulars keep coming back for.",
    sort: 1,
  },
  {
    id: "cat-specialty",
    name: "Specialty Cookies",
    slug: "specialty",
    icon: "⭐",
    description: "Limited, loaded and a little extra — worth the hype.",
    sort: 2,
  },
  {
    id: "cat-boxes",
    name: "Boxes & Gifting",
    slug: "boxes",
    icon: "🎁",
    description: "Curated cookie boxes for sharing — and for loved ones.",
    sort: 3,
  },
];

export const products: SeedProduct[] = [
  // ---------------- Best Sellers (homepage) ----------------
  {
    id: "p-classic-choc-chunk",
    name: "Classic Chocolate Chunk",
    categoryId: "cat-signature",
    price: 450,
    unit: "1 cookie",
    image: "/images/classic.jpeg",
    description:
      "The one that started it all. A buttery, golden-edged cookie packed with gooey dark and milk chocolate chunks. Big, soft-centred and ridiculously good — the benchmark every other cookie is measured against.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-red-royale",
    name: "Red Royale",
    categoryId: "cat-specialty",
    price: 520,
    unit: "1 cookie",
    image: "",
    description:
      "Our crown jewel. A deep red-velvet cookie with a molten cream-cheese centre and white chocolate chunks. Rich, regal and unapologetically decadent.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-mistermellow",
    name: "MisterMellow",
    categoryId: "cat-specialty",
    price: 520,
    unit: "1 cookie",
    image: "",
    description:
      "Toasted marshmallow, molten milk chocolate and a buttery cookie base — layered like a campfire dream. Gooey, smoky-sweet and impossible to put down.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-walnut-brownie",
    name: "Walnut Brownie Cookie",
    categoryId: "cat-signature",
    price: 500,
    unit: "1 cookie",
    image: "/images/double-walnut.jpeg",
    description:
      "A fudgy dark-cocoa brownie in cookie form, folded through with toasted walnuts. Crackly on top, molten in the middle, crunchy throughout.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-chunky-peanut-butter",
    name: "Chunky Peanut Butter",
    categoryId: "cat-signature",
    price: 480,
    unit: "1 cookie",
    image: "",
    description:
      "Loaded with real peanut butter and chunks of chocolate, with a salted finish. Soft, nutty and seriously addictive — the sweet-and-salty fix you didn't know you needed.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-lotus-biscoff",
    name: "Lotus Biscoff",
    categoryId: "cat-specialty",
    price: 540,
    unit: "1 cookie",
    image: "/images/lotuslove.jpeg",
    description:
      "Creamy white chocolate, caramelised Biscoff spread and that iconic Lotus crunch. After 100+ test batches, this is the one that made the whole team go quiet.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-hazelnut-white-choc",
    name: "Hazelnut White Chocolate",
    categoryId: "cat-specialty",
    price: 540,
    unit: "1 cookie",
    image: "/images/hazelnut.jpeg",
    description:
      "Roasted hazelnuts and silky white chocolate folded into a brown-butter dough. Nutty, creamy and luxurious — the cookie that tastes like a celebration.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-matcha-strawberry-cheesecake",
    name: "Matcha Strawberry Cheesecake",
    categoryId: "cat-specialty",
    price: 560,
    unit: "1 cookie",
    image: "",
    description:
      "A stone-ground matcha cookie with a strawberry cheesecake heart. Earthy, fruity and creamy all at once — our most-requested limited drop.",
    inStock: true,
    featured: true,
    tags: ["bestseller", "new"],
  },

  // ---------------- Boxes & Gifting ----------------
  {
    id: "p-box-signature-6",
    name: "Box of 6 — Signature",
    categoryId: "cat-boxes",
    price: 2600,
    unit: "Box of 6",
    image: "/images/box-trio.jpeg",
    description:
      "Six of our signature legends in the iconic red gift box. The perfect introduction to Mama's — and a guaranteed crowd-pleaser.",
    inStock: true,
    featured: false,
    discountPercent: 8,
    tags: ["best value"],
  },
  {
    id: "p-box-mixed-6",
    name: "The Mixed Box of 6",
    categoryId: "cat-boxes",
    price: 2800,
    unit: "Box of 6",
    image: "/images/assortment.jpeg",
    description:
      "Can't decide? Let Mama decide. A hand-picked mix of signatures and specialties from today's freshest batch — for loved ones, or just for you.",
    inStock: true,
    featured: true,
    tags: ["for loved ones"],
  },
  {
    id: "p-box-corporate-12",
    name: "Corporate Gift Box (12)",
    categoryId: "cat-boxes",
    price: 5400,
    unit: "Box of 12",
    image: "/images/gooey-stack.jpeg",
    description:
      "A premium 12-cookie box, optionally branded with your company card. Built for teams, clients and offices who want to send something memorable.",
    inStock: true,
    featured: false,
    tags: ["corporate"],
  },
];

export type SeedOrderLine = { name: string; quantity: number; price: number };
export type SeedOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  fulfilment: "delivery" | "pickup";
  paymentMethod: "easypaisa" | "card";
  paymentStatus: "unpaid" | "paid" | "failed";
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  items: SeedOrderLine[];
  total: number;
  createdAt: string;
};

// A few sample orders so the admin dashboard has data on first run.
export const orders: SeedOrder[] = [
  {
    id: "MC-1042",
    customerName: "Ayesha Khan",
    customerPhone: "+92 300 1234567",
    customerEmail: "ayesha@example.com",
    address: "House 12, Street 4, DHA Phase 2, Islamabad",
    fulfilment: "delivery",
    paymentMethod: "card",
    paymentStatus: "paid",
    status: "delivered",
    items: [
      { name: "Classic Chocolate Chunk", quantity: 2, price: 450 },
      { name: "Red Royale", quantity: 1, price: 520 },
    ],
    total: 1420 + 150,
    createdAt: "2026-06-09T10:24:00.000Z",
  },
  {
    id: "MC-1043",
    customerName: "Bilal Ahmed",
    customerPhone: "+92 321 9876543",
    customerEmail: "bilal@example.com",
    address: "Pickup — DHA Phase 2 kitchen",
    fulfilment: "pickup",
    paymentMethod: "easypaisa",
    paymentStatus: "paid",
    status: "preparing",
    items: [{ name: "The Mixed Box of 6", quantity: 1, price: 2800 }],
    total: 2800,
    createdAt: "2026-06-13T08:05:00.000Z",
  },
  {
    id: "MC-1044",
    customerName: "Hina Sattar",
    customerPhone: "+92 333 4455667",
    customerEmail: "hina@example.com",
    address: "Flat 3B, Bahria Town, Rawalpindi",
    fulfilment: "delivery",
    paymentMethod: "easypaisa",
    paymentStatus: "unpaid",
    status: "pending",
    items: [
      { name: "Lotus Biscoff", quantity: 2, price: 540 },
      { name: "Hazelnut White Chocolate", quantity: 1, price: 540 },
    ],
    total: 1620 + 150,
    createdAt: "2026-06-15T09:15:00.000Z",
  },
];
