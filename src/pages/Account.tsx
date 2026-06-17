import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PackageSearch, ShoppingBag, MessageCircle } from "lucide-react";
import { Reveal } from "../components/Section";
import { whatsappLink } from "../lib/brand";

export default function Account() {
  const navigate = useNavigate();
  const [ref, setRef] = useState("");

  function track(e: React.FormEvent) {
    e.preventDefault();
    const id = ref.trim().toUpperCase();
    if (id) navigate(`/order/${id}`);
  }

  return (
    <div className="container-mc max-w-2xl py-16">
      <div className="text-center">
        <span className="font-script text-3xl text-brand-red">your account</span>
        <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink">
          Track an order
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Enter your order reference (e.g. MC-1042) to see its status and
          details. We sent it to you at checkout.
        </p>
      </div>

      <Reveal className="mt-8">
        <form onSubmit={track} className="card flex flex-col gap-3 p-6 sm:flex-row">
          <div className="relative flex-1">
            <PackageSearch
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="MC-1042"
              aria-label="Order reference"
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary sm:w-auto">
            Track order
          </button>
        </form>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/shop"
          className="flex items-center gap-3 rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-soft transition-colors hover:border-brand-red/40"
        >
          <ShoppingBag size={22} className="text-brand-red" />
          <div>
            <div className="font-heading font-bold text-brand-ink">Shop cookies</div>
            <div className="text-sm text-muted">Start a new box</div>
          </div>
        </Link>
        <a
          href={whatsappLink("Hi Mama's Cookies! I need help with my account.")}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-soft transition-colors hover:border-brand-red/40"
        >
          <MessageCircle size={22} className="text-brand-red" />
          <div>
            <div className="font-heading font-bold text-brand-ink">Need help?</div>
            <div className="text-sm text-muted">Chat with us on WhatsApp</div>
          </div>
        </a>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Full customer accounts (saved addresses & order history) are coming soon.
      </p>
    </div>
  );
}
