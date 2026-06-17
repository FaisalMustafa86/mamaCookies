import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CookingPot,
  Truck,
  PartyPopper,
} from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import { BRAND, whatsappLink } from "../lib/brand";
import type { Order as OrderType, OrderStatus } from "../data/types";

const STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "pending", label: "Order placed", icon: Clock },
  { status: "preparing", label: "Freshly baked & packed", icon: CookingPot },
  { status: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: PartyPopper },
];

export default function Order() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const payStatus = params.get("status"); // paid | failed | null
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    api
      .order(id)
      .then((o) => active && setOrder(o))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container-mc py-24 text-center text-muted">
        Loading your order…
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="container-mc py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-brand-ink">
          Order not found
        </h1>
        <p className="mt-2 text-muted">
          We couldn't find an order with that reference.
        </p>
        <Link to="/shop" className="btn-primary mt-6">
          Back to the menu
        </Link>
      </div>
    );
  }

  const paid = order.paymentStatus === "paid";
  const failed = order.paymentStatus === "failed" || payStatus === "failed";
  const activeIndex = STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="container-mc max-w-3xl py-12">
      {/* payment banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-4 rounded-3xl p-6 ${
          paid
            ? "bg-green-50 text-green-800"
            : failed
              ? "bg-brand-red/10 text-brand-red"
              : "bg-blush-light text-brand-ink"
        }`}
      >
        {paid ? (
          <CheckCircle2 size={40} className="shrink-0 text-green-600" />
        ) : failed ? (
          <XCircle size={40} className="shrink-0" />
        ) : (
          <Clock size={40} className="shrink-0" />
        )}
        <div>
          <h1 className="font-heading text-2xl font-extrabold">
            {paid
              ? "Payment successful! 🍪"
              : failed
                ? "Payment didn't go through"
                : "Order received"}
          </h1>
          <p className="text-sm opacity-90">
            {paid
              ? "Mama's already firing up the oven. Your cookies are being baked fresh."
              : failed
                ? "No charge was made. You can retry payment from your cart."
                : "Your order is awaiting payment confirmation."}
          </p>
        </div>
      </motion.div>

      {/* order summary */}
      <div className="mt-6 card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-sm text-muted">Order reference</span>
            <div className="font-heading text-2xl font-bold text-brand-red">
              {order.id}
            </div>
          </div>
          <div className="text-right text-sm text-muted">
            <div>{formatDate(order.createdAt)}</div>
            <div className="capitalize">
              {order.fulfilment} · {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* tracking */}
        {order.status !== "cancelled" ? (
          <div className="mt-8 grid grid-cols-4 gap-2">
            {STEPS.map((s, i) => {
              const done = i <= activeIndex;
              return (
                <div key={s.status} className="flex flex-col items-center text-center">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full ${
                      done
                        ? "bg-brand-red text-cream"
                        : "bg-brand-ink/5 text-muted"
                    }`}
                  >
                    <s.icon size={20} />
                  </span>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      done ? "text-brand-ink" : "text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-brand-red/10 px-4 py-3 text-sm font-semibold text-brand-red">
            This order was cancelled.
          </p>
        )}

        {/* items */}
        <div className="mt-8 border-t border-brand-ink/10 pt-6">
          <h2 className="font-heading text-lg font-bold text-brand-ink">
            Your box
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-brand-ink">
                  {it.quantity} × {it.name}
                </span>
                <span className="font-semibold">
                  {formatCurrency(it.price * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-brand-ink/10 pt-4">
            <span className="font-heading text-lg font-bold">Total</span>
            <span className="font-heading text-lg font-bold text-brand-red">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {order.fulfilment === "delivery" && order.address && (
          <p className="mt-5 text-sm text-muted">
            Delivering to: <span className="text-brand-ink">{order.address}</span>
          </p>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {failed ? (
          <Link to="/cart" className="btn-primary">
            Retry payment
          </Link>
        ) : (
          <Link to="/shop" className="btn-primary">
            Order more cookies
          </Link>
        )}
        <a
          href={whatsappLink(`Hi! I have a question about order ${order.id}.`)}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Questions? WhatsApp us
        </a>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Track this order anytime at {window.location.host}/order/{order.id} ·{" "}
        {BRAND.name}
      </p>
    </div>
  );
}
