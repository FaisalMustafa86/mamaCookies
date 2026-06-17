import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

// Floating cookie images that bob around the hero visual.
const FLOATERS = [
  { src: "/images/chocochee.jpeg", x: "6%", y: "4%", size: 96, delay: 0, depth: 28 },
  { src: "/images/classic.jpeg", x: "64%", y: "-2%", size: 84, delay: 0.4, depth: 18 },
  { src: "/images/lotuslove.jpeg", x: "76%", y: "46%", size: 104, delay: 0.8, depth: 34 },
  { src: "/images/double.jpeg", x: "-2%", y: "56%", size: 78, delay: 1.2, depth: 22 },
  { src: "/images/hazelnut.jpeg", x: "42%", y: "74%", size: 70, delay: 0.6, depth: 14 },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  const reduce = useReducedMotion() ?? false;

  // Pointer parallax (desktop only). Raw motion values smoothed with springs.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px.set((e.clientX - (r.left + r.width / 2)) / r.width);
      py.set((e.clientY - (r.top + r.height / 2)) / r.height);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className={`absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-red/25 blur-3xl ${reduce ? "" : "animate-blob"}`}
        />
        <div
          className={`absolute right-0 top-10 h-80 w-80 rounded-full bg-blush/60 blur-3xl ${reduce ? "" : "animate-blob"}`}
          style={{ animationDelay: "-4s" }}
        />
        <div
          className={`absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-crust/25 blur-3xl ${reduce ? "" : "animate-blob"}`}
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <div className="container-mc relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        {/* ---- Left: copy ---- */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={rise}>
            <span className="chip">
              <Sparkles size={14} /> For loved ones · baked fresh daily
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] text-brand-ink sm:text-5xl lg:text-6xl"
          >
            Premium{" "}
            <span className="relative whitespace-nowrap text-brand-red">
              Cookies
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 8c40-6 120-6 196 0"
                  stroke="#E11D29"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>
            , Made for Loved Ones
          </motion.h1>

          <motion.p variants={rise} className="mt-6 max-w-md text-lg text-muted">
            Big, gooey, small-batch cookies baked fresh in the Twin Cities —
            molten chocolate, caramelised Biscoff, red-velvet and more. Same-day
            delivery & pickup across DHA-2, Rawalpindi–Islamabad.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary text-base">
              Shop Now <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base">
              How it works
            </a>
          </motion.div>

          <motion.p
            variants={rise}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted"
          >
            <span>🍪 Small-batch baked</span>
            <span>🚚 Same-day delivery</span>
            <span>❤️ 4.9★ from 12,000+ orders</span>
          </motion.p>
        </motion.div>

        {/* ---- Right: animated visual ---- */}
        <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-md">
          <HeroBox sx={sx} sy={sy} reduce={reduce} />

          {FLOATERS.map((f, i) => (
            <Floater key={f.src} {...f} index={i} sx={sx} sy={sy} reduce={reduce} />
          ))}

          {/* speed / freshness badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-ink px-4 py-2.5 text-sm font-semibold text-cream shadow-lift"
          >
            <motion.span
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="grid h-6 w-6 place-items-center rounded-full bg-brand-red"
            >
              <Clock size={14} />
            </motion.span>
            Fresh from the oven
          </motion.div>
        </div>
      </div>

      {/* scrolling marquee strip */}
      <div className="border-y border-brand-ink/10 bg-brand-red py-3 text-cream">
        <div className="flex overflow-hidden">
          <div
            className={`flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 font-display text-lg uppercase tracking-wider ${reduce ? "" : "animate-marquee"}`}
          >
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="flex items-center gap-8">
                <span>Classic Chocolate Chunk</span><Dot />
                <span>Red Royale</span><Dot />
                <span>Lotus Biscoff</span><Dot />
                <span>MisterMellow</span><Dot />
                <span>Walnut Brownie</span><Dot />
                <span>For loved ones</span><Dot />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="text-cream/50">★</span>;
}

type ParallaxProps = {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
};

function HeroBox({ sx, sy, reduce }: ParallaxProps) {
  const x = useTransform(sx, (v) => (reduce ? 0 : v * -20));
  const y = useTransform(sy, (v) => (reduce ? 0 : v * -20));
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: -3 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      style={{ x, y }}
      className="absolute inset-[12%] overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-lift"
    >
      <img
        src="/images/box-trio.jpeg"
        alt="A red Mama's Cookies box beside a stack of cookies"
        className="h-full w-full object-cover"
      />
    </motion.div>
  );
}

type FloaterProps = ParallaxProps & {
  src: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  depth: number;
  index: number;
};

function Floater({ src, x, y, size, delay, depth, index, sx, sy, reduce }: FloaterProps) {
  // Outer wrapper handles pointer parallax; inner image handles the bob loop,
  // so the two transforms never fight over the same `y`.
  const tx = useTransform(sx, (v) => (reduce ? 0 : v * depth));
  const ty = useTransform(sy, (v) => (reduce ? 0 : v * depth));
  return (
    <motion.div
      style={{ left: x, top: y, width: size, height: size, x: tx, y: ty }}
      className="absolute"
    >
      <motion.img
        src={src}
        alt=""
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          reduce
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, scale: 1, y: [0, -14, 0], rotate: [0, index % 2 ? 6 : -6, 0] }
        }
        transition={
          reduce
            ? { duration: 0.4 }
            : {
                opacity: { duration: 0.5, delay: 0.3 + delay },
                scale: { duration: 0.5, delay: 0.3 + delay },
                y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
              }
        }
        style={{ width: size, height: size }}
        className="rounded-full border-4 border-white object-cover shadow-soft"
      />
    </motion.div>
  );
}
