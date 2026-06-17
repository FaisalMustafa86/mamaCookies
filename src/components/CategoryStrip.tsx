import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../data/DataContext";
import { Reveal, SectionHeading } from "./Section";

export default function CategoryStrip() {
  const { categories, products } = useData();

  return (
    <section className="container-mc py-16">
      <Reveal>
        <SectionHeading
          eyebrow="pick your craving"
          title="Browse by category"
        />
      </Reveal>

      <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {categories.map((cat, i) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group flex min-w-[180px] items-center gap-4 rounded-3xl border border-brand-ink/10 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lift"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blush-light text-2xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span>
                  <span className="block font-heading font-bold text-brand-ink group-hover:text-brand-red">
                    {cat.name}
                  </span>
                  <span className="text-sm text-muted">{count} treats</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
