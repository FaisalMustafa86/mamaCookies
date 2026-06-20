import { Link } from "react-router-dom";
import {
  Cake,
  GraduationCap,
  Briefcase,
  Heart,
  Coffee,
  PartyPopper,
} from "lucide-react";
import { Reveal, SectionHeading } from "../components/Section";
import { whatsappLink } from "../lib/brand";

const OCCASIONS = [
  { icon: Cake, title: "Birthdays", body: "Cookie cakes, platters and party boxes that wow the table." },
  { icon: GraduationCap, title: "University events", body: "Society events, farewells and stalls — catered at scale." },
  { icon: Briefcase, title: "Corporate meetings", body: "Boardroom platters and branded boxes for the office." },
  { icon: Heart, title: "Weddings", body: "Dessert tables and favours your guests will remember." },
  { icon: Coffee, title: "Cafés & wholesale", body: "Supply Mama's cookies on your café menu, fresh daily." },
  { icon: PartyPopper, title: "Any celebration", body: "If there's a reason to gather, there's a reason for cookies." },
];

export default function Events() {
  return (
    <div>
      {/* hero */}
      <section className="bg-blush-light">
        <div className="container-mc grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="font-script text-3xl text-brand-red">let's celebrate</span>
            <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink sm:text-5xl">
              Events & Catering
            </h1>
            <p className="mt-4 max-w-md text-muted">
              From birthdays and university events to corporate meetings, weddings
              and cafés — we cater cookie platters and dessert tables that steal
              the show. We've covered major events across the Twin Cities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink("Hi! I'd like to plan cookies for an event.")}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Plan your event
              </a>
              <Link to="/shop" className="btn-secondary">
                Browse the menu
              </Link>
            </div>
          </div>
          <img
            src="/images/cups.jpeg"
            alt="Branded 'For Loved Ones' cups at a Mama's Cookies event stall"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft"
          />
        </div>
      </section>

      {/* occasions */}
      <section className="container-mc py-16">
        <Reveal>
          <SectionHeading
            center
            eyebrow="what we cater"
            title="Cookies for every occasion"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((o) => (
            <Reveal key={o.title}>
              <div className="card h-full p-7">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <o.icon size={26} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-brand-ink">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{o.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* cta band */}
      <section className="container-mc pb-20">
        <div className="overflow-hidden rounded-[2.5rem] bg-brand-red px-8 py-12 text-center text-cream sm:px-12">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Got an event coming up?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/90">
            Tell us the date, headcount and vibe — we'll build a cookie spread to
            match. Pre-orders recommended for large events.
          </p>
          <a
            href={whatsappLink("Hi! I'd like a catering quote for an event.")}
            target="_blank"
            rel="noreferrer"
            className="btn mt-7 bg-cream text-brand-red hover:bg-white"
          >
            Get a catering quote
          </a>
        </div>
      </section>
    </div>
  );
}
