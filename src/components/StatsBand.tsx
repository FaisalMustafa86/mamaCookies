import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { BRAND } from "../lib/brand";

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const isFloat = !Number.isInteger(value);
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  const formatted = isFloat
    ? display.toFixed(1)
    : Math.round(display).toLocaleString("en-PK");

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsBand() {
  return (
    <section className="bg-brand-red py-14 text-cream">
      <div className="container-mc grid grid-cols-2 gap-8 lg:grid-cols-4">
        {BRAND.stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl sm:text-5xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-wider text-cream/80">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
