import { useState, useEffect, useCallback } from "react";

// cada cuánto se vuelve a preguntar por una versión nueva mientras la app
// sigue abierta (además del chequeo al volver de segundo plano).
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function useVersionCheck() {
  const [needUpdate, setNeedUpdate] = useState(false);
  const currentVersion = import.meta.env.VITE_APP_VERSION as string;

  const check = useCallback(async () => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const { version } = await res.json();
      if (version && version !== currentVersion) {
        setNeedUpdate(true);
      }
    } catch {
      // Network error — silently ignore
    }
  }, [currentVersion]);

  useEffect(() => {
    check();

    // sigue preguntando mientras la app queda abierta (típico en PWA
    // instalada, que se puede quedar horas en segundo plano sin cerrarse).
    const interval = setInterval(check, CHECK_INTERVAL_MS);

    // y también apenas vuelve a foreground — el caso más común en PWA es
    // mandarla a segundo plano y volver, no cerrarla y reabrirla.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [check]);

  // Nunca se aplica sola — solo prende el aviso; el usuario decide cuándo
  // recargar (botón "Reload" en PWABadge), por si está en medio de algo.
  return { needUpdate, dismiss: () => setNeedUpdate(false) };
}
