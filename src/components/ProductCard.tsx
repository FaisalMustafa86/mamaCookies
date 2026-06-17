import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Product } from "../data/types";
import { discountedPrice, formatCurrency } from "../lib/format";
import { useData } from "../data/DataContext";
import { useToast } from "./Toast";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useData();
  const toast = useToast();

  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const hasDiscount = !!product.discountPercent;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!product.inStock) return;
    addToCart(product.id);
    toast(`${product.name} added to your box`);
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group card flex flex-col overflow-hidden"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-blush-light"
      >
        <ProductImage
          src={product.image}
          name={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-bold text-cream">
              {product.discountPercent}% off
            </span>
          )}
          {product.tags?.includes("new") && (
            <span className="rounded-full bg-brand-ink px-2.5 py-1 text-xs font-bold text-cream">
              New
            </span>
          )}
          {product.tags?.includes("bestseller") && (
            <span className="rounded-full bg-crust px-2.5 py-1 text-xs font-bold text-cream">
              Bestseller
            </span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-cream/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-brand-ink px-4 py-1.5 text-sm font-bold text-cream">
              Sold out
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading text-lg font-bold text-brand-ink group-hover:text-brand-red">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted">{product.unit}</p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-xl font-bold text-brand-ink">
              {formatCurrency(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-red text-cream shadow-soft transition-all hover:bg-brand-dark hover:scale-105 disabled:bg-brand-ink/20 disabled:text-brand-ink/40"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
