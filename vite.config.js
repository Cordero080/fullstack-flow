import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Allow SCSS files to use @use for variables and mixins
        api: "modern-compiler",
      },
    },
  },
});
