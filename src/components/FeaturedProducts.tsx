import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useData } from "../data/DataContext";
import ProductCard from "./ProductCard";
import { Reveal, SectionHeading } from "./Section";

export default function FeaturedProducts() {
  const { products } = useData();
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="bg-blush-light/50 py-16">
      <div className="container-mc">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeading
              eyebrow="the line-up"
              title="Best Sellers"
              subtitle="Warm, gooey and dangerously good. These are the ones people keep coming back for."
            />
          </Reveal>
          <Reveal>
            <Link
              to="/shop"
              className="hidden items-center gap-1.5 font-semibold text-brand-red hover:gap-2.5 sm:inline-flex"
            >
              View all <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.45 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link to="/shop" className="btn-primary">
            View all cookies <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
