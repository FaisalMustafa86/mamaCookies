import { describe, it, expect } from "vitest";
import { discountedPrice } from "./format";
import { BRAND } from "./brand";

// ---------------------------------------------------------------------------
// Order-total contract.
//
// The delivery-fee rule lives in two places that MUST agree:
//   - server/index.ts  (authoritative, recomputes from DB prices)
//   - src/data/DataContext.tsx  (client cart display)
// Both express the same rule below. These tests pin that rule using the
// exported building blocks (discountedPrice + BRAND constants) so a change to
// either the threshold/fee or the rounding helper is caught here.
// ---------------------------------------------------------------------------

type Line = { price: number; discountPercent?: number; quantity: number };

function subtotal(lines: Line[]): number {
  return lines.reduce(
    (sum, l) => sum + discountedPrice(l.price, l.discountPercent) * l.quantity,
    0,
  );
}

function deliveryFee(sub: number): number {
  return sub === 0 || sub >= BRAND.freeDeliveryOver ? 0 : BRAND.deliveryFee;
}

function orderTotal(lines: Line[]): number {
  const sub = subtotal(lines);
  return sub + deliveryFee(sub);
}

describe("subtotal", () => {
  it("sums quantity * unit price", () => {
    expect(subtotal([{ price: 500, quantity: 2 }])).toBe(1000);
  });

  it("applies per-line discounts before summing", () => {
    expect(
      subtotal([
        { price: 1000, discountPercent: 10, quantity: 1 }, // 900
        { price: 500, quantity: 2 }, // 1000
      ]),
    ).toBe(1900);
  });

  it("is zero for an empty cart", () => {
    expect(subtotal([])).toBe(0);
  });
});

describe("deliveryFee", () => {
  it("is free for an empty cart (subtotal 0)", () => {
    expect(deliveryFee(0)).toBe(0);
  });

  it("charges the flat fee below the free-delivery threshold", () => {
    expect(deliveryFee(BRAND.freeDeliveryOver - 1)).toBe(BRAND.deliveryFee);
    expect(deliveryFee(1)).toBe(BRAND.deliveryFee);
  });

  it("is free exactly at the threshold (>= boundary)", () => {
    expect(deliveryFee(BRAND.freeDeliveryOver)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(deliveryFee(BRAND.freeDeliveryOver + 500)).toBe(0);
  });
});

describe("orderTotal", () => {
  it("adds delivery for a small order", () => {
    // 2 * 500 = 1000 subtotal, under 3000 -> +150
    expect(orderTotal([{ price: 500, quantity: 2 }])).toBe(1000 + BRAND.deliveryFee);
  });

  it("drops delivery once the cart reaches the free threshold", () => {
    // 3 * 1000 = 3000 -> free delivery
    expect(orderTotal([{ price: 1000, quantity: 3 }])).toBe(3000);
  });

  it("respects discounts when deciding free delivery", () => {
    // 4 * 1000 @ 30% off = 4 * 700 = 2800 subtotal -> still under 3000 -> +fee
    expect(orderTotal([{ price: 1000, discountPercent: 30, quantity: 4 }])).toBe(
      2800 + BRAND.deliveryFee,
    );
  });

  it("is zero for an empty cart", () => {
    expect(orderTotal([])).toBe(0);
  });
});
