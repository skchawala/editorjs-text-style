import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "EditorJSTextStyle",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // Make sure to exclude peer dependencies from bundle
      external: ["@editorjs/editorjs"],
      output: {
        globals: {
          "@editorjs/editorjs": "EditorJS",
        },
      },
    },
    minify: true,
  },
});
