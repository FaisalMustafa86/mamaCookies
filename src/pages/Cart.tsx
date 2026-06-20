import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  Truck,
  Store,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { useData } from "../data/DataContext";
import {
  boxLabel,
  boxPrice,
  discountedPrice,
  formatCurrency,
} from "../lib/format";
import { BRAND } from "../lib/brand";
import ProductImage from "../components/ProductImage";
import type { Fulfilment, PaymentMethod } from "../data/types";

export default function Cart() {
  const {
    cart,
    products,
    setQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    checkout,
  } = useData();

  const [showCheckout, setShowCheckout] = useState(false);
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("easypaisa");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const lines = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { item, product } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const effectiveDelivery = fulfilment === "pickup" ? 0 : deliveryFee;
  const effectiveTotal = cartSubtotal + effectiveDelivery;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { redirectUrl } = await checkout({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email.trim(),
        address: fulfilment === "delivery" ? form.address.trim() : "Pickup",
        fulfilment,
        paymentMethod,
      });
      // Hand off to the payment gateway (mock sandbox or live Easypaisa).
      window.location.href = redirectUrl;
    } catch (err) {
      setBusy(false);
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  }

  // ---- empty cart ----
  if (lines.length === 0) {
    return (
      <div className="container-mc py-24 text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush-light text-5xl">
          🛒
        </span>
        <h1 className="mt-6 font-heading text-3xl font-extrabold text-brand-ink">
          Your box is empty
        </h1>
        <p className="mt-2 text-muted">
          Let's fix that. The cookies are calling.
        </p>
        <Link to="/shop" className="btn-primary mt-7">
          Browse cookies <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  // ---- cart ----
  return (
    <div className="container-mc py-12">
      <h1 className="font-heading text-4xl font-extrabold text-brand-ink">
        Your box
      </h1>
      <p className="mt-1 text-muted">
        {cart.reduce((s, i) => s + i.quantity, 0)} cookie(s) ready to bake.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* line items */}
        <div className="space-y-4 lg:col-span-2">
          {lines.map(({ item, product }) => {
            const unit = discountedPrice(product.price, product.discountPercent);
            const price = boxPrice(unit, item.size);
            return (
              <motion.div
                key={`${item.productId}:${item.size}`}
                layout
                className="flex gap-4 rounded-3xl border border-brand-ink/10 bg-white p-4 shadow-soft"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-blush-light"
                >
                  <ProductImage
                    src={product.image}
                    name={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="font-heading font-bold text-brand-ink hover:text-brand-red"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted">{boxLabel(item.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      aria-label={`Remove ${product.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-red/10 hover:text-brand-red"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-brand-ink/15">
                      <button
                        onClick={() =>
                          setQuantity(item.productId, item.size, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-ink/5"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(item.productId, item.size, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="grid h-9 w-9 place-items-center rounded-full hover:bg-brand-ink/5"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-heading font-bold text-brand-ink">
                      {formatCurrency(price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24 p-6">
            <h2 className="font-heading text-xl font-bold text-brand-ink">
              Order summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold">{formatCurrency(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">
                  {fulfilment === "pickup" ? "Pickup" : "Delivery"}
                </dt>
                <dd className="font-semibold">
                  {effectiveDelivery === 0 ? (
                    <span className="text-brand-red">Free</span>
                  ) : (
                    formatCurrency(effectiveDelivery)
                  )}
                </dd>
              </div>
              {fulfilment === "delivery" && deliveryFee > 0 && (
                <p className="text-xs text-muted">
                  Add {formatCurrency(BRAND.freeDeliveryOver - cartSubtotal)} more
                  for free delivery.
                </p>
              )}
              <div className="border-t border-brand-ink/10 pt-3">
                <div className="flex justify-between">
                  <dt className="font-heading text-lg font-bold">Total</dt>
                  <dd className="font-heading text-lg font-bold text-brand-red">
                    {formatCurrency(effectiveTotal)}
                  </dd>
                </div>
              </div>
            </dl>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="btn-primary mt-6 w-full"
              >
                Checkout <ArrowRight size={18} />
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
                {/* fulfilment */}
                <div>
                  <span className="label">How would you like it?</span>
                  <div className="grid grid-cols-2 gap-2">
                    <ChoiceTile
                      active={fulfilment === "delivery"}
                      onClick={() => setFulfilment("delivery")}
                      icon={<Truck size={18} />}
                      label="Delivery"
                    />
                    <ChoiceTile
                      active={fulfilment === "pickup"}
                      onClick={() => setFulfilment("pickup")}
                      icon={<Store size={18} />}
                      label="Pickup"
                    />
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="cust-name">
                    Your name
                  </label>
                  <input
                    id="cust-name"
                    className="input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="e.g. Ayesha"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="cust-phone">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="cust-phone"
                    className="input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+92 3xx xxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="cust-email">
                    Email <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    id="cust-email"
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="you@email.com"
                  />
                </div>
                {fulfilment === "delivery" && (
                  <div>
                    <label className="label" htmlFor="cust-address">
                      Delivery address
                    </label>
                    <textarea
                      id="cust-address"
                      className="input min-h-[80px] resize-none"
                      value={form.address}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, address: e.target.value }))
                      }
                      placeholder="House, street, area (DHA-2 / Twin Cities)"
                      required
                    />
                  </div>
                )}

                {/* payment method */}
                <div>
                  <span className="label">Payment method</span>
                  <div className="grid grid-cols-2 gap-2">
                    <ChoiceTile
                      active={paymentMethod === "easypaisa"}
                      onClick={() => setPaymentMethod("easypaisa")}
                      icon={<Smartphone size={18} />}
                      label="Easypaisa"
                    />
                    <ChoiceTile
                      active={paymentMethod === "card"}
                      onClick={() => setPaymentMethod("card")}
                      icon={<CreditCard size={18} />}
                      label="Debit / Card"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-brand-red/10 px-4 py-2.5 text-sm font-medium text-brand-red">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-primary w-full"
                >
                  {busy
                    ? "Redirecting…"
                    : `Pay ${formatCurrency(effectiveTotal)}`}
                </button>
                <p className="text-center text-xs text-muted">
                  You'll be taken to a secure payment page to complete your order.
                </p>
              </form>
            )}

            <Link
              to="/shop"
              className="mt-3 block text-center text-sm font-semibold text-muted hover:text-brand-red"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChoiceTile({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "border-brand-red bg-brand-red/10 text-brand-red"
          : "border-brand-ink/15 bg-white text-brand-ink hover:border-brand-red/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
