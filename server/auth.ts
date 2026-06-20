import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

// ---------------------------------------------------------------------------
// Admin auth — stateless signed tokens (HMAC-SHA256), no external deps.
// Credentials and secret come from the environment; sensible dev defaults.
// Set a strong ADMIN_PASSWORD + AUTH_SECRET in production.
// ---------------------------------------------------------------------------

const DEV_DEFAULT_USERNAME = "admin";
const DEV_DEFAULT_PASSWORD = "mama123";
const DEV_DEFAULT_SECRET = "dev-only-secret-change-me-in-production";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? DEV_DEFAULT_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? DEV_DEFAULT_PASSWORD;
const AUTH_SECRET = process.env.AUTH_SECRET ?? DEV_DEFAULT_SECRET;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Fail fast: never let a production deploy boot on the publicly-known dev
// defaults (or the placeholder values shipped in .env). A misconfigured deploy
// must crash loudly rather than silently expose the admin API.
if (process.env.NODE_ENV === "production") {
  const bad: string[] = [];
  if (!process.env.ADMIN_PASSWORD || ADMIN_PASSWORD === DEV_DEFAULT_PASSWORD)
    bad.push("ADMIN_PASSWORD");
  if (!process.env.AUTH_SECRET || AUTH_SECRET === DEV_DEFAULT_SECRET)
    bad.push("AUTH_SECRET");
  if ([ADMIN_USERNAME, ADMIN_PASSWORD, AUTH_SECRET].includes("CHANGE_ME"))
    bad.push("placeholder CHANGE_ME value");
  if (bad.length) {
    throw new Error(
      `Refusing to start in production: set a strong, non-default value for: ${bad.join(
        ", ",
      )}.`,
    );
  }
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function issueToken(): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  // Include a random nonce (jti) so tokens aren't predictable even if the
  // expiry is guessed. Field order is fixed: admin.<exp>.<jti>.
  const jti = crypto.randomBytes(16).toString("hex");
  const payload = `admin.${exp}.${jti}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [body, mac] = token.split(".");
  if (!body || !mac) return false;
  const payload = Buffer.from(body, "base64url").toString();
  const expected = sign(payload);
  // constant-time compare (length guard first: timingSafeEqual throws on
  // unequal-length buffers).
  if (
    mac.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
  ) {
    return false;
  }
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && Date.now() < exp;
}

// ---------------------------------------------------------------------------
// Cookie-based session + CSRF (double-submit). The admin token lives in an
// HttpOnly cookie so JS (and therefore XSS) can't read it. A separate readable
// CSRF cookie must be echoed back in the X-CSRF-Token header on every state-
// changing request — a forged cross-site request can't read it, so it fails.
// ---------------------------------------------------------------------------

const TOKEN_COOKIE = "mc_admin";
const CSRF_COOKIE = "mc_csrf";

export function issueCsrf(): string {
  return crypto.randomBytes(24).toString("hex");
}

function parseCookies(req: Request): Record<string, string> {
  const raw = req.headers.cookie;
  if (!raw) return {};
  const out: Record<string, string> = {};
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

/** Set the auth + CSRF cookies after a successful login. */
export function setAuthCookies(res: Response, token: string, csrf: string): void {
  const secure = process.env.NODE_ENV === "production";
  const maxAge = TOKEN_TTL_MS;
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    path: "/",
    maxAge,
  });
  // Readable by JS so the SPA can echo it in the CSRF header.
  res.cookie(CSRF_COOKIE, csrf, {
    httpOnly: false,
    sameSite: "strict",
    secure,
    path: "/",
    maxAge,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(TOKEN_COOKIE, { path: "/" });
  res.clearCookie(CSRF_COOKIE, { path: "/" });
}

function extractToken(req: Request): string | undefined {
  // Prefer the HttpOnly cookie; fall back to a Bearer header (API clients/tests).
  const cookie = parseCookies(req)[TOKEN_COOKIE];
  if (cookie) return cookie;
  const header = req.header("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : undefined;
}

/** Express middleware: require a valid admin session (cookie or bearer). */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!verifyToken(extractToken(req))) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

/**
 * Express middleware: enforce CSRF on state-changing requests. Skipped for
 * Bearer-authenticated callers (a header can't be set cross-site, so it's
 * inherently CSRF-safe); enforced for cookie-authenticated browser requests.
 */
export function requireCsrf(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const usingBearer = (req.header("authorization") ?? "").startsWith("Bearer ");
  if (usingBearer) return next();

  const cookie = parseCookies(req)[CSRF_COOKIE];
  const header = req.header("x-csrf-token") ?? "";
  if (
    !cookie ||
    !header ||
    cookie.length !== header.length ||
    !crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header))
  ) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }
  next();
}
