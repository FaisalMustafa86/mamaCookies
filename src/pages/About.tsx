import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, FlaskConical, Store, MapPin, Rocket } from "lucide-react";
import { Reveal, SectionHeading } from "../components/Section";

const JOURNEY = [
  {
    icon: Home,
    title: "Started at home, with Mama",
    body: "It began in our own kitchen — me and my mother, one oven, and a stubborn idea that a cookie should be an event, not an afterthought.",
  },
  {
    icon: FlaskConical,
    title: "Recipes, tested and re-tested",
    body: "100+ test batches and a few kitchen meltdowns later, we dialled in the gooey centres, crackly tops and loaded flavours we're known for.",
  },
  {
    icon: Store,
    title: "First stalls at university events",
    body: "We took the cookies to campus — pop-up stalls at university events where the queues told us we were onto something.",
  },
  {
    icon: MapPin,
    title: "Covering the Twin Cities",
    body: "From there we catered major events across Rawalpindi and Islamabad, building a name one warm box at a time.",
  },
  {
    icon: Rocket,
    title: "What's next",
    body: "Now we're moving toward café partnerships, Foodpanda, this website and a proper production setup — bringing Mama's to more loved ones.",
  },
];

export default function About() {
  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden bg-blush-light">
        <div className="container-mc grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="font-script text-3xl text-brand-red">our story</span>
            <h1 className="mt-2 font-heading text-4xl font-extrabold leading-tight text-brand-ink sm:text-5xl">
              From a home kitchen to the Twin Cities' favourite cookie.
            </h1>
            <p className="mt-5 max-w-md text-muted">
              Mama's Cookies started with one stubborn idea and one oven. Big,
              molten-centred, ridiculously loaded cookies — the kind you
              photograph before you devour. This is the story of how a
              mother-and-child kitchen experiment became a brand for loved ones.
            </p>
            <Link to="/shop" className="btn-primary mt-7">
              Taste the story
            </Link>
          </div>
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/rack.jpeg"
                alt="Freshly baked cookies cooling on a rack"
                className="aspect-square w-full rounded-3xl object-cover shadow-soft"
              />
              <img
                src="/images/bag.jpeg"
                alt="A cookie in a branded Mama's Cookies paper bag"
                className="mt-8 aspect-square w-full rounded-3xl object-cover shadow-soft"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* journey timeline */}
      <section className="container-mc py-16">
        <Reveal>
          <SectionHeading
            center
            eyebrow="the journey"
            title="How Mama's grew"
          />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl">
          {JOURNEY.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="relative flex gap-5 pb-10 last:pb-0"
            >
              {/* line */}
              {i < JOURNEY.length - 1 && (
                <span className="absolute left-[27px] top-14 h-[calc(100%-2.5rem)] w-0.5 bg-brand-red/20" />
              )}
              <span className="z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-red text-cream shadow-soft">
                <step.icon size={24} />
              </span>
              <div className="pt-1.5">
                <h3 className="font-heading text-xl font-bold text-brand-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-muted">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* warning band */}
      <section className="container-mc pb-20">
        <div className="rounded-[2.5rem] bg-brand-ink p-8 text-center text-cream sm:p-12">
          <h2 className="font-heading text-3xl font-extrabold">
            Made for loved ones
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Every box is a little love letter — baked fresh, in small batches.
            Warning: deliciously good cookies inside (you should totally eat
            them).
          </p>
          <Link to="/shop" className="btn mt-7 bg-cream text-brand-red hover:bg-white">
            Shop the cookies
          </Link>
        </div>
      </section>
    </div>
  );
}
