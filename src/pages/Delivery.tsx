import { Link } from "react-router-dom";
import { Truck, Store, Clock, MapPin, CalendarHeart, Globe } from "lucide-react";
import { Reveal, SectionHeading } from "../components/Section";
import { BRAND, whatsappLink } from "../lib/brand";

export default function Delivery() {
  return (
    <div>
      {/* hero */}
      <section className="bg-blush-light">
        <div className="container-mc py-16 text-center">
          <span className="font-script text-3xl text-brand-red">today?</span>
          <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink sm:text-5xl">
            Same Day Delivery / Pickup
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Fresh cravings, sorted fast. Order before our daily cut-off for
            same-day delivery across {BRAND.contact.area}, or pick up warm from
            our kitchen.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-primary">
              Shop Now
            </Link>
            <a
              href={whatsappLink("Hi! I'd like a same-day cookie delivery.")}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* two options */}
      <section className="container-mc py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                <Truck size={28} />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                Same-day delivery
              </h2>
              <p className="mt-2 text-muted">
                Order before our cut-off and we'll bake and deliver the same day.
                A flat delivery fee of Rs {BRAND.deliveryFee} applies — free over
                Rs {BRAND.freeDeliveryOver.toLocaleString("en-PK")}.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-brand-ink">
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-red" /> {BRAND.contact.area}
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-red" /> {BRAND.hours.weekdays}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                <Store size={28} />
              </span>
              <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                Pickup
              </h2>
              <p className="mt-2 text-muted">
                Skip the fee and grab your box warm from our DHA-2 kitchen. We'll
                message you the moment it's boxed and ready.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-brand-ink">
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-red" /> DHA Phase 2 kitchen
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-red" /> {BRAND.hours.weekend}
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* pre-order + nationwide */}
      <section className="container-mc pb-20">
        <Reveal>
          <SectionHeading
            center
            eyebrow="planning ahead?"
            title="More ways to order"
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            to="/events"
            className="group flex items-center gap-4 rounded-3xl border border-brand-ink/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
              <CalendarHeart size={24} />
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-ink">
                Pre-Order / Event Order
              </h3>
              <p className="text-sm text-muted">
                Reserve boxes & platters for events and celebrations.
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4 rounded-3xl border border-dashed border-brand-ink/20 bg-blush-light/50 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-ink/5 text-brand-ink">
              <Globe size={24} />
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-ink">
                Nationwide Shipping <span className="chip ml-1">Coming soon</span>
              </h3>
              <p className="text-sm text-muted">
                Cookies shipped across Pakistan — we're almost there.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
