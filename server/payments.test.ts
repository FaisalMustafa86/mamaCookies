import { describe, it, expect, vi } from "vitest";

// payments.ts imports ./db.js at module load, which opens a SQLite file as a
// side effect. Stub it so these pure-logic tests don't touch the filesystem.
vi.mock("./db.js", () => ({
  getOrder: vi.fn(),
  updatePaymentStatus: vi.fn(),
}));

import { paymentRedirectUrl } from "./payments";
import type { Order } from "./db";

function makeOrder(over: Partial<Order> = {}): Order {
  return {
    id: "MC-1043",
    customerName: "Ayesha",
    customerPhone: "03001234567",
    customerEmail: "",
    address: "",
    fulfilment: "delivery",
    paymentMethod: "easypaisa",
    paymentStatus: "unpaid",
    status: "pending",
    items: [],
    total: 1450,
    createdAt: new Date().toISOString(),
    ...over,
  };
}

describe("paymentRedirectUrl (default PAYMENTS_MODE=mock)", () => {
  it("points at the mock gateway page for the order", () => {
    const url = paymentRedirectUrl(makeOrder(), "https://shop.example");
    expect(url).toBe("https://shop.example/pay/mock/MC-1043");
  });

  it("uses the order id in the path", () => {
    const url = paymentRedirectUrl(makeOrder({ id: "MC-2000" }), "http://x");
    expect(url).toContain("/pay/mock/MC-2000");
  });

  it("does not route to the live Easypaisa page in mock mode", () => {
    const url = paymentRedirectUrl(makeOrder(), "http://x");
    expect(url).not.toContain("/pay/easypaisa/");
  });
});
