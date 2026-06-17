import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import HowItWorks from "../components/HowItWorks";
import OrderTypes from "../components/OrderTypes";
import PromoSplit from "../components/PromoSplit";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <HowItWorks />
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
        image="/images/box-hand.jpeg"
        imageAlt="A hand holding a Mama's Cookies gift box"
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
        image="/images/assortment.jpeg"
        imageAlt="An assortment of Mama's Cookies laid out"
        reverse
        dark
      />

      <Testimonials />
    </>
  );
}
