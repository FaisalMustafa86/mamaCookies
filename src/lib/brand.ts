// Central brand constants — easy to edit in one place.
// NOTE: deliveryFee / freeDeliveryOver mirror the server (server/config.ts).
// The server recomputes order totals authoritatively; these are for display.
export const BRAND = {
  name: "Mama's Cookies",
  shortName: "MC",
  tagline: "Premium Cookies, Made for Loved Ones",
  subTagline: "Baked fresh, in small batches — for loved ones.",
  warning: "Deliciously good cookies inside (you should totally eat them).",
  deliveryFee: 150, // PKR — same-day delivery
  freeDeliveryOver: 3000, // PKR
  contact: {
    phone: "+92 300 0012345",
    whatsapp: "+92 300 0012345",
    email: "hello@mamascookies.pk",
    area: "DHA Phase 2, Rawalpindi–Islamabad",
    address: "DHA Phase 2, Rawalpindi–Islamabad, Pakistan",
  },
  hours: {
    weekdays: "Mon–Fri · 12pm – 11pm",
    weekend: "Sat–Sun · 1pm – 12am",
  },
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    facebook: "https://facebook.com/",
  },
  stats: [
    { label: "Cookies baked", value: 20000, suffix: "+" },
    { label: "Happy orders", value: 12000, suffix: "+" },
    { label: "Test batches", value: 100, suffix: "+" },
    { label: "Avg. rating", value: 4.9, suffix: "★" },
  ],
};

/** WhatsApp deep link (digits only, no +/spaces). */
export function whatsappLink(text?: string): string {
  const digits = BRAND.contact.whatsapp.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}
