import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { login } from "../../lib/auth";
import { Logo } from "../../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const ok = await login(username, password);
    setBusy(false);
    if (ok) {
      navigate("/admin");
    } else {
      setError("Wrong credentials. Check your username and password.");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-blush-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-center font-heading text-2xl font-extrabold text-brand-ink">
            Admin login
          </h1>
          <p className="mt-1 text-center text-sm text-muted">
            Manage cookies, categories & orders.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  id="username"
                  className="input pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  id="password"
                  type="password"
                  className="input pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-brand-red/10 px-4 py-2.5 text-sm font-medium text-brand-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full"
            >
              {busy ? "Signing in…" : "Log in"}
            </button>
          </form>

          <p className="mt-4 rounded-2xl border border-dashed border-brand-red/30 bg-blush-light/60 p-4 text-xs text-muted">
            Credentials are set on the server via the{" "}
            <code className="font-mono text-brand-red">ADMIN_USERNAME</code> /{" "}
            <code className="font-mono text-brand-red">ADMIN_PASSWORD</code>{" "}
            environment variables (default{" "}
            <code className="font-mono text-brand-red">admin</code> /{" "}
            <code className="font-mono text-brand-red">mama123</code>).
          </p>
        </div>

        <Link
          to="/"
          className="mt-5 block text-center text-sm font-semibold text-muted hover:text-brand-red"
        >
          ← Back to storefront
        </Link>
      </motion.div>
    </div>
  );
}
