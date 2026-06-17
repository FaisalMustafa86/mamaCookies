import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useData } from "../../data/DataContext";
import { useToast } from "../../components/Toast";
import ProductForm, {
  type ProductDraft,
} from "../../components/admin/ProductForm";
import ProductImage from "../../components/ProductImage";
import { formatCurrency } from "../../lib/format";
import type { Product } from "../../data/types";

export default function AdminProducts() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategory,
  } = useData();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesQuery = p.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCat = catFilter === "all" || p.categoryId === catFilter;
        return matchesQuery && matchesCat;
      }),
    [products, query, catFilter],
  );

  function handleSave(draft: ProductDraft) {
    if (editing) {
      updateProduct(editing.id, draft);
      toast(`${draft.name} updated`);
    } else {
      addProduct(draft);
      toast(`${draft.name} added`);
    }
    setEditing(null);
    setAdding(false);
  }

  function handleDelete(p: Product) {
    if (confirm(`Delete "${p.name}"? This can't be undone.`)) {
      deleteProduct(p.id);
      toast(`${p.name} deleted`);
    }
  }

  return (
    <div className="space-y-6">
      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              className="input pl-10"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="input sm:w-48"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary">
          <Plus size={18} /> Add cookie
        </button>
      </div>

      {/* table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-blush-light/60 text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Cookie</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cat = getCategory(p.categoryId);
                return (
                  <tr
                    key={p.id}
                    className="border-t border-brand-ink/5 hover:bg-blush-light/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          src={p.image}
                          name={p.name}
                          compact
                          className="h-11 w-11 shrink-0 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-semibold text-brand-ink">
                            {p.name}
                          </div>
                          <div className="text-xs text-muted">{p.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{cat?.name ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-brand-ink">
                      {formatCurrency(p.price)}
                      {p.discountPercent ? (
                        <span className="ml-1 text-xs text-brand-red">
                          -{p.discountPercent}%
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          updateProduct(p.id, { inStock: !p.inStock })
                        }
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          p.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.inStock ? "In stock" : "Sold out"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          updateProduct(p.id, { featured: !p.featured })
                        }
                        aria-label="Toggle featured"
                        className={`grid h-8 w-8 place-items-center rounded-full ${
                          p.featured
                            ? "bg-amber-100 text-amber-500"
                            : "bg-brand-ink/5 text-muted"
                        }`}
                      >
                        <Star
                          size={16}
                          fill={p.featured ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditing(p)}
                          aria-label={`Edit ${p.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-red/10 hover:text-brand-red"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          aria-label={`Delete ${p.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-red/10 hover:text-brand-red"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted">No cookies match.</p>
        )}
      </div>

      {(adding || editing) && (
        <ProductForm
          initial={editing ?? undefined}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setEditing(null);
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}
