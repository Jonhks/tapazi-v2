import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Portfolio App",
        short_name: "Portfolio",
        description: "New App for Portfolios",
        theme_color: "black",
        background_color: "black",
        icons: [
          {
            src: "tapasziLogoTrans.webp",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "tapasziLogoTrans.webp",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          // ui: ["@mui/material", "@mui/icons-material"],
        },
      },
    },
  },
});
