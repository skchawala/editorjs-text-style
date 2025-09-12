import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "EditorJSTextStyle",
      fileName: (format) => `editorjs-text-style.${format}.js`,
    },
    rollupOptions: {
      external: ["editorjs"], // don't bundle editorjs itself
      output: {
        globals: {
          editorjs: "EditorJS",
        },
      },
    },
  },
});
