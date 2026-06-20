import { Link } from "react-router-dom";
import {
  Globe,
  Package,
  Truck,
  Clock,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Reveal, SectionHeading } from "../components/Section";
import { BRAND, whatsappLink } from "../lib/brand";

const STEPS = [
  {
    icon: Package,
    title: "Order online",
    body: "Pick your cookies and box sizes, then check out. Tell us your city and we'll confirm shipping charges over WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Baked & packed safe",
    body: "We bake fresh and seal each box in protective, courier-ready packaging so your cookies travel well.",
  },
  {
    icon: Truck,
    title: "Couriered to your door",
    body: "We hand off to our courier partners and share tracking. Cookies arrive anywhere in Pakistan, fresh and ready.",
  },
];

export default function Shipping() {
  return (
    <div>
      {/* hero */}
      <section className="bg-blush-light">
        <div className="container-mc py-16 text-center">
          <span className="font-script text-3xl text-brand-red">anywhere?</span>
          <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink sm:text-5xl">
            Nationwide Shipping
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Not in the Twin Cities? No problem. We now courier our cookies right
            across Pakistan — order from anywhere and we'll get them to your
            door.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-red/10 px-4 py-1.5 text-sm font-bold text-brand-red">
            <Globe size={16} /> Now available across Pakistan
          </span>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-primary">
              Shop Cookies
            </Link>
            <a
              href={whatsappLink("Hi! I'd like cookies shipped to my city.")}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Ask about shipping
            </a>
          </div>
        </div>
      </section>

      {/* how shipping works */}
      <section className="container-mc py-16">
        <Reveal>
          <SectionHeading
            center
            eyebrow="how it works"
            title="From our oven to your city"
            subtitle="Three simple steps — wherever in Pakistan you are."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="card h-full p-8">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <s.icon size={28} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-brand-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* details + lead time */}
      <section className="container-mc pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                <Clock size={28} />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                Lead time
              </h2>
              <p className="mt-2 text-muted">
                Nationwide orders are freshly baked, packed and dispatched, then
                typically reach you in 3–7 working days depending on your city.
                We'll keep you posted on WhatsApp the whole way.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                <MapPin size={28} />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                Shipping charges
              </h2>
              <p className="mt-2 text-muted">
                Shipping is charged by courier weight and destination city. After
                you order, we confirm the exact shipping cost over WhatsApp before
                we dispatch — no surprises.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* local cross-link */}
      <section className="container-mc pb-20">
        <Reveal>
          <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-brand-ink/10 bg-white px-8 py-6 text-center shadow-soft sm:flex-row sm:text-left">
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-ink">
                In {BRAND.contact.area}?
              </h3>
              <p className="text-sm text-muted">
                Get cookies the same day with local delivery or pickup instead.
              </p>
            </div>
            <Link to="/delivery" className="btn-secondary whitespace-nowrap">
              Same-Day Delivery / Pickup
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
