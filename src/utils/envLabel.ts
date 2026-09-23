const ENV_LABELS: Record<string, string> = {
  production: "Production",
  qa: "QA",
  development: "Development",
};

// Mismo fallback que usa vite.config.ts para el ícono de la PWA — si
// VITE_APP_ENV no está seteado o trae un valor desconocido, se asume prod.
export const getEnvLabel = (): string =>
  ENV_LABELS[import.meta.env.VITE_APP_ENV as string] ?? ENV_LABELS.production;
