import { defineConfig } from "rollup";
import ts from "@rollup/plugin-typescript";
export default defineConfig({
  plugins: [ts()],
  input: "./src/index.ts",
  output: [
    // 1. cjs
    {
      format: "cjs",
      file: "lib/mini-vue.cjs.js",
    },
    {
      format: "es",
      file: "lib/mini-vue.esm.js",
    },

    // 2.esm
  ],
});
