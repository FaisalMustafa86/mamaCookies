import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Cookie,
  Tags,
  ClipboardList,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { LogoMark } from "../Logo";
import { logout } from "../../lib/auth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Cookie, end: false },
  { to: "/admin/categories", label: "Categories", icon: Tags, end: false },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const title =
    NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))
      ?.label ?? "Admin";

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/admin" className="flex items-center gap-2.5 px-2 py-1">
        <LogoMark className="h-9 w-9" />
        <span className="flex flex-col leading-none">
          <span className="font-script text-lg text-brand-red">mama's</span>
          <span className="font-display text-sm tracking-wide text-cream">
            ADMIN
          </span>
        </span>
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-brand-red text-cream"
                  : "text-cream/70 hover:bg-white/10 hover:text-cream"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}

        <div className="my-3 border-t border-white/10" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      <Link
        to="/"
        className="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-cream hover:bg-white/15"
      >
        <ExternalLink size={16} /> View storefront
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-brand-ink p-5 lg:block">
        {sidebar}
      </aside>

      {/* mobile drawer */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-brand-ink/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-brand-ink p-5 lg:hidden">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 text-cream/70 hover:text-cream"
            >
              <X size={22} />
            </button>
            {sidebar}
          </aside>
        </>
      )}

      {/* main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-brand-ink/10 bg-cream/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-brand-ink/5 lg:hidden"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-heading text-xl font-bold text-brand-ink">
              {title}
            </h1>
          </div>
          <Link
            to="/"
            className="hidden items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-red sm:flex"
          >
            <ExternalLink size={16} /> View storefront
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
