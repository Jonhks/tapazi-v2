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
        name: "Portfolio Pool",
        short_name: "Portfolio Pool",
        description: "New App for Portfolios",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        icons: [
          // {
          //   src: "balones-negros.webp",
          //   sizes: "192x192",
          //   type: "image/webp",
          //   purpose: "maskable",
          // },
          // {
          //   src: "balones-negros.webp",
          //   sizes: "512x512",
          //   type: "image/webp",
          //   purpose: "maskable",
          // },
          // Ícono estándar para iOS y navegadores
          {
            src: "balones-negros.webp",
            sizes: "192x192",
            type: "image/webp",
            purpose: "any",
          },
          {
            src: "balones-negros.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any",
          },
          // Ícono maskable para Android (debe tener padding del 20%)
          {
            src: "balones-negros.webp",
            sizes: "192x192",
            type: "image/webp",
            purpose: "maskable",
          },
          {
            src: "balones-negros.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "maskable",
          },
          // Ícono para Apple Touch (recomendado en PNG)
          {
            src: "balones-negros.webp",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
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
