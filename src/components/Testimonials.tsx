import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Section";

const QUOTES = [
  {
    name: "Ananya R.",
    role: "Repeat customer",
    text: "The ChocoChee is genuinely out of this world. Soft, melty, that blue dough is unreal — I've ordered it four weekends in a row now.",
  },
  {
    name: "Dev P.",
    role: "Self-confessed cookie addict",
    text: "Ordered a Box of 4 for my mom's birthday. The BigBlack disappeared in minutes. 'Heaven's Oreo' is not an exaggeration.",
  },
  {
    name: "Meera S.",
    role: "First-timer",
    text: "LotusLove. That's it. That's the review. Caramel, white chocolate, that crunch — worth every single test batch they made.",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const q = QUOTES[index];

  const go = (dir: number) =>
    setIndex((i) => (i + dir + QUOTES.length) % QUOTES.length);

  return (
    <section className="container-mc py-16">
      <Reveal>
        <SectionHeading
          center
          eyebrow="from the fam"
          title="People are obsessed"
        />
      </Reveal>

      <div className="relative mx-auto mt-10 max-w-2xl">
        <div className="card overflow-hidden p-8 text-center sm:p-12">
          <Quote className="mx-auto text-brand-red/30" size={44} />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mt-4 text-lg text-brand-ink sm:text-xl">"{q.text}"</p>
              <div className="mt-6 flex items-center justify-center gap-1 text-brand-red">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <div className="mt-3 font-heading font-bold text-brand-ink">
                {q.name}
              </div>
              <div className="text-sm text-muted">{q.role}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition-colors hover:border-brand-red hover:text-brand-red"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-red" : "w-2.5 bg-brand-ink/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-ink/15 bg-white text-brand-ink transition-colors hover:border-brand-red hover:text-brand-red"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
