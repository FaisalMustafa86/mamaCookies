# Mama's Cookies 🍪

A full-stack storefront **and** admin dashboard for **Mama's Cookies** — a
premium, small-batch gourmet cookie brand from the Twin Cities
(Rawalpindi–Islamabad). *"Premium cookies, made for loved ones."*

- **Frontend:** React 18 + Vite + TypeScript + Tailwind + Framer Motion
- **Backend:** Node + Express + SQLite (one deployable service)
- **Payments:** Easypaisa wallet + debit/Visa card (with a built-in sandbox)

Storefront, catalog, cart, checkout with online payment, order tracking, and a
protected admin — all backed by a real API and database.

---

## Architecture

```
src/                 # React app (Vite)
  lib/api.ts         #  ← the ONLY boundary the app uses to talk to the backend
  data/DataContext   #  loads catalog/orders from the API; holds the cart
  components/ pages/  #  storefront + admin UI
server/              # Express API + SQLite (run with tsx)
  index.ts           #  routes + serves the built frontend in production
  db.ts              #  SQLite schema, seed, queries (single persistence boundary)
  auth.ts            #  signed-token admin auth (HMAC, no external deps)
  payments.ts        #  Easypaisa + card gateway (mock sandbox / live)
  seed.ts  config.ts
data.sqlite          # created on first run (gitignored)
```

In **dev**, Vite (5173) serves the app and proxies `/api` + `/pay` to Express
(3001). In **production**, Express serves the built `dist/` *and* the API from a
single port — so hosting is one service.

## Getting started

```bash
npm install
npm run dev      # runs the API (3001) + Vite dev server (5173) together
```

Open http://localhost:5173. The database (`data.sqlite`) is created and seeded
automatically on first run.

### Build & run for production

```bash
npm run build    # type-checks + builds the frontend into dist/
npm start        # starts the Express server, serving dist/ + the API on $PORT
# or simply:
npm run serve    # build, then start
```

## Configuration (.env)

Copy `.env.example` to `.env`. Everything has safe dev defaults:

| Variable | Purpose |
|---|---|
| `PORT` | Server port (hosts usually set this) |
| `DB_PATH` | Where to store the SQLite file |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login |
| `AUTH_SECRET` | Secret used to sign admin tokens — **change in production** |
| `DELIVERY_FEE` / `FREE_DELIVERY_OVER` | Order economics (PKR) |
| `PAYMENTS_MODE` | `mock` (sandbox) or `live` |
| `EASYPAISA_STORE_ID` / `EASYPAISA_HASH_KEY` / `EASYPAISA_POST_URL` | Easypaisa merchant creds (live) |
| `APP_URL` | Public base URL for payment return links (optional) |

## Payments

Checkout creates an order server-side (prices are recomputed from the DB, never
trusted from the client), then sends the customer to a payment page.

- **`PAYMENTS_MODE=mock` (default):** a built-in **sandbox gateway** simulates the
  Easypaisa / card redirect → pay → callback flow so you can test the whole
  thing end-to-end **without a merchant account**.
- **`PAYMENTS_MODE=live`:** redirects to Easypaisa's hosted checkout (handles
  both Easypaisa wallet *and* debit/Visa cards). Supply your
  `EASYPAISA_STORE_ID` / `EASYPAISA_HASH_KEY` and flip the env var. The adapter
  lives in one file (`server/payments.ts`) behind a single swap point.

On success the customer lands on `/order/:id` (live tracking); the order is
marked **paid** and moves into the kitchen queue.

## Deploy (single service)

`better-sqlite3` compiles natively during `npm install`, so any Node host works:

- **Render / Railway / Fly / a VPS:** build command `npm run build`, start
  command `npm start`. Point `DB_PATH` at a persistent volume so the database
  survives restarts. Set `ADMIN_PASSWORD`, `AUTH_SECRET`, and the Easypaisa keys.

Because Express serves the SPA with a fallback to `index.html`, client-side
routes work without extra config.

## Admin

Visit **`/admin/login`** (default `admin` / `mama123`, set via env). The admin can:

- **Dashboard** — product/stock/order/revenue stats.
- **Products** — full CRUD, toggle stock & featured, search/filter.
- **Categories** — CRUD with auto-slug; blocks deleting a non-empty category.
- **Orders** — view real orders, change status (persists to the DB).

## Routes

| Route | Page |
|---|---|
| `/` | Home — hero, best sellers, 4-step process, order types, corporate, events |
| `/shop` · `/product/:id` | Catalog + product detail |
| `/cart` | Cart + checkout (Easypaisa / card) |
| `/order/:id` | Order confirmation + live tracking |
| `/delivery` · `/corporate` · `/events` | Same-day/pickup, corporate gifting, catering |
| `/about` · `/contact` · `/account` | Our story, contact, order tracking |
| `/p/:slug` | Shipping / Refund / Privacy / Terms |
| `/admin/*` | Protected admin |

---

© Mama's Cookies. Made with ♥ for loved ones.
