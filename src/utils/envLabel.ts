// Solo dev muestra texto — el ícono instalado ya trae su propia letra
// (D/T/P) para qa/producción, así que el label ahí queda vacío a propósito
// (quien lo renderice debe ocultar el "— " completo cuando esto da "").
const ENV_LABELS: Record<string, string> = {
  production: "",
  qa: "",
  development: "dev",
};

// Mismo fallback que usa vite.config.ts para el ícono de la PWA — si
// VITE_APP_ENV no está seteado o trae un valor desconocido, se asume prod.
export const getEnvLabel = (): string =>
  ENV_LABELS[import.meta.env.VITE_APP_ENV as string] ?? ENV_LABELS.production;
