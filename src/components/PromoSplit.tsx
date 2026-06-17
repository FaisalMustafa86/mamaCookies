import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Section";

// A reusable image + copy promo band, used for Corporate Gifting and
// Events & Catering on the homepage.
export default function PromoSplit({
  eyebrow,
  title,
  body,
  bullets,
  cta,
  to,
  image,
  imageAlt,
  reverse = false,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: string;
  to: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  dark?: boolean;
}) {
  return (
    <section className={dark ? "bg-blush-light/50 py-16" : "py-16"}>
      <div className="container-mc">
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <Reveal>
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <span className="font-script text-2xl text-brand-red">{eyebrow}</span>
            <h2 className="mt-1 font-heading text-3xl font-extrabold text-brand-ink sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-muted">{body}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-brand-ink">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                  {b}
                </li>
              ))}
            </ul>
            <Link to={to} className="btn-primary mt-7">
              {cta} <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
