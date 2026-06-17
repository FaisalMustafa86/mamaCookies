import { motion } from "framer-motion";
import { ClipboardList, CookingPot, Truck, PartyPopper } from "lucide-react";
import { Reveal, SectionHeading } from "./Section";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Place Order",
    body: "Browse the menu, build your box and check out in seconds. Choose same-day delivery or pickup.",
  },
  {
    icon: CookingPot,
    title: "Freshly Baked & Packed",
    body: "Every order is baked in small batches the same day — never shelf-worn — and boxed warm with love.",
  },
  {
    icon: Truck,
    title: "Out for Delivery",
    body: "Your cookies head out across DHA-2 and the Twin Cities, or are made ready for pickup.",
  },
  {
    icon: PartyPopper,
    title: "Enjoy Your Cookies",
    body: "Gooey centre, crackly top, molten chocolate. Warning: deliciously good cookies inside.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-mc scroll-mt-24 py-16">
      <Reveal>
        <SectionHeading
          center
          eyebrow="how it works"
          title="From oven to you in 4 steps"
        />
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="relative card p-8 text-center"
          >
            <span className="absolute right-6 top-5 font-display text-5xl text-blush">
              0{i + 1}
            </span>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
              <step.icon size={30} />
            </span>
            <h3 className="mt-5 font-heading text-xl font-bold text-brand-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
