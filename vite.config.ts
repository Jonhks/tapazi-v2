import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { execSync } from "child_process";
import fs from "node:fs";

import { version } from "./package.json";

const commitHash = (() => {
  try { return execSync("git rev-parse --short HEAD").toString().trim(); }
  catch { return "dev"; }
})();

// El ícono de instalación de la PWA cambia por ambiente (dev/qa/prod) para
// poder distinguirlos a simple vista. `VITE_APP_ENV` se lee primero de
// process.env (así se puede fijar directo en el dashboard de Vercel por
// deploy, sin depender de qué archivo .env local exista) y si no, del
// .env.<mode> correspondiente.
const ICON_BY_ENV: Record<string, string> = {
  development: "icon-dev.png",
  qa: "icon-qa.png",
  production: "icon-prod.png",
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appEnv = process.env.VITE_APP_ENV || env.VITE_APP_ENV || "production";
  const pwaIcon = ICON_BY_ENV[appEnv] ?? ICON_BY_ENV.production;

  return {
  esbuild: {
    drop: command === "build" ? ["console", "debugger"] : [],
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(version),
    "import.meta.env.VITE_APP_COMMIT": JSON.stringify(commitHash),
  },
  plugins: [
    {
      name: "generate-version-json",
      buildStart() {
        fs.writeFileSync(
          fileURLToPath(new URL("./public/version.json", import.meta.url)),
          JSON.stringify({ version, commit: commitHash }),
        );
      },
    },
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
            src: pwaIcon,
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: pwaIcon,
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          // Ícono maskable para Android (debe tener padding del 20%)
          {
            src: pwaIcon,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: pwaIcon,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          // Ícono para Apple Touch
          {
            src: pwaIcon,
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
    alias: [
      // Aliases específicos primero — deben resolverse antes que "@" genérico
      { find: "@/epl",      replacement: fileURLToPath(new URL("./src/sports/epl",      import.meta.url)) },
      { find: "@/nfl",      replacement: fileURLToPath(new URL("./src/sports/nfl",      import.meta.url)) },
      { find: "@/ncaa-male",replacement: fileURLToPath(new URL("./src/sports/ncaa-male",import.meta.url)) },
      { find: "@/female",   replacement: fileURLToPath(new URL("./src/sports/female",   import.meta.url)) },
      { find: "@/worldcup", replacement: fileURLToPath(new URL("./src/sports/worldcup", import.meta.url)) },
      { find: "@/shared",   replacement: fileURLToPath(new URL("./src/shared",          import.meta.url)) },
      // Alias genérico al final
      { find: "@",          replacement: fileURLToPath(new URL("./src",                 import.meta.url)) },
    ],
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
  };
});
