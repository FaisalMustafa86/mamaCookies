// ---------------------------------------------------------------------------
// Seed catalog for Mama's Cookies — the source of truth for first-run data.
// Written into the DB on first boot. Admin edits persist after that.
//
// Menu + prices mirror the official Mama's Cookies price sheet (PKR):
//   Originals 330 · Specials 380 · Premium 450.
// Every cookie has a real product photo in /public/images.
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
    id: "cat-originals",
    name: "Originals",
    slug: "originals",
    icon: "🍪",
    description: "The legends that started it all — Rs 330 each.",
    sort: 1,
  },
  {
    id: "cat-specials",
    name: "Specials",
    slug: "specials",
    icon: "⭐",
    description: "Loaded, a little extra, worth the hype — Rs 380 each.",
    sort: 2,
  },
  {
    id: "cat-premium",
    name: "Premium",
    slug: "premium",
    icon: "👑",
    description: "Our most decadent, fully-loaded drops — Rs 450 each.",
    sort: 3,
  },
];

export const products: SeedProduct[] = [
  // ---------------- Originals (Rs 330) ----------------
  {
    id: "p-classic",
    name: "Classic",
    categoryId: "cat-originals",
    price: 330,
    unit: "1 cookie",
    image: "/images/classic.jpeg",
    description:
      "The one that started it all. A buttery, golden cookie loaded with gooey milk and dark chocolate chunks — soft in the middle, crisp at the edges. The benchmark every other cookie is measured against.",
    inStock: true,
    featured: true,
    tags: ["bestseller"],
  },
  {
    id: "p-hazelnut",
    name: "Hazelnut",
    categoryId: "cat-originals",
    price: 330,
    unit: "1 cookie",
    image: "/images/hazelnut.jpeg",
    description:
      "Roasted hazelnuts and silky milk chocolate folded into a brown-butter dough. Nutty, creamy and impossibly moreish.",
    inStock: true,
    featured: true,
    tags: [],
  },
  {
    id: "p-double",
    name: "Double",
    categoryId: "cat-originals",
    price: 330,
    unit: "1 cookie",
    image: "/images/double.jpeg",
    description:
      "For the serious chocolate lover — a deep cocoa cookie packed with melting chocolate chunks and fudgy all the way through.",
    inStock: true,
    featured: true,
    tags: [],
  },
  {
    id: "p-chunky-peanut-butter",
    name: "Chunky Peanut Butter",
    categoryId: "cat-originals",
    price: 330,
    unit: "1 cookie",
    image: "/images/peanut-butter.jpeg",
    description:
      "Loaded with real peanuts and a molten peanut-butter centre, finished with a touch of salt. Sweet, salty and seriously addictive.",
    inStock: true,
    featured: false,
    tags: [],
  },

  // ---------------- Specials (Rs 380) ----------------
  {
    id: "p-walnut-brownie",
    name: "Walnut Brownie",
    categoryId: "cat-specials",
    price: 380,
    unit: "1 cookie",
    image: "/images/walnut-brownie.jpeg",
    description:
      "A fudgy dark-chocolate brownie in cookie form, studded with toasted walnuts. Crackly on top, molten in the middle.",
    inStock: true,
    featured: true,
    tags: [],
  },
  {
    id: "p-bigblack",
    name: "BigBlack",
    categoryId: "cat-specials",
    price: 380,
    unit: "1 cookie",
    image: "/images/bigblack.jpeg",
    description:
      "Our jet-black cookies-and-cream legend — a dark cocoa cookie loaded with crushed cream biscuits and pockets of melting white chocolate.",
    inStock: true,
    featured: true,
    tags: [],
  },
  {
    id: "p-lotus-love",
    name: "Lotus Love",
    categoryId: "cat-specials",
    price: 380,
    unit: "1 cookie",
    image: "/images/lotus.jpeg",
    description:
      "Creamy white chocolate, caramelised Lotus Biscoff spread and that iconic crunch. After 100+ test batches, the one that made the whole team go quiet.",
    inStock: true,
    featured: true,
    tags: [],
  },

  // ---------------- Premium (Rs 450) ----------------
  {
    id: "p-mr-mellow",
    name: "Mr. Mellow",
    categoryId: "cat-premium",
    price: 450,
    unit: "1 cookie",
    image: "/images/mr-mellow.jpeg",
    description:
      "Toasted marshmallow, molten milk chocolate and a buttery cookie base — a campfire s'more in cookie form. Gooey, smoky-sweet and impossible to put down.",
    inStock: true,
    featured: true,
    tags: [],
  },
  {
    id: "p-velvet-crush",
    name: "Velvet Crush",
    categoryId: "cat-premium",
    price: 450,
    unit: "1 cookie",
    image: "/images/velvet-crush.jpeg",
    description:
      "A deep red-velvet cookie with a molten cream-cheese centre. Rich, striking and unapologetically indulgent — made for loved ones.",
    inStock: true,
    featured: true,
    tags: ["for loved ones"],
  },
  {
    id: "p-chocochee",
    name: "ChocoChee",
    categoryId: "cat-premium",
    price: 450,
    unit: "1 cookie",
    image: "/images/chocochee.jpeg",
    description:
      "Our signature blue cookie with a tangy cream-cheese swirl and pops of melting chocolate. As fun to look at as it is to eat.",
    inStock: true,
    featured: true,
    tags: ["new"],
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
      { name: "Classic", quantity: 2, price: 330 },
      { name: "Velvet Crush", quantity: 1, price: 450 },
    ],
    total: 1110 + 150,
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
    items: [{ name: "Mr. Mellow", quantity: 3, price: 450 }],
    total: 1350,
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
      { name: "Lotus Love", quantity: 2, price: 380 },
      { name: "BigBlack", quantity: 1, price: 380 },
    ],
    total: 1140 + 150,
    createdAt: "2026-06-15T09:15:00.000Z",
  },
];
