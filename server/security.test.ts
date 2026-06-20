import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { blockDotfiles, securityHeaders } from "./security";

function mkReq(path: string): Request {
  return { path } as Request;
}

function mkRes() {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    status: vi.fn(function (this: typeof res, code: number) {
      this.statusCode = code;
      return this;
    }),
    end: vi.fn(),
    setHeader: vi.fn(function (this: typeof res, k: string, v: string) {
      this.headers[k] = v;
    }),
  };
  return res;
}

describe("blockDotfiles", () => {
  it("allows a normal path through to next()", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    blockDotfiles(mkReq("/products/123"), res as unknown as Response, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("404s a request for a dotfile at the root", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    blockDotfiles(mkReq("/.env"), res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("404s a dot-directory nested in the path (.git)", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    blockDotfiles(mkReq("/assets/.git/config"), res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it("blocks percent-encoded dotfiles (%2e decodes to '.')", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    blockDotfiles(mkReq("/%2eenv"), res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it("does not treat a dot inside a filename as a dotfile", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    blockDotfiles(mkReq("/main.js"), res as unknown as Response, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("falls back to the raw path on malformed encoding and still passes a clean path", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    // %E0%A4%A is malformed; decodeURIComponent throws, raw path has no dotseg.
    blockDotfiles(mkReq("/cookies-%E0%A4%A"), res as unknown as Response, next);
    expect(next).toHaveBeenCalledOnce();
  });
});

describe("securityHeaders", () => {
  it("sets the defensive headers and calls next()", () => {
    const next = vi.fn() as unknown as NextFunction;
    const res = mkRes();
    securityHeaders({} as Request, res as unknown as Response, next);
    expect(res.headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(res.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(res.headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(res.headers["X-Permitted-Cross-Domain-Policies"]).toBe("none");
    expect(res.headers["Permissions-Policy"]).toContain("geolocation=()");
    expect(next).toHaveBeenCalledOnce();
  });
});
