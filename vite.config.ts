import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

import { version } from "./package.json";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  esbuild: {
    drop: command === "build" ? ["console", "debugger"] : [],
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(version),
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Portfolio Pool App",
        short_name: "Portfolio Pool",
        description: "Portfolio Pool + EPL Combined App",
        start_url: "/",
        scope: "/",
        id: "sports-pool-combined",
        lang: "en",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        icons: [
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
      "@/epl": fileURLToPath(new URL("./src/epl", import.meta.url)),
      "@/ncaa-male": fileURLToPath(new URL("./src/ncaa-male", import.meta.url)),
      "@/female": fileURLToPath(new URL("./src/female", import.meta.url)),
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
}));
