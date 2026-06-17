import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "../components/Toast";
import { BRAND, whatsappLink } from "../lib/brand";

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hi Mama's Cookies! ${form.message}\n\n— ${form.name}${
      form.email ? ` (${form.email})` : ""
    }`;
    window.open(whatsappLink(text), "_blank");
    toast("Opening WhatsApp to send your message… 🍪");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="container-mc py-12">
      <div className="text-center">
        <span className="font-script text-3xl text-brand-red">say hi</span>
        <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink">
          Get in touch
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Custom boxes for an event? A collab? Or just want to tell us the Lotus
          Biscoff changed your life? We're all ears.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* form */}
        <form onSubmit={handleSubmit} className="card p-7 sm:p-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <input
                id="name"
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="label">
                Message
              </label>
              <textarea
                id="message"
                className="input min-h-[140px] resize-none"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell us everything…"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              <Send size={18} /> Send via WhatsApp
            </button>
            <p className="text-center text-xs text-muted">
              This opens WhatsApp with your message ready to send.
            </p>
          </div>
        </form>

        {/* details */}
        <div className="space-y-4">
          <InfoCard icon={MapPin} title="Find us">
            {BRAND.contact.area}
          </InfoCard>
          <InfoCard icon={MessageCircle} title="WhatsApp">
            <a
              href={whatsappLink("Hi Mama's Cookies!")}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-red"
            >
              {BRAND.contact.whatsapp}
            </a>
          </InfoCard>
          <InfoCard icon={Mail} title="Email us">
            <a
              href={`mailto:${BRAND.contact.email}`}
              className="hover:text-brand-red"
            >
              {BRAND.contact.email}
            </a>
          </InfoCard>
          <InfoCard icon={Clock} title="Baking hours">
            {BRAND.hours.weekdays}
            <br />
            {BRAND.hours.weekend}
          </InfoCard>

          {/* map placeholder */}
          <div className="flex h-48 items-center justify-center rounded-3xl border border-dashed border-brand-ink/20 bg-blush-light text-muted">
            <span className="flex items-center gap-2">
              <MapPin size={18} /> {BRAND.contact.area}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-brand-ink/10 bg-white p-5 shadow-soft">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-red/10 text-brand-red">
        <Icon size={22} />
      </span>
      <div>
        <h3 className="font-heading font-bold text-brand-ink">{title}</h3>
        <p className="text-sm text-muted">{children}</p>
      </div>
    </div>
  );
}
