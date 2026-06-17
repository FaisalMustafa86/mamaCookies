import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Category, Product } from "../../data/types";

export type ProductDraft = Omit<Product, "id">;

const EMPTY: ProductDraft = {
  name: "",
  categoryId: "",
  price: 300,
  unit: "1 cookie",
  image: "/images/classic.jpeg",
  description: "",
  inStock: true,
  featured: false,
  discountPercent: undefined,
  tags: [],
};

export default function ProductForm({
  initial,
  categories,
  onSave,
  onClose,
}: {
  initial?: Product;
  categories: Category[];
  onSave: (draft: ProductDraft) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>(() => {
    if (initial) {
      const { id: _id, ...rest } = initial;
      void _id;
      return rest;
    }
    return { ...EMPTY, categoryId: categories[0]?.id ?? "" };
  });

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...draft,
      price: Number(draft.price) || 0,
      discountPercent: draft.discountPercent
        ? Number(draft.discountPercent)
        : undefined,
      tags:
        typeof draft.tags === "string"
          ? (draft.tags as string)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : draft.tags,
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-ink/50 p-0 sm:items-center sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-brand-ink/10 bg-white px-6 py-4">
          <h2 className="font-heading text-xl font-bold text-brand-ink">
            {initial ? "Edit cookie" : "Add cookie"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-ink/5"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="label" htmlFor="pf-name">Name</label>
            <input
              id="pf-name"
              className="input"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="pf-cat">Category</label>
              <select
                id="pf-cat"
                className="input"
                value={draft.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="pf-unit">Unit</label>
              <input
                id="pf-unit"
                className="input"
                value={draft.unit}
                onChange={(e) => set("unit", e.target.value)}
                placeholder="1 cookie / Box of 4"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="pf-price">Price (Rs)</label>
              <input
                id="pf-price"
                type="number"
                min={0}
                className="input"
                value={draft.price}
                onChange={(e) => set("price", Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="pf-disc">Discount %</label>
              <input
                id="pf-disc"
                type="number"
                min={0}
                max={90}
                className="input"
                value={draft.discountPercent ?? ""}
                onChange={(e) =>
                  set(
                    "discountPercent",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                placeholder="none"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="pf-img">Image URL</label>
            <input
              id="pf-img"
              className="input"
              value={draft.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="/images/classic.jpeg or https://…"
            />
            {draft.image && (
              <img
                src={draft.image}
                alt="preview"
                className="mt-2 h-20 w-20 rounded-xl object-cover"
              />
            )}
          </div>

          <div>
            <label className="label" htmlFor="pf-desc">Description</label>
            <textarea
              id="pf-desc"
              className="input min-h-[90px] resize-none"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="pf-tags">Tags (comma-separated)</label>
            <input
              id="pf-tags"
              className="input"
              value={
                Array.isArray(draft.tags) ? draft.tags.join(", ") : draft.tags
              }
              onChange={(e) =>
                set("tags", e.target.value as unknown as string[])
              }
              placeholder="new, bestseller"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-red"
                checked={draft.inStock}
                onChange={(e) => set("inStock", e.target.checked)}
              />
              In stock
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-brand-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-brand-red"
                checked={draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured on homepage
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {initial ? "Save changes" : "Add cookie"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
