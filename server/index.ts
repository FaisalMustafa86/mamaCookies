import "./env.js"; // load .env before config/auth read process.env
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { PORT, PAYMENTS_MODE } from "./config.js";
import { app, ready } from "./app.js";

// ---------------------------------------------------------------------------
// Local / single-server entry point. Used by `npm run dev:server` and
// `npm start` to run the API (and serve the built frontend) on one port.
// On Vercel the app is exported as a serverless function instead — see
// api/index.ts — and this file is not used.
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");

ready
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🍪 Mama's Cookies API on http://localhost:${PORT}  (payments: ${PAYMENTS_MODE})`,
      );
      if (!fs.existsSync(DIST)) {
        console.log(
          "   dist/ not built yet — run `npm run build` for production.",
        );
      }
    });
  })
  .catch((err) => {
    console.error("Failed to initialise database:", err);
    process.exit(1);
  });
