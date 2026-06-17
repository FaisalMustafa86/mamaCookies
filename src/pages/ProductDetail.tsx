import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useData } from "../data/DataContext";
import { useToast } from "../components/Toast";
import { discountedPrice, formatCurrency } from "../lib/format";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, getCategory, products, addToCart, catalogLoading } =
    useData();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  const product = id ? getProduct(id) : undefined;

  if (catalogLoading && !product) {
    return (
      <div className="container-mc py-24 text-center text-muted">
        Loading cookie…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-mc py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-brand-ink">
          Cookie not found
        </h1>
        <p className="mt-2 text-muted">
          That one might've been eaten already.
        </p>
        <Link to="/shop" className="btn-primary mt-6">
          Back to the menu
        </Link>
      </div>
    );
  }

  const category = getCategory(product.categoryId);
  const finalPrice = discountedPrice(product.price, product.discountPercent);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  function handleAdd() {
    if (!product) return;
    addToCart(product.id, qty);
    toast(`${qty} × ${product.name} added to your box`);
  }

  return (
    <div className="container-mc py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-red"
      >
        <ArrowLeft size={16} /> Back to shop
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-[2rem] border border-brand-ink/10 bg-blush-light shadow-soft"
        >
          <ProductImage
            src={product.image}
            name={product.name}
            className="aspect-square h-full w-full object-cover"
          />
          {product.discountPercent && (
            <span className="absolute left-4 top-4 rounded-full bg-brand-red px-3 py-1 text-sm font-bold text-cream">
              {product.discountPercent}% off
            </span>
          )}
        </motion.div>

        <div className="flex flex-col">
          {category && (
            <Link
              to={`/shop?category=${category.slug}`}
              className="chip w-fit hover:bg-brand-red/10"
            >
              {category.icon} {category.name}
            </Link>
          )}
          <h1 className="mt-3 font-heading text-4xl font-extrabold text-brand-ink">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-heading text-3xl font-bold text-brand-red">
              {formatCurrency(finalPrice)}
            </span>
            {product.discountPercent && (
              <span className="text-lg text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-muted">/ {product.unit}</span>
          </div>

          <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-5">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red">
                <Check size={16} /> In stock & fresh
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
                Currently sold out
              </span>
            )}
          </div>

          {/* qty + add */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-brand-ink/15 bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-12 w-12 place-items-center rounded-full text-brand-ink hover:bg-brand-ink/5"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center font-heading text-lg font-bold">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid h-12 w-12 place-items-center rounded-full text-brand-ink hover:bg-brand-ink/5"
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="btn-primary flex-1 text-base sm:flex-none"
            >
              <ShoppingBag size={18} />
              {product.inStock ? "Add to box" : "Sold out"}
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-brand-red/30 bg-blush-light/60 p-4 text-sm text-brand-dark">
            ⚠️ <strong>Warning:</strong> deliciously good cookies inside — you
            should totally eat them.
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading text-2xl font-extrabold text-brand-ink">
            You might also crave
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
