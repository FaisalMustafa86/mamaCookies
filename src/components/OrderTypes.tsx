import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Globe, CalendarHeart } from "lucide-react";
import { Reveal, SectionHeading } from "./Section";

// The two primary ways to receive your cookies — the deliberate fork in the
// journey. Planned/event orders sit below as a lighter secondary option.
const TRACKS = [
  {
    icon: Globe,
    title: "Nationwide Shipping",
    body: "Anywhere in Pakistan. Order online and we courier your cookies fresh to your door — packed safe, tracked all the way.",
    to: "/shipping",
    cta: "Ship across Pakistan",
    tag: "Now available",
  },
  {
    icon: Truck,
    title: "Same-Day Delivery / Pickup",
    body: "In the Twin Cities? Order before our cut-off for same-day delivery across DHA-2 — or pick up warm from our kitchen.",
    to: "/delivery",
    cta: "Order for today",
    tag: "Local",
  },
];

export default function OrderTypes() {
  return (
    <section className="container-mc py-16">
      <Reveal>
        <SectionHeading
          center
          eyebrow="how would you like your cookies?"
          title="Choose how you'll get them"
          subtitle="Shipped across the country or same-day in the Twin Cities — pick your track."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {TRACKS.map((t, i) => (
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
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <t.icon size={28} />
                </span>
                <span className="chip bg-brand-red/10 text-brand-red">
                  {t.tag}
                </span>
              </div>
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

      {/* Secondary: planning ahead / events */}
      <Reveal className="mt-6">
        <Link
          to="/events"
          className="group flex flex-col items-center justify-between gap-3 rounded-3xl border border-brand-ink/10 bg-blush-light/50 px-8 py-6 text-center transition-colors hover:border-brand-red/30 sm:flex-row sm:text-left"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
              <CalendarHeart size={24} />
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-ink">
                Pre-Order / Event Order
              </h3>
              <p className="text-sm text-muted">
                Planning ahead? Reserve cookie boxes & platters for birthdays,
                events, weddings and corporate meetings.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-brand-red group-hover:gap-2.5">
            Plan an order <ArrowRight size={18} />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
