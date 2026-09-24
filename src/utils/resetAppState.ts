import { clearServiceWorkerAndCaches } from "./swCacheCleanup";

// A diferencia de clearServiceWorkerAndCaches (que se usa en el reload de
// "hay versión nueva" y NO debe desloguear a nadie), esto es un reset
// completo — pensado para el botón de "algo se rompió" en Login: borra
// también localStorage/sessionStorage/cookies, así que sí cierra la sesión.
//
// `redirectTo` (opcional): a dónde ir después de limpiar, en vez de recargar
// la misma URL — útil para dejar una marca en la URL (query param) que sí
// sobrevive, ya que localStorage/sessionStorage/cookies quedan borrados acá
// mismo arriba.
export async function resetAppState(redirectTo?: string): Promise<void> {
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
  if (redirectTo) {
    window.location.href = redirectTo;
  } else {
    window.location.reload();
  }
}
