import * as Sentry from "@sentry/react";

/**
 * En development el DSN está presente pero apagado por default — se
 * prende/apaga con VITE_SENTRY_ENABLE_DEV (true/false) en .env.development,
 * sin tocar el DSN ni reiniciar nada más que el dev server. En qa/production
 * siempre está prendido si hay DSN.
 *
 * Nota: la config (dsn/environment/etc) se arma en un objeto aparte antes
 * de llamar a init — así, si algún día vuelve a faltar el DSN en el build,
 * es más fácil detectarlo inspeccionando el bundle en vez de que el
 * minificador elimine todo el bloque de una.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  const environment = import.meta.env.VITE_APP_ENV || "development";

  if (environment === "development" && import.meta.env.VITE_SENTRY_ENABLE_DEV !== "true") {
    return;
  }

  Sentry.init({
    dsn,
    environment,
    release: `tapazi-v2@${import.meta.env.VITE_APP_VERSION}+${import.meta.env.VITE_APP_COMMIT}`,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Plan gratuito: tracing muestreado + replay SOLO cuando hay un error
    // (mismo costo de cuota que un replay de sesión completa, pero se gasta
    // nada más en lo que realmente sirve para debuggear).
    tracesSampleRate: environment === "production" ? 0.2 : 0.5,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
  });
}

export { Sentry };
