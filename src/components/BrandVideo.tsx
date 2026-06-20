import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Brand video band — autoplay (muted) looping product reel beside the pitch.
export default function BrandVideo() {
  return (
    <section className="bg-brand-ink py-16 text-cream lg:py-20">
      <div className="container-mc grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="font-script text-3xl text-blush">the real thing</span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
            Gooey, molten, made-to-order.
          </h2>
          <p className="mt-5 max-w-md text-cream/70">
            No filters, no stock photos — just our small-batch cookies pulled
            fresh from the oven. Watch the pull, then come get your own box for
            loved ones.
          </p>
          <Link to="/shop" className="btn-primary mt-7">
            Shop the menu <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-white/10 shadow-lift">
          <video
            className="h-full w-full object-cover"
            src="/videos/brand.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls
          />
        </div>
      </div>
    </section>
  );
}
