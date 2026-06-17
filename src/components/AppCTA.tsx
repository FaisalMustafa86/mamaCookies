import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";

export default function AppCTA() {
  return (
    <section className="container-mc py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-ink px-6 py-12 text-cream sm:px-12 sm:py-16">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-red/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-blush/20 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="font-script text-2xl text-blush">for loved ones</span>
            <h2 className="mt-1 font-heading text-3xl font-extrabold sm:text-4xl">
              Get the Mama's Cookies app
            </h2>
            <p className="mt-3 max-w-md text-cream/80">
              Order in two taps, spin the wheel for surprise treats, and never
              miss a limited drop. Your next gooey box is closer than you think.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#"
                className="flex items-center gap-3 rounded-2xl bg-cream px-5 py-3 text-brand-ink transition-transform hover:-translate-y-0.5"
              >
                <Apple size={26} />
                <span className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wide text-muted">
                    Download on the
                  </span>
                  <span className="font-heading font-bold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-2xl bg-cream px-5 py-3 text-brand-ink transition-transform hover:-translate-y-0.5"
              >
                <Play size={24} />
                <span className="text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-wide text-muted">
                    Get it on
                  </span>
                  <span className="font-heading font-bold">Google Play</span>
                </span>
              </a>
            </div>

            <Link
              to="/shop"
              className="mt-5 inline-block text-sm font-semibold text-blush underline-offset-4 hover:underline"
            >
              …or just order on the web →
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-cream/10 shadow-lift"
          >
            <img
              src="/images/box-hand.jpeg"
              alt="A hand holding a red Mama's Cookies box"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
