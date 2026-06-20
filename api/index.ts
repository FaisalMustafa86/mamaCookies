// Vercel serverless entry point. The Express app is itself a (req, res)
// handler, so we can export it directly. vercel.json rewrites /api/* and
// /pay/* to this function; the static frontend is served by Vercel from dist/.
import app from "../server/app.js";

export default app;
