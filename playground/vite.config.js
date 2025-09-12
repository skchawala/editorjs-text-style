import { defineConfig } from "vite";

export default defineConfig({
  root: "playground",
  entry: "./main.ts",
  server: {
    port: 3000,
  },
});
