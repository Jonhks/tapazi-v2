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
        name: "Portfolio Pool App",
        short_name: "Portfolio Pool",
        description: "New App for Portfolios",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        icons: [
          {
            src: "tapasziLogoBlack.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "tapasziLogoBlack.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      registerType: "prompt",
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 7000000,
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
