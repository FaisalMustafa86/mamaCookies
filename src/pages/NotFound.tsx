import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-mc py-28 text-center">
      <div className="font-display text-7xl text-brand-red">404</div>
      <h1 className="mt-3 font-heading text-3xl font-extrabold text-brand-ink">
        Crumbs… this page got eaten
      </h1>
      <p className="mt-2 text-muted">
        The page you're after isn't on the menu.
      </p>
      <Link to="/" className="btn-primary mt-7">
        Back to fresh cookies
      </Link>
    </div>
  );
}
