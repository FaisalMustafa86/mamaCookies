import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Cookie, Search, SlidersHorizontal } from "lucide-react";

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};
import { useData } from "../data/DataContext";
import ProductCard from "../components/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export default function Shop() {
  const { products, categories, catalogLoading } = useData();
  const [params, setParams] = useSearchParams();
  const activeSlug = params.get("category") ?? "all";
  const queryParam = params.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [sort, setSort] = useState<Sort>("featured");

  // Keep the search box in sync when arriving via the header search (?q=…).
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  function selectCategory(slug: string) {
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    setParams(params, { replace: true });
  }

  const filtered = useMemo(() => {
    const activeCat = categories.find((c) => c.slug === activeSlug);
    let list = products.filter((p) => {
      const inCat = !activeCat || p.categoryId === activeCat.id;
      const matches =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      return inCat && matches;
    });

    list = list.slice().sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });
    return list;
  }, [products, categories, activeSlug, query, sort]);

  return (
    <div className="container-mc py-12">
      {/* page header */}
      <div className="text-center">
        <span className="font-script text-3xl text-brand-red">the menu</span>
        <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink">
          Shop Cookies
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Premium cookies, baked fresh in small batches — signatures, specialties
          and gift boxes. Same-day delivery & pickup across the Twin Cities.
        </p>
      </div>

      {/* controls */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <CatPill
            active={activeSlug === "all"}
            onClick={() => selectCategory("all")}
          >
            All cookies
          </CatPill>
          {categories.map((c) => (
            <CatPill
              key={c.id}
              active={activeSlug === c.slug}
              onClick={() => selectCategory(c.slug)}
            >
              <span>{c.icon}</span> {c.name}
            </CatPill>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cookies…"
              aria-label="Search cookies"
              className="input pl-10"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort cookies"
              className="input cursor-pointer appearance-none pl-10 pr-8"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* grid */}
      {catalogLoading ? (
        <div className="mt-16 text-center text-muted">Loading cookies…</div>
      ) : filtered.length > 0 ? (
        // Keyed on the active tab so it cleanly re-mounts and fades/staggers in
        // when you switch categories — smooth, without AnimatePresence pitfalls.
        <motion.div
          key={activeSlug}
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
        >
          {filtered.map((p) => (
            <motion.div key={p.id} variants={cardVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-blush-light text-brand-red">
            <Cookie size={36} />
          </span>
          <p className="font-heading text-xl font-bold text-brand-ink">
            No cookies found
          </p>
          <p className="max-w-sm text-muted">
            Try a different search or category — Mama's got plenty more in the oven.
          </p>
          <button
            onClick={() => {
              setQuery("");
              selectCategory("all");
            }}
            className="btn-secondary"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function CatPill({
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
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-brand-red text-cream shadow-soft"
          : "border border-brand-ink/15 bg-white text-brand-ink hover:border-brand-red hover:text-brand-red"
      }`}
    >
      {children}
    </button>
  );
}
