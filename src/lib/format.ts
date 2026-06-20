/** Format a number as Pakistani Rupees, e.g. 1300 -> "Rs 1,300". */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Price after applying an optional discount percentage. */
export function discountedPrice(price: number, discountPercent?: number): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

// ---------------------------------------------------------------------------
// Box sizing — every cookie can be bought single, or as a Box of 4 / 8.
// Boxes are auto-priced from the single price with a small bundle discount
// (bigger box, bigger saving). The server mirrors this in server/pricing.ts and
// recomputes order totals authoritatively, so these two MUST stay in sync.
// ---------------------------------------------------------------------------
export type BoxSize = 1 | 4 | 8;

// Purchasable box sizes (single cookies are not sold on their own).
export const BOX_SIZES: BoxSize[] = [4, 8];

/** Bundle discount (%) per box size. */
export const BOX_DISCOUNT: Record<BoxSize, number> = { 1: 0, 4: 8, 8: 12 };

/** Price of `size` cookies at `singlePrice` each, after the bundle discount. */
export function boxPrice(singlePrice: number, size: BoxSize): number {
  return Math.round(singlePrice * size * (1 - BOX_DISCOUNT[size] / 100));
}

/** Human label for a box size, e.g. "Single cookie" / "Box of 8". */
export function boxLabel(size: BoxSize): string {
  return size === 1 ? "Single cookie" : `Box of ${size}`;
}

/** Coerce any value to a valid BoxSize, defaulting to 1 (single). */
export function asBoxSize(value: unknown): BoxSize {
  const n = Number(value);
  return n === 4 || n === 8 ? n : 1;
}

/** Human-friendly date, e.g. "9 Jun 2026, 3:54 pm". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
