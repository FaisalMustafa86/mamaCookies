import { Router } from "express";
import crypto from "node:crypto";
import { EASYPAISA, PAYMENTS_MODE, baseUrlFrom } from "./config.js";
import { getOrder, updatePaymentStatus } from "./db.js";
import type { Order } from "./db.js";

// ---------------------------------------------------------------------------
// Payments — Easypaisa (wallet) + debit/Visa card, behind one swap point.
//
// PAYMENTS_MODE=mock (default): a built-in sandbox gateway page simulates the
//   redirect → pay → callback flow so the whole checkout works end-to-end with
//   no merchant account. This is what runs in development.
//
// PAYMENTS_MODE=live: redirects to Easypaisa's hosted "Easypay" checkout, which
//   handles both Mobile Account (Easypaisa wallet) and Credit/Debit card. The
//   request is signed with your merchant hash key. Flip the env var and supply
//   EASYPAISA_STORE_ID / EASYPAISA_HASH_KEY to go live.
// ---------------------------------------------------------------------------

export const paymentsRouter = Router();

/** Build the URL the browser should be sent to in order to pay for an order. */
export function paymentRedirectUrl(order: Order, baseUrl: string): string {
  if (PAYMENTS_MODE === "live") {
    // Our /pay/easypaisa/:id page renders an auto-submitting form to Easypaisa.
    return `${baseUrl}/pay/easypaisa/${order.id}`;
  }
  return `${baseUrl}/pay/mock/${order.id}`;
}

// ---- Easypaisa "Easypay" hosted checkout (live) ---------------------------

/**
 * Easypaisa signs the request by SHA-256-HMAC'ing the parameters sorted
 * alphabetically and joined as key=value&... using the merchant hash key.
 * (Exact field set is confirmed during merchant onboarding — adjust if your
 * integration sheet differs.)
 */
function easypaisaHash(fields: Record<string, string>): string {
  const ordered = Object.keys(fields)
    .filter((k) => fields[k] !== "" && k !== "merchantHashedReq")
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  return crypto
    .createHmac("sha256", EASYPAISA.hashKey)
    .update(ordered)
    .digest("hex");
}

function easypaisaFormPage(order: Order, baseUrl: string): string {
  const fields: Record<string, string> = {
    storeId: EASYPAISA.storeId,
    orderRefNum: order.id,
    amount: order.total.toFixed(2),
    paymentMethod: order.paymentMethod === "card" ? "CC_PAYMENT_METHOD" : "MA_PAYMENT_METHOD",
    postBackURL: `${baseUrl}/api/payments/easypaisa/callback`,
    expiryDate: "",
    autoRedirect: "1",
  };
  fields.merchantHashedReq = easypaisaHash(fields);

  const inputs = Object.entries(fields)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${escapeHtml(v)}"/>`)
    .join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Redirecting…</title></head>
<body onload="document.forms[0].submit()" style="font-family:sans-serif;text-align:center;padding:3rem">
  <p>Redirecting you to Easypaisa to complete payment…</p>
  <form method="POST" action="${escapeHtml(EASYPAISA.postUrl)}">${inputs}
    <noscript><button type="submit">Continue to Easypaisa</button></noscript>
  </form>
</body></html>`;
}

// ---- Mock sandbox gateway (mock) ------------------------------------------

function mockGatewayPage(order: Order, baseUrl: string): string {
  const isCard = order.paymentMethod === "card";
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mama's Cookies — Sandbox Payment</title>
<style>
  :root{--red:#E11D29;--cream:#FBF6EC;--ink:#2A1A14}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--cream);color:var(--ink);display:grid;place-items:center;min-height:100vh;padding:1.5rem}
  .card{background:#fff;border:1px solid rgba(42,26,20,.1);border-radius:24px;box-shadow:0 10px 30px rgba(42,26,20,.08);max-width:420px;width:100%;padding:2rem}
  .tag{display:inline-block;background:rgba(225,29,41,.1);color:var(--red);font-weight:700;font-size:.72rem;letter-spacing:.05em;text-transform:uppercase;padding:.35rem .7rem;border-radius:999px}
  h1{font-size:1.4rem;margin:.8rem 0 .2rem}
  .muted{color:#7a6a63;font-size:.9rem;margin:0}
  .row{display:flex;justify-content:space-between;margin:.4rem 0;font-size:.95rem}
  .total{font-weight:800;font-size:1.2rem;color:var(--red)}
  .method{display:flex;align-items:center;gap:.6rem;background:var(--cream);border-radius:14px;padding:.8rem 1rem;margin:1.1rem 0;font-weight:600}
  button{width:100%;border:0;border-radius:999px;padding:.95rem;font-weight:700;font-size:1rem;cursor:pointer;margin-top:.6rem}
  .pay{background:var(--red);color:#fff}
  .fail{background:#fff;color:var(--ink);border:2px solid rgba(42,26,20,.15)}
  hr{border:0;border-top:1px solid rgba(42,26,20,.1);margin:1.1rem 0}
</style></head>
<body>
  <div class="card">
    <span class="tag">Sandbox payment</span>
    <h1>Pay Mama's Cookies</h1>
    <p class="muted">Order ${order.id}</p>
    <hr>
    <div class="row"><span>Items total</span><span>Rs ${order.total.toLocaleString("en-PK")}</span></div>
    <div class="row"><span>Method</span><span>${isCard ? "Debit / Visa card" : "Easypaisa wallet"}</span></div>
    <div class="row total"><span>Total</span><span>Rs ${order.total.toLocaleString("en-PK")}</span></div>
    <div class="method">${isCard ? "💳" : "📱"} ${isCard ? "Card ending 4242 (test)" : "03xx-xxxxxxx (test wallet)"}</div>
    <form method="POST" action="${baseUrl}/pay/mock/${order.id}/complete">
      <button class="pay" name="outcome" value="paid" type="submit">Pay Rs ${order.total.toLocaleString("en-PK")}</button>
      <button class="fail" name="outcome" value="failed" type="submit">Simulate failed payment</button>
    </form>
    <p class="muted" style="text-align:center;margin-top:1rem;font-size:.78rem">
      This is a sandbox gateway. No real money moves. Swap in live Easypaisa keys to go live.
    </p>
  </div>
</body></html>`;
}

// ---- Routes ----------------------------------------------------------------

// Mock gateway page
paymentsRouter.get("/pay/mock/:id", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }
  res.type("html").send(mockGatewayPage(order, baseUrlFrom(req)));
});

// Mock gateway completion → mark order, redirect back into the SPA
paymentsRouter.post("/pay/mock/:id/complete", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }
  const paid = req.body?.outcome === "paid";
  updatePaymentStatus(order.id, paid ? "paid" : "failed");
  res.redirect(
    `${baseUrlFrom(req)}/order/${order.id}?status=${paid ? "paid" : "failed"}`,
  );
});

// Live Easypaisa redirect page (auto-submits to Easypaisa)
paymentsRouter.get("/pay/easypaisa/:id", (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }
  res.type("html").send(easypaisaFormPage(order, baseUrlFrom(req)));
});

// Live Easypaisa postback handler
paymentsRouter.post("/api/payments/easypaisa/callback", (req, res) => {
  // Easypaisa returns orderRefNum + a status/auth token. In a full live
  // integration you'd verify the response signature here before trusting it.
  const orderId = req.body?.orderRefNum ?? req.body?.orderId;
  const ok =
    req.body?.status === "0000" || // Easypaisa success code
    req.body?.responseCode === "0000" ||
    String(req.body?.status ?? "").toLowerCase() === "paid";
  const order = orderId ? getOrder(String(orderId)) : undefined;
  if (!order) {
    res.status(404).send("Order not found");
    return;
  }
  updatePaymentStatus(order.id, ok ? "paid" : "failed");
  res.redirect(
    `${baseUrlFrom(req)}/order/${order.id}?status=${ok ? "paid" : "failed"}`,
  );
});

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
