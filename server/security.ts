// ---------------------------------------------------------------------------
// Security hardening — defensive HTTP headers + path guards.
//
// Translates the web-server (Nginx/Apache) recommendations from the security
// audit into Express middleware, since this app serves both the API and the
// built SPA directly from Express with no reverse proxy in front.
// ---------------------------------------------------------------------------

import type { Request, Response, NextFunction } from "express";

// Audit findings #1 / #2: block any request that tries to reach a dotfile or
// dot-directory (.git, .env, .htaccess, …). express.static is also configured
// with `dotfiles: "deny"`, but this guard runs first and also covers the SPA
// catch-all fallback so such paths can never resolve to index.html (200).
const DOTFILE_SEGMENT = /(^|[\\/])\.[^\\/]/;

export function blockDotfiles(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // decodeURIComponent so encoded dots (%2e) can't slip past the check.
  let pathname = req.path;
  try {
    pathname = decodeURIComponent(req.path);
  } catch {
    /* malformed encoding — fall back to the raw path */
  }
  if (DOTFILE_SEGMENT.test(pathname)) {
    res.status(404).end();
    return;
  }
  next();
}

// Audit finding #6: defensive HTTP security headers, applied to every response.
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Clickjacking protection.
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Stop MIME-sniffing of responses away from their declared Content-Type.
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Don't leak full URLs (paths/query) to third-party origins.
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  // Disable powerful browser features this storefront never uses.
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  // Legacy cross-domain policy lockdown (Flash/PDF era, cheap to keep).
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  // Content-Security-Policy — primary XSS containment. Tuned for the SPA, which
  // self-hosts its bundle and loads Google Fonts. 'unsafe-inline' on style-src
  // is needed for Tailwind/Framer Motion inline styles; scripts stay 'self'.
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self' https://easypay.easypaisa.com.pk",
    ].join("; "),
  );
  // HSTS — only meaningful (and only sent) over HTTPS, so it can't lock out a
  // plain-HTTP dev server.
  const forwardedProto =
    typeof req.header === "function" ? req.header("x-forwarded-proto") : undefined;
  if (req.secure || forwardedProto === "https") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
  next();
}
