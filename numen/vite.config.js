import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Root aliases
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@data": path.resolve(__dirname, "./src/data"),

      // Component type aliases
      "@layout": path.resolve(__dirname, "./src/components/layout"),
      "@pages": path.resolve(__dirname, "./src/components/pages"),
      "@ui": path.resolve(__dirname, "./src/components/ui"),

      // Page-specific aliases (most commonly imported)
      "@Home": path.resolve(__dirname, "./src/components/pages/Home"),
      "@Profile": path.resolve(__dirname, "./src/components/pages/Profile"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Automatically add variables and mixins to every SCSS file
        // So you don't have to write @use imports in each component file
        additionalData: (content, filename) => {
          // Skip main.scss and partials (files starting with _) - they already have imports
          if (filename.includes("main.scss") || filename.includes("styles/_")) {
            return content;
          }
          // path.resolve builds the full file location (like /Users/pablo/code/.../variables)
          // instead of a short name that SCSS can't find
          return `@use '${path.resolve(
            __dirname,
            "src/styles/variables",
          )}' as *; @use '${path.resolve(
            __dirname,
            "src/styles/mixins",
          )}' as *;\n${content}`;
        },
      },
    },
  },
});
