import { describe, it, expect } from "vitest";
import {
  asBoxSize,
  boxLabel,
  boxPrice,
  discountedPrice,
  formatCurrency,
  formatDate,
} from "./format";
import {
  asBoxSize as serverAsBoxSize,
  boxPrice as serverBoxPrice,
} from "../../server/pricing";

describe("discountedPrice", () => {
  it("returns the original price when no discount is given", () => {
    expect(discountedPrice(1000)).toBe(1000);
  });

  it("treats a 0% discount as no discount (falsy guard)", () => {
    expect(discountedPrice(1000, 0)).toBe(1000);
  });

  it("treats undefined discount as no discount", () => {
    expect(discountedPrice(1300, undefined)).toBe(1300);
  });

  it("applies a percentage discount and rounds to the nearest integer", () => {
    expect(discountedPrice(1000, 10)).toBe(900);
    expect(discountedPrice(1300, 15)).toBe(1105);
  });

  it("rounds half-up like Math.round", () => {
    // 999 * 0.85 = 849.15 -> 849 ; 999 * 0.95 = 949.05 -> 949
    expect(discountedPrice(999, 15)).toBe(849);
    // 333 * 0.9 = 299.7 -> 300
    expect(discountedPrice(333, 10)).toBe(300);
  });

  it("returns 0 for a full 100% discount", () => {
    expect(discountedPrice(1000, 100)).toBe(0);
  });

  it("handles a price of 0", () => {
    expect(discountedPrice(0, 25)).toBe(0);
  });
});

describe("box pricing", () => {
  it("a single is just the unit price", () => {
    expect(boxPrice(330, 1)).toBe(330);
  });

  it("applies the bundle discount per size", () => {
    // 330 * 4 * 0.92 = 1214.4 -> 1214
    expect(boxPrice(330, 4)).toBe(1214);
    // 330 * 8 * 0.88 = 2323.2 -> 2323
    expect(boxPrice(330, 8)).toBe(2323);
  });

  it("a box is always cheaper per cookie than singles", () => {
    expect(boxPrice(450, 8)).toBeLessThan(450 * 8);
    expect(boxPrice(450, 4)).toBeLessThan(450 * 4);
  });

  it("coerces unknown sizes to a single", () => {
    expect(asBoxSize(undefined)).toBe(1);
    expect(asBoxSize("8")).toBe(8);
    expect(asBoxSize(3)).toBe(1);
    expect(asBoxSize(99)).toBe(1);
  });

  it("labels sizes for humans", () => {
    expect(boxLabel(1)).toBe("Single cookie");
    expect(boxLabel(4)).toBe("Box of 4");
    expect(boxLabel(8)).toBe("Box of 8");
  });

  it("client and server pricing stay in lockstep", () => {
    for (const price of [330, 380, 450, 999]) {
      for (const size of [1, 4, 8] as const) {
        expect(serverBoxPrice(price, size)).toBe(boxPrice(price, size));
      }
    }
    expect(serverAsBoxSize("4")).toBe(asBoxSize("4"));
    expect(serverAsBoxSize(7)).toBe(asBoxSize(7));
  });
});

describe("formatCurrency", () => {
  it("renders the amount with thousands grouping and no decimals", () => {
    const out = formatCurrency(1300);
    expect(out).toMatch(/1,300/);
    expect(out).not.toMatch(/\.\d/); // no fractional digits
  });

  it("renders zero", () => {
    expect(formatCurrency(0)).toMatch(/0/);
  });

  it("groups large amounts", () => {
    expect(formatCurrency(1234567)).toMatch(/1,234,567/);
  });
});

describe("formatDate", () => {
  it("includes day, abbreviated month, and full year", () => {
    const out = formatDate("2026-06-09T15:54:00.000Z");
    expect(out).toMatch(/2026/);
    // month is rendered as a short name somewhere in the string
    expect(out).toMatch(/[A-Za-z]{3}/);
  });

  it("produces a non-empty human string for a valid ISO date", () => {
    expect(formatDate("2026-01-01T00:00:00.000Z").length).toBeGreaterThan(0);
  });
});
