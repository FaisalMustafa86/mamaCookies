import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, CalendarHeart, Globe } from "lucide-react";
import { Reveal, SectionHeading } from "./Section";

const TYPES = [
  {
    icon: Truck,
    title: "Same Day Delivery / Pickup",
    body: "Craving cookies today? Order before our cut-off for same-day delivery across DHA-2 and the Twin Cities — or pick up warm from our kitchen.",
    to: "/delivery",
    cta: "Order for today",
    available: true,
  },
  {
    icon: CalendarHeart,
    title: "Pre-Order / Event Order",
    body: "Planning ahead? Reserve cookie boxes and platters for birthdays, university events, weddings and corporate meetings.",
    to: "/events",
    cta: "Plan an order",
    available: true,
  },
];

export default function OrderTypes() {
  return (
    <section className="container-mc py-16">
      <Reveal>
        <SectionHeading
          center
          eyebrow="how would you like it?"
          title="Choose your order type"
          subtitle="Same-day cravings or planned celebrations — we've got both covered."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {TYPES.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
          >
            <Link
              to={t.to}
              className="group flex h-full flex-col rounded-3xl border border-brand-ink/10 bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                <t.icon size={28} />
              </span>
              <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                {t.title}
              </h3>
              <p className="mt-2 flex-1 text-muted">{t.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-red group-hover:gap-2.5">
                {t.cta} <ArrowRight size={18} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Nationwide shipping — coming soon */}
      <Reveal className="mt-6">
        <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-dashed border-brand-ink/20 bg-blush-light/50 px-8 py-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-ink/5 text-brand-ink">
              <Globe size={24} />
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-ink">
                Nationwide Shipping
              </h3>
              <p className="text-sm text-muted">
                Shipping cookies across Pakistan — we're baking up the logistics.
              </p>
            </div>
          </div>
          <span className="chip whitespace-nowrap">Coming soon</span>
        </div>
      </Reveal>
    </section>
  );
}
