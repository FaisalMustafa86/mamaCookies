// ---------------------------------------------------------------------------
// Server configuration — all tunables in one place, driven by env vars.
// ---------------------------------------------------------------------------

export const PORT = Number(process.env.PORT ?? 3001);

// Database (libSQL / Turso). Local dev defaults to an embedded file; production
// points at a Turso cloud database. On Vercel without Turso configured we fall
// back to an in-memory DB (ephemeral — it reseeds on every cold start) so the
// site still works before you wire up persistence.
export const DB_URL =
  process.env.TURSO_DATABASE_URL ??
  process.env.DB_URL ??
  (process.env.VERCEL ? ":memory:" : "file:./data.sqlite");
export const DB_AUTH_TOKEN =
  process.env.TURSO_AUTH_TOKEN ?? process.env.DB_AUTH_TOKEN ?? "";

// Order economics (PKR). Mirror these in src/lib/brand.ts for the storefront.
export const DELIVERY_FEE = Number(process.env.DELIVERY_FEE ?? 150);
export const FREE_DELIVERY_OVER = Number(
  process.env.FREE_DELIVERY_OVER ?? 3000,
);

// Payments: "mock" runs a built-in sandbox gateway that simulates Easypaisa +
// card so the full flow works without merchant keys. Switch to "live" once you
// have Easypaisa merchant credentials in the environment.
export const PAYMENTS_MODE = (process.env.PAYMENTS_MODE ?? "mock") as
  | "mock"
  | "live";

// Easypaisa merchant credentials (only needed when PAYMENTS_MODE=live).
export const EASYPAISA = {
  storeId: process.env.EASYPAISA_STORE_ID ?? "",
  hashKey: process.env.EASYPAISA_HASH_KEY ?? "",
  // Easypaisa "Easypay" hosted-checkout endpoint (provided at onboarding).
  postUrl:
    process.env.EASYPAISA_POST_URL ??
    "https://easypay.easypaisa.com.pk/easypay/Index.jsf",
};

// Public base URL used to build payment return links. If unset, derived from
// the incoming request (fine for single-host deployments).
export const APP_URL = process.env.APP_URL ?? "";

export function baseUrlFrom(req: {
  protocol: string;
  get: (h: string) => string | undefined;
}): string {
  if (APP_URL) return APP_URL.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}
