import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { useData } from "../data/DataContext";

const NAV = [
  { to: "/shop", label: "Shop Cookies" },
  { to: "/delivery", label: "Delivery / Pickup" },
  { to: "/corporate", label: "Corporate Gifting" },
  { to: "/events", label: "Events & Catering" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { cartCount } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "bg-cream/90 shadow-soft backdrop-blur-md" : "bg-cream"
      }`}
    >
      <div className="container-mc flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="Mama's Cookies home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-red/10 text-brand-red"
                    : "text-brand-ink hover:bg-brand-ink/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search cookies"
            className="grid h-11 w-11 place-items-center rounded-full text-brand-ink transition-colors hover:bg-brand-ink/5"
          >
            <Search size={20} />
          </button>

          <Link
            to="/account"
            aria-label="Account"
            className="hidden h-11 w-11 place-items-center rounded-full text-brand-ink transition-colors hover:bg-brand-ink/5 sm:grid"
          >
            <User size={20} />
          </Link>

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative grid h-11 w-11 place-items-center rounded-full text-brand-ink transition-colors hover:bg-brand-ink/5"
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1 text-[11px] font-bold text-cream"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-brand-ink transition-colors hover:bg-brand-ink/5 lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-ink/10 bg-cream"
          >
            <form onSubmit={submitSearch} className="container-mc py-3">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cookies — Lotus, Red Royale, boxes…"
                  aria-label="Search cookies"
                  className="input pl-11"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-brand-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-72 max-w-[80%] flex-col bg-cream p-6 shadow-lift lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-script text-xl text-brand-red">mama's</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-ink/5"
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-base font-semibold ${
                        isActive
                          ? "bg-brand-red/10 text-brand-red"
                          : "text-brand-ink hover:bg-brand-ink/5"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-brand-ink hover:bg-brand-ink/5"
                >
                  Account
                </NavLink>
              </nav>
              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="btn-primary mt-6"
              >
                Shop Now
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="mt-auto text-center text-sm text-muted hover:text-brand-red"
              >
                Admin login
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
