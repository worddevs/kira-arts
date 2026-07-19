import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["Src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2022",
  outDir: "dist",
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
});
