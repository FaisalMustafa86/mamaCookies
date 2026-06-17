import { useEffect, useMemo, useState } from "react";
import { useData } from "../../data/DataContext";
import { formatCurrency, formatDate } from "../../lib/format";
import type { OrderStatus } from "../../data/types";

const STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-700" },
  { value: "preparing", label: "Preparing", color: "bg-blue-100 text-blue-700" },
  {
    value: "out_for_delivery",
    label: "Out for delivery",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-700",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
  },
];

export default function AdminOrders() {
  const { orders, updateOrderStatus, refreshOrders } = useData();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  return (
    <div className="space-y-6">
      {/* filter pills */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
          All ({orders.length})
        </FilterPill>
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s.value).length;
          return (
            <FilterPill
              key={s.value}
              active={filter === s.value}
              onClick={() => setFilter(s.value)}
            >
              {s.label} ({count})
            </FilterPill>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-blush-light/60 text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
                const meta = STATUSES.find((s) => s.value === o.status);
                return (
                  <tr
                    key={o.id}
                    className="border-t border-brand-ink/5 align-top hover:bg-blush-light/30"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-brand-ink">
                      {o.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-brand-ink">
                        {o.customerName}
                      </div>
                      <div className="max-w-[180px] text-xs text-muted">
                        {o.address}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <span className="font-semibold text-brand-ink">
                        {itemCount}
                      </span>
                      <div className="max-w-[200px] text-xs">
                        {o.items
                          .map((i) => `${i.quantity}× ${i.name}`)
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-ink">
                      {formatCurrency(o.total)}
                    </td>
                    <td className="hidden px-4 py-3 text-muted md:table-cell">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            o.id,
                            e.target.value as OrderStatus,
                          )
                        }
                        className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-brand-red/40 ${meta?.color}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted">No orders here.</p>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-brand-red text-cream"
          : "border border-brand-ink/15 bg-white text-brand-ink hover:border-brand-red hover:text-brand-red"
      }`}
    >
      {children}
    </button>
  );
}
