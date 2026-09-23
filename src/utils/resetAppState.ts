import { clearServiceWorkerAndCaches } from "./swCacheCleanup";

// A diferencia de clearServiceWorkerAndCaches (que se usa en el reload de
// "hay versión nueva" y NO debe desloguear a nadie), esto es un reset
// completo — pensado para el botón de "algo se rompió" en Login: borra
// también localStorage/sessionStorage/cookies, así que sí cierra la sesión.
export async function resetAppState(): Promise<void> {
  await clearServiceWorkerAndCaches();
  try {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (!name) return;
      document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
    });
  } catch {
    /* ignore — igual recargamos abajo */
  }
  window.location.reload();
}
