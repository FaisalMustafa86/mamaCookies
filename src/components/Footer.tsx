import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { BRAND, whatsappLink } from "../lib/brand";

const USEFUL = [
  { label: "Shop Cookies", to: "/shop" },
  { label: "Nationwide Shipping", to: "/shipping" },
  { label: "Same Day Delivery / Pickup", to: "/delivery" },
  { label: "Corporate Gifting", to: "/corporate" },
  { label: "Events & Catering", to: "/events" },
  { label: "Our Story", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const POLICIES = [
  { label: "Shipping Policy", slug: "shipping" },
  { label: "Refund Policy", slug: "refund" },
  { label: "Privacy Policy", slug: "privacy" },
  { label: "Terms of Service", slug: "terms" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-ink/10 bg-white">
      <div className="container-mc grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">
            Premium cookies, made for loved ones. Baked fresh in small batches in
            the Twin Cities.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={BRAND.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-blush-light text-brand-red transition-colors hover:bg-brand-red hover:text-cream"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-brand-ink">
            Useful links
          </h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {USEFUL.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-brand-red">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-brand-ink">
            Policies
          </h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {POLICIES.map((s) => (
              <li key={s.slug}>
                <Link to={`/p/${s.slug}`} className="hover:text-brand-red">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-brand-ink">
            Get in touch
          </h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-brand-red" />
              <span>{BRAND.contact.area}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle size={18} className="shrink-0 text-brand-red" />
              <a
                href={whatsappLink("Hi Mama's Cookies! I'd like to order.")}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand-red"
              >
                WhatsApp {BRAND.contact.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={18} className="shrink-0 text-brand-red" />
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="hover:text-brand-red"
              >
                {BRAND.contact.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock size={18} className="mt-0.5 shrink-0 text-brand-red" />
              <span>
                {BRAND.hours.weekdays}
                <br />
                {BRAND.hours.weekend}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-ink/10">
        <div className="container-mc flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Mama's Cookies. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <span className="text-brand-red">♥</span> for loved ones ·{" "}
            <Link to="/admin/login" className="hover:text-brand-red">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
