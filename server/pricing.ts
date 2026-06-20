// ---------------------------------------------------------------------------
// Box sizing — server-side mirror of src/lib/format.ts. The client uses this to
// display box prices; the server uses THIS copy to recompute order totals
// authoritatively at checkout. The two MUST stay in sync (same discounts).
// Kept dependency-free so it bundles cleanly into the Vercel function.
// ---------------------------------------------------------------------------
export type BoxSize = 1 | 4 | 8;

/** Bundle discount (%) per box size. */
export const BOX_DISCOUNT: Record<BoxSize, number> = { 1: 0, 4: 8, 8: 12 };

/** Coerce any value to a valid BoxSize, defaulting to 1 (single). */
export function asBoxSize(value: unknown): BoxSize {
  const n = Number(value);
  return n === 4 || n === 8 ? n : 1;
}

/** Price of `size` cookies at `singlePrice` each, after the bundle discount. */
export function boxPrice(singlePrice: number, size: BoxSize): number {
  return Math.round(singlePrice * size * (1 - BOX_DISCOUNT[size] / 100));
}

/** Human label for a box size, e.g. "Single cookie" / "Box of 8". */
export function boxLabel(size: BoxSize): string {
  return size === 1 ? "Single cookie" : `Box of ${size}`;
}
