import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["Src/**/*.test.ts", "Src/**/__tests__/**/*.ts"],
    exclude: ["node_modules", "Dist", "Src/Public"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["Src/**/*.ts"],
      exclude: ["Src/**/*.test.ts", "Src/Public/**", "Src/**/index.ts"],
    },

    globals: false,
  },
});
