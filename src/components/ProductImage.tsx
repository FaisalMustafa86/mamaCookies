import { Cookie } from "lucide-react";

// Renders a product photo, or — when a flavour has no photography yet
// (image === "") — a clean, on-brand placeholder tile with the cookie name.
export default function ProductImage({
  src,
  name,
  className = "",
  compact = false,
}: {
  src: string;
  name: string;
  className?: string;
  compact?: boolean;
}) {
  if (src) {
    return (
      <img src={src} alt={name} loading="lazy" className={className} />
    );
  }
  return (
    <div
      role="img"
      aria-label={name}
      className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blush-light via-blush to-brand-red/15 text-brand-red ${className}`}
    >
      <Cookie size={compact ? 18 : 40} strokeWidth={1.75} />
      {!compact && (
        <span className="max-w-[85%] text-center font-heading text-sm font-bold leading-tight text-brand-dark">
          {name}
        </span>
      )}
    </div>
  );
}
