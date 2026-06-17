import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useData } from "../../data/DataContext";
import { useToast } from "../../components/Toast";
import { slugify } from "../../lib/slugify";
import type { Category } from "../../data/types";

type Draft = { name: string; slug: string; icon: string; description: string };

const EMPTY: Draft = { name: "", slug: "", icon: "🍪", description: "" };

export default function AdminCategories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    countProductsInCategory,
  } = useData();
  const toast = useToast();

  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  function openAdd() {
    setEditing(null);
    setDraft(EMPTY);
    setOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setDraft({
      name: c.name,
      slug: c.slug,
      icon: c.icon ?? "🍪",
      description: c.description ?? "",
    });
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      icon: draft.icon.trim() || "🍪",
      description: draft.description.trim(),
    };
    if (editing) {
      updateCategory(editing.id, payload);
      toast(`${payload.name} updated`);
    } else {
      addCategory(payload);
      toast(`${payload.name} added`);
    }
    setOpen(false);
  }

  function handleDelete(c: Category) {
    const count = countProductsInCategory(c.id);
    if (count > 0) {
      alert(
        `Can't delete "${c.name}" — it still has ${count} product(s). Reassign or remove them first.`,
      );
      return;
    }
    if (confirm(`Delete category "${c.name}"?`)) {
      deleteCategory(c.id);
      toast(`${c.name} deleted`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Add category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const count = countProductsInCategory(c.id);
          return (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush-light text-2xl">
                  {c.icon}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    aria-label={`Edit ${c.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-red/10 hover:text-brand-red"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    aria-label={`Delete ${c.name}`}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-red/10 hover:text-brand-red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="mt-3 font-heading text-lg font-bold text-brand-ink">
                {c.name}
              </h3>
              <p className="text-sm text-muted">/{c.slug}</p>
              {c.description && (
                <p className="mt-2 text-sm text-muted">{c.description}</p>
              )}
              <p className="mt-3 chip">{count} products</p>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-ink/50 p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-brand-ink/10 px-6 py-4">
              <h2 className="font-heading text-xl font-bold text-brand-ink">
                {editing ? "Edit category" : "Add category"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-ink/5"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="label" htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  className="input"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      name: e.target.value,
                      // auto-fill slug while it tracks the name
                      slug:
                        !editing && (d.slug === "" || d.slug === slugify(d.name))
                          ? slugify(e.target.value)
                          : d.slug,
                    }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="cf-slug">Slug</label>
                  <input
                    id="cf-slug"
                    className="input"
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, slug: e.target.value }))
                    }
                    placeholder="auto"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="cf-icon">Icon (emoji)</label>
                  <input
                    id="cf-icon"
                    className="input"
                    value={draft.icon}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, icon: e.target.value }))
                    }
                    placeholder="🍪"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="cf-desc">Description</label>
                <input
                  id="cf-desc"
                  className="input"
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, description: e.target.value }))
                  }
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
