/** Format a number as Pakistani Rupees, e.g. 1300 -> "Rs 1,300". */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Price after applying an optional discount percentage. */
export function discountedPrice(price: number, discountPercent?: number): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

/** Human-friendly date, e.g. "9 Jun 2026, 3:54 pm". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
