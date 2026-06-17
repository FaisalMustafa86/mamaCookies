import { Link, useParams } from "react-router-dom";
import { BRAND, whatsappLink } from "../lib/brand";

type Policy = { title: string; intro: string; points: string[] };

const POLICIES: Record<string, Policy> = {
  shipping: {
    title: "Shipping Policy",
    intro:
      "We bake fresh and deliver across DHA-2 and the Rawalpindi–Islamabad Twin Cities.",
    points: [
      `Same-day delivery is available for orders placed before our daily cut-off. A flat delivery fee of Rs ${BRAND.deliveryFee} applies, and delivery is free on orders over Rs ${BRAND.freeDeliveryOver.toLocaleString("en-PK")}.`,
      "Pickup is available from our DHA Phase 2 kitchen at no charge — we'll message you when your order is boxed and ready.",
      "Delivery timings depend on order volume and distance; we'll keep you updated over WhatsApp.",
      "Nationwide shipping across Pakistan is coming soon.",
    ],
  },
  refund: {
    title: "Refund Policy",
    intro:
      "Your happiness matters. Because cookies are perishable, refunds follow a few simple rules.",
    points: [
      "If your order arrives damaged, incorrect, or not as described, contact us within 24 hours with a photo and we'll make it right — a replacement or refund.",
      "As food items are perishable, we can't accept returns once an order has been delivered and accepted in good condition.",
      "Approved refunds are processed back to your original payment method (Easypaisa or card) within 5–7 business days.",
      "Custom, event and corporate orders may have different terms agreed at the time of order.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "We only collect what we need to bake and deliver your order — nothing more.",
    points: [
      "We collect your name, phone/WhatsApp, email and delivery address solely to process and deliver your orders.",
      "Payments are handled by our payment provider (Easypaisa / card gateway). We do not store your full card details on our servers.",
      "We never sell your personal data. We may contact you about your order or, if you opt in, occasional offers.",
      "You can request access to or deletion of your data at any time by contacting us.",
    ],
  },
  terms: {
    title: "Terms of Service",
    intro:
      "By placing an order with Mama's Cookies you agree to the following terms.",
    points: [
      "Orders are confirmed once payment is received. Prices are in Pakistani Rupees (PKR) and may change without notice.",
      "We bake to order in small batches; availability of limited flavours can vary day to day.",
      "Allergen note: our cookies may contain wheat, dairy, eggs, nuts and soy, and are made in a kitchen that handles these ingredients.",
      "For event, catering and corporate orders, separate written terms and lead times may apply.",
    ],
  },
};

export default function StubPage() {
  const { slug = "" } = useParams();
  const policy = POLICIES[slug];

  if (!policy) {
    return (
      <div className="container-mc py-20 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-brand-ink">
          Policy not found
        </h1>
        <Link to="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="container-mc py-16">
      <div className="mx-auto max-w-2xl">
        <span className="font-script text-2xl text-brand-red">the fine print</span>
        <h1 className="mt-1 font-heading text-4xl font-extrabold text-brand-ink">
          {policy.title}
        </h1>
        <p className="mt-4 text-muted">{policy.intro}</p>
        <ul className="mt-6 space-y-4">
          {policy.points.map((p, i) => (
            <li key={i} className="flex gap-3 text-muted">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          Questions about this policy? Reach us on{" "}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-red hover:underline"
          >
            WhatsApp
          </a>{" "}
          or via our{" "}
          <Link to="/contact" className="font-semibold text-brand-red hover:underline">
            contact page
          </Link>
          .
        </p>
        <Link to="/" className="btn-secondary mt-8">
          Back home
        </Link>
      </div>
    </div>
  );
}
