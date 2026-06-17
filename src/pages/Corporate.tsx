import { useState } from "react";
import {
  Building2,
  Gift,
  GraduationCap,
  Repeat,
  BadgeCheck,
  Send,
} from "lucide-react";
import { Reveal, SectionHeading } from "../components/Section";
import { BRAND, whatsappLink } from "../lib/brand";

const SEGMENTS = [
  {
    icon: Building2,
    title: "Companies & clients",
    body: "Impress clients and partners with premium, branded cookie boxes.",
  },
  {
    icon: Gift,
    title: "Offices & teams",
    body: "Onboarding, birthdays, Eid and year-end — treats your team will remember.",
  },
  {
    icon: GraduationCap,
    title: "Universities",
    body: "Society events, farewells and campus activations, catered at scale.",
  },
  {
    icon: Repeat,
    title: "Recurring gifting",
    body: "Set up weekly or monthly cookie drops on a simple invoice.",
  },
];

export default function Corporate() {
  const [form, setForm] = useState({
    company: "",
    name: "",
    quantity: "",
    message: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hi Mama's Cookies! Corporate gifting enquiry:
Company: ${form.company}
Contact: ${form.name}
Approx quantity: ${form.quantity}
Details: ${form.message}`;
    window.open(whatsappLink(text), "_blank");
  }

  return (
    <div>
      {/* hero */}
      <section className="bg-brand-ink text-cream">
        <div className="container-mc grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <span className="font-script text-3xl text-blush">for loved ones at work</span>
            <h1 className="mt-1 font-heading text-4xl font-extrabold sm:text-5xl">
              Corporate Gifting
            </h1>
            <p className="mt-4 max-w-md text-cream/80">
              Send premium cookie boxes to your team, clients, or loved ones.
              Custom-branded, delivered across the Twin Cities, and invoiced the
              easy way.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={18} className="text-blush" /> Custom branding
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={18} className="text-blush" /> Bulk pricing
              </span>
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={18} className="text-blush" /> Invoicing
              </span>
            </div>
          </div>
          <img
            src="/images/box-hand.jpeg"
            alt="A hand holding a Mama's Cookies gift box"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift"
          />
        </div>
      </section>

      {/* segments */}
      <section className="container-mc py-16">
        <Reveal>
          <SectionHeading
            center
            eyebrow="who we gift for"
            title="Built for teams, clients & campuses"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map((s) => (
            <Reveal key={s.title}>
              <div className="card h-full p-7">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
                  <s.icon size={26} />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-brand-ink">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* enquiry form */}
      <section className="container-mc pb-20">
        <div className="grid items-center gap-10 rounded-[2.5rem] bg-blush-light/60 p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-brand-ink">
              Request a quote
            </h2>
            <p className="mt-3 text-muted">
              Tell us a little about your gifting needs and we'll get back to you
              with options and pricing — usually within a few hours.
            </p>
            <p className="mt-4 text-sm text-muted">
              Prefer to talk? WhatsApp us at{" "}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-red hover:underline"
              >
                {BRAND.contact.whatsapp}
              </a>
              .
            </p>
          </div>

          <form onSubmit={submit} className="card space-y-4 p-6">
            <div>
              <label className="label" htmlFor="co-company">Company / organisation</label>
              <input
                id="co-company"
                className="input"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="co-name">Your name</label>
                <input
                  id="co-name"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="co-qty">Approx. quantity</label>
                <input
                  id="co-qty"
                  className="input"
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="e.g. 50 boxes"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="co-msg">Details</label>
              <textarea
                id="co-msg"
                className="input min-h-[90px] resize-none"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Occasion, date, branding, delivery area…"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send size={18} /> Send enquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
