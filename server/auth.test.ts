import { describe, it, expect, beforeAll } from "vitest";

// auth.ts reads ADMIN_USERNAME / ADMIN_PASSWORD / AUTH_SECRET at module load,
// so set deterministic values BEFORE importing it.
process.env.ADMIN_USERNAME = "admin";
process.env.ADMIN_PASSWORD = "secret-pass";
process.env.AUTH_SECRET = "unit-test-secret";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let auth: typeof import("./auth");

beforeAll(async () => {
  auth = await import("./auth");
});

describe("checkCredentials", () => {
  it("accepts the exact configured username + password", () => {
    expect(auth.checkCredentials("admin", "secret-pass")).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(auth.checkCredentials("admin", "nope")).toBe(false);
  });

  it("rejects a wrong username", () => {
    expect(auth.checkCredentials("root", "secret-pass")).toBe(false);
  });

  it("is case-sensitive and exact-match (no trimming)", () => {
    expect(auth.checkCredentials("Admin", "secret-pass")).toBe(false);
    expect(auth.checkCredentials("admin ", "secret-pass")).toBe(false);
  });
});

describe("issueToken / verifyToken", () => {
  it("issues a token that verifies as valid", () => {
    const token = auth.issueToken();
    expect(auth.verifyToken(token)).toBe(true);
  });

  it("produces a base64url payload joined to a hex signature with a dot", () => {
    const token = auth.issueToken();
    const parts = token.split(".");
    expect(parts).toHaveLength(2);
    expect(parts[1]).toMatch(/^[0-9a-f]+$/); // hex HMAC
  });

  it("rejects an empty or undefined token", () => {
    expect(auth.verifyToken(undefined)).toBe(false);
    expect(auth.verifyToken("")).toBe(false);
  });

  it("rejects a token with no signature part", () => {
    expect(auth.verifyToken("onlybody")).toBe(false);
  });

  it("rejects a token whose signature has been tampered with", () => {
    const token = auth.issueToken();
    const [body] = token.split(".");
    const forged = `${body}.${"0".repeat(64)}`;
    expect(auth.verifyToken(forged)).toBe(false);
  });

  it("rejects a token whose payload has been swapped (signature mismatch)", () => {
    const token = auth.issueToken();
    const [, mac] = token.split(".");
    const fakeBody = Buffer.from("admin.99999999999999").toString("base64url");
    expect(auth.verifyToken(`${fakeBody}.${mac}`)).toBe(false);
  });

  it("rejects an expired token even when correctly signed", () => {
    // Build a token with a past expiry but a VALID signature, using the same
    // secret the module was loaded with.
    const crypto = require("node:crypto") as typeof import("node:crypto");
    const payload = `admin.${Date.now() - 1000}`; // expired 1s ago
    const mac = crypto
      .createHmac("sha256", "unit-test-secret")
      .update(payload)
      .digest("hex");
    const expired = `${Buffer.from(payload).toString("base64url")}.${mac}`;
    expect(auth.verifyToken(expired)).toBe(false);
  });
});
