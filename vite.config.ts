import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react(), tailwindcss()],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  // Add this section
  server: {
    proxy: {
      '/api': {
        // Your existing "npm run server" script runs on port 3000 by default if not specified
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});

