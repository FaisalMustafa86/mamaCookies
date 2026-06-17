import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Admin auth — stateless signed tokens (HMAC-SHA256), no external deps.
// Credentials and secret come from the environment; sensible dev defaults.
// Set a strong ADMIN_PASSWORD + AUTH_SECRET in production.
// ---------------------------------------------------------------------------

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "mama123";
const AUTH_SECRET =
  process.env.AUTH_SECRET ?? "dev-only-secret-change-me-in-production";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function issueToken(): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${ADMIN_USERNAME}.${exp}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [body, mac] = token.split(".");
  if (!body || !mac) return false;
  const payload = Buffer.from(body, "base64url").toString();
  const expected = sign(payload);
  // constant-time compare
  if (
    mac.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
  ) {
    return false;
  }
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

/** Express middleware: require a valid admin bearer token. */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
