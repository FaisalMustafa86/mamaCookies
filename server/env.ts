// ---------------------------------------------------------------------------
// Load .env into process.env BEFORE any config module reads it.
// Must be the very first import in server/index.ts so config.ts/auth.ts see
// these values. Uses Node's built-in env-file parser (Node >= 20.12) — no deps.
// ---------------------------------------------------------------------------

import process from "node:process";

try {
  // Defaults to ./.env relative to the current working directory (project root).
  process.loadEnvFile();
} catch {
  // No .env present — fall back to the real environment / built-in defaults.
}
