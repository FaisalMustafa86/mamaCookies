# MAMA — Website Build Specification

**Hand this file to Claude Code as the source of truth for building the site.**
This is a brand-new demo website (no real backend yet). Build it to be clean, fast, and easy to extend into a production app later.

---

## 0. How to use this document (for Claude Code)

- Build the full project described below from scratch.
- Where this doc says **DECISION** or **ASSUMPTION**, the choice is already made — implement it. The client can change it afterward.
- The site is a **demo**: all data is mock/seed data persisted in the browser. No external API, no payment, no real auth.
- Prioritize: (1) a polished animated homepage hero, (2) a working storefront driven by data, (3) a functional admin page that edits that same data and is reflected live on the storefront.
- Keep the code organized, typed, and commented enough that a real backend can be dropped in later by replacing one data layer.

---

## 1. Project overview

**Product:** MAMA — a local instant grocery & food delivery service.
**Tagline ideas (pick one, or let admin set it):** "Local groceries, delivered in 30 minutes." / "Fresh from your local store to your door."
**What they do:** Fast delivery (≈30 min) of fresh produce, food items, and packaged goods from a local store. Eco-friendly / biodegradable packaging. Customer-satisfaction focused.
**Origin location (real):** Banaganapalli, Andhra Pradesh, India. (Use as default demo content; admin can edit.)

This replaces an older single-page app hosted at `mama-storeapp.web.app`. We are NOT cloning it — we are building a fresh, modern site.

---

## 2. Goals & scope

**In scope (build all of this):**
1. Public storefront (homepage with **animated hero**, product catalog, product detail, cart, about, contact).
2. **Admin page** to manage products, categories, and view mock orders.
3. Fully responsive (mobile-first — most grocery delivery traffic is mobile).
4. Demo data persisted client-side so admin edits show up on the storefront.

**Out of scope (do NOT build, but leave room for):**
- Real payments, real user accounts, SMS/email, live order tracking, maps integration, multi-restaurant marketplace. Stub or omit these; note where they'd plug in.

---

## 3. Tech stack — DECISION

- **Framework:** React 18 + **Vite** + **TypeScript**
- **Styling:** **Tailwind CSS**
- **Animation:** **Framer Motion** (hero + page/section transitions)
- **Routing:** **React Router**
- **Icons:** **lucide-react**
- **State / data layer:** React Context + a single `dataStore` module backed by **`localStorage`** (seeded on first load). This is the *only* place that touches persistence, so it can later be swapped for a REST API or Firebase without touching components.
- **Admin auth (demo):** a simple hardcoded gate (username `admin`, password `mama123`) stored in a constant, plus a session flag in `sessionStorage`. Clearly comment that this is demo-only and must be replaced with real auth before production.
- **Build/deploy:** static build (`npm run build`) deployable to Firebase Hosting / Netlify / Vercel. Include a short `README.md` with run + deploy steps.

> If Claude Code strongly prefers Next.js, that's acceptable — but keep it a static/SPA-style demo with the same localStorage data layer.

---

## 4. Information architecture / routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Animated hero + sections (see §6) |
| `/shop` | Catalog | All products, filter by category, search |
| `/product/:id` | Product detail | Add to cart |
| `/cart` | Cart | Edit quantities, mock checkout |
| `/about` | About | Brand story, stats, eco message |
| `/contact` | Contact | Contact form (demo, no send) + details |
| `/admin/login` | Admin login | Demo gate |
| `/admin` | Admin dashboard | Stats overview |
| `/admin/products` | Products manager | Full CRUD |
| `/admin/categories` | Categories manager | CRUD |
| `/admin/orders` | Orders | View mock orders, change status |

Admin routes are protected: redirect to `/admin/login` if not authenticated.

---

## 5. Data models (TypeScript)

Seed these into localStorage on first run. Provide a "Reset demo data" button in admin that re-seeds.

```ts
type Category = {
  id: string;
  name: string;          // "Fresh Produce"
  slug: string;          // "fresh-produce"
  icon?: string;         // lucide icon name or emoji
};

type Product = {
  id: string;
  name: string;
  categoryId: string;
  price: number;         // in INR (₹)
  unit: string;          // "1 kg", "500 g", "1 pc", "6 pcs"
  image: string;         // use a placeholder/Unsplash URL or local asset
  description: string;
  inStock: boolean;
  featured: boolean;     // shown on homepage
  discountPercent?: number;
};

type CartItem = { productId: string; quantity: number };

type Order = {
  id: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;     // ISO
  address: string;
};
```

### Seed data (minimum)
- **6–8 categories:** Fresh Produce (fruits & vegetables), Dairy & Eggs, Bakery, Snacks & Packaged, Beverages, Household, Personal Care, Staples (rice/atta/oil).
- **24–40 products** spread across categories, with realistic Indian grocery names and ₹ prices, a mix of `featured: true` (8–10) and some `inStock: false`, a few with discounts.
- **6–10 mock orders** across different statuses for the admin orders view.
- Currency throughout the UI: **₹ (INR)**.

Use royalty-free placeholder images (e.g. Unsplash food/grocery photos via URL, or simple colored placeholders). Keep image URLs in the seed data so they're easy to swap.

---

## 6. Homepage — section by section

Order of sections top to bottom:

### 6.1 Header / Nav (sticky)
- Logo "MAMA" (wordmark, bold, brand green). Tagline small beside it on desktop.
- Links: Home, Shop, About, Contact.
- Right side: search icon, cart icon with item-count badge.
- Mobile: hamburger → slide-in menu.
- Subtle shadow appears on scroll.

### 6.2 HERO — the centerpiece (animated) ★
This is the most important visual. Goal: lively, fresh, "instant delivery" energy. Use **Framer Motion**.

**Layout:** Left = headline + subtext + CTAs. Right = animated visual. Stacks on mobile (visual below text).

**Copy:**
- Headline: **"Your local store, delivered in 30 minutes."**
- Sub: "Fresh produce, daily essentials, and packaged goods — at your door, fast and fresh."
- Primary CTA: "Shop now" → `/shop`. Secondary CTA: "How it works" → scrolls to How It Works.
- Small trust line: "🌱 Eco-friendly packaging · ⚡ 30-min delivery · ✅ 99% quality rate"

**Animations (implement all):**
1. **Background:** soft animated gradient mesh / slow-moving blurred color blobs in brand greens and warm accent — gentle, continuous, low-distraction. Respect `prefers-reduced-motion` (freeze if set).
2. **Text reveal on load:** headline words/lines stagger in (fade + rise ~16px), then sub, then CTAs. ~80–120ms stagger.
3. **Floating groceries:** 5–7 grocery item cards/illustrations (e.g. tomato, milk carton, bread, apple, leafy greens, bag) that gently float/bob with slight rotation on independent loops (parallax-style different speeds). Use emoji or simple SVG/PNG if no assets.
4. **Delivery motif:** a small delivery scooter (or bag with motion lines) that animates across or a looping "30:00 → 00:00"-style ticker / pulsing clock badge to reinforce speed. Keep tasteful.
5. **Hover micro-interactions:** CTAs lift slightly; floating items react subtly to pointer (optional parallax on mouse move, desktop only).

Keep it performant (transform/opacity only, no layout thrash). Must look good on mobile (reduce number of floating items, disable mouse parallax).

### 6.3 Category strip
Horizontal scroll / grid of category chips (icon + name) → click goes to `/shop?category=slug`. Hover scale.

### 6.4 Featured products
Grid of `featured` products as cards: image, name, unit, price (with strikethrough if discounted), "Add to cart" button. Cards fade/slide in on scroll (Framer Motion `whileInView`). "View all" → `/shop`.

### 6.5 How it works
3 steps with icons, animated in on scroll: 1) Browse & order → 2) We pick fresh from the local store → 3) Delivered in ~30 min. Eco-packaging note.

### 6.6 Stats band
Animated count-up numbers (real brand stats from old site): **20,000+ customers · 12,000+ orders · 99% quality · 30-min delivery**. Brand-green background.

### 6.7 Testimonials
3 short customer quotes in a simple carousel or grid (write believable demo quotes).

### 6.8 App download / CTA band
"Get the MAMA app" with Google Play / App Store badge buttons (link to `#`, demo). Phone mockup optional.

### 6.9 Footer
- Columns: Quick links (About, Contact, Shop), Support (Shipping, Privacy, Refund, Cancellation, Terms — link to `#` placeholder pages or simple stub routes), Contact info, Social icons (FB/Instagram/LinkedIn → `#`).
- Demo contact block: MAMA Food App, Banaganapalli, Andhra Pradesh 518124, India · phone & email placeholders.
- "© 2026 MAMA. Demo site." 

---

## 7. Other storefront pages

- **Shop (`/shop`):** left/top filter by category + search box + sort (price, name). Responsive product grid. Reads `?category=` query param. Empty state when no matches.
- **Product detail (`/product/:id`):** large image, name, price, unit, description, stock status, quantity stepper, Add to cart, "back to shop". Show a few related products from same category.
- **Cart (`/cart`):** line items with qty steppers and remove, subtotal, delivery fee (flat demo ₹), total. "Place order (demo)" button → creates an `Order` with status `pending`, clears cart, shows a success screen with order id. (This order then appears in admin → orders.)
- **About (`/about`):** brand story (adapt the real about copy — instant delivery, fresh produce, eco packaging, customer satisfaction), stats, eco section.
- **Contact (`/contact`):** demo form (name/email/message) that just shows a success toast (no real send) + address/phone/email/map placeholder.

Cart count and contents live in the shared data store/context so the header badge updates everywhere.

---

## 8. Admin page (required)

Admin must **edit the same data the storefront reads**, so changes are visible immediately on the public site (both read/write the localStorage data store).

### 8.1 Login (`/admin/login`)
Demo gate (`admin` / `mama123`). On success set `sessionStorage` flag and go to `/admin`. Show clear "Demo credentials" hint on the page. Comment that this must be replaced before production.

### 8.2 Layout
Sidebar (Dashboard, Products, Categories, Orders, Reset demo data, Logout) + top bar with "View storefront" link. Responsive (sidebar collapses on mobile).

### 8.3 Dashboard (`/admin`)
Stat cards: total products, in-stock vs out-of-stock, total orders, orders by status, total revenue (sum of orders), # categories. A simple recent-orders table. (Optional: a tiny bar/line chart of orders by status — fine to use plain CSS bars; no heavy chart lib required.)

### 8.4 Products manager (`/admin/products`)
- Table of all products: image thumb, name, category, price, unit, stock toggle, featured toggle, edit, delete.
- "Add product" → modal/drawer form with all `Product` fields incl. category dropdown, image URL, price, unit, description, in-stock, featured, discount.
- Edit reuses the same form. Delete with confirm.
- Search/filter by name & category.
- All changes persist to the data store and reflect on `/shop` and homepage featured immediately.

### 8.5 Categories manager (`/admin/categories`)
CRUD for categories (name, slug auto-from-name, icon). Prevent deleting a category that still has products (warn / reassign).

### 8.6 Orders (`/admin/orders`)
- Table of orders: id, customer, items count, total, status (editable dropdown to change status), date.
- Status change persists. Filter by status.

### 8.7 Reset demo data
Button that wipes localStorage and re-seeds the original demo dataset (with confirm).

---

## 9. Design system — DECISION

**Vibe:** fresh, friendly, clean, trustworthy, a little playful. Grocery + eco.

**Colors (Tailwind config):**
- Primary green: `#16a34a` (and a darker `#15803d`, light `#dcfce7`)
- Warm accent (CTAs/highlights): `#f97316` (orange)
- Ink/text: `#0f172a`; muted: `#64748b`
- Surface: `#ffffff`; subtle bg: `#f8faf9`
- Success/Stock-in: green; Out-of-stock/danger: `#ef4444`

**Typography:**
- Headings: a friendly geometric sans (e.g. **Poppins** or **Plus Jakarta Sans**).
- Body: **Inter**. Load via Google Fonts or self-host.

**Components:** rounded corners (`rounded-xl`/`2xl`), soft shadows, generous spacing, clear focus states. Buttons: solid green primary, orange for key conversion CTAs. Cards lift slightly on hover.

**Motion:** smooth, ~200–400ms, ease-out. Section reveals on scroll via `whileInView` (once). Always honor `prefers-reduced-motion`.

---

## 10. Responsiveness & accessibility
- Mobile-first; test at 360px, 768px, 1024px, 1440px.
- Hamburger nav, stacked hero, single-column product grid on small screens.
- Semantic HTML, alt text on images, keyboard-navigable nav/forms/modals, visible focus rings, sufficient color contrast.
- Reduced-motion users get static (or minimal) hero.

---

## 11. Project structure (suggested)
```
src/
  main.tsx, App.tsx, router.tsx
  data/
    seed.ts            // initial categories, products, orders
    dataStore.ts       // localStorage read/write API (the swap point)
    DataContext.tsx    // provides data + cart actions to app
  components/          // Header, Footer, ProductCard, Hero, etc.
  pages/               // Home, Shop, ProductDetail, Cart, About, Contact
  pages/admin/         // Login, Dashboard, Products, Categories, Orders
  lib/                 // helpers (formatCurrency, slugify, auth)
  styles/
README.md
```

---

## 12. Definition of done (acceptance criteria)
- [ ] `npm install && npm run dev` runs with no errors; `npm run build` produces a deployable static build.
- [ ] Homepage hero is animated (background motion + staggered text + floating items + delivery/speed motif) and looks good on mobile; reduced-motion respected.
- [ ] Storefront is fully driven by the data store; categories, featured, shop filtering, product detail, and cart all work.
- [ ] Cart checkout (demo) creates an order that appears in admin.
- [ ] Admin login gate works; product & category CRUD and order status changes persist and are reflected on the storefront live.
- [ ] "Reset demo data" restores the seed dataset.
- [ ] Fully responsive, no console errors, clean TypeScript.
- [ ] `README.md` with run/build/deploy instructions and demo admin credentials.
- [ ] Code is structured so the localStorage data layer can be replaced by a real API later (single module).

---

## 13. Notes / assumptions (client can change)
- Stack, colors, fonts, tagline, and demo admin credentials are all easily editable.
- All contact details, stats, and brand copy come from the previous MAMA brand (instant local delivery, Banaganapalli) and are placeholders for the demo.
- No real backend, auth, payments, or order tracking in this phase — clearly stubbed for future work.
