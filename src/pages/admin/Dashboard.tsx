import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cookie,
  Banknote,
  PackageCheck,
  PackageX,
  ShoppingCart,
  Tags,
} from "lucide-react";
import { useData } from "../../data/DataContext";
import { formatCurrency, formatDate } from "../../lib/format";
import type { OrderStatus } from "../../data/types";

const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-400" },
  preparing: { label: "Preparing", color: "bg-blue-400" },
  out_for_delivery: { label: "Out for delivery", color: "bg-purple-400" },
  delivered: { label: "Delivered", color: "bg-brand-red" },
  cancelled: { label: "Cancelled", color: "bg-brand-ink/40" },
};

export default function Dashboard() {
  const { products, categories, orders, refreshOrders } = useData();

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.length - inStock;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const byStatus = (Object.keys(STATUS_META) as OrderStatus[]).map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));
  const maxCount = Math.max(1, ...byStatus.map((b) => b.count));

  const recent = orders.slice(0, 5);

  const cards = [
    {
      label: "Total cookies",
      value: products.length,
      icon: Cookie,
      tint: "bg-brand-red/10 text-brand-red",
    },
    {
      label: "In stock",
      value: inStock,
      icon: PackageCheck,
      tint: "bg-green-100 text-green-700",
    },
    {
      label: "Out of stock",
      value: outOfStock,
      icon: PackageX,
      tint: "bg-red-100 text-red-600",
    },
    {
      label: "Total orders",
      value: orders.length,
      icon: ShoppingCart,
      tint: "bg-blue-100 text-blue-700",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Tags,
      tint: "bg-purple-100 text-purple-700",
    },
    {
      label: "Revenue",
      value: formatCurrency(revenue),
      icon: Banknote,
      tint: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.tint}`}>
              <c.icon size={22} />
            </span>
            <div className="mt-3 font-heading text-2xl font-extrabold text-brand-ink">
              {c.value}
            </div>
            <div className="text-sm text-muted">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* orders by status */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-bold text-brand-ink">
            Orders by status
          </h2>
          <div className="mt-5 space-y-4">
            {byStatus.map((b) => (
              <div key={b.status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-brand-ink">
                    {STATUS_META[b.status].label}
                  </span>
                  <span className="text-muted">{b.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-brand-ink/10">
                  <div
                    className={`h-full rounded-full ${STATUS_META[b.status].color}`}
                    style={{ width: `${(b.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* recent orders */}
        <div className="card p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-brand-ink">
              Recent orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-brand-red hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-ink/10 text-muted">
                  <th className="pb-2 font-semibold">Order</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Total</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="hidden pb-2 font-semibold sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-brand-ink/5">
                    <td className="py-3 font-mono font-semibold text-brand-ink">
                      {o.id}
                    </td>
                    <td className="py-3 text-brand-ink">{o.customerName}</td>
                    <td className="py-3 font-semibold text-brand-ink">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                        <span
                          className={`h-2 w-2 rounded-full ${STATUS_META[o.status].color}`}
                        />
                        {STATUS_META[o.status].label}
                      </span>
                    </td>
                    <td className="hidden py-3 text-muted sm:table-cell">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
