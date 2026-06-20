import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import HowItWorks from "../components/HowItWorks";
import OrderTypes from "../components/OrderTypes";
import BrandVideo from "../components/BrandVideo";
import PromoSplit from "../components/PromoSplit";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <HowItWorks />
      <BrandVideo />
      <OrderTypes />

      <PromoSplit
        eyebrow="for teams & clients"
        title="Corporate Gifting"
        body="Send premium cookie boxes to your team, clients, or loved ones. Perfect for offices, universities, onboarding, Eid and year-end gifting — optionally branded with your company card."
        bullets={[
          "Custom-branded gift boxes",
          "Bulk & recurring orders",
          "Office & university delivery",
          "Invoicing available",
        ]}
        cta="Explore corporate gifting"
        to="/corporate"
        image="/images/velvet-hearts.jpeg"
        imageAlt="Heart-shaped red velvet cookies in branded Mama's Cookies sleeves"
      />

      <PromoSplit
        eyebrow="celebrations, sorted"
        title="Events & Catering"
        body="From birthdays and university events to corporate meetings, weddings and cafés — we cater cookie platters and dessert tables that steal the show."
        bullets={[
          "Birthdays & weddings",
          "University & corporate events",
          "Dessert tables & platters",
          "Café & wholesale supply",
        ]}
        cta="Plan your event"
        to="/events"
        image="/images/stall-wheel.jpeg"
        imageAlt="The Mama's Cookies event stall with a spin-the-wheel game at night"
        reverse
        dark
      />

      <Testimonials />
    </>
  );
}
