import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - repo name
  base: "/fullstack-flow/",
  css: {
    preprocessorOptions: {
      scss: {
        // Allow SCSS files to use @use for variables and mixins
        api: "modern-compiler",
      },
    },
  },
  build: {
    // Generate source maps for debugging
    sourcemap: false,
    // Output directory
    outDir: "dist",
  },
});
