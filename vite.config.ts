import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, proxy the API + payment-gateway routes to the Express server (3001)
// so the SPA and backend run on one origin from the browser's perspective.
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
      "/pay": "http://localhost:3001",
    },
  },
});
