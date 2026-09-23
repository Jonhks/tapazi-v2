import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { execSync } from "child_process";
import fs from "node:fs";

import { version } from "./package.json";

const commitHash = (() => {
  try { return execSync("git rev-parse --short HEAD").toString().trim(); }
  catch { return "dev"; }
})();

// Release notes: agrupa el historial de commits por versión, usando los
// commits "chore(release): bump version to X" como límite entre grupos —
// esos commits marcan cuándo package.json pasó a decir esa versión, así que
// todo lo acumulado justo antes de uno de ellos es lo que trae esa versión.
// Se descartan del contenido (son ruido, no aportan nada) igual que los
// merges automáticos (pull request / remote-tracking branch). Si git log
// falla (ej. clone shallow sin historial) o no hay commits, queda un array
// vacío — la vista de Release Notes simplemente no muestra nada, no rompe.
type ReleaseGroup = { version: string; commits: { hash: string; subject: string }[] };

const releaseNotes: ReleaseGroup[] = (() => {
  const MAX_COMMITS_SCANNED = 300;
  const MAX_RELEASES_SHOWN = 20;
  const BUMP_PATTERN = /^chore\(release\): bump version to ([\d.]+)/;
  const NOISE_PATTERN = /^Merge (pull request|remote-tracking branch|branch)/i;

  try {
    const log = execSync(
      `git log --pretty=format:"%h%x01%s" -${MAX_COMMITS_SCANNED}`,
    ).toString();

    const releases: ReleaseGroup[] = [];
    let current: ReleaseGroup = { version, commits: [] };

    for (const line of log.split("\n")) {
      const [hash, subject] = line.split("\x01");
      if (!hash || !subject) continue;

      const bumpMatch = subject.match(BUMP_PATTERN);
      if (bumpMatch) {
        releases.push(current);
        current = { version: bumpMatch[1], commits: [] };
        continue;
      }

      if (NOISE_PATTERN.test(subject)) continue;

      current.commits.push({ hash, subject });
    }
    releases.push(current);

    // Grupos sin commits reales (dos bumps seguidos sin nada en medio) no
    // aportan nada a la vista — se descartan.
    return releases.filter((r) => r.commits.length > 0).slice(0, MAX_RELEASES_SHOWN);
  } catch {
    return [];
  }
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

  // TEMPORAL — diagnóstico de variables de entorno en el build de Vercel.
  // Esto corre en Node durante el build (llega a Build Logs), nunca al
  // navegador. Borrar en cuanto se confirme que VITE_SENTRY_DSN llega bien.
  const envTotalBytes = Object.entries(process.env).reduce(
    (sum, [k, v]) => sum + k.length + (v?.length ?? 0),
    0,
  );
  console.log(
    "[env-debug] mode:",
    mode,
    "| total process.env vars:",
    Object.keys(process.env).length,
    "| total bytes (aprox, límite Vercel 64KB):",
    envTotalBytes,
    "| SENTRY/VITE keys:",
    Object.keys(process.env).filter((k) => k.includes("SENTRY") || k.startsWith("VITE_")),
  );

  return {
  esbuild: {
    drop: command === "build" ? ["console", "debugger"] : [],
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(version),
    "import.meta.env.VITE_APP_COMMIT": JSON.stringify(commitHash),
    "import.meta.env.VITE_RELEASE_NOTES": JSON.stringify(releaseNotes),
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
    // Sube source maps a Sentry para ver stack traces legibles (no
    // minificados) y los borra del build antes de publicarlo, para no
    // dejarlos servidos públicamente en Vercel. Sin SENTRY_AUTH_TOKEN (dev
    // local, o un fork sin las credenciales) el plugin no hace nada — no
    // rompe el build. Debe ir al final del array de plugins.
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      disable: !process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ["**/*.js.map"],
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
    // necesario para que @sentry/vite-plugin tenga qué subir — se borran
    // del dist antes de publicar (ver sourcemaps.filesToDeleteAfterUpload)
    sourcemap: true,
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
