import { describe, it, expect } from "vitest";
import { BRAND, whatsappLink } from "./brand";

describe("whatsappLink", () => {
  it("strips +, spaces and other non-digits from the configured number", () => {
    const digits = BRAND.contact.whatsapp.replace(/[^\d]/g, "");
    expect(whatsappLink()).toBe(`https://wa.me/${digits}`);
    expect(whatsappLink()).not.toMatch(/[+\s]/);
  });

  it("omits the query string when no text is provided", () => {
    expect(whatsappLink()).not.toContain("?");
  });

  it("appends a URL-encoded text query when provided", () => {
    const link = whatsappLink("Hi there & friends");
    expect(link).toContain("?text=");
    expect(link).toContain("Hi%20there%20%26%20friends");
  });

  it("encodes special characters that would break the URL", () => {
    const link = whatsappLink("order #5?");
    expect(link).toContain("%23"); // #
    expect(link).toContain("%3F"); // ?
  });
});

describe("BRAND economics", () => {
  it("matches the server defaults (server/config.ts) for delivery pricing", () => {
    // These must stay in sync with the authoritative server values.
    expect(BRAND.deliveryFee).toBe(150);
    expect(BRAND.freeDeliveryOver).toBe(3000);
  });
});
