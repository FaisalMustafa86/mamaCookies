import { defineConfig } from "vitest/config";

// Unit tests target pure logic (lib/* + server/* helpers) — no DOM needed,
// so we run in the default node environment without the React plugin.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "server/**/*.test.ts"],
  },
});
