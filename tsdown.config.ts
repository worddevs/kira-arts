import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["Src/index.ts"],
  format: ["esm", "cjs"],
  target: "es2022",
  outDir: "dist",
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
});
